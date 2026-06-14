# Migration Execution Plan - Dimensional Model Fix
**Date:** June 14, 2026  
**Status:** READY TO EXECUTE

---

## ⚠️ CRITICAL: Do NOT Run SQL Yet!

We must update the **CODE FIRST**, then run the SQL migration.

**Why?** Because the SQL creates new shared subject mappings, but your code still expects exam-prefixed subjects. If we run SQL first, quiz generation will break!

---

## Execution Order

### ✅ Phase 1: Update Code (DO THIS FIRST)
### ⏳ Phase 2: Run SQL Migration (AFTER code is deployed)
### ⏳ Phase 3: Test & Verify
### ⏳ Phase 4: Cleanup Old Data (Optional, after 1 week)

---

## Phase 1: Code Updates Required

### File 1: `src/lib/subject-mapper.ts` (NEW FILE - Create This)

```typescript
/**
 * Subject Mapper - Maps exam-specific subjects to shared subjects
 * Used during migration from exam-prefixed subjects to shared subjects
 */

export const SUBJECT_MAP: Record<string, string> = {
  // JEE
  'jee-physics': 'physics',
  'jee-chemistry': 'chemistry',
  'jee-maths': 'mathematics',
  
  // NEET
  'neet-physics': 'physics',
  'neet-chemistry': 'chemistry',
  'neet-biology': 'biology',
  
  // CAT
  'cat-dilr': 'data-interpretation',
  'cat-quant': 'quantitative-aptitude',
  'cat-varc': 'verbal-ability',
  
  // Add all mappings from migration SQL...
  // (Copy from subject_migration_map VALUES)
};

/**
 * Convert exam-specific subject to shared subject
 * Example: "jee-physics" → "physics"
 */
export function toSharedSubject(examSubjectId: string): string {
  return SUBJECT_MAP[examSubjectId] || examSubjectId;
}

/**
 * Extract base subject from exam-specific ID
 * Example: "jee-physics" → "physics"
 * Fallback if not in map
 */
export function extractBaseSubject(examSubjectId: string): string {
  const mapped = SUBJECT_MAP[examSubjectId];
  if (mapped) return mapped;
  
  // Fallback: strip exam prefix
  return examSubjectId.replace(/^[a-z]+-/, '');
}
```

---

### File 2: `src/lib/db.ts` - Update `saveVerifiedQuestions()`

**Current code:** (around line 300-400)
```typescript
export async function saveVerifiedQuestions(
  examId: string,
  subjectId: string,
  topic: string,
  questions: any[]
) {
  // ... existing code ...
}
```

**Add at the top of the function:**
```typescript
import { toSharedSubject } from './subject-mapper';

export async function saveVerifiedQuestions(
  examId: string,
  subjectId: string,  // This comes as "jee-physics"
  topic: string,
  questions: any[]
) {
  const pool = getPool();
  
  // NEW: Convert to shared subject for database lookup
  const sharedSubject = toSharedSubject(subjectId);
  
  // Rest of the function uses `sharedSubject` instead of `subjectId`
  // when querying dim_subjects and bridge tables
  
  // Example query change:
  const subjectResult = await pool.query(
    `SELECT id FROM dim_subjects WHERE subject_code = $1`,
    [sharedSubject]  // Changed from subjectId
  );
  
  // ... rest stays the same ...
}
```

---

### File 3: `src/lib/quiz-generator.ts` - Update `generateQuiz()`

**Find where it queries for cached/verified questions** (around line 100-200):

**Add at top:**
```typescript
import { toSharedSubject } from './subject-mapper';
```

**Update query logic:**
```typescript
// When querying database for questions
const sharedSubject = toSharedSubject(subjectId);

// Use sharedSubject in all database queries
const cachedQuestions = await getCachedQuestions(
  examId, 
  sharedSubject,  // Changed
  topic, 
  count
);
```

---

### File 4: `src/app/api/quiz/route.ts` - Update Quiz API

**Add transformation before calling generateQuiz:**

```typescript
import { toSharedSubject } from '@/lib/subject-mapper';

export async function GET(request: NextRequest) {
  const examId = searchParams.get("examId");
  const subjectId = searchParams.get("subjectId");  // "jee-physics"
  const topic = searchParams.get("topic");
  
  // NEW: Keep original for session tracking, use shared for queries
  const sharedSubject = toSharedSubject(subjectId);
  
  // Generate quiz using shared subject
  const questions = await generateQuiz(
    examName,
    subjectName,
    topic,
    count,
    difficulty
  );
  
  // When saving session, keep ORIGINAL subjectId for user context
  await createQuizSession(
    sessionId,
    userId,
    examId,
    subjectId,  // Keep "jee-physics" here for user history
    topic,
    // ...
  );
  
  // ...
}
```

---

