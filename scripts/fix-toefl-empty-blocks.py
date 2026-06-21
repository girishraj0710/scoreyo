#!/usr/bin/env python3
"""Fix remaining empty blocks in TOEFL."""

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

# Fetch current content
cur.execute("""
    SELECT content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'ielts-toefl'
      AND topic_id = 'toefl-integrated'
""")

result = cur.fetchone()
content_json = result[0]
sections = content_json.get('sections', [])

print("\n" + "="*80)
print("Fixing Empty Blocks in TOEFL Section 8")
print("="*80)

# Fix Section 8
section = sections[7]  # Index 7 is Section 8
section_title = section.get('title', '')
content_blocks = section.get('content', [])

print(f"\nSection 8: {section_title}")
print(f"Total blocks: {len(content_blocks)}")

# Remove empty paragraph blocks
cleaned_blocks = []
removed = 0

for idx, block in enumerate(content_blocks):
    if isinstance(block, dict) and block.get('type') == 'paragraph':
        text = block.get('text', '')
        if len(text.strip()) < 10:
            print(f"  Block {idx + 1}: Empty paragraph - REMOVING")
            removed += 1
            continue

    cleaned_blocks.append(block)

section['content'] = cleaned_blocks

print(f"\n✅ Removed {removed} empty blocks")
print(f"✅ New block count: {len(cleaned_blocks)}")

# Update database
cur.execute("""
    UPDATE topic_study_content
    SET content = %s, updated_at = NOW()
    WHERE subject_id = 'english'
      AND path_id = 'ielts-toefl'
      AND topic_id = 'toefl-integrated'
""", (json.dumps(content_json),))

conn.commit()

print(f"\n{'='*80}")
print(f"✅ TOEFL Section 8 fixed!")
print(f"{'='*80}\n")

cur.close()
conn.close()
