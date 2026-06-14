#!/usr/bin/env python3

"""
Database Status Checker
Connects to Supabase PostgreSQL and reports status of all tables
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

def check_database_status():
    print('\n🔍 Krakkify Database Status Check\n')
    print('=' * 80)

    # Get connection string from env
    postgres_url = os.getenv('POSTGRES_URL')
    if not postgres_url:
        print('❌ POSTGRES_URL not found in .env.local')
        return

    try:
        # Connect to database
        conn = psycopg2.connect(postgres_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        print('✅ Connection successful to Supabase PostgreSQL')

        # Get database info
        cursor.execute("""
            SELECT current_database() as database,
                   version() as version,
                   current_user as "user"
        """)
        db_info = cursor.fetchone()
        print(f"📦 Database: {db_info['database']}")
        print(f"👤 User: {db_info['user']}")
        print(f"🔧 Version: {db_info['version'].split(',')[0]}")
        print('=' * 80)

        # Get all tables with row counts
        cursor.execute("""
            SELECT
                schemaname,
                tablename,
                pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
            FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY tablename;
        """)
        tables = cursor.fetchall()

        print(f"\n📊 Found {len(tables)} tables:\n")

        # Get row counts for each table
        for table in tables:
            table_name = table['tablename']

            try:
                cursor.execute(f"SELECT COUNT(*) as count FROM {table_name}")
                count_result = cursor.fetchone()
                row_count = count_result['count']

                # Get last updated/created timestamp if available
                last_activity = ''
                cursor.execute("""
                    SELECT column_name
                    FROM information_schema.columns
                    WHERE table_name = %s
                    AND column_name IN ('created_at', 'updated_at')
                    LIMIT 1
                """, (table_name,))

                has_created_at = cursor.fetchone()
                if has_created_at:
                    time_col = has_created_at['column_name']
                    cursor.execute(f"SELECT MAX({time_col}) as last_time FROM {table_name}")
                    last_time = cursor.fetchone()
                    if last_time and last_time['last_time']:
                        date = last_time['last_time']
                        last_activity = f" (last: {date.strftime('%Y-%m-%d %H:%M')})"

                # Visual indicator based on row count
                if row_count == 0:
                    indicator = '⚪'
                elif row_count < 100:
                    indicator = '🟡'
                elif row_count < 1000:
                    indicator = '🟢'
                else:
                    indicator = '🔵'

                print(f"  {indicator} {table_name:<35} {row_count:>8} rows   {table['size']:>8}{last_activity}")

            except Exception as error:
                print(f"  ❌ {table_name:<35} ERROR: {error}")

        # Check critical tables
        print('\n' + '=' * 80)
        print('🎯 Critical Table Status:\n')

        critical_tables = [
            'users',
            'dim_exams',
            'dim_subjects',
            'dim_topics',
            'bridge_exam_subject_topic',
            'fact_exam_questions',
            'quiz_sessions',
            'subscriptions',
            'mock_tests',
            'topic_study_content'
        ]

        for table in critical_tables:
            try:
                cursor.execute(f"SELECT COUNT(*) as count FROM {table}")
                result = cursor.fetchone()
                count = result['count']
                status = '✅' if count > 0 else '⚠️ '
                print(f"  {status} {table:<35} {count:>8} rows")
            except Exception:
                print(f"  ❌ {table:<35} NOT FOUND or ERROR")

        # Check dimensional model integrity
        print('\n' + '=' * 80)
        print('🔗 Dimensional Model Integrity:\n')

        cursor.execute('SELECT COUNT(*) as count FROM dim_exams')
        exam_count = cursor.fetchone()['count']

        cursor.execute('SELECT COUNT(*) as count FROM dim_subjects')
        subject_count = cursor.fetchone()['count']

        cursor.execute('SELECT COUNT(*) as count FROM dim_topics')
        topic_count = cursor.fetchone()['count']

        cursor.execute('SELECT COUNT(*) as count FROM bridge_exam_subject_topic')
        bridge_count = cursor.fetchone()['count']

        cursor.execute('SELECT COUNT(*) as count FROM fact_exam_questions')
        question_count = cursor.fetchone()['count']

        print(f"  📚 Exams:     {exam_count} registered")
        print(f"  📖 Subjects:  {subject_count} registered")
        print(f"  📝 Topics:    {topic_count} registered")
        print(f"  🔗 Bridges:   {bridge_count} exam-subject-topic mappings")
        print(f"  ❓ Questions: {question_count} total questions")

        # Check for orphaned records
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM fact_exam_questions q
            LEFT JOIN dim_topics t ON q.topic_id = t.id
            WHERE t.id IS NULL
        """)
        orphaned_questions = cursor.fetchone()['count']

        cursor.execute("""
            SELECT COUNT(*) as count
            FROM bridge_exam_subject_topic b
            LEFT JOIN dim_topics t ON b.topic_id = t.id
            WHERE t.id IS NULL
        """)
        orphaned_bridges = cursor.fetchone()['count']

        if orphaned_questions > 0:
            print(f"  ⚠️  {orphaned_questions} orphaned questions (missing topic)")
        if orphaned_bridges > 0:
            print(f"  ⚠️  {orphaned_bridges} orphaned bridge entries (missing topic)")
        if orphaned_questions == 0 and orphaned_bridges == 0:
            print(f"  ✅ No orphaned records found")

        # Check exam coverage
        print('\n' + '=' * 80)
        print('🎓 Exam Coverage Report:\n')

        cursor.execute("""
            SELECT
                e.exam_code,
                e.exam_name,
                COUNT(DISTINCT b.subject_id) as subjects,
                COUNT(DISTINCT b.topic_id) as topics,
                COUNT(q.id) as questions
            FROM dim_exams e
            LEFT JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
            LEFT JOIN fact_exam_questions q ON b.topic_id = q.topic_id
            GROUP BY e.id, e.exam_code, e.exam_name
            ORDER BY questions DESC
            LIMIT 10
        """)
        exam_coverage = cursor.fetchall()

        print('  Top 10 exams by question count:\n')
        for exam in exam_coverage:
            questions = exam['questions'] or 0
            subjects = exam['subjects'] or 0
            topics = exam['topics'] or 0

            if questions > 100:
                indicator = '🟢'
            elif questions > 10:
                indicator = '🟡'
            else:
                indicator = '🔴'

            print(f"  {indicator} {exam['exam_code']:<15} {questions:>6} Q  {subjects:>3} subj  {topics:>3} topics  {exam['exam_name']}")

        print('\n' + '=' * 80)
        print('✅ Database check complete!\n')

        cursor.close()
        conn.close()

    except Exception as error:
        print(f'\n❌ Error connecting to database: {error}')
        print('\n🔍 Check:')
        print('  1. .env.local file exists with POSTGRES_URL')
        print('  2. Supabase database is running')
        print('  3. Network connectivity to Supabase')
        return False

    return True

if __name__ == '__main__':
    check_database_status()
