-- Migration: Add Level-Based Gamification System
-- Date: 2026-05-10

-- User Quiz Level Progress
CREATE TABLE IF NOT EXISTS user_quiz_levels (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  level_number INTEGER NOT NULL,
  level_type TEXT NOT NULL DEFAULT 'normal',
  is_unlocked INTEGER DEFAULT 0,
  is_completed INTEGER DEFAULT 0,
  stars_earned INTEGER DEFAULT 0,
  best_accuracy INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  completed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, exam_id, subject_id, level_number)
);

-- User English Level Progress
CREATE TABLE IF NOT EXISTS user_english_levels (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  path_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  level_number INTEGER NOT NULL,
  is_unlocked INTEGER DEFAULT 0,
  practice_completed INTEGER DEFAULT 0,
  test_completed INTEGER DEFAULT 0,
  stars_earned INTEGER DEFAULT 0,
  best_accuracy INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  completed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, path_id, topic_id)
);

-- Level Definitions (pre-configured level structure)
CREATE TABLE IF NOT EXISTS level_definitions (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  level_number INTEGER NOT NULL,
  level_name TEXT NOT NULL,
  level_type TEXT NOT NULL DEFAULT 'normal',
  difficulty TEXT NOT NULL,
  topic TEXT,
  question_count INTEGER NOT NULL,
  unlock_requirement TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(exam_id, subject_id, level_number)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_quiz_levels_user ON user_quiz_levels(user_id, exam_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_user_english_levels_user ON user_english_levels(user_id, path_id);
CREATE INDEX IF NOT EXISTS idx_level_definitions_exam ON level_definitions(exam_id, subject_id);
