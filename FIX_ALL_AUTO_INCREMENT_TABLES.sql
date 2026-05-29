-- Fix all tables with auto-increment ID issues
-- Run this ENTIRE script in Supabase SQL Editor

-- ========================================
-- FIX: topic_mastery table
-- ========================================

-- Drop primary key
ALTER TABLE topic_mastery DROP CONSTRAINT IF EXISTS topic_mastery_pkey;

-- Create sequence
CREATE SEQUENCE IF NOT EXISTS topic_mastery_id_seq;

-- Set column to use sequence
ALTER TABLE topic_mastery ALTER COLUMN id SET DEFAULT nextval('topic_mastery_id_seq');

-- Set sequence start value
SELECT setval('topic_mastery_id_seq', COALESCE((SELECT MAX(id) FROM topic_mastery), 0) + 1, false);

-- Add back primary key
ALTER TABLE topic_mastery ADD PRIMARY KEY (id);

-- ========================================
-- FIX: badge_stats table (if has id column)
-- ========================================

-- Check if badge_stats has id column (might use user_id as PK)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'badge_stats' AND column_name = 'id'
    ) THEN
        -- Drop primary key
        ALTER TABLE badge_stats DROP CONSTRAINT IF EXISTS badge_stats_pkey;

        -- Create sequence
        CREATE SEQUENCE IF NOT EXISTS badge_stats_id_seq;

        -- Set column to use sequence
        ALTER TABLE badge_stats ALTER COLUMN id SET DEFAULT nextval('badge_stats_id_seq');

        -- Set sequence start value
        PERFORM setval('badge_stats_id_seq', COALESCE((SELECT MAX(id) FROM badge_stats), 0) + 1, false);

        -- Add back primary key
        ALTER TABLE badge_stats ADD PRIMARY KEY (id);
    END IF;
END $$;

-- ========================================
-- FIX: weakness_profiles table
-- ========================================

-- Drop primary key
ALTER TABLE weakness_profiles DROP CONSTRAINT IF EXISTS weakness_profiles_pkey;

-- Create sequence
CREATE SEQUENCE IF NOT EXISTS weakness_profiles_id_seq;

-- Set column to use sequence
ALTER TABLE weakness_profiles ALTER COLUMN id SET DEFAULT nextval('weakness_profiles_id_seq');

-- Set sequence start value
SELECT setval('weakness_profiles_id_seq', COALESCE((SELECT MAX(id) FROM weakness_profiles), 0) + 1, false);

-- Add back primary key
ALTER TABLE weakness_profiles ADD PRIMARY KEY (id);

-- ========================================
-- VERIFICATION: Check all fixed tables
-- ========================================

SELECT
    'question_attempts' as table_name,
    column_name,
    column_default
FROM information_schema.columns
WHERE table_name = 'question_attempts' AND column_name = 'id'

UNION ALL

SELECT
    'topic_mastery' as table_name,
    column_name,
    column_default
FROM information_schema.columns
WHERE table_name = 'topic_mastery' AND column_name = 'id'

UNION ALL

SELECT
    'weakness_profiles' as table_name,
    column_name,
    column_default
FROM information_schema.columns
WHERE table_name = 'weakness_profiles' AND column_name = 'id';

-- You should see column_default like: nextval('table_name_id_seq'::regclass)
