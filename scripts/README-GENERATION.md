# Content Generation Scripts - README

**Last Updated:** 2026-06-16  
**AI Model:** Claude 3.5 Sonnet via OpenRouter

---

## 🚀 Quick Start

### Prerequisites

1. **Environment variables set** in `.env.local`:
   ```bash
   OPENROUTER_API_KEY=sk-or-v1-...
   POSTGRES_URL=postgresql://...
   ```

2. **Dependencies installed**:
   ```bash
   npm install
   ```

3. **OpenRouter account** with credits:
   - Sign up at https://openrouter.ai
   - Add credits (recommended: $20 for testing)
   - Get API key from dashboard

---

## 📝 Generate Questions

### English Questions

```bash
# Generate questions for English topics
npx tsx scripts/generate-english-questions-claude.ts
```

**Output:**
- `scripts/output/[topic]-questions-YYYY-MM-DD.json` - JSON format
- `scripts/output/[topic]-questions-YYYY-MM-DD.sql` - SQL insert statements

**Cost:** ~$0.05-0.10 per 100 questions

**Topics configured:**
- Parts of Speech (360 questions)
- Articles (80 questions)
- Present Simple (100 questions)
- Present Continuous (100 questions)
- Past Simple (100 questions)

**Total:** 740 questions, estimated cost $3-5

### Main Exam Questions (JEE/NEET/UPSC)

```bash
# Generate questions for main exams
npx tsx scripts/generate-exam-questions-claude.ts
```

**Note:** This script needs to be created. Use `generate-english-questions-claude.ts` as template.

---

## 📚 Generate Study Materials

```bash
# Generate study materials for topics
npx tsx scripts/generate-study-materials-claude.ts
```

**Output:**
- `scripts/output/study-materials-YYYY-MM-DD/[topic].json` - JSON format
- `scripts/output/study-materials-YYYY-MM-DD/[topic].sql` - SQL insert statements

**Cost:** ~$0.10-0.20 per study material

**Topics configured:**
- Articles (A, An, The)
- Present Simple Tense
- Present Continuous Tense
- Past Simple Tense
- Future Simple Tense

**Total:** 5 study materials, estimated cost $0.50-1.00

---

## 💰 Cost Tracking

### Claude 3.5 Sonnet Pricing
- **Input:** $3 per 1M tokens
- **Output:** $15 per 1M tokens

### Estimated Costs

**Questions:**
- 100 questions: $0.05-0.10
- 1,000 questions: $0.50-1.00
- 10,000 questions: $5-10

**Study Materials:**
- 1 topic: $0.10-0.20
- 10 topics: $1-2
- 100 topics: $10-20

**Complete English Content:**
- 2,000 questions: $10-20
- 50 study materials: $5-10
- **Total:** $15-30

---

## ✅ After Generation

### Step 1: Review Output

```bash
# Check generated files
ls -lh scripts/output/

# View JSON (human-readable)
cat scripts/output/articles-questions-2026-06-16.json | jq .

# View SQL (ready to insert)
cat scripts/output/articles-questions-2026-06-16.sql
```

### Step 2: Quality Check

**For Questions:**
- [ ] All questions >= 20 characters
- [ ] All have exactly 4 options
- [ ] All explanations >= 30 characters
- [ ] No placeholders ([...], ____, ...)
- [ ] Difficulty distribution correct (40-40-20)
- [ ] 10% manual review for accuracy

**For Study Materials:**
- [ ] All 6 sections present
- [ ] Core Concepts has ## headers
- [ ] Flashcards separated by ---
- [ ] 8-12 flashcards in Core Concepts
- [ ] 8-12 common mistakes
- [ ] 12-15 practice problems

### Step 3: Insert into Database

**Option A: Supabase SQL Editor (Recommended)**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in sidebar
4. Copy content from `.sql` file
5. Click "Run"
6. Verify success

**Option B: Command Line (Advanced)**
```bash
psql $POSTGRES_URL -f scripts/output/articles-questions-2026-06-16.sql
```

### Step 4: Test on Frontend

**Questions:**
```
https://scoreyo.in/english/foundation/articles/practice?count=10
```

**Study Materials:**
```
https://scoreyo.in/study?examId=english&subjectId=articles
```

---

## 🛠️ Customization

### Add More Topics

Edit the script and add to the `TOPICS` array:

**For Questions:**
```typescript
const TOPICS = [
  // ... existing topics
  {
    path_id: 'foundation',
    topic_id: 'adjectives',
    name: 'Adjectives',
    level: 'beginner',
    count: 100,
    context: 'Types of adjectives, comparative and superlative forms, order of adjectives, common mistakes.'
  },
];
```

**For Study Materials:**
```typescript
const TOPICS = [
  // ... existing topics
  {
    topic_id: 'adjectives',
    title: 'Adjectives',
    level: 'beginner',
    context: 'Types, degrees of comparison, order, position in sentence.'
  },
];
```

