# 🎓 Complete Question Scraping Guide - All Options

You now have **4 powerful scraping tools** to build Krakkify's question bank!

## Overview

| Tool | Source | Questions Expected | Cost | Legal Status |
|------|--------|-------------------|------|--------------|
| **NCERT Regular** | Government textbooks | 200-400 | $0.10 | ✅ Public domain |
| **Local PDFs** | NCERT Exemplar (manual) | 1,000-1,500 | $0.50 | ✅ Public domain |
| **NTA Papers** | JEE/NEET official papers | 2,000-3,000 | $1.00 | ✅ Public after exam |
| **OpenStax** | CC-licensed textbooks | 500-1,000 | $0.20 | ✅ CC BY 4.0 |
| **TOTAL** | | **3,700-5,900** | **~$1.80** | **100% Legal** |

---

## Option 1: NCERT Regular Textbooks (Already Working!)

### What It Does
Scrapes regular NCERT textbooks for exercise questions.

### Usage
```bash
# Single chapter
npm run scrape -- --subject physics --class 12 --chapter 1

# All chapters
npm run scrape -- --subject physics --class 12 --all
npm run scrape -- --subject chemistry --class 12 --all
npm run scrape -- --subject biology --class 12 --all
npm run scrape -- --subject mathematics --class 12 --all
```

### Expected Results
- **200-400 questions** total
- Mostly exercise questions (not all MCQs)
- High quality, NCERT-sourced

### Time & Cost
- Time: ~30 minutes for all subjects
- Cost: ~$0.10

---

## Option 2: Local NCERT Exemplar PDFs (Best for MCQs!)

### What It Does
Processes locally downloaded NCERT Exemplar books which have dedicated MCQ sections.

### Setup

#### Step 1: Download NCERT Exemplar PDFs

Visit **https://ncert.nic.in** → Books → Exemplar Problems

Download these books:
- **Physics Class 12** (15 chapters)
- **Chemistry Class 12** (16 chapters)
- **Biology Class 12** (15 chapters)
- **Mathematics Class 12** (13 chapters)

Or use these direct links (if available):
```
Physics:    https://ncert.nic.in/pdf/publication/exemplarproblem/classXII/physics/
Chemistry:  https://ncert.nic.in/pdf/publication/exemplarproblem/classXII/chemistry/
Biology:    https://ncert.nic.in/pdf/publication/exemplarproblem/classXII/biology/
Math:       https://ncert.nic.in/pdf/publication/exemplarproblem/classXII/mathematics/
```

#### Step 2: Organize Files

Create folders and name files correctly:

```bash
cd /Users/girish.raj/krakkify

# Create folders
mkdir -p ncert-exemplar/physics
mkdir -p ncert-exemplar/chemistry
mkdir -p ncert-exemplar/biology
mkdir -p ncert-exemplar/mathematics

# Place downloaded PDFs with this naming:
# Format: {subject}-{class}-{chapter}.pdf
# Examples:
#   ncert-exemplar/physics/physics-12-01.pdf
#   ncert-exemplar/physics/physics-12-02.pdf
#   ncert-exemplar/chemistry/chemistry-12-01.pdf
```

**Naming Convention:**
- `physics-12-01.pdf` = Physics Class 12 Chapter 1
- `chemistry-11-05.pdf` = Chemistry Class 11 Chapter 5

#### Step 3: Run Processor

```bash
npm run process-local-pdfs
```

### Expected Results
- **1,000-1,500 MCQs** from Exemplar books
- Each chapter has 20-30 MCQs
- Perfect for JEE/NEET prep

### Time & Cost
- Time: ~1 hour (mostly manual download time)
- Cost: ~$0.50 (AI processing)

---

## Option 3: NTA Previous Year Papers

### What It Does
Scrapes official JEE Main and NEET previous year question papers.

### Setup

#### Step 1: Find Paper URLs

Visit:
- **JEE Main**: https://jeemain.nta.nic.in → Previous Papers
- **NEET**: https://neet.nta.nic.in → Previous Papers

Find PDF links for papers from 2020-2024.

#### Step 2: Add URLs to Script

Edit `scripts/scrape-nta-papers.ts` and add URLs to `NTA_PAPER_URLS`:

```typescript
const NTA_PAPER_URLS = {
  jee: {
    2024: [
      'https://jeemain.nta.nic.in/webinfo2024/File/GetFile?FileId=XXX',
      // Add more paper URLs
    ],
    2023: [
      'https://jeemain.nta.nic.in/webinfo2023/File/GetFile?FileId=YYY',
    ],
  },
  neet: {
    2024: [
      'https://neet.nta.nic.in/Downloads/2024/Paper.pdf',
    ],
  },
};
```

