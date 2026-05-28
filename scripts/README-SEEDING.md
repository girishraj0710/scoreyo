# PrepGenie Question Seeding with Ollama

Generate high-quality, exam-realistic MCQ questions for 20+ Indian competitive exams using local AI (Ollama).

## 🎯 Features

- **Exam-Realistic Questions**: Matches actual exam patterns (JEE, NEET, UPSC, CAT, GATE, etc.)
- **Rich Explanations**: Logic, formulas, calculations, trap alerts, common mistakes
- **Difficulty Distribution**: 40% easy, 40% medium, 20% hard
- **Local AI**: Runs on your machine - no API costs, full privacy
- **Dimensional Database**: Shares questions across exams when topics overlap
- **Progress Tracking**: Resume from where you left off
- **Duplicate Detection**: Skips existing questions automatically

## 📋 Prerequisites

### 1. Install Ollama

**macOS / Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from [ollama.ai/download](https://ollama.ai/download)

### 2. Pull a Model

Choose based on your hardware:

| Model | Size | RAM Required | Quality | Speed |
|-------|------|--------------|---------|-------|
| `gemma2:27b` | 16GB | 32GB+ | ⭐⭐⭐⭐⭐ | 🐢 Slow |
| **`gemma2:9b`** (Recommended) | 5.5GB | 16GB | ⭐⭐⭐⭐ | ⚡ Fast |
| `llama3.1:8b` | 4.7GB | 16GB | ⭐⭐⭐⭐ | ⚡ Fast |
| `mistral:7b` | 4.1GB | 16GB | ⭐⭐⭐ | ⚡⚡ Very Fast |
| `gemma2:2b` | 1.6GB | 8GB | ⭐⭐ | ⚡⚡⚡ Blazing |

```bash
# Pull recommended model
ollama pull gemma2:9b

# Or choose another
ollama pull llama3.1:8b
```

### 3. Start Ollama

```bash
ollama serve
```

Keep this running in a separate terminal.

## 🚀 Quick Start

### Step 1: Validate Setup

```bash
npm run seed:setup
```

This checks:
- ✅ Ollama installed
- ✅ Ollama service running
- ✅ Models available
- ✅ Test generation works

### Step 2: Seed Questions

```bash
# Seed ALL exams (takes 10-20 hours depending on model)
npm run seed:questions

# Seed specific exam (JEE Main ~2-3 hours)
npm run seed:questions jee-main

# Seed specific subject (JEE Physics ~1 hour)
npm run seed:questions jee-main jee-physics

# Seed specific topic (Kinematics ~2 minutes)
npm run seed:questions jee-main jee-physics "Kinematics"
```

## ⚙️ Configuration

Set environment variables to customize:

```bash
# Model to use (default: gemma2:9b)
export OLLAMA_MODEL=llama3.1:8b

# Ollama host (default: http://localhost:11434)
export OLLAMA_HOST=http://localhost:11434

# Questions per topic (default: 30)
export QUESTIONS_PER_TOPIC=50

# Batch size (default: 5)
export BATCH_SIZE=3
```

## 📊 Output Format

Each question is stored with:

```json
{
  "question": "A block of mass 5 kg is placed on a frictionless inclined plane at 30° to the horizontal. What is the acceleration of the block down the plane? (g = 9.8 m/s²)",
  "options": ["4.9 m/s²", "8.5 m/s²", "9.8 m/s²", "2.45 m/s²"],
  "correctAnswer": 0,
  "explanation": {
    "logic": "On an inclined plane, the component of gravitational force along the plane is mg·sin(θ). Since the plane is frictionless, this is the net force causing acceleration: a = g·sin(θ).",
    "formula": "a = g·sin(θ) where θ = 30°",
    "calculation": "a = 9.8 × sin(30°) = 9.8 × 0.5 = 4.9 m/s²",
    "trapAlerts": [
      "Don't use cos(30°) - that's the normal force component",
      "Don't forget to multiply by sin(θ), not just use g directly"
    ],
    "commonMistakes": [
      "Using g directly (9.8 m/s²) without considering the angle",
      "Confusing perpendicular and parallel components of mg"
    ]
  },
  "difficulty": "medium",
  "source": "ollama-gemma2:9b"
}
```

## 🎓 Exam Patterns Supported

The script generates questions matching these exam patterns:

### JEE Main
- Numerical value questions
- Assertion-reasoning
- Single/multiple correct
- NCERT + moderate problem-solving
- ~3 min/question

### JEE Advanced
- Multi-concept integration
- Paragraph-based
- Matrix-match
- ~4-5 min/question
- Deep analytical skills

### NEET
- Single correct MCQs
- NCERT-centric (60-70%)
- Direct recall + clinical application
- ~45 sec/question
- Biology heavy on diagrams/processes

### UPSC CSAT/GS
- Current affairs integration
- Policy-based
- Analytical
- Multi-disciplinary
- ~2 min/question

### SSC CGL
- Speed-based
- Formula-heavy quants
- Vocab/grammar
- ~50 sec/question

### CAT
- Data interpretation
- Logical reasoning
- Lengthy passages
- ~2-3 min/question

### GATE
- Numerical answer type (NAT)
- Formula application
- Numerical computation
- ~1.5-2 min/question

### State CETs (KCET, MHT-CET, etc.)
- State board syllabus
- NCERT-based
- Single correct MCQs
- ~1 min/question

## 📈 Performance

**Speed Estimates** (gemma2:9b on MacBook Pro M2):

| Operation | Time |
|-----------|------|
| Single question | ~10-15 seconds |
| Topic (30 questions) | ~2-3 minutes |
| Subject (25 topics) | ~1-1.5 hours |
| Full exam (3 subjects) | ~3-5 hours |
| All exams (20+) | ~60-100 hours |

**Tips for Speed:**
- Use smaller batch size (BATCH_SIZE=3) for consistency
- Use faster models (mistral:7b) for initial seeding
- Run multiple instances in parallel (careful with RAM)
- Seed high-priority exams first (JEE, NEET, UPSC)

## 🔧 Troubleshooting

### "Ollama not responding"
```bash
# Check if running
curl http://localhost:11434/api/tags

# Restart service
pkill ollama
ollama serve
```

### "Model not found"
```bash
# List installed models
ollama list

# Pull the model
ollama pull gemma2:9b
```

### "Out of memory"
- Use a smaller model (gemma2:2b, mistral:7b)
- Reduce BATCH_SIZE to 3 or 2
- Close other applications
- Reduce QUESTIONS_PER_TOPIC to 20

### "Invalid JSON response"
- Ollama sometimes returns malformed JSON
- Script will skip and retry next batch
- Use more stable models (gemma2:9b > llama3.1:8b > mistral:7b)

### "Questions not exam-realistic"
- Ensure you're using gemma2:9b or larger
- Smaller models (2b, 3b) produce lower quality
- Consider using cloud API (OpenRouter) for better quality

## 📝 Database Schema

Questions are stored in a dimensional model:

```
dim_exams (id, exam_code, exam_name)
  ↓
dim_subjects (id, subject_code, subject_name)
  ↓
dim_topics (id, topic_name, category, scope)
  ↓
bridge_exam_subject_topic (exam_id, subject_id, topic_id)
  ↓
fact_exam_questions (id, topic_id, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
```

**Benefits:**
- Topics shared across exams (e.g., "Trigonometry" for JEE + CAT + SSC)
- Easy to add new exams
- Efficient queries
- Historical tracking (valid_from, valid_until)

## 🎯 Seeding Strategy

### Phase 1: High-Priority Exams (Start here)
```bash
npm run seed:questions jee-main
npm run seed:questions jee-advanced
npm run seed:questions neet
npm run seed:questions upsc-prelims
```

### Phase 2: Popular Exams
```bash
npm run seed:questions ssc-cgl
npm run seed:questions cat
npm run seed:questions gate
npm run seed:questions banking-po
```

### Phase 3: State CETs
```bash
npm run seed:questions kcet
npm run seed:questions mht-cet
npm run seed:questions wbjee
npm run seed:questions ts-eamcet
npm run seed:questions ap-eamcet
```

### Phase 4: Remaining Exams
```bash
npm run seed:questions  # Seed all remaining
```

## 🆚 Ollama vs Cloud API

| Factor | Ollama (Local) | OpenRouter (Cloud) |
|--------|----------------|-------------------|
| Cost | Free | ~$0.50-2/exam |
| Speed | Slower (2-3 min/topic) | Faster (30-60 sec/topic) |
| Quality | Good (9B model) | Excellent (Gemini, Claude) |
| Privacy | 100% local | Data sent to API |
| Setup | Requires installation | Just API key |
| Hardware | 16GB+ RAM | Any device |

**Recommendation:**
- **Development/Testing**: Ollama (free, good enough)
- **Production/Launch**: OpenRouter with Gemini 2.0 Flash (best quality)
- **Hybrid**: Ollama for initial seed, OpenRouter for refinement

## 🔄 Migration to Cloud API

If you want to switch to cloud later:

1. Update `.env.local`:
```bash
OPENROUTER_API_KEY=your_key_here
```

2. Questions will fall back to OpenRouter when Ollama cache is empty

3. Both sources work together seamlessly!

## 📚 Further Reading

- [Ollama Documentation](https://github.com/ollama/ollama)
- [Model Comparison](https://ollama.ai/library)
- [Prompt Engineering for MCQs](https://www.anthropic.com/research/prompt-engineering)
- [PrepGenie Architecture](../CLAUDE.md)

## 💡 Tips for Best Results

1. **Quality over Speed**: Use gemma2:9b or larger for production
2. **Validate Samples**: Manually review first 10-20 questions per topic
3. **Iterative Seeding**: Seed 1-2 exams first, get user feedback, improve prompts
4. **Topic Priority**: Seed frequently-practiced topics first
5. **Monitor Progress**: Check database counts regularly
6. **Backup Often**: Export DB before major seeding runs

## 🐛 Reporting Issues

If you encounter issues:

1. Check Ollama logs: `ollama logs`
2. Validate setup: `npm run seed:setup`
3. Try smaller batch: `BATCH_SIZE=2 npm run seed:questions`
4. Report with:
   - Model used
   - Error message
   - Sample prompt/response
   - System specs (RAM, CPU)

---

Happy seeding! 🚀

For questions or improvements, check `CLAUDE.md` or open an issue on GitHub.
