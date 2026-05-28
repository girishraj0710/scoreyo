# 🔄 Database Migration - IN PROGRESS

## What's Happening

**Migrating 3,842 questions from `exam_questions` to `fact_exam_questions`**

### Background Job Running
- Script: `scripts/simple-sync.ts`
- Status: Running in background
- Process: Syncing questions one by one with topic resolution

### Progress
- Before: 42,098 questions in fact_exam_questions
- Expected after: ~45,940 questions
- Expected admin count: ~45,940

## What This Fixes

### Current State
- `exam_questions`: 45,937 questions (staging table)
- `fact_exam_questions`: 42,098 questions (production)
- **Gap**: 3,839 questions not in admin

### After Migration
- All questions will be in `fact_exam_questions`
- Admin page will show correct total
- Includes the 19 new NCERT Math questions

## How It Works

For each question in `exam_questions`:
1. Check if already in `fact_exam_questions` (by question text)
2. If not, resolve or create `topic_id` from `dim_topics`
3. Insert into `fact_exam_questions`
4. Continue to next question

## Timeline

- **Small dataset** (< 1000 questions): 2-5 minutes
- **Medium dataset** (1000-3000): 10-15 minutes
- **Large dataset** (3000+): 20-30 minutes

Our dataset: **3,842 questions** → **15-25 minutes**

## Monitoring

### Check Progress
```bash
# View output (while running)
tail -f /private/tmp/.../tasks/bc6lo5l7y.output

# Or use the check script
tsx scripts/check-fact-table.ts
```

### Expected Output
```
📦 Found 3842 questions to sync

   ✅ Synced 100/3842...
   ✅ Synced 200/3842...
   ✅ Synced 300/3842...
   ...

✅ SYNC COMPLETE
fact_exam_questions: 42,098 → 45,940 (+3,842)
```

## After Completion

### Verify
1. Check admin page - should show ~45,940 questions
2. Run: `tsx scripts/check-fact-table.ts`
3. Difference should be 0

### Continue Scraping
With the sync done, you can continue scraping:

```bash
# Scrape more subjects
npm run scrape -- --subject chemistry --class 12 --all
npm run scrape -- --subject biology --class 12 --all

# Now saves directly to fact_exam_questions
# Shows in admin immediately
```

## What Was Built

### Migration Scripts
1. ✅ `sync-exam-to-fact-questions.ts` - Full migration with dimensional logic
2. ✅ `sync-batch.ts` - Batch processing version
3. ✅ `simple-sync.ts` - **Currently running** (simplest, most reliable)

### Why Simple Sync Works Best
- Direct topic_name lookup (no complex joins)
- Creates missing topics automatically  
- One-by-one processing (more reliable for large datasets)
- Progress logging every 100 questions

## Troubleshooting

### If Migration Fails
```bash
# Check where it stopped
tsx scripts/check-fact-table.ts

# Resume (script is idempotent - skips existing)
tsx scripts/simple-sync.ts
```

### If Stuck
Migration is running in background. You'll be notified when complete.

## Next Steps

1. **Wait for migration** (~15-25 minutes)
2. **Verify admin count** (should be ~45,940)
3. **Continue scraping** with confidence!

---

*Status: IN PROGRESS*  
*Started: Just now*  
*Expected completion: 15-25 minutes*  
*Will auto-notify when done*
