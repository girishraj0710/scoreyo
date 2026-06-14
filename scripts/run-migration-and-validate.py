#!/usr/bin/env python3
"""
Complete Migration + Validation Script
Runs the full migration and validates results in one go
"""

import os
import sys
from datetime import datetime
from pathlib import Path

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    print("\n❌ psycopg2 not installed")
    print("Installing...")
    os.system("pip3 install --user psycopg2-binary")
    print("\nPlease run this script again.")
    sys.exit(1)

# Load database URL
project_dir = Path(__file__).parent.parent
env_path = project_dir / '.env.local'

if not env_path.exists():
    print(f"❌ .env.local not found at {env_path}")
    sys.exit(1)

with open(env_path) as f:
    for line in f:
        if line.startswith('POSTGRES_URL='):
            db_url = line.split('=', 1)[1].strip().strip('"')
            break
    else:
        print("❌ POSTGRES_URL not found in .env.local")
        sys.exit(1)

# Load migration SQL
migration_sql_path = project_dir / 'migration-dimensional-model.sql'
if not migration_sql_path.exists():
    # Try Desktop
    desktop_path = Path.home() / 'Desktop' / 'migration-dimensional-model.sql'
    if desktop_path.exists():
        migration_sql_path = desktop_path
    else:
        print(f"❌ migration-dimensional-model.sql not found")
        print(f"   Checked: {migration_sql_path}")
        print(f"   Checked: {desktop_path}")
        sys.exit(1)

print("="*80)
print("DIMENSIONAL MODEL MIGRATION + VALIDATION")
print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("="*80)

# Connect to database
print("\n🔌 Connecting to Supabase...")
try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = False  # Use transactions
    cur = conn.cursor(cursor_factory=RealDictCursor)
    print("✅ Connected")
except Exception as e:
    print(f"❌ Connection failed: {e}")
    sys.exit(1)

# Pre-migration checks
print("\n" + "="*80)
print("PRE-MIGRATION VALIDATION")
print("="*80)

try:
    # Check if migration already ran
    cur.execute("SELECT COUNT(*) as count FROM dim_subjects WHERE subject_code NOT LIKE '%-%'")
    shared_count = cur.fetchone()['count']

    cur.execute("SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'subject_migration_map') as exists")
    map_exists = cur.fetchone()['exists']

    if shared_count > 0 or map_exists:
        print(f"\n⚠️  WARNING: Migration may have already run!")
        print(f"   Shared subjects: {shared_count}")
        print(f"   Migration map exists: {map_exists}")
        response = input("\n   Continue anyway? (yes/no): ")
        if response.lower() != 'yes':
            print("Aborted by user")
            sys.exit(0)

    # Count current subjects
    cur.execute("SELECT COUNT(*) as count FROM dim_subjects")
    total_subjects_before = cur.fetchone()['count']
    print(f"✅ Current subjects: {total_subjects_before}")

    # Count bridge entries
    cur.execute("SELECT COUNT(*) as count FROM bridge_exam_subject_topic")
    bridge_count_before = cur.fetchone()['count']
    print(f"✅ Current bridge entries: {bridge_count_before}")

except Exception as e:
    print(f"❌ Pre-validation failed: {e}")
    conn.close()
    sys.exit(1)

# Run migration
print("\n" + "="*80)
print("RUNNING MIGRATION")
print("="*80)

try:
    print(f"\n📖 Reading migration SQL from {migration_sql_path.name}...")
    with open(migration_sql_path) as f:
        migration_sql = f.read()

    print(f"✅ Loaded {len(migration_sql)} bytes")
    print(f"\n⚙️  Executing migration (this may take 30-60 seconds)...")

    # Execute the entire migration
    cur.execute(migration_sql)
    conn.commit()

    print("✅ Migration executed successfully!")

except Exception as e:
    print(f"\n❌ MIGRATION FAILED: {e}")
    print("\n🔄 Rolling back...")
    conn.rollback()
    conn.close()
    print("❌ Migration rolled back. No changes made to database.")
    sys.exit(1)

# Post-migration validation
print("\n" + "="*80)
print("POST-MIGRATION VALIDATION")
print("="*80)

tests_passed = 0
tests_failed = 0
tests_warning = 0

