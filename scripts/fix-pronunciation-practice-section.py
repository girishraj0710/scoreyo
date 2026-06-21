#!/usr/bin/env python3
"""
FIX PRONUNCIATION PRACTICE SECTION
Add real pronunciation practice exercises
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

# Real pronunciation practice questions
PRACTICE_QUESTIONS = [
    {
        'question': 'Which word has the /θ/ sound (as in "three")? Choose the odd one out: thank, tree, think, through',
        'answer': 'tree (the others have /θ/, "tree" has /tr/)',
        'explanation': 'The /θ/ sound requires placing your tongue between your teeth. "Tree" uses the /t/ sound instead.'
    },
    {
        'question': 'Pronounce these minimal pairs correctly: ship/sheep, bit/beat, sit/seat. What is the key difference?',
        'answer': 'Vowel length and quality: ship /ɪ/ (short), sheep /iː/ (long); bit /ɪ/, beat /iː/; sit /ɪ/, seat /iː/',
        'explanation': 'English distinguishes between short lax /ɪ/ and long tense /iː/. Hindi speakers must practice both length and tongue position.'
    },
    {
        'question': 'Identify the voiced "th" sound /ð/ in: this, think, that, three, they',
        'answer': 'this, that, they (voiced /ð/). "think" and "three" have voiceless /θ/',
        'explanation': 'Put your hand on your throat. /ð/ (this, that) vibrates. /θ/ (think, three) does not vibrate.'
    },
    {
        'question': 'Pronounce "very" correctly. Which sound should touch your lower lip with upper teeth?',
        'answer': '/v/ - upper teeth touch lower lip to make the "v" sound',
        'explanation': 'Hindi /व/ is produced differently. For English /v/, upper teeth must touch lower lip and vibrate.'
    },
    {
        'question': 'Say "street" without adding any vowel between "s" and "t". Can you blend /str/ smoothly?',
        'answer': '/striːt/ - all three consonants blend without interruption',
        'explanation': 'Hindi speakers tend to insert schwa: "suh-treet". Practice blending consonants in one smooth motion.'
    },
    {
        'question': 'Which syllable is stressed in "photograph"? PHO-to-graph or pho-TO-graph?',
        'answer': 'PHO-to-graph (first syllable stressed)',
        'explanation': 'English is stress-timed. Stressed syllables are longer and louder. Unstressed syllables reduce to schwa /ə/.'
    },
    {
        'question': 'Pronounce "knife" and "write". Should you pronounce the "k" and "w"?',
        'answer': 'No. Knife = /naɪf/ (silent k), write = /raɪt/ (silent w)',
        'explanation': 'Many English words have silent letters due to historical spelling. Learn common patterns: kn-, wr-, -mb, -bt.'
    },
    {
        'question': 'Does the word "book" end with a vowel sound? Should you add "uh" at the end?',
        'answer': 'No. Book = /bʊk/ - ends with consonant /k/, no extra vowel',
        'explanation': 'Hindi often adds inherent vowel /ə/ after consonants. English words end firmly on consonants without extra vowels.'
    },
    {
        'question': 'Which question has falling intonation: "Where are you going?" or "Are you going?"',
        'answer': '"Where are you going?" falls ↘. "Are you going?" rises ↗',
        'explanation': 'Wh-questions (what, where, when) fall. Yes/no questions rise. Hindi questions typically rise, causing interference.'
    },
    {
        'question': 'Pronounce "cat" /kæt/ and "cut" /kʌt/. Are they the same?',
        'answer': 'No. Cat = front vowel /æ/ (mouth wide open). Cut = back vowel /ʌ/ (neutral, relaxed)',
        'explanation': 'Hindi lacks both sounds. Practice: cat = "kay-at" (without the y). Cut = "uh" in "but".'
    },
    {
        'question': 'Say "third" /θɜːd/. Which two sounds are difficult for Hindi speakers?',
        'answer': '/θ/ (voiceless th) and /ɜː/ (schwa-r vowel)',
        'explanation': 'Hindi lacks both /θ/ (tongue between teeth) and /ɜː/ (similar to "er" in "her"). Practice: "th-er-d".'
    },
    {
        'question': 'Pronounce "vision" /ˈvɪʒən/. What is the middle consonant sound /ʒ/?',
        'answer': '/ʒ/ is like /श/ but voiced. Similar to "s" in "measure" or "pleasure"',
        'explanation': 'Hindi has /श/ (voiceless). English /ʒ/ is its voiced counterpart. Feel vibration in throat while saying it.'
    },
    {
        'question': 'Read aloud: "She sells seashells by the seashore." Which sound repeats: /s/ or /ʃ/?',
        'answer': 'Both /s/ (sells, seashells-first part) and /ʃ/ (she, seashells-second part, seashore)',
        'explanation': '/s/ = tongue behind teeth (sells). /ʃ/ = tongue back, lips rounded (she). Practice distinguishing them.'
    },
    {
        'question': 'How do you pronounce the "-ed" ending in: "walked", "wanted", "played"?',
        'answer': 'walked = /t/, wanted = /ɪd/, played = /d/ (three different pronunciations)',
        'explanation': 'After voiceless sounds → /t/. After /t/ or /d/ → /ɪd/. After voiced sounds → /d/. Hindi speakers often add full vowel.'
    },
    {
        'question': 'Say "comfortable" naturally. How many syllables in casual speech?',
        'answer': '3 syllables: COMF-ter-ble /ˈkʌmf.tə.bl̩/ (not 4: com-for-ta-ble)',
        'explanation': 'Native speakers reduce unstressed syllables. The "or" vowel disappears in fast speech: "cumf-ter-bl".'
    }
]

# Update pronunciation-basics Section 5
cur.execute("""
    SELECT content FROM topic_study_content
    WHERE subject_id='english' AND path_id='foundation' AND topic_id='pronunciation-basics'
""")

result = cur.fetchone()
if result:
    content_json = result[0]
    sections = content_json['sections']

    # Section 5 (index 4) - Practice Problems
    section5 = sections[4]

    # Replace with real practice
    section5['content'] = [
        {
            'type': 'paragraph',
            'text': 'These practice exercises target the most common pronunciation challenges for Hindi speakers. Try to answer each question, then check your pronunciation against the provided explanations. Record yourself and compare with native audio when possible.'
        },
        {
            'type': 'practice',
            'questions': PRACTICE_QUESTIONS
        },
        {
            'type': 'note',
            'title': 'Practice Tips',
            'content': 'Practice in front of a mirror to see tongue and lip positions. Record yourself using your phone. Listen critically and compare with native speakers. Focus on one problem sound per day rather than trying to fix everything at once. Minimal pairs (ship/sheep, cat/cut) are especially effective for targeted practice.'
        }
    ]

    # Update database
    cur.execute("""
        UPDATE topic_study_content
        SET content = %s, updated_at = NOW()
        WHERE subject_id='english' AND path_id='foundation' AND topic_id='pronunciation-basics'
    """, (json.dumps(content_json),))

    print("✅ pronunciation-basics Section 5: Added 15 real pronunciation practice questions")

conn.commit()
cur.close()
conn.close()
