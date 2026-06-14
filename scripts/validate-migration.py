#!/usr/bin/env python3
"""
Supabase Database Validation Script
Validates database state before running dimensional model migration
"""

import os
import sys
import json
from urllib.parse import urlparse

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    print("❌ psycopg2 not installed. Installing...")
    os.system("pip3 install psycopg2-binary")
    import psycopg2
    from psycopg2.extras import RealDictCursor

# Load .env.local
env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            if line.startswith('POSTGRES_URL='):
                db_url = line.split('=', 1)[1].strip().strip('"')
                break
else:
    print(f"❌ .env.local not found at {env_path}")
    sys.exit(1)

# Load subject mapper
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src', 'lib'))

def validate():
    print('\n╔════════════════════════════════════════════════════════════════╗')
    print('║       SUPABASE DATABASE VALIDATION - MIGRATION PREFLIGHT      ║')
    print('╚════════════════════════════════════════════════════════════════╝\n')

    # Connect to database
    conn = psycopg2.connect(db_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # 1. Check dimensional model tables
        print('1️⃣  Checking Dimensional Model Tables...')
        cur.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_name IN ('dim_exams', 'dim_subjects', 'dim_topics',
                                  'bridge_exam_subject_topic', 'fact_exam_questions')
            ORDER BY table_name
        """)
        tables = [row['table_name'] for row in cur.fetchall()]
        print(f"   ✅ Found {len(tables)}/5 tables: {', '.join(tables)}")

        if len(tables) < 5:
            print('   ❌ ERROR: Missing dimensional model tables! Cannot proceed.')
            sys.exit(1)

        # 2. Count exam-specific subjects
        print('\n2️⃣  Current Subject Structure...')
        cur.execute("SELECT COUNT(*) FROM dim_subjects WHERE subject_code LIKE %s", ('%-%',))
        exam_specific_count = cur.fetchone()['count']
        print(f"   📊 Exam-specific subjects (with dash): {exam_specific_count}")

        cur.execute("""
            SELECT subject_code FROM dim_subjects
            WHERE subject_code LIKE %s
            ORDER BY subject_code LIMIT 10
        """, ('%-%',))
        examples = [row['subject_code'] for row in cur.fetchall()]
        print(f"   📝 Examples: {', '.join(examples)}")

        # Check shared subjects
        cur.execute("SELECT COUNT(*) FROM dim_subjects WHERE subject_code NOT LIKE %s", ('%-%',))
        shared_count = cur.fetchone()['count']
        print(f"   📊 Shared subjects (no dash): {shared_count}")

        if shared_count > 0:
            cur.execute("""
                SELECT subject_code FROM dim_subjects
                WHERE subject_code NOT LIKE %s
                ORDER BY subject_code LIMIT 10
            """, ('%-%',))
            shared_examples = [row['subject_code'] for row in cur.fetchall()]
            print(f"   📝 Examples: {', '.join(shared_examples)}")

        # 3. Count exams
        print('\n3️⃣  Exams in Database...')
        cur.execute("SELECT COUNT(*) FROM dim_exams")
        exam_count = cur.fetchone()['count']
        cur.execute("SELECT exam_code FROM dim_exams ORDER BY exam_code LIMIT 10")
        exam_examples = [row['exam_code'] for row in cur.fetchall()]
        print(f"   📊 Total exams: {exam_count}")
        print(f"   📝 Examples: {', '.join(exam_examples)}")

        # 4. Count topics
        print('\n4️⃣  Topics in Database...')
        cur.execute("SELECT COUNT(*) FROM dim_topics")
        topic_count = cur.fetchone()['count']
        cur.execute("SELECT topic_name FROM dim_topics ORDER BY topic_name LIMIT 10")
        topic_examples = [row['topic_name'] for row in cur.fetchall()]
        print(f"   📊 Total topics: {topic_count}")
        print(f"   📝 Examples: {', '.join(topic_examples)}")

        # 5. Count questions
        print('\n5️⃣  Questions in Database...')
        cur.execute("SELECT COUNT(*) FROM fact_exam_questions")
        question_count = cur.fetchone()['count']
        print(f"   📊 Total questions: {question_count}")

        # 6. Bridge table sample
        print('\n6️⃣  Bridge Table Sample (JEE/NEET Physics)...')
        cur.execute("""
            SELECT
                e.exam_code,
                s.subject_code,
                t.topic_name
            FROM bridge_exam_subject_topic b
            JOIN dim_exams e ON b.exam_id = e.id
            JOIN dim_subjects s ON b.subject_id = s.id
            JOIN dim_topics t ON b.topic_id = t.id
            WHERE e.exam_code IN ('jee-main', 'neet')
              AND s.subject_code LIKE '%physics%'
            ORDER BY e.exam_code, t.topic_name
            LIMIT 5
        """)
        bridge_samples = cur.fetchall()
        print(f"   📊 Found {len(bridge_samples)} bridge entries:")
        for row in bridge_samples:
            print(f"      {row['exam_code']} → {row['subject_code']} → {row['topic_name']}")

        # 7. Get all DB subjects for mapper validation
        print('\n7️⃣  Validating Subject Mapper Coverage...')
        cur.execute("""
            SELECT DISTINCT subject_code
            FROM dim_subjects
            WHERE subject_code LIKE %s
            ORDER BY subject_code
        """, ('%-%',))
        db_subjects = [row['subject_code'] for row in cur.fetchall()]
        print(f"   📊 Database has {len(db_subjects)} exam-specific subjects")

        # We can't import TypeScript directly, so let's parse it
        mapper_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'lib', 'subject-mapper.ts')
        mapper_keys = []
        with open(mapper_path) as f:
            in_map = False
            for line in f:
                if 'export const SUBJECT_MAP' in line:
                    in_map = True
                elif in_map:
                    if line.strip().startswith("'") and ':' in line:
                        key = line.split("'")[1]
                        mapper_keys.append(key)
                    elif '};' in line:
                        break

        print(f"   📊 Mapper has {len(mapper_keys)} mappings")

        unmapped = [s for s in db_subjects if s not in mapper_keys]
        if unmapped:
            print(f"   ⚠️  WARNING: {len(unmapped)} subjects in DB but NOT in mapper:")
            for s in unmapped[:20]:
                print(f"      - {s}")
            if len(unmapped) > 20:
                print(f"      ... and {len(unmapped) - 20} more")
            print(f"   ⚠️  These will use fallback mapping (strip prefix)")
        else:
            print(f"   ✅ All database subjects are mapped!")

        # 8. Check if migration already run
        print('\n8️⃣  Migration Status Check...')
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'subject_migration_map'
            ) as exists
        """)
        migration_exists = cur.fetchone()['exists']

        if migration_exists:
            print(f"   ⚠️  WARNING: subject_migration_map table already exists!")
            print(f"   ⚠️  Migration may have been run before. Check carefully!")
            cur.execute("SELECT COUNT(*) FROM subject_migration_map")
            map_count = cur.fetchone()['count']
            print(f"   📊 Existing mappings in table: {map_count}")
        else:
            print(f"   ✅ Migration NOT yet run (safe to proceed)")

        # 9. Sample structure
        print('\n9️⃣  Current Structure Example (Physics subjects)...')
        cur.execute("""
            SELECT
                e.exam_code,
                s.subject_code,
                COUNT(DISTINCT t.id) as topic_count
            FROM bridge_exam_subject_topic b
            JOIN dim_exams e ON b.exam_id = e.id
            JOIN dim_subjects s ON b.subject_id = s.id
            JOIN dim_topics t ON b.topic_id = t.id
            WHERE s.subject_code LIKE '%physics%'
            GROUP BY e.exam_code, s.subject_code
            ORDER BY e.exam_code
            LIMIT 5
        """)
        physics_samples = cur.fetchall()
        print('   📊 Current (exam-specific):')
        for row in physics_samples:
            print(f"      {row['exam_code']} → {row['subject_code']} ({row['topic_count']} topics)")

        # Summary
        print('\n╔════════════════════════════════════════════════════════════════╗')
        print('║                    VALIDATION SUMMARY                          ║')
        print('╚════════════════════════════════════════════════════════════════╝\n')

        print(f"✅ Dimensional tables exist: YES")
        print(f"✅ Exam-specific subjects in DB: {len(db_subjects)}")
        print(f"✅ Subject mapper mappings: {len(mapper_keys)}")
        print(f"{'⚠️' if unmapped else '✅'}  Unmapped subjects: {len(unmapped)} {f'(will use fallback)' if unmapped else ''}")
        print(f"✅ Total exams: {exam_count}")
        print(f"✅ Total topics: {topic_count}")
        print(f"✅ Total questions: {question_count}")
        print(f"{'⚠️' if migration_exists else '✅'}  Migration already run: {'YES (check carefully!)' if migration_exists else 'NO'}")

        print('\n🚀 Database validation complete!\n')

        if unmapped:
            print(f"⚠️  Next Step: Review {len(unmapped)} unmapped subjects above")
            print(f"   These will use fallback mapping - confirm this is acceptable")
        else:
            print(f"✅ Next Step: Ready to run migration SQL!")

    except Exception as e:
        print(f'\n❌ ERROR: {e}')
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    validate()
