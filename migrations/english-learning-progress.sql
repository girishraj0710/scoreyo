-- ============================================================
-- English Learning Progress Tracking System
-- ============================================================
-- Purpose: Track user progress through English learning paths
-- and automatically advance them through CEFR levels (A1 → A2 → B1 → B2 → C1 → C2)
-- ============================================================

-- User's overall English level and assessment data
CREATE TABLE IF NOT EXISTS user_english_levels (
  user_id TEXT PRIMARY KEY,
  current_level TEXT NOT NULL, -- A1, A2, B1, B2, C1, C2
  assessment_score INTEGER, -- Overall % from assessment
  assessment_completed_at TIMESTAMP,
  level_started_at TIMESTAMP DEFAULT NOW(),
  total_study_time_seconds INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Track progress on individual topics
CREATE TABLE IF NOT EXISTS user_topic_progress (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject_id TEXT NOT NULL, -- 'english'
  path_id TEXT NOT NULL, -- 'foundation', 'advanced', etc.
  topic_id TEXT NOT NULL,
  status TEXT NOT NULL, -- 'not_started', 'in_progress', 'completed'
  completion_percentage INTEGER DEFAULT 0, -- 0-100
  time_spent_seconds INTEGER DEFAULT 0,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  last_accessed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, subject_id, path_id, topic_id)
);

-- Track level progression milestones
CREATE TABLE IF NOT EXISTS user_level_history (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  previous_level TEXT,
  new_level TEXT NOT NULL,
  promotion_reason TEXT, -- 'assessment', 'completion', 'manual'
  topics_completed INTEGER,
  average_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_user ON user_topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_lookup ON user_topic_progress(user_id, subject_id, path_id);
CREATE INDEX IF NOT EXISTS idx_user_level_history_user ON user_level_history(user_id);

-- ============================================================
-- Level Progression Rules (Embedded in application logic)
-- ============================================================
-- A1 → A2: Complete 80% of Foundation path (A1-A2 topics)
-- A2 → B1: Complete 70% of Foundation path + 30% of Advanced (B1 topics)
-- B1 → B2: Complete 80% of Advanced path (B1-B2 topics)
-- B2 → C1: Complete 90% of Advanced path + high quiz scores (>80%)
-- C1 → C2: Complete IELTS/TOEFL prep + speaking/writing mastery
-- ============================================================
