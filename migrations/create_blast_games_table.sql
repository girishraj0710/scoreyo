-- Create blast_games table for storing Blast game results
CREATE TABLE IF NOT EXISTS blast_games (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  exam_id TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  questions_answered INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  time_seconds INTEGER NOT NULL DEFAULT 0,
  accuracy INTEGER NOT NULL DEFAULT 0,
  highest_streak INTEGER NOT NULL DEFAULT 0,
  is_personal_best BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_blast_games_user_id ON blast_games(user_id);
CREATE INDEX IF NOT EXISTS idx_blast_games_exam_id ON blast_games(exam_id);
CREATE INDEX IF NOT EXISTS idx_blast_games_user_exam ON blast_games(user_id, exam_id);
CREATE INDEX IF NOT EXISTS idx_blast_games_score ON blast_games(score DESC);
CREATE INDEX IF NOT EXISTS idx_blast_games_created_at ON blast_games(created_at DESC);

-- Comments
COMMENT ON TABLE blast_games IS 'Stores Blast game results with intelligent content sourcing from study content, flashcards, and quiz history';
COMMENT ON COLUMN blast_games.score IS 'Total score (5 points per correct answer)';
COMMENT ON COLUMN blast_games.accuracy IS 'Percentage accuracy (0-100)';
COMMENT ON COLUMN blast_games.highest_streak IS 'Highest consecutive correct answers';
COMMENT ON COLUMN blast_games.is_personal_best IS 'Whether this was a personal best score for the user';
