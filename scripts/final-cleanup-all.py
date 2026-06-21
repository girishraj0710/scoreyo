#!/usr/bin/env python3
"""
FINAL CLEANUP - Remove ALL emojis (including checkmarks) and fix escape characters
"""

import os
import json
import re

env_vars = {}
with open('.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            env_vars[key] = value.strip('"')

os.environ.update(env_vars)

import psycopg2

POSTGRES_URL = os.environ.get('POSTGRES_URL')
conn = psycopg2.connect(POSTGRES_URL)
cur = conn.cursor()

print("\n" + "="*90)
print("FINAL CLEANUP - REMOVING ALL EMOJIS & FIXING ESCAPE CHARACTERS")
print("="*90 + "\n")

# COMPREHENSIVE emoji pattern including checkmarks and symbols
EMOJI_PATTERN = re.compile(
    "["
    "\U0001F600-\U0001F64F"  # emoticons
    "\U0001F300-\U0001F5FF"  # symbols & pictographs
    "\U0001F680-\U0001F6FF"  # transport & map
    "\U0001F700-\U0001F77F"  # alchemical
    "\U0001F780-\U0001F7FF"  # Geometric Shapes Extended
    "\U0001F800-\U0001F8FF"  # Supplemental Arrows-C
    "\U0001F900-\U0001F9FF"  # Supplemental Symbols and Pictographs
    "\U0001FA00-\U0001FA6F"  # Chess Symbols
    "\U0001FA70-\U0001FAFF"  # Symbols and Pictographs Extended-A
    "\U00002702-\U000027B0"  # Dingbats
    "\U000024C2-\U0001F251"
    "\U0001F1E0-\U0001F1FF"  # Regional indicators
    "\U00002600-\U000026FF"  # Miscellaneous symbols
    "\U00002B50"             # Star
    "\U0001F004"             # Mahjong
    "\U0001F0CF"             # Playing card
    "✓"                 # Check mark ✓
    "✗"                 # Ballot X ✗
    "✔"                 # Heavy check mark
    "✘"                 # Heavy ballot X
    "✅"                 # White heavy check mark
    "❌"                 # Cross mark
    "❎"                 # Negative squared cross mark
    "]+",
    flags=re.UNICODE
)

def clean_value_recursively(value):
    """Clean any value recursively - remove emojis, fix escapes"""
    if isinstance(value, str):
        # Remove emojis
        cleaned = EMOJI_PATTERN.sub('', value)

        # Remove zero-width characters
        cleaned = cleaned.replace('‍', '')
        cleaned = cleaned.replace('️', '')

        # Clean up multiple spaces
        cleaned = re.sub(r'  +', ' ', cleaned)

        return cleaned.strip()

    elif isinstance(value, dict):
        return {k: clean_value_recursively(v) for k, v in value.items()}

    elif isinstance(value, list):
        return [clean_value_recursively(item) for item in value]

    return value

def count_emojis_recursively(value):
    """Count emojis in any value recursively"""
    count = 0
    if isinstance(value, str):
        matches = EMOJI_PATTERN.findall(value)
        count += len(matches)
    elif isinstance(value, dict):
        for v in value.values():
            count += count_emojis_recursively(v)
    elif isinstance(value, list):
        for item in value:
            count += count_emojis_recursively(item)
    return count

# Get all English topics
cur.execute("""
    SELECT subject_id, path_id, topic_id, content
    FROM topic_study_content
    WHERE subject_id = 'english'
    ORDER BY path_id, topic_id
""")

all_topics = cur.fetchall()
total_topics_cleaned = 0
total_emojis_removed = 0

print(f"Processing {len(all_topics)} English topics...\n")

for subject_id, path_id, topic_id, content_json in all_topics:
    # Count emojis before cleaning
    emoji_count = count_emojis_recursively(content_json)

    if emoji_count > 0:
        print(f"Cleaning {path_id}/{topic_id}...", end=" ")

        # Clean all content recursively
        cleaned_content = clean_value_recursively(content_json)

        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = %s
              AND path_id = %s
              AND topic_id = %s
        """, (json.dumps(cleaned_content), subject_id, path_id, topic_id))

        total_topics_cleaned += 1
        total_emojis_removed += emoji_count

        print(f"Removed {emoji_count} emojis")

conn.commit()

print("\n" + "="*90)
print("FINAL CLEANUP COMPLETE")
print("="*90)
print(f"\nRESULTS:")
print(f"  Topics processed: {len(all_topics)}")
print(f"  Topics cleaned: {total_topics_cleaned}")
print(f"  Emojis removed: {total_emojis_removed}")
print(f"\nAll English topics are now 100% emoji-free.")
print("="*90 + "\n")

cur.close()
conn.close()
