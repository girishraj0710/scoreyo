# 📥 Official PDF Download Guide

**Goal:** Download 7,000-11,000 previous year questions from official sources

---

## 🎯 Quick Start

### Step 1: Create Download Folders
```bash
mkdir -p /tmp/prepgenie-official-pdfs/{jee-main,neet,upsc,ssc-cgl,gate-cs,cat}
```

### Step 2: Download PDFs (Manual)
Visit the websites below and save PDFs to the specified folders.

### Step 3: Extract Questions
```bash
bash scripts/batch-extract-pdfs.sh
```

---

## 📚 Download Sources

### 1. JEE Main (2,250-3,600 questions)

**Official Website:** https://jeemain.nta.nic.in/

**Steps:**
1. Visit https://jeemain.nta.nic.in/
2. Click "Examination" → "Previous Year Question Papers"
3. Download papers from 2019-2024 (all shifts)
4. Save to: `/tmp/prepgenie-official-pdfs/jee-main/`

**Alternative Sources:**
- https://www.nta.ac.in/JEEMain (NTA Archive)
- https://jeemain.nta.nic.in/webinfo2022/Page/Page?PageId=6&LangId=P

**What to download:**
- JEE Main January 2024 - All shifts (Shift 1, 2)
- JEE Main April 2024 - All shifts
- JEE Main 2023 - All shifts
- JEE Main 2022 - All shifts
- JEE Main 2021 - All shifts
- JEE Main 2020 - All shifts
- JEE Main 2019 - All shifts

**Expected:** 30-40 PDFs, 75-90 questions per paper

---

### 2. NEET (1,080 questions)

**Official Website:** https://neet.nta.nic.in/

**Steps:**
1. Visit https://neet.nta.nic.in/
2. Navigate to "Previous Year Question Papers"
3. Download papers from 2019-2024
4. Save to: `/tmp/prepgenie-official-pdfs/neet/`

**Alternative Sources:**
- https://www.nta.ac.in/NEET
- https://neet.nta.nic.in/webinfo2022/Page/Page?PageId=12&LangId=P

**What to download:**
- NEET 2024 Question Paper
- NEET 2023 Question Paper
- NEET 2022 Question Paper
- NEET 2021 Question Paper
- NEET 2020 Question Paper
- NEET 2019 Question Paper

**Expected:** 6 PDFs, 180 questions per paper

---

### 3. UPSC CSE Prelims (1,200 questions)

**Official Website:** https://upsc.gov.in/examinations/previous-question-papers

**Steps:**
1. Visit https://upsc.gov.in/examinations/previous-question-papers
2. Select "Civil Services Examination"
3. Download Prelims papers (GS Paper I & II) from 2019-2024
4. Save to: `/tmp/prepgenie-official-pdfs/upsc/`

**Direct Links:**
- https://upsc.gov.in/examinations/previous-question-papers

**What to download:**
- UPSC CSE 2024 Prelims - Paper I & II
- UPSC CSE 2023 Prelims - Paper I & II
- UPSC CSE 2022 Prelims - Paper I & II
- UPSC CSE 2021 Prelims - Paper I & II
- UPSC CSE 2020 Prelims - Paper I & II
- UPSC CSE 2019 Prelims - Paper I & II

**Expected:** 12 PDFs (2 papers × 6 years), 100 questions per paper

---

### 4. SSC CGL (2,000-4,000 questions)

**Official Website:** https://ssc.nic.in/

**Steps:**
1. Visit https://ssc.nic.in/
2. Navigate to "Examination" → "Previous Year Papers"
3. Download CGL Tier-1 papers
4. Save to: `/tmp/prepgenie-official-pdfs/ssc-cgl/`

**Alternative Sources:**
- https://ssc.nic.in/SSCFileServer/PortalManagement/UploadedFiles/

**What to download:**
- SSC CGL 2023 - All shifts
- SSC CGL 2022 - All shifts
- SSC CGL 2021 - All shifts
- SSC CGL 2020 - All shifts
- SSC CGL 2019 - All shifts

**Expected:** 10-20 PDFs, 200 questions per paper

---

### 5. GATE CS (390 questions)

**Official Website:** https://gate2025.iitr.ac.in/ (rotates annually)

**Steps:**
1. Visit current year GATE website
2. Look for "Previous Year Papers" section
3. Download Computer Science papers from 2019-2024
4. Save to: `/tmp/prepgenie-official-pdfs/gate-cs/`

**Alternative Sources:**
- https://www.geeksforgeeks.org/gate-previous-year-papers/
- https://gate.iitk.ac.in/ (Previous host IITs)
- https://testbook.com/gate/previous-year-papers

**What to download:**
- GATE CS 2024 Question Paper
- GATE CS 2023 Question Paper
- GATE CS 2022 Question Paper
- GATE CS 2021 Question Paper
- GATE CS 2020 Question Paper
- GATE CS 2019 Question Paper

