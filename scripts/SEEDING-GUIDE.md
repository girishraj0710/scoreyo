# PrepGenie Question Seeding - Complete Guide

## 🎯 Two Seeding Approaches

### 1. **Full Seeding** (Start from Scratch)
Use when: Building initial question bank OR adding a completely new exam

```bash
npm run seed:questions [exam-id] [subject-id] [topic]
```

### 2. **Gap Filling** (Targeted - RECOMMENDED)
Use when: You already have some questions but need to fill gaps

```bash
npm run fill:gaps [min-questions] [exam-id]
```

---

## 🚀 Quick Start (Gap Filling Approach)

### Step 1: Setup (First Time Only)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull model
ollama pull gemma2:9b

# Start Ollama (separate terminal)
ollama serve

# Validate setup
npm run seed:setup
```

### Step 2: Analyze Current State
```bash
# Check which topics have low question counts
npm run fill:gaps -- 1   # Just analyze (set min=1 to see all topics)
```

Expected output:
```
Found 156 topics needing questions:

Total questions needed: 3,840

Breakdown by exam:
  • JEE Main: 75 topics
  • NEET: 48 topics
  • UPSC Prelims: 23 topics
  • SSC CGL: 10 topics
```

### Step 3: Fill Gaps
```bash
# Fill all topics with < 25 questions (default)
npm run fill:gaps

# Fill topics with < 30 questions
npm run fill:gaps -- 30

# Fill only JEE Main topics with < 25 questions
npm run fill:gaps -- 25 jee-main

# Fill only JEE Main Physics topics with < 30 questions
npm run fill:gaps -- 30 jee-main
```

---

## 📊 Comparison: Full Seeding vs Gap Filling

| Feature | Full Seeding | Gap Filling |
|---------|--------------|-------------|
| **Use Case** | New exam / fresh start | Maintain existing DB |
| **Command** | `npm run seed:questions` | `npm run fill:gaps` |
| **Speed** | Slower (processes all topics) | Faster (only needed topics) |
| **Smart Prioritization** | ❌ No | ✅ Yes (by exam importance) |
| **Duplicate Handling** | ✅ Skips automatically | ✅ Skips automatically |
| **Flexibility** | Topic-by-topic control | Gap threshold control |
| **Best For** | Initial setup | Ongoing maintenance |

---

## 🎯 Recommended Workflow

### For New PrepGenie Instance
```bash
# Day 1: Fill gaps for high-priority exams
npm run fill:gaps -- 30 jee-main
npm run fill:gaps -- 30 jee-advanced
npm run fill:gaps -- 30 neet

# Day 2: Fill remaining exams
npm run fill:gaps -- 25

# Day 3: Increase quality (optional)
npm run fill:gaps -- 50
```

### For Existing PrepGenie Instance
```bash
# Weekly maintenance: Keep all topics at 25+ questions
npm run fill:gaps -- 25

# Before launch: Boost to 40+ questions
npm run fill:gaps -- 40

# Production: Maintain 50+ questions per topic
npm run fill:gaps -- 50
```

---

## ⚙️ Configuration Options

### Environment Variables
```bash
# Model selection (affects quality and speed)
export OLLAMA_MODEL=gemma2:9b      # Default (balanced)
export OLLAMA_MODEL=llama3.1:8b    # Alternative
export OLLAMA_MODEL=mistral:7b     # Faster, lower quality
export OLLAMA_MODEL=gemma2:27b     # Slower, highest quality

# Ollama host
export OLLAMA_HOST=http://localhost:11434  # Default

