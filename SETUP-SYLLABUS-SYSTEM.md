# 🚀 Syllabus Currency System - Setup Guide

**Status:** ✅ Code deployed, needs one-time database migration

---

## ✅ What's Already Done

- ✅ Syllabus config created (all 20+ exams defined)
- ✅ Quiz generator updated (prioritizes current syllabus)
- ✅ All seeding scripts updated (auto-tag questions)
- ✅ Annual update script created
- ✅ Annual cron scheduled (Jan 1st each year)
- ✅ Code pushed to GitHub
- ✅ Vercel deployment in progress

---

## 📋 Setup Steps (10 Minutes)

### Step 1: Wait for Vercel Deployment (2 min)

The code is deployed. Wait for:
- **Vercel Dashboard → Deployments** → Status: **Ready** ✅

### Step 2: Run Database Migration (5 min)

This adds the syllabus tracking columns to existing questions.

**Option A: Run locally (Recommended)**

```bash
# From project root
npx tsx scripts/migrate-add-syllabus-year.ts
```

**What it does:**
- Adds `syllabus_year` column (default: 2024)
- Adds `is_current_syllabus` column (default: 1)
- Creates index for fast queries
- Tags all existing questions as current syllabus
- Shows distribution report

**Expected output:**
```
🔄 DATABASE MIGRATION: Add Syllabus Year Tracking
✅ Added syllabus_year column
✅ Added is_current_syllabus column
✅ Created syllabus index
✅ jee-main: Set 3,200 questions to syllabus year 2024
✅ neet-ug: Set 2,800 questions to syllabus year 2024
...
✅ MIGRATION COMPLETED SUCCESSFULLY
```

**Option B: Run via Turso CLI**

```bash
# If you prefer Turso CLI
turso db shell prepgenie

# Then run:
ALTER TABLE exam_questions ADD COLUMN syllabus_year INTEGER DEFAULT 2024;
ALTER TABLE exam_questions ADD COLUMN is_current_syllabus BOOLEAN DEFAULT 1;
CREATE INDEX idx_exam_questions_syllabus ON exam_questions(exam_id, subject_id, topic, is_current_syllabus, difficulty);
```

### Step 3: Verify Migration (1 min)

Check that questions have syllabus tags:

```bash
# Quick test
npx tsx -e "
import { createClient } from '@libsql/client';
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});
const result = await db.execute('SELECT exam_id, syllabus_year, is_current_syllabus, COUNT(*) as count FROM exam_questions GROUP BY exam_id, syllabus_year, is_current_syllabus LIMIT 5');
console.table(result.rows);
"
```

**Expected:** Should show rows with `syllabus_year: 2024` and `is_current_syllabus: 1`

### Step 4: Test Quiz Generation (2 min)

Generate a quiz and verify it works:

1. Go to: https://prepgenie.co.in/quiz
2. Select any exam/subject/topic
3. Start a quiz
4. Questions should load normally ✅

**What changed:**
- Quiz now prioritizes questions where `is_current_syllabus = 1`
- Falls back to old syllabus if needed
- User experience: Same, but questions are now tracked by syllabus

---

## 🎯 What Happens Next

### Daily (Automatic):
- Daily cron seeds new questions
- New questions auto-tagged with current syllabus year (2024)
- Example: `syllabus_year = 2024, is_current_syllabus = 1`

### January 1st Next Year (Automatic):
- Annual cron runs at 3 AM IST
- Checks syllabus config
- If any exam's syllabus changed:
  - Marks old questions as outdated (`is_current_syllabus = 0`)
  - Marks new year questions as current (`is_current_syllabus = 1`)
- Sends log to `annual-syllabus-update.log`

### When Syllabus Changes (Manual, 5 min/year):

**Example: JEE Main syllabus changes in Jan 2027**

1. **Edit** `src/lib/syllabus-config.ts`:
   ```typescript
   {
     examId: "jee-main",
     currentSyllabusYear: 2027,  // ← Change from 2024 to 2027
     lastUpdated: "2027-01-15",  // ← Update date
     changes: "Added ML in Computer Science",  // ← Describe changes
     officialNotice: "https://jeemain.nta.nic.in/syllabus-2027",  // ← Update link
   }
   ```

