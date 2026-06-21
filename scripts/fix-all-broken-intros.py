#!/usr/bin/env python3
"""
FIX ALL BROKEN INTRODUCTIONS
Detect and rewrite all introduction paragraphs with spacing issues
"""

import os, json, re

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

def is_broken_text(text):
    """Check if text has spacing issues (words concatenated)"""
    if len(text) < 50:
        return False

    # Check first 100 chars - should have ~10-15 spaces for normal text
    first_100 = text[:100]
    space_count = first_100.count(' ')

    # If <5 spaces in first 100 chars, it's broken
    return space_count < 5

def generate_intro_for_topic(topic_id, title):
    """Generate a proper introduction based on topic"""

    # Topic-specific intros
    intros = {
        'present-simple': "The present simple tense is one of the most fundamental tenses in English grammar. It is used to express habits, general truths, repeated actions, and permanent situations. For Indian competitive exam aspirants, mastering the present simple is essential as it appears frequently in both written and spoken English sections of UPSC, SSC, banking, and other government examinations. This module covers formation rules, usage patterns, and common mistakes that Hindi speakers often make when using the present simple tense.",

        'past-simple': "The past simple tense is used to describe completed actions in the past. It is essential for narrating events, telling stories, and describing historical facts. Indian learners often confuse past simple with present perfect, leading to errors in competitive exams. This module explains the formation of regular and irregular past tense verbs, usage rules, and provides extensive practice exercises tailored for UPSC, SSC, and banking examination contexts.",

        'present-continuous': "The present continuous tense (also called present progressive) describes actions happening right now or temporary situations. It is formed using 'am/is/are + verb-ing'. This tense is crucial for describing ongoing events, future arrangements, and changing situations. For competitive exam aspirants, understanding when to use present continuous versus present simple is vital for both grammar sections and essay writing.",

        'present-perfect': "The present perfect tense connects past actions with the present. It is formed using 'have/has + past participle' and is used for experiences, recent actions, and situations that continue to the present. Indian learners often struggle with this tense because Hindi does not have a direct equivalent. This module provides clear rules, examples from Indian contexts, and practice exercises for UPSC, SSC, and other competitive examinations.",

        'future-simple': "The future simple tense expresses actions that will happen in the future. It is formed using 'will + base verb' and is one of the most straightforward tenses to learn. However, Indian learners sometimes confuse it with 'going to' future. This module clarifies the differences, provides usage guidelines, and includes practice questions relevant to competitive exam contexts.",

        'passive-voice': "The passive voice is a grammatical construction where the object of an action becomes the subject of the sentence. It is formed using 'be + past participle' and is widely used in formal writing, scientific texts, and official documents. For UPSC essay writing and SSC English sections, mastering passive voice is essential. This module covers passive constructions across all tenses with examples from Indian administrative and academic contexts.",

        'articles': "Articles ('a', 'an', 'the') are small words that have a big impact on meaning in English. For Hindi speakers, articles are particularly challenging because Hindi does not have articles. Incorrect article usage is one of the most common errors in Indian learners' English. This module systematically covers definite article 'the', indefinite articles 'a/an', and when to omit articles, with special focus on exam-relevant contexts.",

        'pronouns-detailed': "Pronouns replace nouns to avoid repetition and create cohesive text. English has several types of pronouns: personal, possessive, reflexive, relative, and demonstrative. Indian learners often make pronoun errors due to interference from regional languages. This comprehensive module covers all pronoun types with examples from competitive exam questions and formal writing contexts.",

        'modals': "Modal verbs (can, could, may, might, shall, should, will, would, must) express possibility, permission, obligation, and ability. They are unique because they do not change form for different subjects and are always followed by the base verb. Understanding modals is crucial for UPSC interviews, formal letter writing, and grammar sections in competitive exams. This module provides detailed explanations and practice exercises.",

        'conditionals': "Conditional sentences express 'if-then' relationships and are classified into zero, first, second, and third conditionals. Each type expresses different degrees of possibility and time frames. For Indian learners, conditionals are challenging because of complex verb form combinations. This module breaks down each conditional type with examples from real-life situations, exam contexts, and formal writing."
    }

    # Check if we have a specific intro
    for key in intros:
        if key in topic_id:
            return intros[key]

    # Generic intro based on title
    return f"{title} is an important topic in English grammar for competitive examination aspirants. This module covers the fundamental concepts, rules, and exceptions that are frequently tested in UPSC, SSC, banking, and other government exams. Through systematic explanations and practice exercises, learners will develop a strong understanding of this grammatical concept and its application in both written and spoken English. The content is specifically designed for Indian learners, addressing common errors and providing culturally relevant examples."

# Get all English topics
cur.execute("""
    SELECT path_id, topic_id, title, content
    FROM topic_study_content
    WHERE subject_id='english'
    ORDER BY path_id, topic_id
""")

all_topics = cur.fetchall()
fixed_count = 0

for path_id, topic_id, title, content_json in all_topics:
    sections = content_json.get('sections', [])

    if len(sections) == 0:
        continue

    # Check first section (Introduction)
    first_section = sections[0]
    content_blocks = first_section.get('content', [])

    if len(content_blocks) == 0:
        continue

    # Find paragraph block
    for block in content_blocks:
        if isinstance(block, dict) and block.get('type') == 'paragraph':
            text = block.get('text', '')

            if is_broken_text(text):
                # Generate new proper intro
                new_intro = generate_intro_for_topic(topic_id, title)
                block['text'] = new_intro

                # Update database
                cur.execute("""
                    UPDATE topic_study_content
                    SET content = %s, updated_at = NOW()
                    WHERE subject_id='english' AND path_id=%s AND topic_id=%s
                """, (json.dumps(content_json), path_id, topic_id))

                fixed_count += 1
                print(f"✅ {path_id}/{topic_id}: Fixed broken introduction")
                break

conn.commit()

print(f"\n{'='*80}")
print(f"COMPLETE: {fixed_count} topics fixed")
print(f"{'='*80}\n")

cur.close()
conn.close()
