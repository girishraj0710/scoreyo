# 🎯 Retry Consistency Implementation

## Problem
When students fail a level (score < 60%/70%), questions keep changing on every retry, making it impossible for struggling students to progress. This defeats the learning goal.

## Solution
**Question Caching System for Levels**: Same questions until they pass, then fresh questions.

---

## How It Works

### 1. **First Attempt**
- Student starts Level 5
- System generates 10 questions (verified → cached → AI)
- Questions are saved to `level_question_cache` table
- `is_passed = 0` (not passed yet)

### 2. **Failed Attempt (< 60% accuracy)**
- Student scores 45% → Level not unlocked
- "Next level locked! Score 60%+ to unlock" message shown
- Question cache remains with `is_passed = 0`

### 3. **Retry After Failure**
- Student clicks "Replay"
- System checks `level_question_cache` for this user + level
- Finds cached questions with `is_passed = 0`
- **Returns THE SAME 10 questions** (no regeneration)
- Message: "Same questions for retry - master these to unlock next level!"

### 4. **Passed Attempt (≥ 60%)**
- Student scores 65% → Level unlocked!
- System marks `is_passed = 1` in cache
- Calls `PUT /api/quiz/level` to mark level as passed

### 5. **Future Attempts (After Passing)**
- Student wants to improve from 2 stars to 3 stars
- System checks cache, sees `is_passed = 1`
- **Generates FRESH questions** (treated as new attempt)

---

## Database Changes

### New Table: `level_question_cache`
```sql
CREATE TABLE level_question_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  level_number INTEGER NOT NULL,
  questions_json TEXT NOT NULL,  -- Serialized array of questions
  is_passed INTEGER DEFAULT 0,   -- 0 = failed, 1 = passed
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, exam_id, subject_id, level_number)
);
```

### New Functions in `src/lib/db.ts`
- `getLevelQuestionCache(userId, examId, subjectId, levelNumber)` - Get cached questions
- `saveLevelQuestionCache(userId, examId, subjectId, levelNumber, questions)` - Save questions on first attempt
- `markLevelPassed(userId, examId, subjectId, levelNumber)` - Mark as passed when they unlock next level
- `clearLevelQuestionCache(userId, examId, subjectId, levelNumber)` - Optional: delete cache entry

---

## API Changes

### New Route: `/api/quiz/level`

#### POST - Generate Level Quiz
```typescript
POST /api/quiz/level
Body: {
  examId: string,
  subjectId: string,
  levelNumber: number,
  topic: string,
  numberOfQuestions: number,
  difficulty: string
}

Response (First Attempt):
{
  sessionId: string,
  questions: [...],
  isRetry: false,
  meta: { verifiedCount, cachedCount, aiCount }
}

Response (Retry):
{
  sessionId: string,
  questions: [...],  // SAME questions
  isRetry: true,
  meta: { message: "Same questions for retry - master these to unlock next level!" }
}
```

#### PUT - Mark Level Passed
```typescript
PUT /api/quiz/level
Body: {
  examId: string,
  subjectId: string,
  levelNumber: number
}

Response:
{ success: true }
```

---

## Frontend Changes

### `src/app/quiz/page.tsx`

#### 1. Quiz Generation
```typescript
// OLD: Always used /api/quiz
const res = await fetch("/api/quiz", { ... });

// NEW: Use /api/quiz/level for level mode
const apiEndpoint = isLevelMode ? "/api/quiz/level" : "/api/quiz";
const requestBody = isLevelMode
  ? { examId, subjectId, levelNumber, topic, numberOfQuestions, difficulty }
  : { examId, subjectId, topic, numberOfQuestions, difficulty };

const res = await fetch(apiEndpoint, { ... });
```

#### 2. Submit & Mark Passed
```typescript
// After completing level successfully
if (levelData.nextLevelUnlocked) {
  // Mark as passed - clears cache for future attempts
  await fetch("/api/quiz/level", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      examId: quizData.examId,
      subjectId: quizData.subjectId,
      levelNumber,
    }),
  });
}
```

---

## User Experience Flow

### Scenario 1: Student Struggling with Level 3

1. **Attempt 1**: Gets 10 questions, scores 40% ❌
   - "Next level locked! Score 60%+ to unlock"
   - Questions cached

2. **Attempt 2**: SAME 10 questions, scores 50% ❌
   - Still locked
   - Questions remain cached

3. **Attempt 3**: SAME 10 questions, scores 65% ✅
   - Level 4 unlocked! 🎉
   - Questions marked as passed

4. **Attempt 4** (wants 3 stars): NEW 10 questions, scores 95% ⭐⭐⭐
   - Perfect!

### Scenario 2: Student Retrying for Better Stars

1. **Attempt 1**: Scores 75% → 2 stars ⭐⭐ (passed, level unlocked)
2. **Attempt 2**: FRESH questions → scores 90% → 3 stars ⭐⭐⭐

---

## Benefits

✅ **Struggling students can progress** - Master the same questions instead of endless new ones  
✅ **Learning-focused** - Retry consistency encourages understanding  
✅ **Fair difficulty** - No RNG frustration from constantly changing questions  
✅ **Still challenging** - Once passed, new questions for star improvement  
✅ **No database bloat** - One cache entry per user+level (UNIQUE constraint)  

---

## Edge Cases Handled

### 1. What if they pass on first try?
- Questions cached with `is_passed = 0` initially
- On submit, if passed → immediately marked `is_passed = 1`
- Next attempt gets fresh questions

### 2. What if they abandon and return days later?
- Cache persists (no expiry)
- They'll get the same questions when they return
- Once passed, cache is marked and future attempts are fresh

### 3. What if they want to replay after passing?
- System checks `is_passed = 1`
- Generates fresh questions (like a new attempt)

### 4. Can they "game" the system?
- No - memorizing questions to pass IS the learning goal
- Once passed, new questions test if they truly understood

---

## Testing Checklist

- [ ] First attempt: Questions generated and cached
- [ ] Failed retry: Same questions returned
- [ ] Multiple failed retries: Still same questions
- [ ] Pass on retry: Next level unlocks, cache marked passed
- [ ] Replay after passing: Fresh questions generated
- [ ] Boss level: 70% threshold works correctly
- [ ] Normal level: 60% threshold works correctly
- [ ] Different users: Separate caches (no collision)

---

## Implementation Status

✅ Database table created  
✅ Database functions added  
✅ `/api/quiz/level` POST endpoint  
✅ `/api/quiz/level` PUT endpoint  
✅ Frontend quiz generation updated  
✅ Frontend submit logic updated  
✅ Level completion modal already has failure messaging  

**Ready to test!** 🚀
