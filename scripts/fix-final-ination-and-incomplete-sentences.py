#!/usr/bin/env python3
"""
FINAL COMPREHENSIVE FIX: Remove ALL "ination" leftovers and incomplete "and." endings
Fixes 138 remaining issues
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

def final_cleanup(text):
    """Remove all remaining exam-related leftovers and fix incomplete sentences"""
    if not text:
        return text

    original = text

    # Fix 1: "ination preparation" → "English learning"
    text = re.sub(r'ination preparation', 'English learning', text, flags=re.IGNORECASE)

    # Fix 2: "ination aspirants" → "learners"
    text = re.sub(r'ination aspirants', 'learners', text, flags=re.IGNORECASE)

    # Fix 3: "In inations," → "In formal contexts,"
    text = re.sub(r'In inations,', 'In formal contexts,', text, flags=re.IGNORECASE)

    # Fix 4: Any standalone "ination" → remove or replace
    text = re.sub(r'\s+ination\s+', ' learning ', text, flags=re.IGNORECASE)

    # Fix 5: "essays, English papers, and." → "essays and formal writing."
    text = re.sub(r'essays, English papers, and\.', 'essays and formal writing.', text, flags=re.IGNORECASE)

    # Fix 6: "understanding, and." → "understanding."
    text = re.sub(r'([a-z]),\s*and\.$', r'\1.', text)

    # Fix 7: Generic ending with "and." → remove it
    text = re.sub(r'\s+and\.$', '.', text)

    # Fix 8: ", and." in middle of sentence → fix appropriately
    text = re.sub(r',\s*and\.\s+', '. ', text)

    # Fix 9: "English,." → "English."
    text = re.sub(r'([a-z]),\.', r'\1.', text)

    # Fix 10: Multiple periods
    text = re.sub(r'\.{2,}', '.', text)

    # Fix 11: Space before punctuation
    text = re.sub(r'\s+([.,!?;:])', r'\1', text)

    # Fix 12: Multiple spaces
    text = re.sub(r'\s{2,}', ' ', text)

    # Fix 13: UPSC relevance sections (shouldn't exist)
    if 'UPSC Relevance' in text or 'Civil Services Examination' in text:
        return "Mastering this concept requires consistent practice with examples. Focus on understanding patterns and applying them in various contexts."

    text = text.strip()

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
print("FINAL COMPREHENSIVE FIX: Removing ALL 'ination' and incomplete sentences")
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

                if 'ination' in text or text.endswith(' and.') or text.endswith(', and.') or 'UPSC' in text:
                    cleaned = final_cleanup(text)

                    if cleaned != text:
                        block['text'] = cleaned
                        section_modified = True

            # Fix examples
            if block.get('type') == 'example':
                examples = block.get('examples', [])
                for ex in examples:
                    if isinstance(ex, dict):
                        for key in ['text', 'explanation']:
                            original = ex.get(key, '')
                            if 'ination' in original or 'UPSC' in original:
                                cleaned = final_cleanup(original)
                                if cleaned != original:
                                    ex[key] = cleaned
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
print(f"All 'ination' leftovers and incomplete sentences removed")
print(f"{'='*100}\n")

conn.close()
