#!/usr/bin/env python3
"""
CONTENT QUALITY VALIDATOR
Validates that content format matches teaching objective for each section.
Ensures education-standard quality and professional presentation.
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
print("CONTENT QUALITY VALIDATION - EDUCATION STANDARD")
print("="*90 + "\n")

# Validation rules based on section type
def validate_section_format(section_title, content_blocks, topic_id):
    """Validate that section format matches its teaching objective"""
    issues = []

    # Rule 1: "Formatting" or "Structure" sections should have well-formatted examples
    if any(word in section_title.lower() for word in ['formatting', 'structure', 'hierarchy', 'numbering']):
        has_proper_example = False
        for block in content_blocks:
            if isinstance(block, dict) and block.get('type') == 'example':
                examples = block.get('examples', [])
                for ex in examples:
                    if isinstance(ex, dict):
                        text = ex.get('text', '')
                        # Check if it has multiple lines and proper structure
                        if '\n' in text and len(text.split('\n')) > 3:
                            has_proper_example = True
                            break

        if not has_proper_example:
            issues.append({
                'severity': 'HIGH',
                'issue': 'Formatting section without well-formatted multi-line examples',
                'fix': 'Add examples with proper line breaks and hierarchy'
            })

    # Rule 2: "Sample" or "Example" sections should have complete examples
    if any(word in section_title.lower() for word in ['sample', 'full example', 'complete']):
        has_complete_example = False
        for block in content_blocks:
            if isinstance(block, dict) and block.get('type') == 'example':
                examples = block.get('examples', [])
                for ex in examples:
                    if isinstance(ex, dict):
                        text = ex.get('text', '')
                        # Complete examples should be substantial (>500 chars)
                        if len(text) > 500:
                            has_complete_example = True
                            break

        if not has_complete_example:
            issues.append({
                'severity': 'HIGH',
                'issue': 'Sample section without substantial complete examples',
                'fix': 'Add complete, detailed examples (500+ chars)'
            })

    # Rule 3: Practice sections should have clear questions and answers
    if 'practice' in section_title.lower() or 'exercise' in section_title.lower():
        has_practice_block = False
        for block in content_blocks:
            if isinstance(block, dict) and block.get('type') == 'practice':
                has_practice_block = True
                questions = block.get('questions', [])

                if len(questions) < 3:
                    issues.append({
                        'severity': 'MEDIUM',
                        'issue': f'Practice section has only {len(questions)} questions (recommend 5-10)',
                        'fix': 'Add more practice questions'
                    })

                for q in questions:
                    if isinstance(q, dict):
                        if not q.get('question') or len(str(q.get('question', ''))) < 10:
                            issues.append({
                                'severity': 'HIGH',
                                'issue': 'Practice question is too short or missing',
                                'fix': 'Write clear, complete questions'
                            })

                        if not q.get('answer') or str(q.get('answer', '')).strip() in ['[Answer to be added]', '']:
                            issues.append({
                                'severity': 'CRITICAL',
                                'issue': 'Practice answer is missing or placeholder',
                                'fix': 'Write complete, helpful answers'
                            })

        if not has_practice_block:
            issues.append({
                'severity': 'HIGH',
                'issue': 'Practice section without practice block',
                'fix': 'Add practice block with questions and answers'
            })

    # Rule 4: Avoid overly casual language
    casual_words = ['yeah', 'gonna', 'wanna', 'stuff', 'things', 'kinda', 'sorta']
    for block in content_blocks:
        if isinstance(block, dict):
            text_fields = []

            if block.get('type') == 'paragraph':
                text_fields.append(block.get('text', ''))
            elif block.get('type') == 'note':
                text_fields.append(block.get('content', ''))

            for text in text_fields:
                text_lower = text.lower()
                found_casual = [word for word in casual_words if f' {word} ' in f' {text_lower} ']
                if found_casual:
                    issues.append({
                        'severity': 'LOW',
                        'issue': f'Casual language detected: {", ".join(found_casual)}',
                        'fix': 'Use formal education-appropriate language'
                    })

    # Rule 5: Check for AI-like phrases
    ai_phrases = ['as an ai', 'i cannot', 'i apologize', 'unfortunately i', 'feel free to']
    for block in content_blocks:
        if isinstance(block, dict):
            text_fields = []

            if block.get('type') == 'paragraph':
                text_fields.append(block.get('text', ''))
            elif block.get('type') == 'note':
                text_fields.append(block.get('content', ''))

            for text in text_fields:
                text_lower = text.lower()
                found_ai = [phrase for phrase in ai_phrases if phrase in text_lower]
                if found_ai:
                    issues.append({
                        'severity': 'CRITICAL',
                        'issue': f'AI-generated phrase detected: {", ".join(found_ai)}',
                        'fix': 'Remove AI language, use human educational tone'
                    })

    return issues

# Get all English topics
cur.execute("""
    SELECT subject_id, path_id, topic_id, title, content
    FROM topic_study_content
    WHERE subject_id = 'english'
    ORDER BY path_id, topic_id
