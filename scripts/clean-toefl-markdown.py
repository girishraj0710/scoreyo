#!/usr/bin/env python3
"""Clean up markdown formatting in TOEFL Integrated content."""

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

def clean_markdown(text):
    """Clean up markdown formatting - remove ** for bold."""
    if not text:
        return text

    # Remove **bold** - convert to plain text
    # This handles both inline and standalone bold text
    cleaned = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)

    return cleaned

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
print("Cleaning TOEFL Integrated Markdown")
print("="*80)

sections_cleaned = 0

for idx, section in enumerate(sections):
    section_title = section.get('title', '')
    content = section.get('content', '')

    if isinstance(content, str) and '**' in content:
        print(f"\nSection {idx + 1}: {section_title}")
        print(f"  Original length: {len(content)} chars")
        print(f"  Bold markers (**): {content.count('**')} occurrences")

        cleaned_content = clean_markdown(content)
        section['content'] = cleaned_content

        print(f"  Cleaned length: {len(cleaned_content)} chars")
        print(f"  ✅ Removed {content.count('**') // 2} bold markers")
        sections_cleaned += 1

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
print(f"✅ Cleaned {sections_cleaned} sections!")
print(f"{'='*80}\n")

cur.close()
conn.close()
