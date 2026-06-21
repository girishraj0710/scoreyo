#!/usr/bin/env python3
"""Fill 4 empty sections in Past Perfect Continuous topic."""

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
      AND topic_id = 'past-perfect-continuous'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])

    # Section 1: What Is the Past Perfect Continuous?
    sections[0]['content'] = [
        {
            'type': 'paragraph',
            'text': 'The Past Perfect Continuous (also called Past Perfect Progressive) is an advanced tense that shows an ongoing action that was in progress before another past event. It emphasizes the duration and continuity of the earlier action, not just its completion. This tense is essential for UPSC essays, SSC descriptive papers, and IELTS/TOEFL writing where you need to describe background activities or causes of past situations.'
        },
        {
            'type': 'formula',
            'formula': 'had been + verb-ing',
            'description': 'Core structure used for all subjects (I, you, he, she, it, we, they)',
            'examples': [
                {
                    'text': 'I had been studying for three hours when the power went out.',
                    'explanation': 'Shows the ongoing study activity before the power outage'
                },
                {
                    'text': 'They had been working on the project since January before it got approved.',
                    'explanation': 'Emphasizes the duration of work before approval'
                }
            ]
        },
        {
            'type': 'note',
            'icon': '⏱️',
            'title': 'Duration Focus',
            'content': 'This tense is NOT just about "what happened before." It specifically highlights HOW LONG something was happening. Always ask: "Was this activity ongoing for a period?" If yes, use Past Perfect Continuous.'
        }
    ]

    # Section 2: Core Concepts
    sections[1]['content'] = [
        {
            'type': 'list',
            'title': 'Three Key Concepts',
            'items': [
                '1. Two Past Time Points: There must be TWO past moments - an earlier ongoing action and a later past reference point',
                '2. Duration Emphasis: The focus is on how long the action continued, often with time expressions like "for 2 hours," "since morning," "all day"',
                '3. Cause-Effect Link: Often explains WHY something happened or describes the background situation leading to a result'
            ]
        },
        {
            'type': 'table',
            'title': 'Past Perfect Continuous vs Other Past Tenses',
            'headers': ['Tense', 'Focus', 'Example'],
            'rows': [
                ['Past Simple', 'Completed action', 'He studied for the exam.'],
                ['Past Continuous', 'Ongoing action at a specific past time', 'He was studying at 8 PM.'],
                ['Past Perfect', 'Completion before another past action', 'He had studied before the exam started.'],
                ['Past Perfect Continuous', 'Duration of ongoing action before past event', 'He had been studying for 3 hours when I called.']
            ]
        },
        {
            'type': 'example',
            'title': 'Concept Examples',
            'examples': [
                {
                    'text': 'She was tired because she had been running for 30 minutes.',
                    'explanation': 'Cause-effect: Ongoing running explains current tiredness'
                },
                {
                    'text': 'The roads were wet. It had been raining all morning.',
                    'explanation': 'Background situation: Explains visible result'
                }
            ]
        }
    ]

    # Section 4: When to Use Past Perfect Continuous
    sections[3]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Use this tense in specific situations where duration and continuity matter. Here are the 5 main scenarios:'
        },
        {
            'type': 'list',
            'title': 'When to Use',
            'items': [
                '1. Explaining Cause of Past Result: "He failed because he had been sleeping in class for weeks." (Duration explains failure)',
                '2. Describing Background Activity: "When I arrived, they had been discussing the proposal for hours." (Sets context)',
                '3. Showing Interrupted Duration: "I had been waiting for 20 minutes when the bus finally arrived." (Duration before arrival)',
                '4. Expressing Unfinished Past Activity: "She had been writing her thesis when her laptop crashed." (Activity in progress)',
                '5. Recent Past Activity with Evidence: "The ground was muddy. It had been raining." (Visible result of recent duration)'
            ]
        },
        {
            'type': 'table',
            'title': 'Time Expressions Often Used',
            'headers': ['Time Expression', 'Example Sentence'],
            'rows': [
                ['for + duration', 'They had been living in Mumbai for 5 years before moving.'],
                ['since + starting point', 'I had been learning guitar since 2015 when I got my first gig.'],
                ['all day/week/month', 'He had been preparing all month before the competition.'],
                ['before + past event', 'She had been working there before the company shut down.'],
                ['when + past simple', 'We had been traveling for 6 hours when the accident happened.']
            ]
        },
        {
            'type': 'note',
            'icon': '✓',
            'title': 'Quick Decision Rule',
            'content': 'If you can answer "How long was it happening before X occurred?" with a duration, use Past Perfect Continuous. If you only know "It happened before X," use Past Perfect Simple.'
        }
    ]

    # Section 8: Common Mistakes
    sections[7]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Indian learners make these 6 critical errors due to L1 interference and confusion with other tenses:'
        },
        {
            'type': 'list',
            'title': 'Top 6 Mistakes with Corrections',
            'items': [
                '❌ "I was studying for 3 hours." → ✅ "I had been studying for 3 hours when he called." (Use Past Perfect Continuous for duration before another past event)',
                '❌ "He had studied when I arrived." → ✅ "He had been studying when I arrived." (Use continuous for ongoing activity)',
                '❌ "She had been knew him for years." → ✅ "She had known him for years." (Stative verbs like know, believe, love do NOT use continuous)',
                '❌ "They had been finished the work." → ✅ "They had been working on it." OR "They had finished the work." (Don\'t use -ing with past participles)',
                '❌ "I had been went there before." → ✅ "I had been going there regularly." (Use continuous only for repeated/ongoing activity)',
                '❌ "Had been he waiting?" → ✅ "Had he been waiting?" (Correct question order: Had + subject + been + verb-ing)'
            ]
        },
        {
            'type': 'note',
            'icon': '⚠️',
            'title': 'Stative Verbs Warning',
            'content': 'These verbs are NEVER used in Past Perfect Continuous: know, understand, believe, want, need, love, hate, belong, seem, appear. Use Past Perfect Simple instead: "I had known him since 2010" (not "had been knowing").'
        },
        {
            'type': 'example',
            'title': 'Correct vs Incorrect Examples',
            'examples': [
                {
                    'text': '❌ The road was wet because it had been rained.',
                    'explanation': '✅ Correct: "because it had been raining." (Rain is the verb, not "rained")'
                },
                {
                    'text': '❌ We had been live in Delhi for 10 years.',
                    'explanation': '✅ Correct: "had been living in Delhi" (Use -ing form)'
                },
                {
                    'text': '❌ She had been finish her work before I came.',
                    'explanation': '✅ Correct: "had finished" (Completion uses Past Perfect Simple, not Continuous)'
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
          AND topic_id = 'past-perfect-continuous'
    """, (json.dumps(content_json),))

    conn.commit()
    print("\n✅ Past Perfect Continuous - All 4 sections filled!")
    print("   - Section 1: Definition with formula + examples")
    print("   - Section 2: 3 core concepts with comparison table")
    print("   - Section 4: 5 usage scenarios with time expressions")
    print("   - Section 8: 6 common mistakes with stative verb warning\n")

cur.close()
conn.close()
