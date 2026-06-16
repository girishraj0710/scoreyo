# Fix Incomplete Questions in Database

**Issue:** Some English grammar questions are incomplete (e.g., just showing "hard" without full question text).

**Example of incomplete question:**
- Question text: "hard"
- Actual question: "Which adverb modifies another adverb?"
- Missing: The sentence to analyze

---

## Quick Fix (Recommended)

### Option 1: Run SQL Script in Supabase Dashboard

1. **Open Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor
   ```

2. **Go to SQL Editor** (left sidebar)

3. **Copy and paste** the queries from `scripts/find-and-delete-incomplete-questions.sql`

4. **Step 1 - Review First (IMPORTANT):**
   - Uncomment the SELECT query (remove `--` at the start of lines)
   - Run it to see which questions will be deleted
   - Review the results carefully

5. **Step 2 - Delete:**
   - Once satisfied, run the DELETE query
   - This removes all incomplete questions

6. **Step 3 - Verify:**
   - Run the verification queries
   - Should show count of remaining questions

---

## What Gets Deleted?

Questions will be removed if they have ANY of these issues:

1. **Very short question text** (< 20 characters)
   - Example: "hard" (4 chars)

2. **Missing options** (NULL or less than 4 options)
   - MCQs must have 4 options

3. **Missing explanation** (NULL or empty string)
   - Every question needs an explanation

4. **Single word questions** (no spaces)
   - Example: "hard" → clearly incomplete

5. **Placeholders not filled**
   - Contains `[sentence]` or similar brackets
   - Contains `____` (blanks)

---

## Expected Results

**Before cleanup:**
- ~530 English questions total
- Unknown number incomplete

**After cleanup:**
- All questions complete and usable
- Each question has:
  - ✅ Full question text (>= 20 chars)
  - ✅ 4 options
  - ✅ Correct answer
  - ✅ Explanation

---

## Manual SQL Commands

If you want to run commands directly in terminal:

```bash
# Find incomplete questions (review first)
psql $POSTGRES_URL -c "
SELECT id, topic_id, question, LENGTH(question) as len
FROM english_questions
WHERE LENGTH(question) < 20
LIMIT 10;
"

# Delete incomplete questions
psql $POSTGRES_URL -c "
DELETE FROM english_questions
WHERE
  LENGTH(question) < 20
  OR options IS NULL
  OR jsonb_array_length(options) < 4
  OR explanation IS NULL
  OR explanation = ''
  OR question !~ ' ';
"

# Verify
psql $POSTGRES_URL -c "
SELECT COUNT(*) as total
FROM english_questions;
"
```

---

## Alternative: Fix Instead of Delete

If you want to **fix** incomplete questions instead of deleting them:

1. **Export incomplete questions** to CSV:
   ```sql
   COPY (
     SELECT id, topic_id, question, options, correct_answer, explanation
     FROM english_questions
     WHERE LENGTH(question) < 20
   ) TO '/tmp/incomplete_questions.csv' WITH CSV HEADER;
   ```

2. **Manually edit** the CSV file to complete questions

3. **Update** database with fixed questions:
   ```sql
   UPDATE english_questions
   SET question = 'Fixed question text here...'
   WHERE id = 123;
   ```

**But this is VERY time-consuming** if you have many incomplete questions. Better to delete and regenerate.

---

## Regenerate Questions

After deleting incomplete questions, if some topics have too few questions:

1. Check question count by topic:
   ```sql
   SELECT topic_id, COUNT(*) as count
   FROM english_questions
   GROUP BY topic_id
   ORDER BY count ASC;
   ```

2. If any topic has < 10 questions, regenerate:
   - Use AI to generate new questions following the format in study materials
   - See `STUDY-CONTENT-GENERATION-CHECKLIST.md` for guidelines

---

## Testing After Cleanup

1. **Go to Learn English practice:**
   ```
   https://krakkify.in/english/foundation/parts-of-speech/practice?count=5
   ```

2. **Test each topic:**
   - All questions should be complete
   - All should have 4 options
   - All should have explanations

3. **If you see incomplete questions:**
   - Note the question ID
   - Check database directly
   - Delete or fix that specific question

---

## Prevention (Future Questions)

When generating new questions via AI:

1. **Validate format before inserting:**
   - Question text >= 20 chars
   - Exactly 4 options
   - Correct answer is one of the options
   - Explanation is not empty

2. **Use validation script:**
   ```typescript
   function validateQuestion(q: Question): boolean {
     if (q.question_text.length < 20) return false;
     if (!q.options || q.options.length !== 4) return false;
     if (!q.correct_answer) return false;
     if (!q.explanation || q.explanation.trim() === '') return false;
     if (!q.options.includes(q.correct_answer)) return false;
     return true;
   }
   ```

3. **Manual review:**
   - Review 10% of generated questions
   - Check for placeholders (`[sentence]`, `____`)
   - Verify questions make sense standalone

---

## Files Reference

- `scripts/find-and-delete-incomplete-questions.sql` - SQL queries to run
- `scripts/find-incomplete-questions.ts` - TypeScript script (requires node)
- This file - Complete guide

---

**Last Updated:** 2026-06-16  
**Status:** Ready to run  
**Estimated Impact:** Will delete 5-20% of incomplete questions (need to run query to confirm exact count)
