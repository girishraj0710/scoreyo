-- ============================================================================
-- SUPABASE DATABASE VALIDATION QUERIES
-- Run these in Supabase SQL Editor BEFORE executing the migration
-- ============================================================================

-- Copy each section and run it separately in Supabase SQL Editor
-- Review the results to ensure everything looks correct

-- ============================================================================
-- 1. CHECK DIMENSIONAL MODEL TABLES EXIST
-- ============================================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('dim_exams', 'dim_subjects', 'dim_topics',
                      'bridge_exam_subject_topic', 'fact_exam_questions')
ORDER BY table_name;

-- Expected: All 5 tables should appear
-- If any are missing, STOP - database not ready


-- ============================================================================
-- 2. COUNT CURRENT SUBJECTS
-- ============================================================================
-- Exam-specific subjects (with dash, like "jee-physics")
SELECT COUNT(*) as exam_specific_count
FROM dim_subjects
WHERE subject_code LIKE '%-%';

-- Shared subjects (no dash, like "physics")
SELECT COUNT(*) as shared_count
FROM dim_subjects
WHERE subject_code NOT LIKE '%-%';

-- List first 20 exam-specific subjects
SELECT subject_code
FROM dim_subjects
WHERE subject_code LIKE '%-%'
ORDER BY subject_code
LIMIT 20;

-- Expected: exam_specific_count should be > 0 (probably 50-150)
--           shared_count might be 0 or small (2-3) before migration


-- ============================================================================
-- 3. COUNT EXAMS, TOPICS, QUESTIONS
-- ============================================================================
SELECT
  (SELECT COUNT(*) FROM dim_exams) as total_exams,
  (SELECT COUNT(*) FROM dim_subjects) as total_subjects,
  (SELECT COUNT(*) FROM dim_topics) as total_topics,
  (SELECT COUNT(*) FROM bridge_exam_subject_topic) as total_bridge_entries,
  (SELECT COUNT(*) FROM fact_exam_questions) as total_questions;

-- Expected:
-- total_exams: 20-50
-- total_subjects: 50-200
-- total_topics: 100-500
-- total_bridge_entries: 500-2000
-- total_questions: 1000-50000


-- ============================================================================
-- 4. SAMPLE CURRENT STRUCTURE (JEE & NEET PHYSICS)
-- ============================================================================
SELECT
  e.exam_code,
  s.subject_code,
  t.topic_name,
  COUNT(q.id) as question_count
FROM bridge_exam_subject_topic b
JOIN dim_exams e ON b.exam_id = e.id
JOIN dim_subjects s ON b.subject_id = s.id
JOIN dim_topics t ON b.topic_id = t.id
LEFT JOIN fact_exam_questions q ON q.topic_id = t.id
WHERE e.exam_code IN ('jee-main', 'neet')
  AND s.subject_code LIKE '%physics%'
GROUP BY e.exam_code, s.subject_code, t.topic_name
ORDER BY e.exam_code, t.topic_name
LIMIT 10;

-- Expected: Should show "jee-physics" and "neet-physics" as SEPARATE subjects
-- Example output:
-- jee-main | jee-physics | Mechanics | 50
-- neet     | neet-physics | Mechanics | 40


-- ============================================================================
-- 5. CHECK IF MIGRATION WAS ALREADY RUN
-- ============================================================================
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name = 'subject_migration_map'
) as migration_table_exists;

-- Expected: false (migration not yet run)
-- If true: Migration was already run! Be careful - might need to revert first


-- ============================================================================
-- 6. FIND ALL UNIQUE EXAM-SPECIFIC SUBJECTS IN DATABASE
-- ============================================================================
SELECT DISTINCT subject_code
FROM dim_subjects
WHERE subject_code LIKE '%-%'
ORDER BY subject_code;

-- Copy this list and compare with subject-mapper.ts
-- Every subject here MUST have a mapping in SUBJECT_MAP


-- ============================================================================
-- 7. CHECK QUESTION DISTRIBUTION BY SUBJECT
-- ============================================================================
SELECT
  s.subject_code,
  COUNT(DISTINCT t.id) as topic_count,
  COUNT(DISTINCT q.id) as question_count
FROM dim_subjects s
LEFT JOIN bridge_exam_subject_topic b ON s.id = b.subject_id
LEFT JOIN dim_topics t ON b.topic_id = t.id
LEFT JOIN fact_exam_questions q ON t.id = q.topic_id
WHERE s.subject_code LIKE '%physics%'
  OR s.subject_code LIKE '%chemistry%'
  OR s.subject_code LIKE '%maths%'
