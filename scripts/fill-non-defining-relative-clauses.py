#!/usr/bin/env python3
"""Fill 4 empty sections in Non-defining Relative Clauses topic."""

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
      AND topic_id = 'non-defining-relative-clauses'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])

    # Section 1: Introduction
    sections[0]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Non-defining relative clauses (also called non-restrictive clauses) add extra information about a noun that is already clearly identified. Unlike defining clauses, they do not restrict or limit the meaning of the noun. These clauses are always set off by commas and cannot be removed without changing the sentence structure, though the core meaning remains intact.'
        },
        {
            'type': 'table',
            'title': 'Defining vs Non-defining Clauses',
            'headers': ['Feature', 'Defining Clause', 'Non-defining Clause'],
            'rows': [
                ['Purpose', 'Essential identification', 'Extra information'],
                ['Commas', 'No commas', 'Always uses commas'],
                ['Can be removed?', 'No (meaning changes)', 'Yes (meaning stays same)'],
                ['Which/that', 'Both allowed', 'Only which (not that)'],
                ['Example', 'The book that I borrowed is on the table.', 'The Taj Mahal, which was built in 1632, is in Agra.']
            ]
        },
        {
            'type': 'note',
            'icon': '💡',
            'title': 'Key Difference',
            'content': 'In "My brother who lives in Delhi is a doctor" (no commas), the speaker has multiple brothers and is identifying which one. In "My brother, who lives in Delhi, is a doctor" (with commas), the speaker has one brother and is adding extra information about him.'
        }
    ]

    # Section 4: Relative Pronouns
    sections[3]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Non-defining clauses use specific relative pronouns depending on what they refer to. The most common are which (for things), who (for people), where (for places), and when (for times). Remember: "that" cannot be used in non-defining clauses.'
        },
        {
            'type': 'list',
            'title': 'Relative Pronouns in Non-defining Clauses',
            'items': [
                'which - for things, animals, or entire clauses: "The report, which took three hours to write, was approved."',
                'who - for people: "Dr. Sharma, who teaches at IIT, won the award."',
                'whom - for people as objects (formal): "The minister, whom we met yesterday, announced the policy."',
                'whose - for possession: "My colleague, whose son studies at Harvard, is retiring."',
                'where - for places: "Mumbai, where I was born, is a coastal city."',
                'when - for times: "December, when it gets very cold, is my favorite month."'
            ]
        },
        {
            'type': 'example',
            'title': 'Examples by Pronoun',
            'examples': [
                {
                    'text': 'which: The Indian Constitution, which is the longest written constitution, has 448 articles.',
                    'explanation': 'Adds extra fact about the Constitution'
                },
                {
                    'text': 'who: Mahatma Gandhi, who led the independence movement, believed in non-violence.',
                    'explanation': 'Additional information about a well-known person'
                },
                {
                    'text': 'where: The Red Fort, where the Prime Minister hoists the flag on August 15, is in Delhi.',
                    'explanation': 'Place already identified, adding context'
                }
            ]
        },
        {
            'type': 'note',
            'icon': '⚠️',
            'title': 'Common Error',
            'content': 'Never use "that" in non-defining clauses. Wrong: "The Taj Mahal, that is in Agra, is beautiful." Correct: "The Taj Mahal, which is in Agra, is beautiful."'
        }
    ]

    # Section 6: Common Mistakes
    sections[5]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Indian learners often make specific errors with non-defining clauses due to interference from Indian languages and confusion with defining clauses. Here are the most common mistakes and how to correct them:'
        },
        {
            'type': 'list',
            'title': 'Top 8 Mistakes',
            'items': [
                'Missing commas: Wrong - "My father who is a teacher retired." Correct - "My father, who is a teacher, retired."',
                'Using "that" instead of "which": Wrong - "The book, that I read, was good." Correct - "The book, which I read, was good."',
                'Missing second comma: Wrong - "Delhi, which is the capital is crowded." Correct - "Delhi, which is the capital, is crowded."',
                'Mixing defining and non-defining: Wrong - "Students, who study hard succeed." (This suggests all students study hard)',
                'Omitting relative pronoun: Wrong - "My brother, lives in USA, is visiting." Correct - "My brother, who lives in USA, is visiting."',
                'Using "whom" incorrectly: Wrong - "The girl, whom is smart, won." Correct - "The girl, who is smart, won." (subject, not object)',
                'Comma placement with names: Wrong - "My friend Ravi who is a doctor..." Correct - "My friend Ravi, who is a doctor..."',
                'Double commas in speech: Wrong - "He said, that, the plan, which was new, worked." (too many commas)'
            ]
        },
        {
            'type': 'note',
            'icon': '✓',
            'title': 'Quick Test',
            'content': 'To check if you need commas: Remove the clause. If the sentence still makes complete sense and identifies the noun clearly, use commas (non-defining). If removing it makes the sentence unclear or changes the meaning, no commas (defining).'
        }
    ]

    # Section 7: Indian Context Examples
    sections[6]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Here are 15+ authentic examples using Indian contexts, names, and situations relevant to competitive exams:'
        },
        {
            'type': 'example',
            'title': 'Indian Context Examples',
            'examples': [
                {
                    'text': 'Dr. APJ Abdul Kalam, who was known as the Missile Man, served as President from 2002 to 2007.',
                    'explanation': 'Famous person with additional biographical detail'
                },
                {
                    'text': 'The Ganges, which Hindus consider sacred, flows through several northern states.',
                    'explanation': 'River with religious context'
                },
                {
                    'text': 'Mumbai, where Bollywood is based, is India\'s financial capital.',
                    'explanation': 'City with industry information'
                },
                {
                    'text': 'The monsoon season, which lasts from June to September, is crucial for agriculture.',
                    'explanation': 'Time period with significance'
                },
                {
                    'text': 'IIT Delhi, whose graduates work worldwide, ranks among Asia\'s top universities.',
                    'explanation': 'Institution with achievements'
                },
                {
                    'text': 'My neighbor Rajesh, who works at Infosys, recently got promoted.',
                    'explanation': 'Person with workplace detail'
                },
                {
                    'text': 'The Supreme Court, which is located in New Delhi, has 34 judges.',
                    'explanation': 'Institution with factual information'
                },
                {
                    'text': 'Diwali, when families celebrate with lights and sweets, falls in October or November.',
                    'explanation': 'Festival with traditional practices'
                },
                {
                    'text': 'The Indian Railways, which employs over 1.3 million people, is one of the world\'s largest networks.',
                    'explanation': 'Organization with statistics'
                },
                {
                    'text': 'Kerala, where literacy rates exceed 95%, is known as "God\'s Own Country."',
                    'explanation': 'State with educational achievement'
                },
                {
                    'text': 'My cousin Priya, whom you met last year, has moved to Bangalore.',
                    'explanation': 'Personal connection with update'
                },
                {
                    'text': 'The RBI, which regulates banks, recently changed interest rates.',
                    'explanation': 'Banking context (relevant for SSC/Banking exams)'
                },
                {
                    'text': 'Hindi, which is spoken by over 40% of Indians, is written in Devanagari script.',
                    'explanation': 'Language with demographic data'
                },
                {
                    'text': 'January 26, when we celebrate Republic Day, is a national holiday.',
                    'explanation': 'Date with patriotic significance'
                },
                {
                    'text': 'The Himalayas, which form India\'s northern border, contain the world\'s highest peaks.',
                    'explanation': 'Geography with superlative'
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
          AND topic_id = 'non-defining-relative-clauses'
    """, (json.dumps(content_json),))

    conn.commit()
    print("\n✅ Non-defining Relative Clauses - All 4 sections filled!")
    print("   - Section 1: Introduction with comparison table")
    print("   - Section 4: Relative pronouns with 6 types + examples")
    print("   - Section 6: 8 common mistakes with corrections")
    print("   - Section 7: 15 Indian context examples\n")

cur.close()
conn.close()
