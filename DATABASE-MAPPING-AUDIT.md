# Database Mapping Audit - Krakkify
**Date:** June 14, 2026  
**Purpose:** Verify consistency between code, API, and database before content generation

---

## 1. Exam & Subject ID Structure

### Frontend (src/lib/exams.ts)
```
Exam ID:     "jee-main"
Subject ID:  "jee-physics", "jee-chemistry", "jee-maths"
Topic:       "Thermodynamics", "Kinematics" (Original case)
```

### Database (Dimensional Model)
**Tables:**
- `dim_exams` - exam_code (e.g., "jee-main")
- `dim_subjects` - subject_code (e.g., "physics", "chemistry")  
- `dim_topics` - topic_name (e.g., "thermodynamics" lowercase)
- `bridge_exam_subject_topic` - links all three
- `fact_exam_questions` - actual questions

**Key Insight:** Subjects in database do NOT have exam prefix!
- Code: `jee-physics` → Database: `physics`

---

## 2. Critical API Routes

### A. `/api/quiz` (Main Quiz Generator)
**Input:** 
- `examId`: "jee-main"
- `subjectId`: "jee-physics" (WITH prefix)
- `topic`: "Thermodynamics" (original case)

**Function Called:** `generateQuiz()` in `src/lib/quiz-generator.ts`

**Database Query Pattern:**
```typescript
// Uses dimensional model via saveVerifiedQuestions()
// Params: examId, subjectId, topic, questions[]
```

**ISSUE CHECK NEEDED:** Does quiz-generator strip the exam prefix before querying?

---

### B. `/api/study-content` (Study Materials)
**Input:**
- `subject`: "physics" (NO prefix, lowercase)
- `topic`: "thermodynamics" (lowercase)

**Database Query:**
```sql
SELECT * FROM topic_study_content
WHERE subject_id = $1 AND topic_id = $2
-- Expects: subject_id='physics', topic_id='thermodynamics'
```

**Status:** ✅ Working (confirmed by user)

---

### C. `/api/stats` (User Dashboard)
**Function Called:** Functions in `src/lib/db.ts`
- `getRecentSessions()`
- `getTopicMastery()`
- `getWeakTopics()`

**Tables Used:**
- `quiz_sessions` (session_id, user_id, exam_id, subject_id, topic, score, etc.)
- `quiz_results` (session_id, question_id, user_answer, is_correct, etc.)
- `topic_mastery` (user_id, exam_id, subject_id, topic, correct, total, level, etc.)

**ISSUE CHECK NEEDED:** Do these tables use `subject_id` with or without prefix?

---

## 3. Table Relationships

### Dimensional Model (Questions)
```
dim_exams (id, exam_code, exam_name)
    ↓
bridge_exam_subject_topic (exam_id FK, subject_id FK, topic_id FK)
    ↓
dim_subjects (id, subject_code, subject_name)
dim_topics (id, topic_name, difficulty)
    ↓
fact_exam_questions (id, topic_id FK, question, options, correct_answer, explanation)
```

### User Activity Tables
```
users (id, email, name, role, subscription_type, etc.)
    ↓
quiz_sessions (session_id, user_id FK, exam_id, subject_id, topic, score)
    ↓
quiz_results (id, session_id FK, question_id, user_answer, is_correct)
topic_mastery (user_id FK, exam_id, subject_id, topic, correct, total, level)
```

### Study Content Table
```
topic_study_content
- id (PK)
- subject_id (text) - e.g., "physics"
- topic_id (text) - e.g., "thermodynamics"
- path_id (text, nullable)
- title, subtitle, overview
- content (JSONB)
- difficulty_level, estimated_time_minutes
- prerequisites (text[])
- diagrams (JSONB)
- videos (JSONB)
- curriculum_standard, textbook_references (text[])
- created_at, updated_at
```

---

## 4. Known Issues to Verify

### Issue 1: Subject ID Prefix Inconsistency
**Symptom:** Frontend uses "jee-physics", database might use "physics"

**Affected Areas:**
- [ ] Quiz generation (does it strip prefix?)
- [ ] Question saving (which format is stored?)
- [ ] Stats queries (which format is queried?)
- [ ] Session tracking (which format is logged?)

**Action Required:** 
1. Check `quiz_sessions` table - what's in `subject_id` column?
2. Check `fact_exam_questions` - how are subjects linked?
3. Check `saveVerifiedQuestions()` function - does it handle prefix stripping?

---

### Issue 2: Topic Name Case Sensitivity
**Symptom:** Frontend sends "Thermodynamics", database has "thermodynamics"