### File 5: `src/app/api/study-content/route.ts` - Already Correct! ✅

This file already expects shared subjects ("physics"), so no changes needed!

---

### File 6: `src/app/page.tsx` - Update Study First Button

**Current code** (line ~920):
```typescript
onClick={() => {
  const baseSubject = selectedSubject?.replace(/^(jee|neet|upsc|ssc|cat|gate|banking|cuet)-/, '') || '';
  const topicLower = selectedTopic?.toLowerCase() || '';
  window.location.href = `/study?exam=${selectedExam?.id}&subject=${baseSubject}&topic=${topicLower}&originalSubject=${selectedSubject}&originalTopic=${selectedTopic}`;
}}
```

**Update to use subject-mapper:**
```typescript
import { toSharedSubject } from '@/lib/subject-mapper';

onClick={() => {
  const sharedSubject = toSharedSubject(selectedSubject || '');
  const topicLower = selectedTopic?.toLowerCase() || '';
  window.location.href = `/study?exam=${selectedExam?.id}&subject=${sharedSubject}&topic=${topicLower}&originalSubject=${selectedSubject}&originalTopic=${selectedTopic}`;
}}
```

---

## Summary of Code Changes

| File | Change | Purpose |
|------|--------|---------|
| `src/lib/subject-mapper.ts` | NEW | Central mapping table |
| `src/lib/db.ts` | Update `saveVerifiedQuestions()` | Use shared subjects for DB queries |
| `src/lib/quiz-generator.ts` | Update `generateQuiz()` | Query shared subjects |
| `src/app/api/quiz/route.ts` | Transform before querying | Keep original for sessions |
| `src/app/page.tsx` | Update Study button | Use mapper instead of regex |

---

## Phase 2: Run SQL Migration

**After code is deployed and tested:**

1. **Backup database:**
```bash
pg_dump -h [HOST] -U postgres -d postgres > backup_$(date +%Y%m%d).sql
```

2. **Run migration SQL:**
```bash
psql -h [HOST] -U postgres -d postgres < migration-dimensional-model.sql
```

3. **Verify output** - Should show:
```
INSERT ... (shared subjects created)
INSERT ... (new bridge entries created)
SELECT ... (verification queries)
COMMIT
```

---

## Phase 3: Testing Checklist

### Test 1: Quiz Generation
- [ ] Generate JEE Physics quiz → Works
- [ ] Generate NEET Physics quiz → Works
- [ ] Verify both use SAME questions (shared pool)

### Test 2: Study Content
- [ ] View JEE Physics Thermodynamics study → Works
- [ ] View NEET Physics Thermodynamics study → Works (same content!)

### Test 3: User Stats
- [ ] Dashboard shows correct stats
- [ ] Topic mastery tracking works
- [ ] Historical sessions still display correctly

### Test 4: Cross-Exam Question Reuse
```sql
-- Verify JEE and NEET share physics questions
SELECT 
  e1.exam_code as exam1,
  e2.exam_code as exam2,
  COUNT(DISTINCT b1.topic_id) as shared_topics
FROM bridge_exam_subject_topic b1
JOIN bridge_exam_subject_topic b2 
  ON b1.subject_id = b2.subject_id 
  AND b1.topic_id = b2.topic_id
JOIN dim_exams e1 ON b1.exam_id = e1.id
JOIN dim_exams e2 ON b2.exam_id = e2.id
JOIN dim_subjects s ON b1.subject_id = s.id
WHERE e1.exam_code = 'jee-main'
  AND e2.exam_code = 'neet'
  AND s.subject_code = 'physics'
GROUP BY e1.exam_code, e2.exam_code;
```
Should return > 0 shared topics!

---

## Phase 4: Cleanup (After 1 Week)

**Only after confirming everything works for 1 week:**

Run Step 5 from `migration-dimensional-model.sql` (currently commented out):
- Deletes old bridge entries
- Deletes old exam-specific subjects
- Drops temporary mapping table

---

## Rollback Plan

### If Code Breaks:
```bash
git revert [commit-hash]
git push origin main
```

### If SQL Migration Fails:
```bash
psql -h [HOST] -U postgres -d postgres < backup_$(date +%Y%m%d).sql
```

### If Everything Breaks:
1. Restore database from backup
2. Revert code changes
3. Redeploy

---

## Next Steps

1. **Create `src/lib/subject-mapper.ts`** with complete mapping
2. **Update all 5 code files** as specified above
3. **Test locally** if possible
4. **Deploy code changes**
5. **Wait for successful deployment**
6. **Run SQL migration**
7. **Test thoroughly**
8. **Monitor for 1 week**
9. **Run cleanup SQL** (optional)

---

## Questions Before Starting?

- Do you want me to create all the code patches now?
- Should we do this in stages (JEE+NEET first, then others)?
- Do you have a staging environment to test on first?
