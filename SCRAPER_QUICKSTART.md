# 🚀 NCERT Scraper Quick Start Guide

## What This Does

Automatically extracts **2,000-3,000 high-quality MCQs** from NCERT textbooks (Physics, Chemistry, Biology, Mathematics for Classes 11-12) using AI-powered parsing.

**100% Legal** - Only scrapes government-published, openly accessible educational content.

## Prerequisites

✅ Already have:
- OpenRouter API key (for AI extraction)
- Turso database (for storage)
- Next.js project running

📦 Need to install:
- `tsx` package (for running TypeScript scripts)
- `pdf-parse` package (already in your package.json)

## Installation (One-Time Setup)

### 1. Install Dependencies

```bash
cd /Users/girish.raj/prepgenie
npm install
```

This will install:
- `tsx` (TypeScript executor)
- `pdf-parse` (PDF text extraction)
- All other dependencies

### 2. Add Admin Key to .env.local

```bash
# Generate a secure random key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env.local
echo "SCRAPER_ADMIN_KEY=your-generated-key-here" >> .env.local
```

Your `.env.local` should now have:
```env
OPENROUTER_API_KEY=sk-or-v1-...
TURSO_DATABASE_URL=libsql://prepgenie-....turso.io
TURSO_AUTH_TOKEN=eyJ...
SCRAPER_ADMIN_KEY=your-generated-key-here  # NEW
```

### 3. Test Setup

```bash
npm run test-scraper
```

You should see:
```
✅ All tests passed! Scraper is ready to use.
```

## Usage

### Test Run (Start Here)

```bash
# Test AI extraction on sample text
npm run scrape -- --test
```

Expected output:
```
✅ Extracted 2 questions:
   1. Which of the following is a scalar quantity?
   2. The unit of electric current is:
```

### Scrape a Single Chapter

```bash
npm run scrape -- --subject physics --class 12 --chapter 1
```

This will:
1. Fetch the PDF from NCERT
2. Extract MCQs using AI
3. Save to your database
4. Show results: `✅ Extracted X questions`

### Scrape All Chapters (Production)

```bash
# All Physics Class 12 chapters (~15 chapters, ~10 minutes)
npm run scrape -- --subject physics --class 12 --all

# All Chemistry Class 11
npm run scrape -- --subject chemistry --class 11 --all

# All Biology Class 12
npm run scrape -- --subject biology --class 12 --all

# All Math Class 12
npm run scrape -- --subject mathematics --class 12 --all
```

**Tip:** Run these during off-peak hours (late night) to be respectful to NCERT servers.

## What Gets Scraped

| Subject | Class | Chapters | Expected MCQs |
|---------|-------|----------|---------------|
| Physics | 12 | 15 | 300-375 |
| Chemistry | 12 | 16 | 240-320 |
| Biology | 12 | 15 | 225-300 |
| Mathematics | 12 | 13 | 260-390 |
| **TOTAL** | | **59** | **~2,000-3,000** |

## Verify Results

### Option 1: API Check
```bash
curl "http://localhost:3000/api/admin/scrape?adminKey=your-key"
```

### Option 2: Database Query
Check your Turso dashboard or query:
```sql
SELECT COUNT(*) FROM verified_questions WHERE source LIKE '%NCERT%';
```

## Troubleshooting

### "command not found: tsx"
```bash
npm install tsx --save-dev
```

### "PDF not found" (404 error)
- NCERT may have changed URLs
- Try a different chapter number
- Some chapters may not exist (e.g., Math has 13, not 15)

### "No MCQs found"
- Some chapters don't have MCQ sections
- Try NCERT Exemplar books specifically
- This is normal for certain chapters

### "AI extraction failed"
- Check OpenRouter API key is valid
- Verify you haven't exceeded quota
- Try with `--test` flag first

### Rate limiting
- Wait 5 minutes and try again
- Run during off-peak hours (late night IST)
- Scraper already has 3-second delays built in

## Next Steps After Scraping

1. **Verify Quality**: Check a few questions in your database
2. **Integrate with Quiz**: Your existing `/api/quiz` already uses `verified_questions` table
3. **Add More Sources**: 
   - NCERT Class 11 subjects
   - NTA previous year papers
   - State board materials

## Advanced: Using the API

If you prefer HTTP over CLI:

```bash
# Scrape a chapter
curl -X POST http://localhost:3000/api/admin/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "action": "scrape-chapter",
    "subject": "physics",
    "class": 12,
    "chapter": 1,
    "adminKey": "your-key"
  }'

# Get statistics
curl "http://localhost:3000/api/admin/scrape?adminKey=your-key"
```

## Cost & Performance

- **Time**: ~10 seconds per chapter
- **Cost**: ~$0.001 per chapter (OpenRouter/Gemini)
- **Total**: ~$0.10 to scrape all NCERT content
- **One-time operation**: Run once, use forever

## Safety & Legal

✅ **Legal**: 
- NCERT content is government-published
- Freely available for educational use
- Public domain in India

✅ **Respectful**:
- 3-second delays between requests
- No aggressive retries
- Runs during off-peak hours

✅ **Attribution**:
- Every question tagged with source
- Credit to NCERT maintained

## Support

- 📚 Full docs: `docs/SCRAPER_GUIDE.md`
- 🏗️ Architecture: `.agents/artifacts/scraper-architecture.md`
- 🐛 Issues: Check logs for error details

---

**Ready to start?**

```bash
# 1. Install
npm install

# 2. Test
npm run test-scraper

# 3. Scrape your first chapter
npm run scrape -- --subject physics --class 12 --chapter 1

# 4. Scrape everything (optional)
npm run scrape -- --subject physics --class 12 --all
```

Good luck! 🎓
