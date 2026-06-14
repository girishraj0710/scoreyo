# ✅ READY TO EXECUTE: Dimensional Model Migration

**Status:** Code changes pushed to GitHub (commit 6020f54)  
**Date:** June 14, 2026

---

## 📋 What We Just Did

✅ Created `src/lib/subject-mapper.ts` with 100+ subject mappings  
✅ Updated `src/lib/db.ts` - 3 functions now use shared subjects  
✅ Updated `src/app/page.tsx` - Study First button uses mapper  
✅ Committed and pushed to GitHub  
✅ Vercel will automatically deploy in ~2-3 minutes

---

## ⏳ WAIT FOR VERCEL DEPLOYMENT

**Before running SQL, you MUST wait for Vercel to deploy the code changes!**

1. Go to https://vercel.com/girishraj0710/prepgenie/deployments
2. Wait for "Building" → "Ready"
3. Click the deployment URL and test: Generate a JEE Physics quiz
4. If quiz works, proceed to SQL migration below

**Why wait?** If you run SQL first, the old code won't know how to query shared subjects and quiz generation will break!

---

## 🗄️ SQL Migration Steps

### Step 1: Backup Your Database

```bash
# Run this in your terminal (replace with your Supabase credentials)
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup_$(date +%Y%m%d_%H%M%S).sql
```

Or use Supabase Dashboard:
- Go to Database → Backups → Create Backup

---

### Step 2: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard/project/[YOUR-PROJECT]
2. Click "SQL Editor" in left sidebar
3. Click "New Query"

---

### Step 3: Copy and Run the Migration SQL

Copy the entire contents of `migration-dimensional-model.sql` into the SQL Editor and click "Run".

**What it does:**
1. Creates shared subjects (physics, chemistry, mathematics, etc.)
2. Creates mapping table to track old→new subjects
3. Creates new bridge entries pointing to shared subjects
4. Shows verification queries
5. Commits the transaction

**Expected output:**
```
INSERT 0 30  -- Created shared subjects
INSERT 0 100 -- Created subject mappings
INSERT 0 500 -- Created new bridge entries
SELECT ...   -- Verification queries showing exam counts
COMMIT
```

---

### Step 4: Verify the Migration

Run this query in Supabase SQL Editor:

```sql
-- Check that JEE and NEET now share physics questions
SELECT 
  e1.exam_code as jee,
  e2.exam_code as neet,
  s.subject_code,
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
GROUP BY e1.exam_code, e2.exam_code, s.subject_code;
```

**Expected result:**
```
jee-main | neet | physics | 10+
```

If you see a number > 0, the migration worked! JEE and NEET are now sharing physics topics.

---

### Step 5: Test in Production

1. Generate a **JEE Main Physics** quiz → Should work
2. Generate a **NEET Physics** quiz → Should work
3. Check that both use questions from the same pool
4. View study content for Physics → Should work for both exams

---

## 🎉 Migration Complete!

After 1 week of testing, you can optionally run the cleanup SQL (Step 5 in migration-dimensional-model.sql) to delete old exam-specific subjects. But this is optional - the old data doesn't hurt anything.

---

## 🚨 Rollback Plan (If Something Breaks)

### If Quiz Generation Fails After SQL:

1. **Restore from backup:**
   ```bash
   psql -h db.xxx.supabase.co -U postgres -d postgres < backup_YYYYMMDD_HHMMSS.sql
   ```

2. **Or revert just the bridge table:**
   ```sql
   BEGIN;
   
   -- Delete new bridge entries
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

3. **Redeploy previous commit:**
   ```bash
   git revert 6020f54
   git push origin main
   ```

---

## 📊 Benefits After Migration

✅ **Question Pool Sharing:**  
- Before: JEE Physics had 500 questions, NEET Physics had 400 (separate pools)
- After: Physics has 900 questions shared by both exams!

✅ **Easier Content Generation:**  
- Create one "Physics - Thermodynamics" study guide → works for JEE, NEET, UPSC

✅ **True Dimensional Model:**  
- Subjects are dimensions (shared across exams)
- Topics are dimensions (shared across exams)
- Exams select from dimensional intersections

✅ **Future-Proof:**  
- Adding a new exam? Just create bridge entries to existing subjects/topics
- No need to duplicate questions or study content

---

## 📞 Need Help?

If anything goes wrong:
1. Check Vercel deployment logs
2. Check Supabase SQL logs
3. Run the rollback plan above
4. The code changes are backward compatible - they work with both old and new database structures

---

## ✅ Checklist

- [ ] Vercel deployment is live (check URL works)
- [ ] Tested quiz generation with current code
- [ ] Created database backup
- [ ] Ran migration SQL in Supabase
- [ ] Verified shared subjects exist (query above)
- [ ] Tested JEE Physics quiz
- [ ] Tested NEET Physics quiz
- [ ] Confirmed both use same question pool
- [ ] Study content still works

---

**IMPORTANT:** Do NOT run the cleanup SQL (Step 5 in migration-dimensional-model.sql) until you've tested for at least 1 week!
