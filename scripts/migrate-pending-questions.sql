-- Migration: Add pending_questions table and contributor columns
-- Part of: Custom Quiz → Question Bank Integration
-- Date: 2026-06-02

-- Step 1: Create pending_questions table
CREATE TABLE IF NOT EXISTS pending_questions (
  id TEXT PRIMARY KEY,

  -- Source information
  user_id TEXT NOT NULL,
  source_type TEXT NOT NULL, -- 'custom-upload', 'custom-paste'
  source_file TEXT, -- filename if uploaded
  content_preview TEXT, -- first 500 chars of source

  -- AI Classification
  detected_exam_id TEXT, -- 'jee-main', 'neet', etc.
  detected_subject_id TEXT, -- 'physics', 'chemistry', etc.
  detected_topics TEXT, -- JSON array: ["Thermodynamics", "Heat Transfer"]
  classification_confidence REAL, -- 0.0 to 1.0

  -- Question data
  question TEXT NOT NULL,
  options TEXT NOT NULL, -- JSON array
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  trap_alerts TEXT, -- JSON array
  difficulty TEXT,

  -- Review workflow
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'edited'
  reviewed_by TEXT, -- admin user_id
  reviewed_at TIMESTAMP,
  review_notes TEXT,

  -- Quality metrics
  quality_score REAL, -- 0-100 based on validation
  duplicate_check_passed BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for pending_questions
CREATE INDEX IF NOT EXISTS idx_pending_status ON pending_questions(status);
CREATE INDEX IF NOT EXISTS idx_pending_exam ON pending_questions(detected_exam_id);
CREATE INDEX IF NOT EXISTS idx_pending_user ON pending_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_created ON pending_questions(created_at DESC);

-- Step 2: Add contributor columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS questions_contributed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS contribution_points INTEGER DEFAULT 0;

-- Create index for contributor leaderboard
CREATE INDEX IF NOT EXISTS idx_users_contribution ON users(contribution_points DESC);

-- Step 3: Add comment to track migration
COMMENT ON TABLE pending_questions IS 'Stores AI-generated questions from custom quiz uploads pending admin review';
COMMENT ON COLUMN users.questions_contributed IS 'Total number of questions contributed and approved';
COMMENT ON COLUMN users.contribution_points IS 'Gamification points earned from contributions (10 points per approved question)';
