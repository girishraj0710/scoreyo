# PrepGenie Ollama Question Seeding - Summary

## ✅ What We Built

A complete local AI-powered question generation system for PrepGenie using **Ollama** (free, runs on your machine).

## 📦 Files Created

### 1. Core Scripts
- **`seed-questions-ollama.ts`** - Full seeding (all topics from scratch)
- **`fill-question-gaps-ollama.ts`** - Smart gap filling (only topics with insufficient questions) ⭐ **RECOMMENDED**
- **`setup-ollama.ts`** - Setup validation wizard

### 2. Documentation
- **`SEEDING-GUIDE.md`** - Complete guide (full seeding vs gap filling)
- **`README-SEEDING.md`** - Detailed full seeding documentation
- **`SEEDING-QUICKSTART.md`** - Quick reference card

### 3. NPM Scripts
```json
{
  "seed:setup": "Validate Ollama setup",
  "seed:questions": "Full seeding from scratch",
  "fill:gaps": "Smart gap filling (RECOMMENDED)"
}
```

---

## 🚀 Quick Start (3 Steps)

```bash
# 1. Install Ollama and pull model
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull gemma2:9b
ollama serve  # Keep running in separate terminal

# 2. Validate setup
npm run seed:setup

# 3. Fill question gaps (EASIEST)
npm run fill:gaps
```

---

## 🎯 Key Features

### ✅ Exam-Realistic Questions
- Matches actual exam patterns (JEE, NEET, UPSC, CAT, GATE, SSC, etc.)
- Uses realistic numerical values with proper units
- Options require careful analysis (no obvious wrong answers)
- Time-appropriate complexity

### ✅ Rich Explanations
Every question includes:
- **Logic**: Step-by-step reasoning
- **Formula**: Key formulas used
- **Calculation**: Computation steps
- **Trap Alerts**: Common wrong answer traps
- **Common Mistakes**: Typical student errors

### ✅ Smart Gap Filling
- Scans database for topics with < threshold questions
- Prioritizes by exam importance (JEE Main → JEE Adv → NEET → ...)
- Generates only what's needed
- Automatic duplicate detection

### ✅ Dimensional Database
- Topics shared across exams (e.g., "Trigonometry" for JEE + CAT + SSC)
- Efficient storage and retrieval
- Historical tracking (valid_from, valid_until)

---

## 📊 Two Seeding Approaches

### Approach 1: Full Seeding
**Use when:** Starting fresh, adding new exam, or want granular control

```bash
# All topics for an exam
npm run seed:questions jee-main

# Specific subject
npm run seed:questions jee-main jee-physics

# Single topic (test run)
npm run seed:questions jee-main jee-physics "Kinematics"
```

**Output:** 30 questions per topic (40% easy, 40% medium, 20% hard)

### Approach 2: Gap Filling ⭐ **RECOMMENDED**
**Use when:** Maintaining existing database, want smart prioritization

```bash
# Fill all topics with < 25 questions (default)
npm run fill:gaps

# Fill topics with < 30 questions
npm run fill:gaps -- 30

# Fill specific exam
npm run fill:gaps -- 25 jee-main
```

**Output:** Only generates questions for topics below threshold

---

## 🎓 Exam Patterns Supported

| Exam | Key Features |
|------|-------------|
| **JEE Main** | Numerical value, assertion-reasoning, NCERT-based |
| **JEE Advanced** | Multi-concept integration, paragraph-based, matrix-match |
| **NEET** | NCERT-centric (70%), fast-solvable, diagram-heavy biology |
| **UPSC** | Current affairs, policy analysis, lengthy options |
| **SSC CGL** | Speed-based, formula-heavy, 45-60 sec/question |
| **CAT** | Data interpretation, logical reasoning, lengthy passages |
| **GATE** | NAT questions, formula application, calculator-friendly |
| **State CETs** | State board syllabus, NCERT-based, moderate difficulty |

---

## ⚙️ Configuration

### Models (Choose Based on Hardware)

| Model | Size | RAM | Quality | Speed |
|-------|------|-----|---------|-------|
| `gemma2:27b` | 16GB | 32GB+ | ⭐⭐⭐⭐⭐ | Slow |
| **`gemma2:9b`** ⭐ | 5.5GB | 16GB | ⭐⭐⭐⭐ | Medium |
| `llama3.1:8b` | 4.7GB | 16GB | ⭐⭐⭐⭐ | Medium |
| `mistral:7b` | 4.1GB | 16GB | ⭐⭐⭐ | Fast |
| `gemma2:2b` | 1.6GB | 8GB | ⭐⭐ | Very Fast |

### Environment Variables
```bash
export OLLAMA_MODEL=gemma2:9b       # Model to use
export OLLAMA_HOST=http://localhost:11434  # Ollama API
export QUESTIONS_PER_TOPIC=30       # Full seeding only
export BATCH_SIZE=5                 # Questions per API call
```

---

## 📈 Performance

### Time Estimates (gemma2:9b)

| Operation | Time |
|-----------|------|
| 1 topic (30 questions) | 2-3 minutes |
| 1 subject (25 topics) | 1-1.5 hours |
| 1 exam (3 subjects) | 3-5 hours |
| All 20+ exams | 60-100 hours |

### Gap Filling (Faster)
- Minor gaps (5-10 questions): ~2 seconds per topic
- Medium gaps (10-20 questions): ~1-2 minutes per topic
- Large gaps (20-30 questions): ~2-3 minutes per topic

