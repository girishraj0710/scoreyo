# PrepGenie Question Seeding Scripts

## 🎯 Choose Your Approach

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  NEW TO PREPGENIE SEEDING?                                      │
│  → Start here: SEEDING-GUIDE.md                                 │
│                                                                 │
│  NEED QUICK REFERENCE?                                          │
│  → See: SEEDING-QUICKSTART.md                                   │
│                                                                 │
│  JUST WANT TO FILL GAPS?                                        │
│  → Run: npm run fill:gaps                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Available Scripts

### 1. Setup & Validation
```bash
npm run seed:setup
```
Validates Ollama installation, model availability, and tests generation.
**Run this first!**

### 2. Gap Filling (⭐ RECOMMENDED)
```bash
npm run fill:gaps                 # Fill topics with < 25 questions
npm run fill:gaps -- 30           # Custom threshold
npm run fill:gaps -- 25 jee-main  # Specific exam
```
Smart approach: Only generates questions where needed.

### 3. Full Seeding
```bash
npm run seed:questions                            # All exams
npm run seed:questions jee-main                   # Specific exam
npm run seed:questions jee-main jee-physics       # Specific subject
npm run seed:questions jee-main jee-physics "Kinematics"  # Specific topic
```
Traditional approach: Seed everything from scratch.

---

## 🚀 Quick Start (3 Commands)

```bash
# 1. Install Ollama + model
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull gemma2:9b
ollama serve  # Keep this running

# 2. Validate
npm run seed:setup

# 3. Fill gaps
npm run fill:gaps
```

⏱️ **Time:** ~15 minutes setup + 2-6 hours seeding (depending on gaps)

---

## 📊 Script Comparison

| Feature | Gap Filling | Full Seeding |
|---------|-------------|--------------|
| **Command** | `npm run fill:gaps` | `npm run seed:questions` |
| **Best For** | Existing database | New database |
| **Speed** | ⚡⚡⚡ Fast | ⚡⚡ Medium |
| **Smart Prioritization** | ✅ Yes | ❌ No |
| **Control** | Threshold-based | Topic-by-topic |
| **Use Case** | Maintenance | Initial setup |

**Recommendation:** Use **Gap Filling** for 90% of use cases. It's smarter and faster.

---

## 📚 Documentation

| File | Description | Read When |
|------|-------------|-----------|
| **[SUMMARY.md](./SUMMARY.md)** | High-level overview | You want big picture |
| **[SEEDING-GUIDE.md](./SEEDING-GUIDE.md)** | Complete guide | First time user |
| **[SEEDING-QUICKSTART.md](./SEEDING-QUICKSTART.md)** | Quick reference | Quick lookup |
| **[README-SEEDING.md](./README-SEEDING.md)** | Full seeding deep-dive | Advanced usage |
| **This file (README.md)** | Entry point | You're reading it! |

---

## 🎓 What Gets Generated

Every question includes:

```json
{
  "question": "A block of mass 5 kg...",
  "options": ["4.9 m/s²", "8.5 m/s²", "9.8 m/s²", "2.45 m/s²"],
  "correctAnswer": 0,
  "explanation": {
    "logic": "Step-by-step reasoning...",
    "formula": "a = g·sin(θ)",
    "calculation": "a = 9.8 × 0.5 = 4.9 m/s²",
    "trapAlerts": ["Don't use cos(30°)...", "Don't forget sin(θ)..."],
    "commonMistakes": ["Using g directly...", "Confusing components..."]
  },
  "difficulty": "medium",
  "source": "ollama-gemma2:9b"
}
```

✅ **Exam-realistic**: Matches JEE/NEET/UPSC/CAT/GATE patterns  
✅ **Quality explanations**: Logic + formulas + calculations + traps  
✅ **Smart options**: Close enough to require analysis  
✅ **Proper difficulty**: 40% easy, 40% medium, 20% hard  

---

## ⚙️ Requirements

### Hardware
- **Minimum:** 8GB RAM (gemma2:2b)
- **Recommended:** 16GB RAM (gemma2:9b)
- **Best:** 32GB RAM (gemma2:27b)

