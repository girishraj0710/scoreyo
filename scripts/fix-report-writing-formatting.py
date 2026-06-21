#!/usr/bin/env python3
"""Fix Report Writing - Section 5: Formatting example with proper hierarchy"""

import os
import json

env_vars = {}
with open('.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            env_vars[key] = value.strip('"')

os.environ.update(env_vars)

import psycopg2

POSTGRES_URL = os.environ.get('POSTGRES_URL')
conn = psycopg2.connect(POSTGRES_URL)
cur = conn.cursor()

cur.execute("""
    SELECT content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'advanced'
      AND topic_id = 'report-writing'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])
    
    # Section 5 (index 4) - Formatting: Headings and Numbering
    if len(sections) > 4:
        section = sections[4]
        print(f"Found section: {section['title']}")
        
        # Fix the example block with proper formatting
        for block in section['content']:
            if block.get('type') == 'example' and 'Heading Hierarchy' in block.get('title', ''):
                # Replace the example with properly formatted hierarchy
                block['examples'] = [
                    {
                        'text': '''1. INTRODUCTION
   Purpose and scope of report

2. CURRENT SITUATION
   2.1 Urban Areas
   2.2 Rural Areas

3. CHALLENGES
   3.1 Infrastructure Gaps
   3.2 Funding Constraints

4. RECOMMENDATIONS
   4.1 Short-term Measures
   4.2 Long-term Strategies''',
                        'explanation': 'Use consistent numbering and align subheadings properly'
                    }
                ]
                print("✅ Fixed heading hierarchy example with proper line breaks and indentation")
        
        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = 'advanced'
              AND topic_id = 'report-writing'
        """, (json.dumps(content_json),))
        
        conn.commit()
        print("✅ Database updated successfully")

cur.close()
conn.close()
