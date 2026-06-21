#!/usr/bin/env python3
"""Check IELTS Writing Section 8 in detail."""

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

# Section 8 (index 7)
section = sections[7]
section_title = section.get('title', '')
content = section.get('content', [])

print("\n" + "="*80)
print(f"Section 8: {section_title}")
print("="*80)

for block_idx, block in enumerate(content):
    print(f"\n--- Block {block_idx + 1} ---")
    print(f"Type: {block.get('type', 'unknown')}")
    print(f"Keys: {list(block.keys())}")

    block_type = block.get('type', '')

    if block_type == 'paragraph':
        text = block.get('text', '')
        print(f"Text ({len(text)} chars): {text[:200]}...")

    elif block_type == 'table':
        headers = block.get('headers', [])
        rows = block.get('rows', [])
        print(f"Headers: {headers}")
        print(f"Rows: {len(rows)}")
        if rows:
            print(f"First row: {rows[0]}")

    elif block_type == 'list':
        items = block.get('items', [])
        print(f"Items: {len(items)}")
        if items:
            for i, item in enumerate(items[:3]):
                print(f"  {i+1}. {item[:80]}...")

    elif block_type == 'example':
        title = block.get('title', '')
        examples = block.get('examples', [])
        print(f"Title: {title}")
        print(f"Examples: {len(examples)}")
        if examples:
            for i, ex in enumerate(examples):
                print(f"  Example {i+1}: {ex}")
        else:
            print("  ⚠️  EMPTY EXAMPLES ARRAY!")

    elif block_type == 'note':
        icon = block.get('icon', '')
        title = block.get('title', '')
        content_text = block.get('content', '') or block.get('text', '')
        print(f"Icon: {icon}")
        print(f"Title: {title}")
        print(f"Content ({len(content_text)} chars): {content_text[:150]}...")

    elif block_type == 'practice':
        title = block.get('title', '')
        questions = block.get('questions', [])
        print(f"Title: {title}")
        print(f"Questions: {len(questions)}")

cur.close()
conn.close()

print("\n" + "="*80 + "\n")
