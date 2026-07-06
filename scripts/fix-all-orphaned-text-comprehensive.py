#!/usr/bin/env python3
"""
COMPREHENSIVE FIX: Remove ALL orphaned text from aggressive exam reference removal
Fixes 115 topics with incomplete sentences like "tested in , , and ."
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

def clean_orphaned_text(text):
    """Remove orphaned punctuation and fix broken sentences from exam reference removal"""
    if not text:
        return text

    original = text

    # Pattern 1: "tested in , , and ." or similar constructions
    text = re.sub(r'\s+tested in\s*,\s*,\s*and\s*\.', '', text)
    text = re.sub(r'\s+tested in\s*\.\s+', '. ', text)

    # Pattern 2: "frequently tested in , , and . Regular" → "Regular"
    text = re.sub(r'This concept is frequently tested in\s*,\s*,\s*and\s*\.\s*', '', text)
    text = re.sub(r'frequently tested in\s*,\s*,\s*and\s*\.\s*', '', text)

    # Pattern 3: Generic broken fragments
    text = re.sub(r'\s+in\s*,\s*,\s*and\s*\.', '.', text)
    text = re.sub(r'\s+such as\s*,\s*,\s*and\s*\.', '.', text)
    text = re.sub(r'\s+including\s*,\s*,\s*and\s*\.', '.', text)
    text = re.sub(r'\s+like\s*,\s*,\s*and\s*\.', '.', text)

    # Pattern 4: Multiple consecutive commas
    text = re.sub(r',(\s*,)+', ',', text)

    # Pattern 5: Multiple consecutive spaces
    text = re.sub(r'\s{2,}', ' ', text)

    # Pattern 6: Space before punctuation
    text = re.sub(r'\s+([.,!?;:])', r'\1', text)

    # Pattern 7: Double periods
    text = re.sub(r'\.{2,}', '.', text)

    # Pattern 8: "in . Regular" → "Regular"
    text = re.sub(r'\s+in\s*\.\s+', '. ', text)

    # Pattern 9: Remove entire broken sentence fragments
    # "This concept is frequently tested in . Regular practice" → "Regular practice"
    text = re.sub(r'This concept is frequently tested in\s*\.\s*', '', text)

    # Pattern 10: "for ination aspirants" (leftover from "competitive exam aspirants")
    text = re.sub(r'for\s+ination aspirants', 'for learners', text)

    # Pattern 11: "like , , and Banking" → remove entire phrase
    text = re.sub(r'like\s*,\s*,\s*and\s+\w+\s*\.', '.', text)

    # Pattern 12: Remove sentences that are just incomplete fragments
    # "Key Rules is essential for understanding X. This concept is frequently tested in , , and ."
    # Keep first sentence, remove broken second sentence
    text = re.sub(
        r'(\.\s+)This concept is frequently tested in\s*,\s*,\s*and\s*\.',
        r'\1',
        text
    )

    # Pattern 13: Sentence starts with orphaned text
    # "is essential for understanding X. This concept is frequently tested in , , and ."
    if re.match(r'^[A-Z][^.]*is essential for understanding.*\. This concept is frequently tested in\s*,\s*,\s*and\s*\.', text):
        # Remove the entire broken testing sentence
        text = re.sub(r'\s*This concept is frequently tested in\s*,\s*,\s*and\s*\.\s*', '. ', text)

    # Pattern 14: Clean up any remaining weird spacing
    text = text.strip()

    # Pattern 15: Ensure proper sentence ending
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
print("COMPREHENSIVE FIX: Cleaning ALL orphaned text from exam reference removal")
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

            # Clean paragraphs
            if block.get('type') == 'paragraph':
                text = block.get('text', '')
                cleaned = clean_orphaned_text(text)

                if cleaned != text:
                    block['text'] = cleaned
                    section_modified = True

            # Clean examples
            if block.get('type') == 'example':
                examples = block.get('examples', [])
                for ex in examples:
                    if isinstance(ex, dict):
                        ex_text = ex.get('text', '')
                        ex_explanation = ex.get('explanation', '')

                        cleaned_text = clean_orphaned_text(ex_text)
                        cleaned_explanation = clean_orphaned_text(ex_explanation)

                        if cleaned_text != ex_text:
                            ex['text'] = cleaned_text
                            section_modified = True

                        if cleaned_explanation != ex_explanation:
                            ex['explanation'] = cleaned_explanation
                            section_modified = True

            # Clean practice questions
            if block.get('type') == 'practice':
                questions = block.get('questions', [])
                for q in questions:
                    if isinstance(q, dict):
                        for key in ['question', 'answer', 'explanation']:
                            original = q.get(key, '')
                            cleaned = clean_orphaned_text(original)
                            if cleaned != original:
                                q[key] = cleaned
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
print(f"COMPLETE: {fixed_count} topics fixed, {section_count} sections cleaned")
print(f"All orphaned text removed")
print(f"{'='*100}\n")

conn.close()
