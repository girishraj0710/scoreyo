#!/usr/bin/env python3
"""Remove completely empty blocks from all topics to prevent empty boxes showing."""

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

def is_empty_block(block):
    """Check if a block is completely empty."""
    if not isinstance(block, dict):
        return True

    block_type = block.get('type', '')

    if block_type == 'paragraph':
        return len(block.get('text', '').strip()) == 0

    elif block_type == 'note':
        content = block.get('content', '') or block.get('text', '')
        return len(content.strip()) == 0

    elif block_type == 'example':
        examples = block.get('examples', [])
        return len(examples) == 0

    elif block_type == 'list':
        items = block.get('items', [])
        return len(items) == 0

    elif block_type == 'table':
        rows = block.get('rows', [])
        return len(rows) == 0

    elif block_type == 'practice':
        questions = block.get('questions', [])
        return len(questions) == 0

    return False

conn = get_db_connection()
cur = conn.cursor()

cur.execute("""
    SELECT path_id, topic_id, content
    FROM topic_study_content
    WHERE subject_id = 'english'
""")

print("\n" + "="*80)
print("REMOVING EMPTY BLOCKS FROM ALL TOPICS")
print("="*80)

topics_updated = 0
blocks_removed = 0

for row in cur.fetchall():
    path_id, topic_id, content_json = row

    if not content_json or 'sections' not in content_json:
        continue

    sections = content_json.get('sections', [])
    had_changes = False

    for section in sections:
        content = section.get('content')

        if isinstance(content, list):
            original_length = len(content)
            # Remove empty blocks
            section['content'] = [block for block in content if not is_empty_block(block)]
            new_length = len(section['content'])

            if new_length < original_length:
                removed = original_length - new_length
                blocks_removed += removed
                had_changes = True

    if had_changes:
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = %s
              AND topic_id = %s
        """, (json.dumps(content_json), path_id, topic_id))
        topics_updated += 1

conn.commit()
cur.close()
conn.close()

print(f"\nTopics updated: {topics_updated}")
print(f"Empty blocks removed: {blocks_removed}")
print(f"\n{'='*80}\n")
