#!/usr/bin/env python3
"""
QUICK HEALTH CHECK
Run this anytime to verify all English study content is working properly.
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

POSTGRES_URL = os.environ.get('POSTGRES_URL')
conn = psycopg2.connect(POSTGRES_URL)
cur = conn.cursor()

print("\n" + "="*70)
print("ENGLISH STUDY CONTENT - QUICK HEALTH CHECK")
print("="*70 + "\n")

# Check 1: Total topic count
cur.execute("""
    SELECT COUNT(*) FROM topic_study_content WHERE subject_id = 'english'
""")
total_topics = cur.fetchone()[0]
print(f"✅ Total English Topics: {total_topics}/116")

if total_topics != 116:
    print(f"   ⚠️  WARNING: Expected 116 topics, found {total_topics}")
else:
    print(f"   ✓  All topics present")

# Check 2: Topics by path
cur.execute("""
    SELECT path_id, COUNT(*)
    FROM topic_study_content
    WHERE subject_id = 'english'
    GROUP BY path_id
    ORDER BY path_id
""")
paths = cur.fetchall()
print(f"\n📊 Topics by Path:")
expected = {'foundation': 68, 'advanced': 22, 'ielts-toefl': 11, 'real-world': 5}
for path, count in paths:
    expected_count = expected.get(path, 0)
    if count == expected_count:
        print(f"   ✓  {path}: {count}/{expected_count}")
    else:
        print(f"   ⚠️  {path}: {count}/{expected_count} (MISMATCH)")

# Check 3: Critical topics with practice sections
critical_topics = [
    ('advanced', 'debate-discussion'),
    ('advanced', 'mixed-conditionals'),
    ('advanced', 'non-defining-relative-clauses'),
    ('foundation', 'present-simple'),
    ('foundation', 'past-simple'),
    ('ielts-toefl', 'ielts-writing')
]

print(f"\n🔍 Critical Topics Check:")
issues_found = 0
for path, topic in critical_topics:
    cur.execute("""
        SELECT content
        FROM topic_study_content
        WHERE subject_id = 'english'
          AND path_id = %s
          AND topic_id = %s
    """, (path, topic))

    result = cur.fetchone()
    if not result:
        print(f"   ❌ {path}/{topic}: MISSING")
        issues_found += 1
        continue

    content = result[0]
    sections = content.get('sections', [])

    # Check for practice sections
    has_practice = False
    total_questions = 0
    missing_answers = 0

    for section in sections:
        for block in section.get('content', []):
            if isinstance(block, dict) and block.get('type') == 'practice':
                has_practice = True
                questions = block.get('questions', [])
                total_questions += len(questions)

                for q in questions:
                    if isinstance(q, dict):
                        answer = str(q.get('answer', '')).strip()
                        if not answer or answer == '[Answer to be added]':
                            missing_answers += 1

    if not has_practice:
        print(f"   ⚠️  {path}/{topic}: No practice section")
    elif missing_answers > 0:
        print(f"   ⚠️  {path}/{topic}: {missing_answers}/{total_questions} answers missing")
        issues_found += 1
    else:
        print(f"   ✓  {path}/{topic}: {total_questions} questions, all complete")

# Check 4: Malformed blocks (quick sample)
print(f"\n🔍 Random Sample Check (10 topics):")
cur.execute("""
    SELECT path_id, topic_id, content
    FROM topic_study_content
    WHERE subject_id = 'english'
    ORDER BY RANDOM()
    LIMIT 10
""")

sample_issues = 0
for path, topic, content in cur.fetchall():
    sections = content.get('sections', [])
    has_malformed = False

    for section in sections:
        for block in section.get('content', []):
            if not isinstance(block, dict):
                has_malformed = True
                break
        if has_malformed:
            break

    if has_malformed:
        print(f"   ⚠️  {path}/{topic}: Has malformed blocks")
        sample_issues += 1
    else:
        print(f"   ✓  {path}/{topic}")

# Summary
print("\n" + "="*70)
print("SUMMARY")
print("="*70)

if total_topics == 116 and issues_found == 0 and sample_issues == 0:
    print("\n✅ ALL CHECKS PASSED")
    print("   Status: Production-ready")
    print("   Action: None required")
else:
    print(f"\n⚠️  ISSUES FOUND")
    if total_topics != 116:
        print(f"   - Topic count mismatch: {total_topics}/116")
    if issues_found > 0:
        print(f"   - Critical topics with issues: {issues_found}")
    if sample_issues > 0:
        print(f"   - Sample topics with malformed blocks: {sample_issues}")
    print(f"\n   Action: Run comprehensive fixer:")
    print(f"   python3 scripts/master-comprehensive-fixer.py")

print("\n" + "="*70 + "\n")

cur.close()
conn.close()
