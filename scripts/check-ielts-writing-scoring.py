#!/usr/bin/env python3
"""Check IELTS Writing for the Scoring Example section."""

import os
import json
import psycopg2
from urllib.parse import urlparse, unquote

# Database connection
POSTGRES_URL = os.environ.get('POSTGRES_URL', "postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres")

def get_db_connection():
    """Get database connection."""
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
      AND path_id = 'ielts-toefl'
      AND topic_id = 'ielts-writing'
""")

result = cur.fetchone()
content_json = result[0]
sections = content_json.get('sections', [])

print("\n" + "="*80)
print("IELTS Writing Sections Analysis")
print("="*80)

for idx, section in enumerate(sections):
    section_title = section.get('title', '')
    content = section.get('content', [])

    print(f"\nSection {idx + 1}: {section_title}")
    print(f"  Content blocks: {len(content)}")

    # Check if this is the scoring section
    if 'Scoring' in section_title or 'Band' in section_title:
        print(f"  ⚠️  THIS IS A SCORING SECTION!")

        for block_idx, block in enumerate(content):
            if isinstance(block, dict):
                block_type = block.get('type', 'unknown')
                print(f"\n  Block {block_idx + 1}: {block_type}")

                if block_type == 'paragraph':
                    text = block.get('text', '')
                    print(f"    Text length: {len(text)} chars")
                    if len(text) < 50:
                        print(f"    ⚠️  SHORT: {text}")
                    else:
                        print(f"    Preview: {text[:100]}...")

                elif block_type == 'table':
                    headers = block.get('headers', [])
                    rows = block.get('rows', [])
                    print(f"    Headers: {headers}")
                    print(f"    Rows: {len(rows)}")

                elif block_type == 'example':
                    examples = block.get('examples', [])
                    print(f"    Examples: {len(examples)}")

cur.close()
conn.close()

print("\n" + "="*80 + "\n")
