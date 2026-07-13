-- Add time tracking columns to various session tables
-- Phase 1: Actual time tracking with start/end timestamps

-- ============================================================================
-- 1. Quiz Sessions - Add start_time, end_time, duration_seconds
-- ============================================================================
ALTER TABLE quiz_sessions
ADD COLUMN IF NOT EXISTS start_time TIMESTAMP,
ADD COLUMN IF NOT EXISTS end_time TIMESTAMP,
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;

-- Create index for time-based queries
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_time ON quiz_sessions(user_id, start_time, end_time);

-- ============================================================================
-- 2. Flashcard Study Sessions - Track actual study time
-- ============================================================================
CREATE TABLE IF NOT EXISTS flashcard_study_sessions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deck_id INTEGER NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,

  -- Time tracking
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration_seconds INTEGER,

  -- Study metrics
  cards_studied INTEGER DEFAULT 0,
  cards_correct INTEGER DEFAULT 0,
  cards_incorrect INTEGER DEFAULT 0,
  cards_skipped INTEGER DEFAULT 0,

  -- Session metadata
  completed BOOLEAN DEFAULT FALSE,
  session_type TEXT DEFAULT 'review', -- 'review', 'new_cards', 'cram'

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flashcard_study_user_time ON flashcard_study_sessions(user_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_flashcard_study_deck ON flashcard_study_sessions(deck_id, start_time);

-- ============================================================================
-- 3. Mock Test Sessions - Track test duration (SKIPPED - table doesn't exist yet)
-- ============================================================================
-- Will be added when mock_test_sessions table is created

-- ============================================================================
-- 4. Study Material Reading Sessions - New table for tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS study_reading_sessions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- What they studied
  subject_id TEXT NOT NULL,
  path_id TEXT,
  topic_id TEXT,
  content_type TEXT DEFAULT 'topic', -- 'topic', 'guide', 'notes'

  -- Time tracking
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration_seconds INTEGER,

  -- Reading metrics
  sections_read INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0, -- 0-100

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_reading_user_time ON study_reading_sessions(user_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_study_reading_topic ON study_reading_sessions(subject_id, topic_id, start_time);

-- ============================================================================
-- 5. Comments for future reference
-- ============================================================================
COMMENT ON COLUMN quiz_sessions.start_time IS 'Quiz start timestamp (user clicked Start Quiz)';
COMMENT ON COLUMN quiz_sessions.end_time IS 'Quiz end timestamp (user submitted quiz)';
COMMENT ON COLUMN quiz_sessions.duration_seconds IS 'Actual time spent (end_time - start_time in seconds)';

COMMENT ON TABLE flashcard_study_sessions IS 'Tracks flashcard study sessions with actual time spent';
COMMENT ON TABLE study_reading_sessions IS 'Tracks time spent reading study materials (topics, guides, notes)';
