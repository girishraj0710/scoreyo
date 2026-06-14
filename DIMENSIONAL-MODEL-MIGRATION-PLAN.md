# Dimensional Model Migration Plan
**Date:** June 14, 2026  
**Goal:** Migrate from exam-specific subjects (jee-physics) to SHARED subjects (physics)

---

## Current State Analysis

### ❌ WRONG: Current Structure
```
dim_subjects:
  - jee-physics (exam-specific)
  - neet-physics (exam-specific)
  - cat-dilr (exam-specific)

bridge_exam_subject_topic:
  jee-main → jee-physics → Mechanics
  neet → neet-physics → Mechanics (DUPLICATE!)
  
fact_exam_questions:
  topic_id=123 (Mechanics for JEE)
  topic_id=456 (Mechanics for NEET - DUPLICATE!)
```

### ✅ CORRECT: Target Structure
```
dim_subjects:
  - physics (SHARED)
  - chemistry (SHARED)
  - mathematics (SHARED)
  - biology (SHARED)
  - english (SHARED)
  - quantitative-aptitude (SHARED)
  - logical-reasoning (SHARED)
  - data-interpretation (SHARED)
  - general-knowledge (SHARED)

bridge_exam_subject_topic:
  jee-main → physics → Mechanics (SHARED)
  neet → physics → Mechanics (SAME topic!)
  upsc → physics → Mechanics (SAME topic!)

fact_exam_questions:
  topic_id=1 (Mechanics - used by ALL exams)
```

---

## Migration Strategy

### Phase 1: Analyze Current Data ✅ (COMPLETED)
- [x] We confirmed dim_subjects has exam-prefixed subjects
- [x] We confirmed fact_exam_questions has 20,000+ questions
- [x] We confirmed quiz_sessions uses exam-prefixed subjects
- [x] We confirmed topics appear to be shared (but need verification)

### Phase 2: Create Shared Subject Mapping
**Map exam-prefixed subjects → shared subjects:**

```
jee-physics → physics
jee-chemistry → chemistry
jee-maths → mathematics
neet-physics → physics
neet-chemistry → chemistry
neet-biology → biology
cat-dilr → data-interpretation
cat-quant → quantitative-aptitude
cat-varc → verbal-ability
upsc-physics → physics
upsc-chemistry → chemistry
upsc-polity → political-science
upsc-history → history
upsc-geography → geography
ssc-english → english
ssc-maths → mathematics
ssc-reasoning → logical-reasoning
ssc-gk → general-knowledge
banking-english → english
banking-quant → quantitative-aptitude
banking-reasoning → logical-reasoning
gate-physics → physics
gate-chemistry → chemistry
gate-maths → mathematics
gate-engineering-math → engineering-mathematics
ailet-english → english
ailet-maths → mathematics
ailet-biology → biology
clat-english → english
clat-maths → mathematics
clat-gk → general-knowledge
cuet-english → english
cuet-physics → physics
cuet-chemistry → chemistry
```

### Phase 3: Verify Topics Are Already Shared
**Need to check:** Are topics like "Mechanics" duplicated per exam or already shared?

From your query, we saw:
- "Mechanics" used in 12 exams (GOOD - already shared!)
- "Current Affairs" used in 36 exams (GOOD - already shared!)

**If topics are already shared:** Migration is easier! Just update subjects.

**If topics are duplicated:** Need to merge duplicate topics too.

### Phase 4: Create New Shared Subjects
**SQL Script:**
```sql
-- Insert shared subjects (if they don't exist)
INSERT INTO dim_subjects (subject_code, subject_name, category)
VALUES 
  ('physics', 'Physics', 'science'),
  ('chemistry', 'Chemistry', 'science'),
  ('biology', 'Biology', 'science'),
  ('mathematics', 'Mathematics', 'science'),
  ('english', 'English', 'language'),
  ('quantitative-aptitude', 'Quantitative Aptitude', 'aptitude'),
  ('logical-reasoning', 'Logical Reasoning', 'aptitude'),
  ('data-interpretation', 'Data Interpretation', 'aptitude'),
  ('verbal-ability', 'Verbal Ability', 'language'),
  ('general-knowledge', 'General Knowledge', 'general-knowledge'),
  ('current-affairs', 'Current Affairs', 'general-knowledge'),
  ('political-science', 'Political Science', 'social-science'),
  ('history', 'History', 'social-science'),
  ('geography', 'Geography', 'social-science'),
  ('economics', 'Economics', 'social-science'),
  ('engineering-mathematics', 'Engineering Mathematics', 'science')
ON CONFLICT (subject_code) DO NOTHING;
```

### Phase 5: Update Bridge Table
**Map old exam-subject-topic → new exam-subject-topic:**

