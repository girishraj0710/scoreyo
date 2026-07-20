# 🔧 Scoreyo Maintenance Manual

**Purpose:** Complete guide for all manual maintenance tasks after launch  
**Last Updated:** May 17, 2026  
**Launch Date:** May 30, 2026

---

## 📋 **Table of Contents**

1. [Daily Tasks](#daily-tasks) (5-10 min/day)
2. [Weekly Tasks](#weekly-tasks) (15-30 min/week)
3. [Monthly Tasks](#monthly-tasks) (1-2 hours/month)
4. [Quarterly Tasks](#quarterly-tasks) (2-3 hours/quarter)
5. [Annual Tasks](#annual-tasks) (3-4 hours/year)
6. [As-Needed Tasks](#as-needed-tasks) (variable)
7. [Emergency Procedures](#emergency-procedures)

---

## 🌅 **Daily Tasks** (5-10 min/day)

### 1. **Check Platform Health**
**Frequency:** Every morning (9 AM IST)  
**Time:** 2-3 minutes  
**Tools:** Vercel Dashboard

**Steps:**
1. Go to: https://vercel.com/dashboard
2. Check deployment status:
   - Latest deployment: ✅ Ready (green)
   - No failed builds in last 24 hours
3. Check function logs:
   - Click: **Logs** tab
   - Look for errors (red lines)
   - Common to ignore: 404s on favicon, bots

**What to look for:**
- ✅ Green status = All good
- ⚠️ Yellow warnings = Monitor, usually fine
- ❌ Red errors = Investigate immediately

**When to act:**
- If deployment failed: Check GitHub commit, fix code
- If 500 errors: Check database connection, API keys
- If high error rate (>5% requests): Investigate logs

---

### 2. **Monitor Cron Jobs**
**Frequency:** Every morning (9 AM IST)  
**Time:** 2 minutes  
**Tools:** Vercel Dashboard

**Steps:**
1. Go to: Vercel Dashboard → **Crons** tab
2. Check last run status:
   - **Daily Seed (2 AM):** Completed ✅
   - Shows: "600 questions added" or similar
3. If failed: Click to see error logs

**Expected Results:**
```
Daily Seed Cron (2 AM IST):
  Status: Completed ✅
  Duration: 15-20 minutes
  Questions added: 500-800
  Topics seeded: 20-30
```

**When to act:**
- If failed 2+ days in a row: Investigate
- If 0 questions added: Check API quota, database
- If timeout: Increase Vercel function timeout

**Check logs:**
```bash
# Locally (if needed)
tail -50 daily-seed-cron.log
```

---

### 3. **Check Question Reports**
**Frequency:** Every morning (9 AM IST)  
**Time:** 3-5 minutes  
**Tools:** Database query

**Steps:**
1. Check for reported questions:
```bash
npx tsx -e "
import { Pool } from 'pg';
const pool = new Pool({
  url: process.env.POSTGRES_URL,
  authToken: process.env.POSTGRES_PASSWORD
});
const result = await db.execute(
  \"SELECT COUNT(*) as count FROM reported_questions WHERE status = 'pending'\"
);
console.log(\`Pending reports: \${result.rows[0].count}\`);
"
```

2. If reports > 0, review them:
```bash
npx tsx -e "
import { Pool } from 'pg';
const pool = new Pool({
  url: process.env.POSTGRES_URL,
  authToken: process.env.POSTGRES_PASSWORD
});
const result = await db.execute(
  \"SELECT * FROM reported_questions WHERE status = 'pending' ORDER BY created_at DESC LIMIT 10\"
);
console.table(result.rows);
"
```

**When to act:**
- Review each report
- If valid issue: Fix question or remove it
- Mark as resolved:
```sql
UPDATE reported_questions SET status = 'resolved' WHERE id = ?
```

---

## 📅 **Weekly Tasks** (15-30 min/week)

### 1. **Review User Analytics**
**Frequency:** Every Monday (10 AM IST)  
**Time:** 10-15 minutes  
**Tools:** Database queries

**Steps:**

1. **Check user growth:**
```bash
npx tsx -e "
import { Pool } from 'pg';
const pool = new Pool({
  url: process.env.POSTGRES_URL,
  authToken: process.env.POSTGRES_PASSWORD
});

// Total users
const total = await db.execute('SELECT COUNT(*) as count FROM users');
console.log(\`Total users: \${total.rows[0].count}\`);

// New users this week
const week = await db.execute(
  \"SELECT COUNT(*) as count FROM users WHERE created_at > datetime('now', '-7 days')\"
);
console.log(\`New users (7 days): \${week.rows[0].count}\`);

// Active users (quiz in last 7 days)
const active = await db.execute(
  \"SELECT COUNT(DISTINCT user_id) as count FROM quiz_sessions WHERE created_at > datetime('now', '-7 days')\"
);
console.log(\`Active users: \${active.rows[0].count}\`);
"
```

2. **Check quiz stats:**
```bash
npx tsx -e "
import { Pool } from 'pg';
const pool = new Pool({
  url: process.env.POSTGRES_URL,
  authToken: process.env.POSTGRES_PASSWORD
});

// Quizzes this week
const quizzes = await db.execute(
  \"SELECT COUNT(*) as count FROM quiz_sessions WHERE created_at > datetime('now', '-7 days')\"
);
console.log(\`Quizzes taken (7 days): \${quizzes.rows[0].count}\`);

// Popular exams
const popular = await db.execute(
  \"SELECT exam_id, COUNT(*) as count FROM quiz_sessions WHERE created_at > datetime('now', '-7 days') GROUP BY exam_id ORDER BY count DESC LIMIT 5\"
);
console.log('Most popular exams:');
console.table(popular.rows);
"
```

**What to track:**
- User growth rate (target: 10-20% week-over-week initially)
- Active user rate (target: 60-70% of total users)
- Quiz completion rate (target: 80%+)
- Popular exams (focus seeding efforts here)

---

### 2. **Check API Quota Usage**
**Frequency:** Every Monday (10 AM IST)  
**Time:** 2 minutes  
**Tools:** OpenRouter Dashboard

**Steps:**
1. Go to: https://openrouter.ai/dashboard
2. Check usage:
   - Daily requests: Should be ~800-1000 (LAUNCH_PREP) or ~120 (MAINTENANCE)
   - Remaining quota: Should be 0-200 unused/day
3. Check balance:
   - After $10 top-up: Unlimited free tier (1000/day)
   - If approaching limit: Top up more

**When to act:**
- If hitting quota limit daily: Upgrade plan or reduce seeding
- If 0 usage for 2+ days: Cron might be failing
- If spike in usage: Check for bot abuse

---

### 3. **Database Backup Verification**
**Frequency:** Every Monday (10 AM IST)  
**Time:** 2 minutes  
**Tools:** Supabase CLI

**Steps:**
1. Verify Supabase auto-backup:
```bash
# Check database in Supabase Dashboard
```

2. Check:
   - Last backup date: Within 24 hours ✅
   - Backup size: Increasing (means data growing)

**Supabase Backup Policy:**
- Automatic daily backups ✅
- 30-day retention
- Point-in-time recovery available

**When to act:**
- If no recent backup: Contact Supabase support
- If backup size decreasing: Data loss? Investigate

**Manual backup (optional, monthly):**
```bash
# Export to JSON
# Use Supabase SQL Editor for queries
```

---

## 📆 **Monthly Tasks** (1-2 hours/month)

### 1. **Payment Reconciliation**
**Frequency:** First week of each month  
**Time:** 30-45 minutes  
**Tools:** Razorpay Dashboard, Database

**Steps:**

1. **Export Razorpay transactions:**
   - Go to: https://dashboard.razorpay.com/
   - Reports → Payments
   - Export last month's data

2. **Cross-check with database:**
```bash
npx tsx -e "
import { Pool } from 'pg';
const pool = new Pool({
  url: process.env.POSTGRES_URL,
  authToken: process.env.POSTGRES_PASSWORD
});

// Payments last month
const payments = await db.execute(
  \"SELECT plan, amount, COUNT(*) as count, SUM(amount) as total FROM subscriptions WHERE created_at > datetime('now', '-30 days') GROUP BY plan, amount\"
);
console.table(payments.rows);
"
```

3. **Verify:**
   - Database count = Razorpay count ✅
   - Database total = Razorpay total ✅
   - All payment_ids match

**Expected Monthly Revenue (Post-Launch):**
```
Month 1: ₹5,000 - ₹10,000 (100-150 Pro users)
Month 3: ₹15,000 - ₹25,000 (300-400 Pro users)
Month 6: ₹50,000 - ₹75,000 (800-1000 Pro users)
```

**When to act:**
- Mismatch: Investigate failed payments, refunds
- High refund rate (>5%): Check user complaints
- Low conversion (<5%): Improve free tier limits

---

### 2. **Content Quality Audit**
**Frequency:** First Sunday of each month  
**Time:** 45-60 minutes  
**Tools:** Database, manual review

**Steps:**

1. **Check question quality metrics:**
```bash
npx tsx -e "
import { Pool } from 'pg';
const pool = new Pool({
  url: process.env.POSTGRES_URL,
  authToken: process.env.POSTGRES_PASSWORD
});

// Questions by source
const sources = await db.execute(
  'SELECT source, COUNT(*) as count FROM exam_questions GROUP BY source'
);
console.log('Questions by source:');
console.table(sources.rows);

// Questions by difficulty
const difficulty = await db.execute(
  'SELECT difficulty, COUNT(*) as count FROM exam_questions GROUP BY difficulty'
);
console.log('Questions by difficulty:');
console.table(difficulty.rows);

// Low-stock topics
const lowStock = await db.execute(
  \"SELECT exam_id, subject_id, topic, COUNT(*) as count FROM exam_questions WHERE valid_from <= strftime('%Y', 'now') AND (valid_until IS NULL OR valid_until >= strftime('%Y', 'now')) GROUP BY exam_id, subject_id, topic HAVING count < 100 ORDER BY count ASC LIMIT 20\"
);
console.log('Low-stock topics (< 100 questions):');
console.table(lowStock.rows);
"
```

2. **Manually review 10 random questions:**
```bash
npx tsx -e "
import { Pool } from 'pg';
const pool = new Pool({
  url: process.env.POSTGRES_URL,
  authToken: process.env.POSTGRES_PASSWORD
});

// Random sample
const sample = await db.execute(
  'SELECT exam_id, subject_id, topic, question, explanation FROM exam_questions ORDER BY RANDOM() LIMIT 10'
);
console.table(sample.rows);
"
```

3. **Check for:**
   - Grammatical errors
   - Incorrect answers
   - Too easy/hard questions
   - Explanation quality (50+ words, clear)

**Quality Targets:**
- 95%+ questions with 50+ word explanations ✅
- Difficulty distribution: 30% easy, 40% medium, 30% hard ✅
- All topics: 100+ questions minimum ✅
- User report rate: <1% of quizzes ✅

**When to act:**
- If quality issues found: Fix or remove questions
- If low-stock topics: Run comprehensive seeder
- If high report rate: Review AI prompt quality

---

### 3. **Performance Review**
**Frequency:** Last Sunday of each month  
**Time:** 30 minutes  
**Tools:** Vercel Analytics

**Steps:**

1. **Check Vercel Analytics:**
   - Go to: Vercel Dashboard → Analytics
   - Review:
     - Page load times: <2 seconds ✅
     - Function duration: <1 second ✅
     - Error rate: <1% ✅

2. **Check database query performance:**
```bash
# Run a few typical queries and time them
time npx tsx -e "
import { Pool } from 'pg';
const pool = new Pool({
  url: process.env.POSTGRES_URL,
  authToken: process.env.POSTGRES_PASSWORD
});
await db.execute(
  \"SELECT * FROM exam_questions WHERE exam_id = 'jee-main' AND subject_id = 'physics' AND valid_from <= 2026 AND (valid_until IS NULL OR valid_until >= 2026) ORDER BY RANDOM() LIMIT 10\"
);
"
```

**Expected:**
- Quiz generation: <500ms ✅
- Database queries: <100ms ✅
- Page loads: <2s ✅

**When to act:**
- If slow queries (>1s): Add indexes
- If slow page loads: Optimize images, code
- If high bandwidth: Check for DDoS, bots

---

### 4. **Security Audit**
**Frequency:** Last Sunday of each month  
**Time:** 15-20 minutes  
**Tools:** Manual checks

**Steps:**

1. **Check for suspicious activity:**
```bash
# Unusual signup patterns
npx tsx -e "
import { Pool } from 'pg';
const pool = new Pool({
  url: process.env.POSTGRES_URL,
  authToken: process.env.POSTGRES_PASSWORD
});

// Signups by day (last 30 days)
const signups = await db.execute(
  \"SELECT DATE(created_at) as date, COUNT(*) as count FROM users WHERE created_at > datetime('now', '-30 days') GROUP BY date ORDER BY date DESC\"
);
console.table(signups.rows);
"
```

2. **Check API keys are still valid:**
   - OpenRouter: https://openrouter.ai/keys
   - Razorpay: https://dashboard.razorpay.com/
   - Resend: https://resend.com/api-keys
   - Supabase: Run `# Check connection in Supabase Dashboard`

3. **Review Vercel logs for unusual patterns:**
   - High failure rate from single IP
   - Multiple payment attempts
   - Scraping patterns

**When to act:**
- Spike in signups: Check for bot signups
- Failed API keys: Regenerate and update
- Suspicious IPs: Block via Vercel firewall

---

## 📊 **Quarterly Tasks** (2-3 hours/quarter)

### 1. **Dependency Updates**
**Frequency:** Every 3 months (Jan, Apr, Jul, Oct)  
**Time:** 1-2 hours  
**Tools:** npm

**Steps:**

1. **Check for outdated packages:**
```bash
npm outdated
```

2. **Update non-breaking changes:**
```bash
npm update
```

3. **Test locally:**
```bash
npm run build
npm run dev
# Test quiz generation, payments, etc.
```

4. **Update major versions (carefully):**
```bash
# One at a time
npm install next@latest
npm install pg@latest
# Test after each
```

5. **Commit and deploy:**
```bash
git add package.json package-lock.json
git commit -m "chore: Update dependencies (Q2 2026)"
git push
```

**When to act:**
- Security updates: Immediately (don't wait for quarterly)
- Major version bumps: Test thoroughly before deploying
- Breaking changes: Read migration guides first

---

### 2. **Cost Review**
**Frequency:** Every 3 months  
**Time:** 30 minutes  
**Tools:** All service dashboards

**Steps:**

1. **Review all service costs:**

**Vercel:**
- Go to: Vercel Dashboard → Usage
- Current plan: Hobby (Free) or Pro ($20/month)
- Check: Function executions, bandwidth
- Decision: Upgrade if hitting limits

**Supabase:**
- Go to: Supabase Dashboard → Billing
- Current plan: Free (500 MB) or Paid
- Check: Database size, query count
- Decision: Upgrade if needed

**OpenRouter:**
- Go to: https://openrouter.ai/settings
- Balance: Should have credit remaining
- Daily usage: 800-1000 requests (LAUNCH_PREP) or 120 (MAINTENANCE)
- Decision: Top up if balance low

**Razorpay:**
- Fees: 2% per transaction (industry standard)
- Revenue sharing: 0% (direct to you)

**Resend:**
- Free: 3,000 emails/month
- Paid: $20/month for 50,000 emails
- Decision: Upgrade if OTP volume high

2. **Calculate total costs:**
```
Vercel: $0-20/month
Supabase: $0-25/month
OpenRouter: $0/month (after $10 top-up, unlimited free tier)
Razorpay: 2% of revenue
Resend: $0-20/month
Domain: ₹1000/year (~₹85/month)

Total: ₹1,500 - ₹5,000/month depending on scale
```

**Break-even analysis:**
```
Fixed costs: ~₹2,500/month
Pro subscription: ₹79/month
Break-even: 32 Pro users

Target: 100+ Pro users = Profitable! ✅
```

---

### 3. **Feature Planning**
**Frequency:** Every 3 months  
**Time:** 1 hour  
**Tools:** User feedback, analytics

**Steps:**

1. **Review user feedback:**
   - Check emails
   - Check contact form submissions
   - Social media mentions

2. **Analyze feature usage:**
```bash
# Mock test usage
npx tsx -e "
import { Pool } from 'pg';
const pool = new Pool({
  url: process.env.POSTGRES_URL,
  authToken: process.env.POSTGRES_PASSWORD
});
const mockTests = await db.execute(
  \"SELECT COUNT(*) as count FROM quiz_sessions WHERE exam_id LIKE '%mock%'\"
);
console.log(\`Mock tests taken: \${mockTests.rows[0].count}\`);
"
```

3. **Prioritize features:**
   - High demand, high impact: Do next quarter
   - High demand, low impact: Nice to have
   - Low demand: Defer

**Example roadmap:**
```
Q3 2026:
  - Video explanations for top 100 questions
  - Mobile app (Capacitor)
  - Social sharing (leaderboards)

Q4 2026:
  - AI doubt clearing chat
  - Personalized study plans
  - Offline mode

Q1 2027:
  - Live classes integration
  - Peer-to-peer challenges
  - Gamification (badges, achievements)
```

---

## 📅 **Annual Tasks** (3-4 hours/year)

### 1. **Syllabus Review & Update**
**Frequency:** Every May-June  
**Time:** 2-3 hours  
**Tools:** Official exam websites, scripts

**Steps:**

**Detailed workflow documented in:** `SYLLABUS-CURRENCY-SYSTEM.md`

**Quick checklist:**

1. **May 15: Check official notifications** (1 hour)
   - NTA (JEE/NEET): https://nta.ac.in/
   - State boards: Check respective sites
   - GATE: https://gate.iitm.ac.in/
   - Banking/SSC: Official websites

2. **May 20: Update config if changed** (30 min)
```bash
# If JEE Main syllabus changed
npx tsx scripts/update-syllabus.ts jee-main 2027 "Added ML topics"

# Commit
git add src/lib/syllabus-config.ts
git commit -m "chore: Update JEE Main syllabus to 2027"
git push
```

3. **June 1: Annual cron runs automatically** (0 min)
   - Sets valid_until on old questions
   - New questions get seeded daily

4. **June 5: Verify update worked** (30 min)
```bash
# Check validity distribution
npx tsx -e "
import { Pool } from 'pg';
const pool = new Pool({
  url: process.env.POSTGRES_URL,
  authToken: process.env.POSTGRES_PASSWORD
});
const result = await db.execute(
  'SELECT exam_id, valid_from, valid_until, COUNT(*) as count FROM exam_questions GROUP BY exam_id, valid_from, valid_until ORDER BY exam_id'
);
console.table(result.rows);
"
```

**Expected effort:**
- If NO syllabi changed: 1 hour (just verification)
- If 1-2 syllabi changed: 2 hours (update + verify)
- If many syllabi changed: 3 hours (update all + verify)

---

### 2. **Domain & SSL Renewal**
**Frequency:** Every year (domain expiry date)  
**Time:** 15 minutes  
**Tools:** Domain registrar

**Steps:**

1. **Domain renewal** (scoreyo.in):
   - Registrar: (your domain provider)
   - Cost: ~₹1,000/year
   - Action: Enable auto-renewal ✅

2. **SSL certificate**:
   - Vercel handles automatically ✅
   - Check: https://scoreyo.in (should show 🔒)
   - No action needed (auto-renews)

**Set calendar reminder:**
- 30 days before expiry: Check renewal status
- 7 days before expiry: Manually renew if auto-renewal failed

---

### 3. **Tax Filing**
**Frequency:** Every year (before tax deadline)  
**Time:** 2-3 hours (with CA)  
**Tools:** Razorpay reports, accounting software

**Steps:**

1. **Export revenue report:**
   - Razorpay: Full year transaction export
   - Database: Subscription counts

2. **Calculate:**
   - Total revenue
   - Expenses (server costs, domain, etc.)
   - Net profit

3. **File taxes:**
   - GST registration (if revenue > ₹20 lakhs)
   - Income tax filing
   - Consult CA for proper filing

**Tip:** Keep monthly payment reconciliation records (makes annual filing easy)

---

## 🆘 **As-Needed Tasks** (Variable)

### 1. **User Support**
**Frequency:** As users report issues  
**Time:** 5-15 min per issue  
**Tools:** Email, contact form

**Common issues:**

**Payment Failed:**
```
1. Check Razorpay dashboard for payment ID
2. If payment captured but subscription not created:
   - Manually create subscription in database
3. If payment failed:
   - Ask user to retry
   - Check if card/UPI was charged (refund if yes)
```

**OTP Not Received:**
```
1. Check Resend dashboard for delivery status
2. If delivered but not received:
   - Check spam folder
   - Try different email
3. If delivery failed:
   - Check Resend quota
   - Check email validity
```

**Quiz Not Loading:**
```
1. Check Vercel logs for errors
2. Check database for questions in that topic
3. If no questions:
   - Run seeding for that topic
4. If error in logs:
   - Fix bug, deploy
```

**Expected volume:**
- Week 1: 10-20 support requests/day
- Week 2-4: 5-10 requests/day
- Month 2+: 2-5 requests/day

**Response time target:**
- Critical (payment, access): <2 hours
- High (quiz issues): <6 hours
- Medium (feature requests): <24 hours
- Low (general questions): <48 hours

---

### 2. **Bug Fixes**
**Frequency:** As discovered  
**Time:** 30 min - 4 hours per bug  
**Tools:** GitHub, Vercel logs

**Process:**

1. **Reproduce bug locally**
2. **Fix code**
3. **Test fix**
4. **Deploy:**
```bash
git add .
git commit -m "fix: <description>"
git push
```
5. **Verify in production**
6. **Notify affected users** (if critical)

**Priority:**
- P0 (Critical - site down): Fix immediately
- P1 (High - major feature broken): Fix within 24 hours
- P2 (Medium - minor issue): Fix within 1 week
- P3 (Low - cosmetic): Fix in next release

---

### 3. **Content Moderation**
**Frequency:** As reported  
**Time:** 5-10 min per report  
**Tools:** Database

**Review reported questions:**

```bash
# View reports
npx tsx -e "
import { Pool } from 'pg';
const pool = new Pool({
  url: process.env.POSTGRES_URL,
  authToken: process.env.POSTGRES_PASSWORD
});
const reports = await db.execute(
  \"SELECT id, exam_id, subject_id, topic, question_text, reported_issue, created_at FROM reported_questions WHERE status = 'pending' ORDER BY created_at DESC\"
);
console.table(reports.rows);
"
```

**Actions:**
- If incorrect: Fix question
- If duplicate: Remove duplicate
- If inappropriate: Delete question
- If false report: Mark as invalid

**Mark as resolved:**
```sql
UPDATE reported_questions SET status = 'resolved' WHERE id = 123
```

---

### 4. **Feature Requests**
**Frequency:** Ongoing  
**Time:** Variable (hours to days)  
**Tools:** GitHub Issues, user feedback

**Process:**

1. **Collect requests:**
   - Email
   - Contact form
   - Social media
   - Create GitHub issue

2. **Prioritize:**
   - How many users want it?
   - How hard to implement?
   - Strategic importance?

3. **Plan:**
   - Add to quarterly roadmap
   - Or build immediately if quick win

4. **Build, test, deploy**

---

## 🚨 **Emergency Procedures**

### **Site Down**

**Symptoms:** Users can't access scoreyo.in

**Steps:**
1. Check Vercel status: https://www.vercel-status.com/
2. If Vercel is down: Wait (usually <30 min)
3. If Vercel is up:
   - Check deployment: Vercel Dashboard
   - Check DNS: `dig scoreyo.in`
   - Check SSL: `curl -I https://scoreyo.in`
4. If recent deployment caused it:
   - Rollback: Vercel Dashboard → Previous deployment → Promote
5. Notify users (if downtime > 1 hour):
   - Social media update
   - Status page

**Prevention:**
- Test locally before deploying
- Use staging environment for major changes
- Monitor error rates after deployment

---

### **Database Corruption**

**Symptoms:** Queries failing, data loss

**Steps:**
1. **Stop writes immediately:**
   - Set site to maintenance mode (if possible)
2. **Assess damage:**
   - Query database for corrupt tables
   - Check Supabase logs
3. **Restore from backup:**
```bash
# Supabase provides point-in-time recovery
# Use Supabase Dashboard: Database → Backups → Restore
```
4. **Verify restoration:**
   - Check key tables: users, subscriptions, exam_questions
   - Test quiz generation
5. **Resume service**

**Prevention:**
- Regular backup verification (weekly)
- Test restoration procedure (quarterly)
- Supabase auto-backups enabled ✅

---

### **Payment Issues**

**Symptoms:** Users charged but no subscription

**Steps:**
1. **Verify payment in Razorpay:**
   - Dashboard → Payments → Search payment ID
   - Status should be "Captured"
2. **Check database:**
```bash
npx tsx -e "
import { Pool } from 'pg';
const pool = new Pool({
  url: process.env.POSTGRES_URL,
  authToken: process.env.POSTGRES_PASSWORD
});
const result = await db.execute(
  \"SELECT * FROM subscriptions WHERE razorpay_payment_id = 'pay_xxx'\"
);
console.table(result.rows);
"
```
3. **If payment captured but no subscription:**
   - Manually create subscription:
```sql
INSERT INTO subscriptions (user_id, plan, razorpay_payment_id, amount, start_date, end_date, status)
VALUES (?, ?, ?, ?, datetime('now'), datetime('now', '+30 days'), 'active')
```
4. **Notify user:**
   - Email: Subscription activated
   - Apologize for inconvenience

**Prevention:**
- Test payment flow regularly
- Add retry logic in payment webhook
- Alert on payment-subscription mismatch

---

### **API Quota Exhausted**

**Symptoms:** Questions not generating, cron failing

**Steps:**
1. **Check OpenRouter usage:**
   - https://openrouter.ai/dashboard
   - Daily limit hit?
2. **Immediate fix:**
   - Top up balance ($10+ more)
   - Or switch to MAINTENANCE mode (lower usage):
```bash
# In Vercel Dashboard
Environment Variables → CRON_MODE → Change to MAINTENANCE
```
3. **Long-term:**
   - Upgrade OpenRouter plan
   - Or optimize question generation (batch more, generate less)

**Prevention:**
- Monitor quota weekly
- Alert when quota <20% remaining
- Top up proactively

---

## 📊 **Time Summary**

### **Daily:** 5-10 minutes
- Health check: 2 min
- Cron monitoring: 2 min
- Question reports: 3-5 min

### **Weekly:** 15-30 minutes
- Analytics review: 10-15 min
- API quota check: 2 min
- Backup verification: 2 min

### **Monthly:** 1-2 hours
- Payment reconciliation: 30-45 min
- Content audit: 45-60 min
- Performance review: 30 min
- Security audit: 15-20 min

### **Quarterly:** 2-3 hours
- Dependency updates: 1-2 hours
- Cost review: 30 min
- Feature planning: 1 hour

### **Annual:** 3-4 hours
- Syllabus review: 2-3 hours
- Domain renewal: 15 min
- Tax filing: 2-3 hours (with CA)

### **As-Needed:** Variable
- User support: 30 min - 2 hours/day initially
- Bug fixes: 30 min - 4 hours per bug
- Content moderation: 5-10 min per report
- Feature requests: Hours to days

---

## 🎯 **Total Time Commitment**

### **Launch Phase (Month 1-3):**
```
Daily: 10 min × 30 days = 5 hours/month
Weekly: 30 min × 4 weeks = 2 hours/month
Monthly: 2 hours
User support: 1 hour/day × 30 = 30 hours/month
Bug fixes: 10 hours/month

Total: ~50 hours/month (1.5-2 hours/day)
```

### **Steady State (Month 4+):**
```
Daily: 5 min × 30 days = 2.5 hours/month
Weekly: 15 min × 4 weeks = 1 hour/month
Monthly: 1.5 hours/month
User support: 30 min/day × 30 = 15 hours/month
Bug fixes: 2-3 hours/month

Total: ~22 hours/month (45 min/day)
```

### **With Automation:**
```
Most daily/weekly tasks can be automated further:
- Health monitoring: Set up alerts (email if error)
- Analytics: Weekly auto-email reports
- Backups: Already automatic (Supabase)

Reduced to: ~15 hours/month (30 min/day)
```

---

## ✅ **Quick Checklist (Print This)**

### **Daily (9 AM IST):**
- [ ] Check Vercel deployment status
- [ ] Check daily cron ran successfully
- [ ] Review question reports (if any)

### **Monday (10 AM IST):**
- [ ] Review week's analytics
- [ ] Check API quota usage
- [ ] Verify database backup

### **First Monday of Month:**
- [ ] Payment reconciliation
- [ ] Content quality audit
- [ ] Performance review
- [ ] Security audit

### **Every 3 Months:**
- [ ] Update dependencies
- [ ] Review costs & optimize
- [ ] Plan next quarter's features

### **Every May/June:**
- [ ] Check official syllabus updates
- [ ] Update syllabus config if changed
- [ ] Verify annual cron ran correctly

---

## 📞 **Support Contacts**

**Vercel Support:**
- Dashboard: https://vercel.com/support
- Email: support@vercel.com
- Response: 24-48 hours (Hobby), <4 hours (Pro)

**Supabase Support:**
- Discord: https://supabase.com/dashboard
- Email: support@supabase.com
- Response: 12-24 hours

**OpenRouter Support:**
- Email: support@openrouter.ai
- Response: 24-48 hours

**Razorpay Support:**
- Dashboard: https://dashboard.razorpay.com/support
- Phone: +91-80-6802-1222
- Response: <4 hours (critical), 24 hours (non-critical)

**Resend Support:**
- Email: support@resend.com
- Discord: https://discord.gg/resend
- Response: 12-24 hours

---

## 📚 **Additional Resources**

- **Syllabus System:** `SYLLABUS-CURRENCY-SYSTEM.md`
- **Setup Guide:** `SETUP-SYLLABUS-SYSTEM.md`
- **Launch Checklist:** `DEPLOYMENT-CHECKLIST.md`
- **Code Documentation:** `CLAUDE.md`

---

**Last Updated:** May 17, 2026  
**Next Review:** June 2026 (post-launch)

---

**This is your complete maintenance manual! Bookmark this and follow it for smooth operations.** ✅🚀
