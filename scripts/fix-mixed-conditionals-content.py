#!/usr/bin/env python3
"""Add missing content to Mixed Conditionals topic."""

import os
import json
import psycopg2
from urllib.parse import urlparse, unquote

POSTGRES_URL = os.environ.get('POSTGRES_URL', "postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres")

def get_db_connection():
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
    SELECT content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'advanced'
      AND topic_id = 'mixed-conditionals'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])

    # Section 2: Add formula for Type 1
    for section in sections:
        if section.get('title') == 'Type 1: Past Condition → Present Result':
            for block in section['content']:
                if block.get('type') == 'formula':
                    block['formula'] = 'If + had + past participle, ... would/could/might + base verb'
                    block['description'] = 'Past Perfect in if-clause + Present Conditional in main clause'
                    block['examples'] = [
                        {
                            'text': 'If I had studied medicine, I would be a doctor now.',
                            'explanation': 'Past decision (not studying medicine) affects present reality (not being a doctor)'
                        },
                        {
                            'text': 'If she had saved money, she could travel today.',
                            'explanation': 'Past action (not saving) affects present possibility (cannot travel)'
                        },
                        {
                            'text': 'If they had taken the job offer, they might live in Mumbai now.',
                            'explanation': 'Past choice affects current location'
                        }
                    ]

    # Section 3: Add formula for Type 2
    for section in sections:
        if section.get('title') == 'Type 2: Present/Continuous Condition → Past Result':
            for block in section['content']:
                if block.get('type') == 'formula':
                    block['formula'] = 'If + simple past (were), ... would/could/might + have + past participle'
                    block['description'] = 'Present Subjunctive in if-clause + Past Conditional Perfect in main clause'
                    block['examples'] = [
                        {
                            'text': 'If I were taller, I would have joined the basketball team.',
                            'explanation': 'Present condition (being short) affected past opportunity (not joining team)'
                        },
                        {
                            'text': 'If he were more confident, he could have asked her out.',
                            'explanation': 'Current personality trait affected past action'
                        },
                        {
                            'text': 'If we lived closer, we might have attended the wedding.',
                            'explanation': 'Present location affected past event'
                        }
                    ]

    # Section 4: Add table for Structural Patterns
    for section in sections:
        if section.get('title') == 'Structural Patterns and Variations':
            for block in section['content']:
                if block.get('type') == 'table':
                    block['headers'] = ['Pattern', 'Example', 'Time Reference']
                    block['rows'] = [
                        ['Inverted form (Type 1)', 'Had I known about this earlier, I would understand it better now.', 'Past → Present'],
                        ['With modal verbs', 'If you had practiced regularly, you could compete today.', 'Past → Present'],
                        ['Continuous aspect', 'If she had accepted the offer, she would be working there now.', 'Past → Present Continuous'],
                        ['Type 2 variation', 'If I were a better singer, I would have auditioned for the show.', 'Present → Past'],
                        ['Unless variation', 'Unless I had made that mistake, I would know the correct answer now.', 'Past → Present']
                    ]

    # Section 6: Add table for comparison
    for section in sections:
        if section.get('title') == 'Mixed Conditionals vs. Standard Conditionals':
            for block in section['content']:
                if block.get('type') == 'table':
                    block['headers'] = ['Type', 'Structure', 'Example', 'Time Logic']
                    block['rows'] = [
                        ['Standard Third (Type 3)', 'If + past perfect, would have + past participle', 'If I had studied, I would have passed.', 'Both clauses refer to past'],
                        ['Mixed (Type 1)', 'If + past perfect, would + base verb', 'If I had studied, I would remember it now.', 'If-clause: past; Main clause: present'],
                        ['Standard Second (Type 2)', 'If + simple past, would + base verb', 'If I studied, I would pass.', 'Both clauses refer to present/future'],
                        ['Mixed (Type 2)', 'If + simple past, would have + past participle', 'If I were smarter, I would have solved it.', 'If-clause: present; Main clause: past']
                    ]

    # Section 8: Add practice questions
    for section in sections:
        if section.get('title') == 'Practice Problems':
            for block in section['content']:
                if block.get('type') == 'practice':
                    block['questions'] = [
                        {
                            'question': 'Complete: If she _____ (accept) the job offer last year, she _____ (work) in London now.',
                            'answer': 'had accepted, would be working',
                            'explanation': 'Type 1 mixed conditional: past decision affects present situation'
                        },
                        {
                            'question': 'Identify the error: "If I was taller, I would have joined the basketball team last year."',
                            'answer': 'Change "was" to "were"',
                            'explanation': 'Type 2 mixed conditional requires subjunctive "were" for all subjects'
                        },
                        {
                            'question': 'Complete: If he _____ (be) more careful, he _____ (not lose) his wallet yesterday.',
                            'answer': 'were, would not have lost',
                            'explanation': 'Type 2 mixed conditional: present trait would have prevented past event'
                        },
                        {
                            'question': 'Choose correct: "If they had invested wisely, they _____ rich today." (a) would be (b) would have been',
                            'answer': '(a) would be',
                            'explanation': 'Past action (investing) affects present state (being rich)'
                        },
                        {
                            'question': 'Rewrite using inversion: If I had known about the meeting, I would be there now.',
                            'answer': 'Had I known about the meeting, I would be there now.',
                            'explanation': 'Inverted form drops "if" and moves "had" to the front'
                        }
                    ]

    # Update database
    cur.execute("""
        UPDATE topic_study_content
        SET content = %s, updated_at = NOW()
        WHERE subject_id = 'english'
          AND path_id = 'advanced'
          AND topic_id = 'mixed-conditionals'
    """, (json.dumps(content_json),))

    conn.commit()
    print("\n✅ Mixed Conditionals content added successfully!")
    print("   - Section 2: Formula with 3 examples")
    print("   - Section 3: Formula with 3 examples")
    print("   - Section 4: Table with 5 pattern variations")
    print("   - Section 6: Comparison table with 4 rows")
    print("   - Section 8: 5 practice questions\n")

else:
    print("\n⚠️ Mixed Conditionals topic not found!\n")

cur.close()
conn.close()
