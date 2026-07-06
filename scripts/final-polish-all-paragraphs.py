#!/usr/bin/env python3
"""
FINAL POLISH: Fix remaining awkward paragraphs and short content
Replaces leftover fragments like "Key Rules is essential for understanding X"
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

def polish_paragraph(text, section_title):
    """Replace awkward leftover fragments with meaningful content"""
    if not text:
        return text

    original = text

    # Pattern 1: "Key Rules is essential for understanding X. Regular practice..."
    # Replace with section-appropriate content
    if re.match(r'^[A-Z][^\.]+ is essential for understanding', text):
        # Extract the topic from the sentence
        topic_match = re.search(r'understanding ([^.]+)\.', text)
        topic = topic_match.group(1) if topic_match else "English grammar"

        # Replace with meaningful content based on section
        if 'key rules' in section_title.lower() or 'core concepts' in section_title.lower():
            return f"Mastering {topic} requires understanding fundamental patterns and consistent practice. Pay attention to sentence structure, verb forms, and word order."
        elif 'introduction' in section_title.lower():
            return f"Understanding {topic} is essential for effective English communication. This section covers the fundamental concepts and practical applications."
        elif 'revision' in section_title.lower() or 'quick' in section_title.lower():
            return f"Review the key points of {topic} regularly to build automatic accuracy. Practice with real examples to reinforce your learning."
        else:
            return f"{topic.capitalize()} follows specific grammatical rules. Regular practice with authentic examples helps develop natural fluency."

    # Pattern 2: Very short paragraphs - expand them
    if len(text) < 40:
        if 'example' in section_title.lower():
            return f"{text} Study these examples carefully to understand how this concept works in real sentences."
        elif 'practice' in section_title.lower():
            return f"{text} Complete these exercises to test your understanding and build confidence."
        elif 'rule' in section_title.lower():
            return f"{text} Apply this rule consistently in your writing and speaking to improve accuracy."
        else:
            return f"{text} This fundamental concept appears frequently in both formal and informal English."

    return text

# Process ALL English topics
cur.execute("""
    SELECT path_id, topic_id, title, content
    FROM topic_study_content
    WHERE subject_id='english'
    ORDER BY path_id, topic_id
""")

all_topics = cur.fetchall()
fixed_count = 0
section_count = 0

print("\n" + "="*100)
print("FINAL POLISH: Fixing awkward paragraphs and short content")
print("="*100 + "\n")

for path_id, topic_id, title, content_json in all_topics:
    sections = content_json.get('sections', [])
    topic_modified = False

    for section in sections:
        section_title = section.get('title', '')
        content_blocks = section.get('content', [])
        section_modified = False

        for block in content_blocks:
            if not isinstance(block, dict):
                continue

            # Polish paragraphs
            if block.get('type') == 'paragraph':
                text = block.get('text', '')

                # Check if needs polishing
                needs_polish = (
                    'is essential for understanding' in text or
                    len(text) < 40 or
                    re.match(r'^[A-Z][^\.]+ is essential for', text)
                )

                if needs_polish:
                    polished = polish_paragraph(text, section_title)

                    if polished != text:
                        block['text'] = polished
                        section_modified = True

        if section_modified:
            section_count += 1
            topic_modified = True

    # Update database if modified
    if topic_modified:
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id='english' AND path_id=%s AND topic_id=%s
        """, (json.dumps(content_json), path_id, topic_id))

        fixed_count += 1
        print(f"✅ {path_id}/{topic_id}")
        conn.commit()

print(f"\n{'='*100}")
print(f"COMPLETE: {fixed_count} topics polished, {section_count} sections improved")
print(f"{'='*100}\n")

conn.close()
