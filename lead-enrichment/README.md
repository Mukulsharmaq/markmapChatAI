# FIT Accounts — Email Enrichment Pipeline

Finds work emails for the 5,637 FIT accounts in the "Technical Founder US" export,
using the two unlimited lead finders (GetLeads + Blitz API), and produces the same
CSV with one added `Emails` column.

## Architecture

The Claude Code cloud sandbox has no direct internet egress, so all API calls are
relayed through the n8n instance (`n8n-ivv4.srv1701369.hstgr.cloud`):

```
CSV (5,637 rows)
  └─ chunked payloads (id|linkedin-slug)
       └─ n8n workflow "Email Enrichment - GetLeads + Blitz (Claude)"  [xPbhm6lXoxIDOwyE]
            Stage A: GetLeads POST /api/v1/enrich/from-linkedin   (batches of 100)
            Stage B: Blitz    POST /v2/enrichment/email           (misses only, ≤4 rps)
            Stage C: GetLeads POST /api/v1/enrich/from-person     (name+domain, misses only)
            └─ upsert → Supabase table public.fit_accounts_emails (checkpoint/resume)
  └─ merge_emails.py joins Supabase results back into the original CSV
```

## APIs

| Provider | Auth | Email finder endpoint | Limits |
|---|---|---|---|
| GetLeads (`app.getleads.io`) | `Authorization: Bearer glb_live_…` | `POST /api/v1/enrich/from-linkedin`, `POST /api/v1/enrich/from-person` (batch ≤100 items) | 100 req/min |
| Blitz (`api.blitz-api.ai`) | `x-api-key: blitz-…` | `POST /v2/enrichment/email` (`{person_linkedin_url}`) | 5 req/s per endpoint |

API keys are **not** stored in this repo. They live in:
- the Google Drive "Software" credentials doc (canonical),
- the n8n workflow's Code node (needed at runtime).

## Checkpoint table (Supabase project `ywzfevryjozcefpcznxq`)

```sql
create table public.fit_accounts_emails (
  id int primary key,          -- 1-based row number in the original CSV
  linkedin_url text not null,
  first_name text, last_name text, company_name text, domain text,
  email text, email_source text, -- getleads_linkedin | blitz | getleads_person
  status text,                  -- found | not_found | error
  updated_at timestamptz default now()
);
```

Rows with `status='found'` are skipped on re-runs, so any batch can be safely retried.
Row integrity is verified after each batch by comparing an md5 of the ordered
`id|slug` list computed in Postgres against the same hash of the local chunk file.

## Files

- `merge_emails.py` — joins the Supabase export back into the original CSV, adding the `Emails` column.