### Adjust Difficulty Distribution

In `generateQuestionsForTopic()`:
```typescript
// Current: 40% easy, 40% medium, 20% hard
const easyCount = Math.floor(count * 0.4);
const mediumCount = Math.floor(count * 0.4);
const hardCount = count - easyCount - mediumCount;

// Change to: 30% easy, 50% medium, 20% hard
const easyCount = Math.floor(count * 0.3);
const mediumCount = Math.floor(count * 0.5);
const hardCount = count - easyCount - mediumCount;
```

### Change AI Temperature

```typescript
const response = await openai.chat.completions.create({
  model: 'anthropic/claude-3.5-sonnet',
  temperature: 0.7,  // Lower = more consistent, Higher = more creative
  // ...
});
```

**Recommended:**
- Questions: 0.7 (balanced)
- Study Materials: 0.7-0.8 (slightly more creative)

---

## 🔧 Troubleshooting

### Error: "command not found: npx"

**Solution:** Install Node.js
```bash
# macOS
brew install node

# Check installation
node --version
npm --version
```

### Error: "Cannot find module 'openai'"

**Solution:** Install dependencies
```bash
npm install
```

### Error: "Invalid API key"

**Solution:** Check `.env.local`
```bash
# Verify file exists
cat .env.local | grep OPENROUTER_API_KEY

# Should show: OPENROUTER_API_KEY=sk-or-v1-...
```

### Error: "Rate limit exceeded"

**Solution:** Add longer delays
```typescript
// Increase from 3 seconds to 10 seconds
await new Promise(resolve => setTimeout(resolve, 10000));
```

### Error: "Failed to parse JSON"

**Cause:** Claude sometimes adds markdown formatting

**Solution:** Already handled in script (extracts JSON from ```json blocks)

**Manual fix:**
1. Open output JSON file
2. Remove any ``` or ```json markers
3. Validate JSON: https://jsonlint.com

### Issue: Questions too easy/hard

**Solution:** Adjust prompt in script
- Add more examples of desired difficulty
- Be more specific about what makes a question "hard"
- Increase sample size and filter manually

### Issue: Study material missing sections

**Solution:** 
- Check generated JSON file
- Verify all 6 section IDs present
- Regenerate if missing (Claude rarely misses with clear instructions)

---

## 📊 Progress Tracking

### Current Status

**Questions Generated:**
- Parts of Speech: 40/400 (10%)
- Other topics: 0/1,600 (0%)
- **Total: 40/2,000 (2%)**

**Study Materials Generated:**
- Parts of Speech: 1/1 (100%)
- Other topics: 0/49 (0%)
- **Total: 1/50 (2%)**

### Next Targets

**Week 1:**
- [ ] Generate 740 English questions (5 topics)
- [ ] Generate 5 study materials
- [ ] Budget: $5

**Week 2:**
- [ ] Generate 500 IELTS questions
- [ ] Generate 5 IELTS study materials
- [ ] Budget: $5

**Week 3:**
- [ ] Generate 1,000 JEE Physics questions
- [ ] Generate 10 JEE study materials
- [ ] Budget: $15

**Month 1 Goal:**
- 2,500 questions
- 25 study materials
- Total budget: $30-40

---

## 📞 Support

### Check Logs

```bash
# View last run
cat scripts/output/*.log

# Check for errors
grep "Error" scripts/output/*.log
```

### Check Costs

1. Go to https://openrouter.ai/activity
2. View your usage
3. Check costs per model
4. Monitor daily/weekly spend

### Report Issues

If generation fails consistently:
1. Save error logs
2. Save problematic output files
3. Note which topic failed
4. Check OpenRouter status: https://status.openrouter.ai

---

## 🎯 Best Practices

1. **Start Small**
   - Test with 1 topic first
   - Review output quality
   - Adjust prompts if needed
   - Scale up gradually

2. **Monitor Costs**
   - Check OpenRouter dashboard regularly
   - Set budget alerts
   - Track cost per question/material

3. **Quality Over Quantity**
   - Always review 10% sample
   - Fix issues before bulk generation
   - Better to generate 100 perfect questions than 1000 mediocre ones

4. **Version Control**
   - Keep generated files in git (in output/ directory)
   - Track what works
   - Iterate on prompts

5. **Backup Generated Content**
   - Copy output/ directory to cloud storage
   - Don't regenerate if quality is good
   - Reuse prompts that work well

---

**Questions?** Check the main documentation:
- [Question Generation Guide](../QUESTION-GENERATION-GUIDE.md)
- [Study Material Guide](../STUDY-MATERIAL-GENERATION-GUIDE.md)
- [Content Generation Index](../CONTENT-GENERATION-INDEX.md)
