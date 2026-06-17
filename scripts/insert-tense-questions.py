#!/usr/bin/env python3
import os
import sys
import psycopg2
from urllib.parse import urlparse, unquote

# Database connection
POSTGRES_URL = os.getenv('POSTGRES_URL')
if not POSTGRES_URL:
    print("❌ POSTGRES_URL not found in environment")
    sys.exit(1)

# Parse URL and decode password
parsed = urlparse(POSTGRES_URL)
conn_params = {
    'host': parsed.hostname,
    'port': parsed.port or 5432,
    'database': parsed.path[1:],  # Remove leading /
    'user': parsed.username,
    'password': unquote(parsed.password) if parsed.password else None,
}

SQL_FILES = [
    'CORRECT-present-simple-questions.sql',
    'CORRECT-present-continuous-questions.sql',
    'CORRECT-present-perfect-FULL.sql',
    'CORRECT-past-simple-FULL.sql',
    'CORRECT-past-continuous-FULL.sql',
    'CORRECT-future-simple-FULL.sql',
    'COMPLETE-tenses-advanced-ALL-510Q.sql',
]

EXPECTED_COUNTS = {
    'present-simple': 100,
    'present-continuous': 100,
    'present-perfect': 120,
    'past-simple': 100,
    'past-continuous': 100,
    'future-simple': 100,
    'tenses-advanced': 102,
}

def insert_tense_questions():
    print("🚀 Starting tense questions insertion...\n")

    conn = psycopg2.connect(**conn_params)
    cur = conn.cursor()

    try:
        # Clear existing tense questions
        print("🗑️  Clearing existing tense questions...")
        cur.execute("""
            DELETE FROM english_questions WHERE topic_id IN (
                'present-simple',
                'present-continuous',
                'present-perfect',
                'past-simple',
                'past-continuous',
                'future-simple',
                'tenses-advanced'
            )
        """)
        conn.commit()
        print("✅ Cleared existing questions\n")

        # Insert questions from each file
        for filename in SQL_FILES:
            filepath = os.path.join(os.path.dirname(__file__), 'output', filename)

            if not os.path.exists(filepath):
                print(f"⚠️  File not found: {filename}")
                continue

            print(f"📄 Processing {filename}...")

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
                try:
                    cur.execute(insert_sql)
                    conn.commit()
                    print(f"✅ Inserted questions from {filename}\n")
                except Exception as e:
                    print(f"❌ Error inserting from {filename}: {e}")
                    conn.rollback()
                    # Continue with other files

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
            WHERE topic_id IN (
                'present-simple',
                'present-continuous',
                'present-perfect',
                'past-simple',
                'past-continuous',
                'future-simple',
                'tenses-advanced'
            )
            GROUP BY topic_id
            ORDER BY
                CASE topic_id
                    WHEN 'present-simple' THEN 1
                    WHEN 'present-continuous' THEN 2
                    WHEN 'present-perfect' THEN 3
                    WHEN 'past-simple' THEN 4
                    WHEN 'past-continuous' THEN 5
                    WHEN 'future-simple' THEN 6
                    WHEN 'tenses-advanced' THEN 7
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
        print(f"✅ TOTAL INSERTED: {total_inserted}/722 questions")
        print("=" * 80 + "\n")

        if total_inserted == 722:
            print("🎉 SUCCESS! All 722 tense questions inserted successfully!\n")
        else:
            print(f"⚠️  Expected 722 questions, but inserted {total_inserted}\n")

    except Exception as e:
        print(f"❌ Fatal error: {e}")
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    try:
        insert_tense_questions()
        print("✅ Insertion complete!")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Insertion failed: {e}")
        sys.exit(1)
