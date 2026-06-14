-- ============================================================================
-- POST-MIGRATION VALIDATION QUERIES
-- Run these AFTER executing migration-dimensional-model.sql
-- These verify the migration completed successfully with no errors
-- ============================================================================

-- Run each section and verify results match expected outcomes


-- ============================================================================
-- TEST 1: VERIFY SHARED SUBJECTS WERE CREATED
-- ============================================================================
SELECT
  'Shared subjects created' as test_name,
  COUNT(*) as actual_count,
  52 as expected_count,
  CASE WHEN COUNT(*) = 52 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM dim_subjects
WHERE subject_code NOT LIKE '%-%';

-- Should return: 52 shared subjects created
-- If FAIL: Migration didn't create all shared subjects


-- ============================================================================
-- TEST 2: VERIFY MIGRATION MAPPING TABLE EXISTS
-- ============================================================================
SELECT
  'Migration mapping table exists' as test_name,
  COUNT(*) as actual_mappings,
  295 as expected_mappings,
  CASE WHEN COUNT(*) >= 295 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM subject_migration_map;

-- Should return: 295 mappings
-- If FAIL: Migration didn't create mapping table or incomplete


-- ============================================================================
-- TEST 3: CHECK FOR DUPLICATE BRIDGE ENTRIES
-- ============================================================================
SELECT
  'No duplicate bridge entries' as test_name,
  COUNT(*) as duplicate_count,
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM (
  SELECT exam_id, subject_id, topic_id, COUNT(*) as cnt
  FROM bridge_exam_subject_topic
  GROUP BY exam_id, subject_id, topic_id
  HAVING COUNT(*) > 1
) duplicates;

-- Should return: 0 duplicates
-- If FAIL: Migration created duplicate bridge entries - data corruption!


-- ============================================================================
-- TEST 4: VERIFY ALL FOREIGN KEYS ARE VALID (NO ORPHANS)
-- ============================================================================
-- Check exam_id references
SELECT
  'Bridge → dim_exams FK valid' as test_name,
  COUNT(*) as orphaned_count,
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM bridge_exam_subject_topic b
WHERE NOT EXISTS (SELECT 1 FROM dim_exams e WHERE e.id = b.exam_id);

-- Check subject_id references
SELECT
  'Bridge → dim_subjects FK valid' as test_name,
  COUNT(*) as orphaned_count,
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM bridge_exam_subject_topic b
WHERE NOT EXISTS (SELECT 1 FROM dim_subjects s WHERE s.id = b.subject_id);

-- Check topic_id references
SELECT
  'Bridge → dim_topics FK valid' as test_name,
  COUNT(*) as orphaned_count,
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM bridge_exam_subject_topic b
WHERE NOT EXISTS (SELECT 1 FROM dim_topics t WHERE t.id = b.topic_id);

-- All should return: 0 orphaned records
-- If FAIL: Broken foreign key references!


-- ============================================================================
-- TEST 5: VERIFY JEE AND NEET NOW SHARE PHYSICS
-- ============================================================================
SELECT
  e.exam_code,
  s.subject_code,
  COUNT(DISTINCT b.topic_id) as shared_topic_count
FROM bridge_exam_subject_topic b
JOIN dim_exams e ON b.exam_id = e.id
JOIN dim_subjects s ON b.subject_id = s.id
WHERE e.exam_code IN ('jee-main', 'neet')
  AND s.subject_code = 'physics'
GROUP BY e.exam_code, s.subject_code
ORDER BY e.exam_code;

-- Expected output:
-- jee-main | physics | 10+
-- neet     | physics | 10+
-- Both should have SAME subject_code ('physics')
-- If they still show 'jee-physics' and 'neet-physics', migration didn't work!


-- ============================================================================
-- TEST 6: VERIFY SHARED SUBJECTS ARE USED BY MULTIPLE EXAMS
-- ============================================================================
SELECT
  s.subject_code as shared_subject,
  COUNT(DISTINCT e.exam_code) as exam_count,
  STRING_AGG(DISTINCT e.exam_code, ', ' ORDER BY e.exam_code) as exams_using_it
FROM dim_subjects s
JOIN bridge_exam_subject_topic b ON s.id = b.subject_id
JOIN dim_exams e ON b.exam_id = e.id
WHERE s.subject_code NOT LIKE '%-%'  -- Shared subjects only
GROUP BY s.subject_code
HAVING COUNT(DISTINCT e.exam_code) > 1  -- Used by multiple exams
ORDER BY exam_count DESC
LIMIT 20;

-- Expected: Physics should be used by 10+ exams (JEE, NEET, KCET, etc.)
-- Expected: Quantitative-aptitude should be used by 20+ exams (Banking, SSC, etc.)
-- If no results: Shared subjects aren't linked to exams!


