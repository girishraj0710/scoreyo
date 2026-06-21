#!/usr/bin/env python3
"""Rebuild ALL practice exercises with correct {question, answer, explanation} structure."""

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
print("REBUILD ALL PRACTICE EXERCISES - COMPLETE FIX")
print("="*80 + "\n")

fixed_count = 0

# Fix 1: Future Perfect Continuous
print("1. Future Perfect Continuous...")

cur.execute("""
    SELECT content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'advanced'
      AND topic_id = 'future-perfect-continuous'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])

    # Section 9 (index 8) - Practice Exercises
    if len(sections) > 8:
        section = sections[8]

        # Find all practice blocks
        for block_idx, block in enumerate(section['content']):
            if block.get('type') == 'practice':
                # Check if it has questions as strings and separate answers array
                if block.get('questions') and isinstance(block['questions'][0], str):
                    # Merge questions and answers
                    new_questions = []
                    answers = block.get('answers', [])

                    for idx, q_str in enumerate(block['questions']):
                        new_questions.append({
                            'question': q_str,
                            'answer': answers[idx] if idx < len(answers) else '',
                            'explanation': ''
                        })

                    block['questions'] = new_questions
                    # Remove old answers array
                    if 'answers' in block:
                        del block['answers']

                    fixed_count += 1

        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = 'advanced'
              AND topic_id = 'future-perfect-continuous'
        """, (json.dumps(content_json),))

        print(f"   ✅ Fixed {fixed_count} practice blocks\n")

# Fix 2: Narrative Tenses
print("2. Narrative Tenses...")

cur.execute("""
    SELECT content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'advanced'
      AND topic_id = 'narrative-tenses'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])

    # Section 9 (index 8) - Practice Exercises
    if len(sections) > 8:
        section = sections[8]
        fixed_this = 0

        for block in section['content']:
            if block.get('type') == 'practice':
                # Check if it has questions as strings and separate answers array
                if block.get('questions') and isinstance(block['questions'][0], str):
                    # Merge questions and answers
                    new_questions = []
                    answers = block.get('answers', [])

                    for idx, q_str in enumerate(block['questions']):
                        new_questions.append({
                            'question': q_str,
                            'answer': answers[idx] if idx < len(answers) else '',
                            'explanation': ''
                        })

                    block['questions'] = new_questions
                    # Remove old answers array
                    if 'answers' in block:
                        del block['answers']

                    fixed_this += 1

        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = 'advanced'
              AND topic_id = 'narrative-tenses'
        """, (json.dumps(content_json),))

        print(f"   ✅ Fixed {fixed_this} practice blocks\n")

# Fix 3: Formal vs Informal Register (completely rebuild from scratch)
print("3. Formal vs Informal Register (rebuilding from scratch)...")

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

    # Section 7 (index 6) - Practice Exercises
    if len(sections) > 6:
        section = sections[6]

        # Replace practice section with correct structure
        section['content'] = [
            {
                'type': 'practice',
                'title': 'Exercise 1: Transform Informal to Formal',
                'questions': [
                    {
                        'question': "I'm really sorry for not getting back to you sooner.",
                        'answer': "I sincerely apologize for not responding to you earlier.",
                        'explanation': "Remove contraction, use 'apologize' instead of 'sorry', replace 'getting back to' with 'responding', use 'earlier' instead of 'sooner'"
                    },
                    {
                        'question': "We need to find out why the project failed and fix the problems.",
                        'answer': "It is necessary to investigate the reasons for the project's failure and address the issues.",
                        'explanation': "Replace 'need to' with 'it is necessary to', 'find out' → 'investigate', 'fix' → 'address', 'problems' → 'issues'"
                    },
                    {
                        'question': "There are lots of students who can't afford college because fees are very high.",
                        'answer': "There are numerous students who are unable to afford higher education due to exorbitant fees.",
                        'explanation': "'lots of' → 'numerous', 'can't' → 'are unable to', 'college' → 'higher education', 'because' → 'due to', 'very high' → 'exorbitant'"
                    },
                    {
                        'question': "The government should look into this issue and do something about it.",
                        'answer': "The government should investigate this matter and take appropriate action.",
                        'explanation': "'look into' → 'investigate', 'issue' → 'matter' (more formal), 'do something about it' → 'take appropriate action'"
                    },
                    {
                        'question': "I think that social media has a bad effect on young people.",
                        'answer': "It is believed that social media has an adverse effect on young individuals.",
                        'explanation': "'I think' → 'It is believed' (impersonal), 'bad' → 'adverse', 'young people' → 'young individuals'"
                    }
                ]
            },
            {
                'type': 'practice',
                'title': 'Exercise 2: Convert to Passive Voice',
                'questions': [
                    {
                        'question': "The committee will announce the results tomorrow.",
                        'answer': "The results will be announced tomorrow.",
                        'explanation': "Passive voice removes the actor (committee) and emphasizes the action (announcing results)"
                    },
                    {
                        'question': "Experts have thoroughly studied this problem.",
                        'answer': "This problem has been thoroughly studied.",
                        'explanation': "Passive voice makes the statement sound more objective and formal"
                    },
                    {
                        'question': "People expect the government to take immediate action.",
                        'answer': "The government is expected to take immediate action.",
                        'explanation': "Passive construction with 'is expected' sounds more formal than active 'people expect'"
                    },
                    {
                        'question': "They implemented new policies last year.",
                        'answer': "New policies were implemented last year.",
                        'explanation': "Passive voice focuses on policies (what was done) rather than who did it"
                    },
                    {
                        'question': "We must address this issue urgently.",
                        'answer': "This issue must be addressed urgently.",
                        'explanation': "Passive with 'must be' maintains the urgency while sounding more formal"
                    }
                ]
            }
        ]

        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = 'advanced'
              AND topic_id = 'formal-informal-register'
        """, (json.dumps(content_json),))

        print("   ✅ Rebuilt 2 practice exercises with 10 questions\n")

conn.commit()
cur.close()
conn.close()

print("="*80)
print("✅ ALL PRACTICE EXERCISES REBUILT SUCCESSFULLY")
print("="*80 + "\n")
