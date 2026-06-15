# ✅ WEEK 1 PARALLEL EXECUTION - READY TO RUN

**Date:** June 14, 2026  
**Status:** All scripts created, ready for execution  
**Approach:** Option C - Parallel (Both streams simultaneously)

---

## 🎯 Week 1 Goals

### Stream A: 7 Study Materials (~17,500 words)
- Parts of Speech
- Present Tenses
- Past Tenses
- Future Tenses
- Articles (a, an, the)
- Active and Passive Voice
- Subject-Verb Agreement

### Stream B: 530 Critical Questions
- Pronunciation: 100 questions (0 → 100)
- Pronouns Detailed: 100 questions (0 → 100)
- Adjectives: 100 questions (0 → 100)
- Nouns Detailed: 115 questions (5 → 120)
- Verbs Basics: 115 questions (5 → 120)

---

## 📁 Files Created

### Generation Scripts
1. **`scripts/generate-study-material.ts`** (Stream A)
   - Ready to run
   - Generates all 7 materials with Cambridge alignment
   - Rate limited to 2 seconds between requests
   - Outputs to: `content-generated/study-materials/*.md`

2. **`scripts/generate-questions-batch.ts`** (Stream B)
   - Ready to run
   - Generates 530 questions across 5 topics
   - Rate limited to 3 seconds between batches
   - Outputs to: `content-generated/questions/*.json`

### Documentation
3. **`PARALLEL-EXECUTION-PLAN.md`** - Complete 8-week roadmap
4. **`LEARN-ENGLISH-ACTION-PLAN.md`** - Full content generation strategy
5. **`ENGLISH-CONTENT-FINAL-AUDIT.md`** - Detailed audit of existing content

---

## 🚀 How to Execute (Run These Commands)

### Prerequisites Check

```bash
# Ensure you're in the project directory
cd /Users/girish.raj/prepgenie

# Verify OpenRouter API key is set
echo $OPENROUTER_API_KEY
# If empty, set it:
# export OPENROUTER_API_KEY="your-key-here"

# Verify dependencies installed
npm list @openrouter/ai-sdk-provider ai
# If not installed:
# npm install @openrouter/ai-sdk-provider ai
```

---

### Execute Stream A (Study Materials)

```bash
# Create output directory
mkdir -p content-generated/study-materials

# Run generation script
npx tsx scripts/generate-study-material.ts
```

**Expected Output:**
```
🎓 STREAM A: Study Materials Generation Starting...
Target: 7 materials (~17,500 words total)

[1/7] Generating: Parts of Speech (target: 2500 words)...
✅ Generated: Parts of Speech
   Words: 2543 (target: 2500)
   File: parts-of-speech.md

⏳ Waiting 2 seconds (rate limit)...

[2/7] Generating: Present Tenses (target: 3000 words)...
✅ Generated: Present Tenses
   Words: 3021 (target: 3000)
   File: present-tenses.md

...

============================================================
📊 STREAM A WEEK 1 SUMMARY
============================================================
✅ Successful: 7/7
❌ Failed: 0/7
📝 Total Words: 17,543
💰 Estimated Cost: $0.35
============================================================
```

**Time:** ~20 minutes  
**Cost:** ~$0.35 (7 × $0.05)

---

### Execute Stream B (Questions)

```bash
# Create output directory
mkdir -p content-generated/questions

# Run generation script
npx tsx scripts/generate-questions-batch.ts
```

**Expected Output:**
```
📝 STREAM B: Question Generation Starting...
Target: 530 questions across 5 topics

[1/5] Generating: Pronunciation (100 questions)...
   Difficulty: 40E + 50M + 10H
✅ Generated: 100 questions for Pronunciation
   Sample Q: Which word has a different vowel sound? 'ship', 'sheep', 'kee...

⏳ Waiting 3 seconds (rate limit)...

[2/5] Generating: Pronouns (100 questions)...
...

============================================================
📊 STREAM B WEEK 1 SUMMARY
============================================================
✅ Successful Batches: 5/5
❌ Failed Batches: 0/5
📝 Total Questions: 530
💰 Estimated Cost: $5.30

📁 Output Location: content-generated/questions/
   - week1-batch.json (all questions)
   - 5 individual topic files

🔍 Next Step: Quality review (sample 10% = ~53 questions)
============================================================
```

**Time:** ~18 minutes  
**Cost:** ~$5.30 (530 × $0.01)

---

## ✅ Quality Review Process

### For Study Materials (Human Review Required)

**Checklist for Each Material:**

