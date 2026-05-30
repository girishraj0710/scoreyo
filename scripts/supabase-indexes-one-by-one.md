# Run Indexes One-by-One (With CONCURRENTLY)

If you want zero downtime, run each index **separately** in Supabase SQL Editor.

## Instructions

1. Open Supabase SQL Editor
2. Run each command below **one at a time** (copy, paste, run, wait)
3. Each takes 10-60 seconds

---

## Index 1: Questions Lookup (Most Important)

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_questions_lookup
ON fact_exam_questions(exam_id, subject_id, topic)
INCLUDE (question, options, correct_answer, explanation, difficulty, source, passage);
```

**Wait for completion** before running next one.

---

## Index 2: Questions Source Priority

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_questions_source_priority
ON fact_exam_questions(exam_id, subject_id, topic, source, difficulty);
```

---

## Index 3: Questions Count

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_questions_count
ON fact_exam_questions(exam_id, subject_id, topic);
```

---

## Index 4: Topic Mastery User

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_topic_mastery_user
ON topic_mastery(user_id, exam_id, subject_id, topic)
INCLUDE (total_attempted, total_correct, mastery_score, last_attempted);
```

---

## Index 5: Topic Mastery Review

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_topic_mastery_review
ON topic_mastery(user_id, next_review)
WHERE total_attempted > 0;
```

---

## Index 6: Topic Mastery Weak

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_topic_mastery_weak
ON topic_mastery(user_id, exam_id, mastery_score ASC)
WHERE total_attempted > 0;
```

---

## Index 7: Quiz Sessions Recent

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_quiz_sessions_user_recent
ON quiz_sessions(user_id, created_at DESC)
INCLUDE (exam_id, subject_id, topic, total_questions, correct_answers);
```

---

## Index 8: Quiz Sessions Date Range

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_quiz_sessions_date_range
ON quiz_sessions(user_id, created_at)
WHERE created_at > CURRENT_DATE - INTERVAL '30 days';
```

---

## Index 9: Quiz Sessions Stats

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_quiz_sessions_stats
ON quiz_sessions(user_id, exam_id, subject_id)
INCLUDE (total_questions, correct_answers, time_taken_seconds);
```

---

## Index 10: Question Attempts Session

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_question_attempts_session
ON question_attempts(session_id, is_correct);
```

---

## Index 11: Question Attempts Weak

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_question_attempts_weak
ON question_attempts(user_id, exam_id, subject_id, topic, is_correct)
WHERE is_correct = false;
```

---

## Index 12: Users Subscription

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_subscription
ON users(id)
INCLUDE (subscription_status, subscription_end_date);
```

---

## Index 13: Users Email

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email
ON users(email);
```

---

## Index 14: Sprints Active

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sprints_active
ON sprints(status, end_time)
WHERE status = 'active' AND end_time > NOW();
```

---

## Index 15: Sprint Participants Leaderboard

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sprint_participants_leaderboard
ON sprint_participants(sprint_id, score DESC, time_taken_seconds ASC);
```

---

## Final Step: Update Statistics

```sql
ANALYZE fact_exam_questions;
ANALYZE topic_mastery;
ANALYZE quiz_sessions;
ANALYZE question_attempts;
ANALYZE users;
```

---

## Verify All Indexes Created

```sql
SELECT
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid::regclass)) as size
FROM pg_indexes
JOIN pg_stat_user_indexes USING (schemaname, tablename, indexname)
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY pg_relation_size(indexrelid::regclass) DESC;
```

**Should show ~15 indexes**

---

**Pros**: Zero downtime, safe for production  
**Cons**: Takes 10-15 minutes (run each one separately)

**Alternative**: Use `supabase-indexes-no-concurrent.sql` - runs in 30 seconds!

