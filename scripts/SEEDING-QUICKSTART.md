# PrepGenie Question Seeding - Quick Start Card

## 🚀 3-Step Setup (First Time Only)

```bash
# 1. Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Pull model (choose ONE)
ollama pull gemma2:9b        # Recommended (5.5GB, 16GB RAM)
# OR
ollama pull llama3.1:8b      # Alternative (4.7GB, 16GB RAM)
# OR
ollama pull gemma2:2b        # Fast but lower quality (1.6GB, 8GB RAM)

# 3. Start Ollama (keep running in separate terminal)
ollama serve
```

## ✅ Validate Setup

```bash
npm run seed:setup
```

Expected output:
```
✅ Ollama is installed
✅ Ollama service is running at http://localhost:11434
✅ Found 1 installed model(s)
✅ Test generation successful
```

## 📝 Seed Questions

### Option 1: Start Small (Recommended)
```bash
# Seed ONE topic first (~2 minutes)
npm run seed:questions jee-main jee-physics "Kinematics"

# Check results in database
# Then proceed to full subject
npm run seed:questions jee-main jee-physics
```

### Option 2: Seed by Exam
```bash
npm run seed:questions jee-main          # All JEE Main subjects (~3-5 hours)
npm run seed:questions neet              # All NEET subjects (~4-6 hours)
npm run seed:questions upsc-prelims      # UPSC prelims (~2-3 hours)
```

### Option 3: Seed Everything (Long Running)
```bash
npm run seed:questions                   # All 20+ exams (~60-100 hours)
```

## 🎯 Recommended Seeding Order

```bash
# Day 1: Core Engineering (8-10 hours)
npm run seed:questions jee-main
npm run seed:questions jee-advanced

# Day 2: Medical (6-8 hours)
npm run seed:questions neet

# Day 3: Government (4-6 hours)
npm run seed:questions upsc-prelims
npm run seed:questions ssc-cgl

# Day 4: MBA + Tech (5-7 hours)
npm run seed:questions cat
npm run seed:questions gate

# Day 5: Banking + State (6-8 hours)
npm run seed:questions banking-po
npm run seed:questions kcet
npm run seed:questions mht-cet

# Day 6-7: Remaining exams
npm run seed:questions
```

## ⚙️ Common Customizations

```bash
# Use faster model
export OLLAMA_MODEL=mistral:7b
npm run seed:questions jee-main

# Generate more questions per topic
export QUESTIONS_PER_TOPIC=50
npm run seed:questions jee-main jee-physics

# Smaller batches (more stable)
export BATCH_SIZE=3
npm run seed:questions neet
```

## 🔍 Check Progress

```bash
# Count questions in database
sqlite3 prepgenie.db "SELECT COUNT(*) FROM fact_exam_questions;"

# Count by exam (requires dimensional lookup)
sqlite3 prepgenie.db "
SELECT e.exam_name, COUNT(q.id) as questions
FROM fact_exam_questions q
JOIN dim_topics t ON q.topic_id = t.id
JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
JOIN dim_exams e ON b.exam_id = e.id
GROUP BY e.exam_name
ORDER BY questions DESC;
"

# Count by difficulty
sqlite3 prepgenie.db "
SELECT difficulty, COUNT(*) as count
FROM fact_exam_questions
GROUP BY difficulty;
"
```

## 🐛 Quick Troubleshooting

### Ollama Not Running
```bash
# Check status
curl http://localhost:11434/api/tags

# Restart
pkill ollama && ollama serve
```

### Out of Memory
```bash
# Use smaller model
ollama pull gemma2:2b
export OLLAMA_MODEL=gemma2:2b

# Or reduce batch size
export BATCH_SIZE=2
```

### Invalid JSON Errors
- Normal to skip 1-2 batches per topic
- Script continues automatically
- Use more stable model (gemma2:9b)

### Slow Generation
- Expected: 2-3 min per topic with gemma2:9b
- Faster: Use mistral:7b (~1-2 min)
- Slower: Using gemma2:27b (~5-10 min)

## 📊 Expected Results

### Per Topic (30 questions)
- ✅ 12 easy questions
- ✅ 12 medium questions  
- ✅ 6 hard questions
- ✅ Rich explanations with formulas
- ✅ Trap alerts & common mistakes
- ✅ Exam-realistic patterns

### Time Estimates (gemma2:9b)
| Unit | Time |
|------|------|
| 1 topic | 2-3 min |
| 1 subject (25 topics) | 1-1.5 hours |
| 1 exam (3 subjects) | 3-5 hours |
| All exams (20+) | 60-100 hours |

## 🆘 Need Help?

1. **Setup issues**: `npm run seed:setup`
2. **Model issues**: `ollama list` and `ollama pull gemma2:9b`
3. **Database issues**: Check `src/lib/db.ts` logs
4. **Quality issues**: Switch to larger model or use OpenRouter API

## 📚 Full Documentation

See [`README-SEEDING.md`](./README-SEEDING.md) for:
- Detailed configuration
- Exam pattern explanations
- Database schema
- Migration to cloud API
- Advanced troubleshooting

---

**Ready to seed?** Start with:
```bash
npm run seed:setup && npm run seed:questions jee-main jee-physics "Kinematics"
```

🎉 You'll have 30 high-quality JEE Physics Kinematics questions in ~2 minutes!
