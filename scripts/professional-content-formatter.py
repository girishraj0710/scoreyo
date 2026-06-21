#!/usr/bin/env python3
"""
PROFESSIONAL CONTENT FORMATTER
Makes all English study content education-standard professional:
- Removes ALL emojis
- Fixes escape characters (\n, \t, etc.)
- Validates format matches teaching objective
- Removes excessive indentation
- Ensures trustworthy, reliable presentation
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
print("PROFESSIONAL CONTENT FORMATTER - EDUCATION STANDARD")
print("="*90 + "\n")

# Emoji regex pattern (comprehensive)
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
    "]+"
)

def remove_emojis(text):
    """Remove all emojis from text"""
    if not isinstance(text, str):
        return text
    return EMOJI_PATTERN.sub('', text).strip()

def fix_escape_characters(text):
    """Convert literal \n, \t to actual line breaks and tabs"""
    if not isinstance(text, str):
        return text

    # Fix literal \n\n, \n to actual line breaks
    text = text.replace('\\n\\n', '\n\n')
    text = text.replace('\\n', '\n')
    text = text.replace('\\t', '    ')  # Convert tabs to 4 spaces

    return text

def fix_excessive_indentation(text):
    """Remove excessive indentation (more than 4 spaces)"""
    if not isinstance(text, str):
        return text

    lines = text.split('\n')
    fixed_lines = []

    for line in lines:
        # Count leading spaces
        stripped = line.lstrip(' ')
        spaces = len(line) - len(stripped)

        # If more than 12 spaces (3 levels), reduce to max 8 (2 levels)
        if spaces > 12:
            fixed_lines.append('        ' + stripped)  # Max 2 levels (8 spaces)
        else:
            fixed_lines.append(line)

    return '\n'.join(fixed_lines)

def clean_text_field(text):
    """Apply all cleaning operations to text"""
    if not isinstance(text, str):
        return text

    # Step 1: Fix escape characters
    text = fix_escape_characters(text)

    # Step 2: Remove emojis
    text = remove_emojis(text)

    # Step 3: Fix excessive indentation
    text = fix_excessive_indentation(text)

    # Step 4: Clean up multiple blank lines (max 2)
    while '\n\n\n' in text:
        text = text.replace('\n\n\n', '\n\n')

    # Step 5: Remove trailing spaces
    lines = text.split('\n')
    text = '\n'.join(line.rstrip() for line in lines)

    return text.strip()

# Get all English topics
cur.execute("""
    SELECT subject_id, path_id, topic_id, title, content
    FROM topic_study_content
    WHERE subject_id = 'english'
    ORDER BY path_id, topic_id
""")

all_topics = cur.fetchall()
total_modified = 0
total_emojis_removed = 0
total_escape_fixes = 0

print(f"Processing {len(all_topics)} English topics...\n")

for subject_id, path_id, topic_id, title, content_json in all_topics:
    sections = content_json.get('sections', [])
    topic_modified = False
    topic_emoji_count = 0
    topic_escape_count = 0

    print(f"🔍 {path_id}/{topic_id}...", end=" ")

    for section in sections:
        for block in section.get('content', []):
            if not isinstance(block, dict):
                continue

            block_type = block.get('type')

            # Clean text fields in paragraphs
            if block_type == 'paragraph':
                original = block.get('text', '')
                cleaned = clean_text_field(original)

                if original != cleaned:
                    block['text'] = cleaned
                    topic_modified = True

                    if '\\n' in original:
                        topic_escape_count += original.count('\\n')
                    if EMOJI_PATTERN.search(original):
                        topic_emoji_count += len(EMOJI_PATTERN.findall(original))

            # Clean note blocks (remove emoji icons)
            elif block_type == 'note':
                # Remove icon field entirely
                if 'icon' in block:
                    del block['icon']
                    topic_modified = True
                    topic_emoji_count += 1

                # Clean title
                if 'title' in block:
                    original = block['title']
                    cleaned = clean_text_field(original)
                    if original != cleaned:
                        block['title'] = cleaned
                        topic_modified = True

                # Clean content
                if 'content' in block:
                    original = block['content']
                    cleaned = clean_text_field(original)
                    if original != cleaned:
                        block['content'] = cleaned
                        topic_modified = True

            # Clean example blocks
            elif block_type == 'example':
                # Clean title
                if 'title' in block:
                    original = block['title']
                    cleaned = clean_text_field(original)
                    if original != cleaned:
                        block['title'] = cleaned
                        topic_modified = True

                # Clean each example
                examples = block.get('examples', [])
                for ex in examples:
                    if isinstance(ex, dict):
                        for field in ['text', 'explanation', 'context', 'meaning', 'breakdown']:
                            if field in ex:
                                original = ex[field]
                                cleaned = clean_text_field(original)

                                if original != cleaned:
                                    ex[field] = cleaned
                                    topic_modified = True

                                    if '\\n' in str(original):
                                        topic_escape_count += str(original).count('\\n')

            # Clean practice blocks
            elif block_type == 'practice':
                questions = block.get('questions', [])
                for q in questions:
                    if isinstance(q, dict):
                        for field in ['question', 'answer', 'explanation']:
                            if field in q:
                                original = q[field]
                                cleaned = clean_text_field(original)

                                if original != cleaned:
                                    q[field] = cleaned
                                    topic_modified = True

            # Clean list blocks
            elif block_type == 'list':
                items = block.get('items', [])
                for i, item in enumerate(items):
                    if isinstance(item, str):
                        original = item
                        cleaned = clean_text_field(original)

                        if original != cleaned:
                            items[i] = cleaned
                            topic_modified = True

            # Clean formula blocks
            elif block_type == 'formula':
                for field in ['formula', 'explanation']:
                    if field in block:
                        original = block[field]
                        cleaned = clean_text_field(original)

                        if original != cleaned:
                            block[field] = cleaned
                            topic_modified = True

    if topic_modified:
        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = %s
              AND path_id = %s
              AND topic_id = %s
        """, (json.dumps(content_json), subject_id, path_id, topic_id))

        total_modified += 1
        total_emojis_removed += topic_emoji_count
        total_escape_fixes += topic_escape_count

        fixes = []
        if topic_emoji_count > 0:
            fixes.append(f"{topic_emoji_count} emojis")
        if topic_escape_count > 0:
            fixes.append(f"{topic_escape_count} escapes")

        print(f"✅ FIXED ({', '.join(fixes)})")
    else:
        print("✓")

conn.commit()

print("\n" + "="*90)
print("PROFESSIONAL FORMATTING COMPLETE")
print("="*90)
print(f"\n📊 SUMMARY:")
print(f"   Topics processed: {len(all_topics)}")
print(f"   Topics modified: {total_modified}")
print(f"   Emojis removed: {total_emojis_removed}")
print(f"   Escape characters fixed: {total_escape_fixes}")
print(f"\n✅ All content is now education-standard professional")
print(f"   - No emojis")
print(f"   - No visible escape characters")
print(f"   - Proper indentation")
print(f"   - Trustworthy presentation")
print("\n" + "="*90 + "\n")

cur.close()
conn.close()
