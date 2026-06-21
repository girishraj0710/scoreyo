#!/usr/bin/env python3
"""
COMPREHENSIVE VALIDATION - ALL TOPICS, ALL SECTIONS
Checks every single topic and section for:
1. Missing practice blocks
2. Empty sections
3. Incomplete content
"""

import os
import json

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
print("COMPREHENSIVE VALIDATION - ALL 116 TOPICS, EVERY SECTION")
print("="*100 + "\n")

# Get ALL topics
cur.execute("""
    SELECT subject_id, path_id, topic_id, title, content
    FROM topic_study_content
    WHERE subject_id = 'english'
    ORDER BY path_id, topic_id
""")

all_topics = cur.fetchall()
issues = []

for subject_id, path_id, topic_id, title, content_json in all_topics:
    sections = content_json.get('sections', [])

    for s_idx, section in enumerate(sections):
        section_title = section.get('title', '')
        content_blocks = section.get('content', [])

        # Check 1: Is section completely empty?
        if len(content_blocks) == 0:
            issues.append({
                'topic': f"{path_id}/{topic_id}",
                'section': s_idx + 1,
                'section_title': section_title,
                'issue': 'EMPTY_SECTION',
                'severity': 'HIGH'
            })
            continue

        # Check 2: Does "Practice" section have practice block?
        if 'practice' in section_title.lower() or 'exercise' in section_title.lower():
            has_practice_block = any(
                isinstance(b, dict) and b.get('type') == 'practice'
                for b in content_blocks
            )

            if not has_practice_block:
                issues.append({
                    'topic': f"{path_id}/{topic_id}",
                    'section': s_idx + 1,
                    'section_title': section_title,
                    'issue': 'PRACTICE_SECTION_WITHOUT_PRACTICE_BLOCK',
                    'severity': 'CRITICAL'
                })

        # Check 3: Are practice blocks actually populated?
        for block in content_blocks:
            if isinstance(block, dict) and block.get('type') == 'practice':
                questions = block.get('questions', [])

                if len(questions) == 0:
                    issues.append({
                        'topic': f"{path_id}/{topic_id}",
                        'section': s_idx + 1,
                        'section_title': section_title,
                        'issue': 'EMPTY_PRACTICE_BLOCK',
                        'severity': 'CRITICAL'
                    })
                else:
                    # Check if questions have proper structure
                    for q_idx, q in enumerate(questions):
                        if not isinstance(q, dict):
                            issues.append({
                                'topic': f"{path_id}/{topic_id}",
                                'section': s_idx + 1,
                                'section_title': section_title,
                                'issue': f'MALFORMED_QUESTION_{q_idx+1}',
                                'severity': 'HIGH'
                            })
                        elif not q.get('question') or not q.get('answer'):
                            issues.append({
                                'topic': f"{path_id}/{topic_id}",
                                'section': s_idx + 1,
                                'section_title': section_title,
                                'issue': f'INCOMPLETE_QUESTION_{q_idx+1}',
                                'severity': 'HIGH'
                            })

        # Check 4: Does section have only intro paragraph and nothing else?
        if len(content_blocks) == 1:
            block = content_blocks[0]
            if isinstance(block, dict) and block.get('type') == 'paragraph':
                text = block.get('text', '')
                if len(text) < 300 and any(phrase in text.lower() for phrase in ['here are', 'following', 'covering']):
                    issues.append({
                        'topic': f"{path_id}/{topic_id}",
                        'section': s_idx + 1,
                        'section_title': section_title,
                        'issue': 'INTRO_ONLY_NO_CONTENT',
                        'severity': 'HIGH'
                    })

        # Check 5: Are example blocks populated?
        for block in content_blocks:
            if isinstance(block, dict) and block.get('type') == 'example':
                examples = block.get('examples', [])
                if len(examples) == 0:
                    issues.append({
                        'topic': f"{path_id}/{topic_id}",
                        'section': s_idx + 1,
                        'section_title': section_title,
                        'issue': 'EMPTY_EXAMPLE_BLOCK',
                        'severity': 'MEDIUM'
                    })

# Print results
print(f"VALIDATION COMPLETE\n")
print(f"Topics checked: {len(all_topics)}")
print(f"Total issues found: {len(issues)}\n")

if len(issues) == 0:
    print("✅ NO ISSUES FOUND - All topics are complete!")
else:
    # Group by severity
    critical = [i for i in issues if i['severity'] == 'CRITICAL']
    high = [i for i in issues if i['severity'] == 'HIGH']
    medium = [i for i in issues if i['severity'] == 'MEDIUM']

    if critical:
        print(f"🔴 CRITICAL ISSUES ({len(critical)}):")
        for issue in critical:
            print(f"   {issue['topic']} - Section {issue['section']} ({issue['section_title']}): {issue['issue']}")
        print()

    if high:
        print(f"⚠️  HIGH PRIORITY ({len(high)}):")
        for issue in high[:20]:  # Show first 20
            print(f"   {issue['topic']} - Section {issue['section']} ({issue['section_title']}): {issue['issue']}")
        if len(high) > 20:
            print(f"   ... and {len(high) - 20} more")
        print()

    if medium:
        print(f"ℹ️  MEDIUM PRIORITY ({len(medium)}) - sample:")
        for issue in medium[:10]:
            print(f"   {issue['topic']} - Section {issue['section']} ({issue['section_title']}): {issue['issue']}")

# Save detailed report
report = {
    'total_topics': len(all_topics),
    'total_issues': len(issues),
    'critical': len(critical),
    'high': len(high),
    'medium': len(medium),
    'issues': issues
}

report_path = '/tmp/comprehensive-validation-report.json'
with open(report_path, 'w') as f:
    json.dump(report, f, indent=2)

print(f"\n📄 Detailed report saved: {report_path}")
print("="*100 + "\n")

cur.close()
conn.close()