# Batch size (questions per API call)
export BATCH_SIZE=5    # Default (stable)
export BATCH_SIZE=3    # More stable for weak connections
export BATCH_SIZE=10   # Faster but less stable
```

### Command-Line Arguments

**Full Seeding:**
```bash
npm run seed:questions                      # All exams
npm run seed:questions jee-main             # Specific exam
npm run seed:questions jee-main jee-physics # Specific subject
npm run seed:questions jee-main jee-physics "Kinematics"  # Specific topic
```

**Gap Filling:**
```bash
npm run fill:gaps                   # Default: fill topics with < 25 questions
npm run fill:gaps -- 30             # Custom threshold: < 30 questions
npm run fill:gaps -- 40 jee-main    # Custom + specific exam
```

---

## 📈 Exam Priority System (Gap Filling Only)

Gap filling prioritizes exams by importance:

| Priority | Exams | Filled First |
|----------|-------|--------------|
| 100 | JEE Main | ✅ 1st |
| 95 | JEE Advanced | ✅ 2nd |
| 90 | NEET | ✅ 3rd |
| 85 | UPSC Prelims | ✅ 4th |
| 80 | SSC CGL | ✅ 5th |
| 75 | CAT, GATE | ✅ 6th |
| 70 | Banking PO | ✅ 7th |
| 65 | KCET, MHT CET | ✅ 8th |
| 60 | COMEDK, WBJEE | ✅ 9th |
| 55 | TS EAMCET, AP EAMCET | ✅ 10th |

Within same priority, larger gaps are filled first.

---

## 🎓 Exam-Specific Patterns

Both scripts generate questions matching actual exam patterns:

### JEE Main
- ✅ Single correct + numerical value questions
- ✅ NCERT-based (40%) + problem-solving (60%)
- ✅ Realistic numerical values with units
- ✅ Options close enough to require calculation

### JEE Advanced
- ✅ Multi-concept integration (3-4 concepts)
- ✅ Paragraph-based comprehension
- ✅ Counter-intuitive scenarios
- ✅ Physics+Math or Chemistry+Math integration

### NEET
- ✅ NCERT-centric (70%)
- ✅ Direct recall + clinical application
- ✅ Biology: diagrams, processes, disease mechanisms
- ✅ Fast-solvable (45 sec/question)

### UPSC
- ✅ Current affairs integration
- ✅ Policy analysis, multi-disciplinary
- ✅ Lengthy options requiring elimination
- ✅ Conceptual clarity + real-world application

### SSC CGL
- ✅ Speed-based calculation
- ✅ Formula-heavy quants
- ✅ Solvable in 45-60 seconds
- ✅ Direct application, minimal theory

### CAT
- ✅ Data interpretation (tables/graphs)
- ✅ Logical reasoning (puzzles)
- ✅ Lengthy RC passages (400-500 words)
- ✅ Unconventional problem types

### GATE
- ✅ Numerical Answer Type (NAT)
- ✅ Formula application + computation
- ✅ Engineering depth
- ✅ Calculator-friendly decimal answers

---

## 📊 Expected Output Quality

Every question includes:

### 1. Question Text
- Exam-realistic wording
- Proper units and notation
- Realistic numerical values

### 2. Four Options
- Close enough to require analysis
- No obviously wrong options
- Proper formatting

### 3. Rich Explanation
```json
{
  "logic": "Step-by-step reasoning (2-3 sentences)",
  "formula": "Key formula(s) used or null",
  "calculation": "Computation steps or null",
  "trapAlerts": ["Common trap 1", "Common trap 2"],
  "commonMistakes": ["Typical mistake 1", "Typical mistake 2"]
}
```

---

## 🔍 Monitoring Progress

### Check Current Status
```bash
# Total questions in database
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

