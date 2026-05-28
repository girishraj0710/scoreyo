-- PrepGenie Migration to Supabase PostgreSQL
-- This creates all tables with proper PostgreSQL syntax

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS daily_challenge_progress CASCADE;
DROP TABLE IF EXISTS daily_challenges CASCADE;
DROP TABLE IF EXISTS badge_stats CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS level_question_cache CASCADE;
DROP TABLE IF EXISTS level_definitions CASCADE;
DROP TABLE IF EXISTS user_english_levels CASCADE;
DROP TABLE IF EXISTS user_quiz_levels CASCADE;
DROP TABLE IF EXISTS english_daily_practice CASCADE;
DROP TABLE IF EXISTS english_questions CASCADE;
DROP TABLE IF EXISTS english_progress CASCADE;
DROP TABLE IF EXISTS sprint_participations CASCADE;
DROP TABLE IF EXISTS daily_sprints CASCADE;
DROP TABLE IF EXISTS dpp_completions CASCADE;
DROP TABLE IF EXISTS daily_practice_problems CASCADE;
DROP TABLE IF EXISTS clarifications CASCADE;
DROP TABLE IF EXISTS weakness_profiles CASCADE;
DROP TABLE IF EXISTS mock_tests CASCADE;
DROP TABLE IF EXISTS payment_history CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS otp_codes CASCADE;
DROP TABLE IF EXISTS cached_questions CASCADE;
DROP TABLE IF EXISTS fact_exam_questions CASCADE;
DROP TABLE IF EXISTS bridge_exam_subject_topic CASCADE;
DROP TABLE IF EXISTS dim_topics CASCADE;
DROP TABLE IF EXISTS dim_subjects CASCADE;
DROP TABLE IF EXISTS dim_exams CASCADE;
DROP TABLE IF EXISTS question_reports CASCADE;
DROP TABLE IF EXISTS reported_questions CASCADE;
DROP TABLE IF EXISTS topic_mastery CASCADE;
DROP TABLE IF EXISTS question_attempts CASCADE;
DROP TABLE IF EXISTS quiz_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  age INTEGER,
  location TEXT,
  phone_number TEXT,
  exam_preparing_for TEXT,
  avatar_color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz sessions
CREATE TABLE quiz_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_taken_seconds INTEGER DEFAULT 0,
  pressure_mode BOOLEAN DEFAULT FALSE,
  source_stats JSONB,
  sprint_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Question attempts
