#!/usr/bin/env python3
"""
ADD REAL PRONUNCIATION MISTAKES
Replace placeholder content in Common Mistakes sections with actual pronunciation errors
"""

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

# Real pronunciation mistakes for pronunciation-basics
PRONUNCIATION_MISTAKES = [
    {
        'word': 'Three',
        'text': 'Pronouncing "three" as "tree" or "free"',
        'error': 'Hindi speakers often replace the θ (theta) sound with /t/ or /f/',
        'correction': 'Place tongue between teeth and blow air: /θriː/. Not /triː/ or /friː/.',
        'why': 'Hindi lacks the dental fricative /θ/ sound. The closest sounds are /त/ (dental stop) or /फ/ (labial fricative).'
    },
    {
        'word': 'Thought',
        'text': 'Pronouncing "thought" as "taught" or "fought"',
        'error': 'Replacing /θ/ with /t/ or /f/ in "thought" /θɔːt/',
        'correction': 'Tongue tip between teeth: "th-ought" /θɔːt/, not "taught" /tɔːt/.',
        'why': 'Same issue - /θ/ doesn\'t exist in Hindi phonology.'
    },
    {
        'word': 'This',
        'text': 'Pronouncing "this" as "dis" or "zis"',
        'error': 'Replacing /ð/ (voiced th) with /d/ or /z/',
        'correction': 'Tongue between teeth, voice vibrating: /ðɪs/. Not /dɪs/ or /zɪs/.',
        'why': 'Hindi lacks /ð/ (voiced dental fricative). Speakers substitute with /द/ (dental stop).'
    },
    {
        'word': 'Very',
        'text': 'Pronouncing "very" as "wery" (mixing v/w sounds)',
        'error': 'Hindi speakers often use /व/ (which is between /v/ and /w/) for English /v/',
        'correction': 'Upper teeth touch lower lip for /v/: "very" /ˈveri/, not /ˈweri/.',
        'why': 'Hindi /व/ is a labiodental approximant, not a true /v/ (labiodental fricative).'
    },
    {
        'word': 'Ship vs Sheep',
        'text': 'Not distinguishing "ship" /ʃɪp/ from "sheep" /ʃiːp/',
        'error': 'Pronouncing both with same vowel length',
        'correction': 'Ship = short /ɪ/ (as in Hindi "इ"). Sheep = long /iː/ (hold for 2x duration).',
        'why': 'Hindi has vowel length distinction, but English short /ɪ/ is different from Hindi short /i/.'
    },
    {
        'word': 'Bit vs Beat',
        'text': 'Saying "bit" and "beat" identically',
        'error': 'Using same vowel quality for /ɪ/ and /iː/',
        'correction': 'Bit = relaxed, short /bɪt/. Beat = tense, long /biːt/.',
        'why': 'English /ɪ/ and /iː/ differ in both quality and length. Hindi /इ/ and /ई/ differ mainly in length.'
    },
    {
        'word': 'Cat vs Cut',
        'text': 'Confusing "cat" /kæt/ with "cut" /kʌt/',
        'error': 'Hindi speakers may use /का/ for both sounds',
        'correction': 'Cat = open mouth, front vowel /æ/. Cut = neutral, central /ʌ/.',
        'why': 'Hindi lacks both /æ/ (open front) and /ʌ/ (open-mid back) vowels.'
    },
    {
        'word': 'Word-final consonants',
        'text': 'Adding extra vowel after final consonants: "book-uh", "test-uh"',
        'error': 'Hindi syllable structure encourages consonant+vowel patterns',
        'correction': 'Close mouth firmly after final consonant: "book" /bʊk/, not /bʊkə/.',
        'why': 'Hindi words rarely end in consonant clusters, so speakers add schwa /ə/ (inherent vowel).'
    },
    {
        'word': 'Consonant clusters',
        'text': 'Breaking "street" into "suh-treet" or "school" into "suh-kool"',
        'error': 'Inserting vowels between consonants in clusters like /str/ or /sk/',
        'correction': 'Blend consonants smoothly: "street" /striːt/ (not /səˈtriːt/), "school" /skuːl/ (not /səˈkuːl/).',
        'why': 'Hindi allows fewer consonant clusters word-initially. /str/, /spl/, /skr/ are foreign.'
    },
    {
        'word': 'Question intonation',
        'text': 'Using flat or rising intonation for all questions',
        'error': 'Hindi intonation patterns differ: Hindi questions often rise at the end',
        'correction': 'Yes/no questions rise ↗. Wh-questions (what, where) fall ↘. "Where are you going?" ends LOW.',
        'why': 'English wh-questions have falling intonation, unlike Hindi where most questions rise.'
    },
    {
        'word': 'Word stress',
        'text': 'Equal stress on all syllables: "PHO-TO-GRAPH" instead of "PHO-to-graph"',
        'error': 'Hindi is syllable-timed (equal stress). English is stress-timed (unequal).',
        'correction': 'Stress first syllable: "PHO-to-graph" /ˈfəʊ.tə.ɡrɑːf/. Unstressed syllables reduce to schwa /ə/.',
        'why': 'English rhythm depends on stressed syllables. Hindi gives roughly equal time to each syllable.'
    },
    {
        'word': 'Silent letters',
        'text': 'Pronouncing the "k" in "knife" or "w" in "write"',
        'error': 'Hindi spelling is mostly phonetic, so learners pronounce all letters',
        'correction': 'Knife = /naɪf/ (silent k). Write = /raɪt/ (silent w). Bomb = /bɒm/ (silent b).',
        'why': 'English spelling is historical, not phonetic. Many letters are silent.'
    }
]

# Update pronunciation-basics
cur.execute("""
    SELECT content FROM topic_study_content
    WHERE subject_id='english' AND path_id='foundation' AND topic_id='pronunciation-basics'
""")

result = cur.fetchone()
if result:
    content_json = result[0]
    sections = content_json['sections']

    # Section 4 (index 3) - Common Mistakes
    section4 = sections[3]

    # Replace with real mistakes
    section4['content'] = [
        {
            'type': 'paragraph',
            'text': 'Hindi speakers commonly make these pronunciation errors due to phonological differences between Hindi and English. Understanding these mistakes helps target practice effectively.'
        },
        {
            'type': 'example',
            'title': 'Top 12 Pronunciation Mistakes by Hindi Speakers',
            'examples': [
                {
                    'text': f"❌ **{mistake['word']}**: {mistake['text']}",
                    'explanation': f"**Error**: {mistake['error']}\n\n**Correct pronunciation**: {mistake['correction']}\n\n**Why this happens**: {mistake['why']}"
                }
                for mistake in PRONUNCIATION_MISTAKES
            ]
        },
        {
            'type': 'note',
            'title': 'Practice Strategy',
            'content': 'Focus on minimal pairs (ship/sheep, bit/beat) and record yourself speaking. Compare with native audio. Practice problem sounds (/θ/, /ð/, /v/, /w/) in isolation before using them in words.'
        }
    ]

    # Update database
    cur.execute("""
        UPDATE topic_study_content
        SET content = %s, updated_at = NOW()
        WHERE subject_id='english' AND path_id='foundation' AND topic_id='pronunciation-basics'
    """, (json.dumps(content_json),))

    print("✅ pronunciation-basics Section 4: Added 12 real pronunciation mistakes")

conn.commit()
cur.close()
conn.close()
