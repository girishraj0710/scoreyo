#!/usr/bin/env python3
"""
INTELLIGENT SENTENCE RECONSTRUCTION
Fixes sentences broken by exam reference removal
Example: "This concept is frequently Regular practice" → "Regular practice improves accuracy."
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

def reconstruct_broken_sentences(text):
    """Intelligently fix sentences broken by regex removal"""
    if not text:
        return text

    original = text

    # Pattern 1: "This concept is frequently Regular practice improves"
    # Remove incomplete fragment "This concept is frequently", keep "Regular practice improves"
    text = re.sub(
        r'This concept is frequently\s+(?=Regular|Practice|[A-Z])',
        '',
        text
    )

    # Pattern 2: "is essential for understanding X. This concept is frequently Regular"
    # Remove entire broken sentence, keep only meaningful parts
    text = re.sub(
        r'^[A-Z][^\.]* is essential for understanding [^.]*\.\s*This concept is frequently\s+',
        '',
        text
    )

    # Pattern 3: "X is essential for understanding Y. Regular practice"
    # These are fine, just ensure proper ending

    # Pattern 4: Remove standalone fragments that don't make sense
    # "is essential for understanding X." without proper subject
    if re.match(r'^is essential for', text):
        # Remove this entire fragment
        text = re.sub(r'^is essential for understanding [^.]*\.\s*', '', text)

    # Pattern 5: "frequently tested" leftover fragments
    text = re.sub(r'\s*frequently tested\s*', ' ', text)
    text = re.sub(r'\s*is frequently\s*', ' ', text)

    # Pattern 6: Clean up resulting mess
    text = re.sub(r'\s{2,}', ' ', text)
    text = re.sub(r'\s+([.,!?;:])', r'\1', text)
    text = text.strip()

    # Pattern 7: If sentence is too short or broken, provide generic replacement
    if len(text) < 30 or not text:
        return "Regular practice with examples helps build fluency and accuracy."

    # Ensure proper capitalization
    if text and text[0].islower():
        text = text[0].upper() + text[1:]

    # Ensure proper ending
    if text and not text.endswith(('.', '!', '?', ':')):
        text += '.'

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
print("INTELLIGENT SENTENCE RECONSTRUCTION")
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

            # Fix paragraphs
            if block.get('type') == 'paragraph':
                text = block.get('text', '')

                # Check if text has broken patterns
                needs_fix = (
                    'is essential for understanding' in text or
                    'This concept is frequently' in text or
                    'is frequently' in text or
                    len(text) < 30
                )

                if needs_fix:
                    reconstructed = reconstruct_broken_sentences(text)

                    if reconstructed != text:
                        block['text'] = reconstructed
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
print(f"COMPLETE: {fixed_count} topics fixed, {section_count} sections reconstructed")
print(f"{'='*100}\n")

conn.close()
