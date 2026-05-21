# Official PYQ Import Guide

## Step 1: Download Official Question Papers (Week 1)

### JEE Main (Priority 1)
**Source:** https://jeemain.nta.nic.in/question-paper/
**What to download:**
- 2024 papers (all shifts - usually 8 shifts, 2 per day over 4 days)
- 2023 papers (all shifts)
- 2022 papers

**Expected:** ~2,000 questions (250 Q per paper × 8 papers)

**How to:**
1. Visit NTA website
2. Click "Question Papers" section
3. Download PDFs for Physics, Chemistry, Mathematics separately
4. Save in: `scripts/pyq-sources/jee-main/`

### NEET UG (Priority 2)
**Source:** https://neet.nta.nic.in/question-paper/
**What to download:**
- 2024 paper
- 2023 paper
- 2022 paper

**Expected:** ~600 questions (200 Q per paper × 3 papers)

**How to:**
1. Visit NTA website
2. Download single question paper PDF (Physics, Chemistry, Biology combined)
3. Save in: `scripts/pyq-sources/neet-ug/`

### UPSC CSE Prelims (Priority 3)
**Source:** https://www.upsc.gov.in/examination/previous-question-papers
**What to download:**
- 2024 GS Paper 1 & CSAT Paper 2
- 2023 GS Paper 1 & CSAT Paper 2
- 2022 GS Paper 1 & CSAT Paper 2

**Expected:** ~600 questions (100 Q per paper × 6 papers)

**How to:**
1. Visit UPSC website
2. Navigate to Civil Services Examination → Previous Year Papers
3. Download PDFs
4. Save in: `scripts/pyq-sources/upsc-cse/`

---

## Step 2: Extract Text from PDFs

Once you have the PDFs downloaded, I'll create a script to:
1. Read PDF files using pdf-parse
2. Extract question text, options, answers
3. Structure as JSON

---

## Step 3: Manual Verification (Critical!)

For the first 100 questions:
- Verify question text is complete
- Check all 4 options are captured
- Confirm correct answer
- Add explanation from solution key

This ensures quality before bulk import.

---

## Timeline

**Day 1-2:** Download all PDFs (2-3 hours)
**Day 3-4:** I create automated extraction script
**Day 5-7:** Manual verification + import first batch (500 questions)

---

## Next Steps

Let me know once you've downloaded the PDFs for JEE Main 2024, and I'll create the extraction script to process them.

Alternatively, if you want me to research and create a more automated approach (using specific PDF patterns), I can analyze a sample PDF structure first.
