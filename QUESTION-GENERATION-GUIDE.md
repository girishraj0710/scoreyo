# Question Generation System

**Last Updated:** 2026-06-16  
**Purpose:** Generate high-quality MCQ questions for all 74+ exams on Krakkify

---

## Quick Start

### Prerequisites
- OpenRouter API key configured in `.env.local`
- Supabase database access
- Topic and subject mappings defined

### Generate Questions (3 Steps)

**Step 1: Choose your target**
```bash
# Option A: English questions (Claude 3.5 Sonnet)
npx tsx scripts/generate-english-questions-claude.ts

# Option B: Main exam questions (JEE, NEET, UPSC, etc.)
npx tsx scripts/generate-exam-questions-claude.ts
```

**Step 2: Review generated questions**
- Check `/scripts/output/questions-YYYY-MM-DD.json`
- Verify quality (10% sample minimum)

**Step 3: Insert into database**
- Copy SQL from output file
- Run in Supabase SQL Editor

---

## English Question Generation

### Structure

English questions use this schema:
```sql
CREATE TABLE english_questions (
  id SERIAL PRIMARY KEY,
  path_id TEXT NOT NULL,        -- e.g., 'foundation', 'ielts', 'competitive'
  topic_id TEXT NOT NULL,       -- e.g., 'parts-of-speech', 'tenses'
  level TEXT NOT NULL,          -- 'beginner', 'intermediate', 'advanced'
  question TEXT NOT NULL,
  options TEXT NOT NULL,        -- JSON array as TEXT
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL,     -- 'easy', 'medium', 'hard'
  passage TEXT,                 -- For reading comprehension
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Topics Available

From `src/lib/english-content.ts`:

**Foundation Path:**
- `alphabet-basics` - English Alphabet (50Q target)
- `phonics-vowels` - Vowels & Consonants (80Q target)
- `pronunciation` - Pronunciation Fundamentals (100Q target)
- `parts-of-speech` - 8 Parts of Speech (400Q target)
- `articles` - A, An, The (80Q target)
- `present-simple` - Present Simple Tense (100Q target)
- `present-continuous` - Present Continuous (100Q target)
- `past-simple` - Past Simple (100Q target)
- `future-simple` - Future Simple (100Q target)
- And 30+ more topics...

**IELTS Path:**
- `ielts-reading` - Reading Comprehension (200Q target)
- `ielts-writing` - Task 1 & 2 (100Q target)
- `ielts-listening` - 40 questions per practice
- `ielts-speaking` - Part 1, 2, 3

**Competitive Path:**
- Banking exams
- SSC CGL/CHSL
- UPSC vocabulary
- State PSC exams

### Generation Script

**File:** `scripts/generate-english-questions.ts`

```typescript
import { generateQuestionsForTopic } from '@/lib/question-generator';

// Generate 50 questions for Parts of Speech
const questions = await generateQuestionsForTopic({
  pathId: 'foundation',
  topicId: 'parts-of-speech',
  level: 'beginner',
  count: 50,
  difficulty: {
    easy: 20,    // 40%
    medium: 20,  // 40%
    hard: 10     // 20%
  }
});

// Validate before inserting
const validated = questions.filter(validateQuestion);

// Generate SQL
const sql = generateInsertSQL(validated);
```

### Validation Rules

Every question MUST pass these checks:

```typescript
function validateQuestion(q: Question): boolean {
  // 1. Question text >= 20 characters
  if (q.question.length < 20) return false;

  // 2. Exactly 4 options
  if (q.options.length !== 4) return false;

  // 3. All options non-empty
  if (!q.options.every(opt => opt.trim().length > 0)) return false;

  // 4. Correct answer is 0-3
  if (q.correct_answer < 0 || q.correct_answer > 3) return false;

  // 5. Explanation >= 30 characters
  if (q.explanation.length < 30) return false;

  // 6. Valid difficulty
  if (!['easy', 'medium', 'hard'].includes(q.difficulty)) return false;

  // 7. No placeholders
  if (q.question.includes('[') || q.question.includes('____')) return false;

  return true;
}
```

### AI Prompt Template

```
You are an expert English teacher creating IELTS-level questions.

TOPIC: ${topicName}
LEVEL: ${level}
COUNT: ${count}

REQUIREMENTS:
- Question text MUST be >= 20 characters and complete
- EXACTLY 4 options (A, B, C, D)
- Explanation MUST be >= 30 characters
- Mix difficulties: 40% easy, 40% medium, 20% hard
- No placeholders like [sentence] or ____
- Test understanding, not just memorization

EXAMPLE:
{
  "question": "Which word is a common noun in: 'The teacher gave Sarah a book'?",
  "options": ["teacher", "Sarah", "gave", "The"],
  "correct_answer": 0,
  "explanation": "A common noun names a general person, place, or thing. 'Teacher' is a common noun because it refers to any teacher in general, not a specific person. 'Sarah' is a proper noun (specific person), 'gave' is a verb, and 'The' is an article.",
  "difficulty": "easy"
}

Return ONLY valid JSON array of ${count} questions.
```

---

## Main Exam Question Generation

### Structure

Main exam questions use this schema:
```sql
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  source TEXT DEFAULT 'ai-generated',
  passage TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Exams Available

From `src/lib/exams.ts`:

**Engineering (15 exams):**
- JEE Main, JEE Advanced, NEET, BITSAT
- GATE (CS, EC, ME, EE, CE, CH)
- State CETs (MHT-CET, KCET, COMEDK, EAMCET, WBJEE)

**Government Jobs (25+ exams):**
- UPSC (CSE, CDS, NDA, CAPF)
- SSC (CGL, CHSL, MTS, GD, CPO)
- Banking (IBPS PO, SBI Clerk, RBI Grade B)
- Railways (RRB NTPC, Group D, ALP, JE)
- Police (State PSC constables)

