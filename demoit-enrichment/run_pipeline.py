#!/usr/bin/env python3
"""
DemoIT cold-email enrichment pipeline (OpenRouter, cheap-model).

Two jobs per lead, done by a cheap OpenRouter model:
  1. QUALIFY  -> is the company a real software / SaaS / platform / app company?
  2. NORMALIZE (only meaningful for qualified rows):
        - first_name_normalized : clean given name for a cold email
        - company_normalized    : the bare brand name (no Inc/LLC/Software/tagline/domain)

Design notes
------------
* Standard library only (urllib) -> no pip install, works behind the egress proxy.
* Resumable: results are appended to a JSONL file; re-running skips ids already done.
* Concurrent: ThreadPoolExecutor with a configurable worker count.
* Robust: retries on 429/5xx/network, defensive JSON parsing, per-row error capture.
* Model is configurable via --model / OPENROUTER_MODEL so we can switch to whatever
  cheap model is actually available (poolside/laguna, gemini-flash, gpt-4o-mini, ...).

The script never talks to Supabase. Claude exports the rows into input JSON and
applies the results back to the table via the Supabase MCP (see RUNBOOK.md).
"""

import argparse
import json
import os
import re
import sys
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

DEFAULT_BASE = os.environ.get("OPENROUTER_BASE", "https://openrouter.ai/api/v1")
# Cheap + high-quality default. Override with --model / OPENROUTER_MODEL.
DEFAULT_MODEL = os.environ.get("OPENROUTER_MODEL", "google/gemini-2.0-flash-001")

SYSTEM_PROMPT = """\
You are a precise data-enrichment engine for a B2B cold-email pipeline. For each \
lead you get the person's raw first name and their company's name + description. \
Do two jobs and return STRICT JSON only.

JOB 1 - QUALIFY (is_saas):
Decide if the company is a real SOFTWARE / SaaS company whose CORE product is a \
digital product the customer uses or subscribes to: a software platform, SaaS \
web app, mobile app, API, or developer tool.
- is_saas=true when the company's PRIMARY offering is software the customer uses.
  Young, small, or pre-launch startups still qualify if a software product is \
  clearly the core of the business.
- is_saas=false for companies whose core is NOT a software product, even if they \
  use technology or say "platform"/"AI": services/agencies/consultancies, \
  marketing or dev shops, media / publishing / research / "industry intelligence", \
  e-commerce/retail brands, real-estate or investment firms/funds, hardware-only, \
  staffing/recruiting agencies (a recruiting SOFTWARE product is fine), banks, \
  clinics, non-profits, education institutions.
- Do NOT be extreme. If the company clearly ships a software product for customers, \
  qualify it. When genuinely on the fence, qualify only if a digital product is the \
  core, and set confidence="low".

JOB 2 - NORMALIZE (always fill; used only for qualified rows):
- first_name_normalized: the person's single GIVEN name, properly capitalized \
  ("JOHN"->"John", "john"->"John"). Keep legitimate casing/diacritics \
  (McKenzie, O'Brien, Jean-Pierre, Jose->Jose or José as given). Drop titles \
  (Dr., Mr.), honorifics, emojis, certifications (PhD, MBA), and anything that is \
  not the given name. If a nickname is given in quotes, use the nickname. If the \
  value is not a real personal name (e.g. "Info", "Team", "Sales", a company), \
  return "".
- company_normalized: the bare BRAND name, exactly as you'd say it in a sentence \
  ("I saw {brand} is ..."). Remove legal suffixes (Inc, Inc., LLC, L.L.C., Ltd, \
  Limited, GmbH, Corp, Corporation, Co, Company, PLC, S.A., B.V., Pvt Ltd, Private \
  Limited, LLP) and generic descriptors that are NOT part of the brand (Software, \
  Technologies, Technology, Solutions, Systems, Group, Holdings, Labs, Digital, \
  Media, Ventures, Global, Industries, International). Drop taglines/subtitles \
  after separators like | - -- : and drop URLs/domains ("acme.io" -> "Acme"). \
  Keep the brand's natural/known capitalization (HubSpot, GitHub, ProxyLink). \
  Never invent words; if unsure, return the cleaned original brand token.

Output JSON schema (return ONLY this object, no prose, no code fences):
{"is_saas": true|false, "confidence": "high"|"medium"|"low", \
"first_name_normalized": "string", "company_normalized": "string", \
"reason": "<=15 words"}"""

USER_TEMPLATE = """\
First name (raw): {first_name}
Company name (raw): {company_name}
Company description: {company_description}"""

_write_lock = threading.Lock()
_usage_lock = threading.Lock()
_usage = {"prompt_tokens": 0, "completion_tokens": 0}
_counter_lock = threading.Lock()
_counter = {"done": 0, "ok": 0, "err": 0}


