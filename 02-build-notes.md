# Lead Gating Gate: Build Notes

## Objective

Create a deterministic lead qualification gate that screens incoming leads against Verrick's ICP and applies rigorous data quality checks before sending outbound email.

**Output:** 11 qualified leads from 26-row sample (42% pass rate)

## Process

### 1. ICP Definition (From Brief)

**Buyer Personas:**
- VP Operations
- Director of Distribution
- IT Director
- Head of Warehouse Systems

**Company Criteria:**
- 250–10,000 employees (mid-market focused)
- Segments: 3PL (mid-market), distributor, cold-chain (operate warehouses/logistics infrastructure)
- North America

**Pricing Context:** $4k-9k/month per site

### 2. Rule Hierarchy Design

Established 9 rules in strict order (hard disqualifications run before subjective judgment):

**Hard Rules (Deterministic Exclusions):**
1. Email is present (cannot send without it)
2. Employee count 250–10,000 (hard ICP boundary)
3. Segment is logistics-adjacent (mid_3pl, distributor, cold_chain, enterprise_3pl)
4. Company domain not in suppression list (ridgeline3pl.com, norvind.com, bellwether-scm.com)
5. Not a generic inbox (must have person name; title must not be "Warehouse Inbox," "General Enquiries," etc.)
6. Deduplication (LinkedIn URL > normalized email > name+company by first occurrence)
7. Email is corporate domain (reject personal: gmail, yahoo, outlook, hotmail, aol, etc.)
8. Email/domain match (email domain must match company domain; no mismatch without parent evidence)

**Subjective Rule (Requires Judgment):**
9. Title matches ICP buyer persona
   - **Accept:** VP Operations, VP of Operations, Director of Distribution, IT Director, Head of Warehouse Systems, **Director of Operations** (functional equivalent)
   - **Reject:** VP Supply Chain (adjacent, not direct), COO (too broad), Head of Fulfillment (not equivalent to Head of Warehouse Systems)

### 3. Implementation

Built deterministic Python script (`lead_gating.py`, 306 lines):
- No external dependencies (stdlib only)
- No randomization
- Processes rows in order
- Tracks every exclusion with primary reason
- Outputs CSV with all original columns
- Generates QA report with full reconciliation

**Key Design Decisions:**
- Deduplication by identity priority: LinkedIn first (most reliable), then email (normalized), then name+company (fallback)
- Personal email domains include comprehensive list (Gmail, Yahoo, Outlook, Hotmail, AOL, ProtonMail, Mail.com, GMX, iCloud, Me.com)
- Title normalization: case-insensitive, whitespace-stripped
- Segment acceptance: enterprise_3pl allowed (within 250-10k employee range, still a 3PL buyer)
- Rule ordering: suppression happens before title judgment (don't waste cycles on suppressed rows)

### 4. Data Quality Handling

**Input:** 26-row sample from 3 sources (ZoomInfo, Apollo, scraped)

**Issues Found & Resolved:**
- Duplicate person (Row 2, Dana Whitfield): Same LinkedIn URL as Row 1, different source—kept first, excluded duplicate
- Generic inboxes (Rows 4, 12): Missing first/last names, titles like "Warehouse Inbox"—excluded
- Email/domain mismatch (Row 10, Alan Frisk): keeleylogistics.com ≠ sundstrand-dist.com—excluded without parent evidence
- Personal email (Row 9, Karen Ostrowski): gmail.com—excluded
- Suppression (Rows 8, 13, 14): ridgeline3pl.com, norvind.com—excluded

### 5. Verification

**Manual verification of all 26 rows:**
- ✓ All 11 send-ready rows pass all 9 rules
- ✓ All 15 excluded rows have correct primary reason
- ✓ No row counted twice
- ✓ No row unaccounted for
- ✓ Script output deterministic (identical across runs)

**QA Report:**
- Send-ready: 11 rows
- Excluded: 15 rows (with counts by reason)
- Reconciliation: 11 + 15 = 26 ✓

## Files

- `code/lead_gating.py` — The script
- `send_ready.csv` — Qualified leads (11 rows)
- `qa_report.txt` — Summary of counts and reconciliation
- `VERIFICATION_REPORT.txt` — Manual row-by-row verification

## Known Limitations

**Geography validation:** CSV has no country/state field. Cannot verify "North America" constraint.

**Suppression:** Uses hardcoded list (ridgeline3pl.com, norvind.com, bellwether-scm.com). Real deployment would need:
- Customer list (from Verrick CRM)
- Open-deal list (in-flight opportunities)
- Reseller/partner list (channel relationships)
- Current suppression runs against empty file

## Next Steps for Production

1. Wire in real suppression data (customer list, deals, resellers)
2. Add geography validation (country/state field or domain-based inference)
3. Iterate title list based on campaign feedback
4. Monitor false negatives (qualified leads being rejected)
5. Track conversion metrics by gate decision (who passed, who converted)
