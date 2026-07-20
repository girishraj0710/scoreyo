# ⚠️ CRITICAL: Check Your Supabase Project Status

**Error:** `getaddrinfo ENOTFOUND db.zomcofptwlumqkeffbht.supabase.co`

**Meaning:** The database hostname cannot be resolved via DNS.

**Most Likely Cause:** 🔴 **Your Supabase project is PAUSED** (free tier auto-pauses after 7 days inactivity)

---

## 🚨 STEP 1: Check Project Status (DO THIS FIRST!)

### Go to Supabase Dashboard

1. Open: **https://supabase.com/dashboard**
2. Log in with your account
3. Find project with ID: `zomcofptwlumqkeffbht`
   - Or look for project name "PrepGenie" / "Scoreyo"

### Check Status

**If you see:**
- ❌ **"PAUSED"** badge on project
- ❌ **"INACTIVE"** status
- ❌ **"Project is paused due to inactivity"** message

**This is the problem!** → Proceed to Step 2

**If project is ACTIVE:**
- ✅ Green "Active" badge
- ✅ Can see database tables
- ✅ Connection strings are visible

→ Skip to Step 3 (connection string verification)

---

## 🔄 STEP 2: Restore Paused Project

### Click "Restore" or "Resume" Button

1. On the project card, click **"Restore"** button
2. Or go into project settings → **"Resume Project"**
3. **Wait 1-2 minutes** for project to restart
4. Refresh the page - status should change to "Active"

### Verify Project is Active

Once restored:
- ✅ Project badge shows "Active"
- ✅ Can access Database tab
- ✅ Can access SQL Editor
- ✅ Connection strings are populated

---

## 🔍 STEP 3: Verify Connection Strings

### Transaction Pooler (Recommended - What We're Using)

Go to: **Settings** → **Database** → **Connection string**

**Select:** `Transaction Pooler` (not Session Mode or Direct Connection)

**Expected format:**
```
postgresql://postgres.zomcofptwlumqkeffbht:YOUR-PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

**Key parts:**
- Username: `postgres.zomcofptwlumqkeffbht` (includes project ref)
- Hostname: `aws-1-ap-south-1.pooler.supabase.com` (AWS pooler)
- Port: `6543` (pooler port)

### Compare with Your .env.local

Your current `.env.local` has:
```
POSTGRES_URL="postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
```

**Does the hostname match what you see in Supabase dashboard?**

- ✅ **Yes, it matches** → Connection string is correct, project just needs to be restored
- ❌ **No, it's different** → Copy new connection string from dashboard

---

## ✅ STEP 4: Test Connection After Restore

Once project is active (green badge), run:

```bash
cd /Users/girish.raj/prepgenie
npx tsx scripts/test-connection.ts
```

**Expected output:**
```
🔍 Diagnosing Database Connection

======================================================================

1️⃣  Environment Variable Check:
   POSTGRES_URL: postgresql://postgres.zomcofptwlumqkeffbht:...

2️⃣  Parsed Connection String:
   Protocol: postgresql:
   Hostname: aws-1-ap-south-1.pooler.supabase.com
   Port: 6543
   Username: postgres.zomcofptwlumqkeffbht
   Database: postgres

3️⃣  Testing Connection...

✅ CONNECTION SUCCESS!

   Server Time: 2026-06-15 ...
   Database: postgres
   Version: PostgreSQL 15.x
```

**If this works** → Proceed to Step 5

**If still fails** → Check Step 6 (troubleshooting)

---

## 🚀 STEP 5: Load Content

Once connection test passes:

```bash
npx tsx scripts/load-all-content.ts
```

This should now work and load:
- **3 study materials** (parts-of-speech, present-tenses, subject-verb-agreement)
- **427 questions** (pronunciation, pronouns, adjectives, nouns, verbs)

---

## 🔧 STEP 6: Troubleshooting (If Still Fails)

### Issue A: "Still getting ENOTFOUND error"

**Possible causes:**
1. Project is still starting (wait another minute, try again)
2. DNS cache on your machine (flush DNS cache)
3. Supabase regional issue (check https://status.supabase.com)

**Try:**
```bash
# Flush DNS cache (macOS)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Wait 30 seconds, then test again
npx tsx scripts/test-connection.ts
```

### Issue B: "Connection timeout"

**Solution:** Add timeout to connection string

Edit `.env.local`:
```bash
POSTGRES_URL="postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?connect_timeout=30"
```

### Issue C: "SSL required"

**Solution:** Add SSL mode

Edit `.env.local`:
```bash
POSTGRES_URL="postgresql://postgres.zomcofptwlumqkeffbht:PrepGenie2026Secure%21%40%23@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require"
```

### Issue D: "Authentication failed"

**Solution:** Password might have changed

1. Go to Supabase Dashboard → Settings → Database
2. Click **"Reset database password"**
3. Set new password: `PrepGenie2026Secure!@#` (or copy new one)
4. Update `.env.local` with URL-encoded password:
   - `!` → `%21`
   - `@` → `%40`
   - `#` → `%23`

---

## 📋 Quick Checklist

Before running loader:

- [ ] Supabase project shows **"Active"** status (not "Paused")
- [ ] Can access Database tab in Supabase dashboard
- [ ] Connection string in dashboard matches `.env.local`
- [ ] Test connection script runs successfully
- [ ] Question/material files exist in `content-generated/` directory

---

## 💡 Why Does Supabase Pause Projects?

**Free Tier Policy:**
- Projects with **zero activity for 7 days** are auto-paused
- "Activity" = any database query, API call, or auth request
- Paused projects **keep all data** (nothing is deleted)
- **Restore is instant** (1-2 minute restart)

**How to prevent future pauses:**
- Upgrade to Pro ($25/month) - never pauses
- Set up a cron job to ping database every 6 days
- Use your production app regularly (your app at https://scoreyo.in should keep it active)

---

## 🎯 Expected Next Steps

1. ✅ Restore Supabase project (if paused)
2. ✅ Run connection test script
3. ✅ Run content loader
4. ✅ Verify content appears in database
5. ✅ Test on production site: https://scoreyo.in/english

---

## 🆘 Still Stuck?

Share the output of:
```bash
# 1. Test connection
npx tsx scripts/test-connection.ts

# 2. Check project status
curl -I https://zomcofptwlumqkeffbht.supabase.co

# 3. DNS lookup
nslookup aws-1-ap-south-1.pooler.supabase.com
```

---

**Most Common Fix:** Restore paused project in Supabase dashboard → takes 1-2 minutes ✅

**Current Status:** Project needs to be active before loading can proceed

**Last Updated:** June 15, 2026
