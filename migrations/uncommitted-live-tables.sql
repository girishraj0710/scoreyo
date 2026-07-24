-- Captures 7 tables that exist in the live Supabase DB but were only ever
-- created via ad-hoc scripts/*.mjs — never committed as migrations.
-- Committing them here removes the deploy/DR risk (a fresh DB could not be
-- rebuilt from the repo). DDL mirrors the live schema exactly (audit 2026-07-24).
-- Idempotent: uses IF NOT EXISTS throughout; safe on the existing prod DB.

-- ── learner_profiles (onboarding) — src: scripts/create-onboarding-tables.mjs ──
CREATE TABLE IF NOT EXISTS learner_profiles (
  user_id TEXT PRIMARY KEY,
  exam_id TEXT,
  profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── study_plans — src: scripts/create-onboarding-tables.mjs ──
CREATE TABLE IF NOT EXISTS study_plans (
  user_id TEXT PRIMARY KEY,
  exam_id TEXT,
  plan JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── topic_skill_state (learner model / BKT) — src: scripts/create-skill-state-table.mjs ──
CREATE TABLE IF NOT EXISTS topic_skill_state (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  p_known REAL NOT NULL DEFAULT 0.3,
  stability REAL NOT NULL DEFAULT 1.0,
  difficulty REAL NOT NULL DEFAULT 0.5,
  attempts INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  ewma_accuracy REAL NOT NULL DEFAULT 0.5,
  ewma_speed_ratio REAL NOT NULL DEFAULT 1.0,
  err_calculation INTEGER NOT NULL DEFAULT 0,
  err_concept INTEGER NOT NULL DEFAULT 0,
  err_time INTEGER NOT NULL DEFAULT 0,
  err_careless INTEGER NOT NULL DEFAULT 0,
  last_seen TIMESTAMP,
  next_review TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, exam_id, subject_id, topic)
);
CREATE INDEX IF NOT EXISTS idx_skill_state_lookup ON topic_skill_state (user_id, exam_id);
CREATE INDEX IF NOT EXISTS idx_skill_state_review ON topic_skill_state (user_id, next_review);

-- ── user_english_assessment — src: scripts/create-english-assessment-table.mjs ──
CREATE TABLE IF NOT EXISTS user_english_assessment (
  user_id TEXT PRIMARY KEY,
  level TEXT NOT NULL,
  level_name TEXT NOT NULL,
  overall_score INTEGER NOT NULL DEFAULT 0,
  skill_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence TEXT,
  study_path JSONB,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── pending_questions (contributor) — src: scripts/migrate-pending-questions.sql, /api/admin/migrate ──
CREATE TABLE IF NOT EXISTS pending_questions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_file TEXT,
  content_preview TEXT,
  detected_exam_id TEXT,
  detected_subject_id TEXT,
  detected_topics TEXT,
  classification_confidence REAL,
  question TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  trap_alerts TEXT,
  difficulty TEXT,
  status TEXT DEFAULT 'pending',
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  quality_score REAL,
  duplicate_check_passed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pending_status ON pending_questions (status);
CREATE INDEX IF NOT EXISTS idx_pending_exam ON pending_questions (detected_exam_id);
CREATE INDEX IF NOT EXISTS idx_pending_user ON pending_questions (user_id);
CREATE INDEX IF NOT EXISTS idx_pending_created ON pending_questions (created_at DESC);

-- ── user_enrolled_exams (multi-exam enrollment) ──
CREATE TABLE IF NOT EXISTS user_enrolled_exams (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  is_primary INTEGER DEFAULT 0,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, exam_id)
);
CREATE INDEX IF NOT EXISTS idx_user_enrolled_exams_user ON user_enrolled_exams (user_id);
CREATE INDEX IF NOT EXISTS idx_user_enrolled_exams_primary ON user_enrolled_exams (user_id, is_primary);

-- ── english_study_content — src: scripts/create-english-study-content-table.mjs ──
CREATE TABLE IF NOT EXISTS english_study_content (
  id SERIAL PRIMARY KEY,
  subject_id TEXT NOT NULL DEFAULT 'english',
  path_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  overview TEXT,
  content JSONB NOT NULL,
  difficulty_level TEXT,
  estimated_time_minutes INTEGER,
  prerequisites TEXT[],
  diagrams JSONB,
  videos JSONB,
  curriculum_standard TEXT,
  textbook_references TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (path_id, topic_id)
);
CREATE INDEX IF NOT EXISTS idx_english_study_content_lookup ON english_study_content (path_id, topic_id);
