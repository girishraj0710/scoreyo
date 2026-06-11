-- Question Generation System Schema
-- Extends existing dimensional model without modifying production tables
-- Deploy to Supabase PostgreSQL
-- Date: June 11, 2026

-- ============================================================================
-- TABLE 1: PYQ Metadata (Track scraped questions quality + patterns)
-- ============================================================================

CREATE TABLE IF NOT EXISTS pyq_metadata (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL UNIQUE,
  source_year INTEGER NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('official', 'coaching', 'community')),
  source_url TEXT,
  frequency_score FLOAT DEFAULT 0,                    -- 0-1: How often does this topic appear?
  recency_score FLOAT DEFAULT 0,                      -- 0-1: Recently asked?
  trap_pattern TEXT,                                  -- Type of trap: 'similar_word', 'partial_truth', etc.
  is_benchmark_pyq BOOLEAN DEFAULT FALSE,             -- Used as example for generation?
  quality_rating INTEGER DEFAULT 0 CHECK (quality_rating >= 0 AND quality_rating <= 10),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES fact_exam_questions(id) ON DELETE CASCADE
);

CREATE INDEX idx_pyq_metadata_question ON pyq_metadata(question_id);
CREATE INDEX idx_pyq_metadata_quality ON pyq_metadata(quality_rating DESC);
CREATE INDEX idx_pyq_metadata_benchmark ON pyq_metadata(is_benchmark_pyq);
CREATE INDEX idx_pyq_metadata_source ON pyq_metadata(source_year, source_type);

-- ============================================================================
-- TABLE 2: Exam Pattern Profiles (Extracted exam DNA)
-- ============================================================================

