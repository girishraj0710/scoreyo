-- Flashcard Enhancements Migration
-- Features: Daily Goals, Ratings, Quiz Integration, Badges, Share Links
-- Date: July 11, 2026

-- =============================================
-- 1. DAILY GOALS
-- =============================================

CREATE TABLE IF NOT EXISTS flashcard_daily_goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_cards INTEGER DEFAULT 20,
  cards_studied INTEGER DEFAULT 0,
  goal_reached BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_goals_user_date ON flashcard_daily_goals(user_id, date);

-- =============================================
-- 2. DECK RATINGS & REVIEWS
-- =============================================

CREATE TABLE IF NOT EXISTS flashcard_deck_ratings (
  id SERIAL PRIMARY KEY,
  deck_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(deck_id, user_id),
  FOREIGN KEY (deck_id) REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ratings_deck ON flashcard_deck_ratings(deck_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON flashcard_deck_ratings(user_id);

-- Add rating columns to flashcard_decks
ALTER TABLE flashcard_decks
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- =============================================
-- 3. QUIZ INTEGRATION (Mistake-Based Decks)
-- =============================================

ALTER TABLE flashcard_decks
ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS source_quiz_session_id TEXT,
ADD COLUMN IF NOT EXISTS created_from_mistakes BOOLEAN DEFAULT false;

-- Update existing decks
UPDATE flashcard_decks
SET source_type = CASE
  WHEN is_ai_generated = true THEN 'ai_generated'
  ELSE 'manual'
END
WHERE source_type = 'manual';

CREATE INDEX IF NOT EXISTS idx_decks_source ON flashcard_decks(source_type, user_id);
CREATE INDEX IF NOT EXISTS idx_decks_quiz_session ON flashcard_decks(source_quiz_session_id);

-- =============================================
-- 4. SHARE LINKS
-- =============================================

ALTER TABLE flashcard_decks
ADD COLUMN IF NOT EXISTS share_slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_decks_share_slug ON flashcard_decks(share_slug);

-- =============================================
-- 5. FLASHCARD BADGES
-- =============================================

ALTER TABLE badge_stats
ADD COLUMN IF NOT EXISTS decks_created INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS cards_studied INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS correct_streak_current INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS correct_streak_best INTEGER DEFAULT 0;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check flashcard_daily_goals table
SELECT COUNT(*) as daily_goals_count FROM flashcard_daily_goals;

-- Check flashcard_deck_ratings table
SELECT COUNT(*) as ratings_count FROM flashcard_deck_ratings;

-- Check new columns on flashcard_decks
SELECT COUNT(*) FILTER (WHERE average_rating IS NOT NULL) as decks_with_rating_column,
       COUNT(*) FILTER (WHERE share_slug IS NOT NULL) as decks_with_share_slug,
       COUNT(*) FILTER (WHERE source_type IS NOT NULL) as decks_with_source_type
FROM flashcard_decks;

-- Check new columns on badge_stats
SELECT COUNT(*) FILTER (WHERE decks_created IS NOT NULL) as users_with_deck_stats
FROM badge_stats;

-- Success message
SELECT
  'Migration complete! ✅' as status,
  (SELECT COUNT(*) FROM flashcard_decks) as total_decks,
  (SELECT COUNT(*) FROM flashcard_daily_goals) as daily_goals,
  (SELECT COUNT(*) FROM flashcard_deck_ratings) as ratings;
