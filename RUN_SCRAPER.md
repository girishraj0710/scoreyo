# 🚀 Run NCERT Scraper - Instructions

I've set up everything! Here's what you need to do in your **terminal** (outside of Claude):

## Step 1: Install Dependencies

Open your terminal in the PrepGenie directory and run:

```bash
cd /Users/girish.raj/prepgenie
npm install
```

This will install:
- `tsx` (TypeScript executor) - needed to run our scraper scripts
- All other dependencies

## Step 2: Verify Setup

Run the test script to make sure everything is configured:

```bash
npm run test-scraper
```

You should see output like:
```
🧪 Testing PrepGenie NCERT Scraper
============================================================

1️⃣  Checking environment variables...
   ✅ OPENROUTER_API_KEY configured
   ✅ TURSO_DATABASE_URL configured
   ✅ TURSO_AUTH_TOKEN configured

2️⃣  Testing database connection...
   ✅ Database connection successful

3️⃣  Testing OpenRouter API...
   ✅ OpenRouter API key valid

... (more tests)

✅ All tests passed! Scraper is ready to use.
```

## Step 3: Test AI Extraction

Test the AI extraction on sample text:

```bash
npm run scrape -- --test
```

Expected output:
```
✅ Extracted 2 questions:
   1. Which of the following is a scalar quantity?
   2. The unit of electric current is:
```

## Step 4: Scrape Your First Chapter

Start with a single chapter to verify it works:

```bash
npm run scrape -- --subject physics --class 12 --chapter 1
```

You should see:
```
📚 Scraping: PHYSICS Class 12 - Chapter 1

📥 Fetching: https://ncert.nic.in/textbook/pdf/leph101.pdf
🤖 Extracting questions using AI...
✅ Success! Extracted 15 questions
```

## Step 5 (Optional): Scrape All Physics

If the first chapter worked, scrape all Physics Class 12:

```bash
npm run scrape -- --subject physics --class 12 --all
```

This will take ~10-15 minutes and scrape all 15 chapters.

## Step 6 (Optional): Scrape Everything

To get all 2,000-3,000 NCERT questions, run these sequentially:

```bash
# Physics
npm run scrape -- --subject physics --class 12 --all
npm run scrape -- --subject physics --class 11 --all

# Chemistry
npm run scrape -- --subject chemistry --class 12 --all
npm run scrape -- --subject chemistry --class 11 --all

# Biology
npm run scrape -- --subject biology --class 12 --all
npm run scrape -- --subject biology --class 11 --all

# Mathematics
npm run scrape -- --subject mathematics --class 12 --all
npm run scrape -- --subject mathematics --class 11 --all
```

**Total time**: ~2-3 hours
**Total cost**: ~$0.10-0.20 (OpenRouter API)

## Verify Results

Check how many questions were scraped:

```bash
curl "http://localhost:3000/api/admin/scrape?adminKey=f8b54f3b5cd9858133b0e90143e188b7554e26f671fd48e88e058eace5f57b00"
```

Or query your Turso database directly to see:
```sql
SELECT COUNT(*) FROM verified_questions WHERE source LIKE '%NCERT%';
```

## Troubleshooting

### "command not found: npm"
Make sure you're running this in your **actual terminal**, not in Claude.

### "command not found: tsx"
Run `npm install` first to install dependencies.

### "Module not found"
The project might not be built. Try:
```bash
npm install
npm run dev  # Start dev server in background
# Then run scraper in another terminal
```

### "PDF not found" errors
Some chapters might not exist or NCERT URLs may have changed. This is normal - the scraper will skip and continue.

### "No MCQs found"
Some NCERT chapters don't have MCQ sections. The scraper will log this and continue.

## What's Already Configured ✅

- ✅ Environment variables in `.env.local`
- ✅ SCRAPER_ADMIN_KEY added (f8b54f3b5cd9858133b0e90143e188b7554e26f671fd48e88e058eace5f57b00)
- ✅ Scraper scripts in `scripts/` directory
- ✅ API endpoint at `/api/admin/scrape`
- ✅ Database schema ready

## Next Steps After Scraping

1. Questions will automatically appear in your quiz generation
2. Check `/api/quiz` - it prioritizes verified questions over AI-generated
3. Monitor your question bank growth in admin dashboard
4. Consider adding more sources (NTA papers, state boards)

---

**Ready to start?** Just run:
```bash
npm install
npm run test-scraper
npm run scrape -- --test
npm run scrape -- --subject physics --class 12 --chapter 1
```

Good luck! 🎓
