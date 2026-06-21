#!/usr/bin/env python3
"""Fill 2 empty sections in Narrative Tenses topic."""

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
      AND topic_id = 'narrative-tenses'
""")

result = cur.fetchone()

if result:
    content_json = result[0]
    sections = content_json.get('sections', [])

    # Section 6: Complete Narrative Examples
    sections[5]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Here are 3 complete narratives demonstrating the seamless integration of all narrative tenses. Study how each tense serves a specific function in building the story:'
        },
        {
            'type': 'example',
            'title': 'Narrative 1: The Interview (UPSC/SSC Context)',
            'examples': [
                {
                    'text': 'Rajesh had been preparing for the UPSC exam for two years when he finally received the interview call. On the morning of his interview, the sun was shining brightly, and birds were singing in the trees. He woke up at 5 AM, got dressed in his best suit, and left home by 7. By the time he arrived at UPSC Bhawan, dozens of other candidates had already gathered outside. While he was waiting in the lobby, he noticed a familiar face—his college friend Priya, whom he hadn\'t seen since graduation. They talked for a few minutes before an officer called Rajesh\'s name. His heart was pounding as he walked into the interview room.',
                    'explanation': 'Tenses used: (1) Past Perfect Continuous - "had been preparing" (background duration), (2) Past Simple - "received, woke up, got dressed, left" (main events), (3) Past Continuous - "was shining, were singing, was waiting, was pounding" (background atmosphere), (4) Past Perfect Simple - "had gathered, hadn\'t seen" (earlier completed actions)'
                }
            ]
        },
        {
            'type': 'example',
            'title': 'Narrative 2: The Power Outage (Daily Life Story)',
            'examples': [
                {
                    'text': 'Last Tuesday evening, I was working on an important project when suddenly all the lights went out. It had been raining heavily for hours, and the storm had caused a power failure across the entire neighborhood. My laptop battery was running low because I hadn\'t charged it earlier. I lit a candle and tried to save my work using the remaining battery. While I was frantically typing, my phone rang—it was my manager asking about the deadline. I explained the situation, but he didn\'t seem convinced. By the time power returned at 10 PM, I had lost two hours of work. I worked until midnight to recover what I had been creating before the outage.',
                    'explanation': 'Notice: (1) Background setting with Past Continuous ("was working"), (2) Interrupting event with Past Simple ("went out"), (3) Earlier cause with Past Perfect ("had been raining"), (4) Simultaneous actions with Past Continuous ("was typing"), (5) Result by a time with Past Perfect ("had lost")'
                }
            ]
        },
        {
            'type': 'example',
            'title': 'Narrative 3: The Train Journey (Travel Story)',
            'examples': [
                {
                    'text': 'When the train pulled into Jaipur station at 6 AM, Meera was still sleeping in her berth. She had been traveling for twelve hours straight and was exhausted. The journey had started smoothly in Mumbai the previous evening—passengers were chatting, vendors were selling snacks, and children were playing in the aisles. But around midnight, the train stopped at a small station due to a signal problem. While they were waiting, Meera made friends with an elderly woman who told fascinating stories about her youth. By the time the train resumed its journey, Meera had learned more about Indian history than she had in school. Now, as the train finally arrived at her destination, she felt grateful for the unexpected delay that had given her such a memorable experience.',
                    'explanation': 'Complex narrative using: (1) Past Simple for main events ("pulled, started, stopped, resumed, arrived"), (2) Past Continuous for background ("was sleeping, were chatting, were selling, were waiting"), (3) Past Perfect Continuous for duration ("had been traveling"), (4) Past Perfect for earlier events ("had started, had learned"), (5) Mixed tenses to show time relationships'
                }
            ]
        },
        {
            'type': 'note',
            'icon': '📖',
            'title': 'Narrative Construction Formula',
            'content': 'Strong narratives follow this pattern: (1) Set scene with Past Continuous, (2) Introduce earlier background with Past Perfect, (3) Move story forward with Past Simple, (4) Add atmosphere with Past Continuous, (5) Show cause-effect with Past Perfect. Practice writing your own stories using this structure.'
        }
    ]

    # Section 9: Practice Exercises
    sections[8]['content'] = [
        {
            'type': 'paragraph',
            'text': 'Master narrative tenses with these comprehensive exercises covering all skills:'
        },
        {
            'type': 'practice',
            'title': 'Exercise 1: Choose the Correct Narrative Tense',
            'questions': [
                'When I (arrive) at the station, the train already (leave). ___________',
                'She (study) for 3 hours when her friend (call) her. ___________',
                'While they (walk) in the park, it suddenly (start) raining. ___________',
                'The children (play) cricket when their mother (tell) them to come inside. ___________',
                'By the time we (reach) the cinema, the movie (start). ___________'
            ],
            'answers': [
                'arrived (past simple) / had already left (past perfect)',
                'had been studying (past perfect continuous) / called (past simple)',
                'were walking (past continuous) / started (past simple)',
                'were playing (past continuous) / told (past simple)',
                'reached (past simple) / had started (past perfect)'
            ]
        },
        {
            'type': 'practice',
            'title': 'Exercise 2: Complete the Narrative (Fill in the Blanks)',
            'questions': [
                'Last Monday, Amit ________ (prepare) for his exam when his friend Rohit ________ (arrive) unexpectedly. Amit ________ (study) since morning and ________ (be) very tired. While they ________ (talk), Amit\'s phone ________ (ring). It ________ (be) his professor, who ________ (call) to postpone the exam. Amit was relieved because he ________ (not/finish) the entire syllabus.'
            ],
            'answers': [
                'was preparing (ongoing background)',
                'arrived (interrupting event)',
                'had been studying (duration before arrival)',
                'was (state description)',
                'were talking (ongoing action)',
                'rang (sudden event)',
                'was (state)',
                'was calling / called (ongoing or simple)',
                'had not finished / hadn\'t finished (action before that moment)'
            ]
        },
        {
            'type': 'practice',
            'title': 'Exercise 3: Correct the Errors in this Narrative',
            'questions': [
                'Yesterday, I was go to the market when I was seeing my old teacher. She was teach me in Class 10, and I am not meeting her for five years. While we talked, it was starting to rain. We were run to a nearby shop and were waiting there until the rain was stopping. By the time I was reaching home, I was completely wet because I was forgetting my umbrella.'
            ],
            'answers': [
                'Corrections: was go → went | was seeing → saw | was teach → taught / had taught | am not meeting → hadn\'t met | talked → were talking | was starting → started | were run → ran | were waiting → waited | was stopping → stopped | was reaching → reached | was forgetting → had forgotten'
            ]
        },
        {
            'type': 'practice',
            'title': 'Exercise 4: Write Your Own Narrative (200 words)',
            'questions': [
                'Write a narrative about "A Memorable Journey" using all four narrative tenses. Include: (1) Background setting (Past Continuous), (2) Main events (Past Simple), (3) Earlier background (Past Perfect), (4) Duration before event (Past Perfect Continuous). Structure: Introduction → Complication → Climax → Resolution.'
            ],
            'answers': [
                'Sample outline: Start with "Last summer, I was traveling..." → Set scene with continuous tenses → Introduce problem with simple past → Explain earlier context with past perfect → Show duration with past perfect continuous → Resolve with simple past. Check: Did you use at least 2 examples of each tense? Is the time sequence clear?'
            ]
        },
        {
            'type': 'practice',
            'title': 'Exercise 5: Identify the Tenses',
            'questions': [
                'Read this paragraph and identify all narrative tenses: "When the accident happened, I was driving home from work. I had been working late at the office because we had a major deadline. The roads were wet—it had been raining all evening. While I was approaching the traffic light, a car suddenly appeared from nowhere and crashed into the side of my vehicle. Fortunately, I had been driving slowly, so the impact wasn\'t severe."'
            ],
            'answers': [
                '1. happened (Past Simple) | 2. was driving (Past Continuous) | 3. had been working (Past Perfect Continuous) | 4. had (Past Simple) | 5. were (Past Simple) | 6. had been raining (Past Perfect Continuous) | 7. was approaching (Past Continuous) | 8. appeared (Past Simple) | 9. crashed (Past Simple) | 10. had been driving (Past Perfect Continuous) | 11. wasn\'t (Past Simple)'
            ]
        },
        {
            'type': 'note',
            'icon': '✍️',
            'title': 'Practice Strategy',
            'content': 'To master narrative tenses: (1) Read short stories and identify each tense, (2) Write daily journal entries about your day using all four tenses, (3) Convert news articles into narrative past tenses, (4) Record yourself telling a story and check tense usage, (5) Practice with UPSC/SSC essay topics requiring narration.'
        }
    ]

    # Update database
    cur.execute("""
        UPDATE topic_study_content
        SET content = %s, updated_at = NOW()
        WHERE subject_id = 'english'
          AND path_id = 'advanced'
          AND topic_id = 'narrative-tenses'
    """, (json.dumps(content_json),))

    conn.commit()
    print("\n✅ Narrative Tenses - All 2 sections filled!")
    print("   - Section 6: 3 complete narratives (Interview, Power Outage, Train Journey)")
    print("   - Section 9: 5 comprehensive practice exercises\n")

cur.close()
conn.close()
