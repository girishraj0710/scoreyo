# Update User Role to Admin

**Date:** July 13, 2026  
**User:** `girish.raj@salesforce.com`  
**Action:** Role updated from `contributor` to `admin`

---

## 🔍 Issue Found

**Problem:** User `girish.raj@salesforce.com` was still being redirected to `/contributor` portal after the admin access fix.

**Root Cause:** User had `role: 'contributor'` in the database, NOT `role: 'admin'`.

**Database Check:**
```sql
SELECT email, role FROM users WHERE email = 'girish.raj@salesforce.com';

Result:
  email: 'girish.raj@salesforce.com'
  role: 'contributor'  ❌ (incorrect)
```

---

## ✅ Fix Applied

**Database Update:**
```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'girish.raj@salesforce.com';
```

**Result:**
```
✅ Updated:
  email: 'girish.raj@salesforce.com'
  role: 'admin'  ✅ (correct)
```

---

## 🔄 Session Update Required

**How Authentication Works:**

1. User logs in → Cookie `scoreyo-user-id` is set with user ID
2. Page loads → `/api/auth` GET endpoint reads cookie
3. API fetches **fresh user data from database** (including role)
4. UserContext updates with latest data

**Current State:**
- ✅ Database: Role is now `admin`
- ⏳ Session: Still has old `contributor` role cached in browser

**To Apply Changes:**

### Option 1: Hard Refresh (Recommended)
1. Press **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)
2. This forces browser to reload and re-fetch user data
3. UserContext will get updated role from `/api/auth`

### Option 2: Logout & Login
1. Click logout
2. Login again
3. Fresh session will have `admin` role

### Option 3: Navigate to Home
1. Click on "Home" or Scoreyo logo in top bar
2. Page reloads → UserContext fetches fresh data
3. Should see dashboard with admin access

---

## 🎯 Expected Behavior After Refresh

**Before (as contributor):**
```
Login → Auto-redirected to /contributor portal
Can't see dashboard
```

**After (as admin):**
```
Login → Sees student dashboard ✅
Quick actions show 5 cards:
  - Flashcards
  - Study Guides
  - Mock Test
  - Review
  - Contributor Portal (purple, admin-only) ✅

Can access:
  ✅ All student features (quiz, study guides, flashcards, etc.)
  ✅ Contributor portal (via card or sidebar)
  ✅ Settings with exam management
  ✅ Full platform access
```

---

## 🧪 Verification Steps

1. **Hard refresh** the page (Cmd+Shift+R)
2. Check top-right corner → Should NOT be redirected to /contributor
3. Should see home dashboard with stats
4. Check quick actions → Should see **5 cards** (last one is purple "Contributor Portal")
5. Click "Contributor Portal" card → Should navigate to /contributor
6. Navigate back to home → Should stay on dashboard (not redirected)

---

## 📊 Role Hierarchy

| Role | Access |
|------|--------|
| **Admin** | ALL pages (student + contributor) |
| **Contributor** | Only /contributor pages |
| **Student** | Only student pages |

**Admin = Super User**
- Can test all features
- Can create content
- Full platform access
- Never blocked from any page

---

## 🔧 Technical Details

**Database:**
- Table: `users`
- Column: `role` (TEXT)
- Values: `'student'`, `'contributor'`, `'admin'`

**Session:**
- Cookie: `scoreyo-user-id`
- API: `/api/auth` GET
- Fetches: Fresh user data from DB on every page load
- Cache: `no-store` (no caching)

**UserContext:**
```typescript
interface User {
  role?: 'student' | 'contributor' | 'admin';
}

// Computed properties
isAdmin: user?.role === 'admin' || user?.role === 'contributor'
```

**Note:** The `isAdmin` computed property currently treats BOTH admin and contributor as "admin" for backward compatibility. This might need refinement:

```typescript
// Current (treats both as admin):
isAdmin: user?.role === 'admin' || user?.role === 'contributor'

// Better (only true admin):
isAdmin: user?.role === 'admin'
isContributor: user?.role === 'contributor'
```

---

## 📝 Action Required

**Immediate:**
1. ✅ Database updated (role = 'admin')
2. ⏳ **User must refresh browser** to get updated role

**Instructions for User:**
> "Your role has been updated to admin in the database. Please **hard refresh** the page (Cmd+Shift+R on Mac or Ctrl+Shift+R on Windows) to load the new role. After refresh, you'll see the student dashboard with all admin features enabled."

---

## 🎉 Result

Once refreshed:
- ✅ User will see dashboard (not redirected)
- ✅ Admin-only "Contributor Portal" card visible
- ✅ Full access to all platform features
- ✅ Can navigate between student and contributor sections

**Status:** Database Updated ✅ | Refresh Required ⏳
