# Streak Calculation Issues & Fix

## Problem Identified

User reports seeing different numbers in:
1. **Dashboard "Day Streak" card** - Shows one number
2. **Study Streak Calendar widget** - Shows only May 16 & 21
3. **Reports "Daily Activity Trend"** - Shows May 5, 10, 11

## Root Causes

### 1. Multiple Streak Calculation Functions
Three different places calculate streaks independently:

**Location 1: `getUserStats()` in db.ts (line 926-951)**
```typescript
const streakData = await queryAll(
  "SELECT DISTINCT DATE(created_at) as day FROM quiz_sessions WHERE user_id = ? ORDER BY day DESC",
  [userId]
);
// Calculates streak with today/yesterday grace period
```

**Location 2: `/api/streak-calendar` (new widget)**
```typescript
const sessions = await queryAll(
  "SELECT DATE(created_at) as date FROM quiz_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 365",
  [userId]
);
// Different grace period logic
```

**Location 3: `getDetailedPerformance()` in db.ts (line 1217-1225)**
```typescript
const dailyActivity = await queryAll(
  "SELECT DATE(created_at) as day, COUNT(*) as sessions, ...
   FROM quiz_sessions WHERE user_id = ? AND created_at >= DATE('now', '-30 days')
   GROUP BY DATE(created_at) ORDER BY day ASC",
  [userId]
);
// Only shows last 30 days with activity
```

### 2. Timezone Issues
- `DATE(created_at)` uses server timezone (UTC?)
- `new Date().toISOString().split("T")[0]` uses browser timezone
- Mismatches cause dates to be off by a day

### 3. Different Time Windows
- getUserStats: All-time data
- streak-calendar: Last 365 days
- getDetailedPerformance: Last 30 days

### 4. Grace Period Logic Differences
- getUserStats: Allows yesterday as valid for current streak
- streak-calendar: Also allows yesterday but checks differently
- getDetailedPerformance: No grace period, just raw data

## Expected Behavior

All three should show the SAME dates when a user studied:
- If user took quiz on May 5 → Should show in ALL three places
- Streak should be calculated consistently
- Calendar should highlight the same days as reports show activity

## Solution

### Option 1: Centralize Streak Calculation (RECOMMENDED)

Create a single source of truth function:

```typescript
// In src/lib/db.ts

export async function getStudyDates(userId: string, days: number = 365) {
  const sessions = await queryAll(
    `SELECT DISTINCT DATE(created_at, 'localtime') as day 
     FROM quiz_sessions 
     WHERE user_id = ? 
     AND created_at >= DATE('now', 'localtime', '-${days} days')
     ORDER BY day DESC`,
    [userId]
  );
  
  return sessions.map(s => s.day);
}

export async function calculateStreak(studyDates: string[]): number {
  if (studyDates.length === 0) return 0;
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // Must have studied today OR yesterday to have active streak
  if (studyDates[0] !== today && studyDates[0] !== yesterday) {
    return 0;
  }
  
  let streak = 1;
  for (let i = 1; i < studyDates.length; i++) {
    const prev = new Date(studyDates[i-1]);
    const curr = new Date(studyDates[i]);
    const diffDays = Math.floor((prev.getTime() - curr.getTime()) / 86400000);
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
```

Then update all three functions to use this:

```typescript
// In getUserStats()
const studyDates = await getStudyDates(userId);
const streak = calculateStreak(studyDates);

// In /api/streak-calendar
const studyDates = await getStudyDates(userId, 30);
const currentStreak = calculateStreak(studyDates);

// In getDetailedPerformance() - use same dates
const studyDates = await getStudyDates(userId, 30);
const dailyActivity = studyDates.map(day => ({
  day,
  // ... query sessions for that specific day
}));
```

### Option 2: Use Timezone-aware Queries (SIMPLE FIX)

Change all DATE() calls to use 'localtime':

```sql
-- Before (UTC timezone)
SELECT DATE(created_at) as day FROM quiz_sessions

-- After (User's timezone)
SELECT DATE(created_at, 'localtime') as day FROM quiz_sessions
```

This ensures all three queries see the same dates.

## Recommended Implementation

**Phase 1: Quick Fix (5 minutes)**
- Add 'localtime' to all DATE() queries
- Test with your actual data

**Phase 2: Refactor (30 minutes)**
- Create centralized getStudyDates() and calculateStreak()
- Update all three locations to use it
- Add tests

## Testing Checklist

After fix, verify:
- [ ] Dashboard "Day Streak" matches streak calendar "Current"
- [ ] Streak calendar highlighted days match reports "Daily Activity" dates
- [ ] All three show the same dates when user studied
- [ ] Streak breaks correctly after missed day
- [ ] Yesterday counts for streak (grace period)
- [ ] Timezone doesn't affect calculation

## Files to Update

1. `src/lib/db.ts`
   - Line 926-951: getUserStats() streak calc
   - Add: getStudyDates() helper
   - Add: calculateStreak() helper
   - Line 1217-1225: getDetailedPerformance() dailyActivity

2. `src/app/api/streak-calendar/route.ts`
   - Line 24-70: Replace with getStudyDates() + calculateStreak()

3. Test files (if any)
   - Add tests for streak edge cases
