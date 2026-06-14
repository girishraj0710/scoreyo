# ✅ Database Validation & Migration - Step by Step Guide

**Date:** June 14, 2026  
**Status:** Ready to validate and execute

---

## 🎯 What You Need to Do

Since I cannot directly connect to your Supabase database, **you** need to run the validation queries and then execute the migration. This guide walks you through it step by step.

---

## 📋 Step 1: Validate Your Database (5 minutes)

### Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard/project/zomcofptwlumqkeffbht
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Run Validation Queries

Open the file `VALIDATION-QUERIES.sql` from your repository and run each section one by one.

**What to check:**

✅ **Section 1:** All 5 dimensional tables exist  
✅ **Section 2:** You have exam-specific subjects (like "jee-physics")  
✅ **Section 3:** You have questions, topics, and exams  
✅ **Section 4:** JEE and NEET currently have SEPARATE physics subjects  
✅ **Section 5:** Migration NOT yet run (should be `false`)  
✅ **Section 6:** List all your exam-specific subjects  
✅ **Section 10:** Final safety check - all should show ✅ PASS  

**If anything fails, STOP and share the error with me.**

---

## 📊 Step 2: Review What Will Happen

Run **Section 9** from `VALIDATION-QUERIES.sql`:

```sql
-- Shows: current subject → what it will map to → which exams use it
```

**Example output you should see:**
```
jee-physics       → physics              → jee-main
neet-physics      → physics              → neet
kcet-physics      → physics              → kcet
cat-quant         → quantitative-aptitude → cat
ssc-quant         → quantitative-aptitude → ssc-cgl, ssc-chsl
```

This preview shows you exactly how subjects will be merged.

---

## 🚀 Step 3: Wait for Vercel Deployment

Before running the SQL, ensure the code changes are deployed:

1. Go to https://vercel.com/girishraj0710/prepgenie/deployments
2. Wait for the latest deployment to show "Ready" (green checkmark)
3. Click the deployment URL
4. Test: Try to generate a **JEE Main Physics** quiz
5. If it works → Code is live, proceed!

---

## 🗄️ Step 4: Run the Migration SQL

### Open the Migration File

1. Open **`migration-dimensional-model.sql`** from your Desktop (36 KB file)
2. Copy the ENTIRE file contents

### Execute in Supabase

1. Go back to Supabase SQL Editor
2. Create a **New Query**
3. Paste the entire migration SQL
4. Click **Run**

### What Should Happen

The SQL will execute in ~5-10 seconds. You should see output like:

```
BEGIN
INSERT 0 52     -- Created 52 shared subjects
INSERT 0 295    -- Created 295 mappings
INSERT 0 1500   -- Created new bridge entries
COMMIT
```

Plus several verification queries showing:
- Exam counts per shared subject
- Topic counts
- Confirmation that JEE and NEET now share physics

**If you see any errors, STOP immediately and share them with me.**

---

## ✅ Step 5: Verify the Migration Worked

Run these quick checks in Supabase SQL Editor:

### Check 1: Shared subjects exist
```sql
SELECT COUNT(*) FROM dim_subjects WHERE subject_code NOT LIKE '%-%';
-- Should return 52
```

### Check 2: JEE and NEET share physics
```sql
SELECT
  e.exam_code,
  s.subject_code,
  COUNT(DISTINCT t.id) as shared_topics
FROM bridge_exam_subject_topic b
JOIN dim_exams e ON b.exam_id = e.id
JOIN dim_subjects s ON b.subject_id = s.id
JOIN dim_topics t ON b.topic_id = t.id
WHERE e.exam_code IN ('jee-main', 'neet')
  AND s.subject_code = 'physics'
GROUP BY e.exam_code, s.subject_code;
```

**Expected:**
```
jee-main | physics | 15
neet     | physics | 15
```

Both now use the SAME "physics" subject with the SAME topics! 🎉

### Check 3: Question counts increased
```sql
-- Count questions for shared physics
SELECT COUNT(*) FROM fact_exam_questions q
JOIN dim_topics t ON q.topic_id = t.id
JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
JOIN dim_subjects s ON b.subject_id = s.id
WHERE s.subject_code = 'physics';

-- This should be HIGHER than before (merged from jee-physics + neet-physics + others)
```

---

## 🧪 Step 6: Test Quiz Generation

Go to your live site: https://krakkify.in

1. **Test JEE Main Physics** → Generate a quiz → Should work ✅
2. **Test NEET Physics** → Generate a quiz → Should work ✅
3. **Test Study Content** → Click "Study First" → Should work ✅
4. Check dashboard → Your stats should still be correct ✅

---

## 🎉 Success Criteria

After migration, you should see:

✅ Quiz generation works for all exams  
✅ Study content works  
✅ JEE and NEET share the same physics questions  
✅ All 50+ exams have their subjects properly mapped  
✅ No errors in Vercel logs  
✅ No errors in Supabase logs  

---

## 🚨 If Something Breaks

### Option 1: Revert the Code
```bash
git revert HEAD
git push origin main
```

### Option 2: Revert the Database

Run this in Supabase SQL Editor:

```sql
BEGIN;

-- Delete new bridge entries (shared subjects)
DELETE FROM bridge_exam_subject_topic
WHERE subject_id IN (
  SELECT id FROM dim_subjects
  WHERE subject_code NOT LIKE '%-%'
);

-- Delete shared subjects
DELETE FROM dim_subjects
WHERE subject_code IN (SELECT new_subject_code FROM subject_migration_map);

-- Drop mapping table
DROP TABLE subject_migration_map;

COMMIT;
```

This will restore your database to the pre-migration state.

---

## 📞 Questions?

If you encounter ANY issues during validation or migration:

1. **Take a screenshot** of the error
2. **Share the SQL output** from Supabase
3. **Check Vercel deployment logs** for any errors
4. **Don't panic** - we have rollback options!

---

## 📚 What Happens After Migration?

**Immediate effects:**
- JEE, NEET, KCET, KEAM, WBJEE, etc. all share the same physics questions
- CAT, XAT, SSC, Banking, Railways all share quantitative aptitude questions
- All 50+ exams benefit from shared question pools

**Long-term benefits:**
- Adding questions to "physics" benefits 15+ exams instantly
- Creating study content for "mathematics" works for 30+ exams
- Your question bank grows exponentially faster

**Old data:**
- User quiz sessions still reference "jee-physics" (backward compatible)
- Old bridge entries remain (safe - can delete after 1 week of testing)
- Old exam-specific subjects remain (safe - can delete after 1 week)

---

## 🎯 Ready?

1. ✅ Open Supabase SQL Editor
2. ✅ Run validation queries
3. ✅ Verify Vercel deployment is live
4. ✅ Execute migration SQL
5. ✅ Verify migration worked
6. ✅ Test quiz generation

**You've got this!** 🚀

If you need me at any step, just share the output/error and I'll guide you through it.