```markdown
## Parts of Speech Review

- [ ] Structure: Follows template exactly (11 sections)
- [ ] Cambridge Alignment: A1 level appropriate, Can-Do statements present
- [ ] Indian Context: Uses RBI/UPSC/Indian names/places
- [ ] Visual Aids: At least 1 table/diagram
- [ ] Practice Problems: 7-10 questions with detailed answers
- [ ] Exam Relevance: Mentions SSC/Banking/IELTS patterns
- [ ] Accuracy: Grammar rules verified (cross-checked with Cambridge Grammar)
- [ ] Completeness: No "TODO", all sections filled

**Status:** [ ] APPROVED / [ ] NEEDS REVISION

**Notes:** _____________________________________
```

**Process:**
1. Read each generated `.md` file
2. Fill checklist
3. Edit file if needed (fix examples, add visuals)
4. Mark as APPROVED when ready
5. Move to database insertion

---

### For Questions (10% Sample Review)

**Sample Size:** 53 questions (10% of 530)

**Selection Method:**
```bash
# Extract every 10th question for review
jq '[.[] | select((.path_id == "foundation") and ((.question | length) > 0))] | .[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520]' content-generated/questions/week1-batch.json > content-generated/questions/review-sample.json
```

**Review Criteria:**

For each sampled question, verify:

1. **Correctness:** Is the marked answer truly correct?
2. **Uniqueness:** Is there only ONE defensibly correct answer?
3. **Explanation Quality:** Does it teach the concept (not just confirm)?
4. **Distractors:** Are wrong options plausible (not obviously incorrect)?
5. **Difficulty:** Does it match the tagged level (easy/medium/hard)?
6. **Grammar:** Is the question text grammatically perfect?
7. **Context:** Does it use Indian context appropriately?

**Approval Decision:**
- If **0-2 issues found** in 53 samples → APPROVE all 530 questions
- If **3-10 issues found** → Fix those specific questions, approve rest
- If **>10 issues found** → Regenerate entire topic

---

## 📊 Database Insertion

Once content is reviewed and approved:

### Insert Study Materials

```typescript
// scripts/insert-study-materials.ts
import { getPool } from '@/lib/db';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

async function insertStudyMaterials() {
  const pool = getPool();
  const materialsDir = 'content-generated/study-materials';
  const files = await readdir(materialsDir);
  
  const topicMapping: Record<string, { topicId: number; subjectId: number }> = {
    'parts-of-speech.md': { topicId: 1, subjectId: 1 }, // Example - get actual IDs from database
    'present-tenses.md': { topicId: 10, subjectId: 1 },
    'past-tenses.md': { topicId: 13, subjectId: 1 },
    'future-tenses.md': { topicId: 15, subjectId: 1 },
    'articles-a-an-the.md': { topicId: 7, subjectId: 1 },
    'active-and-passive-voice.md': { topicId: 19, subjectId: 1 },
    'subject-verb-agreement.md': { topicId: 18, subjectId: 1 },
  };
  
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const content = await readFile(join(materialsDir, file), 'utf-8');
    const mapping = topicMapping[file];
    
    if (!mapping) {
      console.warn(`No mapping found for ${file}, skipping...`);
      continue;
    }
    
    await pool.query(
      `INSERT INTO topic_study_content (topic_id, subject_id, content, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (topic_id) DO UPDATE SET content = $3, updated_at = NOW()`,
      [mapping.topicId, mapping.subjectId, content]
    );
    
    console.log(`✅ Inserted: ${file} → topic_id=${mapping.topicId}`);
  }
  
  console.log('\n🎉 All study materials inserted!');
  await pool.end();
}

insertStudyMaterials().catch(console.error);
```

### Insert Questions

```typescript
// scripts/insert-questions.ts
import { getPool } from '@/lib/db';
import { readFile } from 'fs/promises';

async function insertQuestions() {
  const pool = getPool();
  const questionsFile = 'content-generated/questions/week1-batch.json';
  const questions = JSON.parse(await readFile(questionsFile, 'utf-8'));
  
  let inserted = 0;
  
  for (const q of questions) {
    await pool.query(
      `INSERT INTO english_questions 
       (path_id, topic_id, question, options, correct_answer, explanation, difficulty, level, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [
        q.path_id,
        q.topic_id,
        q.question,
        JSON.stringify(q.options),
        q.correct_answer,
        q.explanation,
        q.difficulty,
        q.level
      ]
    );
    inserted++;
    
    if (inserted % 50 === 0) {
      console.log(`   Inserted ${inserted}/${questions.length} questions...`);
    }
  }
  
  console.log(`\n✅ Inserted ${inserted} questions!`);
  await pool.end();
}

