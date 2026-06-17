#!/usr/bin/env python3
"""
Insert Phase 3.1: Common Vocabulary (120Q)
"""
import psycopg2
from urllib.parse import urlparse, unquote

POSTGRES_URL = "postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

parsed = urlparse(POSTGRES_URL)
conn_params = {
    'host': parsed.hostname,
    'port': parsed.port or 5432,
    'database': parsed.path[1:],
    'user': parsed.username,
    'password': unquote(parsed.password) if parsed.password else None,
}

def main():
    print("🚀 Inserting Phase 3.1: Common Vocabulary (120Q)...\n")

    conn = psycopg2.connect(**conn_params)
    cur = conn.cursor()

    try:
        # Read SQL file
        with open('output/common-vocabulary-120Q.sql', 'r', encoding='utf-8') as f:
            sql_content = f.read()

        # Execute insert
        cur.execute(sql_content)
        conn.commit()
        print("✅ Inserted 120 questions from common-vocabulary-120Q.sql\n")

        # Verification
        print("=" * 80)
        print("📊 VERIFICATION RESULTS")
        print("=" * 80 + "\n")

        cur.execute("""
            SELECT
                COUNT(*) as total_questions,
                SUM(CASE WHEN difficulty = 'easy' THEN 1 ELSE 0 END) as easy_count,
                SUM(CASE WHEN difficulty = 'medium' THEN 1 ELSE 0 END) as medium_count,
                SUM(CASE WHEN difficulty = 'hard' THEN 1 ELSE 0 END) as hard_count
            FROM english_questions
            WHERE topic_id = 'common-vocabulary'
        """)

        row = cur.fetchone()
        total, easy, medium, hard = row
        print(f"✅ common-vocabulary: {total}/120 questions (Easy: {easy}, Medium: {medium}, Hard: {hard})")

        # Grand total
        cur.execute("SELECT COUNT(*) FROM english_questions")
        grand_total = cur.fetchone()[0]
        print(f"\n🎉 DATABASE TOTAL: {grand_total} questions\n")
        print("=" * 80 + "\n")

        if total == 120:
            print("🎉 SUCCESS! Common Vocabulary insertion complete!\n")
        else:
            print(f"⚠️  Expected 120 questions, got {total}\n")

    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    main()