CREATE TABLE question_attempts (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  question_text TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_answer INTEGER NOT NULL,
  user_answer INTEGER,
  is_correct BOOLEAN,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES quiz_sessions(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Topic mastery
CREATE TABLE topic_mastery (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  total_attempted INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  mastery_score REAL DEFAULT 0,
  last_attempted TIMESTAMP,
  next_review TIMESTAMP,
  UNIQUE(user_id, exam_id, subject_id, topic),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Reported questions
CREATE TABLE reported_questions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  question_text TEXT NOT NULL,
  reported_issue TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question reports
CREATE TABLE question_reports (
  id TEXT PRIMARY KEY,
  question_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Dimensional model tables
CREATE TABLE dim_exams (
  id SERIAL PRIMARY KEY,
  exam_code TEXT NOT NULL UNIQUE,
  exam_name TEXT NOT NULL,
  category TEXT,
  conducting_body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dim_subjects (
  id SERIAL PRIMARY KEY,
  subject_code TEXT NOT NULL UNIQUE,
  subject_name TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dim_topics (
  id SERIAL PRIMARY KEY,
  topic_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  scope TEXT NOT NULL CHECK(scope IN ('universal', 'state-specific', 'exam-specific')),
  parent_topic_id INTEGER,
  description TEXT,
  keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_topic_id) REFERENCES dim_topics(id)
);

CREATE TABLE bridge_exam_subject_topic (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  is_mandatory BOOLEAN DEFAULT TRUE,
  weightage INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES dim_exams(id),
  FOREIGN KEY (subject_id) REFERENCES dim_subjects(id),
  FOREIGN KEY (topic_id) REFERENCES dim_topics(id),
  UNIQUE(exam_id, subject_id, topic_id)
);

CREATE TABLE fact_exam_questions (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
  source TEXT,
  valid_from INTEGER,
  valid_until INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES dim_topics(id)
);

-- Cached questions
CREATE TABLE cached_questions (
  id SERIAL PRIMARY KEY,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  question_json TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_count INTEGER DEFAULT 0
);

-- OTP codes
CREATE TABLE otp_codes (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free',
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  amount INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'active',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Payment history
CREATE TABLE payment_history (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  plan TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'success',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Mock tests
CREATE TABLE mock_tests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER DEFAULT 0,
  time_limit_seconds INTEGER NOT NULL,
  time_taken_seconds INTEGER DEFAULT 0,
  status TEXT DEFAULT 'in_progress',
  questions_json TEXT NOT NULL,
  answers_json TEXT DEFAULT '[]',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Weakness profiles
CREATE TABLE weakness_profiles (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  calculation_errors INTEGER DEFAULT 0,
  concept_errors INTEGER DEFAULT 0,
  time_errors INTEGER DEFAULT 0,
  careless_errors INTEGER DEFAULT 0,
  total_errors INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, exam_id, subject_id, topic),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Clarifications
CREATE TABLE clarifications (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  user_question TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  helpful BOOLEAN DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Daily practice problems
CREATE TABLE daily_practice_problems (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  questions TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dpp_completions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  dpp_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (dpp_id) REFERENCES daily_practice_problems(id)
);

-- Daily sprints
CREATE TABLE daily_sprints (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  topic TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  questions TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sprint_participations (
  id SERIAL PRIMARY KEY,
  sprint_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken_seconds INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sprint_id) REFERENCES daily_sprints(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- English learning
CREATE TABLE english_progress (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  path_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  level TEXT NOT NULL,
  completed_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_time_seconds INTEGER DEFAULT 0,
  last_practiced TIMESTAMP,
  mastery_score REAL DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  UNIQUE(user_id, path_id, topic_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE english_questions (
  id SERIAL PRIMARY KEY,
  path_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  level TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE english_daily_practice (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  questions_completed INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  UNIQUE(user_id, date),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Level system
CREATE TABLE user_quiz_levels (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  level_number INTEGER NOT NULL,
  level_type TEXT NOT NULL DEFAULT 'normal',
  is_unlocked INTEGER DEFAULT 0,
  is_completed INTEGER DEFAULT 0,
  stars_earned INTEGER DEFAULT 0,
  best_accuracy INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  completed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, exam_id, subject_id, level_number)
);

CREATE TABLE user_english_levels (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  path_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  level_number INTEGER DEFAULT 0,
  is_unlocked INTEGER DEFAULT 0,
  practice_completed INTEGER DEFAULT 0,
  test_completed INTEGER DEFAULT 0,
  stars_earned INTEGER DEFAULT 0,
  best_accuracy INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  completed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, path_id, topic_id)
);

CREATE TABLE level_definitions (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  level_number INTEGER NOT NULL,
  level_name TEXT NOT NULL,
  level_type TEXT NOT NULL DEFAULT 'normal',
  difficulty TEXT NOT NULL,
  topic TEXT,
  question_count INTEGER NOT NULL,
  unlock_requirement TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(exam_id, subject_id, level_number)
);

CREATE TABLE level_question_cache (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  level_number INTEGER NOT NULL,
  questions_json TEXT NOT NULL,
  is_passed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, exam_id, subject_id, level_number)
);

-- Badges
CREATE TABLE user_badges (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE badge_stats (
  user_id TEXT PRIMARY KEY,
  levels_completed INTEGER DEFAULT 0,
  high_accuracy_quizzes INTEGER DEFAULT 0,
  very_high_accuracy_quizzes INTEGER DEFAULT 0,
  perfect_quizzes INTEGER DEFAULT 0,
  fast_quizzes INTEGER DEFAULT 0,
  topic_masteries_90 INTEGER DEFAULT 0,
  subject_masteries_80 INTEGER DEFAULT 0,
  early_dpps INTEGER DEFAULT 0,
  late_quizzes INTEGER DEFAULT 0,
  weekend_sessions INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE daily_challenges (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  challenge_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirement TEXT NOT NULL,
  target_value INTEGER NOT NULL,
  reward_points INTEGER DEFAULT 10,
  badge_reward TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_challenge_progress (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  challenge_id TEXT NOT NULL,
  current_value INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  UNIQUE(user_id, challenge_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (challenge_id) REFERENCES daily_challenges(id)
);

-- Create indexes for performance
CREATE INDEX idx_quiz_sessions_user ON quiz_sessions(user_id);
CREATE INDEX idx_quiz_sessions_exam ON quiz_sessions(exam_id);
CREATE INDEX idx_quiz_sessions_created ON quiz_sessions(created_at DESC);
CREATE INDEX idx_quiz_sessions_user_created ON quiz_sessions(user_id, created_at DESC);
CREATE INDEX idx_quiz_sessions_leaderboard ON quiz_sessions(user_id, total_questions, correct_answers, created_at DESC);

CREATE INDEX idx_question_attempts_session ON question_attempts(session_id);
CREATE INDEX idx_question_attempts_correct ON question_attempts(user_id, is_correct);
CREATE INDEX idx_question_attempts_created ON question_attempts(user_id, created_at DESC);

CREATE INDEX idx_topic_mastery_user ON topic_mastery(user_id, exam_id);
CREATE INDEX idx_topic_mastery_score ON topic_mastery(mastery_score);
CREATE INDEX idx_topic_mastery_review ON topic_mastery(user_id, next_review);
CREATE INDEX idx_topic_mastery_exam_score ON topic_mastery(exam_id, subject_id, mastery_score DESC);

CREATE INDEX idx_reported_questions ON reported_questions(status);
CREATE INDEX idx_question_reports_status ON question_reports(status);
CREATE INDEX idx_question_reports_question ON question_reports(question_id);

CREATE INDEX idx_fact_topic ON fact_exam_questions(topic_id);
CREATE INDEX idx_fact_difficulty ON fact_exam_questions(difficulty);
CREATE INDEX idx_fact_questions_difficulty ON fact_exam_questions(topic_id, difficulty);
CREATE INDEX idx_fact_questions_source ON fact_exam_questions(source, difficulty);
CREATE INDEX idx_fact_questions_validity ON fact_exam_questions(valid_from, valid_until);

CREATE INDEX idx_bridge_exam ON bridge_exam_subject_topic(exam_id);
CREATE INDEX idx_bridge_subject ON bridge_exam_subject_topic(subject_id);
CREATE INDEX idx_bridge_topic ON bridge_exam_subject_topic(topic_id);
CREATE INDEX idx_bridge_exam_subject ON bridge_exam_subject_topic(exam_id, subject_id);
CREATE INDEX idx_bridge_full ON bridge_exam_subject_topic(exam_id, subject_id, topic_id);

CREATE INDEX idx_dim_exams_code ON dim_exams(exam_code);
CREATE INDEX idx_dim_subjects_code ON dim_subjects(subject_code);
CREATE INDEX idx_dim_topics_name ON dim_topics(topic_name);
CREATE INDEX idx_dim_topics_scope ON dim_topics(scope, category);

CREATE INDEX idx_cached_questions_lookup ON cached_questions(exam_id, subject_id, topic);
CREATE INDEX idx_cached_questions_difficulty ON cached_questions(exam_id, subject_id, topic, difficulty);

CREATE INDEX idx_otp_email ON otp_codes(email, code);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_expires ON subscriptions(expires_at);
CREATE INDEX idx_subscriptions_user_status ON subscriptions(user_id, status);

CREATE INDEX idx_payment_history_user ON payment_history(user_id);

CREATE INDEX idx_mock_tests_user ON mock_tests(user_id);
CREATE INDEX idx_mock_tests_exam ON mock_tests(exam_id);
CREATE INDEX idx_mock_tests_status ON mock_tests(status);
CREATE INDEX idx_mock_tests_completed ON mock_tests(user_id, status, completed_at DESC);
CREATE INDEX idx_mock_tests_exam_status ON mock_tests(exam_id, status);

CREATE INDEX idx_weakness_profiles_user ON weakness_profiles(user_id);
CREATE INDEX idx_weakness_total_errors ON weakness_profiles(user_id, exam_id, total_errors DESC);

CREATE INDEX idx_clarifications_question ON clarifications(question_text);
CREATE INDEX idx_clarifications_user_created ON clarifications(user_id, created_at DESC);

CREATE INDEX idx_dpp_completions_user ON dpp_completions(user_id);
CREATE INDEX idx_dpp_completions_date ON dpp_completions(user_id, completed_at DESC);

CREATE INDEX idx_sprint_participations ON sprint_participations(sprint_id, score DESC);
CREATE INDEX idx_sprint_participations_leaderboard ON sprint_participations(sprint_id, score DESC, time_taken_seconds ASC);
CREATE INDEX idx_daily_sprints_date_status ON daily_sprints(date, status);

CREATE INDEX idx_english_progress_user ON english_progress(user_id);
CREATE INDEX idx_english_progress_path ON english_progress(user_id, path_id, mastery_score DESC);

CREATE INDEX idx_english_questions_lookup ON english_questions(path_id, topic_id, level);
CREATE INDEX idx_english_questions_path_level ON english_questions(path_id, topic_id, level, difficulty);

CREATE INDEX idx_english_daily_user ON english_daily_practice(user_id, date DESC);

CREATE INDEX idx_user_quiz_levels_user ON user_quiz_levels(user_id, exam_id, subject_id);
CREATE INDEX idx_user_english_levels_user ON user_english_levels(user_id, path_id);
CREATE INDEX idx_level_definitions_exam ON level_definitions(exam_id, subject_id);
CREATE INDEX idx_level_question_cache_user ON level_question_cache(user_id, exam_id, subject_id, level_number);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_badge_stats_updated ON badge_stats(user_id, last_updated DESC);

CREATE INDEX idx_daily_challenges_date ON daily_challenges(date);
CREATE INDEX idx_daily_challenge_progress_user ON daily_challenge_progress(user_id, challenge_id);

-- Create a unique index on fact_exam_questions to prevent duplicates
CREATE UNIQUE INDEX idx_unique_question ON fact_exam_questions(topic_id, md5(question));

-- Insert default user
INSERT INTO users (id, name) VALUES ('default-user', 'Student')
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Schema created successfully! Ready for data import.' as status;
