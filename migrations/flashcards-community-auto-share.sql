-- =============================================
-- FLASHCARD AUTO-SHARE COMMUNITY - DATABASE MIGRATION
-- =============================================
-- Date: 2026-07-10
-- Purpose: Enable automatic community sharing of flashcards
-- =============================================

-- 1. Add engagement tracking columns to flashcard_decks
ALTER TABLE flashcard_decks
ADD COLUMN IF NOT EXISTS studies_today INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unique_students INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_studies INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_studied_at TIMESTAMP;

-- 2. Add preferred exam to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS preferred_exam TEXT,
ADD COLUMN IF NOT EXISTS username TEXT;

-- 3. Update existing decks to be public (auto-share)
UPDATE flashcard_decks SET is_public = true WHERE is_public = false;

-- 4. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_decks_exam_public
ON flashcard_decks(exam_id, is_public)
WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_decks_studies
ON flashcard_decks(studies_today DESC);

CREATE INDEX IF NOT EXISTS idx_users_exam
ON users(preferred_exam);

-- 5. Create a function to reset studies_today (run daily via cron)
CREATE OR REPLACE FUNCTION reset_daily_study_counts()
RETURNS void AS $$
BEGIN
  UPDATE flashcard_decks
  SET studies_today = 0
  WHERE last_studied_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check if columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'flashcard_decks'
AND column_name IN ('studies_today', 'unique_students', 'total_studies', 'last_studied_at');

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('preferred_exam', 'username');

-- Check if all decks are now public
SELECT
  COUNT(*) as total_decks,
  COUNT(*) FILTER (WHERE is_public = true) as public_decks
FROM flashcard_decks;

-- Should show: total_decks = public_decks

-- =============================================
-- END OF MIGRATION
-- =============================================