insertQuestions().catch(console.error);
```

---

## 📈 Success Metrics

**By End of Week 1:**

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Study Materials | 0 | 7 | +7 (13% of 56 target) |
| Total Questions | 5,425 | 5,955 | +530 (71% of 8,346 target) |
| Pronunciation Questions | 0 | 100 | NEW |
| Pronouns Questions | 0 | 100 | NEW |
| Adjectives Questions | 0 | 100 | NEW |
| Nouns Questions | 5 | 120 | +115 |
| Verbs Questions | 5 | 120 | +115 |

**Student Impact:**
- ✅ Can study Grammar Fundamentals (7 topics)
- ✅ Can practice Pronunciation (100 questions)
- ✅ Can practice Pronouns (100 questions)
- ✅ Can practice Adjectives (100 questions)
- ✅ Can practice Nouns (120 questions)
- ✅ Can practice Verbs (120 questions)

---

## 🚦 Go/No-Go Decision Points

### After Stream A Completes

**GO if:**
- ✅ All 7 materials generated successfully
- ✅ Total word count ≥ 15,000 words
- ✅ Each material has required sections
- ✅ No obvious quality issues in spot check

**NO-GO if:**
- ❌ More than 2 materials failed to generate
- ❌ Word count < 12,000 (too short)
- ❌ Missing required sections
- ❌ Obvious errors in spot check

**Action on NO-GO:** Regenerate failed materials, adjust prompts, retry

---

### After Stream B Completes

**GO if:**
- ✅ All 5 batches generated successfully
- ✅ Total question count ≥ 500
- ✅ Each question has all required fields
- ✅ JSON is valid and parseable

**NO-GO if:**
- ❌ More than 1 batch failed
- ❌ Question count < 450
- ❌ Missing fields in questions
- ❌ JSON parsing errors

**Action on NO-GO:** Regenerate failed batches, fix JSON issues, retry

---

### After Quality Review

**GO (Approve for Production) if:**
- ✅ <3 issues found in 53-question sample
- ✅ All study materials pass 8-point checklist
- ✅ No critical accuracy issues
- ✅ User approves final review

**NO-GO if:**
- ❌ >10 issues found in sample
- ❌ Critical accuracy issues in study materials
- ❌ User requests major revisions

**Action on NO-GO:** Address issues, regenerate if needed, re-review

---

## 🎯 Next Steps After Week 1

Once Week 1 is complete and in production:

### Week 2 Stream A (7 materials)
- Synonyms & Antonyms
- Phrasal Verbs
- Idioms & Expressions
- Reading Comprehension Strategies
- Error Spotting Techniques
- Sentence Improvement
- Cloze Test Strategy

### Week 2 Stream B (626 questions)
- Reading Fundamentals (80)
- Short Stories (120)
- Daily Conversations (120)
- Articles extra (61)
- Essential Vocabulary (245)

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue:** `Module '@openrouter/ai-sdk-provider' not found`  
**Fix:**
```bash
npm install @openrouter/ai-sdk-provider ai
```

**Issue:** `OPENROUTER_API_KEY is not set`  
**Fix:**
```bash
export OPENROUTER_API_KEY="sk-or-v1-..."
```

**Issue:** JSON parsing error in questions  
**Fix:** The script has robust JSON extraction logic. If it still fails, check the raw AI response and manually extract the JSON array.

**Issue:** Rate limit exceeded  
**Fix:** Scripts already have 2-3 second delays. If you hit limits, increase delays in the scripts.

---

## ✅ Ready to Execute

**Status:** All preparation complete  
**Scripts:** Created and tested  
**Documentation:** Comprehensive  
**Tasks:** Tracked in TODO list

**Next Action:** Run the generation scripts in parallel (or sequentially if you prefer)

```bash
# Run both in parallel (different terminal windows)
npx tsx scripts/generate-study-material.ts &
npx tsx scripts/generate-questions-batch.ts &

# Or run sequentially
npx tsx scripts/generate-study-material.ts
npx tsx scripts/generate-questions-batch.ts
```

**Total Time:** ~35-40 minutes  
**Total Cost:** ~$5.65  
**Deliverable:** 7 study materials + 530 questions ready for production

---

**Created by:** Claude (AI Assistant)  
**Date:** June 14, 2026  
**Status:** ✅ READY FOR EXECUTION
