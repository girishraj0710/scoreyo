-- Check what paths exist for English
SELECT * FROM english_paths ORDER BY id;

-- Check what topics exist and their path associations
SELECT * FROM english_topics ORDER BY id;

-- Check the schema of english_questions
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'english_questions'
ORDER BY ordinal_position;
