-- Find and Delete Incomplete English Questions
-- Run this in Supabase SQL Editor

-- STEP 1: Find incomplete questions (REVIEW FIRST!)
-- Run this to see what will be deleted:

SELECT
  id,
  topic_id,
  question,
  options,
  correct_answer,
  LENGTH(question) as question_length
FROM english_questions
WHERE
  LENGTH(question) < 20  -- Very short questions
  OR options IS NULL
  OR jsonb_array_length(options) < 4  -- Less than 4 options
  OR explanation IS NULL
  OR explanation = ''
  OR question !~ ' '  -- Single word questions (no spaces)
  OR question ILIKE '%[%'  -- Contains placeholder like [sentence]
  OR question ILIKE '%____%'  -- Contains blank like ____
ORDER BY id
LIMIT 100;


-- STEP 2: Delete incomplete questions
-- Run this ONLY after reviewing the above results:

DELETE FROM english_questions
WHERE
  LENGTH(question) < 20  -- Very short questions
  OR options IS NULL
  OR jsonb_array_length(options) < 4  -- Less than 4 options
  OR explanation IS NULL
  OR explanation = ''
  OR question !~ ' '  -- Single word questions (no spaces)
  OR question ILIKE '%[%'  -- Contains placeholder like [sentence]
  OR question ILIKE '%____%';  -- Contains blank like ____


-- STEP 3: Verify deletion
SELECT
  COUNT(*) as total_english_questions,
  COUNT(CASE WHEN LENGTH(question) >= 20 THEN 1 END) as complete_questions,
  COUNT(CASE WHEN LENGTH(question) < 20 THEN 1 END) as remaining_short_questions
FROM english_questions;


-- STEP 4: Check questions by topic
SELECT
  topic_id,
  COUNT(*) as question_count,
  AVG(LENGTH(question)) as avg_question_length
FROM english_questions
GROUP BY topic_id
ORDER BY topic_id;


-- STEP 5: Check for other issues
-- Find questions with missing fields
SELECT
  'Missing options' as issue,
  COUNT(*) as count
FROM english_questions
WHERE options IS NULL OR jsonb_array_length(options) < 4

UNION ALL

SELECT
  'Missing explanation' as issue,
  COUNT(*) as count
FROM english_questions
WHERE explanation IS NULL OR explanation = ''

UNION ALL

SELECT
  'Single word questions' as issue,
  COUNT(*) as count
FROM english_questions
WHERE question !~ ' '

UNION ALL

SELECT
  'Very short (<20 chars)' as issue,
  COUNT(*) as count
FROM english_questions
WHERE LENGTH(question) < 20;
