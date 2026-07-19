-- Migration: Unified Activity Tracking - Add Indexes
-- Date: 2026-07-17
-- Purpose: Optimize unified activity queries for English + Exam systems

BEGIN;

-- English activity indexes
CREATE INDEX IF NOT EXISTS idx_english_daily_practice_date
ON english_daily_practice(user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_english_progress_practiced
ON english_progress(user_id, last_practiced DESC)
WHERE last_practiced IS NOT NULL;

-- Study sessions by type (if study_type column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'study_reading_sessions'
    AND column_name = 'study_type'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_study_sessions_unified
    ON study_reading_sessions(user_id, start_time DESC, study_type)
    WHERE start_time IS NOT NULL;
  ELSE
    -- If study_type doesn't exist, create basic index
    CREATE INDEX IF NOT EXISTS idx_study_sessions_unified
    ON study_reading_sessions(user_id, start_time DESC)
    WHERE start_time IS NOT NULL;
  END IF;
END $$;

-- For unified activity feed
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_activity
ON quiz_sessions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_flashcard_sessions_activity
ON flashcard_study_sessions(user_id, created_at DESC);

-- Exam level activity
CREATE INDEX IF NOT EXISTS idx_user_quiz_levels_activity
ON user_quiz_levels(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_exam_levels_activity
ON user_exam_levels(user_id, created_at DESC);

COMMIT;

-- Verification queries to run after migration:

/*
-- Check index creation
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE indexname LIKE 'idx_%_activity'
   OR indexname LIKE 'idx_english_%'
   OR indexname LIKE 'idx_study_sessions%'
ORDER BY tablename, indexname;

-- Test unified streak query performance
EXPLAIN ANALYZE
SELECT DISTINCT day FROM (
  SELECT DATE(created_at) as day FROM quiz_sessions WHERE user_id = 'test-user'
  UNION
  SELECT date as day FROM english_daily_practice WHERE user_id = 'test-user'
  UNION
  SELECT DATE(last_practiced) as day FROM english_progress
  WHERE user_id = 'test-user' AND last_practiced IS NOT NULL
  UNION
  SELECT DATE(start_time) as day FROM study_reading_sessions
  WHERE user_id = 'test-user' AND start_time IS NOT NULL
) AS all_activity
ORDER BY day DESC;
*/
