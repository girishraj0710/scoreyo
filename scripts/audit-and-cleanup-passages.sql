-- Audit and Cleanup: Remove Questions Without Passages
-- Purpose: Find and delete reading comprehension questions that should have passages but don't
-- Date: 2026-06-09

-- Step 1: Audit - Find all questions that reference passages but don't have passage data
SELECT
  'english_questions' as table_name,
  COUNT(*) as total_questions,
  COUNT(CASE WHEN passage IS NOT NULL THEN 1 END) as with_passages,
  COUNT(CASE WHEN passage IS NULL THEN 1 END) as without_passages,
  COUNT(CASE WHEN question LIKE '%passage%' OR question LIKE '%according to%' THEN 1 END) as mentions_passage
FROM english_questions
UNION ALL
SELECT
  'fact_exam_questions' as table_name,
  COUNT(*) as total_questions,
  COUNT(CASE WHEN passage IS NOT NULL THEN 1 END) as with_passages,
  COUNT(CASE WHEN passage IS NULL THEN 1 END) as without_passages,
  COUNT(CASE WHEN question LIKE '%passage%' OR question LIKE '%according to%' THEN 1 END) as mentions_passage
FROM fact_exam_questions;

-- Step 2: Find specific topics that are reading comprehension
SELECT
  'english_questions' as table_name,
  path_id,
  topic_id,
  level,
  COUNT(*) as question_count,
  COUNT(CASE WHEN passage IS NOT NULL THEN 1 END) as with_passages,
  COUNT(CASE WHEN passage IS NULL THEN 1 END) as without_passages
FROM english_questions
WHERE
  topic_id LIKE '%reading%'
  OR topic_id LIKE '%comprehension%'
  OR topic_id LIKE '%passage%'
GROUP BY path_id, topic_id, level;

-- Step 3: Delete questions that mention passages but have no passage data
-- ENGLISH_QUESTIONS table
DELETE FROM english_questions
WHERE (
  topic_id LIKE '%reading%'
  OR topic_id LIKE '%comprehension%'
  OR topic_id LIKE '%passage%'
  OR question LIKE '%according to the passage%'
  OR question LIKE '%passage%'
)
AND passage IS NULL;

-- Step 4: Delete from FACT_EXAM_QUESTIONS table
-- Only delete if they mention passages but have none
DELETE FROM fact_exam_questions
WHERE (
  question LIKE '%according to the passage%'
  OR question LIKE '%as per the passage%'
  OR question LIKE '%based on the passage%'
  OR question LIKE '%the passage states%'
  OR question LIKE '%from the passage%'
)
AND passage IS NULL;

-- Step 5: Verify deletion
SELECT
  'After Cleanup - english_questions' as table_name,
  COUNT(*) as remaining_questions,
  COUNT(CASE WHEN passage IS NOT NULL THEN 1 END) as with_passages
FROM english_questions
WHERE
  topic_id LIKE '%reading%'
  OR topic_id LIKE '%comprehension%'
  OR topic_id LIKE '%passage%'
UNION ALL
SELECT
  'After Cleanup - fact_exam_questions' as table_name,
  COUNT(*) as remaining_questions,
  COUNT(CASE WHEN passage IS NOT NULL THEN 1 END) as with_passages
FROM fact_exam_questions
WHERE question LIKE '%according to the passage%'
  OR question LIKE '%as per the passage%'
  OR question LIKE '%based on the passage%';

-- Step 6: Summary
SELECT
  'CLEANUP COMPLETE' as status,
  (SELECT COUNT(*) FROM english_questions WHERE passage IS NULL AND (topic_id LIKE '%reading%' OR question LIKE '%passage%')) as remaining_orphaned_questions,
  'Next: Generate fresh reading comprehension questions via /api/quiz' as action;
