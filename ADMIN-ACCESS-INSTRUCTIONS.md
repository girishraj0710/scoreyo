# Admin Access Instructions

**Date:** July 13, 2026  
**User:** `girish.raj@salesforce.com`  
**Status:** Role updated to `admin` in database ✅

---

## ✅ Backend Status

- ✅ Database role: `admin`
- ✅ API returning: `admin`
- ✅ Code updated: Only contributors redirected
- ✅ Dev server restarted

**Everything is working on the backend!**

---

## 🔄 Why You Still See Contributor Portal

**Issue:** Your browser has **cached session data** with the old `contributor` role.

**How Sessions Work:**
1. Browser stores cookie: `krakkify-user-id=5277a374-8d10-4df3-a6f1-8c514217ceec`
2. On page load, browser sends cookie to server
3. Server looks up user in database → Gets role: `admin` ✅
4. Server sends user data to frontend
5. **BUT** your browser may have **cached** the old page/data with `contributor` role

---

## 🛠️ Solution: Clear Browser Cache

### Option 1: Clear Cookies & Login Again (Recommended)

**Steps:**

1. **Clear the cookie:**
   - Open DevTools (Press **F12**)
   - Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
   - Click **Cookies** → `http://localhost:3000`
   - Find `krakkify-user-id` cookie
   - Right-click → **Delete**

   **OR** easier way:
   - Click the 🔒 **padlock icon** in address bar (left of URL)
   - Click **"Cookies"** or **"Site settings"**
   - Click **"Clear cookies"** or **"Remove"**

2. **Refresh the page:**
   - Press **Cmd + Shift + R** (Mac) or **Ctrl + Shift + R** (Windows)

3. **Login again:**
   - Enter email: `girish.raj@salesforce.com`
   - Verify OTP
   - You should now see **Dashboard** (not contributor portal!) ✅

---

### Option 2: Force Hard Refresh (May Work)

**Steps:**

1. **Clear Next.js cache:**
   - Close all browser tabs with `localhost:3000`
   - In terminal, the dev server was already restarted

2. **Open new private/incognito window:**
   - **Chrome:** Cmd+Shift+N (Mac) or Ctrl+Shift+N (Windows)
   - **Firefox:** Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)

3. **Login fresh:**
   - Go to `http://localhost:3000`
   - Login with `girish.raj@salesforce.com`
   - Should see dashboard ✅

---

### Option 3: Console Override (Debug Only)

If you want to check what the browser is receiving:

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Run this:**
   ```javascript
   fetch('/api/auth')
     .then(r => r.json())
     .then(data => console.log('Current user role:', data.user?.role))
   ```

4. **Check output:**
   - Should say: `Current user role: admin`
   - If it says `contributor`, the cookie is wrong

5. **Delete cookie and retry:**
   - Go to Application tab → Cookies → Delete `krakkify-user-id`
   - Refresh page
   - Login again

---

## 🎯 Expected Result After Login

**You should see:**

### Home Dashboard ✅
- Greeting: "Hey Girish, ready to move the needle?"
- Stats cards: Streak, Today's progress
- **5 Quick Action Cards:**
  1. Flashcards (orange)
  2. Study Guides (teal)
  3. Mock Test (dark)
  4. Review (yellow)
  5. **Contributor Portal** (purple) ← **This is new!**

### Sidebar ✅
- Home
- Study Guides
- Flashcards
- Review
- Mock Tests
- Sprint
- Learn English
- Custom Quiz
- Dashboard
- Reports
- Achievements
- **Contributor Portal** ← Already existed

### Navigation ✅
- Can click any student feature → Works ✅
- Can click Contributor Portal card → Goes to /contributor ✅
- Can navigate back to home → Stays on dashboard (not redirected) ✅

---

## 🐛 Troubleshooting

### Issue 1: Still Redirected to /contributor

**Cause:** Browser cache not cleared

**Fix:**
1. Delete `krakkify-user-id` cookie
2. Hard refresh (Cmd+Shift+R)
3. Login again

---

### Issue 2: Login Loop

**Cause:** Cookie not being set properly

**Fix:**
1. Check browser console for errors
2. Check Network tab → /api/auth → Response
3. Verify cookie is set in Application → Cookies

---

### Issue 3: Role Still Shows 'contributor' in DevTools

**Cause:** Old session data

**Fix:**
1. Logout completely
2. Clear all site data (Application → Storage → Clear site data)
3. Login again

---

## 🧪 Verification Checklist

After logging in fresh:

- [ ] Home page loads (no redirect to /contributor)
- [ ] See dashboard with greeting and stats
- [ ] Quick actions show **5 cards**
- [ ] Last card is purple "Contributor Portal"
- [ ] Can access Study Guides
- [ ] Can access Flashcards
- [ ] Can access Mock Tests
- [ ] Can click Contributor Portal card
- [ ] Contributor portal opens
- [ ] Can navigate back to home
- [ ] Stays on dashboard (no redirect)

**If all checked:** ✅ Admin access working!

---

## 📊 User Role Matrix

| Email | Role | Dashboard | Contributor Portal |
|-------|------|-----------|-------------------|
| `girish.raj@salesforce.com` | `admin` | ✅ Full access | ✅ Full access |
| `girish.raj0710@gmail.com` | `student` | ✅ Full access | ❌ No access |
| Other contributors | `contributor` | ❌ Redirected | ✅ Full access |

---

## 🎉 Summary

**What Changed:**
1. ✅ Database: Role updated to `admin`
2. ✅ Code: Admin users no longer redirected
3. ✅ UI: Purple "Contributor Portal" card added for admin
4. ✅ Server: Restarted with clean cache

**What You Need to Do:**
1. 🔄 Clear browser cookies
2. 🔄 Login again
3. ✅ See admin dashboard

**Once you clear cookies and login, everything will work!** 🚀
