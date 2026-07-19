-- Blocks Game Schema (Tetris-style learning game)
-- Created: 2026-07-14

-- Blocks game sessions table
CREATE TABLE IF NOT EXISTS blocks_game_sessions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_name TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  lines_cleared INTEGER DEFAULT 0,
  highest_combo INTEGER DEFAULT 0,
  time_seconds INTEGER NOT NULL,
  level_reached INTEGER DEFAULT 1,
  content_source TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blocks_user ON blocks_game_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blocks_exam ON blocks_game_sessions(exam_id);
CREATE INDEX IF NOT EXISTS idx_blocks_score ON blocks_game_sessions(score DESC);

-- Comments
COMMENT ON TABLE blocks_game_sessions IS 'Tetris-style blocks game sessions with scoring and stats';
COMMENT ON COLUMN blocks_game_sessions.score IS 'Total score (base points + speed bonus + line clear bonus + combos)';
COMMENT ON COLUMN blocks_game_sessions.lines_cleared IS 'Number of horizontal lines completed and cleared';
COMMENT ON COLUMN blocks_game_sessions.highest_combo IS 'Longest streak of consecutive correct answers';
COMMENT ON COLUMN blocks_game_sessions.level_reached IS 'Difficulty level achieved (affects fall speed)';
