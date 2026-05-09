# 🧪 Testing New Auth System - Step by Step

## ✅ Server Status
**Running on:** http://localhost:3000

---

## 🎯 Test Plan

### **Test 1: Sign Up Flow (New User)** ✓

1. **Open**: http://localhost:3000
2. **Click**: "Get Started" or login button
3. **Click**: "Sign Up" button
4. **Enter email**: `test-signup@example.com`
5. **Click**: "Continue"
6. **Check email** or **check terminal/logs** for OTP code
7. **Enter OTP**: 6-digit code
8. **Fill profile form**:
   - Name: `Test User`
   - Age: `25` (optional)
   - Location: `Mumbai, Maharashtra` (optional)
   - Phone: `+91 98765 43210` (optional)
   - Exam: Select `JEE Main` (optional)
9. **Click**: "Start Learning"
10. **Expected**: ✅ Account created, logged in, redirected to dashboard

---

### **Test 2: Sign In Flow (Existing User)** ✓

1. **Logout** first (if logged in)
2. **Click**: Login button
3. **Click**: "Sign In" button
4. **Enter email**: `test-signup@example.com` (from Test 1)
5. **Click**: "Continue"
6. **Enter OTP**: 6-digit code
7. **Expected**: ✅ Logged in immediately (no profile form)

---

### **Test 3: Sign In with Non-Existent Email (Should Fail)** ✓

1. **Logout** first
2. **Click**: Login button
3. **Click**: "Sign In" button
4. **Enter email**: `nonexistent@example.com`
5. **Click**: "Continue"
6. **Enter OTP**: 6-digit code
7. **Expected**: ❌ Error: "No account found. Please sign up first."
8. **Should return to**: Method selection screen

---

### **Test 4: Sign Up with Minimal Info** ✓

1. **Click**: "Sign Up" button
2. **Enter email**: `minimal@example.com`
3. **Verify OTP**
4. **Fill profile**:
   - Name: `Minimal User` (ONLY THIS)
   - Leave all other fields empty
5. **Click**: "Start Learning"
6. **Expected**: ✅ Account created successfully (optional fields work!)

---

### **Test 5: OTP Resend** ✓

1. **Start signup/signin**
2. **Enter email**
3. **Wait** for 60-second countdown
4. **Click**: "Resend code" (after countdown ends)
5. **Expected**: ✅ New OTP sent, countdown restarts

---

### **Test 6: Back Navigation** ✓

1. **Start signup**
2. **Enter email** → Click "Continue"
3. **Click**: "← Back" button
4. **Expected**: ✅ Returns to email entry
5. **Try again** with different email
6. **Should work** without issues

---

### **Test 7: Profile Completion** ✓

1. **Sign up** with full profile info
2. **After login**, go to profile/settings page
3. **Check**: All fields should be saved
   - Name: ✓
   - Age: ✓
   - Location: ✓
   - Phone: ✓
   - Exam: ✓

---

## 📊 **What to Check in Each Test**

### **Visual Checks:**
- ✅ Modal opens smoothly
- ✅ OTP boxes auto-focus
- ✅ Error messages display correctly
- ✅ Success checkmark shows after OTP
- ✅ Form fields look good
- ✅ Dropdown has exams listed

### **Functional Checks:**
- ✅ OTP is received (check email or logs)
- ✅ Can paste OTP (all 6 digits at once)
- ✅ Auto-submits when 6th digit entered
- ✅ Backspace moves to previous box
- ✅ Can't signin without signup
- ✅ Optional fields work when empty

### **Database Checks:**
After each test, check database:
```bash
# Check users table
node -e "
const { createClient } = require('@libsql/client');
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});
client.execute('SELECT * FROM users ORDER BY created_at DESC LIMIT 5')
  .then(r => console.log(JSON.stringify(r.rows, null, 2)));
"
```

Expected fields in database:
- `id` ✓
- `name` ✓
- `email` ✓
- `age` ✓
- `location` ✓
- `phone_number` ✓
- `exam_preparing_for` ✓
- `avatar_color` ✓
- `created_at` ✓

---

## 🐛 **Common Issues & Fixes**

### **Issue: Modal doesn't open**
**Check**: Console for errors
**Fix**: Hard refresh (Cmd+Shift+R)

### **Issue: OTP not received**
**Check**: `.agents/artifacts/dev-server.log` for OTP code
**Fix**: OTP codes are logged in dev mode

### **Issue: "EXAMS is not defined" error**
**Status**: Fixed! (using `getAllExams()` now)
**If still shows**: Hard refresh browser

### **Issue: Form doesn't submit**
**Check**: Name field is filled (required)
**Check**: Console for validation errors

### **Issue: Signin works for new email**
**Expected**: Should fail with error
**If it works**: Bug! User shouldn't be created from signin

---

## ✅ **Success Criteria**

### **Signup Flow:**
- ✅ Email verification works
- ✅ Profile form shows all fields
- ✅ Optional fields can be empty
- ✅ Name is required
- ✅ Exam dropdown has options
- ✅ Account created successfully
- ✅ User logged in after signup

### **Signin Flow:**
- ✅ Email verification works
- ✅ No profile form (direct login)
- ✅ Fails for new emails
- ✅ Works for existing emails
- ✅ User logged in immediately

### **Separation:**
- ✅ Two clear buttons (Sign Up / Sign In)
- ✅ Can't signup from signin
- ✅ Can't signin without account
- ✅ No confusion between flows

---

## 📝 **Test Results Template**

Use this to track your tests:

```
## Test Results - [Date]

### Test 1: Sign Up Flow
- Status: ✅ / ❌
- Notes: 

### Test 2: Sign In Flow
- Status: ✅ / ❌
- Notes: 

### Test 3: Sign In (Non-existent)
- Status: ✅ / ❌
- Notes: 

### Test 4: Minimal Signup
- Status: ✅ / ❌
- Notes: 

### Test 5: OTP Resend
- Status: ✅ / ❌
- Notes: 

### Test 6: Back Navigation
- Status: ✅ / ❌
- Notes: 

### Test 7: Profile Data
- Status: ✅ / ❌
- Notes: 

## Overall Status: ✅ / ❌
```

---

## 🎯 **Quick Test (5 minutes)**

If you just want to verify it works:

1. **Sign Up**: New email → Fill form → Success ✓
2. **Sign In**: Same email → No form → Success ✓
3. **Sign In Fail**: New email → Error ✓

If all 3 pass → **System is working!** 🎉

---

## 🚀 **Next Steps After Testing**

Once all tests pass:

1. ✅ Commit changes
   ```bash
   git add .
   git commit -m "feat: Enhanced signup with profile fields, separate signin/signup"
   ```

2. ✅ Push to production
   ```bash
   git push
   ```

3. ✅ Test on live site (prepgenie.co.in)

4. ✅ Monitor first real signups

---

**Ready to test?** Open http://localhost:3000 in your browser! 🎯