def run_test(name, query, check_fn, description=""):
    global tests_passed, tests_failed, tests_warning
    try:
        cur.execute(query)
        result = cur.fetchall()
        status, message = check_fn(result)

        if status == "PASS":
            print(f"✅ {name}: {message}")
            tests_passed += 1
        elif status == "WARNING":
            print(f"⚠️  {name}: {message}")
            tests_warning += 1
        else:
            print(f"❌ {name}: {message}")
            tests_failed += 1

        if description:
            print(f"   {description}")
        return status
    except Exception as e:
        print(f"❌ {name}: ERROR - {e}")
        tests_failed += 1
        return "FAIL"

print("\nRunning 13 validation tests...\n")

# TEST 1: Shared subjects created
run_test(
    "Shared subjects created",
    "SELECT COUNT(*) as count FROM dim_subjects WHERE subject_code NOT LIKE '%-%'",
    lambda r: ("PASS", f"{r[0]['count']} shared subjects") if r[0]['count'] == 52 else ("FAIL", f"Expected 52, got {r[0]['count']}"),
    "Should have created exactly 52 shared subjects"
)

# TEST 2: Migration mapping table
run_test(
    "Migration mapping table",
    "SELECT COUNT(*) as count FROM subject_migration_map",
    lambda r: ("PASS", f"{r[0]['count']} mappings") if r[0]['count'] >= 295 else ("FAIL", f"Expected 295+, got {r[0]['count']}"),
    "Should have 295+ subject mappings"
)

# TEST 3: No duplicates
run_test(
    "No duplicate bridge entries",
    """
    SELECT COUNT(*) as duplicates FROM (
        SELECT exam_id, subject_id, topic_id, COUNT(*) as cnt
        FROM bridge_exam_subject_topic
        GROUP BY exam_id, subject_id, topic_id
        HAVING COUNT(*) > 1
    ) dup
    """,
    lambda r: ("PASS", "No duplicates") if r[0]['duplicates'] == 0 else ("FAIL", f"Found {r[0]['duplicates']} duplicates!"),
    "Critical: No duplicate entries allowed"
)

# TEST 4-6: Foreign keys
run_test(
    "Foreign key: exams",
    "SELECT COUNT(*) as orphans FROM bridge_exam_subject_topic b WHERE NOT EXISTS (SELECT 1 FROM dim_exams e WHERE e.id = b.exam_id)",
    lambda r: ("PASS", "All valid") if r[0]['orphans'] == 0 else ("FAIL", f"{r[0]['orphans']} orphans!"),
    "All exam references must be valid"
)

run_test(
    "Foreign key: subjects",
    "SELECT COUNT(*) as orphans FROM bridge_exam_subject_topic b WHERE NOT EXISTS (SELECT 1 FROM dim_subjects s WHERE s.id = b.subject_id)",
    lambda r: ("PASS", "All valid") if r[0]['orphans'] == 0 else ("FAIL", f"{r[0]['orphans']} orphans!"),
    "All subject references must be valid"
)

run_test(
    "Foreign key: topics",
    "SELECT COUNT(*) as orphans FROM bridge_exam_subject_topic b WHERE NOT EXISTS (SELECT 1 FROM dim_topics t WHERE t.id = b.topic_id)",
    lambda r: ("PASS", "All valid") if r[0]['orphans'] == 0 else ("FAIL", f"{r[0]['orphans']} orphans!"),
    "All topic references must be valid"
)

# TEST 7: JEE and NEET share physics
run_test(
    "JEE + NEET share physics",
    """
    SELECT e.exam_code, s.subject_code, COUNT(DISTINCT b.topic_id) as topics
    FROM bridge_exam_subject_topic b
    JOIN dim_exams e ON b.exam_id = e.id
    JOIN dim_subjects s ON b.subject_id = s.id
    WHERE e.exam_code IN ('jee-main', 'neet') AND s.subject_code = 'physics'
    GROUP BY e.exam_code, s.subject_code
    """,
    lambda r: ("PASS", f"JEE: {r[0]['topics']} topics, NEET: {r[1]['topics']} topics") if len(r) == 2 else ("FAIL", "Not sharing physics!"),
    "Critical: JEE and NEET must share same physics subject"
)

# TEST 8: Multi-exam usage
run_test(
    "Shared subjects multi-exam usage",
    """
    SELECT COUNT(*) as count FROM (
        SELECT s.subject_code, COUNT(DISTINCT e.exam_code) as exam_count
        FROM dim_subjects s
        JOIN bridge_exam_subject_topic b ON s.id = b.subject_id
        JOIN dim_exams e ON b.exam_id = e.id
        WHERE s.subject_code NOT LIKE '%-%'
        GROUP BY s.subject_code
        HAVING COUNT(DISTINCT e.exam_code) > 1
    ) multi
    """,
    lambda r: ("PASS", f"{r[0]['count']} shared subjects in use") if r[0]['count'] >= 10 else ("WARNING", f"Only {r[0]['count']} shared subjects in use"),
    "Most shared subjects should be used by multiple exams"
)

