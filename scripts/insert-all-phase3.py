#!/usr/bin/env python3
"""Insert ALL existing Phase 3 Vocabulary files"""
import psycopg2
from urllib.parse import urlparse, unquote
import glob

POSTGRES_URL = "postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

parsed = urlparse(POSTGRES_URL)
conn = psycopg2.connect(
    host=parsed.hostname,
    port=parsed.port or 5432,
    database=parsed.path[1:],
    user=parsed.username,
    password=unquote(parsed.password)
)
cur = conn.cursor()

# Find all Phase 3 files
phase3_files = [
    'essential-vocabulary-150Q.sql',
    'synonyms-antonyms-120Q.sql', 
    'word-formation-100Q.sql'
]

print("📋 Phase 3 Vocabulary Insertion")
print("=" * 80)

for filename in phase3_files:
    filepath = f"output/{filename}"
    try:
        print(f"\n📄 Processing {filename}...")
        with open(filepath, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        # Extract INSERT statements
        lines = []
        in_insert = False
        for line in sql_content.split('\n'):
            stripped = line.strip()
            if stripped.startswith('INSERT INTO'):
                in_insert = True
                lines.append(line)
            elif in_insert:
                lines.append(line)
                if stripped.endswith(';'):
                    break
        
        if lines:
            insert_sql = '\n'.join(lines)
            try:
                cur.execute(insert_sql)
                conn.commit()
                print(f"✅ Inserted {filename}")
            except Exception as e:
                print(f"❌ Error: {e}")
                conn.rollback()
    except FileNotFoundError:
        print(f"⚠️  File not found: {filepath}")

# Final verification
print("\n" + "=" * 80)
print("📊 FINAL DATABASE STATUS")
print("=" * 80)

cur.execute("""
    SELECT path_id, COUNT(*) as total
    FROM english_questions
    GROUP BY path_id
    ORDER BY path_id
""")

results = cur.fetchall()
grand_total = 0
for path_id, count in results:
    print(f"  {path_id}: {count} questions")
    grand_total += count

print(f"\n🎉 GRAND TOTAL: {grand_total} questions in database")

# Phase-wise breakdown
print("\n" + "=" * 80)
print("📊 COMPLETED PHASES")
print("=" * 80)

phase1_topics = ['nouns-detailed', 'pronouns-detailed', 'articles', 'adjectives', 
                 'verbs-basics', 'parts-of-speech', 'subject-verb-agreement']
phase2_topics = ['sentence-types', 'active-passive', 'reported-speech']
phase3_topics = ['essential-vocabulary', 'synonyms-antonyms', 'word-formation', 
                 'phrasal-verbs', 'idioms']

for phase_num, topics in enumerate([phase1_topics, phase2_topics, phase3_topics], 1):
    cur.execute(f"""
        SELECT SUM(CASE WHEN topic_id IN ({','.join(["'%s'" % t for t in topics])}) THEN 1 ELSE 0 END)
        FROM english_questions
    """)
    count = cur.fetchone()[0] or 0
    print(f"  Phase {phase_num}: {count} questions")

cur.close()
conn.close()

print("\n✅ Insertion complete!")
