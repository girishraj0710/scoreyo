#!/usr/bin/env python3
"""Add complete practice questions to Future Perfect Section 6"""

import os, json

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

cur.execute("""SELECT content FROM topic_study_content WHERE subject_id='english' AND path_id='advanced' AND topic_id='future-perfect'""")
content_json = cur.fetchone()[0]

# Section 6 - Practice Exercises
section6 = content_json['sections'][5]

# Add complete practice block with 10 questions
section6['content'].append({
    'type': 'practice',
    'questions': [
        {
            'question': 'By next month, I ___________ (complete) all my project reports.',
            'answer': 'will have completed',
            'explanation': 'Future perfect tense: will have + past participle (completed). The time marker "by next month" indicates completion before a future deadline.'
        },
        {
            'question': 'She ___________ (finish) her MBA before she turns 25.',
            'answer': 'will have finished',
            'explanation': 'Use "will have finished" (not "will finish") because the action will be completed before a specific future time (turning 25).'
        },
        {
            'question': 'By the time you arrive, we ___________ (leave) for the airport.',
            'answer': 'will have left',
            'explanation': 'Irregular verb: leave → left. The action of leaving will be completed before the future event of your arrival.'
        },
        {
            'question': 'By 2027, he ___________ (work) in this company for 10 years.',
            'answer': 'will have worked',
            'explanation': 'Expressing duration up to a future point. By 2027, the 10-year period will be complete.'
        },
        {
            'question': 'I ___________ (solve) 500 math problems by the end of this week.',
            'answer': 'will have solved',
            'explanation': 'Regular verb: solve → solved. The action will be completed by a specific future deadline (end of week).'
        },
        {
            'question': 'By the time the exam starts, she ___________ (study) for three months.',
            'answer': 'will have studied',
            'explanation': 'Showing duration up to a future event. Use "will have studied" to express the completed duration before exam day.'
        },
        {
            'question': 'They ___________ (graduate) from college before they start looking for jobs.',
            'answer': 'will have graduated',
            'explanation': 'One future action (graduation) completed before another future action (job hunting).'
        },
        {
            'question': 'By December, I ___________ (write) all six chapters of my thesis.',
            'answer': 'will have written',
            'explanation': 'Irregular verb: write → written. The writing will be completed by the December deadline.'
        },
        {
            'question': 'By the time admissions open, he ___________ (take) the IELTS test.',
            'answer': 'will have taken',
            'explanation': 'Irregular verb: take → taken. The test will be completed before the future event of admissions opening.'
        },
        {
            'question': 'She ___________ (complete) her certification course by next year.',
            'answer': 'will have completed',
            'explanation': 'Time marker "by next year" requires future perfect. The course completion happens before next year arrives.'
        }
    ]
})

# Update database
cur.execute("""
    UPDATE topic_study_content
    SET content = %s, updated_at = NOW()
    WHERE subject_id='english' AND path_id='advanced' AND topic_id='future-perfect'
""", (json.dumps(content_json),))

conn.commit()
print("✅ Added 10 complete practice questions to Future Perfect Section 6")

cur.close()
conn.close()