-- ============================================================================
-- TEST 7: VERIFY OLD EXAM-SPECIFIC SUBJECTS STILL EXIST (BACKWARD COMPAT)
-- ============================================================================
SELECT
  'Old exam-specific subjects preserved' as test_name,
  COUNT(*) as count,
  CASE WHEN COUNT(*) > 0 THEN '✅ PASS (backward compatible)' ELSE '⚠️ WARNING (old subjects deleted)' END as status
FROM dim_subjects
WHERE subject_code LIKE '%-%';

-- Should return: 100+ old subjects still exist
-- This ensures backward compatibility with existing quiz_sessions data


-- ============================================================================
-- TEST 8: VERIFY QUESTION POOLS INCREASED FOR SHARED SUBJECTS
-- ============================================================================
-- Count questions accessible via shared physics
WITH shared_physics_questions AS (
  SELECT COUNT(DISTINCT q.id) as question_count
  FROM fact_exam_questions q
  JOIN dim_topics t ON q.topic_id = t.id
  JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
  JOIN dim_subjects s ON b.subject_id = s.id
  WHERE s.subject_code = 'physics'
)
SELECT
  'Physics question pool size' as test_name,
  question_count,
  CASE WHEN question_count > 100 THEN '✅ PASS (good pool size)' ELSE '⚠️ WARNING (small pool)' END as status
FROM shared_physics_questions;

-- Expected: 500-2000+ questions for physics
-- If too small: Questions aren't properly linked


-- ============================================================================
-- TEST 9: VERIFY TOPICS ARE PROPERLY LINKED TO SHARED SUBJECTS
-- ============================================================================
SELECT
  s.subject_code,
  COUNT(DISTINCT t.id) as topic_count,
  STRING_AGG(DISTINCT t.topic_name, ', ' ORDER BY t.topic_name) as sample_topics
FROM dim_subjects s
JOIN bridge_exam_subject_topic b ON s.id = b.subject_id
JOIN dim_topics t ON b.topic_id = t.id
WHERE s.subject_code IN ('physics', 'chemistry', 'mathematics', 'biology',
                          'general-knowledge', 'quantitative-aptitude')
GROUP BY s.subject_code
ORDER BY topic_count DESC;

-- Expected: Each shared subject should have 10-50+ topics
-- If 0 topics: Bridge entries not created correctly


-- ============================================================================
-- TEST 10: CHECK FOR CONFLICTS (SAME EXAM+TOPIC MAPPED TO BOTH OLD AND NEW)
-- ============================================================================
-- This checks if an exam+topic is linked to BOTH exam-specific AND shared subject
-- (This is actually OK temporarily, but we should be aware)
SELECT
  e.exam_code,
  t.topic_name,
  STRING_AGG(DISTINCT s.subject_code, ', ' ORDER BY s.subject_code) as subjects,
  COUNT(DISTINCT s.id) as subject_count,
  CASE
    WHEN COUNT(DISTINCT s.id) = 1 THEN '✅ Clean'
    WHEN COUNT(DISTINCT s.id) = 2 THEN '⚠️ Both old+new (OK temporarily)'
    ELSE '❌ ERROR: Multiple conflicts'
  END as status
FROM bridge_exam_subject_topic b
JOIN dim_exams e ON b.exam_id = e.id
JOIN dim_subjects s ON b.subject_id = s.id
JOIN dim_topics t ON b.topic_id = t.id
WHERE e.exam_code IN ('jee-main', 'neet')
  AND (s.subject_code LIKE '%physics%' OR s.subject_code = 'physics')
GROUP BY e.exam_code, t.topic_name
HAVING COUNT(DISTINCT s.id) > 1
LIMIT 10;

-- Expected: Some entries may show "Both old+new" - this is OK
-- Old entries will be cleaned up after 1 week of testing
-- If shows "Multiple conflicts": Data corruption!


-- ============================================================================
-- TEST 11: VERIFY MAPPING TABLE DATA IS CONSISTENT
-- ============================================================================
SELECT
  'All old subjects have mappings' as test_name,
  COUNT(*) as unmapped_count,
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '⚠️ WARNING: Some subjects unmapped' END as status
FROM dim_subjects s
WHERE s.subject_code LIKE '%-%'
  AND NOT EXISTS (
    SELECT 1 FROM subject_migration_map m
    WHERE m.old_subject_code = s.subject_code
  );

-- Should return: 0 unmapped
-- If >0: Some subjects in DB aren't in migration map


-- ============================================================================
-- TEST 12: VERIFY EACH MAPPED SUBJECT HAS CORRESPONDING SHARED SUBJECT
-- ============================================================================
SELECT
  'All mappings point to valid shared subjects' as test_name,
  COUNT(*) as invalid_mappings,
  CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL: Broken mappings' END as status
