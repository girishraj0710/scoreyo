#!/usr/bin/env python3
"""Comprehensive validation of ALL English study topics across all paths."""

import os
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

def validate_block(block, block_idx, section_title):
    """Validate a single content block and return issues."""
    issues = []

    if not isinstance(block, dict):
        return issues

    block_type = block.get('type', 'unknown')

    # Check paragraphs
    if block_type == 'paragraph':
        text = block.get('text', '')
        if len(text.strip()) == 0:
            issues.append(f"Block {block_idx + 1} (paragraph): COMPLETELY EMPTY")
        elif len(text.strip()) < 20:
            issues.append(f"Block {block_idx + 1} (paragraph): Very short ({len(text)} chars): '{text}'")

        # Check for formatting issues
        if '**' in text or '[ ]' in text or '[x]' in text:
            issues.append(f"Block {block_idx + 1} (paragraph): Has markdown formatting")

    # Check notes
    elif block_type == 'note':
        content = block.get('content', '') or block.get('text', '')
        if len(content.strip()) == 0:
            issues.append(f"Block {block_idx + 1} (note): EMPTY NOTE")
        elif len(content.strip()) < 10:
            issues.append(f"Block {block_idx + 1} (note): Very short note")

        # Check for missing icon or title
        if not block.get('icon'):
            issues.append(f"Block {block_idx + 1} (note): Missing icon")
        if not block.get('title'):
            issues.append(f"Block {block_idx + 1} (note): Missing title")

    # Check examples
    elif block_type == 'example':
        examples = block.get('examples', [])
        if len(examples) == 0:
            # Check if there's a content field instead
            if not block.get('content'):
                issues.append(f"Block {block_idx + 1} (example): NO EXAMPLES (empty array)")
            else:
                issues.append(f"Block {block_idx + 1} (example): Has 'content' field instead of 'examples' array")

    # Check lists
    elif block_type == 'list':
        items = block.get('items', [])
        if len(items) == 0:
            issues.append(f"Block {block_idx + 1} (list): EMPTY LIST (no items)")

    # Check tables
    elif block_type == 'table':
        rows = block.get('rows', [])
        if len(rows) == 0:
            issues.append(f"Block {block_idx + 1} (table): EMPTY TABLE (no rows)")

    # Check practice blocks
    elif block_type == 'practice':
        questions = block.get('questions', [])
        if len(questions) == 0:
            # Check for single question field
            if not block.get('question'):
                issues.append(f"Block {block_idx + 1} (practice): NO QUESTIONS")
            else:
                issues.append(f"Block {block_idx + 1} (practice): Has 'question' field instead of 'questions' array")

    return issues

conn = get_db_connection()
cur = conn.cursor()

# Get ALL English topics across all paths
cur.execute("""
    SELECT path_id, topic_id, title, content
    FROM topic_study_content
    WHERE subject_id = 'english'
    ORDER BY path_id, topic_id
""")

print("\n" + "="*80)
print("COMPREHENSIVE VALIDATION - ALL ENGLISH STUDY TOPICS")
print("="*80)

all_results = []
topics_with_issues = []

for row in cur.fetchall():
    path_id, topic_id, title, content_json = row

    if not content_json or 'sections' not in content_json:
        topics_with_issues.append({
            'path': path_id,
            'topic': topic_id,
            'title': title,
            'issue': 'NO CONTENT JSON'
        })
        continue

    sections = content_json.get('sections', [])

    if len(sections) == 0:
        topics_with_issues.append({
            'path': path_id,
            'topic': topic_id,
            'title': title,
            'issue': 'NO SECTIONS'
        })
        continue

    topic_issues = []

    for section_idx, section in enumerate(sections):
        section_title = section.get('title', 'Untitled Section')
        content = section.get('content')

        # Handle markdown format
        if isinstance(content, str):
            if len(content.strip()) == 0:
                topic_issues.append(f"Section {section_idx + 1} ({section_title}): EMPTY MARKDOWN")
            elif len(content.strip()) < 50:
                topic_issues.append(f"Section {section_idx + 1} ({section_title}): Very short markdown ({len(content)} chars)")
            continue

        # Handle structured content
        if not isinstance(content, list):
            topic_issues.append(f"Section {section_idx + 1} ({section_title}): Invalid content format")
            continue

        if len(content) == 0:
            topic_issues.append(f"Section {section_idx + 1} ({section_title}): NO CONTENT BLOCKS")
            continue

        # Validate each block
        for block_idx, block in enumerate(content):
            block_issues = validate_block(block, block_idx, section_title)
            for issue in block_issues:
                topic_issues.append(f"Section {section_idx + 1} ({section_title}): {issue}")

    # Store results
    status = "✅ CLEAN" if len(topic_issues) == 0 else "⚠️ HAS ISSUES"
    all_results.append({
        'path': path_id,
        'topic': topic_id,
        'title': title,
        'sections': len(sections),
        'issues': topic_issues,
        'status': status
    })

    if len(topic_issues) > 0:
        topics_with_issues.append({
            'path': path_id,
            'topic': topic_id,
            'title': title,
            'issues': topic_issues
        })

cur.close()
conn.close()

# Summary
print(f"\n{'='*80}")
print("VALIDATION SUMMARY")
print(f"{'='*80}\n")

print(f"Total topics checked: {len(all_results)}")
print(f"Clean topics: {len([r for r in all_results if r['status'] == '✅ CLEAN'])}")
print(f"Topics with issues: {len(topics_with_issues)}")

# Group by path
paths = {}
for result in all_results:
    path = result['path'] or 'NO PATH'
    if path not in paths:
        paths[path] = {'clean': 0, 'issues': 0}

    if result['status'] == '✅ CLEAN':
        paths[path]['clean'] += 1
    else:
        paths[path]['issues'] += 1

print(f"\n{'='*80}")
print("BY PATH:")
print(f"{'='*80}\n")

for path, counts in sorted(paths.items()):
    total = counts['clean'] + counts['issues']
    status = "✅" if counts['issues'] == 0 else "⚠️"
    print(f"{status} {path}: {counts['clean']}/{total} clean")

# Detailed issues
if topics_with_issues:
    print(f"\n{'='*80}")
    print("TOPICS WITH ISSUES (Detailed):")
    print(f"{'='*80}\n")

    for topic in topics_with_issues:
        print(f"\n⚠️  {topic['path']} / {topic['title']} ({topic['topic']})")

        if isinstance(topic.get('issue'), str):
            # Topic-level issue
            print(f"    {topic['issue']}")
        else:
            # Content issues
            for issue in topic['issues'][:10]:  # Show first 10 issues
                print(f"    - {issue}")

            if len(topic['issues']) > 10:
                print(f"    ... and {len(topic['issues']) - 10} more issues")

print(f"\n{'='*80}")
if len(topics_with_issues) == 0:
    print("✅ ALL TOPICS ARE COMPLETE!")
else:
    print(f"⚠️  {len(topics_with_issues)} topics need attention")
print(f"{'='*80}\n")
