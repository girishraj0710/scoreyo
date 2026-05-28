# PrepGenie Question Seeding Architecture

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      PrepGenie Question System                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ├──── Dimensional Database Model
                                │     (Turso - Cloud SQLite)
                                │
                ┌───────────────┴───────────────┐
                │                               │
         ┌──────▼──────┐               ┌───────▼────────┐
         │  Exam Dims  │               │  Subject Dims  │
         │  (20+ exams)│               │  (60+ subjects)│
         └──────┬──────┘               └───────┬────────┘
                │                               │
                └───────────┬───────────────────┘
                            │
                    ┌───────▼────────┐
                    │   Topic Dims   │
                    │ (500+ topics)  │
                    │ [SHARED POOL]  │
                    └───────┬────────┘
                            │
                ┌───────────┴───────────┐
                │  Bridge Table         │
                │  (exam-subject-topic) │
                └───────────┬───────────┘
                            │
                    ┌───────▼────────┐
                    │ Fact Questions │
                    │ (Main storage) │
                    └────────────────┘
```

---

## 🔄 Question Generation Flow

### Approach 1: Full Seeding (seed-questions-ollama.ts)

```
User Input
   │
   ├─ npm run seed:questions [exam] [subject] [topic]
   │
   ▼
┌─────────────────────────────────────────┐
│  1. Parse CLI Arguments                 │
│     • Filter by exam/subject/topic      │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  2. Load Exam Data from exams.ts        │
│     • 20+ exams                         │
│     • 60+ subjects                      │
│     • 500+ topics                       │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  3. Get/Create Dimension IDs            │
│     • dim_exams                         │
│     • dim_subjects                      │
│     • dim_topics (create if missing)    │
│     • bridge_exam_subject_topic         │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  4. Check Existing Question Count       │
│     • Query fact_exam_questions         │
│     • Skip if >= QUESTIONS_PER_TOPIC    │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  5. Generate Questions (Ollama)         │
│     • 40% easy (12 questions)           │
│     • 40% medium (12 questions)         │
│     • 20% hard (6 questions)            │
│     • Batch size: 5 questions/API call  │
└───────────────┬─────────────────────────┘
                │
                ├─ Build exam-specific prompt
                │  with pattern guidelines
                │
                ├─ Call Ollama API
                │  (http://localhost:11434)
                │
                ├─ Parse JSON response
                │  (handle markdown cleanup)
                │
                └─ Validate question format
                   (4 options, correct answer, explanation)
                │
                ▼
┌─────────────────────────────────────────┐
│  6. Deduplicate & Save                  │
│     • Check existing questions          │
│     • Skip duplicates                   │
│     • Batch insert to DB                │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  7. Report Progress                     │
│     • Questions added                   │
│     • Total count                       │
│     • Time taken                        │
└─────────────────────────────────────────┘
```

---

### Approach 2: Gap Filling (fill-question-gaps-ollama.ts) ⭐

```
User Input
   │
   ├─ npm run fill:gaps [threshold] [exam]
   │
   ▼
┌─────────────────────────────────────────┐
│  1. Scan Database for Gaps              │
│     • For each exam in exams.ts         │
│     • For each subject                  │
│     • For each topic                    │
│     •   Get question count from DB      │
│     •   If count < threshold → GAP      │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  2. Build Gap List with Metadata        │
│     • examId, examName                  │
│     • subjectId, subjectName            │
│     • topicName, topicDimId             │
│     • currentCount, needed              │
│     • priority (JEE=100, NEET=90, etc.) │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  3. Sort by Priority                    │
│     • Primary: Exam priority (high→low) │
│     • Secondary: Gap size (large→small) │
│     Result: JEE Main first, then NEET...│
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  4. Display Summary                     │
│     • Total topics needing questions    │
│     • Total questions needed            │
│     • Breakdown by exam                 │
│     • Estimated time                    │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  5. For Each Gap (Prioritized Order):   │
│     ┌─────────────────────────────────┐ │
│     │ 5a. Calculate Distribution      │ │
│     │     • 40% easy                  │ │
│     │     • 40% medium                │ │
│     │     • 20% hard                  │ │
│     └──────────┬──────────────────────┘ │
│                ▼                         │
│     ┌─────────────────────────────────┐ │
│     │ 5b. Generate by Difficulty      │ │
│     │     • Build exam-specific prompt│ │
│     │     • Call Ollama in batches    │ │
│     │     • Parse & validate          │ │
│     └──────────┬──────────────────────┘ │
│                ▼                         │
│     ┌─────────────────────────────────┐ │
│     │ 5c. Save to Database            │ │
│     │     • Deduplicate               │ │
│     │     • Batch insert              │ │
│     │     • Update count              │ │
│     └─────────────────────────────────┘ │
└─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  6. Final Report                        │
│     • Topics processed                  │
│     • Questions added                   │
│     • Duration                          │
└─────────────────────────────────────────┘
```

---

## 🧠 AI Generation Pipeline

```
Exam-Specific Prompt
        │
        ├─ Exam pattern guidelines (JEE/NEET/UPSC/CAT/etc.)
        ├─ Topic context
        ├─ Difficulty calibration
        ├─ Quality checklist (10 points)
        └─ Output format (strict JSON)
        │
        ▼
┌─────────────────────────────────────────┐
│         Ollama API Call                 │
│  (http://localhost:11434/api/generate)  │
│                                         │
│  Model: gemma2:9b (default)             │
│  Temperature: 0.8                       │
│  Top-p: 0.9                             │
│  Top-k: 40                              │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│      JSON Response Parsing              │
│                                         │
│  1. Strip markdown (```json)            │
│  2. Parse JSON                          │
│  3. Validate schema                     │
│     • 4 options                         │
│     • correctAnswer 0-3                 │
│     • Explanation object                │
│  4. Return GeneratedQuestion[]          │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│       Question Object                   │
│                                         │
│  {                                      │
│    question: string                     │
│    options: string[4]                   │
│    correctAnswer: 0-3                   │
│    explanation: {                       │
│      logic: string                      │
│      formula: string | null             │
│      calculation: string | null         │
│      trapAlerts: string[]               │
│      commonMistakes: string[]           │
│    }                                    │
│  }                                      │
└─────────────────────────────────────────┘
```

---

## 📊 Database Schema (Dimensional Model)

```
dim_exams
├─ id (PK)
├─ exam_code (UNIQUE) ─────┐
├─ exam_name               │
├─ category                │
├─ conducting_body         │
                           │
dim_subjects               │
├─ id (PK)                 │
├─ subject_code (UNIQUE) ──┼───┐
├─ subject_name            │   │
├─ category                │   │
                           │   │
dim_topics                 │   │
├─ id (PK) ────────────────┼───┼───┐
├─ topic_name (UNIQUE)     │   │   │
├─ category                │   │   │
├─ scope (universal/       │   │   │
│   state-specific/        │   │   │
│   exam-specific)         │   │   │
├─ parent_topic_id         │   │   │
├─ description             │   │   │
├─ keywords                │   │   │
                           │   │   │
bridge_exam_subject_topic  │   │   │
├─ id (PK)                 │   │   │
├─ exam_id (FK) ───────────┘   │   │
├─ subject_id (FK) ────────────┘   │
├─ topic_id (FK) ──────────────────┘
├─ is_mandatory                    │
├─ weightage                       │
                                   │
fact_exam_questions                │
├─ id (PK)                         │
├─ topic_id (FK) ──────────────────┘
├─ question (TEXT)
├─ options (JSON)
├─ correct_answer (0-3)
├─ explanation (JSON)
├─ difficulty (easy/medium/hard)
├─ source (ollama-gemma2:9b / verified / etc.)
├─ valid_from (year)
├─ valid_until (year)
├─ created_at
├─ updated_at

Indexes:
├─ UNIQUE: (topic_id, substr(question, 1, 100))  [Deduplication]
├─ (topic_id)                                     [Lookups]
├─ (difficulty)                                   [Filtering]
```

**Key Benefits:**
1. **Topic Sharing**: "Trigonometry" used by JEE + CAT + SSC + Banking
2. **Efficient Storage**: Question stored once, usable across exams
3. **Historical Tracking**: valid_from/valid_until for outdated questions
4. **Flexible Queries**: Join any combination of exam/subject/topic

---

## 🎯 Exam Pattern Matching

```
Exam ID Input
     │
     ▼
Pattern Lookup
     │
     ├─ jee-main → "Numerical value, assertion-reasoning, NCERT-based..."
     ├─ jee-advanced → "Multi-concept, paragraph-based, matrix-match..."
     ├─ neet → "NCERT-centric 70%, direct recall + clinical..."
     ├─ upsc-prelims → "Current affairs, policy, multi-disciplinary..."
     ├─ ssc-cgl → "Speed-based, formula-heavy, 45-60 sec..."
     ├─ cat → "Data interpretation, logical reasoning, lengthy passages..."
     ├─ gate → "NAT questions, formula application, calculator-friendly..."
     └─ [default] → "Standard competitive exam pattern..."
     │
     ▼
Prompt Enhancement
     │
     ├─ Add exam-specific requirements
     ├─ Adjust difficulty calibration
     ├─ Modify time expectations
     └─ Include typical question structures
     │
     ▼
Ollama Generation
     │
     └─ Questions match actual exam style
```

---

## 🔄 3-Tier Question Retrieval (Frontend Integration)

```
User Starts Quiz
      │
      ▼
┌─────────────────────────────────────────┐
│  Tier 1: Verified Questions             │
│  (question-bank.ts)                     │
│                                         │
│  • Expert-curated                       │
│  • 100% accurate                        │
│  • Limited quantity                     │
└───────────┬─────────────────────────────┘
            │
            ├─ Found? → Use immediately ✅
            │
            ▼
┌─────────────────────────────────────────┐
│  Tier 2: Dimensional Questions          │
│  (fact_exam_questions via db.ts)        │
│                                         │
│  • AI-generated (Ollama/OpenRouter)     │
│  • Validated & saved                    │
│  • Large pool                           │
│  • Priority: verified > ai-validated    │
└───────────┬─────────────────────────────┘
            │
            ├─ Found? → Use from DB ✅
            │
            ▼
┌─────────────────────────────────────────┐
│  Tier 3: Real-Time AI Generation        │
│  (quiz-generator.ts via OpenRouter)     │
│                                         │
│  • Generate on-demand                   │
│  • Cache for future use                 │
│  • Fallback option                      │
└───────────┬─────────────────────────────┘
            │
            └─ Generate & cache ✅
```

---

## 🎛️ Configuration Flow

```
Environment Variables
      │
      ├─ OLLAMA_MODEL (default: gemma2:9b)
      ├─ OLLAMA_HOST (default: http://localhost:11434)
      ├─ QUESTIONS_PER_TOPIC (default: 30)
      ├─ BATCH_SIZE (default: 5)
      │
      ▼
CLI Arguments
      │
      ├─ fill:gaps [threshold] [exam-id]
      │  • threshold: Min questions per topic
      │  • exam-id: Optional filter
      │
      ├─ seed:questions [exam-id] [subject-id] [topic]
      │  • Progressive filtering
      │
      ▼
Script Execution
      │
      ├─ Validate Ollama connection
      ├─ Load exam data
      ├─ Query database
      ├─ Generate questions
      └─ Save results
```

---

## 🎉 Success Flow

```
┌──────────────────────────────────────┐
│  User runs: npm run fill:gaps        │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  System scans database                │
│  • Finds 156 topics with < 25 Qs     │
│  • Total needed: 3,840 questions     │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Smart prioritization                 │
│  1. JEE Main (75 topics)             │
│  2. NEET (48 topics)                 │
│  3. UPSC (23 topics)                 │
│  4. Others (10 topics)               │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  For each topic:                      │
│  • Generate exam-realistic questions │
│  • Rich explanations                 │
│  • Proper difficulty distribution    │
│  • ~2-3 min per topic                │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Result: 4-6 hours later             │
│  ✅ All topics have 25+ questions    │
│  ✅ Ready for production              │
│  ✅ Can increase threshold anytime    │
└──────────────────────────────────────┘
```

---

## 📚 File Structure

```
scripts/
├── seed-questions-ollama.ts       # Full seeding script
├── fill-question-gaps-ollama.ts   # Gap filling script (SMART)
├── setup-ollama.ts                # Setup validation wizard
│
├── README.md                      # Entry point (you are here)
├── ARCHITECTURE.md                # System architecture (this file)
├── SUMMARY.md                     # High-level overview
├── SEEDING-GUIDE.md               # Complete usage guide
├── SEEDING-QUICKSTART.md          # Quick reference card
└── README-SEEDING.md              # Full seeding deep-dive
```

---

## 🔗 Integration Points

### 1. Frontend Quiz Component
```typescript
// src/app/quiz/page.tsx
// Uses dimensional questions via API
```

### 2. API Routes
```typescript
// src/app/api/quiz/route.ts
// 3-tier system: verified → dimensional → AI
```

### 3. Database Layer
```typescript
// src/lib/db.ts
// getExamQuestions() - dimensional model queries
```

### 4. Question Bank (Legacy)
```typescript
// src/lib/question-bank.ts
// Verified questions (Tier 1)
```

---

## 🎯 Performance Characteristics

### Gap Filling (Recommended)
- **Speed**: ⚡⚡⚡ Fast (only needed topics)
- **Memory**: 📦📦 Medium (5-10GB per model)
- **CPU**: 🔥🔥 Medium (batch processing)
- **Network**: ✅ Local (no cloud calls)

### Full Seeding
- **Speed**: ⚡⚡ Medium (all topics)
- **Memory**: 📦📦 Medium (5-10GB per model)
- **CPU**: 🔥🔥🔥 High (continuous generation)
- **Network**: ✅ Local (no cloud calls)

---

This architecture enables PrepGenie to:
1. ✅ Generate exam-realistic questions locally (no API costs)
2. ✅ Share questions across exams intelligently
3. ✅ Scale to 500+ topics efficiently
4. ✅ Maintain high quality with rich explanations
5. ✅ Support 20+ Indian competitive exams

🚀 **Ready to generate questions? Run:** `npm run fill:gaps`
