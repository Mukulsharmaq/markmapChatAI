#!/usr/bin/env python3
"""Merge enriched emails into the original FIT-accounts CSV.

Usage:
    python3 merge_emails.py <original.csv> <emails.json> <output.csv>

emails.json: {"<row_id>": "<email>", ...} with 1-based row ids matching the
original CSV data-row order (header excluded). Rows without a found email get
an empty Emails cell.
"""
import csv
import json
import sys


def main() -> None:
    src, emails_path, dst = sys.argv[1], sys.argv[2], sys.argv[3]
    emails = {int(k): v for k, v in json.load(open(emails_path)).items() if v}

    with open(src, newline="", encoding="utf-8-sig") as f:
        rows = list(csv.reader(f))
    header, data = rows[0], rows[1:]

    with open(dst, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header + ["Emails"])
        for i, row in enumerate(data, start=1):
            w.writerow(row + [emails.get(i, "")])

    found = sum(1 for i in range(1, len(data) + 1) if i in emails)
    print(f"rows: {len(data)}, emails filled: {found}")


if __name__ == "__main__":
    main()
