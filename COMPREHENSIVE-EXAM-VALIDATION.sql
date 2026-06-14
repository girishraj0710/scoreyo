-- ============================================================================
-- COMPREHENSIVE EXAM VALIDATION - ALL 74 EXAMS
-- Critical: Every exam must work perfectly - no exceptions
-- One broken exam = students can't prepare = platform failure
-- ============================================================================

\echo '============================================================================'
\echo 'COMPREHENSIVE VALIDATION - ALL 74 EXAMS'
\echo '============================================================================'
\echo ''

-- ============================================================================
-- TEST 1: EVERY EXAM HAS SUBJECTS (CRITICAL)
-- ============================================================================
\echo 'TEST 1: Checking if all 74 exams have subjects...'
\echo ''

SELECT
  e.exam_code,
  e.exam_name,
  COUNT(DISTINCT s.id) as subject_count,
  COUNT(DISTINCT b.topic_id) as topic_count,
  CASE
    WHEN COUNT(DISTINCT s.id) = 0 THEN '❌ CRITICAL: NO SUBJECTS'
    WHEN COUNT(DISTINCT b.topic_id) = 0 THEN '❌ CRITICAL: NO TOPICS'
    WHEN COUNT(DISTINCT s.id) < 3 THEN '⚠️  WARNING: Only ' || COUNT(DISTINCT s.id) || ' subjects'
    ELSE '✅ OK'
  END as status
FROM dim_exams e
LEFT JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
LEFT JOIN dim_subjects s ON b.subject_id = s.id
GROUP BY e.exam_code, e.exam_name
ORDER BY
  CASE
    WHEN COUNT(DISTINCT s.id) = 0 THEN 1
    WHEN COUNT(DISTINCT b.topic_id) = 0 THEN 2
    WHEN COUNT(DISTINCT s.id) < 3 THEN 3
    ELSE 4
  END,
  e.exam_code;

\echo ''
\echo 'Expected: All 74 exams should show ✅ OK'
\echo 'If any exam shows ❌ CRITICAL: Migration incomplete - MUST FIX'
\echo ''

-- ============================================================================
-- TEST 2: SHARED SUBJECTS USAGE
-- ============================================================================
\echo '============================================================================'
\echo 'TEST 2: Checking shared subject usage across exams...'
\echo ''

SELECT
  s.subject_code as shared_subject,
  s.subject_name,
  COUNT(DISTINCT e.exam_code) as exam_count,
  COUNT(DISTINCT b.topic_id) as total_topics
FROM dim_subjects s
JOIN bridge_exam_subject_topic b ON s.id = b.subject_id
JOIN dim_exams e ON b.exam_id = e.id
WHERE s.subject_code NOT LIKE '%-%'  -- Shared subjects only
GROUP BY s.subject_code, s.subject_name
ORDER BY exam_count DESC, s.subject_code;

\echo ''
\echo 'Expected: Core subjects (physics, chemistry, maths) used by 20+ exams'
\echo ''

-- ============================================================================
-- TEST 3: SUBJECT MAPPER COVERAGE
-- ============================================================================
\echo '============================================================================'
\echo 'TEST 3: Checking subject_migration_map coverage...'
\echo ''

-- Count total exam-specific subjects in database
WITH exam_specific_subjects AS (
  SELECT subject_code
  FROM dim_subjects
  WHERE subject_code LIKE '%-%'
),
mapped_subjects AS (
  SELECT old_subject_code
  FROM subject_migration_map
)
SELECT
  (SELECT COUNT(*) FROM exam_specific_subjects) as total_exam_subjects,
  (SELECT COUNT(*) FROM mapped_subjects) as mapped_subjects,
  (SELECT COUNT(*) FROM exam_specific_subjects) - (SELECT COUNT(*) FROM mapped_subjects) as unmapped_count,
  CASE
    WHEN (SELECT COUNT(*) FROM exam_specific_subjects) = (SELECT COUNT(*) FROM mapped_subjects)
    THEN '✅ All subjects mapped'
    ELSE '❌ CRITICAL: ' || ((SELECT COUNT(*) FROM exam_specific_subjects) - (SELECT COUNT(*) FROM mapped_subjects))::text || ' subjects unmapped'
  END as status;

\echo ''
\echo 'Expected: All exam-specific subjects should be in migration map'
\echo ''

-- ============================================================================
-- TEST 4: ORPHANED SUBJECTS (CRITICAL DATA INTEGRITY)
-- ============================================================================
\echo '============================================================================'
\echo 'TEST 4: Checking for orphaned subjects (subjects not linked to any exam)...'
\echo ''

SELECT
  s.subject_code,
  s.subject_name,
  'Subject exists but not used by any exam' as issue
FROM dim_subjects s
WHERE NOT EXISTS (
  SELECT 1 FROM bridge_exam_subject_topic b
  WHERE b.subject_id = s.id
)
ORDER BY s.subject_code;

