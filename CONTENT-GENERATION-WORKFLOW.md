# Content Generation Workflow - Direct Generation

**Last Updated:** 2026-06-16  
**Method:** Generate content directly in conversation (no API calls needed)

---

## 🎯 How It Works

Instead of running scripts that call external APIs, you ask Claude directly to generate content in this conversation.

**Benefits:**
- ✅ **Free** - No API costs (you're already using Claude Code)
- ✅ **Fast** - Instant generation, no scripts to run
- ✅ **Interactive** - Review immediately, request changes on the spot
- ✅ **Quality** - Same Claude 3.5 Sonnet quality
- ✅ **No setup** - No OpenRouter account needed

---

## 📝 Generate Questions

### Request Format

Simply ask:
```
Generate 50 English questions for [TOPIC NAME]
```

### Example Request

```
Generate 50 English questions for Articles (A, An, The)

Requirements:
- 20 easy, 20 medium, 10 hard
- Test definite vs indefinite articles
- Include common mistakes by Indian learners
- All questions >= 20 characters
- All explanations >= 30 characters
```

### What You'll Get

I'll generate:
1. **JSON format** - All questions in structured format
2. **SQL format** - Ready to paste into Supabase SQL Editor
3. **Validation report** - Counts, difficulty distribution, etc.

### Then You:
1. Review the questions
2. Copy the SQL
3. Paste in Supabase SQL Editor
4. Run it
5. Test on frontend

---

## 📚 Generate Study Materials

### Request Format

Simply ask:
```
Generate study material for [TOPIC NAME]
```

### Example Request

```
Generate study material for Present Simple Tense

Context:
- For Indian learners (A1-A2 level)
- Include all 6 sections
- Focus on common mistakes (Hindi interference)
- Use Indian context examples where relevant
```

### What You'll Get

I'll generate:
1. **Complete JSON** - All 6 sections properly formatted
2. **SQL format** - Ready to insert into database
3. **Preview** - Key sections shown for quick review

### Then You:
1. Review the content
2. Request changes if needed ("add more examples", "make easier", etc.)
3. Copy the SQL
4. Paste in Supabase SQL Editor
5. Test on frontend

---

## ✅ Quality Standards

I'll automatically ensure:

**For Questions:**
- ✅ Question text >= 20 characters
- ✅ Exactly 4 options
- ✅ Explanation >= 30 characters
- ✅ Valid difficulty (easy/medium/hard)
- ✅ No placeholders
- ✅ Correct answer is 0-3

**For Study Materials:**
- ✅ All 6 sections present
- ✅ Core Concepts formatted with ## headers
- ✅ Flashcards separated by ---
- ✅ 8-12 flashcards in Core Concepts
- ✅ 8-12 common mistakes
- ✅ 12-15 practice problems

---

## 🎨 Customization

### Request Variations

**More specific:**
```
Generate 30 medium-difficulty questions about irregular verbs in past simple tense. Focus on commonly confused verbs (go/went, see/saw, etc.)
```

**Different style:**
```
Generate questions with real IELTS exam style for reading comprehension. Include passage-based questions.
```

**Regional context:**
```
Generate questions with examples relevant to Indian students (festivals, places, names, situations)
```

### Modifications

If you want changes:
```
Make the explanations simpler (B1 level English)
Add more examples for each concept
Focus more on errors made by Hindi speakers
Make questions harder
```

---

## 📊 Batch Generation

### Efficient Workflow

**Day 1: Generate Foundation Topics**
1. "Generate 50 questions for Articles"
2. Review → Insert → Test
3. "Generate 50 questions for Present Simple"
4. Review → Insert → Test
5. Continue for 5-10 topics

**Day 2: Generate Study Materials**
1. "Generate study material for Articles"
2. Review → Insert → Test
3. "Generate study material for Present Simple"
4. Review → Insert → Test
5. Continue for 5-10 topics

**Advantage:** You control the pace, review quality in real-time, iterate immediately.

---

## 🔄 Iteration Process

### If Quality Needs Improvement

**Scenario 1: Questions too easy**
```
Those questions are too easy. Make them harder - include error correction and complex sentences.
```

**Scenario 2: Explanations unclear**
```
The explanations are too technical. Rewrite them in simpler English (A2 level).
```

**Scenario 3: Need more variety**
```
Add more fill-in-the-blank style questions. Currently all are "choose the correct option."
```

**Scenario 4: Wrong focus**
```
Focus more on when to use "the" vs zero article. Less focus on a/an distinction.
```

I'll regenerate with your feedback instantly.

---

## 📋 Topic Checklist

### English Foundation Topics (50+ topics)

**Priority 1 (Week 1):**
- [ ] Articles (A, An, The) - 80 questions
- [ ] Present Simple - 100 questions
- [ ] Present Continuous - 100 questions
- [ ] Past Simple - 100 questions
- [ ] Future Simple - 80 questions

**Priority 2 (Week 2):**
- [ ] Present Perfect - 100 questions
- [ ] Past Continuous - 80 questions
- [ ] Modals (can, could, should, must) - 100 questions
- [ ] Passive Voice - 80 questions
- [ ] Conditionals (if clauses) - 100 questions

**Priority 3 (Week 3):**
- [ ] Relative Clauses - 80 questions
- [ ] Reported Speech - 80 questions
- [ ] Gerunds and Infinitives - 80 questions
- [ ] Phrasal Verbs - 100 questions
- [ ] Prepositions of Time/Place - 100 questions

### Study Materials

**Priority 1 (Week 1):**
- [ ] Articles
- [ ] Present Simple
- [ ] Present Continuous
- [ ] Past Simple
- [ ] Future Simple

**Priority 2 (Week 2):**
- [ ] Present Perfect
- [ ] Modals
- [ ] Passive Voice
- [ ] Conditionals
- [ ] Reported Speech

---

## 💡 Pro Tips

### 1. Start Small
Generate 10-20 questions first, review quality, then scale to 50-100.

### 2. Be Specific
The more context you give, the better the output.

**Generic:**
```
Generate questions about tenses
```

**Specific:**
```
Generate 30 medium-difficulty questions about present perfect vs past simple. Focus on time expressions (already, yet, just, ago, last week) that signal which tense to use. Include common mistakes by Indian learners who confuse these tenses.
```

### 3. Review Before Inserting
Always check the SQL output before pasting into Supabase. Look for:
- Escaped quotes (should be '')
- Valid JSON format for options
- Complete explanations

### 4. Test Incrementally
Insert 50 questions → Test on frontend → Insert next 50

Don't insert 500 questions at once without testing.

### 5. Save Outputs
Copy generated SQL to text files for backup:
```
/Users/girish.raj/prepgenie/scripts/output/articles-questions-manual-2026-06-16.sql
```

---

## 🚀 Ready to Start?

Just say:
```
Generate [NUMBER] questions for [TOPIC]
```

or

```
Generate study material for [TOPIC]
```

I'll handle the rest! 🎯

---

## 📞 Need Help?

**Common Issues:**

**"Questions are too similar"**
→ Ask: "Add more variety - include error correction, fill blanks, and sentence transformation questions"

**"I need different difficulty"**
→ Ask: "Generate 40 easy, 30 medium, 30 hard" (specify exact distribution)

**"Wrong focus area"**
→ Ask: "Focus more on [X] and less on [Y]"

**"SQL has errors"**
→ I'll fix it. Point out the error line.

**"Need to regenerate"**
→ Just ask! No cost, instant regeneration.

---

**Remember:** I'm Claude - I can generate all the content you need right here, right now. No scripts, no API calls, no costs. Just ask! 💪