**Current Handling:**
- Study page: Lowercases before query ✅
- Quiz page: Uses original case (might fail on exact match)

**Action Required:**
1. Check if database queries use ILIKE (case-insensitive) or = (exact match)
2. Standardize: Either always lowercase or always use ILIKE

---

### Issue 3: Study Content vs Question Tables Mismatch
**Study Content Table:**
- Uses `subject_id`, `topic_id` (text columns, no FKs)
- Standalone table (not linked to dimensional model)

**Question Tables:**
- Use dimensional model with FKs
- `fact_exam_questions.topic_id` → `dim_topics.id` (integer FK)

**Issue:** These are separate systems!
- Questions use dimensional model (integer IDs, proper FKs)
- Study content uses text IDs (no FKs, no joins)

**Action Required:** Decide if study content should also use dimensional model

---

## 5. Data Flow Examples

### Example 1: Generate Quiz for JEE Main Physics Thermodynamics
```
1. User selects: exam="jee-main", subject="jee-physics", topic="Thermodynamics"
2. Frontend calls: /api/quiz?examId=jee-main&subjectId=jee-physics&topic=Thermodynamics
3. API calls: generateQuiz("JEE Main", "Physics", "Thermodynamics", count, difficulty)
4. generateQuiz():
   a. Checks verified questions (dim_topics.topic_name = ?)
   b. Checks cached questions
   c. Calls AI generator if needed
5. Returns questions to frontend
6. User answers questions
7. Submit calls: /api/quiz (POST) with sessionId, answers
8. Saves to: quiz_sessions, quiz_results, topic_mastery
   - Question: What subject_id is saved? "jee-physics" or "physics"?
```

### Example 2: View Study Content for Thermodynamics
```
1. User clicks "Study First" on JEE Main > Physics > Thermodynamics
2. Frontend transforms:
   - subject: "jee-physics" → "physics" (strips prefix)
   - topic: "Thermodynamics" → "thermodynamics" (lowercase)
3. Frontend calls: /api/study-content?subject=physics&topic=thermodynamics
4. API queries: SELECT * FROM topic_study_content WHERE subject_id='physics' AND topic_id='thermodynamics'
5. Returns study content ✅ (confirmed working)
```

---

## 6. SQL Queries Needed from User

**Run these in Supabase SQL Editor:**

```sql
-- A. Check what's actually in quiz_sessions.subject_id
SELECT DISTINCT subject_id FROM quiz_sessions LIMIT 20;

-- B. Check dimensional model structure
SELECT 
  e.exam_code,
  s.subject_code,
  t.topic_name
FROM bridge_exam_subject_topic b
JOIN dim_exams e ON b.exam_id = e.id
JOIN dim_subjects s ON b.subject_id = s.id
JOIN dim_topics t ON b.topic_id = t.id
LIMIT 20;

-- C. Check if fact_exam_questions links to topics correctly
SELECT 
  t.topic_name,
  COUNT(q.id) as question_count
FROM fact_exam_questions q
JOIN dim_topics t ON q.topic_id = t.id
GROUP BY t.topic_name
ORDER BY question_count DESC
LIMIT 20;

-- D. Check study content subject/topic format
SELECT DISTINCT subject_id, topic_id FROM topic_study_content;
```

---

## 7. Code Files to Audit

### Priority 1 (Critical)
- [ ] `src/lib/quiz-generator.ts` - How does it query questions?
- [ ] `src/lib/db.ts` - `saveVerifiedQuestions()` function
- [ ] `src/app/api/quiz/route.ts` - Quiz API entry point
- [ ] `src/lib/exams.ts` - Exam/subject definitions

### Priority 2 (Important)
- [ ] `src/app/api/stats/route.ts` - Dashboard stats
- [ ] `src/lib/db.ts` - `createQuizSession()`, `updateTopicMastery()`
- [ ] Database migration files (if any exist)

---

## 8. Recommendations

### Immediate Actions:
1. ✅ User runs SQL queries above
2. ⏳ Audit `quiz-generator.ts` for subject ID handling
3. ⏳ Audit `saveVerifiedQuestions()` for prefix stripping
4. ⏳ Check if dimensional model needs prefix or not
5. ⏳ Standardize case sensitivity (lowercase or ILIKE)

### Long-term:
- Consider migrating `topic_study_content` to use dimensional model FKs
- Add database constraints to enforce ID formats
- Create migration script to fix any inconsistent data

---

## Status: ⏳ AWAITING SQL QUERY RESULTS

Once user provides the query results, we can identify exact mismatches and fix them.
