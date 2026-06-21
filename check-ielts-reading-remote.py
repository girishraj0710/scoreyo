import os
import json
from urllib.parse import urlparse
import psycopg2

# Parse connection string - use full URL with ?sslmode=require
DATABASE_URL = os.environ.get('POSTGRES_URL')

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

# Get IELTS Reading content
cur.execute("""
    SELECT content 
    FROM topic_study_content 
    WHERE subject_id = 'english' 
      AND path_id = 'ielts-toefl' 
      AND topic_id = 'ielts-reading'
""")

result = cur.fetchone()
if result:
    content = result[0]
    sections = content.get('sections', [])
    
    print(f"\n{'='*80}")
    print(f"IELTS Reading - Section 1 (Overview) Analysis")
    print(f"{'='*80}\n")
    
    # Focus on Section 1
    section = sections[0]
    print(f"Section 1 Title: {section.get('title', 'NO TITLE')}\n")
    
    content_blocks = section.get('content', [])
    print(f"Total content blocks: {len(content_blocks)}\n")
    
    for j, block in enumerate(content_blocks, 1):
        block_type = block.get('type', 'unknown')
        print(f"\nBlock {j}:")
        print(f"  Type: {block_type}")
        
        if block_type == 'paragraph':
            text = block.get('text', '')
            print(f"  Text length: {len(text)} chars")
            print(f"  Preview: {text[:200]}...")
        elif block_type == 'note':
            note_content = block.get('content', '')
            note_icon = block.get('icon', '')
            note_title = block.get('title', '')
            print(f"  Icon: {note_icon}")
            print(f"  Title: {note_title}")
            print(f"  Content length: {len(note_content)} chars")
            print(f"  Full content: {note_content}")
        elif block_type == 'table':
            headers = block.get('headers', [])
            rows = block.get('rows', [])
            print(f"  Headers: {headers}")
            print(f"  Rows: {len(rows)}")
            if rows:
                print(f"  First row: {rows[0]}")

cur.close()
conn.close()
