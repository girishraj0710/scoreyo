#!/usr/bin/env python3
"""Fix all English topics comprehensively."""

import os
import json
import re
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

def clean_text(text):
    """Remove markdown formatting."""
    if not text or not isinstance(text, str):
        return text
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    text = re.sub(r'\[\s*\]', '', text)
    text = re.sub(r'\[x\]', '✓', text, flags=re.IGNORECASE)
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'`([^`]+)`', r'\1', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def fix_block(block):
    """Fix a single content block."""
    if not isinstance(block, dict):
        return block, []

    fixes = []
    block_type = block.get('type', '')

    # Fix paragraphs
    if block_type == 'paragraph':
        if 'text' in block:
            original = block['text']
            block['text'] = clean_text(original)
            if original != block['text']:
                fixes.append("Cleaned formatting")

    # Fix notes
    elif block_type == 'note':
        # Ensure content/text field exists
        if not block.get('content') and not block.get('text'):
            block['content'] = ""

        # Clean content
        for field in ['content', 'text']:
            if field in block:
                block[field] = clean_text(block[field])

        # Add missing icon
        if not block.get('icon'):
            block['icon'] = '💡'
            fixes.append("Added missing icon")

        # Add missing title
        if not block.get('title'):
            block['title'] = 'Note'
            fixes.append("Added missing title")

    # Fix examples - convert content to examples array
    elif block_type == 'example':
        if 'content' in block and not block.get('examples'):
            # Convert content string to examples array
            content_text = block['content']
            if content_text:
                block['examples'] = [{
                    'text': clean_text(content_text)
                }]
                del block['content']
                fixes.append("Converted 'content' to 'examples' array")

        # Ensure examples array exists
        if not block.get('examples'):
            block['examples'] = []

    # Fix lists
    elif block_type == 'list':
        if 'items' in block and isinstance(block['items'], list):
            block['items'] = [clean_text(item) for item in block['items']]

    # Fix practice - convert question to questions array
    elif block_type == 'practice':
        if 'question' in block and not block.get('questions'):
            # Convert single question to questions array
            block['questions'] = [{
                'question': clean_text(block['question']),
                'hint': clean_text(block.get('hint', ''))
            }]
            del block['question']
            if 'hint' in block:
                del block['hint']
            fixes.append("Converted 'question' to 'questions' array")

        # Ensure questions array exists
        if not block.get('questions'):
            block['questions'] = []

    return block, fixes

conn = get_db_connection()
cur = conn.cursor()

# Get all English topics
cur.execute("""
    SELECT path_id, topic_id, title, content
    FROM topic_study_content
    WHERE subject_id = 'english'
    ORDER BY path_id, topic_id
""")

print("\n" + "="*80)
print("FIXING ALL ENGLISH TOPICS")
print("="*80)

topics_fixed = 0
blocks_fixed = 0
total_fixes = 0

for row in cur.fetchall():
    path_id, topic_id, title, content_json = row

    if not content_json or 'sections' not in content_json:
        continue

    sections = content_json.get('sections', [])
    topic_had_fixes = False

    for section in sections:
        content = section.get('content')

        # Skip markdown content
        if isinstance(content, str):
            continue

        # Fix structured content
        if isinstance(content, list):
            for idx, block in enumerate(content):
                fixed_block, fixes = fix_block(block)
                if fixes:
                    content[idx] = fixed_block
                    blocks_fixed += 1
                    total_fixes += len(fixes)
                    topic_had_fixes = True

    if topic_had_fixes:
        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = %s
              AND topic_id = %s
        """, (json.dumps(content_json), path_id, topic_id))

        topics_fixed += 1
        print(f"✅ {path_id}/{topic_id}")

conn.commit()
cur.close()
conn.close()

print(f"\n{'='*80}")
print("FIX SUMMARY")
print(f"{'='*80}")
print(f"Topics fixed: {topics_fixed}")
print(f"Blocks fixed: {blocks_fixed}")
print(f"Total individual fixes: {total_fixes}")
print(f"{'='*80}\n")
