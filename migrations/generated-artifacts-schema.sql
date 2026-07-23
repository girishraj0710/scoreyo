-- =============================================
-- GENERATED STUDY ARTIFACTS — SCHEMA (Convert feature)
-- =============================================
-- Purpose: persist on-demand, user-owned study material generated from any
-- source (deck / study guide / study material / uploaded doc / pasted text)
-- so it can be re-opened and shared. Each study MODE gets its own table.
--
-- Decks already have their own tables (flashcard_decks / flashcards) — this
-- migration adds the three modes that had NO owned storage: quiz, game, mock.
--
-- Identity: user_id is TEXT and references users(id) (the canonical app id set
-- by the scoreyo-user-id cookie), matching study_groups / group_members.
-- =============================================

-- 1. GENERATED QUIZZES (mode = 'quiz' or 'mock')
-- questions is a JSONB array of { question, options[4], correctAnswer, explanation }.
CREATE TABLE IF NOT EXISTS generated_quizzes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'quiz',       -- 'quiz' | 'mock'
  questions JSONB NOT NULL,
  question_count INTEGER NOT NULL DEFAULT 0,
  difficulty TEXT,                          -- 'easy' | 'medium' | 'hard' | null
  source_type TEXT NOT NULL,                -- 'deck' | 'guide' | 'material' | 'upload' | 'text'
  source_ref TEXT,                          -- id/slug of the source, when applicable
  share_slug TEXT UNIQUE,                   -- public shareable link token
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. GENERATED GAMES (mode = 'game')
-- pairs is a JSONB array of { term, definition }; game_type picks the UI
-- (match / blocks / blast) — all consume the same term/definition pairs.
CREATE TABLE IF NOT EXISTS generated_games (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  game_type TEXT NOT NULL DEFAULT 'match',  -- 'match' | 'blocks' | 'blast'
  pairs JSONB NOT NULL,
  pair_count INTEGER NOT NULL DEFAULT 0,
  source_type TEXT NOT NULL,
  source_ref TEXT,
  share_slug TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. GENERATED MOCK TESTS (mode = 'mock')
-- Kept separate from quizzes: mocks carry a duration and are exam-style.
-- questions is a JSONB array of the same MCQ shape as quizzes.
CREATE TABLE IF NOT EXISTS generated_mock_tests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  questions JSONB NOT NULL,
  question_count INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  difficulty TEXT,
  source_type TEXT NOT NULL,
  source_ref TEXT,
  share_slug TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_gen_quiz_user ON generated_quizzes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gen_quiz_slug ON generated_quizzes(share_slug) WHERE share_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_gen_game_user ON generated_games(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gen_game_slug ON generated_games(share_slug) WHERE share_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_gen_mock_user ON generated_mock_tests(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gen_mock_slug ON generated_mock_tests(share_slug) WHERE share_slug IS NOT NULL;

-- =============================================
-- END OF SCHEMA
-- =============================================