\echo ''
\echo 'Expected: No rows (all subjects should be used)'
\echo 'If rows found: Orphaned subjects - cleanup needed'
\echo ''

-- ============================================================================
-- TEST 5: DUPLICATE BRIDGE ENTRIES (CRITICAL DATA CORRUPTION CHECK)
-- ============================================================================
\echo '============================================================================'
\echo 'TEST 5: Checking for duplicate bridge entries...'
\echo ''

SELECT
  e.exam_code,
  s.subject_code,
  t.topic_name,
  COUNT(*) as duplicate_count,
  '❌ CRITICAL: Data corruption' as status
FROM bridge_exam_subject_topic b
JOIN dim_exams e ON b.exam_id = e.id
JOIN dim_subjects s ON b.subject_id = s.id
JOIN dim_topics t ON b.topic_id = t.id
GROUP BY e.exam_code, s.subject_code, t.topic_name, b.exam_id, b.subject_id, b.topic_id
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 20;

\echo ''
\echo 'Expected: No rows (no duplicates allowed)'
\echo 'If rows found: ❌ CRITICAL - Data corruption - MUST FIX IMMEDIATELY'
\echo ''

-- ============================================================================
-- TEST 6: EXAM CATEGORIES COVERAGE
-- ============================================================================
\echo '============================================================================'
\echo 'TEST 6: Checking coverage by exam category...'
\echo ''

WITH exam_categories AS (
  SELECT
    exam_code,
    CASE
      WHEN exam_code IN ('jee-main', 'jee-advanced', 'neet-ug', 'neet-pg', 'aiims-nursing') THEN 'Medical/Engineering'
      WHEN exam_code IN ('gate', 'nimcet', 'ap-eamcet', 'ts-eamcet', 'kcet', 'keam', 'comedk', 'wbjee', 'mht-cet', 'gujcet', 'upsee', 'bcece', 'jcece', 'ojee', 'reap', 'tnea') THEN 'Engineering (State)'
      WHEN exam_code IN ('upsc-cse', 'ssc-cgl', 'ssc-chsl', 'ibps-po', 'ibps-clerk', 'sbi-po', 'rrb-ntpc', 'rrb-alp', 'rrb-je', 'rrb-group-d') THEN 'Government Jobs'
      WHEN exam_code IN ('cat', 'xat', 'clat', 'ailet') THEN 'MBA/Law'
      WHEN exam_code IN ('ctet', 'uptet', 'rtet', 'htet', 'kvs') THEN 'Teaching'
      WHEN exam_code IN ('nda', 'cds', 'afcat', 'indian-navy', 'indian-army') THEN 'Defense'
      WHEN exam_code LIKE '%psc%' OR exam_code IN ('uppsc', 'bpsc', 'mppsc', 'rpsc', 'kpsc', 'tnpsc', 'wbpsc') THEN 'State PSC'
      WHEN exam_code IN ('ca-foundation', 'cs-foundation', 'ugc-net', 'isi', 'icar-aieea') THEN 'Professional/Academic'
      ELSE 'Other'
    END as category
  FROM dim_exams
)
SELECT
  c.category,
  COUNT(DISTINCT c.exam_code) as exam_count,
  COUNT(DISTINCT b.topic_id) as total_topics,
  ROUND(AVG(subj_counts.subject_count), 1) as avg_subjects_per_exam
FROM exam_categories c
JOIN dim_exams e ON c.exam_code = e.exam_code
LEFT JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
LEFT JOIN (
  SELECT exam_id, COUNT(DISTINCT subject_id) as subject_count
  FROM bridge_exam_subject_topic
  GROUP BY exam_id
) subj_counts ON e.id = subj_counts.exam_id
GROUP BY c.category
ORDER BY exam_count DESC;

\echo ''
\echo 'Expected: All categories should have topics and subjects'
\echo ''

-- ============================================================================
-- TEST 7: SHARED PHYSICS VERIFICATION (FLAGSHIP FEATURE)
-- ============================================================================
\echo '============================================================================'
\echo 'TEST 7: Verifying physics sharing between JEE, NEET, and other exams...'
\echo ''

SELECT
  e.exam_code,
  e.exam_name,
  s.subject_code,
  COUNT(DISTINCT b.topic_id) as topic_count,
  CASE
    WHEN s.subject_code = 'physics' THEN '✅ Using shared physics'
    ELSE '⚠️  Using exam-specific physics'
  END as status
FROM bridge_exam_subject_topic b
JOIN dim_exams e ON b.exam_id = e.id
JOIN dim_subjects s ON b.subject_id = s.id
WHERE (s.subject_code = 'physics' OR s.subject_code LIKE '%-physics')
  AND e.exam_code IN ('jee-main', 'jee-advanced', 'neet-ug', 'kcet', 'comedk', 'wbjee', 'mht-cet')
GROUP BY e.exam_code, e.exam_name, s.subject_code
ORDER BY e.exam_code, s.subject_code;

\echo ''
\echo 'Expected: All engineering exams should use shared "physics" subject'
\echo ''

