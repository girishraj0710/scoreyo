#!/usr/bin/env python3
"""
COMPREHENSIVE ENGLISH CONTENT AUDIT
Test EVERY section of EVERY English topic for placeholder/generic content
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

# Placeholder text patterns
PLACEHOLDER_PATTERNS = [
    'This is a key concept in',
    'Students often confuse this with',
    'Practice is essential to master',
    '[Correct form]',
    '[Example sentence]',
    '[Correct option]',
    '[Sentence with error]',
    '[Corrected sentence]',
    '[Original sentence]',
    '[Transformed sentence]',
    'Apply the grammar rule',
    'Review the rules to identify',
    'The error violates',
    'Follow the transformation pattern',
    'Understanding this helps in competitive exams',
    'This section covers',
    'which is an essential part of English grammar',
    'Content is being prepared',
]

def is_placeholder_content(text):
    """Check if text contains placeholder patterns"""
    if not isinstance(text, str):
        return False

    for pattern in PLACEHOLDER_PATTERNS:
        if pattern.lower() in text.lower():
            return True

    return False

def is_generic_content(text):
    """Check if content is too generic (< 100 chars or too repetitive)"""
    if not isinstance(text, str):
        return False

    if len(text) < 50:
        return True

    # Check for repetitive patterns
    words = text.split()
    if len(set(words)) < len(words) * 0.3:  # <30% unique words
        return True

    return False

print("\n" + "="*100)
print("COMPREHENSIVE ENGLISH CONTENT AUDIT - ALL TOPICS, ALL SECTIONS")
print("="*100 + "\n")

# Get ALL English topics
cur.execute("""
    SELECT path_id, topic_id, title, content
    FROM topic_study_content
    WHERE subject_id='english'
    ORDER BY path_id, topic_id
""")

all_topics = cur.fetchall()
total_topics = len(all_topics)
total_sections_checked = 0
issues_found = []

for path_id, topic_id, title, content_json in all_topics:
    sections = content_json.get('sections', [])

    for s_idx, section in enumerate(sections):
        total_sections_checked += 1
        section_title = section.get('title', 'No title')
        content_blocks = section.get('content', [])

        section_issues = []

        # Check if section is empty
        if len(content_blocks) == 0:
            section_issues.append('EMPTY_SECTION')

        # Check each content block
        for b_idx, block in enumerate(content_blocks):
            if not isinstance(block, dict):
                section_issues.append(f'MALFORMED_BLOCK_{b_idx}')
                continue

            block_type = block.get('type', 'unknown')

            # Check paragraphs
            if block_type == 'paragraph':
                text = block.get('text', '')

                if is_placeholder_content(text):
                    section_issues.append('PLACEHOLDER_PARAGRAPH')
                elif is_generic_content(text):
                    section_issues.append('GENERIC_PARAGRAPH')
                elif len(text) < 100:
                    section_issues.append('SHORT_PARAGRAPH')

            # Check examples
            elif block_type == 'example':
                examples = block.get('examples', [])

                if len(examples) == 0:
                    section_issues.append('EMPTY_EXAMPLES')
                else:
                    for ex in examples:
                        if isinstance(ex, dict):
                            ex_text = ex.get('text', '')
                            if is_placeholder_content(ex_text):
                                section_issues.append('PLACEHOLDER_EXAMPLE')
                                break
                        elif isinstance(ex, str):
                            if is_placeholder_content(ex):
                                section_issues.append('PLACEHOLDER_EXAMPLE')
                                break

            # Check practice
            elif block_type == 'practice':
                questions = block.get('questions', [])

                if len(questions) == 0:
                    section_issues.append('EMPTY_PRACTICE')
                else:
                    for q in questions:
                        if isinstance(q, dict):
                            q_text = q.get('question', '')
                            a_text = q.get('answer', '')

                            if is_placeholder_content(q_text) or is_placeholder_content(a_text):
                                section_issues.append('PLACEHOLDER_PRACTICE')
                                break

                            if '[' in q_text or '[' in a_text:  # Literal brackets = placeholder
                                section_issues.append('PLACEHOLDER_PRACTICE')
                                break

        # Record issues if found
        if section_issues:
            issues_found.append({
                'path': path_id,
                'topic': topic_id,
                'title': title,
                'section_idx': s_idx,
                'section_title': section_title,
                'issues': list(set(section_issues))  # Unique issues
            })

# Print results
print(f"Topics checked: {total_topics}")
print(f"Sections checked: {total_sections_checked}")
print(f"Sections with issues: {len(issues_found)}\n")

if len(issues_found) == 0:
    print("✅ NO ISSUES FOUND - All content is proper!")
else:
    # Group by issue type
    issue_counts = {}
    for item in issues_found:
        for issue in item['issues']:
            issue_counts[issue] = issue_counts.get(issue, 0) + 1

    print("ISSUE SUMMARY:")
    for issue, count in sorted(issue_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {issue}: {count} occurrences")

    print("\n" + "="*100)
    print("DETAILED ISSUES (first 50):")
    print("="*100 + "\n")

    for i, item in enumerate(issues_found[:50], 1):
        print(f"{i}. {item['path']}/{item['topic']} - Section {item['section_idx']+1}: {item['section_title']}")
        print(f"   Issues: {', '.join(item['issues'])}")
        print()

    if len(issues_found) > 50:
        print(f"... and {len(issues_found) - 50} more issues")

# Save full report
report_path = '/tmp/english-content-audit-report.json'
with open(report_path, 'w') as f:
    json.dump({
        'total_topics': total_topics,
        'total_sections': total_sections_checked,
        'issues_count': len(issues_found),
        'issues': issues_found
    }, f, indent=2)

print(f"\n📄 Full report saved: {report_path}")
print("="*100 + "\n")

cur.close()
conn.close()
