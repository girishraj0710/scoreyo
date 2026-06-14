# 🚀 Migration Quick Reference Guide

**Last Updated:** June 14, 2026

---

## 📁 Files You Need

### On Your Desktop
- **migration-dimensional-model.sql** (36 KB) - Main migration script

### In Repository
- **VALIDATE-THEN-MIGRATE.md** - Complete step-by-step guide (READ THIS FIRST!)
- **VALIDATION-QUERIES.sql** - Pre-migration checks
- **POST-MIGRATION-VALIDATION.sql** - Post-migration verification

### Validation Scripts
- **scripts/post-migration-validation.py** - Automated validation (run after migration)

---

## ⚡ Quick Migration Steps

### 1️⃣ PRE-MIGRATION (5 minutes)

**Open Supabase:** https://supabase.com/dashboard/project/zomcofptwlumqkeffbht/editor

**Run validation queries from `VALIDATION-QUERIES.sql`:**
```sql
-- Section 1: Check tables exist
-- Section 2: Count subjects
-- Section 5: Check migration not run yet ← CRITICAL
-- Section 10: Final safety check
```

**✅ All checks pass?** → Proceed  
**❌ Any failures?** → STOP, review error

---

### 2️⃣ WAIT FOR DEPLOYMENT (2 minutes)

**Check Vercel:** https://vercel.com/girishraj0710/prepgenie/deployments

**Latest deployment shows "Ready"?** → Proceed  
**Still building?** → Wait

**Test current site:** https://krakkify.in
- Generate a JEE Physics quiz
- ✅ Works? → Proceed

---

### 3️⃣ RUN MIGRATION (2 minutes)

**Open `migration-dimensional-model.sql` from Desktop**

**Copy entire file → Paste into Supabase SQL Editor → Click Run**

**Watch for:**
```
BEGIN
INSERT 0 52    ← 52 shared subjects created
INSERT 0 295   ← 295 mappings created
INSERT ...     ← Bridge entries created
COMMIT
```

**✅ COMMIT appears?** → Success!  
**❌ ERROR appears?** → STOP, save error, run rollback

---

### 4️⃣ VERIFY MIGRATION (3 minutes)

**Option A: Run SQL validation (Manual)**
```sql
-- From POST-MIGRATION-VALIDATION.sql
-- Run TEST 1, 2, 3, 7, 13, 15
```

**Option B: Run Python script (Automated)**
```bash
cd /Users/girish.raj/prepgenie
./scripts/run-validation.sh
```

**Expected output:**
```
✅ Passed: 13/13
⚠️  Warnings: 0/13
❌ Failed: 0/13
🎉 PERFECT! Migration completed successfully
```

---

### 5️⃣ TEST PRODUCTION (5 minutes)

**Go to https://krakkify.in**

**Test these:**
1. ✅ Generate JEE Main Physics quiz
2. ✅ Generate NEET Physics quiz
3. ✅ Generate CAT Quant quiz
4. ✅ Click "Study First" on any topic
5. ✅ Check your dashboard stats

**All working?** → SUCCESS! 🎉

---

## 🚨 If Something Breaks

### Quick Rollback (Database)

**Run in Supabase SQL Editor:**
```sql
BEGIN;

DELETE FROM bridge_exam_subject_topic
WHERE subject_id IN (
  SELECT id FROM dim_subjects WHERE subject_code NOT LIKE '%-%'
);

DELETE FROM dim_subjects
WHERE subject_code IN (SELECT new_subject_code FROM subject_migration_map);

DROP TABLE subject_migration_map;

COMMIT;
```

### Quick Rollback (Code)

```bash
git revert HEAD
git push origin main
```

---

## 📊 What Changed?

### Before
```
jee-main → jee-physics (500 questions)
neet → neet-physics (400 questions)
```

### After
```
jee-main → physics (1200+ questions SHARED)
neet → physics (1200+ questions SHARED)
```

---

## ✅ Success Checklist

- [ ] Pre-migration validation passed
- [ ] Vercel deployment is live
- [ ] Migration SQL executed successfully
- [ ] Post-migration validation passed (all tests ✅)
- [ ] JEE quiz generation works
- [ ] NEET quiz generation works
- [ ] Study content works
- [ ] Dashboard stats still correct
- [ ] No errors in Vercel logs
- [ ] No errors in Supabase logs

---

## 📞 Get Help

**If ANY test fails:**
1. Take screenshot of error
2. Run: `SELECT * FROM pg_stat_activity WHERE state = 'active';` in Supabase
3. Check Vercel logs: https://vercel.com/girishraj0710/prepgenie/logs
4. Share output

**Most Common Issues:**

❌ **"Migration already run"** → Rollback first, then try again  
❌ **"Duplicate key violation"** → Shared subjects already exist, check Section 5  
❌ **Quiz generation fails** → Wait for Vercel deployment, check code is live  
❌ **Topics not appearing** → Bridge table issue, check TEST 13 results  

---

## 🎯 Expected Timeline

- Pre-validation: **5 min**
- Wait for deployment: **2 min**
- Run migration: **2 min**
- Post-validation: **3 min**
- Production testing: **5 min**
- **Total: ~15-20 minutes**

---

## 📝 Notes

- Old exam-specific subjects (jee-physics) remain in database for backward compatibility
- You can delete them after 1 week of stable operation
- Quiz sessions still reference old subjects (by design)
- New quizzes use shared subjects (automatic via subject-mapper.ts)

---

## 🔗 Key Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/zomcofptwlumqkeffbht
- **Vercel Deployments:** https://vercel.com/girishraj0710/prepgenie/deployments
- **Production Site:** https://krakkify.in
- **GitHub Repo:** https://github.com/girishraj0710/prepgenie

---

**Ready to start? Open `VALIDATE-THEN-MIGRATE.md` for detailed instructions!**
