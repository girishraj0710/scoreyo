-- Migration: Ensure english_progress table exists in Supabase PostgreSQL
-- Date: 2026-07-19
-- Purpose: Create english_progress table for tracking user's learning progress

CREATE TABLE IF NOT EXISTS english_progress (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  path_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  level TEXT NOT NULL,
  completed_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_time_seconds INTEGER DEFAULT 0,
  last_practiced TIMESTAMP,
  mastery_score REAL DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, path_id, topic_id)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_english_progress_user ON english_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_english_progress_path ON english_progress(path_id);
CREATE INDEX IF NOT EXISTS idx_english_progress_topic ON english_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_english_progress_user_path ON english_progress(user_id, path_id);

-- Comment on table
COMMENT ON TABLE english_progress IS 'Tracks user progress across English learning paths (foundation, advanced, ielts-toefl, vocabulary)';
