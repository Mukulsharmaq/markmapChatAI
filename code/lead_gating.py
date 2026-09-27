#!/usr/bin/env python3
"""
Lead Gating Script: Applies deterministic rules to qualify leads for outbound.

Rules applied in order:
1. Email is present
2. Employee count 250-10,000
3. Segment is logistics-adjacent
4. Suppression check (company domain)
5. Not a generic inbox (has person name, title is not generic)
6. Deduplication (by LinkedIn URL > Email > Name+Company)
7. Email is corporate (not personal domain)
8. Email/domain match (email domain matches company domain)
9. Title matches ICP buyer persona
"""

import csv
import re
import sys
from collections import defaultdict


def normalize_linkedin(url):
    """Extract and normalize LinkedIn URL to username."""
    if not url or url.strip() == '':
        return None
    match = re.search(r'linkedin\.com/in/([a-z0-9-]+)', url.lower())
    if match:
        return match.group(1)
    return None


def normalize_email(email):
    """Normalize email for comparison."""
    if not email or email.strip() == '':
        return None
    return email.lower().strip()


def normalize_name_company(first_name, last_name, company_domain):
    """Normalize name+company tuple for comparison."""
    fn = (first_name or '').strip().lower()
    ln = (last_name or '').strip().lower()
    cd = (company_domain or '').strip().lower()
    if fn or ln or cd:
        return (fn, ln, cd)
    return None


def get_identity_key(row):
    """
    Determine identity key for deduplication.
    Priority: LinkedIn URL > Email > Name+Company
    Returns tuple (key_type, key_value) or None.
    """
    linkedin = normalize_linkedin(row.get('linkedin_url', ''))
    if linkedin:
        return ('linkedin', linkedin)

    email = normalize_email(row.get('email', ''))
    if email:
        return ('email', email)

    name_company = normalize_name_company(
        row.get('first_name', ''),
        row.get('last_name', ''),
        row.get('company_domain', '')
    )
    if name_company:
        return ('name_company', name_company)

    return None


def is_personal_email(email):
    """Check if email is a personal email domain."""
    personal_domains = {
        'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
        'yahoo.co.uk', 'aol.com', 'protonmail.com', 'mail.com',
        'gmx.com', 'icloud.com', 'me.com'
    }
    if not email or email.strip() == '':
        return False
    domain = email.lower().strip().split('@')[-1]
    return domain in personal_domains


def is_generic_title(title):
    """Check if title is a generic inbox label."""
    if not title:
        return False
    generic_titles = {'warehouse inbox', 'general enquiries', 'info'}
    return title.lower().strip() in generic_titles


def is_acceptable_title(title):
    """Check if title matches ICP buyer personas or acceptable variants."""
    if not title:
        return False

    acceptable = {
        'vp operations',
        'vp of operations',
        'director of distribution',
        'it director',
        'head of warehouse systems',
        'director of operations'
    }

    normalized_title = title.lower().strip()
    return normalized_title in acceptable


def get_suppression_list():
    """Return the suppression list of company domains."""
    return {'ridgeline3pl.com', 'norvind.com', 'bellwether-scm.com'}


