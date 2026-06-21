#!/usr/bin/env python3
"""Generate detailed issue report grouped by severity and type."""

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
from urllib.parse import urlparse, unquote
from collections import defaultdict

POSTGRES_URL = os.environ.get('POSTGRES_URL')
parsed = urlparse(POSTGRES_URL)
conn = psycopg2.connect(
    host=parsed.hostname,
    port=parsed.port or 5432,
    database=parsed.path[1:],
    user=parsed.username,
    password=unquote(parsed.password)
)

cur = conn.cursor()

print("\n" + "="*90)
print("DETAILED ISSUE ANALYSIS")
print("="*90 + "\n")

cur.execute("""
    SELECT subject_id, path_id, topic_id, title, content
    FROM topic_study_content
    WHERE subject_id = 'english'
    ORDER BY path_id, topic_id
""")

all_topics = cur.fetchall()

issue_counts = defaultdict(int)
critical_topics = []

for subject_id, path_id, topic_id, title, content_json in all_topics:
    sections = content_json.get('sections', [])
    topic_critical = 0

    for section in sections:
        for block in section.get('content', []):
            if not isinstance(block, dict):
                issue_counts['MALFORMED_BLOCK'] += 1
                continue

            if block.get('type') == 'practice':
                for q in block.get('questions', []):
                    if isinstance(q, dict):
                        if not q.get('answer') or not str(q.get('answer')).strip():
                            issue_counts['MISSING_ANSWER'] += 1
                            topic_critical += 1

    if topic_critical > 0:
        critical_topics.append((path_id, topic_id, topic_critical))

print("📊 ISSUE BREAKDOWN:\n")
for issue_type, count in sorted(issue_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"   {issue_type}: {count}")

print(f"\n🔴 CRITICAL: {len(critical_topics)} topics with missing answers:\n")
for path, topic, count in sorted(critical_topics, key=lambda x: x[2], reverse=True)[:20]:
    print(f"   {path}/{topic}: {count} missing answers")

print("\n" + "="*90)

cur.close()
conn.close()