""")

all_topics = cur.fetchall()
total_issues = 0
topics_with_issues = []

print(f"Validating {len(all_topics)} English topics for quality and appropriateness...\n")

for subject_id, path_id, topic_id, title, content_json in all_topics:
    sections = content_json.get('sections', [])
    topic_issues = []

    for s_idx, section in enumerate(sections, 1):
        section_title = section.get('title', 'Untitled')
        content_blocks = section.get('content', [])

        section_issues = validate_section_format(section_title, content_blocks, topic_id)

        if section_issues:
            for issue in section_issues:
                topic_issues.append({
                    'section': s_idx,
                    'section_title': section_title,
                    **issue
                })

    if topic_issues:
        total_issues += len(topic_issues)
        topics_with_issues.append({
            'path': path_id,
            'topic': topic_id,
            'title': title,
            'issues': topic_issues
        })

print("="*90)
print("VALIDATION RESULTS")
print("="*90 + "\n")

if total_issues == 0:
    print("✅ ALL TOPICS PASSED QUALITY VALIDATION")
    print("   - Content format matches teaching objectives")
    print("   - Professional education-standard presentation")
    print("   - No AI-like language detected")
else:
    print(f"⚠️  Found {total_issues} quality issues across {len(topics_with_issues)} topics\n")

    # Show critical issues first
    critical = [t for t in topics_with_issues if any(i['severity'] == 'CRITICAL' for i in t['issues'])]
    if critical:
        print(f"🔴 CRITICAL ISSUES ({len(critical)} topics):\n")
        for topic in critical[:5]:  # Show first 5
            print(f"   {topic['path']}/{topic['topic']}:")
            for issue in topic['issues']:
                if issue['severity'] == 'CRITICAL':
                    print(f"      - Section {issue['section']}: {issue['issue']}")
        if len(critical) > 5:
            print(f"   ... and {len(critical) - 5} more topics with critical issues")

    # Show high priority issues
    high = [t for t in topics_with_issues if any(i['severity'] == 'HIGH' for i in t['issues'])]
    if high:
        print(f"\n⚠️  HIGH PRIORITY ({len(high)} topics):\n")
        for topic in high[:5]:  # Show first 5
            print(f"   {topic['path']}/{topic['topic']}:")
            for issue in topic['issues']:
                if issue['severity'] == 'HIGH':
                    print(f"      - Section {issue['section']}: {issue['issue']}")
        if len(high) > 5:
            print(f"   ... and {len(high) - 5} more topics with high priority issues")

print("\n" + "="*90 + "\n")

# Save detailed report to file
report_path = '.agents/artifacts/content-quality-report.json'
os.makedirs(os.path.dirname(report_path), exist_ok=True)

with open(report_path, 'w') as f:
    json.dump({
        'total_topics': len(all_topics),
        'total_issues': total_issues,
        'topics_with_issues': topics_with_issues
    }, f, indent=2)

print(f"📄 Detailed report saved: {report_path}\n")

cur.close()
conn.close()
