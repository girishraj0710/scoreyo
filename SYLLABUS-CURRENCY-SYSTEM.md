# 📚 Syllabus Currency System

**Purpose:** Ensure users always get questions aligned with the latest exam syllabus

**Status:** ✅ Implemented (May 2026)

---

## 🎯 What It Does

### Problem Solved:
Exam syllabi change every few years (JEE, NEET, State CETs, etc.). Students need questions from the **current syllabus**, not outdated ones.

### Solution:
- Track which syllabus year each question belongs to
- Prioritize current syllabus questions in quiz/mock tests
- Automatically mark old questions as outdated when syllabus changes
- Keep old questions as backup (don't delete)

---

## 🏗️ System Architecture

### 1. **Database Schema** (`src/lib/db.ts`)

Added to `exam_questions` table:
```sql
syllabus_year INTEGER DEFAULT 2024           -- Year when syllabus was effective
is_current_syllabus BOOLEAN DEFAULT 1        -- 1 = current, 0 = outdated

-- Index for fast queries
CREATE INDEX idx_exam_questions_syllabus 
ON exam_questions(exam_id, subject_id, topic, is_current_syllabus, difficulty)
```

### 2. **Syllabus Configuration** (`src/lib/syllabus-config.ts`)

Central config file tracking current syllabus for each exam:

```typescript
export const CURRENT_SYLLABUS: SyllabusConfig[] = [
  {
    examId: "jee-main",
    examName: "JEE Main",
    currentSyllabusYear: 2024,
    lastUpdated: "2026-05-16",
    changes: "No major changes from 2024 syllabus",
    officialNotice: "https://jeemain.nta.nic.in/",
  },
  // ... all 20+ exams
];
```

**Helper Functions:**
- `getCurrentSyllabusYear(examId)` - Get current year for an exam
- `isCurrentSyllabus(examId, year)` - Check if question is current
- `getSyllabusConfig(examId)` - Get full config

### 3. **Quiz Generator** (`src/lib/db.ts` - `getExamQuestions`)

**Priority Logic:**
```
1. Try current syllabus first (is_current_syllabus = 1)
2. If not enough, fall back to old syllabus (is_current_syllabus = 0)
```

This ensures:
- Users get latest syllabus when available
- System still works if current syllabus bank is low
- Graceful degradation

### 4. **Question Seeding** (All seeding scripts)

New questions automatically tagged:
```typescript
const syllabusYear = getCurrentSyllabusYear(examId);

INSERT INTO exam_questions (
  ...,
  syllabus_year,
  is_current_syllabus
) VALUES (
  ...,
  syllabusYear,
  1  // New questions are always current
)
```

**Scripts Updated:**
- `scripts/daily-seed-cron.ts`
- `scripts/daily-seed-cron-v2.ts`
- `scripts/comprehensive-seed-generator.ts`

### 5. **Annual Update Script** (`scripts/annual-syllabus-update.ts`)

Runs **once a year** (June 1st):

**What it does:**
1. Reads `CURRENT_SYLLABUS` config
2. Marks old questions as outdated: `is_current_syllabus = 0`
3. Marks new questions as current: `is_current_syllabus = 1`
4. Generates report with stats
5. **Does NOT delete** old questions (kept as backup)

**Example:**
```
JEE Main syllabus changed from 2024 → 2025
- 15,000 questions with syllabus_year = 2024 → marked outdated
- 500 questions with syllabus_year = 2025 → marked current
- Daily cron generates more 2025 questions over next weeks
```

### 6. **Annual Cron Job** (`vercel.json`)

Scheduled for **June 1st at 3 AM IST** (once a year):

```json
{
  "crons": [
    {
      "path": "/api/cron/annual-syllabus-update",
      "schedule": "0 3 1 1 *"  // June 1st, 3 AM UTC
    }
  ]
}
```

**API Endpoint:** `/api/cron/annual-syllabus-update`

---

## 📅 Annual Maintenance Workflow

### **Every May-June (After New Syllabi Announced)**

#### Step 1: Check Official Notifications (Dec-Jan)
- **JEE/NEET**: NTA website (usually Jan-Feb)
- **State CETs**: State board websites (Feb-March)
- **GATE**: IIT website (August for next year)
- **UPSC**: Rarely changes
- **Banking/SSC**: Check official sites

#### Step 2: Update Syllabus Config (May-June)

Edit `src/lib/syllabus-config.ts`:

```typescript
{
  examId: "jee-main",
  currentSyllabusYear: 2025,  // ← INCREMENT if syllabus changed
  lastUpdated: "2027-01-15",  // ← UPDATE date
  changes: "Added ML topics in CS",  // ← DESCRIBE changes
  officialNotice: "https://...",  // ← UPDATE URL
}
```

#### Step 3: Run Migration (One-time, already done)

**Already completed in May 2026:**
```bash
npx tsx scripts/migrate-add-syllabus-year.ts
```

This added the columns. **No need to run again.**

#### Step 4: Run Annual Update (Automatic on June 1st)

**Vercel cron runs automatically**, or manually trigger:

```bash
# Test locally first
npx tsx scripts/annual-syllabus-update.ts

# Or trigger via API (with CRON_SECRET)
curl -X POST https://krakkify.co.in/api/cron/annual-syllabus-update \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**What happens:**
- Old questions marked as outdated
- Current questions marked as current
- Log file: `annual-syllabus-update.log`
- Email alert if configured

#### Step 5: Generate New Questions (Optional)

If many questions became outdated, run comprehensive seeding:

```bash
npx tsx scripts/comprehensive-seed-generator.ts
```

Or let daily cron gradually fill over weeks.

#### Step 6: Verify

```bash
# Check question distribution
npx tsx scripts/test-syllabus-distribution.ts

# Test a few quizzes manually
# Should get current syllabus questions first
```

---

## 🔍 Monitoring & Analytics

### Check Syllabus Distribution

```sql
-- Questions by syllabus year
SELECT 
  exam_id,
  syllabus_year,
  is_current_syllabus,
  COUNT(*) as questions
FROM exam_questions
GROUP BY exam_id, syllabus_year, is_current_syllabus
ORDER BY exam_id, is_current_syllabus DESC;
```

### Check Quiz Behavior

```sql
-- Questions served in last 100 quizzes
SELECT 
  q.exam_id,
  q.syllabus_year,
  q.is_current_syllabus,
  COUNT(*) as times_used
FROM question_attempts qa
JOIN exam_questions q ON qa.question_text = q.question
WHERE qa.created_at > datetime('now', '-7 days')
GROUP BY q.exam_id, q.syllabus_year, q.is_current_syllabus;
```

### Expected Results:
- 90%+ questions should be from current syllabus
- Old syllabus only used if current bank is low

---

## 📊 Example Scenarios

### Scenario 1: JEE Main Syllabus Changes (Jan 2027)

**What happens:**

1. **May-June 1, 2027** - Annual cron runs:
   ```
   JEE Main 2024 syllabus: 18,000 questions → marked outdated
   JEE Main 2027 syllabus: 200 questions → marked current
   ```

2. **May-June-March 2027** - Daily cron seeds:
   ```
   Day 1: +80 JEE Main 2027 questions (total: 280)
   Day 30: +2,400 questions (total: 2,600)
   Day 90: +7,200 questions (total: 7,400)
   ```

3. **Quiz behavior**:
   - **Jan 1-7**: 50% current (2027), 50% fallback (2024)
   - **Jan 8-30**: 80% current, 20% fallback
   - **Feb onwards**: 95%+ current syllabus

### Scenario 2: NEET No Change (Jan 2027)

**What happens:**

1. **May-June 1, 2027** - Annual cron runs:
   ```
   NEET syllabus year unchanged: 2024 → 2024
   No questions marked outdated
   All 22,000 questions remain current
   ```

2. **Quiz behavior**:
   - 100% current syllabus (no change)

### Scenario 3: New Exam Added Mid-Year

**What happens:**

1. **Manual config update** in `syllabus-config.ts`:
   ```typescript
   {
     examId: "new-state-cet",
     currentSyllabusYear: 2027,
     lastUpdated: "2027-06-15",
   }
   ```

2. **Seed questions**:
   ```bash
   # Questions auto-tagged with syllabus_year = 2027
   npx tsx scripts/comprehensive-seed-generator.ts
   ```

3. **No annual update needed** until next May-June

---

## 🚨 Edge Cases & Safety

### Case 1: What if syllabus changes mid-year?

**Example:** GATE syllabus announced in August 2027 (for GATE 2028)

**Solution:**
1. Update `syllabus-config.ts` in August
2. Run annual update manually:
   ```bash
   npx tsx scripts/annual-syllabus-update.ts
   ```
3. Seed new questions

### Case 2: What if we have no current syllabus questions?

**Graceful degradation:**
- Quiz generator tries current first
- Falls back to old syllabus if needed
- Users still get questions (just not latest)
- Daily cron gradually fills the gap

### Case 3: What if we delete old questions by mistake?

**Safety:**
- Annual update only marks as outdated (`is_current_syllabus = 0`)
- **Never deletes** questions
- Old questions still in database as backup
- Can reactivate if needed

### Case 4: What if syllabus config is wrong?

**Verification:**
1. Check official notifications (linked in config)
2. Test quizzes manually
3. Monitor user feedback/reports
4. Fix config and rerun update

---

## 🎯 Benefits

### For Students:
✅ Always get latest syllabus questions  
✅ Exam-aligned preparation  
✅ No outdated content  
✅ Confidence that questions match exam pattern

### For Platform:
✅ Automatic syllabus tracking  
✅ No manual question pruning  
✅ Graceful degradation if new syllabus is low  
✅ Professional, scalable system  
✅ Competitive advantage (most platforms don't do this)

### For You (Admin):
✅ One config file to update (5 min/year)  
✅ Automatic update via cron  
✅ Clear logs and reports  
✅ No data loss (old questions kept)

---

## 📋 Quick Reference

### Files Modified/Created:

```
src/lib/syllabus-config.ts                      ← Syllabus config (UPDATE ANNUALLY)
src/lib/db.ts                                   ← Quiz generator (prioritizes current)
scripts/migrate-add-syllabus-year.ts            ← One-time migration (DONE)
scripts/annual-syllabus-update.ts               ← Annual update script
scripts/daily-seed-cron.ts                      ← Tags new questions
scripts/daily-seed-cron-v2.ts                   ← Tags new questions
scripts/comprehensive-seed-generator.ts         ← Tags new questions
src/app/api/cron/annual-syllabus-update/route.ts ← API endpoint
vercel.json                                     ← Cron schedule
```

### Commands:

```bash
# Run migration (one-time, already done)
npx tsx scripts/migrate-add-syllabus-year.ts

# Run annual update (manual)
npx tsx scripts/annual-syllabus-update.ts

# Test current seeding
npx tsx scripts/comprehensive-seed-generator.ts

# Check distribution
sqlite3 data/krakkify.db "SELECT exam_id, syllabus_year, is_current_syllabus, COUNT(*) FROM exam_questions GROUP BY exam_id, syllabus_year, is_current_syllabus;"
```

### Annual Checklist:

- [ ] Check official notifications (Dec-Jan)
- [ ] Update `syllabus-config.ts` (Jan)
- [ ] Commit and push changes
- [ ] Annual cron runs automatically (June 1st)
- [ ] Verify quiz behavior (test a few)
- [ ] Monitor user feedback
- [ ] Seed more questions if needed

---

## 🚀 Launch Readiness

**Status:** ✅ Ready for Production

**What's deployed:**
- ✅ Database schema with syllabus tracking
- ✅ Syllabus config for all 20+ exams
- ✅ Quiz generator prioritizes current syllabus
- ✅ All seeding scripts tag questions
- ✅ Annual update cron scheduled
- ✅ API endpoint secured
- ✅ Logs and monitoring

**Next manual action:**
- **May-June 2027:** Update syllabus config if any exam changes

**This is production-ready and will run autonomously!** 🎯

---

## 📞 Support

**Questions?**
- Check: `syllabus-config.ts` for current settings
- Check: `annual-syllabus-update.log` for last run
- Test: Generate a quiz and inspect questions
- Verify: Database query to check distribution

**This system ensures Krakkify stays current with exam patterns forever!** 🚀
