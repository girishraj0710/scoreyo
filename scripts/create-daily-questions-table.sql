-- Daily Question Blocks Table
-- Stores 10 daily questions for each user, resets every day

CREATE TABLE IF NOT EXISTS daily_question_blocks (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  questions JSONB NOT NULL,  -- Array of 10 question objects
  user_answers JSONB,  -- Array of 10 user answer indices (0-3)
  completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,  -- Out of 10
  attempted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)  -- One block per user per day
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_daily_questions_user_date ON daily_question_blocks(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_questions_date ON daily_question_blocks(date);

-- Comments
COMMENT ON TABLE daily_question_blocks IS 'Stores daily 10-question blocks for each user. Resets every day at midnight IST.';
COMMENT ON COLUMN daily_question_blocks.questions IS 'JSONB array of 10 question objects with id, question, options, correct_answer, explanation, etc.';
COMMENT ON COLUMN daily_question_blocks.user_answers IS 'JSONB array of 10 user answer indices (0-3) after submission';
COMMENT ON COLUMN daily_question_blocks.completed IS 'True if user has submitted all 10 answers';
COMMENT ON COLUMN daily_question_blocks.score IS 'Number of correct answers out of 10';