### Software
1. **Ollama** ([ollama.ai](https://ollama.ai))
2. **Node.js** 18+ (already installed for Next.js)
3. **Turso Database** (already configured)

### Models (Choose ONE)
```bash
ollama pull gemma2:9b     # Recommended (5.5GB)
ollama pull llama3.1:8b   # Alternative (4.7GB)
ollama pull mistral:7b    # Faster (4.1GB)
ollama pull gemma2:27b    # Best quality (16GB)
ollama pull gemma2:2b     # Budget (1.6GB)
```

---

## 🎯 Exam Coverage

Questions generated for **20+ Indian competitive exams**:

### Engineering
- JEE Main, JEE Advanced, GATE
- KCET, COMEDK, MHT CET
- WBJEE, TS EAMCET, AP EAMCET

### Medical
- NEET, AIIMS

### Government
- UPSC Prelims, UPSC Mains
- SSC CGL, SSC CHSL

### Banking & Finance
- IBPS PO, SBI PO, RBI Grade B

### Management
- CAT, XAT, SNAP, NMAT

### State Services
- KPSC, MPSC, TNPSC

---

## 📈 Success Metrics

After running the scripts:

✅ **Coverage:** 25-50 questions per topic  
✅ **Quality:** Exam-realistic patterns  
✅ **Explanations:** Rich with formulas and traps  
✅ **Distribution:** 40% easy, 40% medium, 20% hard  
✅ **Deduplication:** Automatic duplicate detection  

---

## 💡 Pro Tips

### 1. Start Small
```bash
# Test with one topic first
npm run fill:gaps -- 25 jee-main
```

### 2. Monitor Progress
```bash
# Check current question counts
sqlite3 prepgenie.db "
SELECT t.topic_name, COUNT(q.id) as questions
FROM dim_topics t
LEFT JOIN fact_exam_questions q ON t.id = q.topic_id
GROUP BY t.topic_name
HAVING questions < 25
ORDER BY questions ASC;
"
```

### 3. Validate Quality
After first run, manually check 5-10 questions:
- Answer accuracy ✅
- Explanation clarity ✅
- Exam pattern match ✅

### 4. Iterative Approach
```bash
# Phase 1: Get to 25 questions/topic
npm run fill:gaps -- 25

# Phase 2: Boost to 40
npm run fill:gaps -- 40

# Phase 3: Final quality (50+)
npm run fill:gaps -- 50
```

---

## 🐛 Troubleshooting

### Quick Fixes

**Problem:** "Ollama not responding"
```bash
pkill ollama && ollama serve
```

**Problem:** "Model not found"
```bash
ollama list
ollama pull gemma2:9b
```

**Problem:** "Out of memory"
```bash
export OLLAMA_MODEL=gemma2:2b
export BATCH_SIZE=2
```

**Problem:** "Too many parse errors"
- Normal: 10-20% failure rate
- High (>30%): Switch to gemma2:9b
- Check: `ollama logs`

### Detailed Troubleshooting
See [SEEDING-GUIDE.md](./SEEDING-GUIDE.md#troubleshooting) for full troubleshooting guide.

---

## 💰 Cost Analysis

| Solution | Setup | Cost/Exam | Total (20 exams) | Quality |
|----------|-------|-----------|------------------|---------|
| **Ollama (Local)** | 30 min | $0 | $0 | Good-Excellent |
| OpenRouter (Gemini) | 5 min | $0.50 | $10 | Excellent |
| OpenRouter (GPT-4) | 5 min | $2-5 | $40-100 | Best |

**Verdict:** Ollama wins for development and testing. Consider OpenRouter for production launch.

---

## 🔄 Migration Path

### Start with Ollama (Free)
```bash
npm run fill:gaps
```

### Upgrade to Cloud API (Later)
1. Add API key to `.env.local`
2. Questions automatically fall back to cloud when cache is empty
3. Both systems work together seamlessly

---

## 📊 Database Schema

Questions stored in **dimensional model**:

```
dim_exams → dim_subjects → dim_topics
                              ↓
                  bridge_exam_subject_topic
                              ↓
                    fact_exam_questions
```

**Benefits:**
- Topics shared across exams
- Efficient storage
- Easy to add new exams
- Historical tracking

---

## 🎉 Ready to Start?

### Absolute Beginner
1. Read [SEEDING-QUICKSTART.md](./SEEDING-QUICKSTART.md)
2. Run `npm run seed:setup`
3. Run `npm run fill:gaps`

### Want More Control
1. Read [SEEDING-GUIDE.md](./SEEDING-GUIDE.md)
2. Choose: Gap Filling vs Full Seeding
3. Customize with environment variables

### Advanced User
1. Read [README-SEEDING.md](./README-SEEDING.md)
2. Configure model, batch size, thresholds
3. Run parallel instances for different exams

---

## 🆘 Need Help?

1. **Setup issues**: Run `npm run seed:setup`
2. **General questions**: Read [SEEDING-GUIDE.md](./SEEDING-GUIDE.md)
3. **Quality issues**: Consider larger model or cloud API
4. **Technical issues**: Check [Ollama docs](https://github.com/ollama/ollama)

---

## 📝 Quick Command Reference

```bash
# Setup
npm run seed:setup

# Gap Filling (RECOMMENDED)
npm run fill:gaps                    # Default (25 questions min)
npm run fill:gaps -- 30              # Custom threshold
npm run fill:gaps -- 25 jee-main     # Specific exam

# Full Seeding
npm run seed:questions               # All exams
npm run seed:questions jee-main      # One exam
npm run seed:questions jee-main jee-physics  # One subject
npm run seed:questions jee-main jee-physics "Kinematics"  # One topic

# Configuration
export OLLAMA_MODEL=gemma2:9b        # Model selection
export BATCH_SIZE=5                  # Batch size
export QUESTIONS_PER_TOPIC=30        # Full seeding only
```

---

**🚀 Get Started Now:**

```bash
npm run seed:setup && npm run fill:gaps
```

See [SEEDING-GUIDE.md](./SEEDING-GUIDE.md) for complete documentation!
