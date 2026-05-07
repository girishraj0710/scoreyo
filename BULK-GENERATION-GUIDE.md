# 🚀 PrepGenie - Bulk Question Generation Guide

This guide shows you how to generate ALL questions in one go, then append more later.

---

## 📋 Overview

We've created **APPEND MODE** scripts that:
- ✅ First run: Generate bulk questions (500+ per exam)
- ✅ Later runs: Add more questions to existing files
- ✅ No duplicates, no overwrites
- ✅ Track total questions easily

---

## 🎯 Two-Step Process

### Step 1: Setup Ollama (One-Time, 5 minutes)

```bash
# Install Ollama (if not already)
brew install ollama

# Start Ollama server
ollama serve &

# Download AI model (one-time, ~5 min)
ollama pull llama3.2

# Verify installation
ollama list
# Should show: llama3.2
```

### Step 2: Bulk Generation

Choose your approach:

---

## 🔥 Option A: Maximum Bulk (Recommended for One-Time)

Generate **500 questions per exam** = 9,000 total questions

```bash
# Run this once (takes 10-12 hours)
bash scripts/generate-all-exams-append.sh 500
```

**Details:**
- **Time:** 10-12 hours (run overnight or over weekend)
- **Output:** 9,000 questions total (18 exams × 500 questions)
- **Cost:** $0 (completely FREE with Ollama)
- **Result:** Your question bank is 90% complete!

---

## 🎯 Option B: Medium Bulk

Generate **200 questions per exam** = 3,600 total questions

```bash
# Run this once (takes 4-5 hours)
bash scripts/generate-all-exams-append.sh 200
```

**Details:**
- **Time:** 4-5 hours
- **Output:** 3,600 questions
- **Cost:** $0
- **Result:** Solid foundation, can add more later

---

## 📅 Option C: Gradual Approach

Generate **50 questions per exam** = 900 questions, then repeat monthly

```bash
# First run (1 hour)
bash scripts/generate-all-exams-append.sh 50

# Wait a month, then run again (adds 50 MORE per exam)
bash scripts/generate-all-exams-append.sh 50

# After 10 months: 9,000 questions total
```

**Details:**
- **Time:** 1 hour per run
- **Frequency:** Monthly
- **Output:** 900 questions/month
- **Cost:** $0
- **Result:** Reach 10,000 questions in 11 months

---

## 📈 Checking Your Progress

### See Total Questions Per Exam:

```bash
# List all generated files
ls -lh .agents/artifacts/ollama-generated/

# Count questions in a specific exam
wc -l .agents/artifacts/ollama-generated/jee-main.csv
```

### Example Output:
```
jee-main.csv      - 501 lines (500 questions + header)
neet-ug.csv       - 501 lines (500 questions + header)
upsc-cse.csv      - 501 lines (500 questions + header)
...
```

---

## 🔄 Adding More Questions Later

Once you have your initial bulk, you can **add more anytime**:

```bash
# Add 50 more questions to each exam
bash scripts/generate-all-exams-append.sh 50

# Or add to a specific exam only
node scripts/generate-with-ollama-append.js --exam jee-main --count 100
```

**What happens:**
- ✅ New questions are **APPENDED** to existing files
- ✅ Old questions are **PRESERVED**
- ✅ Total count increases automatically
- ✅ Auto-imported to question bank

---

## 📁 File Structure

```
.agents/artifacts/ollama-generated/
├── jee-main.csv          (500 questions)
├── jee-advanced.csv      (500 questions)
├── neet-ug.csv           (500 questions)
├── neet-pg.csv           (500 questions)
├── upsc-cse.csv          (500 questions)
├── gate.csv              (500 questions)
├── ssc-cgl.csv           (500 questions)
├── ssc-chsl.csv          (500 questions)
├── ibps-po.csv           (500 questions)
├── sbi-po.csv            (500 questions)
├── cat.csv               (500 questions)
├── xat.csv               (500 questions)
├── clat.csv              (500 questions)
├── nda.csv               (500 questions)
├── cds.csv               (500 questions)
├── rrb-ntpc.csv          (500 questions)
├── ctet.csv              (500 questions)
└── ca-foundation.csv     (500 questions)
```

