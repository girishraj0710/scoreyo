#!/usr/bin/env python3
"""
FIX CORRUPTED PARAGRAPHS
A previous script broke paragraphs into individual character blocks.
This script reconstructs proper paragraphs by concatenating consecutive single-char blocks.
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

print("\n" + "="*100)
print("FIXING CORRUPTED PARAGRAPHS (character-split blocks)")
print("="*100 + "\n")

# Get all English topics
cur.execute("""
    SELECT path_id, topic_id, title, content
    FROM topic_study_content
    WHERE subject_id='english'
    ORDER BY path_id, topic_id
""")

all_topics = cur.fetchall()
topics_fixed = 0
total_sections_fixed = 0

for path_id, topic_id, title, content_json in all_topics:
    sections = content_json.get('sections', [])
    modified = False

    for section in sections:
        content_blocks = section.get('content', [])

        # Check if corrupted (many single-char paragraph blocks)
        single_char_blocks = []
        for block in content_blocks:
            if isinstance(block, dict) and block.get('type') == 'paragraph':
                text = block.get('text', '')
                if len(text) == 1:
                    single_char_blocks.append(text)

        # If >50 single-char blocks, this section is corrupted
        if len(single_char_blocks) > 50:
            # Reconstruct: concatenate all single-char paragraph blocks into one
            reconstructed_text = []
            new_blocks = []
            char_buffer = []

            for block in content_blocks:
                if isinstance(block, dict) and block.get('type') == 'paragraph':
                    text = block.get('text', '')
                    if len(text) == 1:
                        char_buffer.append(text)
                    else:
                        # Non-single-char block found, flush buffer
                        if char_buffer:
                            reconstructed_text.append(''.join(char_buffer))
                            char_buffer = []
                        # Keep this block as-is
                        new_blocks.append(block)
                else:
                    # Non-paragraph block (example, note, etc.), flush buffer first
                    if char_buffer:
                        reconstructed_text.append(''.join(char_buffer))
                        char_buffer = []
                    new_blocks.append(block)

            # Flush remaining buffer
            if char_buffer:
                reconstructed_text.append(''.join(char_buffer))

            # Create single paragraph block with reconstructed text
            if reconstructed_text:
                final_text = ''.join(reconstructed_text)
                new_blocks.insert(0, {
                    'type': 'paragraph',
                    'text': final_text
                })

                section['content'] = new_blocks
                modified = True
                total_sections_fixed += 1

    if modified:
        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id='english' AND path_id=%s AND topic_id=%s
        """, (json.dumps(content_json), path_id, topic_id))

        topics_fixed += 1
        print(f"✅ {path_id}/{topic_id}: Reconstructed corrupted paragraphs")

conn.commit()

print("\n" + "="*100)
print(f"COMPLETE: {topics_fixed} topics fixed, {total_sections_fixed} sections reconstructed")
print("="*100 + "\n")

cur.close()
conn.close()
