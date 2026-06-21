import os
import json
from urllib.parse import urlparse
import psycopg2

# Parse connection string
DATABASE_URL = os.environ.get('POSTGRES_URL')
parsed = urlparse(DATABASE_URL)

conn = psycopg2.connect(
    database=parsed.path[1:],
    user=parsed.username,
    password=parsed.password,
    host=parsed.hostname,
    port=parsed.port
)

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
    print(f"IELTS Reading Content Analysis")
    print(f"{'='*80}")
    print(f"Total sections: {len(sections)}\n")
    
    for i, section in enumerate(sections, 1):
        print(f"Section {i}: {section.get('title', 'NO TITLE')}")
        content_blocks = section.get('content', [])
        print(f"  Content blocks: {len(content_blocks)}")
        
        for j, block in enumerate(content_blocks, 1):
            block_type = block.get('type', 'unknown')
            print(f"    Block {j}: type={block_type}")
            
            if block_type == 'paragraph':
                text = block.get('text', '')
                print(f"      Text length: {len(text)} chars")
                if len(text) < 50:
                    print(f"      ⚠️  SHORT/EMPTY: '{text}'")
            elif block_type == 'note':
                note_content = block.get('content', '')
                print(f"      Note content length: {len(note_content)} chars")
                if len(note_content) < 20:
                    print(f"      ⚠️  SHORT/EMPTY: '{note_content}'")
            elif block_type == 'table':
                headers = block.get('headers', [])
                rows = block.get('rows', [])
                print(f"      Table: {len(headers)} columns, {len(rows)} rows")
        
        print()

cur.close()
conn.close()
