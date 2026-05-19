# Phase 5: Implementation Plan - File by File

**Date**: May 19, 2026  
**Status**: Phase 4 at 18.4% (in progress)  
**Goal**: Update all application code to use dimensional model

---

## 📋 Files to Update (11 files)

### Priority 1: Core Database Functions (CRITICAL)
1. ✅ `src/lib/db.ts` - Export queryOne/queryAll (DONE)
2. 🔄 `src/lib/db.ts` - Update getExamQuestions() function
3. 🔄 `src/lib/db.ts` - Update table creation (schema initialization)

### Priority 2: API Routes (HIGH)
4. `src/app/api/quiz/route.ts` - Uses getExamQuestions()
5. `src/app/api/mock-test/route.ts` - Uses getExamQuestions()
6. `src/app/api/admin/analytics/route.ts` - Analytics queries
7. `src/app/api/admin/questions/route.ts` - Question management
8. `src/app/api/report-question/route.ts` - Report question lookup

### Priority 3: Background Jobs (MEDIUM)
9. `src/app/api/cron/prewarm-cache/route.ts` - Cache warming
10. `src/app/api/cron/promote-questions/route.ts` - Question promotion

### Priority 4: Helper Libraries (LOW)
11. `src/lib/dynamic-mock-test-config.ts` - Mock test config
12. `src/lib/dynamic-mock-test-generator.ts` - Mock test generation
13. `src/lib/question-bank.ts` - Question bank (mostly comments)

---

## 🔧 Detailed Changes

### 1. ✅ src/lib/db.ts - Export Helpers (DONE)

**Status**: ✅ Complete

**Changes made**:
```typescript
// Line 476: Changed from 'async function' to 'export async function'
export async function queryOne(sql: string, args: any[] = []): Promise<any | undefined>

// Line 490: Changed from 'async function' to 'export async function'  
export async function queryAll(sql: string, args: any[] = []): Promise<any[]>
```

---

### 2. 🔄 src/lib/db.ts - Update getExamQuestions()

**Location**: Lines 1428-1524

**Current Implementation**: Queries `exam_questions` directly

**New Implementation**: Two options

#### Option A: Replace with dimensional queries (RECOMMENDED)
```typescript
export async function getExamQuestions(
  examId: string,
  subjectId: string,
  topic: string,
  difficulty: string = "mixed",
  limit: number = 10
) {
  // Use dimensional model queries
  return getExamQuestionsDimensional(examId, subjectId, topic, difficulty, limit);
}
```

#### Option B: Dual-read for validation
```typescript
export async function getExamQuestions(
  examId: string,
  subjectId: string,
  topic: string,
  difficulty: string = "mixed",
  limit: number = 10
) {
  // Feature flag for gradual rollout
  const useDimensional = process.env.USE_DIMENSIONAL_MODEL === 'true';

  if (useDimensional) {
    return getExamQuestionsDimensional(examId, subjectId, topic, difficulty, limit);
  }

  // Old implementation (fallback)
  let rows: any[];
  // ... existing code ...
}
```

**Recommendation**: Use Option B for safety

---

### 3. 🔄 src/lib/db.ts - Update Schema Initialization

**Location**: Lines 248-262

**Current Code**:
```typescript
CREATE TABLE IF NOT EXISTS exam_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
  source TEXT DEFAULT 'verified',
  valid_from INTEGER DEFAULT 2024,
  valid_until INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Action**: KEEP AS IS (for now)
- Old table stays active during transition
- Both tables co-exist
- Drop after full cutover

**Add dimensional table initialization**:
```typescript
// Add after exam_questions table creation
CREATE TABLE IF NOT EXISTS dim_exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_code TEXT NOT NULL UNIQUE,
  exam_name TEXT NOT NULL,
  category TEXT,
  conducting_body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dim_subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_code TEXT NOT NULL UNIQUE,
  subject_name TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dim_topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  scope TEXT NOT NULL CHECK(scope IN ('universal', 'state-specific', 'exam-specific')),
  parent_topic_id INTEGER,
  description TEXT,
  keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_topic_id) REFERENCES dim_topics(id)
);