def apply_rules(rows):
    """
    Apply all rules to rows and return (send_ready, exclusions, stats).

    Returns:
    - send_ready: list of dicts with rows to send
    - exclusions: list of (row_number, row_dict, reason) tuples
    - stats: dict with counts by exclusion reason
    """
    send_ready = []
    exclusions = []
    stats = defaultdict(int)

    seen_identities = set()
    suppression = get_suppression_list()

    for row_num, row in enumerate(rows, start=2):  # Start at 2 (skip header conceptually)
        reason = None

        # Rule 1: Email is present
        email = row.get('email', '').strip()
        if not email:
            reason = 'No email'
            stats[reason] += 1
            exclusions.append((row_num, row, reason))
            continue

        # Rule 2: Employee count 250-10,000
        try:
            employees = int(row.get('employees', 0))
        except (ValueError, TypeError):
            employees = 0

        if employees < 250 or employees > 10000:
            reason = f'Employee count outside 250-10,000 range ({employees})'
            stats[reason] += 1
            exclusions.append((row_num, row, reason))
            continue

        # Rule 3: Segment is logistics-adjacent
        segment = row.get('segment', '').strip()
        valid_segments = {'mid_3pl', 'distributor', 'cold_chain', 'enterprise_3pl'}
        if segment not in valid_segments:
            reason = f'Invalid segment ({segment})'
            stats[reason] += 1
            exclusions.append((row_num, row, reason))
            continue

        # Rule 4: Suppression check
        company_domain = row.get('company_domain', '').strip().lower()
        if company_domain in suppression:
            reason = f'Company domain suppressed ({company_domain})'
            stats[reason] += 1
            exclusions.append((row_num, row, reason))
            continue

        # Rule 5: Not a generic inbox
        first_name = row.get('first_name', '').strip()
        last_name = row.get('last_name', '').strip()
        title = row.get('title', '').strip()

        has_person = first_name or last_name
        if not has_person:
            reason = 'Generic inbox (no person name)'
            stats[reason] += 1
            exclusions.append((row_num, row, reason))
            continue

        if is_generic_title(title):
            reason = f'Generic inbox title ({title})'
            stats[reason] += 1
            exclusions.append((row_num, row, reason))
            continue

        # Rule 6: Deduplication
        identity_key = get_identity_key(row)
        if identity_key:
            if identity_key in seen_identities:
                reason = 'Duplicate (same person by LinkedIn/email/name+company)'
                stats[reason] += 1
                exclusions.append((row_num, row, reason))
                continue
            seen_identities.add(identity_key)

        # Rule 7: Email is corporate domain
        if is_personal_email(email):
            reason = 'Personal email domain'
            stats[reason] += 1
            exclusions.append((row_num, row, reason))
            continue

        # Rule 8: Email/domain match
        email_domain = email.lower().split('@')[-1]
        if email_domain != company_domain:
            reason = f'Email/domain mismatch ({email_domain} ≠ {company_domain})'
            stats[reason] += 1
            exclusions.append((row_num, row, reason))
            continue

        # Rule 9: Title matches ICP
        if not is_acceptable_title(title):
            reason = f'Title not ICP buyer persona ({title})'
            stats[reason] += 1
            exclusions.append((row_num, row, reason))
            continue

        # All rules passed
        send_ready.append(row)

    return send_ready, exclusions, stats


def main():
    input_file = 'leads_raw.csv'
    output_file = 'send_ready.csv'

    # Read input
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
    except FileNotFoundError:
        print(f"Error: {input_file} not found")
        sys.exit(1)

    if not rows:
        print(f"Error: {input_file} is empty")
        sys.exit(1)

    total_input = len(rows)

    # Apply rules
    send_ready, exclusions, stats = apply_rules(rows)

    # Write output
    if rows:  # Use original rows to get fieldnames
        fieldnames = list(rows[0].keys())
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(send_ready)

    # Print QA Report
    print("\n" + "="*75)
    print("LEAD GATING QA REPORT")
    print("="*75)
    print(f"\nInput file: {input_file}")
    print(f"Output file: {output_file}")
    print(f"\n{'Total input rows:':<40} {total_input}")
    print(f"{'Send-ready rows:':<40} {len(send_ready)}")

    print(f"\n{'Exclusion Breakdown:':<40}")
    print("-" * 75)

    # Sort exclusion reasons for consistent output
    if stats:
        for reason in sorted(stats.keys()):
            count = stats[reason]
            print(f"  {reason:<50} {count:>5}")

    total_excluded = sum(stats.values())
    print("-" * 75)
    print(f"  {'Total excluded:':<50} {total_excluded:>5}")

    # Reconciliation
    reconciliation = len(send_ready) + total_excluded

    print(f"\n{'Reconciliation:':<40}")
    print(f"  Send-ready ({len(send_ready)}) + Excluded ({total_excluded}) = {reconciliation}")
    print(f"  Expected total: {total_input}")

    if reconciliation == total_input:
        print(f"  ✓ RECONCILIATION OK")
    else:
        print(f"  ✗ RECONCILIATION FAILED")
        print(f"    Mismatch: {total_input - reconciliation} rows unaccounted for")
        sys.exit(1)

    print("\n" + "="*75)
    print("VALIDATION NOTES")
    print("="*75)
    print("✓ Geography (North America): NOT VALIDATED")
    print("  Reason: No geographic/country field in input data")
    print("="*75 + "\n")


if __name__ == '__main__':
    main()
