#!/usr/bin/env python3
"""Check Band Score Calculation sections to see what content they have."""

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
    SELECT topic_id, title, content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'ielts-toefl'
    ORDER BY topic_id
""")

print("\n" + "="*80)
print("Band Score Calculation Sections Analysis")
print("="*80)

for row in cur.fetchall():
    topic_id, title, content_json = row
    sections = content_json.get('sections', [])

    for section_idx, section in enumerate(sections):
        section_title = section.get('title', '')

        if 'Band Score' in section_title or 'Scoring' in section_title:
            print(f"\n📂 {topic_id}")
            print(f"   Section {section_idx + 1}: {section_title}")

            # Check content format
            content = section.get('content')

            if isinstance(content, str):
                print(f"   Format: Markdown string")
                print(f"   Length: {len(content)} chars")
                if len(content) < 100:
                    print(f"   Content preview: {content[:100]}")
            elif isinstance(content, list):
                print(f"   Format: Structured blocks")
                print(f"   Blocks: {len(content)}")
                for idx, block in enumerate(content):
                    if isinstance(block, dict):
                        block_type = block.get('type', 'unknown')
                        print(f"      Block {idx + 1}: {block_type}")

                        if block_type == 'table':
                            headers = block.get('headers', [])
                            rows = block.get('rows', [])
                            print(f"         Table: {len(headers)} columns, {len(rows)} rows")
                        elif block_type == 'note':
                            note_content = block.get('content', '')
                            note_text = block.get('text', '')
                            print(f"         Note content: {len(note_content)} chars")
                            print(f"         Note text: {len(note_text)} chars")
                            if note_content:
                                print(f"         Preview: {note_content[:80]}...")
                            elif note_text:
                                print(f"         Preview: {note_text[:80]}...")
                        elif block_type == 'paragraph':
                            text = block.get('text', '')
                            print(f"         Text: {len(text)} chars")
                            if text and len(text) < 200:
                                print(f"         Full text: {text}")

cur.close()
conn.close()

print("\n" + "="*80)
print("Analysis complete!")
print("="*80 + "\n")
