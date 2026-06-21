#!/usr/bin/env python3
"""Check Reduced Relative Clauses topic structure."""

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

# Check if this topic exists
cur.execute("""
    SELECT topic_id, title, content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'advanced'
      AND topic_id LIKE '%relative%'
""")

result = cur.fetchone()

if result:
    topic_id, title, content_json = result
    sections = content_json.get('sections', [])

    print("\n" + "="*80)
    print(f"Topic: {title} ({topic_id})")
    print("="*80)
    print(f"Total Sections: {len(sections)}\n")

    # Find Section 4 (Infinitive Clauses)
    for idx, section in enumerate(sections):
        section_title = section.get('title', '')
        if 'Infinitive' in section_title:
            print(f"Section {idx + 1}: {section_title}")
            content = section.get('content', [])
            print(f"Content blocks: {len(content)}\n")

            for block_idx, block in enumerate(content):
                if isinstance(block, dict):
                    block_type = block.get('type', 'unknown')
                    print(f"\nBlock {block_idx + 1}: {block_type}")
                    print(f"  Keys: {list(block.keys())}")

                    if block_type == 'paragraph':
                        text = block.get('text', '')
                        print(f"  Text length: {len(text)} chars")
                        if len(text) < 100:
                            print(f"  Content: {text}")
                        else:
                            print(f"  Preview: {text[:150]}...")

                    elif block_type == 'example':
                        title = block.get('title', '')
                        examples = block.get('examples', [])
                        print(f"  Title: {title}")
                        print(f"  Examples: {len(examples)}")
                        if examples:
                            for i, ex in enumerate(examples[:3]):
                                if isinstance(ex, str):
                                    print(f"    {i+1}. {ex[:80]}...")
                                elif isinstance(ex, dict):
                                    print(f"    {i+1}. {ex.get('text', '')[:80]}...")

                    elif block_type == 'note':
                        icon = block.get('icon', '')
                        note_title = block.get('title', '')
                        content_text = block.get('content', '') or block.get('text', '')
                        print(f"  Icon: {icon}")
                        print(f"  Title: {note_title}")
                        print(f"  Content length: {len(content_text)} chars")
                        if len(content_text) < 200:
                            print(f"  Content: {content_text}")
                        else:
                            print(f"  Preview: {content_text[:150]}...")

                    elif block_type == 'list':
                        items = block.get('items', [])
                        list_title = block.get('title', '')
                        print(f"  Title: {list_title}")
                        print(f"  Items: {len(items)}")

                    elif block_type == 'table':
                        headers = block.get('headers', [])
                        rows = block.get('rows', [])
                        print(f"  Headers: {headers}")
                        print(f"  Rows: {len(rows)}")

else:
    print("\n⚠️  Reduced Relative Clauses topic not found!")
    print("Searching for similar topics...")

    cur.execute("""
        SELECT topic_id, title
        FROM topic_study_content
        WHERE subject_id = 'english'
          AND path_id = 'advanced'
        ORDER BY topic_id
    """)

    print("\nAvailable Advanced English topics:")
    for row in cur.fetchall():
        print(f"  - {row[1]} ({row[0]})")

cur.close()
conn.close()

print("\n" + "="*80 + "\n")
