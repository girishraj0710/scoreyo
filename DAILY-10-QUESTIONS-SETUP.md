# Daily 10 Questions - Quick Setup Guide

## 🚀 What's New?

Replaced single "Question of the Day" with **Daily 10 Questions** that:
- ✅ Personalizes based on user performance (weak topics, recent topics, new topics)
- ✅ Resets daily at midnight IST
- ✅ Tracks completion and scores
- ✅ Shows results with explanations

---

## 📋 Setup Steps

### 1. Run Database Migration

**Option A: Supabase SQL Editor (Recommended)**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to: **SQL Editor** → **New query**
3. Copy and paste the contents of `scripts/create-daily-questions-table.sql`
4. Click **Run** button
5. Verify success message: "Success. No rows returned"

**Option B: Using psql CLI**

```bash
# From project root
psql $POSTGRES_URL -f scripts/create-daily-questions-table.sql
```

**Option C: Using Supabase CLI**

```bash
supabase db push
```

---

### 2. Verify Table Created

Run this query in Supabase SQL Editor:

```sql
-- Check table exists
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'daily_question_blocks';

-- Check columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'daily_question_blocks'
ORDER BY ordinal_position;
```

**Expected Output:**
```
column_name     | data_type
----------------|----------
id              | integer
user_id         | text
date            | date
questions       | jsonb
user_answers    | jsonb
completed       | boolean
score           | integer
attempted_at    | timestamp
created_at      | timestamp
```

---

### 3. Test the Feature

#### A. Test as NEW USER:

1. Create a new user account (or use one with no quiz history)
2. Set preferred exam (e.g., UPSC, JEE, NEET)
3. Go to Home page
4. You should see **Daily 10 Questions** section
5. Verify 10 random questions from your exam loaded
6. Answer all 10 questions
7. Click "Submit Answers"
8. Check results and score

#### B. Test as RETURNING USER:

1. Use existing user with quiz history
2. Go to Home page
3. Verify personalized questions (mix of weak/recent/new topics)
4. Complete and submit
5. Check if weak topics appear more frequently

#### C. Test Daily Reset:

1. Complete today's questions
2. Try to access again → Should show "Already completed"
3. Wait until tomorrow (or manually change date in DB for testing)
4. Visit Home page → Should see NEW 10 questions

---

### 4. Manual Testing (Database)

```sql
-- Check generated blocks
SELECT user_id, date, completed, score, 
       array_length(questions, 1) as question_count
FROM daily_question_blocks
ORDER BY created_at DESC
LIMIT 10;

-- Check specific user's blocks
SELECT date, completed, score, attempted_at
FROM daily_question_blocks
WHERE user_id = 'YOUR_USER_ID'
ORDER BY date DESC;

-- Today's stats
SELECT 
  COUNT(*) as total_blocks,
  COUNT(*) FILTER (WHERE completed = true) as completed_blocks,
  AVG(score) FILTER (WHERE completed = true) as avg_score
FROM daily_question_blocks
WHERE date = CURRENT_DATE;
```

---

## 🔍 API Testing

### Test GET endpoint:

```bash
curl http://localhost:3000/api/daily-questions \
  -H "Cookie: krakkify-user-id=YOUR_USER_ID" \
  -v
```

**Expected Response:**
```json
{
  "date": "2026-07-11",
  "questions": [
    {
      "id": 123,
      "question": "Which article...",
      "options": ["A", "B", "C", "D"],
      "correct_answer": 2,
      "explanation": "...",
      "exam_id": "upsc",
      "subject_id": "polity",
      "topic": "Fundamental Rights",
      "difficulty": "medium"
    },
    ...9 more
  ],
  "completed": false,
  "score": 0,
  "attempted_at": null
}
```

---

### Test POST endpoint:

```bash
curl -X POST http://localhost:3000/api/daily-questions \
  -H "Cookie: krakkify-user-id=YOUR_USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [2, 1, 3, 0, 2, 1, 3, 2, 0, 1]
  }' \
  -v
```