FROM subject_migration_map m
WHERE NOT EXISTS (
  SELECT 1 FROM dim_subjects s
  WHERE s.subject_code = m.new_subject_code
);

-- Should return: 0 invalid mappings
-- If >0: Mapping table points to non-existent shared subjects!


-- ============================================================================
-- TEST 13: SAMPLE VERIFICATION - SPECIFIC EXAM EXAMPLES
-- ============================================================================
-- JEE Main should have physics, chemistry, mathematics (shared)
SELECT
  'JEE Main subjects' as test_name,
  s.subject_code,
  COUNT(DISTINCT t.id) as topics
FROM bridge_exam_subject_topic b
JOIN dim_exams e ON b.exam_id = e.id
JOIN dim_subjects s ON b.subject_id = s.id
JOIN dim_topics t ON b.topic_id = t.id
WHERE e.exam_code = 'jee-main'
  AND s.subject_code IN ('physics', 'chemistry', 'mathematics')
GROUP BY s.subject_code;

-- Expected: All 3 subjects should appear with topics
-- If missing: JEE not linked to shared subjects


-- CAT should have data-interpretation, quantitative-aptitude, verbal-ability
SELECT
  'CAT subjects' as test_name,
  s.subject_code,
  COUNT(DISTINCT t.id) as topics
FROM bridge_exam_subject_topic b
JOIN dim_exams e ON b.exam_id = e.id
JOIN dim_subjects s ON b.subject_id = s.id
JOIN dim_topics t ON b.topic_id = t.id
WHERE e.exam_code = 'cat'
  AND s.subject_code IN ('data-interpretation', 'quantitative-aptitude', 'verbal-ability')
GROUP BY s.subject_code;

-- Expected: All 3 subjects should appear with topics


-- ============================================================================
-- TEST 14: VERIFY NO SUBJECTS WERE ACCIDENTALLY DELETED
-- ============================================================================
SELECT
  'Total subjects before+after' as test_name,
  (SELECT COUNT(*) FROM dim_subjects WHERE subject_code LIKE '%-%') as old_subjects,
  (SELECT COUNT(*) FROM dim_subjects WHERE subject_code NOT LIKE '%-%') as new_subjects,
  (SELECT COUNT(*) FROM dim_subjects) as total_subjects,
  CASE
    WHEN (SELECT COUNT(*) FROM dim_subjects) >= 100 THEN '✅ PASS'
    ELSE '❌ FAIL: Subjects lost!'
  END as status;

-- Expected: total_subjects = old_subjects + new_subjects
-- Old subjects should still be ~100-200
-- New subjects should be 52


-- ============================================================================
-- TEST 15: COMPREHENSIVE SUMMARY
-- ============================================================================
SELECT
  'MIGRATION VALIDATION SUMMARY' as report_title,
  (SELECT COUNT(*) FROM dim_subjects WHERE subject_code NOT LIKE '%-%') as shared_subjects_created,
  (SELECT COUNT(*) FROM subject_migration_map) as mappings_created,
  (SELECT COUNT(*) FROM bridge_exam_subject_topic b
   JOIN dim_subjects s ON b.subject_id = s.id
   WHERE s.subject_code NOT LIKE '%-%') as new_bridge_entries,
  (SELECT COUNT(DISTINCT s.id) FROM dim_subjects s
   JOIN bridge_exam_subject_topic b ON s.id = b.subject_id
   WHERE s.subject_code NOT LIKE '%-%') as shared_subjects_in_use,
  (SELECT COUNT(DISTINCT e.exam_code) FROM dim_exams e
   JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
   JOIN dim_subjects s ON b.subject_id = s.id
   WHERE s.subject_code NOT LIKE '%-%') as exams_using_shared_subjects;

-- Expected:
-- shared_subjects_created: 52
-- mappings_created: 295
-- new_bridge_entries: 1000-3000+
-- shared_subjects_in_use: 30-52 (some subjects may not be used yet)
-- exams_using_shared_subjects: 20-50


-- ============================================================================
-- VALIDATION COMPLETE
-- ============================================================================
/*
✅ If all tests show PASS:
   - Migration completed successfully
   - No data corruption
   - Foreign keys intact
   - Shared subjects working
   - Ready for production testing

⚠️ If any tests show WARNING:
   - Review the specific test
   - May be expected behavior
   - Document for monitoring

❌ If any tests show FAIL:
   - STOP immediately
   - Do not proceed with cleanup
   - Run rollback SQL from VALIDATE-THEN-MIGRATE.md
   - Share error details with support
*/
