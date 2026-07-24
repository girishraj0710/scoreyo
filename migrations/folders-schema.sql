-- =============================================
-- FOLDERS - DATABASE SCHEMA
-- =============================================
-- Created: 2026-07-24
-- Purpose: Let users organize their flashcard decks into named folders
-- =============================================

-- 1. FOLDERS
-- A named folder belonging to a user
CREATE TABLE IF NOT EXISTS folders (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_folders_user ON folders(user_id);

-- 2. FOLDER_DECKS
-- Many-to-many: which flashcard decks are in which folder
CREATE TABLE IF NOT EXISTS folder_decks (
  folder_id INTEGER NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
  deck_id INTEGER NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (folder_id, deck_id)
);

CREATE INDEX IF NOT EXISTS idx_folder_decks_folder ON folder_decks(folder_id);
CREATE INDEX IF NOT EXISTS idx_folder_decks_deck ON folder_decks(deck_id);
