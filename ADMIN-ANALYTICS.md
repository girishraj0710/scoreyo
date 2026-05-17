# Admin Analytics Dashboard

## Overview
Comprehensive analytics dashboard showing question quality metrics, usage patterns, and key insights.

## Features

### 📊 Quick Stats (Top Cards)
- **Total Questions** - Count of all questions in database
- **Total Users** - All registered users + active (30d)
- **Total Quizzes** - All quiz attempts + last 7 days
- **Pro Users** - Active subscriptions + 30-day revenue

### 📚 Question Quality Metrics
1. **By Difficulty**
   - Visual breakdown: Easy, Medium, Hard
   - Progress bars showing distribution
   - Total count per difficulty

2. **By Source**
   - Top 5 question sources
   - Count for each source
   - Helps identify quality sources vs AI-generated

3. **By Exam**
   - Question distribution across exams
   - Identifies coverage gaps

### 🚨 Question Reports
- Breakdown by status (Pending, Reviewing, Fixed, Dismissed)
- Recent reports count (last 7 days)
- Color-coded status indicators
- Direct link to Question Review interface

### 👥 User Activity
- **Active Users (7 days)** - Users who took quizzes in last week
- **Active Users (30 days)** - Monthly active users
- **Retention Rate** - Percentage of total users active in 30d
- Helps measure engagement

### 🔥 Popular Content (30 days)
1. **Popular Exams**
   - Top 8 exams by quiz attempts
   - Ranked list with attempt counts
   - Shows trending content

2. **Popular Subjects**
   - Most attempted subjects
   - Cross-exam analysis

3. **Average Scores by Exam**
   - Performance metrics per exam
   - Visual progress bars
   - Identifies easy vs difficult exams

### ⚠️ Questions Needing Review
- **Low Accuracy Detection** (<30% correct rate)
- Minimum 10 attempts required (statistically significant)
- Shows:
  - Question text preview
  - Exam and topic
  - Accuracy percentage
  - Correct/total attempts
- Helps identify:
  - Incorrect answer keys
  - Confusing questions
  - Ambiguous options

### 📅 Daily Activity Chart
- Last 14 days visualization
- Two metrics per day:
  - Quiz attempts (blue bars)
  - Active users (green bars)
- Relative bar sizing for easy comparison
- Helps identify trends and patterns

### 💰 Subscription Metrics
- Active Pro users count
- Revenue in last 30 days
- Subscription count in 30 days

## Access

**URL:** `/admin` or `/admin/questions`

**Admin Users:**
- girish.raj0710@gmail.com
- grgowda07.1992@gmail.com

**Navigation:**
Click your avatar → "📊 Analytics" or "📝 Review Questions"

## API

### GET /api/admin/analytics

Returns comprehensive analytics data.

**Authentication:** Admin email required (cookie-based)

**Response Structure:**
```json
{
  "questionMetrics": {
    "total": 27000,
    "bySource": [...],
    "byDifficulty": [...],
    "byExam": [...]
  },
  "reportMetrics": {
    "byStatus": [...],
    "recentCount": 4
  },
  "usageMetrics": {
    "users": {
      "total": 150,
      "active7Days": 45,
      "active30Days": 78
    },
    "quizzes": {...},
    "popularExams": [...],
    "popularSubjects": [...],
    "avgScores": [...]
  },
  "dailyActivity": [...],
  "questionQuality": {
    "lowAccuracy": [...]
  },
  "subscriptions": {
    "proUsers": 12,
    "revenue30Days": {
      "count": 5,
      "total": 395
    }
  }
}
```

## Database Queries

Key queries used:

1. **Question Distribution:**
```sql
SELECT source, COUNT(*) as count
FROM exam_questions
GROUP BY source
ORDER BY count DESC
```

2. **Active Users:**
```sql
SELECT COUNT(DISTINCT user_id) as count
FROM quiz_results
WHERE completed_at >= datetime('now', '-7 days')
```

3. **Low Accuracy Questions:**
```sql
SELECT
  eq.id,
  eq.question,
  COUNT(CASE WHEN qa.is_correct = 1 THEN 1 END) as correct_count,
  COUNT(*) as total_attempts,
  accuracy
FROM exam_questions eq
LEFT JOIN question_attempts qa ON eq.id = qa.question_id
GROUP BY eq.id
HAVING total_attempts >= 10 AND accuracy < 30
```

4. **Daily Activity:**
```sql
SELECT
  DATE(completed_at) as date,
  COUNT(*) as quizzes,
  COUNT(DISTINCT user_id) as users
FROM quiz_results
WHERE completed_at >= datetime('now', '-14 days')
GROUP BY DATE(completed_at)
```

## Key Insights

### What to Monitor

1. **Low Accuracy Questions**
   - Review immediately
   - May have wrong answers
   - Could confuse students

2. **Daily Activity Trends**
   - Increasing = good growth
   - Dropping = investigate why
   - Spikes = marketing success

3. **Retention Rate**
   - <30% = need better engagement
   - 30-50% = average
   - >50% = excellent

4. **Popular Content**
   - Focus on trending exams
   - Add more questions for popular topics
   - Maintain quality for high-traffic areas

5. **Question Reports**
   - Pending reports should be addressed
   - High report rate = quality issues
   - Track fix time

## Performance

- Dashboard loads in ~2-3 seconds
- Cached queries where possible
- Optimized with aggregations
- Limit results to prevent overload

## Future Enhancements

- [ ] Real-time updates (WebSocket)
- [ ] Export to PDF/Excel
- [ ] Custom date range filters
- [ ] Compare time periods
- [ ] Question accuracy trends over time
- [ ] User cohort analysis
- [ ] Revenue forecasting
- [ ] A/B testing insights
- [ ] Email alerts for critical metrics
- [ ] Mobile-responsive charts library