**Note:** Each file contains ALL questions for that exam (not dated).

---

## ⚡ Quick Commands

### Start Generation Now:
```bash
# Option 1: Full bulk (500 per exam, ~10 hours)
bash scripts/generate-all-exams-append.sh 500

# Option 2: Medium (200 per exam, ~4 hours)
bash scripts/generate-all-exams-append.sh 200

# Option 3: Small batch (50 per exam, ~1 hour)
bash scripts/generate-all-exams-append.sh 50
```

### Check Progress:
```bash
# See file sizes
ls -lh .agents/artifacts/ollama-generated/

# Count total questions
wc -l .agents/artifacts/ollama-generated/*.csv

# View generated questions
head -20 .agents/artifacts/ollama-generated/jee-main.csv
```

### Add More Later:
```bash
# Add 50 more to all exams
bash scripts/generate-all-exams-append.sh 50

# Add 100 more to JEE Main only
node scripts/generate-with-ollama-append.js --exam jee-main --count 100
```

---

## 🎯 Recommended Workflow

### For Maximum Efficiency:

1. **Weekend Bulk Generation** (One-Time)
   ```bash
   # Friday evening
   ollama serve &
   bash scripts/generate-all-exams-append.sh 500
   
   # Let it run overnight + Saturday
   # By Sunday: 9,000 questions ready!
   ```

2. **Monthly Top-Ups** (Optional)
   ```bash
   # First Monday of each month
   bash scripts/generate-all-exams-append.sh 50
   
   # Adds 900 more questions
   # After 3 months: 11,700 total
   ```

3. **Deploy to Production**
   ```bash
   # Build and deploy
   npm run build
   git add .
   git commit -m "feat: Add bulk generated questions"
   git push origin main
   
   # Auto-deploys to prepgenie.co.in
   ```

---

## 📊 Time Estimates

| Questions/Exam | Total Questions | Time Required | When to Run |
|----------------|----------------|---------------|-------------|
| 500            | 9,000          | 10-12 hours   | Weekend     |
| 200            | 3,600          | 4-5 hours     | Evening     |
| 100            | 1,800          | 2-3 hours     | After work  |
| 50             | 900            | 1 hour        | Anytime     |

**Note:** Times are approximate. Depends on your CPU speed.

---

## 🔧 Troubleshooting

### Ollama Not Running:
```bash
# Start Ollama
ollama serve &

# Check it's running
curl http://localhost:11434/api/tags
```

### Model Not Found:
```bash
# Download model again
ollama pull llama3.2

# Verify
ollama list
```

### Script Permission Denied:
```bash
# Make executable
chmod +x scripts/generate-all-exams-append.sh
chmod +x scripts/generate-with-ollama-append.js
```

### Questions Not Generating:
```bash
# Check Ollama logs
ollama ps

# Test with single exam
node scripts/generate-with-ollama-append.js --exam jee-main --count 5
```

---

## 🎉 Success Metrics

After bulk generation, you should have:

✅ **9,000+ questions** across 18 exams  
✅ **Files in `.agents/artifacts/ollama-generated/`**  
✅ **Auto-imported to question bank**  
✅ **Cost: $0** (completely FREE)  
✅ **Ready for production** deployment  

---

## 📞 Quick Reference

### The ONE Command You Need:
```bash
# Generate 500 questions per exam (9,000 total)
bash scripts/generate-all-exams-append.sh 500
```

### Then Later (Monthly):
```bash
# Add 50 more per exam (900 more)
bash scripts/generate-all-exams-append.sh 50
```

### That's It!
- No API costs
- No rate limits
- Append-only (never overwrites)
- Track progress easily

---

**Ready to start? Pick your option and run the command!** 🚀
