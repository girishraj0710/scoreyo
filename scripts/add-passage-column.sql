-- Migration: Add passage column to english_questions and fact_exam_questions tables
-- Purpose: Support reading comprehension questions with passage text
-- Date: 2026-06-09

-- Add passage column to english_questions if it doesn't exist
ALTER TABLE IF EXISTS english_questions
ADD COLUMN IF NOT EXISTS passage TEXT;

-- Add passage column to fact_exam_questions if it doesn't exist
ALTER TABLE IF EXISTS fact_exam_questions
ADD COLUMN IF NOT EXISTS passage TEXT;

-- Add indexes for faster lookups on questions with passages
CREATE INDEX IF NOT EXISTS idx_english_questions_with_passage
ON english_questions(path_id, topic_id, level)
WHERE passage IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_fact_exam_questions_with_passage
ON fact_exam_questions(topic_id, difficulty)
WHERE passage IS NOT NULL;

-- Verify the columns were added
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE (table_name = 'english_questions' OR table_name = 'fact_exam_questions')
  AND column_name = 'passage'
ORDER BY table_name;