GROUP BY s.subject_code
ORDER BY question_count DESC
LIMIT 20;

-- Expected: Shows how questions are distributed across exam-specific subjects
-- After migration, all *-physics questions will merge into one "physics" pool


-- ============================================================================
-- 8. VERIFY TOPICS ARE ALREADY SHARED (IMPORTANT!)
-- ============================================================================
SELECT
  t.topic_name,
  COUNT(DISTINCT e.exam_code) as exam_count,
  STRING_AGG(DISTINCT e.exam_code, ', ' ORDER BY e.exam_code) as exam_list
FROM dim_topics t
JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
JOIN dim_exams e ON b.exam_id = e.id
WHERE t.topic_name IN ('Mechanics', 'Thermodynamics', 'Organic Chemistry', 'Algebra')
GROUP BY t.topic_name
ORDER BY exam_count DESC;

-- Expected: Each topic should appear for MULTIPLE exams
-- Example: Mechanics should be used by jee-main, neet, kcet, etc.
-- This confirms topics are already shared (good!)


-- ============================================================================
-- 9. PREVIEW WHAT MIGRATION WILL DO (SIMULATION)
-- ============================================================================
-- This query simulates the subject mapping without actually changing anything
SELECT
  s.subject_code as current_subject,
  CASE
    -- Core sciences
    WHEN s.subject_code LIKE '%-physics' THEN 'physics'
    WHEN s.subject_code LIKE '%-chemistry' THEN 'chemistry'
    WHEN s.subject_code LIKE '%-maths' OR s.subject_code LIKE '%-mathematics' THEN 'mathematics'
    WHEN s.subject_code LIKE '%-biology' THEN 'biology'
    -- Aptitude
    WHEN s.subject_code LIKE '%-gk' OR s.subject_code LIKE '%-ga' THEN 'general-knowledge'
    WHEN s.subject_code LIKE '%-gs' OR s.subject_code LIKE '%-csat' THEN 'general-studies'
    WHEN s.subject_code LIKE '%-reasoning' OR s.subject_code LIKE '%-logical' THEN 'logical-reasoning'
    WHEN s.subject_code LIKE '%-quant%' OR s.subject_code LIKE '%-numerical' THEN 'quantitative-aptitude'
    WHEN s.subject_code LIKE '%-verbal' THEN 'verbal-ability'
    -- Fallback: strip prefix
    ELSE REGEXP_REPLACE(s.subject_code, '^[a-z]+-', '')
  END as planned_shared_subject,
  COUNT(DISTINCT e.exam_code) as exam_count,
  STRING_AGG(DISTINCT e.exam_code, ', ' ORDER BY e.exam_code) as exams
FROM dim_subjects s
JOIN bridge_exam_subject_topic b ON s.id = b.subject_id
JOIN dim_exams e ON b.exam_id = e.id
WHERE s.subject_code LIKE '%-%'
GROUP BY s.subject_code
ORDER BY planned_shared_subject, s.subject_code;

-- Expected: Shows how exam-specific subjects will map to shared subjects
-- Review this carefully to ensure mappings look correct


-- ============================================================================
-- 10. FINAL SAFETY CHECK
-- ============================================================================
SELECT
  'Dimensional tables' as check_item,
  CASE WHEN COUNT(*) = 5 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('dim_exams', 'dim_subjects', 'dim_topics',
                      'bridge_exam_subject_topic', 'fact_exam_questions')

UNION ALL

SELECT
  'Exam-specific subjects exist' as check_item,
  CASE WHEN COUNT(*) > 0 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM dim_subjects
WHERE subject_code LIKE '%-%'

UNION ALL

SELECT
  'Migration not yet run' as check_item,
  CASE
    WHEN NOT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'subject_migration_map'
    ) THEN '✅ PASS' ELSE '⚠️ ALREADY RUN'
  END as status

UNION ALL

SELECT
  'Questions exist' as check_item,
  CASE WHEN COUNT(*) > 0 THEN '✅ PASS' ELSE '⚠️ NO QUESTIONS' END as status
FROM fact_exam_questions;

-- Expected: All checks should show ✅ PASS
-- If "Migration not yet run" shows ⚠️ ALREADY RUN, investigate carefully


-- ============================================================================
-- VALIDATION COMPLETE
-- ============================================================================
-- If all checks pass, you're ready to run the migration!
-- Open migration-dimensional-model.sql from your Desktop and run it.
