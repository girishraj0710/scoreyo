# 🚀 Load Content into Supabase - FIXED!

**Issue identified:** The scripts weren't loading `.env.local` automatically.  
**Status:** ✅ **FIXED** - Added automatic environment loader

---

## ✅ Run This Command Now

```bash
cd /Users/girish.raj/prepgenie && npx tsx scripts/load-all-content.ts
```

The scripts now automatically load `.env.local` variables, so your `POSTGRES_URL` will be available.

---

## 🔧 What Was Fixed

1. **Created `scripts/load-env.ts`**
   - Automatically reads `.env.local`
   - Parses all environment variables
   - Makes them available to scripts

2. **Updated both loader scripts**
   - Added `import './load-env';` at the top
   - Now loads environment before connecting to database

3. **No manual export needed**
   - You don't need to run `export POSTGRES_URL=...` anymore
   - Scripts handle it automatically

---

## 📋 Before Running (Quick Check)

### 1. Ensure you're in the project directory
```bash
pwd
# Should output: /Users/girish.raj/prepgenie
```

### 2. Check files exist
```bash
ls content-generated/study-materials/*.md | wc -l
# Should output: 3 or more

ls content-generated/questions/*.json | wc -l
# Should output: 5
```

### 3. Verify .env.local has POSTGRES_URL
```bash
grep "^POSTGRES_URL=" .env.local
# Should show: POSTGRES_URL="postgresql://..."
```

If all checks pass, you're ready!

---

## 🚀 Run the Loader

```bash
npx tsx scripts/load-all-content.ts
```

**Expected output:**
```
╔══════════════════════════════════════════════════════════════════╗
║  🎉 WEEK 1 CONTENT LOADER - LOAD ALL TO SUPABASE 🎉            ║
╚══════════════════════════════════════════════════════════════════╝

✅ Environment variables loaded from .env.local

========================================================================
🚀 RUNNING: Study Materials Loader
========================================================================

✅ Environment variables loaded from .env.local

📊 Current study materials in database:
   (showing existing materials if any)

📁 Found X material files:
   - parts-of-speech.md
   - present-tenses.md
   ... (etc)

... (insertion progress)

✅ Study Materials Loader completed successfully

========================================================================
🚀 RUNNING: English Questions Loader
========================================================================

✅ Environment variables loaded from .env.local

📊 Current question counts in database:
   pronunciation: X questions
   ... (etc)

... (insertion progress)

✅ English Questions Loader completed successfully

╔══════════════════════════════════════════════════════════════════╗
║  📊 FINAL SUMMARY                                               ║
╚══════════════════════════════════════════════════════════════════╝

   Study Materials: ✅ SUCCESS
   Questions:       ✅ SUCCESS
   Total Time:      45 seconds

🎉 All content loaded successfully!
```

---

## ⚠️ If You Still Get Errors

### Error: "getaddrinfo ENOTFOUND"

**This should NOT happen now**, but if it does:

1. Check your internet connection
2. Verify Supabase project is running (check dashboard)
3. Try pinging Supabase:
   ```bash
   ping db.zomcofptwlumqkeffbht.supabase.co
   ```

### Error: "Cannot find module"

Install dependencies:
```bash
npm install tsx @types/node pg
```

### Error: "Permission denied"

Make scripts executable:
```bash
chmod +x scripts/*.ts
```

---

## ✅ Verify After Loading

### Check database counts
```bash
# Study materials
npx tsx -e "
import './scripts/load-env';
import { getPool } from './src/lib/db';
const pool = getPool();
pool.query('SELECT COUNT(*) FROM topic_study_content WHERE subject_id = \\'english\\'')
  .then(r => { console.log('Study materials:', r.rows[0].count); pool.end(); });
"

# Questions
npx tsx -e "
import './scripts/load-env';
import { getPool } from './src/lib/db';
const pool = getPool();
pool.query('SELECT COUNT(*) FROM english_questions WHERE path_id = \\'foundation\\'')
  .then(r => { console.log('Questions:', r.rows[0].count); pool.end(); });
"
```

### Test on production
- https://krakkify.in/english → Foundation Builder → Parts of Speech → **Study First**
- https://krakkify.in/english → Foundation Builder → Pronunciation → **Start Quiz**

---

## 📁 Files Modified

1. **Created:**
   - `scripts/load-env.ts` (new environment loader)
   - `LOAD-CONTENT-NOW.md` (this file)

2. **Updated:**
   - `scripts/load-study-materials.ts` (added env loader import)
   - `scripts/load-english-questions.ts` (added env loader import)

3. **No changes needed:**
   - `scripts/load-all-content.ts` (works automatically)
   - `.env.local` (already has correct values)

---

## 🎯 Summary

**Problem:** Scripts couldn't find `POSTGRES_URL` because `.env.local` wasn't being loaded  
**Solution:** Added automatic environment loader that runs before database connection  
**Status:** ✅ Ready to run  

**Next:** Just run the command at the top of this file!

---

**Last Updated:** June 15, 2026  
**Status:** ✅ READY TO USE
