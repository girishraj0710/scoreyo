# 🔍 FLASHCARD SYSTEM - COMPLETE DEBUG GUIDE

**Last Updated**: July 10, 2026  
**Status**: All fixes applied, ready to test

---

## 🐛 Issues Fixed (Today)

### Issue 1: Invalid AI Model ✅ FIXED
- **Problem**: `google/gemini-2.0-flash-exp:free` doesn't exist
- **Solution**: Changed to `google/gemini-2.5-flash-lite`
- **Result**: AI generation works (200 OK, generates 15 cards)

### Issue 2: Deck Data Transformation ✅ FIXED
- **Problem**: Database returns `exam_id`, UI expects `exam`
- **Solution**: Added transformation in GET `/api/flashcards/decks`
- **Result**: Decks display with proper fields

### Issue 3: Exam/Subject ID vs Name ✅ FIXED
- **Problem**: Frontend sent names, backend expected IDs
- **Solution**: Send both - IDs for storage, names for AI
- **Result**: Proper color coding and identification

---

## 🧪 HOW TO TEST (Step-by-Step)

### 1. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 2. Open Browser Console
- Press **F12** or **Cmd+Option+I**
- Go to **Console** tab
- Keep it open during testing

### 3. Navigate to Flashcards
```
http://localhost:3000/flashcards
```

### 4. Generate a Deck

**Selections:**
- Exam: Karnataka CET (or any exam)
- Subject: Physics (or any subject)
- Topic: Units & Measurements (or any topic)
- Click **"Generate deck"** button

### 5. Watch the Logs

**Browser Console** (F12) should show:
```
📤 Sending to API: {
  examId: "kcet",
  subjectId: "physics",
  examName: "Karnataka CET",
  subjectName: "Physics",
  topic: "Units & Measurements"
}
✅ Generation response: { success: true, deck: {...}, cards: [...] }
📦 Deck created: { id: 42, title: "Units & Measurements (Physics)", ... }
🔑 Deck ID: 42
🔄 Refreshing decks...
📥 Fetching decks from API...
✅ Decks fetched: 1 decks
📋 Deck list: [{id: 42, exam: "kcet", subject: "physics", ...}]
🚀 Navigating to: /flashcards/study/42
```

**Terminal** (where npm run dev is running) should show:
```
🎯 [FLASHCARD GENERATE] Request received
👤 User ID: 1
📦 Request body: { examId: "kcet", subjectId: "physics", exam: "Karnataka CET", ... }
🤖 Starting AI generation...
🔧 [AI] Starting generation with params: { exam: "Karnataka CET", ... }
🌐 [AI] Making OpenRouter API call...
🔑 [AI] API Key present: true
📝 [AI] Prompt length: 1842
📡 [AI] Response status: 200 OK
📦 [AI] OpenRouter response structure: { hasChoices: true, ... }
✅ AI generation complete. Cards: 15
💾 Creating deck: Units & Measurements (Physics)
✅ Deck created, ID: 42
📝 Adding cards to deck...
✅ Cards added successfully
```

---

## ✅ Expected Results

### 1. Alert Shows
```
✅ Generated 15 flashcards for Units & Measurements!
```

### 2. Page Redirects
- Auto-redirects to `/flashcards/study/42` (or whatever deck ID)
- Study interface loads with 15 cards

### 3. Deck Appears in List
- If you go back to `/flashcards`
- Deck shows with:
  - **Exam badge**: "KCET" (colored)
  - **Subject title**: "Physics"
  - **Topic**: "Units & Measurements"
  - **Card count**: "15 cards"
  - **Clickable**: Opens study page

### 4. Study Interface Works
- Cards flip on click/tap
- Front shows question
- Back shows answer
- Rating buttons appear after flip
- Progress bar shows completion
- Navigation works (Next/Prev)

---

## ❌ What to Do if It FAILS

### Scenario A: Alert Shows but No Redirect

**Check Browser Console:**
- Look for: `🔑 Deck ID: undefined`
- If undefined → API didn't return deck.id

**Fix**: Check terminal for error after "Creating deck"
```bash
# Should show:
✅ Deck created, ID: 42

# If shows error:
❌ Error: ...
```

**Likely Cause**: Database connection issue

---

### Scenario B: No Alert, Button Just Stops

**Check Browser Console:**
- Look for red error messages
- Likely: CSRF token issue or network error

**Check Terminal:**
- Look for: `❌ [AI] OpenRouter API error:`
- Or: `❌ Error generating flashcards:`

**Fixes**:
1. **CSRF Error**: Clear browser cache, refresh page
2. **API Error**: Check OpenRouter API key in `.env.local`
3. **Network Error**: Check internet connection

---

### Scenario C: Deck Created but Empty

**Check Terminal:**
- Look for: `✅ AI generation complete. Cards: 0`
- If 0 cards → AI returned empty response

**Check Browser Console:**
- Look for: `📦 Deck created: { ..., card_count: 0 }`

