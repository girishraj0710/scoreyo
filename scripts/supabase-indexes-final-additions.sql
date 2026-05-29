-- ============================================================================
-- PrepGenie - Final Index Additions (5 minutes)
-- Only adds missing indexes to your existing 130+ indexes
-- ============================================================================

-- 1. INCLUDE indexes for fact_exam_questions (avoid heap lookups)
CREATE INDEX IF NOT EXISTS idx_fact_questions_full_data
ON fact_exam_questions(topic_id, difficulty)
INCLUDE (question, options, correct_answer, explanation, source);

-- 2. Stats aggregation (INCLUDE for no heap lookups)
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_stats_full
ON quiz_sessions(user_id, exam_id, subject_id)
INCLUDE (total_questions, correct_answers, time_taken_seconds, created_at);

-- 3. Partial index for weak topics in topic_mastery
CREATE INDEX IF NOT EXISTS idx_topic_mastery_weak_topics
ON topic_mastery(user_id, exam_id, subject_id, mastery_score ASC)
WHERE total_attempted > 0 AND mastery_score < 60;

-- 4. Question attempts wrong answers (for weakness tracking)
CREATE INDEX IF NOT EXISTS idx_question_attempts_errors
ON question_attempts(user_id, exam_id, subject_id, topic)
WHERE is_correct = false;

-- 5. Subscriptions active lookup (for Pro checks)
CREATE INDEX IF NOT EXISTS idx_subscriptions_active
ON subscriptions(user_id, expires_at)
WHERE status = 'active';

-- ============================================================================
-- Update statistics
-- ============================================================================
ANALYZE fact_exam_questions;
ANALYZE topic_mastery;
ANALYZE quiz_sessions;
ANALYZE question_attempts;
ANALYZE users;

-- ============================================================================
-- Verify new indexes
-- ============================================================================
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN (
    'idx_fact_questions_full_data',
    'idx_quiz_sessions_stats_full',
    'idx_topic_mastery_weak_topics',
    'idx_question_attempts_errors',
    'idx_subscriptions_active'
  )
ORDER BY tablename;

-- ============================================================================
-- ✅ Expected: 5 new indexes (should see all above)
-- Total indexes after: 135+
-- ============================================================================
