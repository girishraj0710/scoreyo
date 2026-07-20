# 🔧 Fix Supabase Connection Issue

**Error:** `getaddrinfo ENOTFOUND db.zomcofptwlumqkeffbht.supabase.co`  
**Meaning:** The Supabase database hostname cannot be reached.

---

## 🎯 Most Likely Cause: Supabase Project Paused

Supabase **automatically pauses inactive projects** after 1 week of inactivity (free tier).

### ✅ Fix: Restore Supabase Project

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **Find your project:**
   - Look for project with ID: `zomcofptwlumqkeffbht`
   - Or project name related to "PrepGenie" or "Scoreyo"

3. **Check project status:**
   - If you see **"PAUSED"** or **"INACTIVE"** badge → Project is paused
   - Click **"Restore"** or **"Resume"** button

4. **Wait 1-2 minutes:**
   - Project will restart
   - Database will become available

5. **Verify connection string hasn't changed:**
   - Go to **Settings** → **Database**
   - Copy the **Connection string** (URI format)
   - Compare with your `.env.local` `POSTGRES_URL`
   - If different, update `.env.local`

---

## 🔍 Quick Diagnostics

### Check 1: Is the hostname correct?

Your current hostname from `.env.local`:
```
db.zomcofptwlumqkeffbht.supabase.co
```

Expected format: `db.[project-ref].supabase.co`

**Verify in Supabase Dashboard:**
- Settings → Database → Connection string
- Should match exactly

---

### Check 2: Can you reach Supabase at all?

**Test the public API endpoint:**
```bash
curl -I https://zomcofptwlumqkeffbht.supabase.co
```

**Expected if project is active:**
```
HTTP/2 200
```

**Expected if project is paused:**
```
HTTP/2 503
or connection refused
```

---

### Check 3: Is it a network issue?

**Test DNS resolution:**
```bash
nslookup db.zomcofptwlumqkeffbht.supabase.co 8.8.8.8
```

**Expected:**
```
Server:		8.8.8.8
Address:	8.8.8.8#53

Non-authoritative answer:
Name:	db.zomcofptwlumqkeffbht.supabase.co
Address: [some IP address]
```

**If you get "NXDOMAIN" or "can't find":**
- Hostname doesn't exist
- Project may be deleted or paused
- Check Supabase dashboard

---

## 🚀 After Restoring Project

Once your Supabase project is active again:

### 1. Verify connection manually

**Test with psql (if available):**
```bash
psql "postgresql://postgres:PrepGenie2026Secure!@#@db.zomcofptwlumqkeffbht.supabase.co:5432/postgres" -c "SELECT NOW();"
```

**Or test with Node.js:**
```bash
npx tsx -e "
import './scripts/load-env';
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
pool.query('SELECT NOW() as time, current_database() as db')
  .then(r => {
    console.log('✅ Connected to database:', r.rows[0].db);
    console.log('Server time:', r.rows[0].time);
    pool.end();
  })
  .catch(e => {
    console.error('❌ Connection failed:', e.message);
    pool.end();
    process.exit(1);
  });
"
```

### 2. Run the loader again

```bash
npx tsx scripts/load-all-content.ts
```

Should work now!

---

## 🔄 Alternative: Create New Supabase Project

If your project was deleted or you can't restore it:

### Step 1: Create new Supabase project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Name: `scoreyo-prod` (or similar)
4. Region: **Mumbai** (aws-ap-south-1) for best performance
5. Database Password: Use a strong password
6. Wait 2-3 minutes for provisioning

### Step 2: Get new connection string

1. Go to **Settings** → **Database**
2. Scroll to **Connection string**
3. Select **URI** format
4. Copy the connection string

Example:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[NEW-PROJECT-REF].supabase.co:5432/postgres
```

### Step 3: Update .env.local

Replace `POSTGRES_URL` with new connection string:
```bash
POSTGRES_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[NEW-PROJECT-REF].supabase.co:5432/postgres"
```

### Step 4: Re-run database migrations

Since it's a new database, you'll need to recreate tables.

**Check if you have migration files:**
```bash
ls -la migrations/ 2>/dev/null || echo "No migrations directory"
```

**If you have migrations:**
```bash
# Run your migration script
# (You may have a script like: npm run migrate or npx prisma migrate deploy)
```

**If NO migrations:**
You'll need to manually create tables in Supabase dashboard:
- Go to **SQL Editor**
- Run your table creation SQL
- Or let me know and I can help generate the SQL

### Step 5: Load content

```bash
npx tsx scripts/load-all-content.ts
```

---

## 📋 Checklist

Before running loader again:

- [ ] Supabase project is **ACTIVE** (not paused)
- [ ] Connection string in `.env.local` is **correct**
- [ ] Can connect via `psql` or test script
- [ ] Tables exist in database (`english_questions`, `topic_study_content`)
- [ ] Question/material files exist in `content-generated/`

---

## 🆘 Still Not Working?

### Option 1: Check Supabase Status

Go to: https://status.supabase.com/

If there's an outage in Mumbai region, wait for resolution.

### Option 2: Share Error Details

Run this and share output:
```bash
# Test 1: DNS lookup
nslookup db.zomcofptwlumqkeffbht.supabase.co

# Test 2: Curl test
curl -I https://zomcofptwlumqkeffbht.supabase.co/rest/v1/

# Test 3: Env var check
grep "POSTGRES_URL" .env.local | sed 's/:[^@]*@/:***@/'
```

### Option 3: Use Supabase Dashboard

Load content manually through Supabase dashboard:

1. **For Study Materials:**
   - Go to **Table Editor** → `topic_study_content`
   - Click **Insert row**
   - Copy content from `.md` files
   - Paste into fields
   - Repeat for all 7 materials

2. **For Questions:**
   - Go to **SQL Editor**
   - Create a batch insert script
   - Copy questions from JSON files
   - Run the insert SQL

(This is tedious but works as a fallback)

---

## 💡 Pro Tip: Keep Project Active

To prevent Supabase from pausing your project:

1. **Set up a cron job** (ping every 6 days)
2. **Or upgrade to Pro plan** ($25/month, never pauses)
3. **Or use the API regularly** (your production app should do this)

---

**Most Common Fix:** Restore paused project in Supabase dashboard (takes 1-2 minutes) ✅

**Next:** Once project is active, run `npx tsx scripts/load-all-content.ts` again!