**Fix**: AI parsing failed
- Check terminal for: `❌ [AI] No JSON found in AI response`
- Likely: OpenRouter changed response format

---

### Scenario D: Deck Shows but Can't Click

**Check Browser Console:**
- Click the deck card
- Look for: `🚀 Navigating to: /flashcards/study/undefined`
- If undefined → deck.id missing

**Check in console:**
```javascript
// Paste this in console:
document.querySelector('[data-deck-id]')
// Should show deck element with ID
```

**Fix**: Transformation not working
- Check terminal for: `📋 Deck list: [...]`
- Each deck should have `id` field

---

## 🔧 Manual Database Check

If decks are created but not showing, check database:

```sql
-- Connect to Supabase SQL Editor
-- Run this:

SELECT * FROM flashcard_decks ORDER BY created_at DESC LIMIT 5;

-- Should show your recent decks with:
-- id, title, exam_id, subject_id, topic, card_count, etc.

-- Check cards:
SELECT COUNT(*) as card_count FROM flashcards WHERE deck_id = YOUR_DECK_ID;

-- Should return 15
```

---

## 📊 Quick Diagnostic Checklist

**Before Generating:**
- [ ] Dev server running (`npm run dev`)
- [ ] Browser console open (F12)
- [ ] Terminal visible
- [ ] Logged in to app (user_id cookie exists)
- [ ] OPENROUTER_API_KEY in .env.local

**During Generation:**
- [ ] Button shows "Generating..." with spinner
- [ ] Terminal shows emoji logs (🎯, 🤖, etc.)
- [ ] No red errors in browser console
- [ ] API call takes 5-10 seconds (normal)

**After Generation:**
- [ ] Alert shows "Generated 15 flashcards"
- [ ] Page redirects to study page OR
- [ ] Deck appears in list (if no redirect)
- [ ] Deck has ID, exam, subject, topic, cards
- [ ] Clicking deck opens study page

---

## 🚨 Common Errors & Fixes

### Error: "Invalid CSRF token"
**Cause**: CSRF protection blocking request  
**Fix**: Refresh page, try again. If persists, clear cookies.

### Error: "Unauthorized"
**Cause**: Not logged in  
**Fix**: Click login, enter phone, verify OTP

### Error: "Failed to generate flashcards"
**Cause**: AI generation failed  
**Fix**: Check terminal for specific error:
- 404 → Model doesn't exist (already fixed)
- 401 → API key invalid
- 429 → Rate limit exceeded
- 500 → API server error

### Error: "Topic is required"
**Cause**: No topic selected  
**Fix**: Select at least a topic before generating

### Deck shows but clicking does nothing
**Cause**: deck.id is undefined  
**Fix**: Check transformation in `/api/flashcards/decks`

### Redirect happens but 404 page
**Cause**: Study page route issue  
**Fix**: Check `/flashcards/study/[deckId]/page.tsx` exists

---

## 📝 Log Emoji Reference

**Frontend (Browser Console):**
- 📤 = Sending data to API
- ✅ = Success response received
- 📦 = Data structure logged
- 🔑 = Important ID logged
- 🔄 = Refreshing data
- 📥 = Fetching from API
- 📋 = List of items
- 🚀 = Navigation/Redirect
- ❌ = Error occurred

**Backend (Terminal):**
- 🎯 = API endpoint hit
- 👤 = User authentication
- 📦 = Request body
- 🤖 = AI operation
- 🔧 = AI internal step
- 🌐 = External API call
- 🔑 = API key check
- 📝 = Text/Content logged
- 📡 = HTTP response
- 💾 = Database operation
- ✅ = Success
- ❌ = Error

---

## 🎯 Success Criteria

**All these should work:**
1. ✅ Generate deck (5-10 seconds)
2. ✅ Alert shows card count
3. ✅ Deck appears in list
4. ✅ Deck has proper exam/subject/topic
5. ✅ Deck is clickable
6. ✅ Study page opens
7. ✅ Cards flip
8. ✅ Rating works
9. ✅ Progress tracked
10. ✅ Next/Prev navigation

**If all 10 work → Feature is production ready! 🎉**

---

## 📞 Still Stuck?

**Collect these logs:**
1. Full terminal output (from "Request received" to "Cards added")
2. Full browser console output (all emoji logs)
3. Screenshot of the error/issue
4. What you clicked/typed

**Send to developer with:**
- Clear description of what happened
- What you expected to happen
- All logs above

**Debug yourself:**
- Compare your logs with "Expected Results" section
- Find where logs diverge
- Check that specific step in code

---

## 🎊 Working? Celebrate!

If flashcards are working:
1. ✅ Generate 2-3 decks on different topics
2. ✅ Study some cards
3. ✅ Test spaced repetition (rate cards, come back later)
4. ✅ Test on mobile (if using Capacitor)
5. ✅ Test dark mode
6. ✅ Test keyboard shortcuts (Space, 1-4, Esc)

**Then deploy to production! 🚀**

---

**This guide should help debug ANY flashcard issue. Save it!**
