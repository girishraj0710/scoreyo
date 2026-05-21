# PYQ (Past Year Questions) Import System - Complete Guide

## 🎯 Overview

Import **official past year questions** - the highest quality questions available (100% accurate, real exam questions).

## ✅ Quick Start (2 minutes)

### Test the System

```bash
# Import sample questions (CSV)
npx tsx scripts/import-pyq.ts pyq-templates/sample.csv

# Import sample questions (JSON)
npx tsx scripts/import-pyq.ts pyq-templates/sample.json
```

### View Official Sources
```bash
npx tsx scripts/fetch-pyq-sources.ts --guide
```

## 📁 File Formats

### CSV Format
```csv
exam_id,subject_id,topic,question,option_a,option_b,option_c,option_d,correct_answer,explanation,year,difficulty
jee-main,physics,Mechanics,"Question text",A,B,C,D,2,"Explanation",2024,medium
```

### JSON Format
```json
[{
  "examId": "jee-main",
  "subjectId": "physics",
  "topic": "Mechanics",
  "question": "Question text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 2,
  "explanation": "Explanation",
  "year": 2024,
  "difficulty": "medium"
}]
```

## 🚀 Three Ways to Import PYQs

### 1️⃣ Manual Entry (10-50 questions)
1. Download PDF from official website
2. Type questions into CSV/JSON using templates
3. Import: `npx tsx scripts/import-pyq.ts your-file.csv`

### 2️⃣ AI-Assisted (100+ questions) ⭐ Recommended
1. Download official papers: `npx tsx scripts/fetch-pyq-sources.ts --guide`
2. Generate prompts: `npx tsx scripts/fetch-pyq-sources.ts --prompts`
3. Use Claude/GPT-4 Vision with PDF
4. Save output and import

### 3️⃣ Community (Scale to 10,000+)
- Team extracts questions
- Store in `pyq-data/` directory
- Batch import

## 📚 Official PYQ Sources

| Exam | Website | Papers Available | Questions/Paper |
|------|---------|------------------|-----------------|
| JEE Main | nta.ac.in | 2020-2024 | ~75 |
| NEET UG | nta.ac.in | 2020-2024 | 180 |
| UPSC CSE | upsc.gov.in | 2020-2024 | 100 |
| SSC CGL | ssc.nic.in | 2020-2024 | varies |
| CAT | iimcat.ac.in | 2020-2024 | ~100 |

## 🎬 Complete Workflow (AI-Assisted)

```bash
# Step 1: See where to download PDFs
npx tsx scripts/fetch-pyq-sources.ts --guide

# Step 2: Generate extraction prompts for AI
npx tsx scripts/fetch-pyq-sources.ts --prompts

# Step 3: Use AI (Claude/ChatGPT) with prompt + PDF
# - Upload PDF to AI
# - Use prompt from pyq-templates/extraction-prompts/
# - Copy JSON output

# Step 4: Save and import
npx tsx scripts/import-pyq.ts extracted-questions.json
```

## 💰 Cost Analysis

| Method | Time/100Q | Cost | Quality |
|--------|-----------|------|---------|
| Manual | 5-8 hours | Free | 100% |
| AI-Assisted | 45 min | $0.10 | 95% |
| Ollama (Free AI) | 2 hours | Free | 90% |

**Recommended:** AI-Assisted for speed + quality

## 📊 Scaling Strategy

### Phase 1: Top 5 Exams
- JEE Main, NEET, UPSC, SSC, Banking
- 5 years each
- **~2,500 PYQs**

### Phase 2: All Top 20  
- 20 exams × 5 years
- **~10,000 PYQs**

### Phase 3: Community
- User contributions
- **50,000+ PYQs**

## 🛠️ Commands Reference

```bash
# Import files
npx tsx scripts/import-pyq.ts <file.csv>
npx tsx scripts/import-pyq.ts <file.json>

# Get official sources
npx tsx scripts/fetch-pyq-sources.ts --guide

# Generate AI prompts
npx tsx scripts/fetch-pyq-sources.ts --prompts

# Test with samples
npx tsx scripts/import-pyq.ts pyq-templates/sample.csv
```

## ✨ Features

- ✅ Automatic duplicate detection
- ✅ Validates all fields
- ✅ Special "PYQ" source tags for priority
- ✅ Year-wise filtering support
- ✅ Batch import ready

## 🔒 Legal & Ethical

✅ **Allowed:**
- Government exam papers (public domain)
- Educational/non-commercial use

❌ **Not Allowed:**
- Copyrighted coaching material
- Leaked papers

## 🐛 Troubleshooting

**"File not found"** → Check file path  
**"Invalid CSV"** → Check headers match template  
**"Duplicate"** → Question already exists (by design)  
**"Invalid JSON"** → Validate at jsonlint.com

## 📁 Directory Structure

```
prepgenie/
├── scripts/
│   ├── import-pyq.ts          # Main importer
│   └── fetch-pyq-sources.ts   # Source guide
├── pyq-templates/
│   ├── sample.csv             # CSV template
│   ├── sample.json            # JSON template
│   └── extraction-prompts/    # AI prompts
└── pyq-data/                  # Your PYQ files
```

## 🎯 Next Steps

1. **Try it now:**
   ```bash
   npx tsx scripts/import-pyq.ts pyq-templates/sample.csv
   ```

2. **View official sources:**
   ```bash
   npx tsx scripts/fetch-pyq-sources.ts --guide
   ```

3. **Start extracting:**
   - Download 1 PDF
   - Use AI to extract
   - Import and verify

## 📞 Support

Questions? Check:
1. Sample files in `pyq-templates/`
2. This guide
3. Test with sample data first

---

**Status:** ✅ System ready to use!  
**Estimated setup:** 5 minutes  
**First 100 PYQs:** 30-60 minutes with AI