---

## 💡 Recommended Workflow

### For New PrepGenie Instance
```bash
# Day 1: High-priority exams (8-10 hours)
npm run fill:gaps -- 30 jee-main
npm run fill:gaps -- 30 jee-advanced
npm run fill:gaps -- 30 neet

# Day 2: Fill all remaining gaps (4-6 hours)
npm run fill:gaps -- 25

# Day 3: Boost quality (optional, 4-6 hours)
npm run fill:gaps -- 40
```

### For Existing PrepGenie Instance
```bash
# Weekly: Maintain 25+ questions per topic
npm run fill:gaps -- 25

# Monthly: Increase to 40+
npm run fill:gaps -- 40

# Pre-launch: Boost to 50+
npm run fill:gaps -- 50
```

---

## 🔍 Validation

### Check Database Status
```bash
# Total questions
sqlite3 prepgenie.db "SELECT COUNT(*) FROM fact_exam_questions;"

# Questions per exam
sqlite3 prepgenie.db "
SELECT e.exam_name, COUNT(q.id) as questions
FROM fact_exam_questions q
JOIN dim_topics t ON q.topic_id = t.id
JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
JOIN dim_exams e ON b.exam_id = e.id
GROUP BY e.exam_name;
"

# Topics needing questions
sqlite3 prepgenie.db "
SELECT t.topic_name, COUNT(q.id) as count
FROM dim_topics t
LEFT JOIN fact_exam_questions q ON t.id = q.topic_id
GROUP BY t.topic_name
HAVING count < 25
ORDER BY count ASC;
"
```

### Manual Validation
After first run, check 5-10 questions:
1. Answer accuracy ✅
2. Explanation clarity ✅
3. Exam pattern match ✅
4. Option plausibility ✅
5. Difficulty calibration ✅

---

## 🐛 Common Issues

### "Ollama not responding"
```bash
curl http://localhost:11434/api/tags
# If fails: pkill ollama && ollama serve
```

### "Model not found"
```bash
ollama list
ollama pull gemma2:9b
```

### "Out of memory"
```bash
export OLLAMA_MODEL=gemma2:2b
export BATCH_SIZE=2
```

### "Parse errors"
- Normal: 10-20% failure rate
- Script continues automatically
- Use stable model (gemma2:9b)

---

## 💰 Cost Comparison

| Solution | Cost | Quality | Setup |
|----------|------|---------|-------|
| **Ollama (Local)** | $0 | Good-Excellent | Medium |
| OpenRouter (Gemini) | ~$0.50/exam | Excellent | Easy |
| OpenRouter (GPT-4) | ~$2-5/exam | Best | Easy |

**Recommendation:**
- **Development/Testing**: Ollama (free, good quality)
- **Production**: OpenRouter (best quality, fast)
- **Hybrid**: Both (Ollama for bulk, OpenRouter for refinement)

---

## 🎯 Next Steps

### 1. First-Time Setup
```bash
npm run seed:setup        # Validate environment
npm run fill:gaps -- 1    # Analyze current state
npm run fill:gaps         # Fill all gaps
```

### 2. Regular Maintenance
```bash
# Weekly check
npm run fill:gaps -- 25

# Monthly boost
npm run fill:gaps -- 40
```

### 3. Quality Improvement
- Manually review first 20-30 questions
- Adjust prompts in scripts if needed
- Consider upgrading to larger model (gemma2:27b)
- Or switch to OpenRouter API for production

---

## 📚 Documentation Index

1. **SEEDING-GUIDE.md** - Start here (comprehensive guide)
2. **SEEDING-QUICKSTART.md** - Quick reference card
3. **README-SEEDING.md** - Deep dive on full seeding
4. **This file (SUMMARY.md)** - Overview

---

## ✅ What's Different from Cloud APIs

| Feature | Ollama | OpenRouter |
|---------|--------|------------|
| Cost | Free | ~$0.50-5/exam |
| Privacy | 100% local | Cloud-based |
| Speed | Medium | Fast |
| Quality | Good (9B) | Excellent |
| Setup | Requires installation | Just API key |
| Hardware | 16GB+ RAM | Any device |
| Offline | ✅ Yes | ❌ No |

---

## 🎉 Success Criteria

After running the scripts, you should have:

✅ 25-50 questions per topic  
✅ 40% easy, 40% medium, 20% hard distribution  
✅ Rich explanations with formulas and traps  
✅ Exam-realistic questions matching actual patterns  
✅ Automatic duplicate detection  
✅ Smart prioritization by exam importance  

---

## 🔗 Related Systems

This seeding system integrates with:
- **Frontend Quiz Engine** (`src/lib/quiz-generator.ts`) - Uses these questions
- **Database** (`src/lib/db.ts`) - Dimensional model storage
- **API Routes** (`src/app/api/quiz`) - 3-tier system (verified → cached → AI)

---

## 💬 Support

Issues? Check:
1. `npm run seed:setup` - Validates environment
2. Troubleshooting sections in docs
3. Ollama logs: `ollama logs`
4. Model compatibility: `ollama list`

---

**Ready to generate exam-realistic questions with local AI?**

```bash
npm run seed:setup && npm run fill:gaps
```

🚀 **That's it!** The system will intelligently fill all question gaps using free, local AI.
