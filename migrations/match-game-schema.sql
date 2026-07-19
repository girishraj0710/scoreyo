-- Match Game Schema
-- Speed pairing game where users match questions with answers
-- Created: 2026-07-14

-- Match game sessions table
CREATE TABLE IF NOT EXISTS match_game_sessions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_name TEXT,
  time_seconds INTEGER NOT NULL,
  pairs_count INTEGER DEFAULT 6,
  mistakes INTEGER DEFAULT 0,
  content_source TEXT, -- 'studied' | 'new' | 'mixed'
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for user stats queries
CREATE INDEX IF NOT EXISTS idx_match_sessions_user ON match_game_sessions(user_id, created_at DESC);

-- Index for leaderboard/analytics
CREATE INDEX IF NOT EXISTS idx_match_sessions_exam ON match_game_sessions(exam_id, time_seconds);

-- Comments
COMMENT ON TABLE match_game_sessions IS 'Stores match game play sessions with timing and accuracy';
COMMENT ON COLUMN match_game_sessions.time_seconds IS 'Time taken to complete all matches in seconds';
COMMENT ON COLUMN match_game_sessions.mistakes IS 'Number of incorrect match attempts';
COMMENT ON COLUMN match_game_sessions.content_source IS 'Where content came from: studied content, new content, or mixed';