```sql
-- Create new bridge entries with shared subjects
INSERT INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id, is_mandatory, weightage)
SELECT 
  b.exam_id,
  ns.id AS new_subject_id,  -- Points to shared subject
  b.topic_id,                -- Keep same topic (already shared)
  b.is_mandatory,
  b.weightage
FROM bridge_exam_subject_topic b
JOIN dim_subjects os ON b.subject_id = os.id  -- Old subject (jee-physics)
JOIN dim_subjects ns ON (
  -- Map old subject to new shared subject
  CASE 
    WHEN os.subject_code LIKE '%-physics' THEN 'physics'
    WHEN os.subject_code LIKE '%-chemistry' THEN 'chemistry'
    WHEN os.subject_code LIKE '%-maths' THEN 'mathematics'
    WHEN os.subject_code LIKE '%-biology' THEN 'biology'
    WHEN os.subject_code LIKE '%-english' THEN 'english'
    WHEN os.subject_code LIKE '%-gk' THEN 'general-knowledge'
    WHEN os.subject_code LIKE '%-reasoning' THEN 'logical-reasoning'
    WHEN os.subject_code LIKE '%-quant%' THEN 'quantitative-aptitude'
    WHEN os.subject_code LIKE '%-dilr' THEN 'data-interpretation'
    WHEN os.subject_code LIKE '%-varc' THEN 'verbal-ability'
    WHEN os.subject_code LIKE '%-polity' THEN 'political-science'
    WHEN os.subject_code LIKE '%-history' THEN 'history'
    WHEN os.subject_code LIKE '%-geography' THEN 'geography'
    -- Add more mappings as needed
    ELSE os.subject_code
  END = ns.subject_code
)
WHERE NOT EXISTS (
  -- Don't create duplicates
  SELECT 1 FROM bridge_exam_subject_topic b2
  WHERE b2.exam_id = b.exam_id 
    AND b2.subject_id = ns.id 
    AND b2.topic_id = b.topic_id
);
```

### Phase 6: Update Code to Use Shared Subjects

**Files to Update:**

1. **src/lib/db.ts** - `saveVerifiedQuestions()` function
   - Change: Strip exam prefix before querying subjects
   
2. **src/lib/quiz-generator.ts** - `generateQuiz()` function
   - Change: Map exam-subject to shared subject before querying
   
3. **src/app/api/quiz/route.ts**
   - Change: Transform subjectId before passing to database
   
4. **Frontend (src/app/page.tsx)** - Quiz selection
   - Change: Transform "jee-physics" → "physics" when calling API
   
5. **Quiz sessions tracking**
   - Decision: Keep storing "jee-physics" for user context? Or switch to shared?
   - Recommendation: Store BOTH for backwards compatibility
   
### Phase 7: Migrate Historical quiz_sessions Data
**Two options:**

**Option A: Keep quiz_sessions as-is (RECOMMENDED)**
- Advantage: No data migration needed
- Advantage: Preserves user history exactly as it was
- Disadvantage: Subject IDs don't match dimensional model
- Solution: Add transformation layer in queries

**Option B: Migrate quiz_sessions to shared subjects**
```sql
UPDATE quiz_sessions
SET subject_id = CASE
  WHEN subject_id LIKE '%-physics' THEN 'physics'
  WHEN subject_id LIKE '%-chemistry' THEN 'chemistry'
  WHEN subject_id LIKE '%-maths' THEN 'mathematics'
  -- ... etc
  ELSE subject_id
END;
```
- Risk: Loses exam context (was it JEE Physics or NEET Physics?)
- Not recommended unless we add exam_id awareness

**Decision:** Option A - Keep quiz_sessions with exam-prefixed subjects, add transformation layer.

### Phase 8: Verify Migration
**Verification Queries:**

```sql
-- 1. Check all exams have subjects mapped
SELECT 
  e.exam_code,
  COUNT(DISTINCT b.subject_id) as subject_count
FROM dim_exams e
LEFT JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
GROUP BY e.exam_code
HAVING COUNT(DISTINCT b.subject_id) = 0;
-- Should return 0 rows

-- 2. Check all subjects are shared (no exam prefix)
SELECT subject_code 
FROM dim_subjects 
WHERE subject_code LIKE '%-physics' 
   OR subject_code LIKE '%-chemistry'
   OR subject_code LIKE '%-maths';
-- Should return 0 rows after cleanup

-- 3. Check question counts
SELECT 
  s.subject_code,
  t.topic_name,
  COUNT(q.id) as question_count
FROM fact_exam_questions q
JOIN dim_topics t ON q.topic_id = t.id
JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
JOIN dim_subjects s ON b.subject_id = s.id
GROUP BY s.subject_code, t.topic_name
ORDER BY question_count DESC
LIMIT 20;
-- Should show shared subjects with high question counts

-- 4. Verify JEE and NEET share same physics questions
SELECT 
  e1.exam_code as exam1,
  e2.exam_code as exam2,
  s.subject_code,
  COUNT(DISTINCT b1.topic_id) as shared_topics
FROM bridge_exam_subject_topic b1
JOIN bridge_exam_subject_topic b2 ON b1.subject_id = b2.subject_id AND b1.topic_id = b2.topic_id
JOIN dim_exams e1 ON b1.exam_id = e1.id
JOIN dim_exams e2 ON b2.exam_id = e2.id
JOIN dim_subjects s ON b1.subject_id = s.id
WHERE e1.exam_code = 'jee-main' 
  AND e2.exam_code = 'neet'
  AND s.subject_code = 'physics'
GROUP BY e1.exam_code, e2.exam_code, s.subject_code;
-- Should return > 0 shared topics
```