#### Step 3: Run Scraper

```bash
# Single year
npm run scrape-nta -- --exam jee --year 2024
npm run scrape-nta -- --exam neet --year 2023

# All years
npm run scrape-nta -- --exam jee --all
npm run scrape-nta -- --exam neet --all
```

### Expected Results

| Exam | Questions/Year | Years | Total |
|------|---------------|-------|-------|
| JEE Main | ~360 (90 × 4 shifts) | 5 | 1,800 |
| NEET | ~180 | 5 | 900 |
| **TOTAL** | | | **2,700** |

### Time & Cost
- Time: ~2 hours (downloading + processing)
- Cost: ~$1.00

---

## Option 4: OpenStax Textbooks (Bonus!)

### What It Does
Scrapes OpenStax CC-licensed college textbooks for practice problems.

### Usage

```bash
# Single book
npm run scrape-openstax -- --book physics
npm run scrape-openstax -- --book chemistry
npm run scrape-openstax -- --book biology

# All books
npm run scrape-openstax -- --all
```

### Available Books
- **Physics**: College Physics 2e (34 chapters)
- **Chemistry**: Chemistry 2e (21 chapters)
- **Biology**: Biology 2e (47 chapters)
- **Calculus**: Calculus Volume 1 (6 chapters)

### Expected Results
- **500-1,000 questions** total
- End-of-chapter problems
- College-level (great for advanced students)

### Time & Cost
- Time: ~2 hours (large PDFs, lots of processing)
- Cost: ~$0.20

### License
- **CC BY 4.0** (free to use with attribution)
- Attribution automatically added to each question

---

## Recommended Workflow

### Phase 1: Quick Start (Today - 30 min)
```bash
# Get immediate results from NCERT textbooks
npm run scrape -- --subject physics --class 12 --all
npm run scrape -- --subject chemistry --class 12 --all
```
**Result: ~200 questions**

### Phase 2: High-Value MCQs (This Week - 2 hours)
1. Download NCERT Exemplar PDFs manually
2. Organize into folders
3. Run: `npm run process-local-pdfs`

**Result: +1,500 MCQs**

### Phase 3: Maximum Coverage (This Month - 1 day)
1. Find NTA paper URLs
2. Add to script
3. Run: `npm run scrape-nta -- --exam jee --all`
4. Run: `npm run scrape-nta -- --exam neet --all`

**Result: +2,700 questions**

### Phase 4: Bonus Content (Optional)
```bash
npm run scrape-openstax -- --all
```
**Result: +1,000 questions**

---

## Total Results

After completing all phases:

```
✅ NCERT Regular:        200 questions
✅ NCERT Exemplar:     1,500 questions
✅ NTA Papers:         2,700 questions
✅ OpenStax:           1,000 questions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TOTAL:             5,400 questions
```

**Cost: ~$1.80 total**  
**Time: ~1 day of work**  
**Legal: 100% compliant**

---

## Monitoring Progress

### Check Extraction Stats
```bash
curl "http://localhost:3000/api/admin/scrape?adminKey=f8b54f3b5cd9858133b0e90143e188b7554e26f671fd48e88e058eace5f57b00"
```

### Query Database Directly
```sql
-- Total questions
SELECT COUNT(*) FROM verified_questions;

-- By source
SELECT source, COUNT(*) 
FROM verified_questions 
GROUP BY source;

-- By subject
SELECT subject, COUNT(*) 
FROM verified_questions 
GROUP BY subject;
```

---

## Troubleshooting

### "Failed to fetch PDF"
- Check internet connection
- Verify URL is still valid
- Try downloading manually and use `process-local-pdfs`

### "No MCQs found"
- Some chapters don't have MCQs
- Try different chapters
- Check PDF has actual MCQ sections

### "AI extraction failed"
- Check OPENROUTER_API_KEY is valid
- Verify API quota not exceeded
- Check logs for specific error

### "Database save failed"
- Verify TURSO credentials
- Check database connection
- Try smaller batches

---

## Next Steps

**Start now with the easiest option:**

```bash
cd /Users/girish.raj/krakkify

# This works right now, no setup needed!
npm run scrape -- --subject physics --class 12 --all
```

**Then expand based on your needs:**
- Need MCQs? → Download NCERT Exemplar PDFs
- Want exam questions? → Add NTA paper URLs
- Need more coverage? → Try OpenStax

**You now have the tools to build a 5,000+ question bank! 🚀**
