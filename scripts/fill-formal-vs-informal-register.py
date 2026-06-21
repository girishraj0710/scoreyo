#!/usr/bin/env python3
"""Fill 3 empty sections in Formal vs Informal Register topic."""

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
      AND topic_id = 'formal-informal-register'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])

    # Section 1: Introduction to Register and Appropriateness
    sections[0]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Register refers to the level of formality used in language based on the context, audience, and purpose of communication. Choosing the appropriate register is crucial in Indian competitive exams (UPSC, SSC, Banking) and English proficiency tests (IELTS, TOEFL) where formal writing is expected in essays, letters, and reports, while informal language is used in personal communications.'
        },
        {
            'type': 'table',
            'title': 'Understanding Register Levels',
            'headers': ['Register Type', 'When to Use', 'Characteristics', 'Example Context'],
            'rows': [
                ['Formal', 'Official documents, academic writing, business letters', 'Complex sentences, passive voice, no contractions, impersonal tone', 'UPSC essays, job applications'],
                ['Semi-formal', 'Professional emails, work presentations, polite requests', 'Standard grammar, some personal pronouns, occasional contractions', 'Office emails, customer service'],
                ['Informal', 'Personal messages, conversations with friends, casual writing', 'Simple sentences, contractions, slang, personal tone', 'WhatsApp chats, personal letters'],
                ['Colloquial', 'Very casual speech, close relationships', 'Idioms, regional expressions, incomplete sentences', 'Speaking with close friends']
            ]
        },
        {
            'type': 'note',
            'icon': '🎯',
            'title': 'Register Appropriateness Rule',
            'content': 'Always match your register to your audience and purpose. Using informal language in a formal context (e.g., "Hey boss, can u gimme that report?") shows lack of professionalism. Using overly formal language with friends ("I would be most grateful if you could assist me") sounds unnatural and robotic.'
        },
        {
            'type': 'example',
            'title': 'Same Message, Different Registers',
            'examples': [
                {
                    'text': 'Formal: I regret to inform you that I am unable to attend the meeting scheduled for tomorrow.',
                    'explanation': 'Used for official communication with seniors or authorities'
                },
                {
                    'text': 'Semi-formal: I apologize, but I cannot attend tomorrow\'s meeting due to prior commitments.',
                    'explanation': 'Used for professional colleagues or clients'
                },
                {
                    'text': 'Informal: Sorry, I can\'t make it to the meeting tomorrow. Something came up!',
                    'explanation': 'Used for close colleagues or friends in work context'
                }
            ]
        }
    ]

    # Section 4: Using Passive Voice for Professional Distance
    sections[3]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Passive voice is a hallmark of formal register because it creates professional distance, emphasizes actions over actors, and sounds more objective. This is essential in official reports, research papers, policy documents, and formal essays where personal opinions should appear neutral and authoritative.'
        },
        {
            'type': 'list',
            'title': 'Why Passive Voice Creates Formality',
            'items': [
                '1. Removes Personal Agency: "Mistakes were made" vs "I made mistakes" - avoids direct blame',
                '2. Emphasizes Process: "The proposal has been approved" vs "The manager approved the proposal" - focuses on outcome',
                '3. Sounds Objective: "It is recommended that..." vs "I recommend that..." - appears neutral',
                '4. Fits Academic Style: Research papers use passive to describe procedures: "The samples were tested" not "We tested the samples"'
            ]
        },
        {
            'type': 'table',
            'title': '15 Informal → Formal Passive Transformations',
            'headers': ['Informal (Active)', 'Formal (Passive)'],
            'rows': [
                ['We will complete the report by Friday.', 'The report will be completed by Friday.'],
                ['The government should take immediate action.', 'Immediate action should be taken.'],
                ['People expect better healthcare facilities.', 'Better healthcare facilities are expected.'],
                ['The committee rejected the proposal.', 'The proposal was rejected by the committee.'],
                ['Experts have studied this issue thoroughly.', 'This issue has been studied thoroughly.'],
                ['Someone broke the window last night.', 'The window was broken last night.'],
                ['The company will announce the results tomorrow.', 'The results will be announced tomorrow.'],
                ['We must address this problem urgently.', 'This problem must be addressed urgently.'],
                ['The teacher explained the concept clearly.', 'The concept was explained clearly.'],
                ['Researchers conducted the survey in rural areas.', 'The survey was conducted in rural areas.'],
                ['The board has approved the budget.', 'The budget has been approved by the board.'],
                ['You can download the form from the website.', 'The form can be downloaded from the website.'],
                ['The manager sent the email to all employees.', 'The email was sent to all employees.'],
                ['Officials consider this a serious matter.', 'This is considered a serious matter.'],
                ['The government implemented new policies last year.', 'New policies were implemented last year.']
            ]
        },
        {
            'type': 'note',
            'icon': '⚠️',
            'title': 'When NOT to Use Passive',
            'content': 'Avoid passive voice when: (1) The actor is important ("Gandhi led the independence movement" not "The independence movement was led by Gandhi"), (2) You want direct, clear communication ("We apologize for the error" is better than "An apology is extended"), (3) Overuse makes writing wordy and unclear.'
        }
    ]

    # Section 5: 30+ Informal to Formal Transformations
    sections[4]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Master these 30+ transformations to instantly elevate your writing from informal to formal register. These are tested in SSC descriptive, UPSC precis writing, and IELTS/TOEFL essays.'
        },
        {
            'type': 'table',
            'title': 'Complete Transformation Guide (30+ Examples)',
            'headers': ['Informal', 'Formal'],
            'rows': [
                ['lots of/a lot of', 'numerous / many / a large number of'],
                ['kind of/sort of', 'somewhat / rather / to some extent'],
                ['get', 'receive / obtain / acquire / become'],
                ['find out', 'discover / ascertain / determine'],
                ['put up with', 'tolerate / endure'],
                ['go up/down', 'increase / decrease / rise / fall'],
                ['show', 'demonstrate / illustrate / indicate'],
                ['think', 'believe / consider / regard / deem'],
                ['look into', 'investigate / examine / explore'],
                ['point out', 'indicate / highlight / emphasize'],
                ['deal with', 'address / handle / manage'],
                ['because of', 'due to / owing to / on account of'],
                ['but', 'however / nevertheless / nonetheless'],
                ['so', 'therefore / thus / consequently / hence'],
                ['also', 'furthermore / moreover / additionally'],
                ['anyway', 'nevertheless / in any case'],
                ['basically', 'essentially / fundamentally'],
                ['nowadays', 'currently / presently / at present'],
                ['can\'t', 'cannot / is unable to'],
                ['don\'t', 'do not'],
                ['won\'t', 'will not / shall not'],
                ['it\'s important', 'it is essential / crucial / imperative'],
                ['very important', 'significant / vital / critical'],
                ['very bad', 'severe / serious / adverse'],
                ['very good', 'excellent / outstanding / superior'],
                ['help', 'assist / facilitate / support'],
                ['ask for', 'request / solicit'],
                ['tell', 'inform / notify / apprise'],
                ['start', 'commence / initiate / begin'],
                ['end', 'conclude / terminate / finalize'],
                ['buy', 'purchase / procure / acquire'],
                ['use', 'utilize / employ / apply'],
                ['need', 'require / necessitate'],
                ['want', 'desire / wish / seek'],
                ['maybe', 'perhaps / possibly / potentially']
            ]
        },
        {
            'type': 'example',
            'title': 'Before & After Examples',
            'examples': [
                {
                    'text': 'Informal: We need to find out why the project failed and fix the problems.',
                    'explanation': 'Formal: It is necessary to investigate the reasons for the project\'s failure and address the issues.'
                },
                {
                    'text': 'Informal: Lots of students can\'t afford college because fees are very high.',
                    'explanation': 'Formal: Numerous students are unable to afford higher education due to exorbitant fees.'
                },
                {
                    'text': 'Informal: The government should look into this issue and do something about it.',
                    'explanation': 'Formal: The government should examine this matter and take appropriate action.'
                }
            ]
        },
        {
            'type': 'note',
            'icon': '💡',
            'title': 'Practice Strategy',
            'content': 'To master formal register: (1) Replace ALL contractions, (2) Swap informal verbs with formal synonyms, (3) Use passive voice where appropriate, (4) Add transitional phrases, (5) Remove personal pronouns where possible. Practice rewriting newspaper articles from informal blogs to formal reports.'
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

    conn.commit()
    print("\n✅ Formal vs Informal Register - All 3 sections filled!")
    print("   - Section 1: Introduction with 4 register levels + examples")
    print("   - Section 4: Passive voice guide with 15 transformations")
    print("   - Section 5: 30+ informal → formal transformations table\n")

cur.close()
conn.close()
