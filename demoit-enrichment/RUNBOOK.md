# DemoIT enrichment — runbook

Qualify every lead in the Supabase **`Demo IT`** table (~6,580 rows) as a real
software/SaaS company, then normalize the **first name** and **company name**
of the qualified ones — for cold email. The per-row classification/normalization
is done by a **cheap OpenRouter model** (the user's requirement), driven by
`run_pipeline.py`.

Supabase project: **Mukulsharmaq's Project** — `project_id = ywzfevryjozcefpcznxq`
Table: `public."Demo IT"` · person key: `"AI Ark People ID"` (UUID per person).

## Why this design
- OpenRouter is **blocked by the default egress policy**. It must be allow-listed
  on the environment (Custom network access → add `openrouter.ai`, `*.openrouter.ai`).
  That takes effect only in a **new session**.
- The script talks **only to OpenRouter** (stdlib, no pip, resumable, concurrent).
  It never touches Supabase — **Claude** does DB reads/writes via the Supabase MCP,
  because writing needs privileges the anon key doesn't have (RLS is on).

## Prerequisites (user, one-time)
1. Environment → **Network access = Custom**, Allowed domains include
   `openrouter.ai` and `*.openrouter.ai`; keep "include default package managers".
2. Set env var / secret **`OPENROUTER_API_KEY`** (so it's never in chat or git).
3. Start a **new session on branch `claude/demoit-table-check-goggnm`**.

---

## Steps (run in the fresh session)

All commands run from `demoit-enrichment/`. Work in the scratchpad for data files:
```bash
cd demoit-enrichment
export WORK="$SCRATCH"   # or any writable dir; keep input/results OUT of git
```

### 0. Confirm connectivity + pick the model
```bash
python3 run_pipeline.py --list-models | head -60
python3 run_pipeline.py --self-test            # 5 built-in rows, sanity-check quality
```
Pick the model with `--model` / `OPENROUTER_MODEL`. Order of preference:
poolside/laguna if listed and cheap → `google/gemini-2.0-flash-001` (default) →
`openai/gpt-4o-mini`. Expected on the 5 self-test rows: `t1` Indrasy=**SaaS**,
`t3` Nubo=**SaaS** (name→"Nubo", "Dr. Gabriel"→"Gabriel"), `t5` ProxyLink=**SaaS**
(company→"ProxyLink"); `t2` TeckNexus=**not SaaS** (media/intelligence),
`t4` NXT Acquisitions=**not SaaS** (real-estate investment).

### 1. Export rows from Supabase → `input_rows.json`  *(Claude, via MCP)*
Export in pages of ~1500 and concatenate into a JSON array of
`{id, first_name, company_name, company_description}`:
```sql
select
  "AI Ark People ID"  as id,
  "First Name"        as first_name,
  "Company Name"      as company_name,
  "Company Description" as company_description
from "Demo IT"
order by "AI Ark People ID"
limit 1500 offset 0;   -- then 1500, 3000, 4500, 6000
```
First verify the key is safe to update on:
```sql
select count(*) total,
       count(distinct "AI Ark People ID") distinct_ids,
       count(*) filter (where "AI Ark People ID" is null) null_ids
from "Demo IT";
```
If `distinct_ids < total` or `null_ids > 0`, add a surrogate key instead
(e.g. `alter table "Demo IT" add column enrich_id bigserial;`) and export/update on that.

### 2. Quick quality gate (25 rows)
```bash
python3 run_pipeline.py --input input_rows.json --output results.jsonl --limit 25 \
  --model google/gemini-2.0-flash-001
```
Eyeball `results.jsonl`. If the qualification calls or brand cleanups look off,
tune `SYSTEM_PROMPT` in `run_pipeline.py` and re-run (delete results.jsonl to redo).

### 3. Full run (all pending rows; resumable)
```bash
python3 run_pipeline.py --input input_rows.json --output results.jsonl \
  --model google/gemini-2.0-flash-001 --concurrency 24
```
Re-run the exact same command to retry any errored/pending rows — completed rows
are skipped. Keep going until `err=0` (or errors are understood).

### 4. Add output columns  *(Claude, via MCP `apply_migration`)*
```sql
alter table "Demo IT"
  add column if not exists is_saas boolean,
  add column if not exists qual_confidence text,
  add column if not exists first_name_normalized text,
  add column if not exists company_normalized text,
  add column if not exists qual_reason text,
  add column if not exists enriched_at timestamptz;
```

### 5. Write results back  *(Claude, via MCP `execute_sql`)*
Build batched UPDATEs from the results and apply them in chunks:
```bash
python3 run_pipeline.py --emit-sql updates.sql --output results.jsonl \
  --table "Demo IT" --id-column "AI Ark People ID" --sql-batch 500
```
Then Claude reads `updates.sql` and runs each `UPDATE ... FROM (VALUES ...)`
statement via `execute_sql`. Disqualified rows get `is_saas=false` and NULL
normalized fields; qualified rows get the cleaned name + brand.

### 6. Verify + report
```sql
select
  count(*)                                            total,
  count(*) filter (where is_saas)                     qualified,
  count(*) filter (where is_saas is false)            disqualified,
  count(*) filter (where is_saas is null)             unprocessed,
  count(*) filter (where is_saas and (first_name_normalized = '' or first_name_normalized is null)) qualified_no_firstname
from "Demo IT";
```
Spot-check ~20 qualified and ~20 disqualified rows against name/description, then
report counts, the model used, token totals, and any rows needing a human look.

## Notes / tuning
- Qualification rule ("digital product is the core; not extreme") lives in
  `SYSTEM_PROMPT`. That's the one place to adjust strictness.
- Cost is tiny on Gemini Flash (~<$1 for 6.5k rows). If poolside/laguna is
  available and comparable, switch with `--model`.
- Nothing here commits secrets or lead data — see `.gitignore`.
