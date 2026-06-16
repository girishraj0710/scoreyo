-- Find and Delete Incomplete English Questions
-- Run this in Supabase SQL Editor or via psql

-- STEP 1: Find incomplete questions (review first)
-- Uncomment to see what will be deleted:

-- SELECT
--   id,
--   topic,
--   question_text,
--   options,
--   correct_answer,
--   LENGTH(question_text) as question_length
-- FROM questions
-- WHERE
--   subject_id = 'english'
--   AND (
--     LENGTH(question_text) < 20  -- Very short questions
--     OR options IS NULL
--     OR jsonb_array_length(options) < 4  -- Less than 4 options
--     OR explanation IS NULL
--     OR explanation = ''
--     OR question_text !~ ' '  -- Single word questions (no spaces)
--     OR question_text ILIKE '%[%'  -- Contains placeholder like [sentence]
--     OR question_text ILIKE '%____%'  -- Contains blank like ____
--   )
-- ORDER BY id;


-- STEP 2: Delete incomplete questions
-- Run this after reviewing the above results:

DELETE FROM questions
WHERE
  subject_id = 'english'
  AND (
    LENGTH(question_text) < 20  -- Very short questions
    OR options IS NULL
    OR jsonb_array_length(options) < 4  -- Less than 4 options
    OR explanation IS NULL
    OR explanation = ''
    OR question_text !~ ' '  -- Single word questions (no spaces)
    OR question_text ILIKE '%[%'  -- Contains placeholder like [sentence]
    OR question_text ILIKE '%____%'  -- Contains blank like ____
  );

-- STEP 3: Verify deletion
SELECT
  COUNT(*) as total_english_questions,
  COUNT(CASE WHEN LENGTH(question_text) >= 20 THEN 1 END) as complete_questions,
  COUNT(CASE WHEN LENGTH(question_text) < 20 THEN 1 END) as remaining_short_questions
FROM questions
WHERE subject_id = 'english';

-- STEP 4: Check questions by topic
SELECT
  topic,
  COUNT(*) as question_count
FROM questions
WHERE subject_id = 'english'
GROUP BY topic
ORDER BY topic;
