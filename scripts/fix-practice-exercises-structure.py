#!/usr/bin/env python3
"""Fix practice exercise data structure to match component expectations."""

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
from urllib.parse import urlparse, unquote

POSTGRES_URL = os.environ.get('POSTGRES_URL')
parsed = urlparse(POSTGRES_URL)
conn = psycopg2.connect(
    host=parsed.hostname,
    port=parsed.port or 5432,
    database=parsed.path[1:],
    user=parsed.username,
    password=unquote(parsed.password)
)

cur = conn.cursor()

print("\n" + "="*80)
print("FIXING PRACTICE EXERCISE DATA STRUCTURES")
print("="*80 + "\n")

# Fix 1: Non-defining Relative Clauses - Section 8 (index 7)
print("1. Non-defining Relative Clauses...")

cur.execute("""
    SELECT content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'advanced'
      AND topic_id = 'non-defining-relative-clauses'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])

    if len(sections) > 7:
        section = sections[7]

        for block in section['content']:
            if block.get('type') == 'practice':
                # Convert each question object to proper format
                new_questions = []

                for q_obj in block['questions']:
                    # Build question text based on available fields
                    if 'sentences' in q_obj:
                        # Exercise 1: Combine sentences
                        question_text = f"Combine these sentences: {' | '.join(q_obj['sentences'])}"
                    elif 'sentence' in q_obj:
                        # Exercise 2: Add commas
                        question_text = q_obj['sentence']
                    elif 'error' in q_obj:
                        # Exercise 3: Correct errors
                        question_text = f"Correct this sentence: {q_obj.get('sentence', '')}"
                    else:
                        # Fallback
                        question_text = str(q_obj)

                    new_questions.append({
                        'question': question_text,
                        'answer': q_obj.get('answer', q_obj.get('correction', '')),
                        'explanation': q_obj.get('explanation', '')
                    })

                block['questions'] = new_questions

        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = 'advanced'
              AND topic_id = 'non-defining-relative-clauses'
        """, (json.dumps(content_json),))

        print("   ✅ Fixed - restructured questions to {question, answer, explanation}\n")

# Fix 2: Past Perfect Continuous - Section 9 (index 8)
print("2. Past Perfect Continuous...")

cur.execute("""
    SELECT content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'advanced'
      AND topic_id = 'past-perfect-continuous'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])

    if len(sections) > 8:
        section = sections[8]

        for block in section['content']:
            if block.get('type') == 'practice':
                # Convert each question object to proper format
                new_questions = []

                for q_obj in block['questions']:
                    # Check if already has 'question' field
                    if isinstance(q_obj, str):
                        # Already a string, convert to object
                        new_questions.append({
                            'question': q_obj,
                            'answer': '',
                            'explanation': ''
                        })
                    elif 'question' in q_obj:
                        # Already correct format
                        new_questions.append(q_obj)
                    elif 'sentence' in q_obj:
                        new_questions.append({
                            'question': q_obj['sentence'],
                            'answer': q_obj.get('answer', ''),
                            'explanation': q_obj.get('explanation', '')
                        })
                    else:
                        # Generic conversion
                        new_questions.append({
                            'question': str(q_obj),
                            'answer': q_obj.get('answer', ''),
                            'explanation': q_obj.get('explanation', '')
                        })

                block['questions'] = new_questions

        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = 'advanced'
              AND topic_id = 'past-perfect-continuous'
        """, (json.dumps(content_json),))

        print("   ✅ Fixed - restructured questions to {question, answer, explanation}\n")

# Fix 3: Formal vs Informal Register - Section 7 (index 6)
print("3. Formal vs Informal Register...")

cur.execute("""
    SELECT content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'advanced'
      AND topic_id = 'formal-informal-register'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])

    if len(sections) > 6:
        section = sections[6]

        for block in section['content']:
            if block.get('type') == 'practice':
                # Convert each question object to proper format
                new_questions = []

                for q_obj in block['questions']:
                    if 'informal' in q_obj:
                        # Transformation exercise
                        question_text = f"Transform this informal sentence to formal: {q_obj['informal']}"
                        answer_text = q_obj.get('formal', '')
                    elif 'sentence' in q_obj:
                        question_text = q_obj['sentence']
                        answer_text = q_obj.get('answer', '')
                    else:
                        question_text = str(q_obj)
                        answer_text = q_obj.get('answer', '')

                    new_questions.append({
                        'question': question_text,
                        'answer': answer_text,
                        'explanation': q_obj.get('explanation', q_obj.get('hint', ''))
                    })

                block['questions'] = new_questions

        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = 'advanced'
              AND topic_id = 'formal-informal-register'
        """, (json.dumps(content_json),))

        print("   ✅ Fixed - restructured questions to {question, answer, explanation}\n")

conn.commit()
cur.close()
conn.close()

print("="*80)
print("ALL PRACTICE EXERCISES FIXED")
print("="*80 + "\n")
