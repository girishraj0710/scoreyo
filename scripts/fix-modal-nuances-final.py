#!/usr/bin/env python3
"""Fix the last empty formula in Modal Verb Nuances."""

import os
import json
import psycopg2
from urllib.parse import urlparse, unquote

POSTGRES_URL = os.environ.get('POSTGRES_URL', "postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres")

def get_db_connection():
    parsed = urlparse(POSTGRES_URL)
    return psycopg2.connect(
        host=parsed.hostname,
        port=parsed.port or 5432,
        database=parsed.path[1:],
        user=parsed.username,
        password=unquote(parsed.password)
    )

conn = get_db_connection()
cur = conn.cursor()

cur.execute("""
    SELECT content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'advanced'
      AND topic_id = 'modal-verb-nuances'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])

    fixed = False

    # Fix ALL empty formulas in this topic
    for section in sections:
        content = section.get('content', [])

        if isinstance(content, list):
            for block in content:
                if isinstance(block, dict) and block.get('type') == 'formula':
                    if not block.get('formula'):
                        # Add comprehensive formula content
                        block['formula'] = 'Should/Must/Ought to/Could/Might + base verb'
                        block['description'] = 'Modal verbs for formal writing: recommendations, obligations, and possibilities'
                        block['examples'] = [
                            {
                                'text': 'The government should implement stricter environmental regulations.',
                                'explanation': 'Formal recommendation (should = advisable action)'
                            },
                            {
                                'text': 'Citizens must be aware of their constitutional rights and duties.',
                                'explanation': 'Strong obligation (must = necessary action)'
                            },
                            {
                                'text': 'Authorities ought to prioritize public welfare over commercial interests.',
                                'explanation': 'Moral obligation (ought to = what is right)'
                            },
                            {
                                'text': 'India could emerge as a global leader in renewable energy technology.',
                                'explanation': 'Future possibility (could = potential outcome)'
                            },
                            {
                                'text': 'This policy might reduce inequality in the long term.',
                                'explanation': 'Uncertain possibility (might = less confident prediction)'
                            }
                        ]
                        fixed = True
                        print(f"✅ Fixed empty formula in section: {section.get('title', 'Unknown')}")

    if fixed:
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = 'advanced'
              AND topic_id = 'modal-verb-nuances'
        """, (json.dumps(content_json),))

        conn.commit()
        print("\n✅ Modal Verb Nuances - All formulas fixed!\n")
    else:
        print("\n⚠️  No empty formulas found in Modal Verb Nuances\n")

else:
    print("\n❌ Modal Verb Nuances topic not found\n")

cur.close()
conn.close()
