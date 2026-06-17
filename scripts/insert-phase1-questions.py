#!/usr/bin/env python3
"""
Insert Phase 1 Core Grammar questions (400 questions)
Topics: nouns-detailed, pronouns-detailed, articles, adjectives
"""
import psycopg2
from urllib.parse import urlparse, unquote
import sys

POSTGRES_URL = "postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

parsed = urlparse(POSTGRES_URL)
conn_params = {
    'host': parsed.hostname,
    'port': parsed.port or 5432,
    'database': parsed.path[1:],
    'user': parsed.username,
    'password': unquote(parsed.password) if parsed.password else None,
}

SQL_FILES = [
    'nouns-detailed-120Q.sql',
    'pronouns-detailed-100Q.sql',
    'articles-80Q.sql',
    'adjectives-100Q.sql',
]

EXPECTED_COUNTS = {
    'nouns-detailed': 120,
    'pronouns-detailed': 100,
    'articles': 80,
    'adjectives': 100,
}

def main():
    print("🚀 Starting Phase 1 Core Grammar insertion (400 questions)...\n")

    conn = psycopg2.connect(**conn_params)
    cur = conn.cursor()

    try:
        # Insert questions from each file
        for filename in SQL_FILES:
            filepath = f"output/{filename}"

            print(f"📄 Processing {filename}...")

            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    sql_content = f.read()

                # Extract INSERT statements (filter out comments)
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
                            in_insert = False

                if lines:
                    insert_sql = '\n'.join(lines)
                    cur.execute(insert_sql)
                    conn.commit()
                    print(f"✅ Inserted questions from {filename}\n")

            except FileNotFoundError:
                print(f"⚠️  File not found: {filepath}")
                continue
            except Exception as e:
                print(f"❌ Error inserting from {filename}: {e}")
                conn.rollback()
                continue

        # Verification
        print("=" * 80)
        print("📊 VERIFICATION RESULTS")
        print("=" * 80 + "\n")

        cur.execute("""
            SELECT
                topic_id,
                COUNT(*) as total_questions,
                SUM(CASE WHEN difficulty = 'easy' THEN 1 ELSE 0 END) as easy_count,
                SUM(CASE WHEN difficulty = 'medium' THEN 1 ELSE 0 END) as medium_count,
                SUM(CASE WHEN difficulty = 'hard' THEN 1 ELSE 0 END) as hard_count
            FROM english_questions
            WHERE topic_id IN ('nouns-detailed', 'pronouns-detailed', 'articles', 'adjectives')
            GROUP BY topic_id
            ORDER BY
                CASE topic_id
                    WHEN 'nouns-detailed' THEN 1
                    WHEN 'pronouns-detailed' THEN 2
                    WHEN 'articles' THEN 3
                    WHEN 'adjectives' THEN 4
                END
        """)

        results = cur.fetchall()
        total_inserted = 0

        for row in results:
            topic_id, total, easy, medium, hard = row
            expected = EXPECTED_COUNTS.get(topic_id, '?')
            status = '✅' if total == expected else '⚠️'
            print(f"{status} {topic_id:<25} {total}/{expected} questions (Easy: {easy}, Medium: {medium}, Hard: {hard})")
            total_inserted += total

        print("\n" + "=" * 80)
        print(f"✅ TOTAL INSERTED: {total_inserted}/400 questions (Phase 1)")
        print("=" * 80 + "\n")

        # Check for formatting issues (instruction words without colons)
        print("🔍 Checking for formatting issues...\n")
        cur.execute("""
            SELECT COUNT(*)
            FROM english_questions
            WHERE topic_id IN ('nouns-detailed', 'pronouns-detailed', 'articles', 'adjectives')
            AND (
                options LIKE '%"Say %' OR
                options LIKE '%"Use %' OR
                options LIKE '%"Arrange %' OR
                options LIKE '%"Rearrange %' OR
                options LIKE '%"Add %' OR
                options LIKE '%"Remove %' OR
                options LIKE '%"Change %' OR
                options LIKE '%"Put %'
            )
            AND NOT (
                options LIKE '%"Say: %' OR
                options LIKE '%"Use: %' OR
                options LIKE '%"Arrange: %' OR
                options LIKE '%"Rearrange: %' OR
                options LIKE '%"Add: %' OR
                options LIKE '%"Remove: %' OR
                options LIKE '%"Change: %' OR
                options LIKE '%"Put: %'
            )
        """)

        formatting_issues = cur.fetchone()[0]

        if formatting_issues == 0:
            print("✅ NO formatting issues found! All instruction words have colons.\n")
        else:
            print(f"⚠️  Found {formatting_issues} questions with formatting issues!\n")

        if total_inserted == 400 and formatting_issues == 0:
            print("🎉 SUCCESS! All 400 Phase 1 questions inserted with perfect formatting!\n")
        elif total_inserted == 400:
            print(f"⚠️  All questions inserted but {formatting_issues} have formatting issues.\n")
        else:
            print(f"⚠️  Expected 400 questions, but inserted {total_inserted}\n")

    except Exception as e:
        print(f"❌ Fatal error: {e}")
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    try:
        main()
        print("✅ Phase 1 insertion complete!")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Insertion failed: {e}")
        sys.exit(1)
