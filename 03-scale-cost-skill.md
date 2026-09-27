# Scale, Cost & Skill Analysis

## I. The Production Workflow (Scaling from 26 to 9,100+ Records)

### Phase 1: Free Local Checks (Rules 1–5)
1. Load raw leads CSV
2. Apply rules: Email present → Employee count 250-10k → Segment valid → Suppression check → Not generic inbox
3. Save: `phase1_results.csv` with pass/fail reasons
4. Update checkpoint: `processing_state.json`

**Cost:** $0

### Phase 2: Deduplication + Remaining Free Checks (Rules 6–9)
1. Load phase 1 passed rows
2. Check against `master_dedup.json` (tracks every email/LinkedIn/name+company ever seen)
3. Apply rules: Deduplication → Corporate email → Email/domain match → ICP title match
4. Save: `phase2_results.csv` with pass/fail reasons
5. Update: `master_dedup.json` with all new leads seen
6. Update checkpoint: `processing_state.json`

**Cost:** $0

### Phase 3: Reconciliation & Ready for Verification
1. Verify: send_ready + excluded = total_input (100% reconciliation required)
2. Generate exclusion report by reason
3. All rows now account for in either send-ready or excluded
4. Next step (email re-verification) happens only when ready to send

**Cost:** $0

### Resuming After Failure
- Load `processing_state.json` to identify last completed step
- Load corresponding output file and `master_dedup.json`
- Continue from next unprocessed row
- No reprocessing, no double payment

---

## II. Email Verification Pricing (When Ready to Send)

### MillionVerifier
- **Rate:** $0.0039 per verification
- **Pack:** $39 for 10,000 credits
- **Model:** Pay-as-you-go
- **For 9,100 records:** $39 actual spend (900 credits unused)

### ZeroBounce (Pay-as-You-Go)
- **Rate:** $0.0129 per verification
- **Pack:** $129 for 10,000 credits
- **Model:** Pay-as-you-go
- **For 9,100 records:** $129 actual spend (900 credits unused)

### ZeroBounce (Subscription)
- **Rate:** $99/month for 10,000 verifications
- **Model:** Monthly recurring
- **For one-time:** $99

**Winner for one-time use:** MillionVerifier at $39

---

## III. Existing Inventory Analysis

### Current Records in Segment Table
- **Total:** 9,100
- **Already contacted:** 6,027
- **Not yet contacted:** 3,073
  - Previously verified: 2,430
  - Previously unverified: 643

### What "Verified" Means
Records marked verified in the old system are NOT ready to send. They still need to:
1. Pass the free gate (rules 1–9) — $0
2. Pass suppression check — $0
3. Get email re-verified — $39 (if you use MillionVerifier for survivors)

### Outbound Velocity & Timeline
- **Historical rate:** 6,027 contacted ÷ 90 days = 2,009/month
- **Unused inventory timeline:**
  - 2,430 verified-but-uncontacted = 1.21 months at historical velocity
  - 3,073 total-uncontacted = 1.53 months at historical velocity
  - *Assumes records survive free gate + re-verification*

### Cost to Re-Verify All 3,073
- 3,073 × $0.0039 = $11.98
- Actual spend: $39 (buy 10,000 credit pack)
- Leftover: 6,927 credits (~$27 value for future use)

---

## IV. Should You Buy 20,000 New Records Yet?

### No.

**Reason:**
- You have 1.5 months of existing inventory that needs processing (free gate + $39 re-verification)
- You don't know survival rate until you run the gate
- Buying before using existing data wastes budget and creates 11+ months of inventory to manage

**Timeline instead:**
1. Gate the 3,073 you have (free, 2–3 days)
2. Re-verify survivors ($39)
3. Send through that batch (1.5 months of capacity)
4. Monitor results
5. Then decide on 20k based on actual performance data

**For the board meeting in 3 weeks:**
- Run the gate this week
- Have clean data, actual survival rate, and send-ready count by end of week
- Send through existing inventory starting Monday
- That's real progress to report, not a speculative spend

---

## V. Critical Mistakes (Do Not Repeat)

1. **Do not assume title is checked before suppression.** Suppression (rule 4) runs early. A suppressed company exits regardless of title.
2. **Do not assume columns exist.** Verify CSV headers against rule set before running gate.
3. **Do not trust row counts without verification.** CSV line count ≠ database export count ≠ actual data rows.
4. **Do not mix enrichment into verification.** Email verification (valid/invalid) is separate from enrichment (job title, company size). They cost differently.
5. **Do not reprocess rows already in the output.** Use checkpoint file and master dedup ledger to skip seen leads.
6. **Do not assume "verified" means "ready to send."** Old verification is outdated. Re-verify before outbound.
7. **Do not skip suppression for any reason.** A suppressed company is suppressed, period.

---

## VI. Files Required for Execution

**Input:**
- `leads_raw.csv` – Raw lead list (verify columns: first_name, last_name, email, company_domain, title, employees, segment, linkedin_url)
- `master_dedup.json` – Deduplication ledger (empty if first run; persists across all runs)
- `processing_state.json` – Checkpoint from previous run (if resuming; empty if starting fresh)

**Output:**
- `phase1_results.csv` – After rules 1–5 (all rows with pass/fail reason)
- `phase2_results.csv` – After rules 6–9 (send-ready + excluded)
- `master_dedup.json` – Updated ledger (for next run)
- `processing_state.json` – Updated checkpoint
- Exclusion report – Breakdown by reason with reconciliation proof

---

## VII. The 9 Rules (Execution Order)

| Rule | Check | Pass Condition | Exclusion Reason |
|------|-------|---|---|
| 1 | Email exists | Not blank | No email |
| 2 | Employee count | 250–10,000 | Outside range |
| 3 | Segment valid | One of 4 types | Invalid segment |
| 4 | Not suppressed | Domain not in suppression list | Company domain suppressed |
| 5 | Not generic inbox | Has name + title not generic | Generic inbox / no name |
| 6 | No duplicate | Not in master_dedup.json | Duplicate (by LinkedIn/email/name+company) |
| 7 | Corporate email | Not personal domain | Personal email domain |
| 8 | Email/domain match | Exact match | Email/domain mismatch |
| 9 | ICP title | One of 6 approved titles | Title not ICP buyer persona |

---

## VIII. What Happens Before Any Money Is Spent

Run the free gate (rules 1–9) on all records. This is deterministic, auditable, and costs nothing. You'll know:
- How many records survive all 9 rules
- Exactly why each record was excluded
- True send-ready count

Only after you know the survivor count do you decide whether to re-verify, enrich, or buy new. That's when you spend.

---

## IX. Next Steps (By Monday)

**With suppression data (customer list, open-deal list, partner list, reseller list):**
1. Thursday: Run free gate on 3,073 unused records
2. Friday: Calculate survivor count, generate exclusion report
3. Monday: You have send-ready inventory, survival rate, and $39 re-verification plan

**Without suppression data:**
Waiting. Cannot run gate safely until suppression lists are available.