---

## Migration Steps (Ordered)

### Step 1: Backup Database ⚠️
```sql
-- Export current state
pg_dump -h [HOST] -U postgres -d postgres > backup_before_migration.sql
```

### Step 2: Run Analysis Queries (Need from User)
```sql
-- A. List all current subject_codes
SELECT DISTINCT subject_code FROM dim_subjects ORDER BY subject_code;

-- B. Check if topics are duplicated per exam
SELECT 
  t.topic_name,
  COUNT(DISTINCT b.exam_id) as exam_count,
  COUNT(DISTINCT t.id) as topic_id_count
FROM dim_topics t
JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
GROUP BY t.topic_name
HAVING COUNT(DISTINCT t.id) > 1
ORDER BY topic_id_count DESC
LIMIT 20;
-- If topic_id_count > 1, topics are duplicated (bad!)

-- C. Map each exam-subject to how many topics it has
SELECT 
  e.exam_code,
  s.subject_code,
  COUNT(b.topic_id) as topic_count
FROM bridge_exam_subject_topic b
JOIN dim_exams e ON b.exam_id = e.id
JOIN dim_subjects s ON b.subject_id = s.id
GROUP BY e.exam_code, s.subject_code
ORDER BY e.exam_code, s.subject_code;
```

### Step 3: Create Subject Mapping Table (Temporary)
```sql
CREATE TABLE IF NOT EXISTS subject_migration_map (
  old_subject_code TEXT PRIMARY KEY,
  new_subject_code TEXT NOT NULL,
  old_subject_id INTEGER,
  new_subject_id INTEGER
);

-- Insert mappings (need to generate based on analysis)
INSERT INTO subject_migration_map (old_subject_code, new_subject_code)
VALUES
  ('jee-physics', 'physics'),
  ('jee-chemistry', 'chemistry'),
  ('jee-maths', 'mathematics'),
  -- ... etc (need full list)
;
```

### Step 4: Create Shared Subjects
```sql
-- Insert shared subjects (Step 4 SQL from above)
```

### Step 5: Update Bridge Table
```sql
-- Insert new bridge entries (Step 5 SQL from above)
```

### Step 6: Verify Bridge Table
```sql
-- Check that all exams still have their subjects/topics
-- Run verification queries from Step 8
```

### Step 7: Update Code (All Files)
- Update db.ts functions
- Update quiz-generator.ts
- Update API routes
- Update frontend

### Step 8: Test Thoroughly
- Generate quiz for JEE Physics → Should work
- Generate quiz for NEET Physics → Should work
- Verify both use same questions from shared topics
- Check user stats still load correctly
- Check study content still works

### Step 9: Cleanup Old Data (AFTER TESTING)
```sql
-- Delete old bridge entries (only after new ones verified)
DELETE FROM bridge_exam_subject_topic
WHERE subject_id IN (
  SELECT id FROM dim_subjects 
  WHERE subject_code LIKE '%-physics' 
     OR subject_code LIKE '%-chemistry'
     OR subject_code LIKE '%-maths'
);

-- Delete old subjects (only after all references removed)
DELETE FROM dim_subjects
WHERE subject_code LIKE '%-physics' 
   OR subject_code LIKE '%-chemistry'
   OR subject_code LIKE '%-maths';
```

---

## Rollback Plan

**If migration fails:**

```sql
-- 1. Restore from backup
psql -h [HOST] -U postgres -d postgres < backup_before_migration.sql

-- 2. Or manually revert:
-- Delete new bridge entries
DELETE FROM bridge_exam_subject_topic
WHERE subject_id IN (
  SELECT id FROM dim_subjects WHERE subject_code NOT LIKE '%-%'
);

-- Delete new shared subjects
DELETE FROM dim_subjects WHERE subject_code NOT LIKE '%-%';
```

---

## Next Steps

**IMMEDIATE:** User needs to run Step 2 analysis queries and share results, so we can:
1. Build complete subject mapping table
2. Verify if topics are already shared or need merging
3. Generate exact migration SQL

Once analysis is complete, I'll create:
1. Final migration SQL script
2. Code update patches
3. Testing checklist
