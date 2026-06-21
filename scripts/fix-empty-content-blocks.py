#!/usr/bin/env python3
"""
Fix empty content blocks in IELTS/TOEFL study materials.
Finds lightbulb notes and other content blocks that are missing text.
"""

import os
import sys
import json
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

def find_empty_blocks():
    """Find all content blocks that are empty or missing content."""
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT topic_id, title, content
        FROM topic_study_content
        WHERE subject_id = 'english'
          AND path_id = 'ielts-toefl'
        ORDER BY topic_id
    """)

    results = []

    for row in cur.fetchall():
        topic_id, title, content_json = row
        sections = content_json.get('sections', [])

        for section_idx, section in enumerate(sections):
            section_title = section.get('title', '')

            # Handle markdown format (single string) vs structured format (array of blocks)
            content = section.get('content')

            # Skip markdown-format sections (TOEFL Integrated uses this)
            if isinstance(content, str):
                continue

            # Process structured content blocks
            content_blocks = content if isinstance(content, list) else []

            for block_idx, block in enumerate(content_blocks):
                # Skip if block is a string (shouldn't happen, but defensive)
                if not isinstance(block, dict):
                    continue

                block_type = block.get('type', 'unknown')

                # Check if block is empty
                is_empty = False
                empty_reason = None

                if block_type == 'paragraph':
                    text = block.get('text', '')
                    if not text or len(text.strip()) < 10:
                        is_empty = True
                        empty_reason = f"Empty paragraph (length: {len(text)})"

                elif block_type == 'note':
                    note_content = block.get('content', '')
                    note_text = block.get('text', '')
                    if not note_content and not note_text:
                        is_empty = True
                        empty_reason = "Note has no content or text field"
                    elif note_content and len(note_content.strip()) < 10:
                        is_empty = True
                        empty_reason = f"Note content too short (length: {len(note_content)})"

                elif block_type == 'table':
                    rows = block.get('rows', [])
                    if not rows or len(rows) == 0:
                        is_empty = True
                        empty_reason = "Table has no rows"

                elif block_type == 'list':
                    items = block.get('items', [])
                    if not items or len(items) == 0:
                        is_empty = True
                        empty_reason = "List has no items"

                if is_empty:
                    results.append({
                        'topic_id': topic_id,
                        'topic_title': title,
                        'section_idx': section_idx,
                        'section_title': section_title,
                        'block_idx': block_idx,
                        'block_type': block_type,
                        'reason': empty_reason,
                        'block_data': block
                    })

    cur.close()
    conn.close()

    return results

def generate_content_for_block(topic_id, section_title, block_type, block_data):
    """Generate appropriate content for empty blocks based on context."""

    # IELTS Reading - Band Score Calculation lightbulb
    if topic_id == 'ielts-reading' and 'Band Score' in section_title and block_type == 'note':
        return {
            'type': 'note',
            'icon': '💡',
            'title': 'Key Point',
            'content': 'Band scores are NOT calculated as simple percentages. IELTS uses a conversion table that varies slightly between Academic and General Training tests. A score of 30/40 typically equals Band 7.0, but this can vary by ±0.5 bands depending on the test difficulty.'
        }

    # IELTS Writing - Band Score Calculation
    if topic_id == 'ielts-writing' and 'Band Score' in section_title and block_type == 'note':
        return {
            'type': 'note',
            'icon': '💡',
            'title': 'Scoring Breakdown',
            'content': 'Task 1 contributes 33% and Task 2 contributes 67% to your overall Writing band score. Each task is marked on 4 criteria: Task Achievement/Response, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy. Examiners award band scores in 0.5 increments.'
        }

    # IELTS Listening - Band Score Calculation
    if topic_id == 'ielts-listening' and 'Band Score' in section_title and block_type == 'note':
        return {
            'type': 'note',
            'icon': '💡',
            'title': 'Conversion Table',
            'content': 'Listening scores are converted using a fixed table: 39-40 correct = Band 9.0, 37-38 = Band 8.5, 35-36 = Band 8.0, 32-34 = Band 7.5, 30-31 = Band 7.0, 26-29 = Band 6.5, 23-25 = Band 6.0. The conversion is the same for both Academic and General Training.'
        }

    # IELTS Speaking - Band Score Calculation
    if topic_id == 'ielts-speaking' and 'Band Score' in section_title and block_type == 'note':
        return {
            'type': 'note',
            'icon': '💡',
            'title': 'Assessment Criteria',
            'content': 'Examiners assess your performance across 4 criteria with equal weighting: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation. Each criterion is marked separately in 0.5 band increments, then averaged to produce your final Speaking band score.'
        }

    # Academic Vocabulary - Any empty notes
    if topic_id == 'academic-vocabulary' and block_type == 'note':
        return {
            'type': 'note',
            'icon': '💡',
            'title': 'Pro Tip',
            'content': 'Academic words are used across all university disciplines. Mastering these 570 word families will significantly improve your reading comprehension in academic texts and your writing quality in essays and research papers.'
        }

    # TOEFL Integrated - Empty notes
    if topic_id == 'toefl-integrated' and block_type == 'note':
        return {
            'type': 'note',
            'icon': '💡',
            'title': 'Time Management',
            'content': 'The integrated tasks test your ability to synthesize information from multiple sources under time pressure. Practice taking notes quickly and organizing your response within the strict time limits.'
        }

    # Default fallback - remove the block entirely
    return None

def fix_empty_blocks(empty_blocks):
    """Fix empty blocks by generating appropriate content or removing them."""
    conn = get_db_connection()
    cur = conn.cursor()

    # Group by topic_id
    by_topic = {}
    for block in empty_blocks:
        topic_id = block['topic_id']
        if topic_id not in by_topic:
            by_topic[topic_id] = []
        by_topic[topic_id].append(block)

    fixes_applied = 0

    for topic_id, blocks in by_topic.items():
        print(f"\n{'='*80}")
        print(f"Fixing {topic_id}")
        print(f"{'='*80}")

        # Fetch current content
        cur.execute("""
            SELECT content
            FROM topic_study_content
            WHERE subject_id = 'english'
              AND path_id = 'ielts-toefl'
              AND topic_id = %s
        """, (topic_id,))

        result = cur.fetchone()
        if not result:
            print(f"  ⚠️  Topic not found: {topic_id}")
            continue

        content_json = result[0]
        sections = content_json.get('sections', [])

        # Apply fixes
        for block_info in blocks:
            section_idx = block_info['section_idx']
            block_idx = block_info['block_idx']
            section_title = block_info['section_title']
            block_type = block_info['block_type']

            print(f"\n  Section {section_idx + 1}: {section_title}")
            print(f"    Block {block_idx + 1} ({block_type}): {block_info['reason']}")

            # Generate new content
            new_block = generate_content_for_block(
                topic_id,
                section_title,
                block_type,
                block_info['block_data']
            )

            if new_block:
                sections[section_idx]['content'][block_idx] = new_block
                print(f"    ✅ Fixed with generated content")
                fixes_applied += 1
            else:
                # Remove the block
                sections[section_idx]['content'].pop(block_idx)
                print(f"    ✅ Removed empty block")
                fixes_applied += 1

        # Update database
        cur.execute("""
            UPDATE topic_study_content
            SET content = %s, updated_at = NOW()
            WHERE subject_id = 'english'
              AND path_id = 'ielts-toefl'
              AND topic_id = %s
        """, (json.dumps(content_json), topic_id))

        conn.commit()
        print(f"\n  💾 Updated {topic_id} in database")

    cur.close()
    conn.close()

    return fixes_applied

def main():
    print("\n" + "="*80)
    print("IELTS/TOEFL Empty Content Blocks - Detection & Fix")
    print("="*80)

    # Step 1: Find empty blocks
    print("\n🔍 Scanning for empty content blocks...")
    empty_blocks = find_empty_blocks()

    if not empty_blocks:
        print("\n✅ No empty blocks found! All content is complete.")
        return

    print(f"\n⚠️  Found {len(empty_blocks)} empty blocks:")

    # Group by topic for summary
    by_topic = {}
    for block in empty_blocks:
        topic_id = block['topic_id']
        if topic_id not in by_topic:
            by_topic[topic_id] = []
        by_topic[topic_id].append(block)

    for topic_id, blocks in by_topic.items():
        print(f"\n  📂 {topic_id}: {len(blocks)} empty blocks")
        for block in blocks:
            print(f"      Section: {block['section_title']} | Block {block['block_idx'] + 1} ({block['block_type']})")
            print(f"      Reason: {block['reason']}")

    # Step 2: Apply fixes
    print(f"\n🔧 Applying fixes...")
    fixes = fix_empty_blocks(empty_blocks)

    print(f"\n{'='*80}")
    print(f"✅ Fixed {fixes} blocks successfully!")
    print(f"{'='*80}\n")

if __name__ == '__main__':
    main()
