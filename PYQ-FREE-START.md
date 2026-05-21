# 🆓 FREE PYQ Extraction - Quick Start

**Cost: $0 | Time: 5 minutes for first test**

## ✅ Prerequisites (Already Done!)
- ✅ Ollama running (Cycle 3 active)
- ✅ Scripts ready
- ✅ Directories created

## 🎯 Quick Test: Extract 1 Paper (5 minutes)

### Step 1: Download Sample PDF
Pick ONE paper to test:
- **JEE Main Physics 2024** (easiest to find)
- Search: "JEE Main 2024 Physics question paper PDF"
- Download to: `pyq-raw/jee-main/jee-main-physics-2024.pdf`

### Step 2: Extract Text (30 seconds)
```bash
cd prepgenie

# Install pdftotext if needed (one-time)
brew install poppler  # Mac
# or: sudo apt-get install poppler-utils  # Linux

# Extract text from PDF
pdftotext pyq-raw/jee-main/jee-main-physics-2024.pdf pyq-raw/jee-main/jee-main-physics-2024.txt
```

### Step 3: Run FREE Extraction (3-4 minutes)
```bash
npx tsx scripts/free-pyq-extract-ollama.ts jee-main physics 2024 pyq-raw/jee-main/jee-main-physics-2024.txt
```

**Expected output:**
```
📄 JEE-MAIN 2024 - physics
   📝 Text: 15.2KB
   🤖 Using FREE Ollama (local AI)...
   ✅ Extracted 25 questions
   💾 Saved: pyq-data/jee-main-physics-2024.json
   ✅ Imported 23/25 to database
```

### Step 4: Verify (10 seconds)
```bash
npx tsx scripts/check-pyq-status.ts
```

You should see:
```
Total PYQs imported: 26 (3 existing + 23 new)

By Exam & Year:
  pyq-jee-main-2024: 25 questions
  pyq-neet-ug-2024: 1 question
```

---

## ✅ Success! Now Scale Up

### Option A: Process More Papers Manually
```bash
# Download more PDFs to pyq-raw/
# Extract each one:
npx tsx scripts/free-pyq-extract-ollama.ts <exam> <subject> <year> <file.txt>
```

### Option B: Batch Process (Coming Soon)
We can create a batch script to process all files in `pyq-raw/` automatically.

---

## 📊 Time & Cost Estimates

**Per Paper:**
- Download PDF: 2 minutes
- Extract text: 30 seconds  
- Ollama extraction: 10-15 minutes
- **Total: ~15 minutes per paper**
- **Cost: $0**

**Week 1 Target (15 papers):**
- Total time: 4-5 hours (mostly automated, can run in background)
- Total cost: $0
- Result: 500+ PYQs

---

## 💡 Pro Tips

1. **Run in Background:** Ollama extraction takes 10-15 min per paper - let it run while you download more PDFs

2. **Quality Check:** After extraction, open the JSON file to verify quality:
   ```bash
   cat pyq-data/jee-main-physics-2024.json | head -50
   ```

3. **Batch Download:** Download all 15 PDFs first, then run extraction overnight

4. **Parallel Processing:** You can run multiple extraction scripts in parallel (different terminals) since Ollama can handle it

---

## 🆘 Troubleshooting

**"Ollama error: Connection refused"**
```bash
# Check if Ollama is running
ps aux | grep ollama

# If not, start it:
ollama serve
```

**"No questions extracted"**
→ PDF text quality might be poor. Try different PDF or check text file manually

**"Text too short"**
→ pdftotext might have failed. Try opening PDF manually and checking if it's text or scanned image

---

## 🎯 Next Steps After First Success

1. ✅ Test with 1 paper (JEE Physics)
2. Scale to 5 papers (JEE Physics, Chemistry, Maths, NEET Physics, Biology)
3. Complete Week 1: All 15 papers
4. Week 2: Expand to 2020-2024 (5 years)

**Ready to start?**

```bash
# Download 1 PDF first, then run:
npx tsx scripts/free-pyq-extract-ollama.ts jee-main physics 2024 pyq-raw/jee-main/jee-main-physics-2024.txt
```

🆓 **100% FREE! No API costs!**