def clip(s, n):
    if s is None:
        return ""
    s = str(s).strip()
    return s if len(s) <= n else s[:n] + " ..."


def build_messages(row, max_desc):
    user = USER_TEMPLATE.format(
        first_name=clip(row.get("first_name"), 120) or "(blank)",
        company_name=clip(row.get("company_name"), 200) or "(blank)",
        company_description=clip(row.get("company_description"), max_desc) or "(none provided)",
    )
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user},
    ]


def http_post_json(url, payload, headers, timeout):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_get_json(url, headers, timeout):
    req = urllib.request.Request(url, headers=headers, method="GET")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def extract_json_object(text):
    """Best-effort parse of a JSON object out of a model reply."""
    if not text:
        raise ValueError("empty content")
    t = text.strip()
    # strip code fences
    if t.startswith("```"):
        t = re.sub(r"^```[a-zA-Z]*\s*", "", t)
        t = re.sub(r"\s*```$", "", t).strip()
    try:
        return json.loads(t)
    except Exception:
        pass
    # find the first balanced { ... }
    start = t.find("{")
    if start == -1:
        raise ValueError("no JSON object in content")
    depth = 0
    for i in range(start, len(t)):
        if t[i] == "{":
            depth += 1
        elif t[i] == "}":
            depth -= 1
            if depth == 0:
                return json.loads(t[start:i + 1])
    raise ValueError("unbalanced JSON object in content")


def coerce_bool(v):
    if isinstance(v, bool):
        return v
    return str(v).strip().lower() in ("true", "yes", "1", "y", "t")


def coerce_conf(v):
    v = str(v).strip().lower()
    return v if v in ("high", "medium", "low") else "low"


def call_model(base, model, api_key, messages, timeout):
    url = base.rstrip("/") + "/chat/completions"
    headers = {
        "Authorization": "Bearer " + api_key,
        "Content-Type": "application/json",
        "X-Title": "DemoIT Enrichment",
    }
    payload = {
        "model": model,
        "temperature": 0,
        "max_tokens": 300,
        "response_format": {"type": "json_object"},
        "messages": messages,
    }
    resp = http_post_json(url, payload, headers, timeout)
    if "error" in resp and resp.get("error"):
        raise RuntimeError("api error: " + json.dumps(resp["error"])[:300])
    choices = resp.get("choices") or []
    if not choices:
        raise RuntimeError("no choices in response: " + json.dumps(resp)[:300])
    content = choices[0].get("message", {}).get("content", "")
    usage = resp.get("usage") or {}
    return content, usage


def classify_row(row, cfg):
    messages = build_messages(row, cfg["max_desc"])
    last_err = None
    for attempt in range(cfg["retries"] + 1):
        try:
            content, usage = call_model(
                cfg["base"], cfg["model"], cfg["api_key"], messages, cfg["timeout"]
            )
            with _usage_lock:
                _usage["prompt_tokens"] += int(usage.get("prompt_tokens", 0) or 0)
                _usage["completion_tokens"] += int(usage.get("completion_tokens", 0) or 0)
            obj = extract_json_object(content)
            return {
                "id": row.get("id"),
                "is_saas": coerce_bool(obj.get("is_saas", False)),
                "confidence": coerce_conf(obj.get("confidence", "low")),
                "first_name_normalized": (str(obj.get("first_name_normalized", "")).strip()),
                "company_normalized": (str(obj.get("company_normalized", "")).strip()),
                "reason": clip(obj.get("reason", ""), 160),
                "error": None,
            }
        except urllib.error.HTTPError as e:
            code = e.code
            body = ""
            try:
                body = e.read().decode("utf-8", "ignore")[:300]
            except Exception:
                pass
            last_err = f"HTTP {code}: {body}"
            # retry on rate limit / server errors, else stop
            if code in (408, 409, 429, 500, 502, 503, 504) and attempt < cfg["retries"]:
                time.sleep(min(2 ** attempt + 0.5, 20))
                continue
            if code in (401, 403):
                # auth/policy - no point retrying, surface loudly
                raise SystemExit(f"\nFATAL auth/policy error from OpenRouter: {last_err}\n"
                                 f"Check OPENROUTER_API_KEY and that openrouter.ai is allow-listed.\n")
            break
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            last_err = f"network: {e}"
            if attempt < cfg["retries"]:
                time.sleep(min(2 ** attempt + 0.5, 20))
                continue
            break
        except Exception as e:
            last_err = f"{type(e).__name__}: {e}"
            if attempt < cfg["retries"]:
                time.sleep(min(2 ** attempt + 0.5, 20))
                continue
            break
    # give up on this row - record error, do NOT qualify (safe default)
    return {
        "id": row.get("id"),
        "is_saas": False,
        "confidence": "low",
        "first_name_normalized": "",
        "company_normalized": "",
        "reason": "",
        "error": last_err or "unknown",
    }


