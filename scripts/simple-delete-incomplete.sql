-- Simplified query that doesn't parse JSON
-- Run this in Supabase SQL Editor

-- STEP 1: Find incomplete questions (SIMPLE VERSION)
-- This checks only basic criteria without parsing options JSON
SELECT
  id,
  topic_id,
  question,
  LENGTH(question) as question_length,
  options,
  explanation
FROM english_questions
WHERE
  -- Very short questions (likely incomplete)
  LENGTH(question) < 20

  -- OR single word questions (no spaces)
  OR question !~ ' '

  -- OR missing explanation
  OR explanation IS NULL
  OR explanation = ''

  -- OR obviously incomplete (contains placeholders)
  OR question ILIKE '%[%'
  OR question ILIKE '%____%'
ORDER BY LENGTH(question) ASC
LIMIT 100;


-- STEP 2: Delete incomplete questions (SIMPLE VERSION)
-- Run this ONLY after reviewing Step 1 results

DELETE FROM english_questions
WHERE
  LENGTH(question) < 20
  OR question !~ ' '
  OR explanation IS NULL
  OR explanation = ''
  OR question ILIKE '%[%'
  OR question ILIKE '%____%';


-- STEP 3: Find questions with very short options (likely incomplete)
-- This checks string length instead of parsing JSON
SELECT
  id,
  topic_id,
  question,
  LENGTH(options) as options_length,
  options
FROM english_questions
WHERE
  options IS NULL
  OR LENGTH(options) < 20  -- Options string too short to contain 4 options
ORDER BY LENGTH(options) ASC
LIMIT 50;


-- STEP 4: Delete questions with obviously bad options
DELETE FROM english_questions
WHERE
  options IS NULL
  OR LENGTH(options) < 20;


-- STEP 5: Verify what's left
SELECT
  COUNT(*) as total_questions,
  MIN(LENGTH(question)) as shortest_question,
  MAX(LENGTH(question)) as longest_question,
  AVG(LENGTH(question)) as avg_question_length
FROM english_questions;


-- STEP 6: Check by topic
SELECT
  topic_id,
  COUNT(*) as question_count
FROM english_questions
GROUP BY topic_id
ORDER BY question_count ASC;
