#!/usr/bin/env python3
"""Fix Mixed Conditionals Section 7: Real-Life Applications - Add complete content."""

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
print("FIXING: Mixed Conditionals - Section 7: Real-Life Applications")
print("="*80 + "\n")

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

    # Section 7 (index 6) - Real-Life Applications
    if len(sections) > 6:
        section = sections[6]

        # Replace incomplete content with comprehensive examples
        section['content'] = [
            {
                'type': 'paragraph',
                'text': 'Mixed conditionals are commonly used in everyday conversations, especially when reflecting on past decisions and their current consequences. Here are authentic real-life scenarios where mixed conditionals naturally occur:'
            },
            {
                'type': 'example',
                'title': 'Career Decisions',
                'examples': [
                    {
                        'text': 'If I had studied engineering instead of arts, I would be earning more now.',
                        'explanation': 'Past education choice (didn\'t happen) affecting present salary situation'
                    },
                    {
                        'text': 'If she had accepted that job offer in Mumbai, she would be living far from her family today.',
                        'explanation': 'Past job decision affecting current location and lifestyle'
                    },
                    {
                        'text': 'If he had started his own business back then, he would be his own boss now.',
                        'explanation': 'Past entrepreneurial choice affecting present work situation'
                    }
                ]
            },
            {
                'type': 'example',
                'title': 'Education and Learning',
                'examples': [
                    {
                        'text': 'If I had learned English properly in school, I wouldn\'t be struggling with IELTS now.',
                        'explanation': 'Past learning habits affecting present language proficiency'
                    },
                    {
                        'text': 'If she had paid attention in math class, she would understand these concepts easily.',
                        'explanation': 'Past classroom behavior affecting present understanding'
                    },
                    {
                        'text': 'If they had practiced speaking regularly, they would be fluent by now.',
                        'explanation': 'Past practice habits affecting current fluency level'
                    }
                ]
            },
            {
                'type': 'example',
                'title': 'Health and Fitness',
                'examples': [
                    {
                        'text': 'If I had maintained a healthy diet in my 20s, I wouldn\'t have these health problems now.',
                        'explanation': 'Past eating habits affecting present health condition'
                    },
                    {
                        'text': 'If he had exercised regularly, he would be fit and active today.',
                        'explanation': 'Past fitness routine affecting current physical condition'
                    },
                    {
                        'text': 'If she had quit smoking earlier, she wouldn\'t be dealing with breathing issues now.',
                        'explanation': 'Past lifestyle choice affecting present health'
                    }
                ]
            },
            {
                'type': 'example',
                'title': 'Relationships and Family',
                'examples': [
                    {
                        'text': 'If I had stayed in touch with my school friends, I would still have their company.',
                        'explanation': 'Past social behavior affecting present relationships'
                    },
                    {
                        'text': 'If we had moved to Bangalore back then, our children would be studying in better schools now.',
                        'explanation': 'Past relocation decision affecting children\'s current education'
                    },
                    {
                        'text': 'If he had learned to communicate better, his marriage wouldn\'t be in trouble today.',
                        'explanation': 'Past communication habits affecting present relationship status'
                    }
                ]
            },
            {
                'type': 'example',
                'title': 'Financial Decisions',
                'examples': [
                    {
                        'text': 'If I had saved money regularly, I would have enough for a house down payment now.',
                        'explanation': 'Past saving habits affecting present financial situation'
                    },
                    {
                        'text': 'If they had invested in property years ago, they would be financially secure today.',
                        'explanation': 'Past investment decision affecting current financial security'
                    },
                    {
                        'text': 'If she had avoided credit card debt, she wouldn\'t be paying high interest now.',
                        'explanation': 'Past spending behavior affecting present financial burden'
                    }
                ]
            },
            {
                'type': 'note',
                'icon': '💬',
                'title': 'Why We Use Mixed Conditionals in Real Life',
                'content': 'Mixed conditionals help us express regret, explain current situations based on past choices, give advice based on hindsight, and reflect on alternative life paths. They\'re essential for mature, nuanced communication about life decisions and their consequences.'
            },
            {
                'type': 'example',
                'title': 'Indian Context Examples',
                'examples': [
                    {
                        'text': 'If I had cracked the UPSC exam in my first attempt, I would be an IAS officer now.',
                        'explanation': 'Common civil services aspiration - past exam result affecting present career'
                    },
                    {
                        'text': 'If my parents had bought a flat in Gurgaon in 2005, we would be living in a prime location today.',
                        'explanation': 'Real estate regret - past property decision affecting present lifestyle'
                    },
                    {
                        'text': 'If I had learned coding in college, I would be working at Google or Microsoft now.',
                        'explanation': 'Tech career regret - past skill development affecting present job'
                    },
                    {
                        'text': 'If she had gone abroad for her master\'s, she would have better career opportunities now.',
                        'explanation': 'Education abroad - past study decision affecting present prospects'
                    },
                    {
                        'text': 'If we had left for the airport earlier, we wouldn\'t be stuck in this traffic now.',
                        'explanation': 'Common Indian traffic scenario - past timing decision affecting present situation'
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
              AND topic_id = 'mixed-conditionals'
        """, (json.dumps(content_json),))

        conn.commit()
        print("✅ Section 7: Real-Life Applications - Complete content added!")
        print("   - 1 introduction paragraph")
        print("   - 5 example categories (Career, Education, Health, Relationships, Finance)")
        print("   - 15 real-life examples with explanations")
        print("   - 1 note explaining usage")
        print("   - 5 Indian context examples")
        print("   Total: 8 content blocks\n")

cur.close()
conn.close()

print("="*80)
print("✅ FIX COMPLETE")
print("="*80 + "\n")
