#!/usr/bin/env python3
"""
Post-Migration Validation Script
Runs comprehensive validation after dimensional model migration
Generates detailed report with pass/fail status for each test
"""

import os
import sys
from datetime import datetime
from urllib.parse import urlparse

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    print("\n❌ Error: psycopg2 not installed")
    print("\nPlease run this script using:")
    print("  ./scripts/run-validation.sh")
    print("\nOr install manually:")
    print("  pip install --user psycopg2-binary")
    sys.exit(1)

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


class ValidationTest:
    """Represents a single validation test"""
    def __init__(self, name, query, expected_fn, description=""):
        self.name = name
        self.query = query
        self.expected_fn = expected_fn
        self.description = description
        self.result = None
        self.status = None
        self.message = None

    def run(self, cursor):
        """Execute test and determine pass/fail"""
        try:
            cursor.execute(self.query)
            self.result = cursor.fetchall()
            self.status, self.message = self.expected_fn(self.result)
        except Exception as e:
            self.status = "❌ ERROR"
            self.message = str(e)


def validate():
    print('\n' + '='*80)
    print('POST-MIGRATION VALIDATION REPORT')
    print(f'Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    print('='*80 + '\n')

    conn = psycopg2.connect(db_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)

    tests = []
    passed = 0
    failed = 0
    warnings = 0

    # ========================================================================
    # TEST 1: Shared subjects created
    # ========================================================================
    tests.append(ValidationTest(
        "Shared Subjects Created",
        """
        SELECT COUNT(*) as count
        FROM dim_subjects
        WHERE subject_code NOT LIKE '%-%'
        """,
        lambda r: ("✅ PASS", f"Created {r[0]['count']} shared subjects")
                  if r[0]['count'] == 52
                  else ("❌ FAIL", f"Expected 52, got {r[0]['count']}"),
        "Verifies all 52 shared subjects were inserted"
    ))

    # ========================================================================
    # TEST 2: Migration mapping table
    # ========================================================================
    tests.append(ValidationTest(
        "Migration Mapping Table",
        "SELECT COUNT(*) as count FROM subject_migration_map",
        lambda r: ("✅ PASS", f"Created {r[0]['count']} mappings")
                  if r[0]['count'] >= 295
                  else ("❌ FAIL", f"Expected 295+, got {r[0]['count']}"),
        "Verifies subject_migration_map was created with all mappings"
    ))

    # ========================================================================
    # TEST 3: No duplicate bridge entries
    # ========================================================================
    tests.append(ValidationTest(
        "No Duplicate Bridge Entries",
        """
        SELECT COUNT(*) as duplicates
        FROM (
            SELECT exam_id, subject_id, topic_id, COUNT(*) as cnt
            FROM bridge_exam_subject_topic
            GROUP BY exam_id, subject_id, topic_id
            HAVING COUNT(*) > 1
        ) dup
        """,
        lambda r: ("✅ PASS", "No duplicates found")
                  if r[0]['duplicates'] == 0
                  else ("❌ FAIL", f"Found {r[0]['duplicates']} duplicate entries!"),
        "Checks for duplicate bridge table entries (data corruption)"
    ))

    # ========================================================================
    # TEST 4: Foreign key integrity - exams
    # ========================================================================
    tests.append(ValidationTest(
        "Foreign Key: Bridge → Exams",
        """
        SELECT COUNT(*) as orphans
        FROM bridge_exam_subject_topic b
        WHERE NOT EXISTS (SELECT 1 FROM dim_exams e WHERE e.id = b.exam_id)
        """,
        lambda r: ("✅ PASS", "All exam references valid")
                  if r[0]['orphans'] == 0
                  else ("❌ FAIL", f"Found {r[0]['orphans']} orphaned exam references!"),
        "Verifies all bridge entries reference valid exams"
    ))

    # ========================================================================
    # TEST 5: Foreign key integrity - subjects
    # ========================================================================
    tests.append(ValidationTest(
        "Foreign Key: Bridge → Subjects",
        """
        SELECT COUNT(*) as orphans
        FROM bridge_exam_subject_topic b
        WHERE NOT EXISTS (SELECT 1 FROM dim_subjects s WHERE s.id = b.subject_id)
        """,
        lambda r: ("✅ PASS", "All subject references valid")
                  if r[0]['orphans'] == 0
                  else ("❌ FAIL", f"Found {r[0]['orphans']} orphaned subject references!"),
        "Verifies all bridge entries reference valid subjects"
    ))

    # ========================================================================
    # TEST 6: Foreign key integrity - topics
    # ========================================================================
    tests.append(ValidationTest(
        "Foreign Key: Bridge → Topics",
        """
        SELECT COUNT(*) as orphans
        FROM bridge_exam_subject_topic b
        WHERE NOT EXISTS (SELECT 1 FROM dim_topics t WHERE t.id = b.topic_id)
        """,
        lambda r: ("✅ PASS", "All topic references valid")
                  if r[0]['orphans'] == 0
                  else ("❌ FAIL", f"Found {r[0]['orphans']} orphaned topic references!"),
        "Verifies all bridge entries reference valid topics"
    ))

    # ========================================================================
    # TEST 7: JEE and NEET share physics
    # ========================================================================
    tests.append(ValidationTest(
        "JEE + NEET Share Physics",
        """
        SELECT e.exam_code, s.subject_code, COUNT(DISTINCT b.topic_id) as topics
        FROM bridge_exam_subject_topic b
        JOIN dim_exams e ON b.exam_id = e.id
        JOIN dim_subjects s ON b.subject_id = s.id
        WHERE e.exam_code IN ('jee-main', 'neet')
          AND s.subject_code = 'physics'
        GROUP BY e.exam_code, s.subject_code
        """,
        lambda r: ("✅ PASS", f"JEE: {r[0]['topics']} topics, NEET: {r[1]['topics']} topics (shared)")
                  if len(r) == 2 and r[0]['subject_code'] == 'physics' and r[1]['subject_code'] == 'physics'
                  else ("❌ FAIL", "JEE and NEET don't share physics subject!"),
        "Critical test: Verifies JEE and NEET now use shared 'physics'"
    ))

    # ========================================================================
    # TEST 8: Shared subjects used by multiple exams
    # ========================================================================
    tests.append(ValidationTest(
        "Shared Subjects Multi-Exam Usage",
        """
        SELECT COUNT(*) as shared_subjects_with_multiple_exams
        FROM (
            SELECT s.subject_code, COUNT(DISTINCT e.exam_code) as exam_count
            FROM dim_subjects s
            JOIN bridge_exam_subject_topic b ON s.id = b.subject_id
            JOIN dim_exams e ON b.exam_id = e.id
            WHERE s.subject_code NOT LIKE '%-%'
            GROUP BY s.subject_code
            HAVING COUNT(DISTINCT e.exam_code) > 1
        ) multi
        """,
        lambda r: ("✅ PASS", f"{r[0]['shared_subjects_with_multiple_exams']} shared subjects used by multiple exams")
                  if r[0]['shared_subjects_with_multiple_exams'] >= 10
                  else ("⚠️ WARNING", f"Only {r[0]['shared_subjects_with_multiple_exams']} shared subjects in use"),
        "Verifies shared subjects are actually being used by multiple exams"
    ))

    # ========================================================================
    # TEST 9: Old subjects preserved (backward compat)
    # ========================================================================
    tests.append(ValidationTest(
        "Backward Compatibility",
        """
        SELECT COUNT(*) as old_subjects
        FROM dim_subjects
        WHERE subject_code LIKE '%-%'
        """,
        lambda r: ("✅ PASS", f"{r[0]['old_subjects']} exam-specific subjects preserved")
                  if r[0]['old_subjects'] > 0
                  else ("⚠️ WARNING", "Old subjects deleted - check quiz_sessions compatibility"),
        "Ensures old exam-specific subjects still exist for backward compatibility"
    ))

    # ========================================================================
    # TEST 10: Physics question pool size
    # ========================================================================
    tests.append(ValidationTest(
        "Physics Question Pool Size",
        """
        SELECT COUNT(DISTINCT q.id) as question_count
        FROM fact_exam_questions q
        JOIN dim_topics t ON q.topic_id = t.id
        JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
        JOIN dim_subjects s ON b.subject_id = s.id
        WHERE s.subject_code = 'physics'
        """,
        lambda r: ("✅ PASS", f"{r[0]['question_count']} physics questions in shared pool")
                  if r[0]['question_count'] > 100
                  else ("⚠️ WARNING", f"Only {r[0]['question_count']} physics questions - small pool"),
        "Verifies physics question pool is substantial"
    ))

    # ========================================================================
    # TEST 11: All mappings point to valid subjects
    # ========================================================================
    tests.append(ValidationTest(
        "Mapping Table Integrity",
        """
        SELECT COUNT(*) as invalid
        FROM subject_migration_map m
        WHERE NOT EXISTS (
            SELECT 1 FROM dim_subjects s WHERE s.subject_code = m.new_subject_code
        )
        """,
        lambda r: ("✅ PASS", "All mappings point to valid shared subjects")
                  if r[0]['invalid'] == 0
                  else ("❌ FAIL", f"{r[0]['invalid']} mappings point to non-existent subjects!"),
        "Verifies subject_migration_map references are valid"
    ))

    # ========================================================================
    # TEST 12: No subjects accidentally deleted
    # ========================================================================
    tests.append(ValidationTest(
        "No Data Loss",
        """
        SELECT
            (SELECT COUNT(*) FROM dim_subjects WHERE subject_code LIKE '%-%') as old_count,
            (SELECT COUNT(*) FROM dim_subjects WHERE subject_code NOT LIKE '%-%') as new_count,
            (SELECT COUNT(*) FROM dim_subjects) as total_count
        """,
        lambda r: ("✅ PASS", f"Old: {r[0]['old_count']}, New: {r[0]['new_count']}, Total: {r[0]['total_count']}")
                  if r[0]['total_count'] >= 100
                  else ("❌ FAIL", f"Only {r[0]['total_count']} subjects - data loss!"),
        "Verifies no subjects were accidentally deleted"
    ))

    # ========================================================================
    # TEST 13: Topics linked to shared subjects
    # ========================================================================
    tests.append(ValidationTest(
        "Shared Subjects Have Topics",
        """
        SELECT COUNT(DISTINCT s.id) as subjects_with_topics
        FROM dim_subjects s
        JOIN bridge_exam_subject_topic b ON s.id = b.subject_id
        WHERE s.subject_code NOT LIKE '%-%'
        """,
        lambda r: ("✅ PASS", f"{r[0]['subjects_with_topics']} shared subjects have topics")
                  if r[0]['subjects_with_topics'] >= 20
                  else ("⚠️ WARNING", f"Only {r[0]['subjects_with_topics']} shared subjects have topics"),
        "Verifies shared subjects are linked to topics via bridge table"
    ))

    # Run all tests
    print("Running validation tests...\n")
    for i, test in enumerate(tests, 1):
        print(f"[{i}/{len(tests)}] {test.name}...", end=" ", flush=True)
        test.run(cur)
        print(test.status)

        if test.status.startswith("✅"):
            passed += 1
        elif test.status.startswith("❌"):
            failed += 1
        else:
            warnings += 1

    cur.close()
    conn.close()

    # Print detailed results
    print('\n' + '='*80)
    print('DETAILED TEST RESULTS')
    print('='*80 + '\n')

    for test in tests:
        print(f"{test.status} {test.name}")
        print(f"   {test.message}")
        if test.description:
            print(f"   📋 {test.description}")
        print()

    # Print summary
    print('='*80)
    print('VALIDATION SUMMARY')
    print('='*80)
    print(f"✅ Passed: {passed}/{len(tests)}")
    print(f"⚠️  Warnings: {warnings}/{len(tests)}")
    print(f"❌ Failed: {failed}/{len(tests)}")
    print()

    if failed == 0 and warnings == 0:
        print("🎉 PERFECT! Migration completed successfully with no issues.")
        print("✅ Safe to proceed with production testing.")
        return 0
    elif failed == 0:
        print("✅ Migration completed successfully.")
        print(f"⚠️  {warnings} warning(s) - review above for details.")
        print("✅ Generally safe to proceed, but monitor closely.")
        return 0
    else:
        print("❌ MIGRATION VALIDATION FAILED!")
        print(f"❌ {failed} critical error(s) detected.")
        print("🚫 DO NOT proceed to production.")
        print("📋 Run rollback from VALIDATE-THEN-MIGRATE.md")
        return 1


if __name__ == '__main__':
    try:
        exit_code = validate()
        sys.exit(exit_code)
    except Exception as e:
        print(f"\n❌ FATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