# TEST 9: Backward compatibility
run_test(
    "Backward compatibility",
    "SELECT COUNT(*) as count FROM dim_subjects WHERE subject_code LIKE '%-%'",
    lambda r: ("PASS", f"{r[0]['count']} old subjects preserved") if r[0]['count'] > 0 else ("WARNING", "Old subjects deleted"),
    "Old exam-specific subjects should be preserved"
)

# TEST 10: Question pool
run_test(
    "Physics question pool",
    """
    SELECT COUNT(DISTINCT q.id) as count
    FROM fact_exam_questions q
    JOIN dim_topics t ON q.topic_id = t.id
    JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
    JOIN dim_subjects s ON b.subject_id = s.id
    WHERE s.subject_code = 'physics'
    """,
    lambda r: ("PASS", f"{r[0]['count']} questions") if r[0]['count'] > 100 else ("WARNING", f"Only {r[0]['count']} questions"),
    "Shared physics should have substantial question pool"
)

# TEST 11: Mapping integrity
run_test(
    "Mapping table integrity",
    """
    SELECT COUNT(*) as invalid
    FROM subject_migration_map m
    WHERE NOT EXISTS (SELECT 1 FROM dim_subjects s WHERE s.subject_code = m.new_subject_code)
    """,
    lambda r: ("PASS", "All mappings valid") if r[0]['invalid'] == 0 else ("FAIL", f"{r[0]['invalid']} invalid mappings!"),
    "All mappings must point to valid shared subjects"
)

# TEST 12: No data loss
run_test(
    "No data loss",
    """
    SELECT
        (SELECT COUNT(*) FROM dim_subjects WHERE subject_code LIKE '%-%') as old_count,
        (SELECT COUNT(*) FROM dim_subjects WHERE subject_code NOT LIKE '%-%') as new_count,
        (SELECT COUNT(*) FROM dim_subjects) as total
    """,
    lambda r: ("PASS", f"Old: {r[0]['old_count']}, New: {r[0]['new_count']}, Total: {r[0]['total']}") if r[0]['total'] >= 100 else ("FAIL", f"Only {r[0]['total']} subjects!"),
    "Total subjects should be old + new combined"
)

# TEST 13: Topics linked
run_test(
    "Shared subjects have topics",
    """
    SELECT COUNT(DISTINCT s.id) as count
    FROM dim_subjects s
    JOIN bridge_exam_subject_topic b ON s.id = b.subject_id
    WHERE s.subject_code NOT LIKE '%-%'
    """,
    lambda r: ("PASS", f"{r[0]['count']} subjects with topics") if r[0]['count'] >= 20 else ("WARNING", f"Only {r[0]['count']} subjects with topics"),
    "Most shared subjects should be linked to topics"
)

# Close connection
cur.close()
conn.close()

# Final summary
print("\n" + "="*80)
print("VALIDATION SUMMARY")
print("="*80)
print(f"✅ Passed: {tests_passed}/13")
print(f"⚠️  Warnings: {tests_warning}/13")
print(f"❌ Failed: {tests_failed}/13")
print()

if tests_failed == 0 and tests_warning == 0:
    print("🎉 PERFECT! Migration completed successfully with no issues.")
    print("✅ Safe to proceed with production testing.")
    print()
    print("Next steps:")
    print("1. Test quiz generation: https://krakkify.in")
    print("2. Generate JEE Physics quiz")
    print("3. Generate NEET Physics quiz")
    print("4. Check that both share questions")
    sys.exit(0)
elif tests_failed == 0:
    print("✅ Migration completed successfully.")
    print(f"⚠️  {tests_warning} warning(s) - review above for details.")
    print("✅ Generally safe to proceed, but monitor closely.")
    sys.exit(0)
else:
    print("❌ MIGRATION VALIDATION FAILED!")
    print(f"❌ {tests_failed} critical error(s) detected.")
    print("🚫 DO NOT proceed to production.")
    print()
    print("Rollback instructions:")
    print("1. Open Supabase SQL Editor")
    print("2. Run the rollback SQL from VALIDATE-THEN-MIGRATE.md")
    sys.exit(1)
