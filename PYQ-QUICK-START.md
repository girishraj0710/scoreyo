# 🚀 PYQ Quick Start Guide - Get 500 Questions in 3 Hours

## ✅ Current Status
- ✅ Scripts ready
- ✅ Database configured  
- ✅ Claude API working
- ✅ Directories created

## 🎯 Week 1 Goal: 500 Official PYQs from Top 5 Exams

### 📥 Step 1: Download PDFs (30 minutes)

Visit these official websites and download 2024 question papers:

**1. JEE Main (3 papers)**
- Website: https://nta.ac.in
- Download: Physics, Chemistry, Mathematics 2024
- Save as: `pyq-raw/jee-main/jee-main-physics-2024.pdf`

**2. NEET UG (3 papers)**
- Website: https://nta.ac.in  
- Download: Physics, Chemistry, Biology 2024
- Save as: `pyq-raw/neet-ug/neet-ug-physics-2024.pdf`

**3. UPSC CSE (2 papers)**
- Website: https://upsc.gov.in
- Download: GS Paper 1, CSAT Paper 2 Prelims 2024
- Save as: `pyq-raw/upsc-cse/upsc-cse-general-studies-2024.pdf`

**4. SSC CGL (4 papers)**
- Website: https://ssc.nic.in
- Download: Tier 1 papers (Reasoning, Quant, English, GA)
- Save as: `pyq-raw/ssc-cgl/ssc-cgl-reasoning-2024.pdf`

**5. CAT (3 papers)**
- Website: https://iimcat.ac.in
- Download: VARC, DILR, Quant 2024
- Save as: `pyq-raw/cat/cat-varc-2024.pdf`

**Total: 14 PDF files**

---

### 🔧 Step 2: Extract Text (5 minutes)

```bash
# Install pdftotext if needed
brew install poppler  # Mac
# or: apt-get install poppler-utils  # Linux

# Extract text from all PDFs
cd prepgenie
for file in pyq-raw/*/*.pdf; do
  echo "Processing $file..."
  pdftotext "$file" "${file%.pdf}.txt"
done
```

This creates `.txt` files next to each PDF.

---

### 🤖 Step 3: AI Extraction (2-3 hours automated)

```bash
# Extract all Week 1 papers
npx tsx scripts/pyq-mass-extractor.ts --extract-week1
```

This will:
1. Send each text file to Claude API
2. Extract all questions as JSON
3. Save to `pyq-data/`
4. Auto-import to database
5. Show progress for each paper

**Cost: ~$2-3**  
**Time: 2-3 hours**  
**Output: ~500 PYQs**

---

### ✅ Step 4: Verify

```bash
# Check how many PYQs imported
npx tsx scripts/check-pyq-status.ts

# Check overall database
npx tsx scripts/morning-status-check.ts
```

---

## 🚀 Alternative: Quick Test (5 minutes)

Test with just 1 paper first:

```bash
# 1. Download JEE Physics 2024 PDF
# Save to: pyq-raw/jee-main/jee-main-physics-2024.pdf

# 2. Extract text
pdftotext pyq-raw/jee-main/jee-main-physics-2024.pdf pyq-raw/jee-main/jee-main-physics-2024.txt

# 3. Run AI extraction
npx tsx scripts/ai-extract-pyq.ts jee-main physics 2024 pyq-raw/jee-main/jee-main-physics-2024.txt

# 4. Check results
npx tsx scripts/check-pyq-status.ts
```

Expected: ~25 questions in 2 minutes, cost $0.10

---

## 💡 Tips

**Finding PDFs:**
- Search: "[Exam Name] 2024 question paper PDF"
- Look for official board/NTA website first
- Archive.org often has scanned papers
- Educational forums share official papers

**Text Quality:**
- If OCR quality poor, try different PDF
- Scanned images work with pdftotext
- Claude can handle imperfect OCR

**Cost Control:**
- Each paper costs $0.10-0.20
- 14 papers = $2-3 total
- Very affordable for 500 official questions

---

## 📊 Expected Results

| Exam | Papers | Questions/Paper | Total | Cost |
|------|--------|-----------------|-------|------|
| JEE Main | 3 | 75 | 225 | $0.60 |
| NEET UG | 3 | 60 | 180 | $0.60 |
| UPSC | 2 | 100 | 200 | $0.40 |
| SSC CGL | 4 | 25 | 100 | $0.80 |
| CAT | 3 | 22 | 66 | $0.60 |
| **Total** | **15** | - | **771** | **$3** |

---

## 🆘 Troubleshooting

**"PDF not found"**  
→ Check file path, use absolute path

**"Text file too short"**  
→ PDF might be image-only, needs OCR

**"API Error 401"**  
→ Check OPENROUTER_API_KEY in .env.local

**"No questions extracted"**  
→ Text quality might be poor, try different PDF

---

## 🎯 Next Steps

After Week 1 succeeds:

**Week 2:** Same exams, 2020-2024 (5 years) = 2,500 PYQs  
**Month 2:** All 20 exams × 5 years = 10,000 PYQs

---

**Ready to start?**

```bash
# See full download guide
npx tsx scripts/pyq-mass-extractor.ts --guide

# Start extraction
npx tsx scripts/pyq-mass-extractor.ts --extract-week1
```

🚀 **Let's get 500 official PYQs!**