def load_done_ids(path):
    done = set()
    if not os.path.exists(path):
        return done
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
                if obj.get("error") is None and obj.get("id") is not None:
                    done.add(str(obj["id"]))
            except Exception:
                continue
    return done


def write_result(path, obj):
    with _write_lock:
        with open(path, "a", encoding="utf-8") as f:
            f.write(json.dumps(obj, ensure_ascii=False) + "\n")
            f.flush()


def cmd_list_models(cfg):
    headers = {"Authorization": "Bearer " + cfg["api_key"]}
    data = http_get_json(cfg["base"].rstrip("/") + "/models", headers, cfg["timeout"])
    models = data.get("data", data if isinstance(data, list) else [])
    rows = []
    for m in models:
        mid = m.get("id", "")
        pr = (m.get("pricing") or {})
        try:
            pin = float(pr.get("prompt", "0") or 0)
            pout = float(pr.get("completion", "0") or 0)
        except Exception:
            pin, pout = 0.0, 0.0
        rows.append((pin, pout, mid))
    rows.sort(key=lambda r: (r[0], r[1]))
    kw = ("poolside", "laguna", "gemini", "flash", "mini", "haiku",
          "deepseek", "llama", "mistral", "qwen", "gpt-4o-mini", "nova")
    print("== Cheapest models (prompt $/Mtok, completion $/Mtok, id) ==")
    for pin, pout, mid in rows[:40]:
        print(f"  {pin*1e6:8.3f}  {pout*1e6:8.3f}  {mid}")
    print("\n== Keyword matches (poolside/laguna/gemini/flash/mini/...) ==")
    for pin, pout, mid in rows:
        low = mid.lower()
        if any(k in low for k in kw):
            print(f"  {pin*1e6:8.3f}  {pout*1e6:8.3f}  {mid}")


