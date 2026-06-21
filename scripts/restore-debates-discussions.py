#!/usr/bin/env python3
"""Restore content to Debates & Discussions topic (9 empty sections)."""

import os
import json

# Read .env.local
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
      AND topic_id = 'debates-discussions'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])

    # Section 1: Introduction to Formal Discussions
    sections[0]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Formal discussions and debates are critical communication skills tested in UPSC interviews, SSC descriptive exams, and competitive group discussions. Unlike casual conversations, formal debates require structured arguments, respectful disagreement, and persuasive language while maintaining professional tone.'
        },
        {
            'type': 'note',
            'icon': '🎯',
            'title': 'Why This Matters',
            'content': 'UPSC CSE interviews test your ability to present opinions on controversial topics like reservation policies, environmental laws, or economic reforms. Banking exams (SBI PO, IBPS) include group discussions where formal debate skills directly impact selection.'
        }
    ]

    # Section 2: Expressing Opinions Formally
    sections[1]['content'] = [
        {
            'type': 'paragraph',
            'text': 'In formal settings, avoid starting with "I think" or "I feel" which sound uncertain. Use authoritative phrases that demonstrate confidence and research-backed reasoning.'
        },
        {
            'type': 'list',
            'title': 'Formal Opinion Phrases',
            'items': [
                'I would argue that... (shows you have considered multiple viewpoints)',
                'The evidence suggests that... (data-driven argument)',
                'It is widely acknowledged that... (cites consensus)',
                'From a practical standpoint... (grounds argument in reality)',
                'One could reasonably conclude that... (logical deduction)',
                'Research indicates that... (academic backing)'
            ]
        },
        {
            'type': 'example',
            'title': 'Weak vs Strong Opening',
            'examples': [
                {
                    'text': 'Weak: "I think online education is better." Strong: "The evidence suggests that online education offers unparalleled accessibility, particularly for students in rural areas where infrastructure remains a challenge."',
                    'explanation': 'Strong version cites evidence and provides specific reasoning'
                }
            ]
        }
    ]

    # Section 3: Agreeing Politely
    sections[2]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Simple agreement like "Yes, I agree" sounds abrupt and unengaged. Build on others\' points to show active listening and collaborative thinking.'
        },
        {
            'type': 'list',
            'title': 'Phrases for Polite Agreement',
            'items': [
                'I completely agree with your point about... and I would add that...',
                'That is an excellent observation. Building on that idea...',
                'You raise a valid concern regarding... Additionally...',
                'I share your view that... Furthermore...',
                'Your argument aligns with... which also demonstrates...'
            ]
        }
    ]

    # Section 4: Disagreeing Politely
    sections[3]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Disagreement in formal settings must be respectful and focused on ideas, not people. Avoid "You are wrong" or "That does not make sense." Instead, acknowledge merit before presenting counterarguments.'
        },
        {
            'type': 'list',
            'title': 'Phrases for Respectful Disagreement',
            'items': [
                'I understand your perspective, however...',
                'While I see merit in that argument, I would respectfully suggest...',
                'That is an interesting point, but we should also consider...',
                'I appreciate your viewpoint, though I would argue differently because...',
                'With all due respect, I believe there is another side to this issue...',
                'I take your point, yet the data tells a different story...'
            ]
        },
        {
            'type': 'example',
            'title': 'Professional Disagreement',
            'examples': [
                {
                    'text': 'Wrong: "No, that is incorrect." Right: "I understand your concern about privacy, but I would respectfully argue that the benefits of digital identity systems, such as reduced fraud and improved service delivery, outweigh the risks when proper safeguards are in place."',
                    'explanation': 'Acknowledge the concern, then present counterargument with reasoning'
                }
            ]
        }
    ]

    # Section 5: Interrupting Appropriately
    sections[4]['content'] = [
        {
            'type': 'paragraph',
            'text': 'In timed debates or group discussions, you may need to interject without being rude. Use polite interruption phrases rather than speaking over others.'
        },
        {
            'type': 'list',
            'title': 'Polite Interruption Phrases',
            'items': [
                'If I may interject briefly...',
                'Pardon me for interrupting, but...',
                'May I add a point here?',
                'Could I build on that idea?',
                'Before we move on, may I clarify...',
                'I apologize for interrupting, but I think this is crucial...'
            ]
        }
    ]

    # Section 6: Managing Time
    sections[5]['content'] = [
        {
            'type': 'paragraph',
            'text': 'In group discussions, dominating the conversation or remaining silent both hurt your score. Use turn-taking phrases to balance participation.'
        },
        {
            'type': 'list',
            'title': 'Turn-Taking Phrases',
            'items': [
                'I would like to hand over to [name] who has expertise in...',
                'What are your thoughts on this, [name]?',
                'I have shared my perspective; I would love to hear other viewpoints.',
                'To keep us on track, let me summarize before we proceed...',
                'We have limited time, so let me be concise...'
            ]
        }
    ]

    # Section 7: Persuasive Language
    sections[6]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Persuasion relies on rhetorical techniques: ethos (credibility), pathos (emotion), and logos (logic). Use all three to strengthen arguments.'
        },
        {
            'type': 'table',
            'headers': ['Technique', 'Example', 'Effect'],
            'rows': [
                ['Ethos (Credibility)', 'According to Nobel laureate Amartya Sen...', 'Builds authority'],
                ['Pathos (Emotion)', 'Imagine a child denied education due to poverty...', 'Evokes empathy'],
                ['Logos (Logic)', 'Data shows literacy rates correlate with GDP growth...', 'Appeals to reason'],
                ['Rhetorical Question', 'Can we afford to ignore climate change?', 'Engages audience'],
                ['Tricolon (Rule of 3)', 'Education empowers, liberates, and transforms.', 'Creates rhythm and emphasis']
            ]
        }
    ]

    # Section 8: Common Mistakes
    sections[7]['content'] = [
        {
            'type': 'list',
            'title': 'Mistakes Indian Learners Make',
            'items': [
                'Using "I am thinking that..." (wrong tense) → Say: "I believe that..."',
                'Saying "You are not understanding" → Say: "Perhaps I did not explain clearly..."',
                'Starting every sentence with "Actually..." (filler word)',
                'Using "Obviously" (sounds condescending) → Say: "It is clear that..."',
                'Saying "No doubt" → Say: "Undoubtedly" or "Without question"',
                'Mixing formal/informal: "The government should basically do something" → Drop "basically"'
            ]
        }
    ]

    # Section 9: Practice Debate Topics
    sections[8]['content'] = [
        {
            'type': 'practice',
            'questions': [
                {
                    'question': 'Debate: Should India prioritize economic growth over environmental protection?',
                    'hint': 'Use: "While... is important, we must also consider..." to show balanced thinking'
                },
                {
                    'question': 'Debate: Is social media doing more harm than good to society?',
                    'hint': 'Acknowledge both sides: "I concede that social media has democratized information, however..."'
                },
                {
                    'question': 'Debate: Should higher education be free in India?',
                    'hint': 'Use data: "Research indicates that countries with subsidized education see..."'
                },
                {
                    'question': 'Group Discussion: The future of work in India - Opportunities and challenges',
                    'hint': 'Practice turn-taking: "Building on [name]\'s point about automation..."'
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
          AND topic_id = 'debates-discussions'
    """, (json.dumps(content_json),))

    conn.commit()
    print("\n✅ Debates & Discussions - All 9 sections restored with content!")
    print("   - Added 18 content blocks")
    print("   - 6 lists with formal phrases")
    print("   - 3 examples of professional communication")
    print("   - 1 rhetorical techniques table")
    print("   - 4 practice debate topics\n")

cur.close()
conn.close()
