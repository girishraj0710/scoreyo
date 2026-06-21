#!/usr/bin/env python3
"""Comprehensive cleanup of all IELTS/TOEFL topics - remove **, [ ], find empty content."""

import os
import json
import re
import psycopg2
from urllib.parse import urlparse, unquote

# Database connection
POSTGRES_URL = os.environ.get('POSTGRES_URL', "postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres")

def get_db_connection():
    """Get database connection."""
    parsed = urlparse(POSTGRES_URL)
    return psycopg2.connect(
        host=parsed.hostname,
        port=parsed.port or 5432,
        database=parsed.path[1:],
        user=parsed.username,
        password=unquote(parsed.password)
    )

def clean_text(text):
    """Remove all markdown formatting characters."""
    if not text or not isinstance(text, str):
        return text

    # Remove **bold**
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)

    # Remove *italic*
    text = re.sub(r'\*([^*]+)\*', r'\1', text)

    # Remove [ ] checkbox markers
    text = re.sub(r'\[\s*\]', '', text)
    text = re.sub(r'\[x\]', '✓', text, flags=re.IGNORECASE)

    # Remove markdown headers (###, ##, #) but keep the text
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)

    # Remove backticks for code
    text = re.sub(r'`([^`]+)`', r'\1', text)

    # Clean up multiple spaces
    text = re.sub(r'\s+', ' ', text)

    # Clean up leading/trailing whitespace
    text = text.strip()

    return text

def clean_content_block(block):
    """Clean a single content block."""
    if not isinstance(block, dict):
        return block

    block_type = block.get('type', '')

    if block_type == 'paragraph':
        if 'text' in block:
            block['text'] = clean_text(block['text'])

    elif block_type == 'note':
        if 'content' in block:
            block['content'] = clean_text(block['content'])
        if 'text' in block:
            block['text'] = clean_text(block['text'])
        if 'title' in block:
            block['title'] = clean_text(block['title'])

    elif block_type == 'list':
        if 'items' in block and isinstance(block['items'], list):
            block['items'] = [clean_text(item) for item in block['items']]

    elif block_type == 'example':
        if 'examples' in block and isinstance(block['examples'], list):
            cleaned_examples = []
            for ex in block['examples']:
                if isinstance(ex, str):
                    cleaned_examples.append(clean_text(ex))
                elif isinstance(ex, dict):
                    cleaned_ex = {}
                    for key, value in ex.items():
                        if isinstance(value, str):
                            cleaned_ex[key] = clean_text(value)
                        else:
                            cleaned_ex[key] = value
                    cleaned_examples.append(cleaned_ex)
            block['examples'] = cleaned_examples

    return block

conn = get_db_connection()
cur = conn.cursor()

# Fetch all IELTS/TOEFL topics
cur.execute("""
    SELECT topic_id, title, content
    FROM topic_study_content
    WHERE subject_id = 'english'
      AND path_id = 'ielts-toefl'
    ORDER BY topic_id
""")

print("\n" + "="*80)
print("COMPREHENSIVE CLEANUP - ALL IELTS/TOEFL TOPICS")
print("="*80)

all_results = []

