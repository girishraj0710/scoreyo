#!/usr/bin/env python3
"""Convert TOEFL markdown to structured content blocks."""

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

def markdown_to_blocks(markdown_text):
    """Convert markdown string to structured content blocks."""
    if not markdown_text or not isinstance(markdown_text, str):
        return []

    blocks = []

    # Split by double newlines to get paragraphs
    sections = markdown_text.split('\n\n')

    for section in sections:
        section = section.strip()
        if not section:
            continue

        # Check if it's a list (starts with dash or number)
        if section.startswith('- ') or section.startswith('* ') or re.match(r'^\d+\.', section):
            # It's a list
            items = []
            for line in section.split('\n'):
                line = line.strip()
                if line:
                    # Remove list markers
                    cleaned_line = re.sub(r'^[-*]\s+', '', line)
                    cleaned_line = re.sub(r'^\d+\.\s+', '', cleaned_line)
                    items.append(cleaned_line)

            if items:
                blocks.append({
                    "type": "list",
                    "items": items
                })

        else:
            # It's a paragraph
            blocks.append({
                "type": "paragraph",
                "text": section
            })

    return blocks

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
if not result:
    print("⚠️  TOEFL Integrated not found!")
    exit(1)

content_json = result[0]
sections = content_json.get('sections', [])

print("\n" + "="*80)
print("Converting TOEFL Integrated to Structured Blocks")
print("="*80)

sections_converted = 0

for idx, section in enumerate(sections):
    section_title = section.get('title', '')
    content = section.get('content', '')

    if isinstance(content, str) and len(content) > 0:
        print(f"\nSection {idx + 1}: {section_title}")
        print(f"  Original format: Markdown string ({len(content)} chars)")

        blocks = markdown_to_blocks(content)
        section['content'] = blocks

        print(f"  New format: {len(blocks)} content blocks")
        print(f"  ✅ Converted to structured format")
        sections_converted += 1

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
print(f"✅ Converted {sections_converted} sections to structured blocks!")
print(f"{'='*80}\n")

cur.close()
conn.close()
