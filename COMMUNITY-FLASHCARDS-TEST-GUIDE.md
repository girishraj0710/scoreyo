# 🧪 COMMUNITY FLASHCARDS - TEST GUIDE

**Feature**: Auto-share community flashcards (Quizlet-style)  
**Status**: ✅ Implemented & Ready to Test

---

## ✅ What Was Implemented

### Database ✅
- Added engagement tracking columns
- Added user preferences (preferred_exam)
- All decks automatically public
- Migration successful (7 decks migrated)

### API ✅
- Community deck fetching (filtered by exam)
- Study session tracking (counters increment)
- Creator info included in responses

### UI ✅
- Updated page header ("Learn from your peers")
- Filter tabs (All/Mine/Popular)
- Community deck cards with creator info
- Engagement badges (🔥 trending, 👥 students)

---

## 🧪 How to Test

### Step 1: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 2: Set User Exam Preferences

**For testing, you need 2 users with different exams:**

**Option A: Via Database (Quick)**
```sql
-- Open Supabase SQL Editor
-- Set user 1 to GATE
UPDATE users SET preferred_exam = 'gate', username = 'alice_gate' WHERE id = 1;

-- Set user 2 to JEE (for testing isolation)
UPDATE users SET preferred_exam = 'jee', username = 'bob_jee' WHERE id = 2;
```

**Option B: Via UI (Future)**
- Add exam selector during signup
- Add profile settings to change preference

### Step 3: Create Test Decks

**As User 1 (GATE):**
1. Login as user 1
2. Go to /flashcards
3. Generate deck: GATE → Computer Science → Digital Logic
4. Should see deck with "You created" badge

**As User 2 (JEE):**
1. Login as user 2 (different browser/incognito)
2. Go to /flashcards
3. Generate deck: JEE → Physics → Mechanics
4. Should see deck with "You created" badge

### Step 4: Verify Community Discovery

**As User 1 (GATE):**
1. Go to /flashcards
2. Should see:
   - ✅ Your "Digital Logic" deck (with "You created")
   - ✅ Other GATE students' decks (if any exist)
   - ❌ Should NOT see User 2's "Mechanics" deck (different exam)
3. Click filter "My Decks"
   - Should show only your deck
4. Click filter "All Decks"
   - Should show all GATE decks

**As User 2 (JEE):**
1. Go to /flashcards
2. Should see:
   - ✅ Your "Mechanics" deck (with "You created")
   - ✅ Other JEE students' decks (if any exist)
   - ❌ Should NOT see User 1's "Digital Logic" deck (different exam)

### Step 5: Test Engagement Tracking

**As User 1:**
1. Click on User 2's deck (if you have another GATE deck)
2. Study a few cards
3. Go back to /flashcards
4. Deck should now show:
   - "1 today" badge (if studies_today > 0)
   - 👥 1 (unique students count)

**As User 2:**
1. Click same deck
2. Study a few cards
3. Go back
4. Should show:
   - "2 today" badge
   - 👥 2 (two unique students)

### Step 6: Test Trending Badge

**Create a popular deck:**
1. Study the same deck 11+ times (or from different users)
2. Deck should show 🔥 badge with "X today"
3. Click filter "Popular"
4. Should see only trending decks

---

## 🎯 Expected Results

### ✅ Success Criteria:

**Community Discovery:**
- [ ] GATE students see only GATE decks
- [ ] JEE students see only JEE decks
- [ ] Own decks marked "You created"
- [ ] Others' decks show creator username
- [ ] Filter tabs work correctly

**Engagement Tracking:**
- [ ] Studies counter increments on study
- [ ] Unique students count updates
- [ ] Trending badge appears after 10+ studies
- [ ] Counters persist across sessions

**UI/UX:**
- [ ] Page header shows exam context
- [ ] Deck cards show community features
- [ ] Filter buttons highlight correctly
- [ ] Creator avatars display
- [ ] Engagement badges show

---

## 🔍 Debugging

### If Community Decks Don't Show:

**Check 1: User has preferred_exam set**
```sql
SELECT id, name, preferred_exam FROM users WHERE id = YOUR_USER_ID;
```
If null → Set preferred_exam

