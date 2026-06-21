#!/usr/bin/env python3
"""Final verification that all IELTS/TOEFL topics are production ready."""

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
print("IELTS/TOEFL Final Production Verification")
print("="*80)

all_topics_ready = True

for row in cur.fetchall():
    topic_id, title, content_json = row
    sections = content_json.get('sections', [])

    print(f"\n📂 {title} ({topic_id})")
    print(f"   Sections: {len(sections)}")

    has_issues = False
    total_blocks = 0
    empty_blocks = 0

    for section_idx, section in enumerate(sections):
        section_title = section.get('title', '')

        # Handle both markdown and structured content
        content = section.get('content')

        if isinstance(content, str):
            # Markdown format (like TOEFL Integrated)
            if len(content) < 100:
                print(f"   ⚠️  Section {section_idx + 1} ({section_title}): Short markdown content ({len(content)} chars)")
                has_issues = True
            total_blocks += 1
            continue

        # Structured content blocks
        if not isinstance(content, list):
            print(f"   ⚠️  Section {section_idx + 1} ({section_title}): No content")
            has_issues = True
            continue

        for block_idx, block in enumerate(content):
            if not isinstance(block, dict):
                continue

            total_blocks += 1
            block_type = block.get('type', 'unknown')

            # Check for empty content
            if block_type == 'paragraph':
                text = block.get('text', '')
                if len(text) < 10:
                    print(f"   ⚠️  Section {section_idx + 1} ({section_title}), Block {block_idx + 1}: Empty paragraph")
                    empty_blocks += 1
                    has_issues = True

            elif block_type == 'note':
                note_content = block.get('content', '')
                note_text = block.get('text', '')
                if not note_content and not note_text:
                    print(f"   ⚠️  Section {section_idx + 1} ({section_title}), Block {block_idx + 1}: Empty note")
                    empty_blocks += 1
                    has_issues = True

            elif block_type == 'table':
                rows = block.get('rows', [])
                if not rows or len(rows) == 0:
                    print(f"   ⚠️  Section {section_idx + 1} ({section_title}), Block {block_idx + 1}: Empty table")
                    empty_blocks += 1
                    has_issues = True

            elif block_type == 'list':
                items = block.get('items', [])
                if not items or len(items) == 0:
                    print(f"   ⚠️  Section {section_idx + 1} ({section_title}), Block {block_idx + 1}: Empty list")
                    empty_blocks += 1
                    has_issues = True

    if has_issues:
        print(f"   ❌ NOT PRODUCTION READY (empty blocks: {empty_blocks}/{total_blocks})")
        all_topics_ready = False
    else:
        print(f"   ✅ PRODUCTION READY (all {total_blocks} blocks have content)")

cur.close()
conn.close()

print("\n" + "="*80)
if all_topics_ready:
    print("✅ ALL IELTS/TOEFL TOPICS ARE PRODUCTION READY!")
else:
    print("⚠️  Some topics need attention (see details above)")
print("="*80 + "\n")
