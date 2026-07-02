#!/usr/bin/env bash
#
# pull-magnific-assets.sh — download the boardroom render + character cutouts
# from Magnific into public/assets/.
#
# Magnific serves assets from pikaso.cdnpk.net. In some environments (e.g.
# Claude Code on the web with a restrictive egress policy) that host is BLOCKED
# with a 403 at the proxy — this script will then fail fast and tell you. Run it
# in a session/machine where pikaso.cdnpk.net is allowed.
#
# Usage:
#   1) Paste the fresh signed `url` for each asset into scripts/magnific-assets.json
#      (get them from Magnific's creations_get — the `url` field).
#   2) bash scripts/pull-magnific-assets.sh
#
# Requires: bash, curl, and either jq (preferred) or python3 for JSON parsing.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="$ROOT/scripts/magnific-assets.json"

if [[ ! -f "$MANIFEST" ]]; then
  echo "✗ manifest not found: $MANIFEST" >&2
  exit 1
fi

# Emit "name<TAB>dest<TAB>url" rows from the manifest.
read_rows() {
  if command -v jq >/dev/null 2>&1; then
    jq -r '.assets[] | [.name, .dest, .url] | @tsv' "$MANIFEST"
  elif command -v python3 >/dev/null 2>&1; then
    python3 - "$MANIFEST" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
for a in d["assets"]:
    print("\t".join([a.get("name",""), a.get("dest",""), a.get("url","")]))
PY
  else
    echo "✗ need jq or python3 to parse the manifest" >&2
    exit 1
  fi
}

fail=0
ok=0
skipped=0

while IFS=$'\t' read -r name dest url; do
  [[ -z "$name" ]] && continue
  if [[ -z "$url" ]]; then
    echo "• $name — no url in manifest yet, skipping"
    skipped=$((skipped+1))
    continue
  fi
  out="$ROOT/$dest"
  mkdir -p "$(dirname "$out")"
  echo "↓ $name → $dest"
  # Retry with backoff for transient network errors (NOT for 403 policy denials).
  attempt=0
  until [[ $attempt -ge 4 ]]; do
    code=$(curl -sS -w '%{http_code}' -o "$out.part" "$url" || echo "000")
    if [[ "$code" == "200" ]]; then
      mv "$out.part" "$out"
      echo "  ✓ $(du -h "$out" | cut -f1)"
      ok=$((ok+1))
      break
    fi
    rm -f "$out.part"
    if [[ "$code" == "403" || "$code" == "407" ]]; then
      echo "  ✗ $code — host blocked by egress policy (pikaso.cdnpk.net). Run where it's allowed." >&2
      fail=$((fail+1))
      break
    fi
    attempt=$((attempt+1))
    wait=$((2 ** attempt))
    echo "  … http $code, retry $attempt/4 in ${wait}s"
    sleep "$wait"
  done
  if [[ ! -f "$out" && -z "${_broke:-}" ]]; then
    if [[ $attempt -ge 4 ]]; then
      echo "  ✗ gave up on $name after 4 attempts" >&2
      fail=$((fail+1))
    fi
  fi
done < <(read_rows)

echo ""
echo "done: $ok downloaded, $skipped skipped (no url), $fail failed"
[[ $fail -eq 0 ]]