-- ============================================================================
-- TEST 8: EXAMS WITHOUT SHARED SUBJECTS (NEEDS MIGRATION)
-- ============================================================================
\echo '============================================================================'
\echo 'TEST 8: Finding exams that only use exam-specific subjects...'
\echo ''

WITH exams_using_shared AS (
  SELECT DISTINCT e.exam_code
  FROM dim_exams e
  JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
  JOIN dim_subjects s ON b.subject_id = s.id
  WHERE s.subject_code NOT LIKE '%-%'
)
SELECT
  e.exam_code,
  e.exam_name,
  COUNT(DISTINCT b.subject_id) as subject_count,
  '⚠️  Not using shared subjects yet' as status
FROM dim_exams e
JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
WHERE e.exam_code NOT IN (SELECT exam_code FROM exams_using_shared)
GROUP BY e.exam_code, e.exam_name
ORDER BY e.exam_code;

\echo ''
\echo 'Expected: 0 rows (all exams should use at least one shared subject)'
\echo 'If rows found: These exams need migration to shared subjects'
\echo ''

-- ============================================================================
-- TEST 9: QUESTION POOL SIZES PER EXAM
-- ============================================================================
\echo '============================================================================'
\echo 'TEST 9: Checking question pool sizes for each exam...'
\echo ''

SELECT
  e.exam_code,
  e.exam_name,
  COUNT(DISTINCT q.id) as question_count,
  COUNT(DISTINCT t.id) as topic_count,
  CASE
    WHEN COUNT(DISTINCT q.id) = 0 THEN '❌ CRITICAL: No questions'
    WHEN COUNT(DISTINCT q.id) < 50 THEN '⚠️  WARNING: Only ' || COUNT(DISTINCT q.id) || ' questions'
    WHEN COUNT(DISTINCT q.id) < 100 THEN '⚠️  Low: ' || COUNT(DISTINCT q.id) || ' questions'
    ELSE '✅ Good: ' || COUNT(DISTINCT q.id) || ' questions'
  END as status
FROM dim_exams e
LEFT JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
LEFT JOIN dim_topics t ON b.topic_id = t.id
LEFT JOIN fact_exam_questions q ON t.id = q.topic_id
GROUP BY e.exam_code, e.exam_name
ORDER BY
  CASE
    WHEN COUNT(DISTINCT q.id) = 0 THEN 1
    WHEN COUNT(DISTINCT q.id) < 50 THEN 2
    WHEN COUNT(DISTINCT q.id) < 100 THEN 3
    ELSE 4
  END,
  question_count DESC;

\echo ''
\echo 'Expected: All exams should have 100+ questions'
\echo 'If < 50 questions: Quiz generation will rely heavily on AI'
\echo ''

-- ============================================================================
-- TEST 10: MISSING SUBJECT MAPPINGS (FIND GAPS)
-- ============================================================================
\echo '============================================================================'
\echo 'TEST 10: Finding exam-specific subjects without mappings...'
\echo ''

SELECT
  s.subject_code,
  s.subject_name,
  '❌ Not in migration map' as status
FROM dim_subjects s
WHERE s.subject_code LIKE '%-%'
  AND NOT EXISTS (
    SELECT 1 FROM subject_migration_map m
    WHERE m.old_subject_code = s.subject_code
  )
ORDER BY s.subject_code
LIMIT 50;

\echo ''
\echo 'Expected: 0 rows (all exam subjects should be mapped)'
\echo 'If rows found: subject-mapper.ts needs these mappings added'
\echo ''

-- ============================================================================
-- SUMMARY REPORT
-- ============================================================================
\echo '============================================================================'
\echo 'VALIDATION SUMMARY'
\echo '============================================================================'

SELECT
  'Total Exams' as metric,
  COUNT(*)::text as value
FROM dim_exams
UNION ALL
SELECT
  'Exams with Subjects',
  COUNT(DISTINCT e.exam_code)::text
FROM dim_exams e
JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
UNION ALL
SELECT
  'Exams Using Shared Subjects',
  COUNT(DISTINCT e.exam_code)::text
FROM dim_exams e
JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
JOIN dim_subjects s ON b.subject_id = s.id
WHERE s.subject_code NOT LIKE '%-%'
UNION ALL
SELECT
  'Total Shared Subjects',
  COUNT(*)::text
FROM dim_subjects
WHERE subject_code NOT LIKE '%-%'
UNION ALL
SELECT
  'Total Exam-Specific Subjects',
  COUNT(*)::text
FROM dim_subjects
WHERE subject_code LIKE '%-%'
UNION ALL
SELECT
  'Total Topics',
  COUNT(*)::text
FROM dim_topics
UNION ALL
SELECT
  'Total Questions',
  COUNT(*)::text
FROM fact_exam_questions;

\echo ''
\echo '============================================================================'
\echo 'END OF COMPREHENSIVE VALIDATION'
\echo '============================================================================'