**Expected:** 6 PDFs, 65 questions per paper

---

### 6. CAT MBA (500-1,000 questions)

**Official Website:** https://iimcat.ac.in/

**Note:** CAT doesn't officially release question papers. Use these sources:

**Alternative Sources:**
1. **Career360:** https://www.career360.com/exams/cat-previous-year-question-papers
2. **Pagalguy:** https://www.pagalguy.com/cat-previous-year-papers
3. **Testbook:** https://testbook.com/cat/previous-year-papers

**Steps:**
1. Visit Career360 or other sources
2. Download available reconstructed papers (2019-2024)
3. Save to: `/tmp/prepgenie-official-pdfs/cat/`

**What to download:**
- CAT 2023 Question Paper (unofficial)
- CAT 2022 Question Paper (unofficial)
- CAT 2021 Question Paper (unofficial)
- CAT 2020 Question Paper (unofficial)
- CAT 2019 Question Paper (unofficial)

**Expected:** 5-10 PDFs, 100 questions per paper

---

## 📊 Expected Results

| Exam | PDFs | Questions/Paper | Total Questions |
|------|------|-----------------|-----------------|
| JEE Main | 30-40 | 75-90 | 2,250-3,600 |
| NEET | 6 | 180 | 1,080 |
| UPSC CSE | 12 | 100 | 1,200 |
| SSC CGL | 10-20 | 200 | 2,000-4,000 |
| GATE CS | 6 | 65 | 390 |
| CAT MBA | 5-10 | 100 | 500-1,000 |
| **TOTAL** | **69-94** | - | **7,420-11,270** |

---

## ⚙️ After Downloading

### 1. Verify Downloads
```bash
ls -R /tmp/prepgenie-official-pdfs
```

### 2. Extract Questions (Batch)
```bash
cd ~/prepgenie
bash scripts/batch-extract-pdfs.sh
```

### 3. Manual Review
- Open CSV files in `.agents/artifacts/extracted-questions/`
- Review OCR accuracy
- Set correct answers (marked as NEEDS_MANUAL_REVIEW)
- Verify question text and options

### 4. Generate AI Explanations
```bash
node scripts/generate-ai-explanations.js .agents/artifacts/extracted-questions/jee-main-2024.csv
```

### 5. Import to Database
```bash
node scripts/import-questions.js .agents/artifacts/extracted-questions/jee-main-2024.csv
```

### 6. Repeat for All Exams
Process each exam's CSVs through steps 4-5.

---

## 🎯 Time Estimates

| Task | Time | Effort |
|------|------|--------|
| Download PDFs | 2-3 hours | Manual browsing |
| Extract with OCR | 1-2 hours | Automated script |
| Manual review | 4-6 hours | Critical for accuracy |
| AI explanations | 1-2 hours | Automated (API cost) |
| Import to DB | 30 min | Automated |
| **TOTAL** | **8-14 hours** | Weekend project |

---

## 💡 Tips

1. **Download in Batches**: Do one exam at a time to stay organized
2. **Name Files Properly**: Use format like `jee-main-2024-january-shift1.pdf`
3. **Start with JEE/NEET**: These have the most consistent PDF formats
4. **Use Fast Internet**: Some PDFs are large (5-20 MB each)
5. **Check File Integrity**: Make sure PDFs open correctly before batch processing
6. **Priority Order**: JEE Main → NEET → UPSC → SSC CGL → GATE CS → CAT

---

## 🚨 Troubleshooting

### PDFs Not Found on Official Sites
- Try archive.org for older papers
- Check alternative sources listed above
- Some years may not be available officially

### OCR Extraction Fails
- Check if PDF is text-based (can copy text) vs scanned image
- Image-based PDFs work better with OCR
- Some PDFs may have security restrictions

### Wrong Question Count
- Some papers may have more/fewer questions than expected
- Section-wise papers may need to be combined
- Numerical answer type questions may not extract well

---

## 📝 Next Steps

After importing all questions:

1. **Deploy Current 172 Questions**
   ```bash
   # Copy to question-bank.ts and deploy
   git add .
   git commit -m "feat: Add 172 real questions from GitHub sources"
   git push origin main
   ```

2. **Process Weekend Downloads**
   - Extract, review, and import all PDFs
   - Target: 7,000+ questions by Monday

3. **Final Deployment**
   ```bash
   # Deploy massive question bank
   git add .
   git commit -m "feat: Add 7,000+ official questions from 2019-2024 papers"
   git push origin main
   ```

---

## ✅ Success Criteria

- ✅ 7,000+ questions imported
- ✅ All from official sources (2019-2024)
- ✅ Properly attributed with year and source
- ✅ Manual verification of critical fields
- ✅ AI explanations generated
- ✅ Deployed to production

**READY TO START DOWNLOADING! 🚀**