CREATE TABLE IF NOT EXISTS bridge_exam_subject_topic (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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

CREATE TABLE IF NOT EXISTS fact_exam_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_question 
  ON fact_exam_questions(topic_id, substr(question, 1, 100));
CREATE INDEX IF NOT EXISTS idx_fact_topic ON fact_exam_questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_fact_difficulty ON fact_exam_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_bridge_exam ON bridge_exam_subject_topic(exam_id);
CREATE INDEX IF NOT EXISTS idx_bridge_topic ON bridge_exam_subject_topic(topic_id);
```

---

### 4. src/app/api/quiz/route.ts

**Current**: Uses `getExamQuestions()` 

**Change**: NO CHANGE NEEDED
- Function signature stays same
- Internal implementation handles dimensional model
- Response format unchanged

**Verification**:
```bash
# Test after update
curl "http://localhost:3000/api/quiz?exam=jee-main&subject=jee-maths&topic=Algebra"
```

---

### 5. src/app/api/mock-test/route.ts

**Current**: Uses `getExamQuestions()`

**Change**: NO CHANGE NEEDED
- Same as quiz route
- Function handles it internally

**Comments to update** (lines 286, 320):
```typescript
// OLD:
// Tier 1: verified DB pool (exam_questions) + AI cache pool

// NEW:
// Tier 1: verified DB pool (fact_exam_questions via bridge) + AI cache pool
```

---

### 6. src/app/api/admin/analytics/route.ts

**Current Queries** (lines 36, 42, 51):
```typescript
// Line 36: Total questions
SELECT COUNT(*) as count FROM exam_questions

// Line 42: Questions by exam
SELECT exam_id, COUNT(*) as count FROM exam_questions GROUP BY exam_id

// Line 51: Questions by source
SELECT source, COUNT(*) as count FROM exam_questions GROUP BY source
```

**New Queries**:
```typescript
// Total questions
SELECT COUNT(*) as count FROM fact_exam_questions

// Questions by exam (via bridge)
SELECT e.exam_code, e.exam_name, COUNT(DISTINCT q.id) as count
FROM dim_exams e
JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
JOIN fact_exam_questions q ON b.topic_id = q.topic_id
GROUP BY e.id
ORDER BY count DESC

// Questions by source
SELECT source, COUNT(*) as count FROM fact_exam_questions 
GROUP BY source ORDER BY count DESC
```

**Topic Breakdown** (already updated in previous commit):
```typescript
// Shows shared topics across exams
SELECT 
  t.topic_name as topic,
  t.scope,
  COUNT(DISTINCT q.id) as question_count,
  COUNT(DISTINCT b.exam_id) as exam_count,
  GROUP_CONCAT(DISTINCT q.source) as sources,
  GROUP_CONCAT(DISTINCT q.difficulty) as difficulties
FROM dim_topics t
LEFT JOIN fact_exam_questions q ON t.id = q.topic_id
LEFT JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
GROUP BY t.id
ORDER BY question_count ASC, t.topic_name
```

---

### 7. src/app/api/admin/questions/route.ts

**Current Usage** (lines 66, 211):

**Line 66**: JOIN with reported_questions
```typescript
// OLD:
LEFT JOIN exam_questions eq ON qr.question_id = eq.id

// NEW:
LEFT JOIN fact_exam_questions eq ON qr.question_id = eq.id
```

**Line 211**: Update question
```typescript
// OLD:
UPDATE exam_questions SET ${updates} WHERE id = ?

// NEW:
UPDATE fact_exam_questions SET ${updates} WHERE id = ?
```

**Note**: `question_id` foreign key needs update
- Check if `reported_questions.question_id` references old table
- Update schema if needed

---

### 8. src/app/api/report-question/route.ts

**Current Usage** (line 96):
```typescript
// OLD:
LEFT JOIN exam_questions eq ON qr.question_id = eq.id

// NEW:
LEFT JOIN fact_exam_questions eq ON qr.question_id = eq.id
```

**Question ID Resolution**:
- Old: question_id referenced exam_questions.id
- New: question_id references fact_exam_questions.id
- Must be consistent across system

---

### 9. src/app/api/cron/prewarm-cache/route.ts

**Current Usage** (line 97):
```typescript
loadCounts("exam_questions")
```

**Change**:
```typescript
// Keep both for now (during transition)
const oldCounts = await loadCounts("exam_questions");
const newCounts = await loadCounts("fact_exam_questions");

console.log(`Cache warming: old=${oldCounts}, new=${newCounts}`);
```

**After full cutover**:
```typescript
loadCounts("fact_exam_questions")
```

---

### 10. src/app/api/cron/promote-questions/route.ts

**Purpose**: Promote cached_questions → exam_questions

**Change**: Target both tables during transition
```typescript
// Promote to OLD table (for backward compatibility)
INSERT INTO exam_questions (...)

// ALSO promote to NEW table (with topic_id lookup)
INSERT INTO fact_exam_questions (topic_id, question, options, ...)
SELECT 
  (SELECT id FROM dim_topics WHERE topic_name = ?),
  question, options, ...
FROM cached_questions
WHERE ...
```

**After full cutover**: Only insert to fact_exam_questions

---

### 11. src/lib/dynamic-mock-test-config.ts

**Current Query** (line 20):
```typescript
SELECT COUNT(*) as count FROM exam_questions WHERE exam_id = ?
```

**New Query**:
```typescript
// Count questions available via bridge
SELECT COUNT(DISTINCT q.id) as count
FROM fact_exam_questions q
JOIN bridge_exam_subject_topic b ON q.topic_id = b.topic_id
WHERE b.exam_id = (SELECT id FROM dim_exams WHERE exam_code = ?)
```

---

### 12. src/lib/dynamic-mock-test-generator.ts

**Current**: Comments mention exam_questions (line 326)

**Change**: Update comments only
```typescript
// OLD:
// 1) exam_questions (verified bank — seeded from in-memory + promoted

// NEW:
// 1) fact_exam_questions (verified bank — seeded + shared across exams)
```

---

### 13. src/lib/question-bank.ts

**Current**: Comment about insertion (line 4311)

**Change**: Update comment
```typescript
// OLD:
// insertion into the `exam_questions` Turso table

// NEW:
// insertion into the `fact_exam_questions` Turso table (via normalized topics)
```

---

## 🎯 Implementation Strategy

### Phase 5a: Preparation (DONE)
- ✅ Export queryOne/queryAll
- ✅ Create db-dimensional.ts
- ✅ Create test endpoint
- ✅ Validate approach works

### Phase 5b: Core Function Update (NEXT)
1. Update `getExamQuestions()` with feature flag
2. Add dimensional table initialization to schema
3. Test locally with both modes

### Phase 5c: Analytics & Admin (AFTER 5b)
1. Update admin analytics queries
2. Update question management
3. Update report system

### Phase 5d: Background Jobs (AFTER 5c)
1. Update cron jobs
2. Update question promotion
3. Update cache warming

### Phase 5e: Helper Libraries (LAST)
1. Update configs
2. Update comments
3. Documentation

---

## 🧪 Testing Checklist

### Before Deployment:
- [ ] Test quiz generation (10 different exam-topic combos)
- [ ] Test mock test generation (5 exams)
- [ ] Test admin analytics (verify counts match)
- [ ] Test question reporting
- [ ] Test cron jobs
- [ ] Load test (100 concurrent quiz requests)

### After Deployment (Dual-Read):
- [ ] Monitor error rates
- [ ] Compare old vs new results
- [ ] Check performance metrics
- [ ] Verify question quality

### Gradual Rollout:
- [ ] Week 1: Feature flag OFF (dual-read only)
- [ ] Week 2: 10% users with flag ON
- [ ] Week 3: 50% users with flag ON
- [ ] Week 4: 100% users with flag ON
- [ ] Week 5: Remove old table

---

## 🚦 Feature Flag Implementation

### Environment Variable:
```bash
# .env.local
USE_DIMENSIONAL_MODEL=false  # Start with false
```

### Usage in code:
```typescript
const useDimensional = process.env.USE_DIMENSIONAL_MODEL === 'true';

if (useDimensional) {
  // New dimensional queries
} else {
  // Old exam_questions queries
}
```

### Gradual Rollout:
```typescript
// Percentage-based rollout
const rolloutPercentage = parseInt(process.env.DIMENSIONAL_ROLLOUT_PERCENT || '0');
const userHash = hashUserId(userId);
const useDimensional = (userHash % 100) < rolloutPercentage;
```

---

## 📈 Success Metrics

### Performance:
- Query time: Target 50% faster (validated: 58% faster ✅)
- Error rate: <0.1% increase
- API latency: p95 <500ms

### Quality:
- Question pool size: 3-7x increase (validated: 6-27x ✅)
- Quiz variety: No repeated questions in 10 quizzes
- User satisfaction: No complaints about repetition

### Migration:
- Zero data loss
- Zero downtime
- Gradual rollout: 4 weeks
- Old table dropped: Week 5

---

## 📝 Implementation Timeline

### Week 1 (Current): Migration & Testing
- ✅ Day 1: Phase 1-2 complete
- 🔄 Day 1: Phase 4 in progress (18.4%)
- 📋 Day 2: Phase 5b (core function update)
- 🧪 Day 3-5: Testing & validation

### Week 2: Deployment with Dual-Read
- Deploy with feature flag OFF
- Both queries run, compare results
- Log discrepancies
- Monitor performance

### Week 3: Gradual Rollout
- 10% rollout (Monday)
- 25% rollout (Wednesday)
- 50% rollout (Friday)
- Monitor & adjust

### Week 4: Full Cutover
- 75% rollout (Monday)
- 90% rollout (Wednesday)  
- 100% rollout (Friday)
- Remove feature flag

### Week 5: Cleanup
- Drop old `exam_questions` table
- Remove old code paths
- Update documentation
- Celebrate! 🎉

---

**Status**: Ready for Phase 5b implementation once Phase 4 completes  
**Next Action**: Update getExamQuestions() with feature flag  
**ETA**: Phase 4 complete in ~30 minutes

