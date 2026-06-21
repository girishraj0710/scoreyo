#!/usr/bin/env python3
"""Fix topic_id mismatches between frontend and database."""

import os
import json

env_vars = {}
with open('.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            env_vars[key] = value.strip('"')

os.environ.update(env_vars)

import psycopg2
from urllib.parse import urlparse, unquote

POSTGRES_URL = os.environ.get('POSTGRES_URL')
parsed = urlparse(POSTGRES_URL)
conn = psycopg2.connect(
    host=parsed.hostname,
    port=parsed.port or 5432,
    database=parsed.path[1:],
    user=parsed.username,
    password=unquote(parsed.password)
)

cur = conn.cursor()

# Mismatches to fix
FIXES = [
    {'old': 'conditional-inversion', 'new': 'inversion-conditionals', 'title': 'Conditional Inversion'},
    {'old': 'foundation-english-modal-verb-nuances', 'new': 'modal-nuances', 'title': 'Modal Verb Nuances'},
    {'old': 'advanced-punctuation-c1', 'new': 'advanced-punctuation', 'title': 'Advanced Punctuation'},
    {'old': 'professional-presentations', 'new': 'presentations-advanced', 'title': 'Professional Presentations'},
    {'old': 'debates-discussions', 'new': 'debate-discussion', 'title': 'Debates & Discussions'},
]

print("\n" + "="*80)
print("FIXING TOPIC ID MISMATCHES")
print("="*80 + "\n")

fixed = 0
errors = 0

for fix in FIXES:
    old_id = fix['old']
    new_id = fix['new']
    title = fix['title']

    print(f"Fixing: {title}")
    print(f"  {old_id} → {new_id}")

    try:
        # Update topic_id
        cur.execute("""
            UPDATE topic_study_content
            SET topic_id = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = 'advanced'
              AND topic_id = %s
        """, (new_id, old_id))

        if cur.rowcount > 0:
            print(f"  ✅ Updated\n")
            fixed += 1
        else:
            print(f"  ⚠️ Topic not found in database\n")
            errors += 1

    except Exception as e:
        print(f"  ❌ Error: {e}\n")
        errors += 1

conn.commit()
cur.close()
conn.close()

print("="*80)
print(f"SUMMARY: {fixed} fixed, {errors} errors")
print("="*80 + "\n")