**Expected Response:**
```json
{
  "completed": true,
  "score": 7,
  "total": 10,
  "results": [
    {
      "questionId": 123,
      "userAnswer": 2,
      "correctAnswer": 2,
      "isCorrect": true,
      "explanation": "..."
    },
    ...9 more
  ]
}
```

---

## 🐛 Troubleshooting

### Issue: "No daily questions available yet"

**Possible causes:**
1. Preferred exam not set for user
2. Exam has < 10 verified questions in database
3. API error (check console logs)

**Fix:**
```sql
-- Check user's preferred exam
SELECT id, email, preferred_exam FROM users WHERE id = 'YOUR_USER_ID';

-- Check question count for exam
SELECT exam_id, COUNT(*) 
FROM questions 
WHERE is_verified = true 
GROUP BY exam_id;
```

---

### Issue: "Failed to fetch daily questions"

**Possible causes:**
1. User not authenticated
2. Database connection error
3. API route not found

**Fix:**
- Check browser console for errors
- Verify `krakkify-user-id` cookie exists
- Check Network tab for API response
- Verify database connection in `.env.local`

---

### Issue: Questions not resetting at midnight

**Possible causes:**
1. Using UTC instead of IST timezone
2. Cached frontend state
3. Unique constraint preventing new block

**Fix:**
```javascript
// Verify date calculation in API
const todayIST = new Date().toLocaleDateString('en-CA', { 
  timeZone: 'Asia/Kolkata' 
});
console.log('Today IST:', todayIST);  // Should be YYYY-MM-DD
```

---

## 📊 Monitoring Queries

### Daily completion rate:
```sql
SELECT 
  date,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE completed = true) as completed,
  ROUND(100.0 * COUNT(*) FILTER (WHERE completed = true) / COUNT(*), 2) as completion_rate
FROM daily_question_blocks
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY date
ORDER BY date DESC;
```

### Average scores by exam:
```sql
SELECT 
  u.preferred_exam,
  COUNT(*) as attempts,
  ROUND(AVG(dqb.score), 2) as avg_score,
  MAX(dqb.score) as max_score,
  MIN(dqb.score) as min_score
FROM daily_question_blocks dqb
JOIN users u ON u.id = dqb.user_id
WHERE dqb.completed = true
  AND dqb.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.preferred_exam
ORDER BY avg_score DESC;
```

### User engagement:
```sql
SELECT 
  user_id,
  COUNT(*) as days_completed,
  ROUND(AVG(score), 2) as avg_score,
  MAX(score) as best_score,
  MAX(date) as last_completed
FROM daily_question_blocks
WHERE completed = true
GROUP BY user_id
ORDER BY days_completed DESC, avg_score DESC
LIMIT 20;
```

---

## ✅ Checklist

Before deploying to production:

- [ ] Database migration run successfully
- [ ] Table `daily_question_blocks` created with all columns
- [ ] Indexes created (user_id+date, date)
- [ ] Tested with new user (random questions)
- [ ] Tested with returning user (personalized questions)
- [ ] Tested daily reset logic
- [ ] Verified question navigation works (1-10)
- [ ] Verified answer submission works
- [ ] Verified results display correctly
- [ ] Verified explanations shown
- [ ] Checked dark mode compatibility
- [ ] Tested on mobile devices
- [ ] Monitoring queries ready
- [ ] Error handling tested (no questions, already completed, etc.)

---

## 🚀 Deploy to Production

```bash
# 1. Commit changes
git add .
git commit -m "feat: Daily 10 Questions with intelligence"

# 2. Push to main
git push origin main

# 3. Run migration on production database
# (Use Supabase SQL Editor or psql with production POSTGRES_URL)

# 4. Verify deployment
# Visit https://krakkify.in and test the feature
```

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check API logs in Vercel dashboard
3. Check database logs in Supabase dashboard
4. Verify environment variables (`POSTGRES_URL`)
5. Test API endpoints with curl/Postman

**Status:** ✅ Code Complete, Ready for Migration

**Next Steps:** Run database migration on production