2. **Commit and push**:
   ```bash
   git add src/lib/syllabus-config.ts
   git commit -m "chore: Update JEE Main syllabus to 2027"
   git push origin main
   ```

3. **Wait for annual cron** (Jan 1st), or manually trigger:
   ```bash
   npx tsx scripts/annual-syllabus-update.ts
   ```

4. **Result**:
   - Old JEE questions (year 2024) → marked outdated
   - New JEE questions (year 2027) → marked current
   - Quiz generator prioritizes 2027 questions
   - Daily cron generates more 2027 questions

**That's it!** System handles everything else automatically.

---

## 📊 Monitoring

### Check Current Status:

```bash
# See distribution by syllabus year
npx tsx -e "
import { createClient } from '@libsql/client';
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});
const result = await db.execute('SELECT exam_id, syllabus_year, is_current_syllabus, COUNT(*) as questions FROM exam_questions GROUP BY exam_id, syllabus_year, is_current_syllabus ORDER BY exam_id');
console.table(result.rows);
"
```

### Check Quiz Behavior:

1. Generate a quiz for an exam
2. Questions should be from current syllabus year
3. If current bank is low, may get old syllabus (graceful fallback)

### Logs:

```bash
# Annual update log (after Jan 1st each year)
cat annual-syllabus-update.log

# Daily seeding log
tail -f daily-seed-cron.log
```

---

## 🚨 Troubleshooting

### Issue: Migration fails with "duplicate column"

**Cause:** Already run before  
**Fix:** Safe to ignore, columns already exist ✅

### Issue: Quizzes still loading old syllabus

**Check:**
1. Run migration (adds columns)
2. Verify `is_current_syllabus = 1` in database
3. Check quiz generator updated (git pull)
4. Clear browser cache

### Issue: Annual cron not running

**Check:**
1. Vercel Dashboard → Crons → History
2. Should show run on Jan 1st each year
3. Check logs for errors
4. Verify CRON_SECRET is set

---

## 📋 Quick Reference

### Key Files:

```
src/lib/syllabus-config.ts              ← UPDATE ANNUALLY when syllabus changes
scripts/migrate-add-syllabus-year.ts    ← Run ONCE (now)
scripts/annual-syllabus-update.ts       ← Runs AUTOMATICALLY (Jan 1st)
src/lib/db.ts                           ← Quiz logic (auto-updated)
vercel.json                             ← Cron schedule (already set)
SYLLABUS-CURRENCY-SYSTEM.md             ← Full documentation
```

### Commands:

```bash
# One-time migration (run now)
npx tsx scripts/migrate-add-syllabus-year.ts

# Test annual update (anytime)
npx tsx scripts/annual-syllabus-update.ts

# Check distribution
npx tsx -e "import {db} from './src/lib/db'; /* query here */"
```

### Annual Checklist:

**Every January:**
- [ ] Check official exam notifications
- [ ] Update `syllabus-config.ts` if any changes
- [ ] Commit and push
- [ ] Wait for annual cron (Jan 1st) or run manually
- [ ] Verify quiz behavior
- [ ] Check logs

---

## ✅ You're All Set!

**What you have now:**

✅ **Automatic syllabus tracking** - Questions tagged with year  
✅ **Current syllabus priority** - Quiz picks latest first  
✅ **Annual updates** - Runs automatically Jan 1st  
✅ **Graceful fallback** - Still works if new syllabus is low  
✅ **Non-destructive** - Old questions kept as backup  
✅ **5 min/year maintenance** - Just update one config file

**Next immediate action:**
1. Run migration: `npx tsx scripts/migrate-add-syllabus-year.ts`
2. Test a quiz
3. Done! System runs autonomously from now on 🚀

**Next annual action:**
- **January 2027**: Check if any exam syllabus changed, update config

**This ensures PrepGenie always stays current with exam patterns!** 🎯

---

## 📞 Questions?

- **Full docs:** `SYLLABUS-CURRENCY-SYSTEM.md`
- **Config file:** `src/lib/syllabus-config.ts`
- **Test:** Generate a quiz and check questions
- **Logs:** `annual-syllabus-update.log`

**The system is production-ready and will run autonomously!** 🚀
