-- Check the actual format of options column
-- Run this in Supabase SQL Editor to see what format options uses

SELECT
  id,
  topic_id,
  question,
  options,
  LENGTH(options) as options_length,
  -- Check if it's an array format
  options LIKE '[%' as starts_with_bracket,
  options LIKE '{%' as starts_with_brace
FROM english_questions
WHERE LENGTH(question) < 30  -- Short questions to see examples
LIMIT 10;