CREATE TABLE IF NOT EXISTS exam_pattern_profiles (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL,
  year INTEGER NOT NULL,
  section TEXT,                                       -- 'Reading', 'Physics', 'Biology', etc.
  topic_id INTEGER,
  question_type TEXT,                                 -- 'MCQ', 'numerical', 'assertion-reason'
  difficulty_distribution JSONB,                      -- {"easy": 0.3, "medium": 0.5, "hard": 0.2}
  frequency_pct FLOAT,                                -- X% of questions in this exam
  avg_difficulty FLOAT,                               -- 0-1 scale
  common_traps TEXT[],                                -- Array of trap patterns
  topic_roi_score INTEGER DEFAULT 0,                  -- 0-100: Priority ranking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES dim_exams(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES dim_topics(id) ON DELETE SET NULL,
  UNIQUE(exam_id, year, section, topic_id, question_type)
);

CREATE INDEX idx_exam_pattern_exam ON exam_pattern_profiles(exam_id);
CREATE INDEX idx_exam_pattern_year ON exam_pattern_profiles(exam_id, year);
CREATE INDEX idx_exam_pattern_topic ON exam_pattern_profiles(topic_id);
CREATE INDEX idx_exam_pattern_roi ON exam_pattern_profiles(topic_roi_score DESC);

-- ============================================================================
-- TABLE 3: Question Generation Batches (Track generation runs)
-- ============================================================================

CREATE TABLE IF NOT EXISTS question_generation_batches (
  id SERIAL PRIMARY KEY,
  batch_name TEXT NOT NULL,
  exam_id INTEGER NOT NULL,
  subject_id INTEGER,
  topic_id INTEGER,
  difficulty TEXT,
  questions_requested INTEGER NOT NULL,
  generation_model TEXT,                              -- 'gemini-pro', 'gpt-4o', etc.
  generation_prompt JSONB,                            -- Stored for reproducibility
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  error_message TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES dim_exams(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES dim_subjects(id) ON DELETE SET NULL,
  FOREIGN KEY (topic_id) REFERENCES dim_topics(id) ON DELETE SET NULL
);

CREATE INDEX idx_generation_batch_exam ON question_generation_batches(exam_id);
CREATE INDEX idx_generation_batch_status ON question_generation_batches(status);
CREATE INDEX idx_generation_batch_created ON question_generation_batches(created_at DESC);

-- ============================================================================
-- TABLE 4: Generated Questions (AI output awaiting validation)
-- ============================================================================

CREATE TABLE IF NOT EXISTS generated_questions (
  id SERIAL PRIMARY KEY,
  batch_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,                             -- ["A", "B", "C", "D"]
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  explanation TEXT,
  question_type TEXT,                                 -- 'MCQ', 'numerical', 'true_false', etc.
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  ai_confidence_score FLOAT DEFAULT 0,                -- 0-1: How confident was AI?
  validation_score FLOAT DEFAULT 0,                   -- 0-100: Quality gate score
  is_approved BOOLEAN DEFAULT FALSE,
  approval_reason TEXT,
  approved_by TEXT,
  approved_at TIMESTAMP,
  is_in_production BOOLEAN DEFAULT FALSE,             -- Moved to fact_exam_questions?
  production_question_id INTEGER,                     -- Link to fact_exam_questions if approved
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES question_generation_batches(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES dim_topics(id) ON DELETE CASCADE,
  FOREIGN KEY (production_question_id) REFERENCES fact_exam_questions(id) ON DELETE SET NULL
);

CREATE INDEX idx_generated_questions_batch ON generated_questions(batch_id);
CREATE INDEX idx_generated_questions_topic ON generated_questions(topic_id);
CREATE INDEX idx_generated_questions_validation ON generated_questions(validation_score DESC);
CREATE INDEX idx_generated_questions_approved ON generated_questions(is_approved, is_in_production);
CREATE INDEX idx_generated_questions_difficulty ON generated_questions(difficulty);

-- ============================================================================
-- TABLE 5: Question Validations (Quality gate audit trail)
-- ============================================================================

CREATE TABLE IF NOT EXISTS question_validations (
  id SERIAL PRIMARY KEY,
  generated_question_id INTEGER NOT NULL,
  validation_type TEXT NOT NULL CHECK (validation_type IN ('format', 'concept', 'difficulty', 'originality', 'option_quality')),
  validation_result TEXT NOT NULL CHECK (validation_result IN ('pass', 'fail', 'review_needed')),
  score INTEGER,                                      -- 0-100 for this specific check
  feedback TEXT,
  validator_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (generated_question_id) REFERENCES generated_questions(id) ON DELETE CASCADE
);

CREATE INDEX idx_question_validations_question ON question_validations(generated_question_id);
CREATE INDEX idx_question_validations_type ON question_validations(validation_type);
CREATE INDEX idx_question_validations_result ON question_validations(validation_result);

-- ============================================================================
-- TABLE 6: Outcome Paths (Personalized learning sequences)
-- ============================================================================

CREATE TABLE IF NOT EXISTS outcome_paths (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL,
  subject_id INTEGER,
  topic_id INTEGER,
  outcome_type TEXT NOT NULL CHECK (outcome_type IN ('score_improvement', 'weakness_rescue', 'final_prep', 'comprehensive')),
  from_percentile INTEGER,                            -- e.g., 65
  to_percentile INTEGER,                              -- e.g., 85
  difficulty_progression TEXT[],                      -- ['foundation', 'bridge', 'competitive', 'advanced']
  question_sequence JSONB,                            -- Ordered array of question IDs
  question_count INTEGER,
  estimated_hours FLOAT,
  success_rate FLOAT DEFAULT 0,                       -- % of students who reached goal
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES dim_exams(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES dim_subjects(id) ON DELETE SET NULL,
  FOREIGN KEY (topic_id) REFERENCES dim_topics(id) ON DELETE SET NULL
);

CREATE INDEX idx_outcome_paths_exam ON outcome_paths(exam_id);
CREATE INDEX idx_outcome_paths_outcome_type ON outcome_paths(outcome_type);
CREATE INDEX idx_outcome_paths_percentile ON outcome_paths(from_percentile, to_percentile);

-- ============================================================================
-- TABLE 7: PYQ Scrape Logs (Audit trail for scraping)
-- ============================================================================

CREATE TABLE IF NOT EXISTS pyq_scrape_logs (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER,
  source_url TEXT NOT NULL,
  source_type TEXT,                                   -- 'official', 'coaching', 'community'
  year_from INTEGER,
  year_to INTEGER,
  questions_found INTEGER DEFAULT 0,
  questions_parsed INTEGER DEFAULT 0,
  duplicates_found INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'partial')),
  error_message TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES dim_exams(id) ON DELETE SET NULL
);

CREATE INDEX idx_scrape_logs_exam ON pyq_scrape_logs(exam_id);
CREATE INDEX idx_scrape_logs_status ON pyq_scrape_logs(status);
CREATE INDEX idx_scrape_logs_created ON pyq_scrape_logs(created_at DESC);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify all tables created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'pyq_metadata',
    'exam_pattern_profiles',
    'question_generation_batches',
    'generated_questions',
    'question_validations',
    'outcome_paths',
    'pyq_scrape_logs'
  )
ORDER BY table_name;

-- Verify all indexes created
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY indexname;

-- Success message
SELECT 'Question Generation Schema deployed successfully!' as status;
