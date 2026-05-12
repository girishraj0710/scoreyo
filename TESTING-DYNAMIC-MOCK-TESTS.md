# Testing Dynamic Mock Tests - Quick Guide

## ⚠️ Important: You Must Be Logged In

The mock test page shows different content based on login status:

### If NOT Logged In (What you're seeing now):
```
┌─────────────────────────────────────────┐
│  Full-Length Mock Tests Landing Page   │
│  ─────────────────────────────────────  │
│  • Feature descriptions                 │
│  • "Get Started - It's Free" button     │
│  • No actual test selection             │
└─────────────────────────────────────────┘
```

### If Logged In (What you should see):
```
┌─────────────────────────────────────────┐
│  Mock Tests - Select Your Exam         │
│  ─────────────────────────────────────  │
│  [Short Practice] [Full-Length]        │
│                                         │
│  🎯 JEE Main                            │
│     22+ Tests Available 🚀               │
│     [1][2][3][4][5][6][7][8][9][10]    │
│     + 12 more tests available           │
│                                         │
│  🎯 NEET UG                             │
│     40+ Tests Available 🚀               │
│     [1][2][3][4][5][6][7][8][9][10]    │
│     + 30 more tests available           │
└─────────────────────────────────────────┘
```

---

## 🔐 How to Log In and Test

### Step 1: Go to Login Page
```
http://localhost:3000
```
Click "Login" button in the header

### Step 2: Use Test Account (or create new)
```
Email: test@prepgenie.co.in
OTP: (will be sent to email)
```

OR create a new account:
```
Name: Test User
Email: your-email@gmail.com
Age: 22
Exam: JEE Main
```

### Step 3: Navigate to Mock Tests
```
http://localhost:3000/mock-test
```

OR click "Mock Tests" in the navigation menu

---

## ✅ What to Verify

Once logged in, check these features:

### 1. Dynamic Test Count
Look for exams showing **more than 3 tests**:
```
✅ "22+ Tests Available 🚀" (instead of just 3 tests)
✅ Test selector: [1][2][3][4][5][6][7][8][9][10]
✅ "+ 12 more tests available" message
```

### 2. Test Selection
Click on different test numbers:
```
✅ Click Test #5 → Bottom bar shows "Test 5 of 22+"
✅ Click Test #10 → Bottom bar shows "Test 10 of 22+"
✅ Each test number should be selectable
```

### 3. Start Test
```
1. Select an exam (e.g., JEE Main)
2. Select a test number (e.g., Test #5)
3. Click "Start Test" button
4. Should load 30 unique questions
```

### 4. Verify Questions Are Different
```
1. Complete Test #1 (note some questions)
2. Go back and start Test #2
3. Questions should be DIFFERENT (no overlap)
```

---

## 🐛 Troubleshooting

### Issue: "Only 3 tests shown"

**Possible Causes:**
1. **Not logged in** → Log in first
2. **Exam not mapped** → Only 10 exams are currently mapped for dynamic generation
3. **Browser cache** → Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

**Solution:**
```bash
# Clear browser cache and reload
# Or open in incognito mode
```

### Issue: "No questions available"

**Cause:** Subject doesn't have enough questions in cached_questions table

**Solution:**
```bash
# Check question count
npx tsx scripts/analyze-question-bank.ts

# Look for subjects with <100 questions
# Those exams will have limited tests
```

### Issue: "Page shows landing page"

**Cause:** Not logged in (cookie `prepgenie-user-id` not set)

**Solution:**
1. Click "Login" button
2. Complete OTP verification
3. Navigate to `/mock-test` again

---

## 📊 Expected Behavior (When Logged In)

### Exams with High Capacity (✅ Good)
```
NEET UG:    40+ tests available
SSC CGL:    42+ tests available
UPSC CSE:   50+ tests available
```

### Exams with Medium Capacity (⚠️ OK)
```
JEE Main:   22+ tests available
GATE CS:    12+ tests available
CAT:        17+ tests available
```

### Exams Not Yet Mapped (❌ Static)
```
NDA:        3 tests (static config)
CDS:        3 tests (static config)
CLAT:       3 tests (static config)
```

---

## 🧪 Testing Checklist

Once logged in, verify:

- [ ] Can see exam cards with dynamic test count
- [ ] "22+ Tests Available 🚀" badge shows
- [ ] Test selector shows numbers 1-10
- [ ] "+ X more tests available" message appears
- [ ] Clicking test number updates selection
- [ ] Bottom bar shows "Test X of Y+"
- [ ] Can start test with selected number
- [ ] Questions load successfully
- [ ] Different test numbers give different questions

---

## 📝 Current Limitations

1. **Only 10 exams mapped** for dynamic generation:
   - JEE Main, JEE Advanced, NEET UG
   - UPSC CSE, GATE CS
   - SSC CGL, SSC CHSL
   - IBPS PO, SBI PO, CAT

2. **Other 40+ exams** still use static 3-test config:
   - Will be migrated to dynamic system soon
   - Takes ~5 minutes per exam to add mapping

3. **UI shows first 10 tests**:
   - Even if 40 tests available
   - Shows "+ 30 more available" message
   - Can increase this limit in future

---

## 🚀 Quick Test (1 Minute)

```bash
1. Open: http://localhost:3000
2. Click: "Login" → Enter test credentials
3. Click: "Mock Tests" in navigation
4. Look for: "22+ Tests Available 🚀" badge
5. Click: Test #5
6. Verify: Bottom bar says "Test 5 of 22+"
7. Click: "Start Test"
8. Success: 30 questions load ✅
```

---

## 💡 Pro Tip

If you want to test WITHOUT logging in:

**Option 1**: Mock the authentication in browser console
```javascript
// Set fake user cookie
document.cookie = "prepgenie-user-id=test-user-123; path=/";
// Reload page
location.reload();
```

**Option 2**: Temporarily bypass auth check in code
```typescript
// In src/app/mock-test/page.tsx
// Change: if (!user) { return <landing-page> }
// To: if (false) { return <landing-page> }
```

---

## 📞 Need Help?

If tests still don't show:

1. **Check server logs**:
   ```bash
   tail -f /tmp/nextjs-dev.log
   ```

2. **Check browser console** (F12):
   - Look for API errors
   - Check network tab for failed requests

3. **Verify database**:
   ```bash
   npx tsx scripts/analyze-question-bank.ts
   ```

4. **Check if dynamic generation is being used**:
   ```bash
   # Server logs should show:
   "[MockTest] Using dynamic generation for jee-main test 5"
   ```

---

**TL;DR**: Log in first, then navigate to `/mock-test` to see the dynamic test system! 🎯
