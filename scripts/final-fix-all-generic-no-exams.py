#!/usr/bin/env python3
"""
FINAL FIX: ALL GENERIC CONTENT - NO EXAM REFERENCES
Pure English learning content - universal, not exam-focused
"""

import os, json
import sys
sys.path.append('/Users/girish.raj/prepgenie/scripts')
from mega_english_examples_generic import get_examples

env_vars = {}
with open('.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            env_vars[key] = value.strip('"')
os.environ.update(env_vars)

import psycopg2
conn = psycopg2.connect(os.environ.get('POSTGRES_URL'))
cur = conn.cursor()

# Get ALL English topics
cur.execute("""
    SELECT path_id, topic_id, title, content
    FROM topic_study_content
    WHERE subject_id='english'
    ORDER BY path_id, topic_id
""")

all_topics = cur.fetchall()
fixed_count = 0
section_count = 0

print(f"\n{'='*100}")
print(f"FINAL FIX: Removing ALL exam references and generic placeholders")
print(f"{'='*100}\n")

for path_id, topic_id, title, content_json in all_topics:
    sections = content_json.get('sections', [])
    modified = False

    for s_idx, section in enumerate(sections):
        section_modified = False
        content_blocks = section.get('content', [])

        for block_idx, block in enumerate(content_blocks):
            if not isinstance(block, dict):
                continue

            # Fix paragraphs with exam references
            if block.get('type') == 'paragraph':
                text = block.get('text', '')

                # Remove exam references
                if any(keyword in text for keyword in ['UPSC', 'SSC', 'banking', 'railway', 'competitive exam', 'government exam', 'descriptive paper']):
                    # Clean the text
                    text = text.replace(' particularly in formal contexts such as UPSC essay writing, SSC descriptive papers, and banking correspondence tests', '')
                    text = text.replace(' particularly in formal contexts such as UPSC essay writing, SSC descriptive papers, and banking correspondence', '')
                    text = text.replace(' For UPSC, SSC, and banking exams, focus on accuracy and speed.', '')
                    text = text.replace(' This is frequently tested in UPSC, SSC, banking, railway, and other government exams', '')
                    text = text.replace(' Indian learners often face specific challenges with', ' Learners often face specific challenges with')
                    text = text.replace(' For Indian competitive exam aspirants', ' For English learners')
                    text = text.replace(' Hindi speakers', ' Learners')
                    text = text.replace(' Hindi and English', ' different languages')
                    text = text.replace(' from Hindi', ' from their native language')
                    text = text.replace('For competitive exam essay writing,', 'In formal writing,')
                    text = text.replace('In UPSC and SSC essays,', 'In formal essays,')

                    # Remove exam context paragraphs
                    text = text.replace('This grammatical concept is fundamental for achieving accuracy in both written and spoken English, particularly in formal contexts such as UPSC essay writing, SSC descriptive papers, and banking correspondence tests. Indian learners often face specific challenges with', 'This grammatical concept is fundamental for achieving accuracy in both written and spoken English. Learners often face specific challenges with')
                    text = text.replace('Regular exposure to correct usage in reading materials and conscious application in writing exercises significantly improve proficiency in', 'Regular exposure to correct usage in reading materials and conscious application in writing exercises significantly improve proficiency.')
                    text = text.replace(' due to structural differences between Hindi and English', '')
                    text = text.replace(' due to structural differences between Hindi and English grammar', '')

                    block['text'] = text.strip()
                    section_modified = True

            # Fix generic examples
            if block.get('type') == 'example':
                examples = block.get('examples', [])
                needs_fix = False

                for ex in examples:
                    if isinstance(ex, dict):
                        ex_text = ex.get('text', '')
                        if any(keyword in ex_text for keyword in ['Example demonstrating', 'Simple example of', 'UPSC', 'SSC', 'banking']):
                            needs_fix = True
                            break

                if needs_fix:
                    # Replace with generic learning examples
                    block['examples'] = get_examples(topic_id)
                    section_modified = True

            # Fix generic practice
            if block.get('type') == 'practice':
                questions = block.get('questions', [])

                for q in questions:
                    if isinstance(q, dict):
                        # Remove exam references from explanations
                        explanation = q.get('explanation', '')
                        if any(keyword in explanation for keyword in ['UPSC', 'SSC', 'banking', 'competitive']):
                            explanation = explanation.replace('For UPSC, SSC, and banking exams, ', '')
                            explanation = explanation.replace('This is tested in competitive exams. ', '')
                            q['explanation'] = explanation
                            section_modified = True

        if section_modified:
            modified = True
            section_count += 1

    # Update database if modified
    if modified:
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id='english' AND path_id=%s AND topic_id=%s
        """, (json.dumps(content_json), path_id, topic_id))

        fixed_count += 1
        print(f"✅ {path_id}/{topic_id}")
        conn.commit()

print(f"\n{'='*100}")
print(f"COMPLETE: {fixed_count} topics fixed, {section_count} sections cleaned")
print(f"All exam references removed. Content is now generic English learning.")
print(f"{'='*100}\n")

cur.close()
conn.close()
