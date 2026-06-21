#!/usr/bin/env python3
"""Check TOEFL Integrated content structure."""

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
    SELECT title, content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'ielts-toefl'
      AND topic_id = 'toefl-integrated'
""")

result = cur.fetchone()

if result:
    title, content_json = result
    sections = content_json.get('sections', [])

    print("\n" + "="*80)
    print(f"TOEFL Integrated Tasks Content Analysis")
    print("="*80)
    print(f"\nTitle: {title}")
    print(f"Total Sections: {len(sections)}\n")

    for idx, section in enumerate(sections):
        section_title = section.get('title', 'NO TITLE')
        content = section.get('content')

        print(f"\nSection {idx + 1}: {section_title}")
        print(f"  Content type: {type(content).__name__}")

        if isinstance(content, str):
            print(f"  Format: Markdown string")
            print(f"  Length: {len(content)} characters")
            if len(content) == 0:
                print(f"  ⚠️  EMPTY CONTENT!")
            elif len(content) < 100:
                print(f"  ⚠️  Very short content")
                print(f"  Content: {content}")
            else:
                print(f"  Preview (first 200 chars):")
                print(f"  {content[:200]}...")
        elif isinstance(content, list):
            print(f"  Format: Content blocks array")
            print(f"  Blocks: {len(content)}")
        else:
            print(f"  ⚠️  Unexpected format: {content}")

else:
    print("\n⚠️  TOEFL Integrated topic not found in database!")

cur.close()
conn.close()

print("\n" + "="*80 + "\n")
