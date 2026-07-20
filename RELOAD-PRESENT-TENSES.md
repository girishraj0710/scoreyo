# Reload Present Tenses Study Material

**Why needed:** Fixed markdown (removed dots, added Practice Problems header) needs to be reloaded into database.

**Good news:** The loader script has **UPDATE logic** - it won't create duplicates! Safe to run.

---

## Simple One-Command Reload (SAFEST)

```bash
cd ~/prepgenie
npx tsx scripts/load-study-materials.ts
```

**What happens:**
- ✅ Updates present-tenses (5 entries) with fixed content
- ✅ Skips other materials (already exist, no changes)
- ✅ No duplicates created (script checks `WHERE topic_id = $1` first)

Expected output:
```
📖 Reading: present-tenses.md
   ✅ Updated present-tenses (5 topics)

📖 Reading: parts-of-speech.md
   ✅ Updated parts-of-speech (1 topic)

... (repeats for all 7 files)

✅ 20 study materials processed (7 updated, 13 skipped)
```

---

## Advanced: Update Only present-tenses (Optional)

If you want to skip checking other files:

```bash
cd ~/prepgenie

# Temporarily rename other files
mv content-generated/study-materials/parts-of-speech.md content-generated/study-materials/parts-of-speech.md.bak
mv content-generated/study-materials/past-tenses.md content-generated/study-materials/past-tenses.md.bak
# ... rename other 5 files

# Run loader
npx tsx scripts/load-study-materials.ts

# Restore files
mv content-generated/study-materials/parts-of-speech.md.bak content-generated/study-materials/parts-of-speech.md
# ... restore others
```

**Not recommended** - the UPDATE logic is fast, just run the full script.

---

## Verify After Reload

1. Visit: https://scoreyo.in/english/foundation/present-simple/study
2. Navigate to "Core Concepts" section
3. **Check Card Titles** - NO dots:
   - ✅ "Present Simple Tense" (not ". Present Simple Tense")
   - ✅ "Present Continuous Tense" (not ". Present Continuous Tense")
4. **Check Card 5** - Should show table content (Time Expressions)
5. **Check Card 6** - Should show comparison content
6. **Check Card 7** - Should show distinction content
7. **Complete all 7 cards** - Click "Got It!" on each
8. **Completion card appears:**
   ```
   🎉 All Concepts Mastered!
   [Start Practice Problems →]
   ```
9. **Click button** → Practice Problems view loads with:
   - ✅ Beginner Level (2 questions)
   - ✅ Intermediate Level (3 questions)
   - ✅ Advanced Level (2 questions)
   - ✅ All collapsed by default
   - ✅ Click to expand answers

---

## What Was Fixed

### Markdown Changes (present-tenses.md)
- ❌ `### . Present Simple Tense` → ✅ `### Present Simple Tense` (removed dots)
- ❌ `## Beginner Level` → ✅ `## Practice Problems\n### Beginner Level` (added section header)
- Applied to all 7 concept cards + 3 difficulty levels

### Code Changes (study-material-content-v2.tsx)
- Removed 50-char minimum content check (was skipping short sections like tables)
- Now includes cards 5, 6, 7 which have table/comparison content

### Result
- All 7 concept cards now display correctly
- Practice Problems section appears after completion
- No dots in titles
- Premium expandable question UI

---

## Current Deployment Status

**Git commits pushed:**
- ✅ `02e4164` - Premium practice problems UI component
- ✅ `ca92fd3` - Fix present tenses markdown + parser

**Vercel deployment:** ✅ LIVE (auto-deployed in 2-3 minutes)

**Database status:** ❌ NOT YET RELOADED (needs manual step above)

---

**After reload, test at:** https://scoreyo.in/english/foundation/present-simple/study
