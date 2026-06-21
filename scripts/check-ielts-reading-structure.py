#!/usr/bin/env python3
"""Check IELTS Reading structure in detail."""

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
      AND topic_id = 'ielts-reading'
""")

result = cur.fetchone()
if result:
    content_json = result[0]
    sections = content_json.get('sections', [])

    print("\n" + "="*80)
    print("IELTS Reading - Section 1 Detailed Structure")
    print("="*80)

    section = sections[0]
    print(f"\nSection Title: {section.get('title', 'NO TITLE')}")

    content = section.get('content', [])
    print(f"Content blocks: {len(content)}\n")

    for idx, block in enumerate(content):
        print(f"\nBlock {idx + 1}:")
        print(f"  Type: {block.get('type', 'unknown')}")

        if block.get('type') == 'paragraph':
            text = block.get('text', '')
            print(f"  Text length: {len(text)} chars")
            if text:
                # Show first 200 chars
                print(f"  Preview: {text[:200]}...")
                # Check if it mentions Band Score
                if 'Band Score' in text or 'band score' in text:
                    print(f"  ⚠️  MENTIONS BAND SCORE!")
                    print(f"  Full text: {text}")

        elif block.get('type') == 'table':
            headers = block.get('headers', [])
            rows = block.get('rows', [])
            print(f"  Table: {len(headers)} columns, {len(rows)} rows")
            print(f"  Headers: {headers}")
            if rows:
                print(f"  First row: {rows[0]}")

        elif block.get('type') == 'note':
            icon = block.get('icon', 'NONE')
            title = block.get('title', 'NONE')
            note_content = block.get('content', '')
            print(f"  Icon: {icon}")
            print(f"  Title: {title}")
            print(f"  Content: {note_content}")

cur.close()
conn.close()

print("\n" + "="*80)