for row in cur.fetchall():
    topic_id, title, content_json = row
    sections = content_json.get('sections', [])

    topic_issues = []
    blocks_cleaned = 0
    empty_blocks_found = 0
    formatting_issues = 0

    print(f"\n{'='*80}")
    print(f"📂 {title} ({topic_id})")
    print(f"{'='*80}")

    for section_idx, section in enumerate(sections):
        section_title = section.get('title', '')
        content = section.get('content')

        # Handle string content (markdown)
        if isinstance(content, str):
            original_content = content
            cleaned_content = clean_text(content)

            if original_content != cleaned_content:
                section['content'] = cleaned_content
                blocks_cleaned += 1

                # Count formatting issues
                formatting_issues += original_content.count('**')
                formatting_issues += original_content.count('[ ]')

                print(f"\n  Section {section_idx + 1}: {section_title}")
                print(f"    Type: Markdown string")
                print(f"    ✅ Cleaned formatting ({len(original_content)} → {len(cleaned_content)} chars)")

            # Check if empty
            if len(cleaned_content.strip()) < 20:
                empty_blocks_found += 1
                print(f"    ⚠️  VERY SHORT OR EMPTY CONTENT!")
                topic_issues.append(f"Section {section_idx + 1} ({section_title}): Empty or very short")

        # Handle array content (structured blocks)
        elif isinstance(content, list):
            section_has_issues = False

            for block_idx, block in enumerate(content):
                if not isinstance(block, dict):
                    continue

                block_type = block.get('type', '')

                # Check for empty blocks
                is_empty = False
                if block_type == 'paragraph':
                    text = block.get('text', '')
                    if len(text.strip()) < 10:
                        is_empty = True
                        empty_blocks_found += 1
                elif block_type == 'note':
                    note_content = block.get('content', '') or block.get('text', '')
                    if len(note_content.strip()) < 10:
                        is_empty = True
                        empty_blocks_found += 1
                elif block_type == 'list':
                    items = block.get('items', [])
                    if not items:
                        is_empty = True
                        empty_blocks_found += 1

                if is_empty:
                    if not section_has_issues:
                        print(f"\n  Section {section_idx + 1}: {section_title}")
                        section_has_issues = True
                    print(f"    ⚠️  Block {block_idx + 1} ({block_type}): EMPTY")
                    topic_issues.append(f"Section {section_idx + 1} ({section_title}), Block {block_idx + 1}: Empty {block_type}")

                # Check for formatting issues
                has_formatting = False
                if block_type == 'paragraph':
                    text = block.get('text', '')
                    if '**' in text or '[ ]' in text:
                        has_formatting = True
                        formatting_issues += text.count('**') + text.count('[ ]')
                elif block_type == 'note':
                    note_content = block.get('content', '') or block.get('text', '')
                    if '**' in note_content or '[ ]' in note_content:
                        has_formatting = True
                        formatting_issues += note_content.count('**') + note_content.count('[ ]')

                if has_formatting:
                    if not section_has_issues:
                        print(f"\n  Section {section_idx + 1}: {section_title}")
                        section_has_issues = True
                    print(f"    🧹 Block {block_idx + 1} ({block_type}): Has ** or [ ] formatting")

                # Clean the block
                original_block = json.dumps(block)
                cleaned_block = clean_content_block(block)

                if json.dumps(cleaned_block) != original_block:
                    content[block_idx] = cleaned_block
                    blocks_cleaned += 1

    # Update database for this topic
    if blocks_cleaned > 0 or empty_blocks_found > 0:
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = 'ielts-toefl'
              AND topic_id = %s
        """, (json.dumps(content_json), topic_id))

        conn.commit()

    # Summary for this topic
    status = "✅ CLEAN" if not topic_issues else "⚠️  HAS ISSUES"
    print(f"\n  Summary:")
    print(f"    Blocks cleaned: {blocks_cleaned}")
    print(f"    Formatting issues fixed: {formatting_issues}")
    print(f"    Empty blocks found: {empty_blocks_found}")
    print(f"    Status: {status}")

    all_results.append({
        'topic_id': topic_id,
        'title': title,
        'blocks_cleaned': blocks_cleaned,
        'formatting_issues': formatting_issues,
        'empty_blocks': empty_blocks_found,
        'issues': topic_issues,
        'status': status
    })

cur.close()
conn.close()

# Final summary
print(f"\n{'='*80}")
print("FINAL SUMMARY")
print(f"{'='*80}\n")

total_blocks_cleaned = sum(r['blocks_cleaned'] for r in all_results)
total_formatting_issues = sum(r['formatting_issues'] for r in all_results)
total_empty_blocks = sum(r['empty_blocks'] for r in all_results)

print(f"Topics processed: {len(all_results)}")
print(f"Total blocks cleaned: {total_blocks_cleaned}")
print(f"Total formatting issues fixed: {total_formatting_issues}")
print(f"Total empty blocks found: {total_empty_blocks}")

print(f"\n{'='*80}")
print("PER-TOPIC STATUS:")
print(f"{'='*80}\n")

for result in all_results:
    print(f"{result['status']} {result['title']}")
    if result['issues']:
        for issue in result['issues'][:3]:  # Show first 3 issues
            print(f"    - {issue}")
        if len(result['issues']) > 3:
            print(f"    ... and {len(result['issues']) - 3} more issues")

print(f"\n{'='*80}")
if total_empty_blocks == 0 and total_formatting_issues == 0:
    print("✅ ALL TOPICS ARE CLEAN!")
else:
    print("⚠️  Some issues remain - see details above")
print(f"{'='*80}\n")