**Check 2: Decks are public**
```sql
SELECT id, title, exam_id, is_public FROM flashcard_decks;
```
If is_public = false → Run migration again

**Check 3: Exam IDs match**
```sql
SELECT id, title, exam_id FROM flashcard_decks;
```
Check exam_id values match user's preferred_exam

**Check 4: API response**
```javascript
// In browser console on /flashcards page
// Should show array with isMine, creator, analytics
console.log(await fetch('/api/flashcards/decks').then(r => r.json()));
```

### If Engagement Doesn't Track:

**Check terminal logs:**
```
📊 Tracked study session for deck 5 by user 1
```

**Check database:**
```sql
SELECT id, studies_today, unique_students, total_studies 
FROM flashcard_decks 
ORDER BY id;
```

### If Creator Info Missing:

**Check users table has username:**
```sql
SELECT id, name, username FROM users LIMIT 5;
```
If username is null → Set usernames

---

## 🐛 Known Issues & Fixes

### Issue 1: All Decks Show as "You created"

**Cause**: `is_mine` flag logic error  
**Fix**: Check API query uses correct user_id comparison

### Issue 2: No Community Decks Showing

**Cause**: No other users have created decks yet  
**Fix**: Create decks with different test users

### Issue 3: Wrong Exam Filtering

**Cause**: User's preferred_exam doesn't match deck's exam_id  
**Fix**: Ensure consistent exam ID format (lowercase, e.g., 'gate', 'jee')

### Issue 4: Counters Don't Increment

**Cause**: Study API not updating counters  
**Fix**: Check terminal logs for SQL errors

---

## 📊 Test Scenarios

### Scenario 1: Solo User Experience
**Setup**: Only 1 user, no community decks  
**Expected**:
- Shows "My Decks" (your decks)
- Shows sample decks (fallback)
- No community decks yet
- Encourages deck creation

### Scenario 2: Two Users, Same Exam
**Setup**: User A (GATE), User B (GATE)  
**Expected**:
- User A sees their decks + User B's decks
- User B sees their decks + User A's decks
- Both see each other's usernames
- Engagement tracked between them

### Scenario 3: Two Users, Different Exams
**Setup**: User A (GATE), User B (JEE)  
**Expected**:
- User A sees only GATE decks
- User B sees only JEE decks
- No cross-exam visibility
- Clean separation

### Scenario 4: Popular Deck
**Setup**: 1 deck with 10+ studies  
**Expected**:
- Shows 🔥 badge
- "X today" counter
- Appears in "Popular" filter
- Sorted higher in list

---

## 🎉 Success Checklist

**Before marking as complete:**
- [ ] Migration ran successfully
- [ ] API returns community decks
- [ ] UI shows creator info correctly
- [ ] Filters work (All/Mine/Popular)
- [ ] Engagement tracking works
- [ ] Exam-based filtering works
- [ ] No errors in browser console
- [ ] No errors in terminal logs
- [ ] Tested with 2+ users
- [ ] Tested with different exams

---

## 📝 Next Steps After Testing

**If all tests pass:**
1. ✅ Mark feature as production-ready
2. Deploy to staging
3. Test on staging with real data
4. Deploy to production
5. Announce feature to users

**If issues found:**
1. Document specific issue
2. Check debugging steps above
3. Fix and re-test
4. Update this guide with findings

---

## 💡 Future Enhancements

**Phase 2 (Optional):**
- Rating system (5 stars)
- Comments/reviews
- Deck collections
- Creator profiles
- Follow favorite creators
- Email notifications
- Trending feed
- Verified creator badges

**Phase 3 (Advanced):**
- Collaborative decks
- Deck templates
- Import/export
- Public deck discovery page
- Leaderboards
- Challenges

---

## 🆘 Need Help?

**Check:**
1. Terminal logs (npm run dev output)
2. Browser console (F12)
3. Network tab (API responses)
4. Database (Supabase SQL editor)

**Documents:**
- `docs/FLASHCARD-AUTO-COMMUNITY.md` - Full spec
- `docs/FLASHCARD-COMMUNITY-FEATURE.md` - Original design
- `migrations/flashcards-community-auto-share.sql` - Database changes

---

**Happy Testing!** 🚀
