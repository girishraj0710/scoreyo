-- Previous Year Questions (PYQ) Bank Schema
-- For Match Game and Level Mode
-- Created: 2026-07-14

-- PYQ Bank table for storing previous year questions
CREATE TABLE IF NOT EXISTS pyq_bank (
  id SERIAL PRIMARY KEY,
  exam_id TEXT NOT NULL,
  exam_year INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL, -- Direct answer text (not MCQ option)
  question_type TEXT DEFAULT 'direct_answer' CHECK(question_type IN ('direct_answer', 'mcq', 'numerical', 'assertion_reason')),
  topic TEXT,
  subject TEXT,
  difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
  marks INTEGER DEFAULT 1,
  source TEXT, -- e.g., "JEE Main 2024 Paper 1"
  explanation TEXT,
  tags TEXT[], -- Array of tags for filtering
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_pyq_exam ON pyq_bank(exam_id, exam_year DESC);
CREATE INDEX IF NOT EXISTS idx_pyq_topic ON pyq_bank(topic);
CREATE INDEX IF NOT EXISTS idx_pyq_subject ON pyq_bank(subject);
CREATE INDEX IF NOT EXISTS idx_pyq_type ON pyq_bank(question_type);
CREATE INDEX IF NOT EXISTS idx_pyq_difficulty ON pyq_bank(difficulty);

-- Full-text search index for questions
CREATE INDEX IF NOT EXISTS idx_pyq_question_search ON pyq_bank USING GIN(to_tsvector('english', question));

-- Comments
COMMENT ON TABLE pyq_bank IS 'Previous Year Questions bank for Match Game, Level Mode, and practice';
COMMENT ON COLUMN pyq_bank.question_type IS 'Type of question - direct_answer preferred for Match game';
COMMENT ON COLUMN pyq_bank.answer IS 'Direct answer text, not MCQ option letter (e.g., "Mitochondria" not "B")';
COMMENT ON COLUMN pyq_bank.source IS 'Original source of question (e.g., "JEE Main 2024 Shift 1")';
COMMENT ON COLUMN pyq_bank.tags IS 'Array of searchable tags (e.g., ["thermodynamics", "gas-laws", "important"])';

-- Example data structure:
-- INSERT INTO pyq_bank (exam_id, exam_year, question, answer, question_type, topic, subject, difficulty, marks, source, explanation)
-- VALUES
--   ('jee-main', 2024, 'What is the SI unit of electric current?', 'Ampere', 'direct_answer', 'Current Electricity', 'Physics', 'easy', 1, 'JEE Main 2024 Shift 1', 'The SI unit of electric current is Ampere (A), named after André-Marie Ampère.'),
--   ('neet-ug', 2023, 'What is the powerhouse of the cell?', 'Mitochondria', 'direct_answer', 'Cell Biology', 'Biology', 'easy', 1, 'NEET 2023', 'Mitochondria generate ATP through cellular respiration.');