**MBA (4 exams):**
- CAT, XAT, SNAP, NMAT

**And 30+ more exams**

### Subject Mapping

**CRITICAL:** Use dimensional model for shared subjects.

From `src/lib/subject-mapper.ts`:

```typescript
// Example: JEE Main Physics maps to shared Physics subject
const sharedSubjectId = getSharedSubject('jee-main', 'physics');
// Returns: 'physics' (shared across JEE, NEET, GATE, etc.)

// Topics under Physics:
// - mechanics
// - thermodynamics
// - electromagnetism
// - optics
// - modern-physics
```

### Generation Script

**File:** `scripts/generate-exam-questions.ts`

```typescript
import { generateQuestionsForExam } from '@/lib/question-generator';

// Generate 100 Physics questions for JEE Main
const questions = await generateQuestionsForExam({
  examId: 'jee-main',
  subjectId: 'physics', // Use shared subject ID
  topics: ['mechanics', 'thermodynamics'],
  count: 100,
  difficulty: {
    easy: 30,
    medium: 50,
    hard: 20
  }
});
```

### AI Prompt Template

```
You are an expert ${examName} teacher creating ${difficulty} questions.

EXAM: ${examName}
SUBJECT: ${subjectName}
TOPIC: ${topicName}
COUNT: ${count}

REQUIREMENTS:
- Follow ${examName} exam pattern exactly
- Question text >= 30 characters
- 4 options for MCQs
- Detailed explanation with concepts
- Mark scheme alignment
- Previous year question style

EXAMPLE (JEE Main Physics):
{
  "question_text": "A projectile is fired at an angle of 45° with initial velocity 20 m/s. What is the maximum height reached? (g = 10 m/s²)",
  "options": ["5 m", "10 m", "20 m", "40 m"],
  "correct_answer": "10 m",
  "explanation": "Maximum height h = (u²sin²θ)/(2g) = (20² × sin²45°)/(2×10) = (400 × 0.5)/20 = 10 m. At 45°, sin²θ = 0.5, which gives maximum range but not maximum height.",
  "difficulty": "medium",
  "topic_id": "mechanics"
}

Return ONLY valid JSON array.
```

---

## Quality Control Checklist

Before inserting questions into production:

### Pre-Generation
- [ ] Topic/subject mappings verified in codebase
- [ ] AI prompt template tested with sample
- [ ] Validation function ready

### Post-Generation
- [ ] All questions pass validation
- [ ] 10% manual review completed
- [ ] No duplicate questions
- [ ] Explanations are clear and accurate
- [ ] Difficulty distribution correct (40-40-20 or 30-50-20)

### Post-Insertion
- [ ] Query database to verify count
- [ ] Test quiz generation on frontend
- [ ] Check all 4 options display correctly
- [ ] Verify explanations render properly

---

## Bulk Generation Commands

### Generate 1000 Questions for Multiple Topics

```bash
# English Grammar (8 Parts of Speech × 50 each = 400Q)
npm run generate:parts-of-speech

# JEE Main Physics (10 topics × 100 each = 1000Q)
npm run generate:jee-physics

# UPSC GS (4 papers × 250 each = 1000Q)
npm run generate:upsc-gs

# Banking English (10 topics × 50 each = 500Q)
npm run generate:banking-english
```

---

## Troubleshooting

### Issue: Questions deleted accidentally

**Prevention:**
- ALWAYS run SELECT query first
- Review what will be deleted
- Never run DELETE without WHERE clause
- Backup before bulk operations

**Recovery:**
- Check Supabase backups (Pro plan only)
- Regenerate using scripts in this guide
- Contact support if critical data lost

### Issue: Validation fails

**Common causes:**
- Question too short (< 20 chars)
- Missing explanation (< 30 chars)
- Wrong number of options (not 4)
- Invalid difficulty value

**Fix:**
- Update AI prompt with stricter requirements
- Add validation before API call
- Filter invalid questions

### Issue: Duplicate questions

**Prevention:**
- Check existing questions before generating
- Use unique constraints in database
- Track generated question IDs

---

## API Usage and Costs

**Claude 3.5 Sonnet via OpenRouter:**
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens
- Rate limit: ~50 requests/minute
- No daily limit

**Cost Estimates:**
- 100 questions: ~$0.05-0.10
- 1000 questions: ~$0.50-1.00
- 10,000 questions: ~$5-10

**Strategy:**
- Generate in batches of 50-100 questions per call
- Add 3-second delay between topics
- Monitor costs on OpenRouter dashboard
- Budget: ~$20-30 for complete English question bank (2000+ questions)

---

## File Locations

```
/scripts/
  generate-english-questions.ts    # English question generator
  generate-exam-questions.ts       # Main exam question generator
  restore-sample-questions.sql     # Emergency restore (40Q)
  validate-questions.ts            # Validation utility
  /output/                         # Generated questions (JSON)

/src/lib/
  question-generator.ts            # Core generation logic
  english-content.ts               # English topic definitions
  exams.ts                        # Exam definitions
  subject-mapper.ts               # Dimensional model mappings

/src/app/api/
  quiz/route.ts                   # Main quiz API
  english/practice/route.ts       # English quiz API
```

---

## Next Steps

1. **Week 1:** Generate 500 questions for top 5 English topics
2. **Week 2:** Generate 1000 questions for JEE Main (Physics, Chemistry, Maths)
3. **Week 3:** Generate 500 questions for UPSC GS Paper 1
4. **Week 4:** Generate 500 questions for SSC CGL (all subjects)

**Target:** 10,000+ questions by end of Q3 2026
