# ⚠️ URGENT: Quiz Submission Still Failing

## Problem
Quiz submission is throwing an error because your **Supabase database is missing columns**.

## Root Cause
The code expects these columns in `quiz_sessions` table:
- `source_stats` (JSONB) - tracks question sources
- `sprint_id` (TEXT) - for sprint competitions

These columns don't exist in your Supabase database yet.

## Solution: Run SQL Script NOW

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Select your project: `zomcofptwlumqkeffbht`
3. Click **"SQL Editor"** in left sidebar
4. Click **"New Query"**

### Step 2: Copy & Paste This SQL

```sql
-- Add missing columns to quiz_sessions table
ALTER TABLE quiz_sessions
ADD COLUMN IF NOT EXISTS source_stats JSONB;

ALTER TABLE quiz_sessions
ADD COLUMN IF NOT EXISTS sprint_id TEXT;

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'quiz_sessions'
ORDER BY ordinal_position;
```

### Step 3: Click "Run" (or press Cmd+Enter)

### Step 4: Verify Output
You should see:
```
✓ ALTER TABLE
✓ ALTER TABLE
✓ Results showing all columns including source_stats and sprint_id
```

## After Running SQL
1. Try submitting a quiz again
2. It should work now!
3. If still failing, check browser console (F12) for actual error message

## Alternative: Check if Columns Already Exist

Run this first to see what columns you have:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quiz_sessions' 
ORDER BY ordinal_position;
```

If you see `source_stats` and `sprint_id` in the list, the columns exist and the error is something else.

## Why This Happened
Your database was migrated from Turso to Supabase, but these columns (added in recent features) weren't created during migration.

## Other Files with SQL Scripts
- `.agents/artifacts/FIX_ALL_MISSING_COLUMNS.sql` (comprehensive fix)
- `.agents/artifacts/FIX_QUIZ_SESSIONS_TABLE.sql` (quiz-specific fix)

Both contain the same fix + additional checks.
