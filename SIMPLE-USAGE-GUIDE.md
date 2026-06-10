# 🚀 Krakkify Question Generation - SIMPLE GUIDE

## The ONLY Command You Need to Run

```bash
bash scripts/generate-all-exams.sh
```

That's it! This single command generates questions for **ALL 18 major exams at once**.

---

## 📋 What It Does

Generates questions for:
1. **JEE Main** - Physics, Chemistry, Mathematics
2. **JEE Advanced** - Physics, Chemistry, Mathematics
3. **NEET UG** - Physics, Chemistry, Biology
4. **NEET PG** - Medicine, Surgery
5. **UPSC CSE** - History, Polity, Geography, Economy
6. **GATE CS** - Computer Science, Aptitude, Engineering Math
7. **SSC CGL** - Quant, Reasoning, English, GK
8. **SSC CHSL** - Quant, Reasoning, English, GK
9. **IBPS PO** - Quant, Reasoning, English, GK
10. **SBI PO** - Quant, Reasoning, English, GK
11. **CAT** - Quant, Verbal, DILR
12. **XAT** - Quant, Verbal, Decision Making
13. **CLAT** - English, GK, Legal Reasoning, Logical Reasoning
14. **NDA** - Mathematics, General Ability Test
15. **CDS** - English, GK, Mathematics
16. **RRB NTPC** - Mathematics, Reasoning, GK
17. **CTET** - Child Development, Languages
18. **CA Foundation** - Accounts, Law, Mathematics

**Total: 60+ subjects, 200+ topics covered!**

---

## ⏱️ Time Estimate

| Questions per Exam | Total Questions | Time Required |
|-------------------|-----------------|---------------|
| 10 | 180 | 30 minutes |
| 20 (default) | 360 | 1 hour |
| 50 | 900 | 2.5 hours |
| 100 | 1,800 | 5 hours |

---

## 🎯 One-Time Setup (5 Minutes)

**Only need to do this ONCE:**

```bash
# 1. Install Ollama
brew install ollama

# 2. Download AI model (5 minutes, one-time)
ollama pull llama3.2

# 3. Done! Setup complete forever
```

---

## 📅 Your Monthly Routine

### **Every Month (1st Monday):**

```bash
# Generate 20 questions per exam (360 total)
bash scripts/generate-all-exams.sh

# Takes: 1 hour
# Output: 360 questions across all exams
```

### **Or Customize:**

```bash
# 10 questions per exam (quick run)
bash scripts/generate-all-exams.sh 10

# 50 questions per exam (more coverage)
bash scripts/generate-all-exams.sh 50

# 100 questions per exam (extensive)
bash scripts/generate-all-exams.sh 100
```

---

## 📊 Growth Timeline

### **Monthly (20 questions/exam):**

| Month | Total Questions |
|-------|----------------|
| 1 | 360 |
| 3 | 1,080 |
| 6 | 2,160 |
| 12 | 4,320 |
| 24 | 8,640 |
| 30 | 10,800 ✅ |

**10,000+ questions in 2.5 years with just 1 hour per month!**

---

### **Quarterly (50 questions/exam):**

| Quarter | Total Questions |
|---------|----------------|
| Q1 | 900 |
| Q2 | 1,800 |
| Q3 | 2,700 |
| Q4 | 3,600 |
| Year 2 | 7,200 |
| Year 3 | 10,800 ✅ |

**10,000+ questions in 3 years with just 2.5 hours every 3 months!**

---

### **One-Time Bulk (100 questions/exam):**

```bash
# Run once over a weekend
bash scripts/generate-all-exams.sh 100

# Takes: ~5 hours
# Output: 1,800 questions

# Run 5-6 times over few months
# Total: 9,000-10,800 questions ✅
```

---

## 🎉 That's It!

### **Remember:**

✅ **One command:** `bash scripts/generate-all-exams.sh`  
✅ **All exams:** 18 exams automatically  
✅ **Auto-import:** Questions ready immediately  
✅ **Free forever:** No API costs  

---

## 🔄 What Happens Automatically

1. ✅ Generates questions for all 18 exams
2. ✅ Covers all subjects and topics
3. ✅ Mixes difficulty (easy, medium, hard)
4. ✅ Saves to CSV files
5. ✅ Auto-imports to question bank
6. ✅ Shows summary statistics
7. ✅ Ready for mock tests immediately!

**No manual work needed - just run the command!**

---

## 📖 Example Run

```bash
$ bash scripts/generate-all-exams.sh 20

╔═══════════════════════════════════════════════════════════════╗
║     Krakkify - Generating Questions for ALL Exams            ║
╚═══════════════════════════════════════════════════════════════╝

📊 Configuration:
   Questions per exam: 20

🚀 Starting generation for all exams...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 Generating 20 questions for: jee-main
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Generating: Mechanics (easy)...
   ✅ Generated successfully
   Generating: Thermodynamics (medium)...
   ✅ Generated successfully
   ...

✅ Completed: jee-main

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 Generating 20 questions for: neet-ug
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 ALL DONE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary:
   Total exams processed: 18
   Questions per exam: 20
   Total questions generated: 360

✅ All questions have been auto-imported to the question bank!
```

---

## ❓ Need Help?

**Script not working?**

```bash
# Check Ollama is installed
ollama list

# If not installed
brew install ollama
ollama pull llama3.2

# Then try again
bash scripts/generate-all-exams.sh
```

---

## 📞 Summary

### **To Generate Questions:**

1. ✅ Setup once: `brew install ollama && ollama pull llama3.2`
2. ✅ Run monthly: `bash scripts/generate-all-exams.sh`
3. ✅ Done! Questions ready for all exams

**That's the entire process!** 🎉

---

**Save this command and run it every month:**

```bash
bash scripts/generate-all-exams.sh
```

**Add to your calendar reminder!** 📅
