# 🚀 FLASHCARD SYSTEM - QUICK START GUIDE

**Goal**: Get flashcard feature running in 5 minutes

---

## ⚡ STEP 1: RUN DATABASE MIGRATION (2 min)

### Option A: Supabase Dashboard (Easiest)
1. Open: https://supabase.com/dashboard
2. Select your Krakkify project
3. Go to **SQL Editor** (left sidebar)
4. Click **"New Query"**
5. Copy-paste entire content from:
   ```
   migrations/flashcards-schema.sql
   ```
6. Click **"Run"** (bottom right)
7. You should see: ✅ Success (3 tables created, 2 triggers, sample data)

### Option B: Command Line
```bash
# Set your Supabase connection string
export POSTGRES_URL="your-supabase-postgres-url"

# Run migration
psql $POSTGRES_URL -f migrations/flashcards-schema.sql
```

### Verify Migration Worked:
Run this in Supabase SQL Editor:
```sql
-- Should return 3 rows
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' 
AND table_name LIKE 'flashcard%';

-- Should return 1 sample deck
SELECT * FROM flashcard_decks;

-- Should return 2 sample cards
SELECT * FROM flashcards;
```

---

## ⚡ STEP 2: TEST IN DEVELOPMENT (2 min)

```bash
# Start dev server
npm run dev

# Open browser
open http://localhost:3000/flashcards
```

### Test Checklist:
1. ✅ Page loads with AI generator
2. ✅ Fill: Exam = JEE, Subject = Physics, Topic = Thermodynamics
3. ✅ Click "Generate deck"
4. ✅ Wait 5-10 seconds (AI is generating)
5. ✅ Alert shows "✅ Generated 15 flashcards"
6. ✅ Redirects to study page
7. ✅ Click card to flip
8. ✅ Click "Good" rating
9. ✅ Next card appears

**If all ✅ = You're done! Feature is working.**

---

## ⚡ STEP 3: DEPLOY TO PRODUCTION (1 min)

```bash
git add .
git commit -m "feat: Flashcard system with AI generation & spaced repetition"
git push origin main
```

Vercel will auto-deploy in ~2 minutes.

---

## 🎴 HOW TO USE (For Users)

### Create Flashcard Deck:
1. Go to `/flashcards`
2. Select: Exam → Subject → Topic (or just Topic)
3. Click **"Generate deck"**
4. Wait 5-10 seconds
5. Deck created with 15 AI-generated cards
6. Auto-redirects to study

### Study Flashcards:
1. Click any deck from list
2. Tap/Click card to flip
3. Rate your recall:
   - **Again** (Red) = Forgot → Review in <1 min
   - **Hard** (Orange) = Difficult → Review in 1 day
   - **Good** (Green) = Correct → Review in 3-6 days
   - **Easy** (Blue) = Too easy → Review in 7+ days
4. Progress saves automatically
5. Come back tomorrow for spaced review

### Keyboard Shortcuts:
- **Space**: Flip card
- **Arrow Left/Right**: Navigate
- **1-4**: Rate card (1=Again, 2=Hard, 3=Good, 4=Easy)
- **Esc**: Exit study session

---

## 🔧 TROUBLESHOOTING

### Issue: Migration fails
**Fix**: 
1. Check Supabase is connected
2. Ensure no typos in SQL
3. Try running each CREATE TABLE separately

### Issue: AI generation fails
**Fix**:
1. Check OPENROUTER_API_KEY in .env.local
2. Verify API key is valid
3. Check API quota not exceeded

### Issue: Cards don't flip
**Fix**:
1. Hard refresh (Cmd+Shift+R)
2. Check browser console for errors
3. Verify Framer Motion is installed: `npm install framer-motion`

### Issue: Stats show 0
**Fix**:
1. Study at least 1 card first
2. Refresh page
3. Stats update after each study session

---

## 📊 WHAT YOU GET

**Features**:
- ✅ AI-generated flashcards (15 per deck)
- ✅ 3D flip animation
- ✅ Spaced repetition (SM-2 algorithm)
- ✅ Progress tracking
- ✅ Statistics (studied, mastered, accuracy)
- ✅ Keyboard navigation
- ✅ Mobile-optimized
- ✅ Dark mode

**Tech**:
- Backend: PostgreSQL (Supabase)
- AI: OpenRouter (Gemini 2.0 Flash)
- Animation: Framer Motion
- Algorithm: SM-2 spaced repetition

---

## 🎯 EXPECTED BEHAVIOR

**First Time User**:
1. Sees sample decks (if no real decks)
2. Stats show 0
3. Generates first deck → Takes 5-10 seconds
4. Studies cards → Progress tracked
5. Stats update in real-time

**Returning User**:
1. Sees their decks
2. Stats show real data
3. Decks show "X due today" (spaced repetition)
4. Can generate more decks
5. Progress accumulates

---

## 🆘 SUPPORT

**If something breaks**:
1. Check browser console for errors
2. Check Vercel logs: https://vercel.com/dashboard
3. Check Supabase logs: Database → Logs
4. Review `docs/FLASHCARD-IMPLEMENTATION-COMPLETE.md`

**Common fixes**:
- Clear browser cache
- Restart dev server
- Check environment variables
- Verify database connection

---

**That's it! You're ready to use flashcards.** 🎉

Total time: ~5 minutes
