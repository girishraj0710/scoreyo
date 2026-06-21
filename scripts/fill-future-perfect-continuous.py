#!/usr/bin/env python3
"""Fill 2 empty sections in Future Perfect Continuous topic."""

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

    # Section 8: Common Mistakes
    sections[7]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Indian learners make these 7 critical errors with Future Perfect Continuous due to its complexity and confusion with simpler tenses:'
        },
        {
            'type': 'list',
            'title': 'Top 7 Mistakes with Corrections',
            'items': [
                '❌ "I will have work for 5 hours." → ✅ "I will have been working for 5 hours." (Must use continuous form: will have been + verb-ing)',
                '❌ "She will have been finish the project." → ✅ "She will have finished the project." (Completion uses Future Perfect Simple, not Continuous)',
                '❌ "By 2030, I will be knowing him for 10 years." → ✅ "By 2030, I will have known him for 10 years." (Stative verbs like know, want, need use Future Perfect Simple)',
                '❌ "Will they have been went there?" → ✅ "Will they have been going there regularly?" (Use -ing form, and continuous implies repeated action)',
                '❌ "He will had been studying for 3 hours." → ✅ "He will have been studying for 3 hours." (Use "have" not "had" with will)',
                '❌ "By next week, I will have been complete my course." → ✅ "By next week, I will have completed my course." (Completion = Future Perfect Simple)',
                '❌ "Will have she been waiting?" → ✅ "Will she have been waiting?" (Correct order: Will + subject + have been + verb-ing)'
            ]
        },
        {
            'type': 'table',
            'title': 'When NOT to Use Future Perfect Continuous',
            'headers': ['Situation', 'Wrong', 'Correct', 'Reason'],
            'rows': [
                ['Stative Verbs', 'will have been knowing', 'will have known', 'Know, believe, want never use continuous'],
                ['Completion Focus', 'will have been finished', 'will have finished', 'Use Simple for completed actions'],
                ['Single Action', 'will have been arrive', 'will have arrived', 'Continuous needs duration, not instant actions'],
                ['No Time Reference', 'I will have been working (alone)', 'I will be working', 'Needs future time point: "by 5 PM"']
            ]
        },
        {
            'type': 'note',
            'icon': '⚠️',
            'title': 'Critical Rule',
            'content': 'This tense REQUIRES three elements: (1) Future time reference ("by 2025", "by next month"), (2) Duration expression ("for 5 years", "since 2020"), (3) Continuous verb form. Missing any element = wrong tense choice.'
        },
        {
            'type': 'example',
            'title': 'Error Analysis Examples',
            'examples': [
                {
                    'text': '❌ By December, I will have been pass my exam.',
                    'explanation': '✅ Correct: "will have passed" (Passing is completion, not duration - use Future Perfect Simple)'
                },
                {
                    'text': '❌ He will have been live in Mumbai for 10 years by 2025.',
                    'explanation': '✅ Correct: "will have been living" (Must use -ing form)'
                },
                {
                    'text': '❌ Will have been they waiting since morning?',
                    'explanation': '✅ Correct: "Will they have been waiting?" (Subject comes after "will")'
                }
            ]
        }
    ]

    # Section 9: Practice Exercises
    sections[8]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Test your mastery with these 15 practice exercises covering all aspects of Future Perfect Continuous:'
        },
        {
            'type': 'practice',
            'title': 'Exercise 1: Fill in the Blanks',
            'questions': [
                'By 2025, I __________ (work) at this company for 10 years.',
                'She __________ (study) English for 5 years by the time she takes IELTS.',
                'They __________ (live) in Delhi for two decades by next year.',
                'By June, we __________ (practice) yoga for six months.',
                'He __________ (not/wait) for an hour when you arrive at 3 PM.'
            ],
            'answers': [
                'will have been working',
                'will have been studying',
                'will have been living',
                'will have been practicing',
                'will not have been waiting / won\'t have been waiting'
            ]
        },
        {
            'type': 'practice',
            'title': 'Exercise 2: Correct the Errors',
            'questions': [
                'By 2030, climate change will have been affect millions of people. ❌',
                'She will have been finish her degree by next summer. ❌',
                'Will have they been prepare for UPSC for 2 years by December? ❌',
                'I will had been learning guitar for 3 years by my birthday. ❌',
                'By next month, he will have been know me for 5 years. ❌'
            ],
            'answers': [
                'will have been affecting (use -ing form)',
                'will have finished (completion uses Simple, not Continuous)',
                'Will they have been preparing (correct word order + -ing)',
                'will have been learning ("will have" not "will had")',
                'will have known (stative verbs use Simple, not Continuous)'
            ]
        },
        {
            'type': 'practice',
            'title': 'Exercise 3: Choose the Correct Tense',
            'questions': [
                'By 2025, I _____ (complete/have completed/have been completing) my MBA.',
                'He _____ (will work/will be working/will have been working) here for 5 years by December.',
                'They _____ (will travel/will be traveling/will have been traveling) for 10 hours when they land.',
                'By next week, she _____ (knows/will know/will have been knowing) the results.',
                'We _____ (will have run/will have been running/will run) this business for a decade by 2028.'
            ],
            'answers': [
                'will have completed (completion = Future Perfect Simple)',
                'will have been working (duration emphasized)',
                'will have been traveling (duration before landing)',
                'will know (stative verb, use Future Simple)',
                'will have been running (duration emphasized)'
            ]
        },
        {
            'type': 'practice',
            'title': 'Exercise 4: Transform to Future Perfect Continuous',
            'questions': [
                'He studies for 3 hours every day. (By 5 PM tomorrow...)',
                'They have been living in Chennai since 2020. (By 2025...)',
                'She works at TCS. She started in 2018. (By next year...)',
                'I practice coding daily. I started last month. (By next month...)',
                'We wait for the bus. We arrived at 8 AM. (By 9 AM...)'
            ],
            'answers': [
                'By 5 PM tomorrow, he will have been studying for 3 hours.',
                'By 2025, they will have been living in Chennai for 5 years.',
                'By next year, she will have been working at TCS for 7 years.',
                'By next month, I will have been practicing coding for two months.',
                'By 9 AM, we will have been waiting for the bus for one hour.'
            ]
        },
        {
            'type': 'note',
            'icon': '✓',
            'title': 'Answer Key Tips',
            'content': 'Check: (1) Did you use "will have been + verb-ing"? (2) Is there a future time reference? (3) Is there a duration? (4) Did you avoid stative verbs in continuous? If all yes, your answer is likely correct!'
        }
    ]

    # Update database
    cur.execute("""
        UPDATE topic_study_content
        SET content = %s, updated_at = NOW()
        WHERE subject_id = 'english'
          AND path_id = 'advanced'
          AND topic_id = 'future-perfect-continuous'
    """, (json.dumps(content_json),))

    conn.commit()
    print("\n✅ Future Perfect Continuous - All 2 sections filled!")
    print("   - Section 8: 7 common mistakes + error analysis table")
    print("   - Section 9: 4 practice exercises (20+ questions total)\n")

cur.close()
conn.close()
