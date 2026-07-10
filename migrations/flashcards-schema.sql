-- =============================================
-- FLASHCARD SYSTEM - DATABASE SCHEMA
-- =============================================
-- Created: 2026-07-10
-- Purpose: Flashcard decks, cards, and spaced repetition tracking
-- =============================================

-- 1. FLASHCARD DECKS
-- Stores deck metadata and organization
CREATE TABLE IF NOT EXISTS flashcard_decks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  exam_id TEXT,                    -- e.g., 'upsc', 'jee', 'neet'
  subject_id TEXT,                 -- e.g., 'physics', 'polity'
  topic TEXT,                      -- e.g., 'Thermodynamics', 'Constitution'
  is_public BOOLEAN DEFAULT false, -- Allow sharing decks
  is_ai_generated BOOLEAN DEFAULT false,
  card_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. FLASHCARDS
-- Individual cards within decks
CREATE TABLE IF NOT EXISTS flashcards (
  id SERIAL PRIMARY KEY,
  deck_id INTEGER NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,             -- Question/Term
  back TEXT NOT NULL,              -- Answer/Explanation
  hint TEXT,                       -- Optional hint
  example TEXT,                    -- Optional example
  difficulty TEXT DEFAULT 'medium', -- 'easy', 'medium', 'hard'
  card_order INTEGER DEFAULT 0,    -- Order within deck
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. FLASHCARD PROGRESS
-- Tracks user's progress per card (spaced repetition)
CREATE TABLE IF NOT EXISTS flashcard_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  card_id INTEGER NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  deck_id INTEGER NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,

  -- Spaced Repetition (SM-2 Algorithm)
  last_reviewed TIMESTAMP,
  next_review TIMESTAMP,           -- When card is due next
  ease_factor DECIMAL DEFAULT 2.5, -- Difficulty multiplier
  interval_days INTEGER DEFAULT 1, -- Days until next review
  repetitions INTEGER DEFAULT 0,   -- Successful reviews in a row

  -- Statistics
  rating TEXT,                     -- Last rating: 'again', 'hard', 'good', 'easy'
  times_reviewed INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, card_id)
);

-- 4. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_deck_user ON flashcard_decks(user_id);
CREATE INDEX IF NOT EXISTS idx_deck_exam_subject ON flashcard_decks(exam_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_deck_public ON flashcard_decks(is_public) WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_card_deck ON flashcards(deck_id);
CREATE INDEX IF NOT EXISTS idx_card_order ON flashcards(deck_id, card_order);

CREATE INDEX IF NOT EXISTS idx_progress_user_deck ON flashcard_progress(user_id, deck_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_card ON flashcard_progress(user_id, card_id);
CREATE INDEX IF NOT EXISTS idx_progress_next_review ON flashcard_progress(next_review);
CREATE INDEX IF NOT EXISTS idx_progress_due ON flashcard_progress(user_id, next_review);

-- 5. TRIGGERS TO UPDATE CARD COUNT
CREATE OR REPLACE FUNCTION update_deck_card_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE flashcard_decks
    SET card_count = card_count + 1, updated_at = NOW()
    WHERE id = NEW.deck_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE flashcard_decks
    SET card_count = card_count - 1, updated_at = NOW()
    WHERE id = OLD.deck_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_card_count
AFTER INSERT OR DELETE ON flashcards
FOR EACH ROW EXECUTE FUNCTION update_deck_card_count();

-- 6. TRIGGER TO UPDATE updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_deck_updated_at
BEFORE UPDATE ON flashcard_decks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_progress_updated_at
BEFORE UPDATE ON flashcard_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Sample Deck for UPSC Polity
INSERT INTO flashcard_decks (user_id, title, description, exam_id, subject_id, topic, is_ai_generated)
VALUES (1, 'Indian Constitution Basics', 'Fundamental concepts of Indian Constitution', 'upsc', 'polity', 'Constitution', true)
ON CONFLICT DO NOTHING;

-- Sample Cards (if deck was created)
INSERT INTO flashcards (deck_id, front, back, hint, difficulty, card_order)
SELECT
  id,
  'What is Article 32 of the Indian Constitution?',
  'Article 32 deals with the Right to Constitutional Remedies. It allows citizens to move the Supreme Court for enforcement of Fundamental Rights. Dr. B.R. Ambedkar called it the "heart and soul" of the Constitution.',
  'Heart and soul of Constitution',
  'medium',
  1
FROM flashcard_decks WHERE title = 'Indian Constitution Basics'
ON CONFLICT DO NOTHING;

INSERT INTO flashcards (deck_id, front, back, hint, difficulty, card_order)
SELECT
  id,
  'What are the three types of writs under Article 32?',
  'The five types are: 1. Habeas Corpus (produce the body), 2. Mandamus (command to perform duty), 3. Prohibition (stop lower court), 4. Certiorari (quash order), 5. Quo Warranto (challenge appointment)',
  'Five writs, not three',
  'hard',
  2
FROM flashcard_decks WHERE title = 'Indian Constitution Basics'
ON CONFLICT DO NOTHING;

-- =============================================
-- END OF SCHEMA
-- =============================================