def sql_escape(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"


def cmd_emit_sql(results_path, out_path, table, id_col, batch):
    """Emit batched UPDATE statements from results.jsonl (qualified rows get
    normalized values; disqualified rows get is_saas=false and NULL normalized)."""
    rows = []
    seen = set()
    with open(results_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            obj = json.loads(line)
            rid = obj.get("id")
            if rid is None or str(rid) in seen:
                continue
            seen.add(str(rid))
            rows.append(obj)
    with open(out_path, "w", encoding="utf-8") as out:
        for i in range(0, len(rows), batch):
            chunk = rows[i:i + batch]
            values = []
            for o in chunk:
                is_saas = "true" if o.get("is_saas") else "false"
                if o.get("is_saas"):
                    fn = sql_escape(o.get("first_name_normalized") or None)
                    cn = sql_escape(o.get("company_normalized") or None)
                else:
                    fn, cn = "NULL", "NULL"
                conf = sql_escape(o.get("confidence"))
                reason = sql_escape(o.get("reason"))
                values.append(
                    f"({sql_escape(str(o.get('id')))}, {is_saas}, {conf}, {fn}, {cn}, {reason})"
                )
            vals = ",\n  ".join(values)
            stmt = (
                f'UPDATE "{table}" AS d SET\n'
                f'  is_saas = v.is_saas,\n'
                f'  qual_confidence = v.qual_confidence,\n'
                f'  first_name_normalized = v.first_name_normalized,\n'
                f'  company_normalized = v.company_normalized,\n'
                f'  qual_reason = v.qual_reason,\n'
                f'  enriched_at = now()\n'
                f'FROM (VALUES\n  {vals}\n) AS v(id, is_saas, qual_confidence, '
                f'first_name_normalized, company_normalized, qual_reason)\n'
                f'WHERE (d."{id_col}")::text = v.id;\n'
            )
            out.write(stmt)
    print(f"Wrote {out_path}: {len(rows)} rows in {((len(rows)+batch-1)//batch)} UPDATE statements")


SELFTEST_ROWS = [
    {"id": "t1", "first_name": "kyle", "company_name": "Indrasy",
     "company_description": "We built the only AI workforce management platform made for SMBs. Instantly deploy AI employees."},
    {"id": "t2", "first_name": "HEMA", "company_name": "TeckNexus",
     "company_description": "TeckNexus is an independent industry intelligence & media platform delivering news, editorial coverage and research across telecom."},
    {"id": "t3", "first_name": "Dr. Gabriel", "company_name": "Nubo, Inc.",
     "company_description": "Re-envisioning the way developers interact with cloud infrastructure for software deployment."},
    {"id": "t4", "first_name": "Mark", "company_name": "NXT Acquisitions Corp.",
     "company_description": "A real estate investment company that will provide a web platform for accredited investors to invest in real estate projects."},
    {"id": "t5", "first_name": "john", "company_name": "ProxyLink | secure AI-agent connections",
     "company_description": "We make it easy to do business with AI agents. ProxyLink is your secure connection between AI agents and enterprises."},
]


def main():
    ap = argparse.ArgumentParser(description="DemoIT OpenRouter enrichment pipeline")
    ap.add_argument("--input", help="input JSON file: array of {id, first_name, company_name, company_description}")
    ap.add_argument("--output", default="results.jsonl", help="output JSONL (append/resume)")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--base", default=DEFAULT_BASE)
    ap.add_argument("--concurrency", type=int, default=int(os.environ.get("CONCURRENCY", "24")))
    ap.add_argument("--retries", type=int, default=3)
    ap.add_argument("--timeout", type=int, default=90)
    ap.add_argument("--max-desc", type=int, default=1200, help="max chars of company description sent")
    ap.add_argument("--limit", type=int, default=0, help="process only first N pending rows (0 = all)")
    ap.add_argument("--list-models", action="store_true", help="print cheap model candidates and exit")
    ap.add_argument("--self-test", action="store_true", help="run on 5 built-in sample rows and print results")
    ap.add_argument("--emit-sql", metavar="OUT.sql", help="build UPDATE statements from --output results and exit")
    ap.add_argument("--table", default="Demo IT")
    ap.add_argument("--id-column", default="AI Ark People ID")
    ap.add_argument("--sql-batch", type=int, default=500)
    args = ap.parse_args()

    api_key = os.environ.get("OPENROUTER_API_KEY", "").strip()

    cfg = {
        "base": args.base, "model": args.model, "api_key": api_key,
        "retries": args.retries, "timeout": args.timeout, "max_desc": args.max_desc,
    }

    if args.emit_sql:
        cmd_emit_sql(args.output, args.emit_sql, args.table, args.id_column, args.sql_batch)
        return

    if not api_key:
        sys.exit("ERROR: OPENROUTER_API_KEY is not set in the environment.")

    if args.list_models:
        cmd_list_models(cfg)
        return

    if args.self_test:
        print(f"Self-test with model={args.model}\n")
        for r in SELFTEST_ROWS:
            res = classify_row(r, cfg)
            print(json.dumps(res, ensure_ascii=False))
        print("\nUsage:", _usage)
        return

    if not args.input:
        sys.exit("ERROR: --input is required (or use --self-test / --list-models / --emit-sql).")

    with open(args.input, "r", encoding="utf-8") as f:
        rows = json.load(f)
    if not isinstance(rows, list):
        sys.exit("ERROR: input must be a JSON array of row objects.")

    done = load_done_ids(args.output)
    pending = [r for r in rows if str(r.get("id")) not in done]
    if args.limit and args.limit > 0:
        pending = pending[:args.limit]

    total = len(pending)
    print(f"Model={args.model} | input={len(rows)} | already done={len(done)} | "
          f"pending={total} | concurrency={args.concurrency}")
    if total == 0:
        print("Nothing to do.")
        return

    t0 = time.time()
    with ThreadPoolExecutor(max_workers=args.concurrency) as ex:
        futs = {ex.submit(classify_row, r, cfg): r for r in pending}
        for fut in as_completed(futs):
            res = fut.result()
            write_result(args.output, res)
            with _counter_lock:
                _counter["done"] += 1
                if res.get("error"):
                    _counter["err"] += 1
                else:
                    _counter["ok"] += 1
                d = _counter["done"]
            if d % 100 == 0 or d == total:
                rate = d / max(time.time() - t0, 1e-6)
                eta = (total - d) / max(rate, 1e-6)
                print(f"  {d}/{total}  ok={_counter['ok']} err={_counter['err']}  "
                      f"{rate:.1f}/s  eta={eta:5.0f}s  "
                      f"tok(in/out)={_usage['prompt_tokens']}/{_usage['completion_tokens']}",
                      flush=True)

    dt = time.time() - t0
    print(f"\nDone in {dt:.0f}s. ok={_counter['ok']} err={_counter['err']} "
          f"total_written_this_run={_counter['done']}")
    print(f"Tokens: prompt={_usage['prompt_tokens']} completion={_usage['completion_tokens']}")
    if _counter["err"]:
        print("NOTE: some rows errored. Re-run the same command to retry ONLY the "
              "errored/pending rows (successful rows are skipped).")


if __name__ == "__main__":
    main()