# Topics with low question counts
sqlite3 prepgenie.db "
SELECT t.topic_name, COUNT(q.id) as count
FROM dim_topics t
LEFT JOIN fact_exam_questions q ON t.id = q.topic_id
GROUP BY t.topic_name
HAVING count < 25
ORDER BY count ASC;
"
```

### During Seeding
Watch for:
- ✅ Successful generations (should be ~80-90% success rate)
- ⚠️ Occasional parse errors (normal, script continues)
- ❌ Persistent failures (check model, prompt, or connection)

---

## ⏱️ Time Estimates

### Gap Filling (Recommended)
| Scenario | Topics | Time (gemma2:9b) |
|----------|--------|------------------|
| Minor gaps (5-10 questions) | 50 topics | ~1-2 hours |
| Medium gaps (10-20 questions) | 50 topics | ~2-4 hours |
| Large gaps (20-30 questions) | 50 topics | ~4-6 hours |

### Full Seeding
| Unit | Time (gemma2:9b) |
|------|------------------|
| 1 topic (30 questions) | 2-3 minutes |
| 1 subject (25 topics) | 1-1.5 hours |
| 1 exam (3 subjects) | 3-5 hours |
| All exams (20+) | 60-100 hours |

**Speed Tips:**
- Use `mistral:7b` for faster generation (50% faster)
- Use `gemma2:27b` for best quality (3x slower)
- Run multiple instances for different exams (watch RAM)
- Reduce `BATCH_SIZE` for more stable generation

---

## 🐛 Troubleshooting

### Common Issues

**"Ollama not responding"**
```bash
curl http://localhost:11434/api/tags
# If fails: pkill ollama && ollama serve
```

**"Model not found"**
```bash
ollama list
ollama pull gemma2:9b
```

**"Out of memory"**
```bash
# Use smaller model
export OLLAMA_MODEL=gemma2:2b
export BATCH_SIZE=2
```

**"Too many parse errors"**
- Normal: 10-20% failure rate is acceptable
- High (>30%): Switch to more stable model (gemma2:9b)
- Extreme (>50%): Check Ollama logs, restart service

**"Questions are low quality"**
- Use larger model (gemma2:9b minimum)
- Avoid gemma2:2b for production
- Consider switching to OpenRouter API for best quality

---

## 🎯 Best Practices

### 1. Start with Gap Filling
```bash
# Better: Fill only what's needed
npm run fill:gaps -- 25 jee-main

# Instead of: Seed everything
npm run seed:questions jee-main
```

### 2. Validate Sample Questions
After first run, manually check 5-10 questions:
- Correct answer accuracy
- Explanation quality
- Exam pattern match
- Option plausibility

### 3. Iterative Improvement
```bash
# Phase 1: Get to 25 questions/topic
npm run fill:gaps -- 25

# Phase 2: Get to 40 questions/topic
npm run fill:gaps -- 40

# Phase 3: Final quality (50+)
npm run fill:gaps -- 50
```

### 4. Topic Prioritization
For each exam, prioritize frequently-tested topics:
- JEE Main: Mechanics, Organic Chemistry, Calculus
- NEET: Human Physiology, Organic Chemistry, Genetics
- UPSC: Polity, Economy, Current Affairs

### 5. Regular Maintenance
```bash
# Weekly: Fill any gaps
npm run fill:gaps -- 30

# Monthly: Increase threshold
npm run fill:gaps -- 50
```

---

## 💰 Cost Comparison

| Approach | Cost | Quality | Speed |
|----------|------|---------|-------|
| **Ollama (Local)** | $0 | Good (9B) / Excellent (27B) | Medium |
| **OpenRouter (Gemini 2.0)** | ~$0.50-1/exam | Excellent | Fast |
| **OpenRouter (GPT-4)** | ~$2-5/exam | Best | Fast |

**Recommendation:**
- Development: Ollama (free)
- Testing: Ollama or OpenRouter (Gemini Flash)
- Production: OpenRouter (Gemini 2.0 Flash or GPT-4)

---

## 📚 Further Reading

- [Full Seeding Documentation](./README-SEEDING.md)
- [Quick Start Card](./SEEDING-QUICKSTART.md)
- [PrepGenie Architecture](../CLAUDE.md)
- [Ollama Documentation](https://github.com/ollama/ollama)

---

## 🎉 Ready to Start?

### Simplest Start (Recommended)
```bash
# 1. Setup (one time)
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull gemma2:9b
ollama serve  # Keep this running

# 2. Validate
npm run seed:setup

# 3. Fill gaps
npm run fill:gaps
```

That's it! The script will:
- ✅ Scan your database
- ✅ Identify topics with < 25 questions
- ✅ Prioritize by exam importance
- ✅ Generate exam-realistic questions
- ✅ Store with rich explanations

Questions? Check the troubleshooting section above! 🚀
