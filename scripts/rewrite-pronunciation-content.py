#!/usr/bin/env python3
"""
REWRITE PRONUNCIATION CONTENT
Replace corrupted content with proper, well-written educational text
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

# New clean content for pronunciation-basics
PRONUNCIATION_BASICS_INTRO = """Pronunciation forms the foundation of effective spoken communication in English. For learners whose first language is Hindi, mastering English phonemes presents specific challenges due to fundamental differences between the phonological systems of the two languages.

Hindi contains approximately 46 phonemes, whilst English operates with roughly 44 distinct sounds, though the phonemic inventories differ substantially in their composition. The primary difficulty for Hindi speakers learning English pronunciation stems from the absence of certain English phonemes in Hindi, coupled with the presence of aspirated consonants in Hindi that do not exist in English in the same manner.

Additionally, English employs a stress-timed rhythm pattern, whereas Hindi follows a syllable-timed rhythm, leading to distinctive challenges in word stress and sentence intonation. This module addresses the six specific areas of interference, providing systematic guidance on articulating English phonemes correctly.

Through focused practice on minimal pairs, stress patterns, and articulatory placement, learners will develop the phonetic precision required for clear, comprehensible English speech in professional and academic contexts."""

# Get pronunciation-basics
cur.execute("""
    SELECT content FROM topic_study_content
    WHERE subject_id='english' AND path_id='foundation' AND topic_id='pronunciation-basics'
""")

result = cur.fetchone()
if result:
    content_json = result[0]
    sections = content_json['sections']

    # Replace Section 1 (Introduction) paragraph
    if len(sections) > 0 and len(sections[0]['content']) > 0:
        for block in sections[0]['content']:
            if isinstance(block, dict) and block.get('type') == 'paragraph':
                block['text'] = PRONUNCIATION_BASICS_INTRO
                break

    # Update database
    cur.execute("""
        UPDATE topic_study_content
        SET content = %s, updated_at = NOW()
        WHERE subject_id='english' AND path_id='foundation' AND topic_id='pronunciation-basics'
    """, (json.dumps(content_json),))

    print("✅ pronunciation-basics: Introduction rewritten")

# Fix phonics-vowels
PHONICS_INTRO = """English vowel sounds present unique challenges for learners, particularly those from Indian language backgrounds. The English vowel system contains 12 pure vowel sounds (monophthongs) and 8 diphthongs, compared to Hindi's simpler five-vowel system (अ, आ, इ, उ, ऋ).

The distinction between short and long vowels in English is crucial, as vowel length and quality can completely change word meaning, creating minimal pairs such as "ship" vs "sheep" or "bit" vs "beat". Hindi speakers often struggle with these distinctions because Hindi vowel length differences function differently.

This module systematically covers all English vowel sounds, starting with short vowels (as in "cat", "bed", "sit"), progressing through long vowels (as in "father", "see", "moon"), and culminating in diphthongs (as in "boy", "now", "day"). Each sound is presented with phonetic notation, mouth position diagrams, and contrasting examples from both English and Hindi to aid recognition and production.

Mastering these vowel distinctions is essential for clear communication in UPSC interviews, SSC examinations, and professional contexts where precise pronunciation demonstrates language proficiency."""

cur.execute("""
    SELECT content FROM topic_study_content
    WHERE subject_id='english' AND path_id='foundation' AND topic_id='phonics-vowels'
""")

result = cur.fetchone()
if result:
    content_json = result[0]
    sections = content_json['sections']

    if len(sections) > 0 and len(sections[0]['content']) > 0:
        for block in sections[0]['content']:
            if isinstance(block, dict) and block.get('type') == 'paragraph':
                block['text'] = PHONICS_INTRO
                break

    cur.execute("""
        UPDATE topic_study_content
        SET content = %s, updated_at = NOW()
        WHERE subject_id='english' AND path_id='foundation' AND topic_id='phonics-vowels'
    """, (json.dumps(content_json),))

    print("✅ phonics-vowels: Introduction rewritten")

# Fix speaking-basics
SPEAKING_INTRO = """Effective spoken English requires more than grammatical accuracy—it demands confidence, clarity, and cultural awareness of conversational norms. For Indian learners preparing for competitive examinations, job interviews, and professional environments, developing strong speaking skills is crucial for success.

This module covers essential speaking fundamentals, including common greetings, polite expressions, question formation, and conversational turn-taking. Unlike written English, spoken English employs contractions ("don't", "won't"), informal vocabulary, and reduced forms that may not be immediately obvious to learners accustomed to formal written texts.

Indian English speakers often face specific challenges, such as direct translation from regional languages, different intonation patterns, and unfamiliarity with idiomatic expressions. This course addresses these issues systematically, providing practical dialogues, pronunciation guidance, and cultural notes on appropriate register and formality levels.

Each lesson includes audio examples demonstrating natural speech rhythm and intonation, enabling learners to practice alongside native-like models. The focus is on building practical communication skills for real-world contexts: UPSC interviews, banking job interactions, customer service scenarios, and everyday professional exchanges."""

cur.execute("""
    SELECT content FROM topic_study_content
    WHERE subject_id='english' AND path_id='foundation' AND topic_id='speaking-basics'
""")

result = cur.fetchone()
if result:
    content_json = result[0]
    sections = content_json['sections']

    if len(sections) > 0 and len(sections[0]['content']) > 0:
        for block in sections[0]['content']:
            if isinstance(block, dict) and block.get('type') == 'paragraph':
                block['text'] = SPEAKING_INTRO
                break

    cur.execute("""
        UPDATE topic_study_content
        SET content = %s, updated_at = NOW()
        WHERE subject_id='english' AND path_id='foundation' AND topic_id='speaking-basics'
    """, (json.dumps(content_json),))

    print("✅ speaking-basics: Introduction rewritten")

conn.commit()

print("\n✅ All pronunciation topics rewritten with proper content")

cur.close()
conn.close()
