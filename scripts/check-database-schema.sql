-- ============================================================================
-- Check PrepGenie Database Schema
-- Run this first to see what tables and columns you actually have
-- ============================================================================

-- 1. List all tables in your database
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 2. Show columns for each main table
-- (If a table doesn't exist, that section will just show empty)

-- fact_exam_questions table
SELECT
    'fact_exam_questions' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'fact_exam_questions'
ORDER BY ordinal_position;

-- topic_mastery table
SELECT
    'topic_mastery' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'topic_mastery'
ORDER BY ordinal_position;

-- quiz_sessions table
SELECT
    'quiz_sessions' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'quiz_sessions'
ORDER BY ordinal_position;

-- question_attempts table
SELECT
    'question_attempts' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'question_attempts'
ORDER BY ordinal_position;

-- users table
SELECT
    'users' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- 3. Check what indexes already exist
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================================================
-- Copy the results and share them so I can create correct indexes!
-- ============================================================================
