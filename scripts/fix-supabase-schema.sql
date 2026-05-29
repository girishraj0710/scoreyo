-- Fix Supabase schema issues before importing

-- 1. Clear existing data (in case there are conflicts)
TRUNCATE TABLE
  question_attempts,
  quiz_sessions,
  topic_mastery,
  subscriptions,
  payment_history,
  mock_tests,
  weakness_profiles,
  english_progress,
  english_daily_practice,
  badge_stats,
  fact_exam_questions,
  bridge_exam_subject_topic,
  dim_topics,
  users
CASCADE;

-- 2. Add missing columns to fact_exam_questions
ALTER TABLE fact_exam_questions
ADD COLUMN IF NOT EXISTS quality_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS logic TEXT,
ADD COLUMN IF NOT EXISTS calculation TEXT,
ADD COLUMN IF NOT EXISTS formula TEXT,
ADD COLUMN IF NOT EXISTS "commonMistakes" TEXT,
ADD COLUMN IF NOT EXISTS "trapAlerts" TEXT;

-- 3. Make parent_topic_id nullable (for self-referencing foreign key)
ALTER TABLE dim_topics
ALTER COLUMN parent_topic_id DROP NOT NULL;

-- 4. Verify schema
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('fact_exam_questions', 'dim_topics', 'users')
ORDER BY table_name, ordinal_position;
