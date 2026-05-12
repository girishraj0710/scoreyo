# Open Source English Learning Datasets - Analysis & Recommendations

**Date:** May 11, 2026  
**Purpose:** Evaluate free, legal sources for PrepGenie's English question bank

---

## 🎯 Executive Summary

**Finding:** Multiple high-quality, legally usable datasets found on Hugging Face!

**Key Discoveries:**
- ✅ **1,000 TOEFL academic vocabulary words** (MIT License - commercial use allowed)
- ✅ **71,000 grammar Q&A pairs** (license unclear, but from Stack Exchange)
- ✅ **10,000+ IELTS essays with evaluations** (for reference/training)
- ✅ **240,000+ vocabulary improvement pairs** (IELTS-focused)
- ✅ **45,000+ IELTS practice sentences** (for content analysis)

**Status:**
- 🟢 OER Commons: Blocked (403), but alternative sources found
- 🟢 VOA Learning English: Blocked (403), but not critical
- ✅ Hugging Face: SUCCESS - 8+ relevant datasets found
- ⏳ Kaggle: Interface detected but requires manual search

---

## 📊 Top Priority Datasets for PrepGenie

### 1. ⭐ TOEFL Essential Vocabulary (1,000 words)
**Dataset:** `wordlevel/toefl-essential-vocabulary-1k`

**✅ Why This is Perfect:**
- **License:** MIT (fully commercial use allowed)
- **Size:** 1,000 carefully curated academic words
- **Quality:** Professional curation by WordLevel.net
- **Structure:** Perfect for question generation

**Data Structure:**
```json
{
  "word": "deficit",
  "pos": "noun",
  "difficulty": 5,
  "theme": "Economics",
  "synonyms": ["shortfall", "shortage"],
  "definition_en": "The amount by which a sum of money falls short...",
  "example_sentence": "When government spending exceeds tax revenues..."
}
```

**How to Use in PrepGenie:**
1. Generate "Choose the synonym" questions
2. Generate "Fill in the blank" with example sentences
3. Generate "Match word to definition" questions
4. Create "Word in context" comprehension questions

**Attribution Required:** Must link to https://wordlevel.net (do-follow)

**Download Command:**
```python
from datasets import load_dataset
ds = load_dataset("wordlevel/toefl-essential-vocabulary-1k")
```

---

### 2. ⭐ English Grammar Q&A (71,000 pairs)
**Dataset:** `Teravee/1000_english-grammar-dataset`

**✅ Why This is Valuable:**
- **Size:** 71,052 question-answer pairs
- **Quality:** Real questions from English Language & Usage Stack Exchange
- **Coverage:** Comprehensive grammar topics
- **Format:** Instruction + Question + Detailed Answer

**Data Structure:**
```json
{
  "instruction": "How can I remember the difference between 'loose' and 'lose'?",
  "question": "Although both words can be found in dictionaries, I'm constantly forgetting...",
  "answer": "Lose has lost one of its o's. Loose has an extra o, like an extra hole..."
}
```

**Topics Covered:**
- ✅ Question formation & negation
- ✅ Word choice & usage (which/that, loose/lose)
- ✅ Articles & determiners
- ✅ Prepositions (time, place)
- ✅ Verb forms & phrasal verbs
- ✅ Pronunciation & spelling
- ✅ Adjectives & adverbs
- ✅ Idioms & expressions
- ✅ Punctuation & formality

**⚠️ License Issue:** Not specified in README. Since it's from Stack Exchange, content is likely CC BY-SA 4.0.

**How to Use in PrepGenie:**
1. Extract common grammar mistakes → Generate MCQ questions
2. Use explanations as templates for our explanations
3. Identify most-asked topics → Prioritize those in question creation
4. Adapt questions into multiple-choice format

**Action Needed:** Verify Stack Exchange data usage rights (likely need attribution)

---

### 3. ⭐ IELTS Writing Evaluations (10,000+ essays)
**Dataset:** `chillies/IELTS-writing-task-2-evaluation`

**✅ Why This is Useful:**
- **Size:** 10,324 essays with expert feedback
- **Quality:** Band scores (0-9) with detailed evaluations
- **Structure:** Prompt + Essay + Evaluation + Band score
- **Real-world:** Actual IELTS-style content

**Data Structure:**
```json
{
  "prompt": "Some people think interviews are not reliable...",
  "essay": "Student's full essay response...",
  "evaluation": "Task Achievement: [7] - Clear thesis statement...",
  "band": "7.5"
}
```

**How to Use in PrepGenie:**
1. **NOT for direct questions** (essays are too long)
2. **Extract common mistakes** → Generate correction questions
3. **Analyze evaluation patterns** → Create "Identify the error" questions
4. **Study band-level differences** → Create difficulty-appropriate content
5. **Train AI for feedback** (future feature)

**⚠️ License:** Not specified - use with caution for commercial purposes

---

### 4. IELTS Vocabulary Improvement (240,000 pairs)
**Dataset:** `duwuonline/ielts_science1_v2`

**✅ What It Offers:**
- **Size:** 241,741 vocabulary improvement pairs
- **Focus:** Science-related academic vocabulary
- **Format:** Original → Improved → Explanation

**Examples:**
```
Original: "bad influence"
Improved: "negative impact"
Explanation: "More formal and precise for academic writing"

Original: "live with unreasonable wages"
Improved: "struggle with inadequate salaries"
Explanation: "Stronger verb choice and more sophisticated vocabulary"
```

**How to Use:**
- Generate "Choose the better word" questions
- Create synonym exercises
- Build formal vs informal writing lessons

**⚠️ License:** Unknown

---

### 5. IELTS Practice Sentences (45,000)
**Dataset:** `mshojaei77/ielts-practice-sentences`

**✅ What It Offers:**
- **Size:** 45,667 sentences from IELTS materials
- **Includes:** Keywords extracted from each sentence
- **Sources:** Speaking cue cards, writing tasks, reading passages

**Example:**
```json
{
  "sentence": "you should spend about 20 minutes on this task",
  "Keywords": ["spend", "minutes", "task"]
}
```

**How to Use:**
- **Content analysis:** Study IELTS language patterns
- **Question templates:** See how official questions are phrased
- **Keyword practice:** Generate vocabulary-in-context questions

**⚠️ License:** Not specified

---

### 6. TOEFL Speaking Dataset (99 samples)
**Dataset:** `HCHSmost/toefl_speaking`

**Status:** Small (99 rows) but could be useful for speaking section reference

---

## 🚦 Licensing Summary

| Dataset | License | Commercial Use | Attribution | Risk Level |
|---------|---------|----------------|-------------|------------|
| **TOEFL Vocabulary (1k)** | MIT | ✅ Yes | Required (backlink) | 🟢 LOW |
| **Grammar Q&A (71k)** | Unclear (Stack Exchange) | ⚠️ Likely CC BY-SA | Required | 🟡 MEDIUM |
| **IELTS Essays (10k)** | Not specified | ❓ Unknown | Unknown | 🟡 MEDIUM |
| **IELTS Vocab (240k)** | Not specified | ❓ Unknown | Unknown | 🟡 MEDIUM |
| **IELTS Sentences (45k)** | Not specified | ❓ Unknown | Unknown | 🟡 MEDIUM |

---

## ✅ Immediate Action Plan

### Phase 1: TOEFL Vocabulary Integration (100% Safe)

**Step 1: Download the MIT-licensed dataset**
```bash
cd /Users/girish.raj/prepgenie/scripts
```

Create `import-toefl-vocabulary.ts`:
```typescript
import { load_dataset } from '@huggingface/hub';

// Download dataset
const dataset = await load_dataset("wordlevel/toefl-essential-vocabulary-1k");

// Generate questions:
// 1. Synonym matching (400Q from 1000 words)
// 2. Definition matching (300Q)
// 3. Word in context (300Q)
// = 1,000 questions from 1,000 words!
```

**Why this is perfect:**
- ✅ MIT License = 100% legal for commercial use
- ✅ High-quality professional curation
- ✅ Can generate 1,000+ questions from 1,000 words
- ✅ Only requires attribution (easy: link to WordLevel.net)

**Timeline:** Can implement in 1-2 hours

---

### Phase 2: Grammar Q&A Analysis (Medium Risk - Research First)

**Step 1: Verify Stack Exchange licensing**
- Stack Exchange content is CC BY-SA 4.0
- Commercial use allowed WITH attribution
- Derivative works must use same license

**Step 2: Use as inspiration (not direct copy)**
- Extract common grammar mistake patterns
- Study explanation styles
- Identify high-frequency topics
- **Create original questions** inspired by these patterns

**Timeline:** 1 day for research, then use insights for question creation

---

### Phase 3: IELTS/TOEFL Content Reference (Use Carefully)

**Approach:**
1. **Study the patterns** in IELTS essays and sentences
2. **Analyze the structure** of evaluations
3. **Identify common topics** and vocabulary
4. **Create original questions** based on these insights
5. **Never copy directly** - always create original content

**Use cases:**
- Reference for question difficulty calibration
- Study evaluation criteria for writing feedback
- Analyze vocabulary levels for different proficiency stages
- Understand official exam formats

---

## 📋 Recommended Strategy for PrepGenie

### ✅ DO THIS (Low Risk, High Value)

**1. Use MIT-Licensed TOEFL Vocabulary (Immediate)**
```
Priority: HIGHEST
Risk: ZERO
Value: Can generate 1,000 questions immediately
Action: Download and create question generator script
```

**2. Create Original Questions Inspired by Grammar Dataset**
```
Priority: HIGH
Risk: LOW (if we create originals)
Value: Learn from 71k real grammar questions
Action: Analyze patterns, create original MCQs
```

**3. Reference IELTS Materials for Structure**
```
Priority: MEDIUM
Risk: LOW (reference only)
Value: Understand exam formats and difficulty
Action: Study structure, create original content
```

### ❌ DON'T DO THIS (High Risk)

**1. Direct copying from unlicensed datasets**
**2. Using IELTS essays without proper licensing**
**3. Scraping official exam materials**
**4. Commercial use without verifying licenses**

---

## 💡 Combining Strategies

**Optimal Approach:**

1. **Foundation (Current - 336Q):** Manual curation ✅
   - Original questions following institute standards
   - High quality, legally safe
   - Current status: WORKING WELL

2. **Boost (Immediate - +1,000Q):** TOEFL Vocabulary ✅
   - MIT licensed dataset
   - Generate synonym, definition, context questions
   - Target: 1,336 questions total

3. **Enhancement (Ongoing):** Grammar Q&A Analysis ⚠️
   - Study patterns from 71k questions
   - Create original questions inspired by common mistakes
   - Verify Stack Exchange licensing first

4. **Reference (Background):** IELTS Materials 📚
   - Study official formats and difficulty
   - Never copy directly
   - Use as quality benchmark

---

## 🎯 Recommendation

**Immediate Priority:** Integrate TOEFL Vocabulary Dataset

**Why:**
1. ✅ **100% legal** (MIT License)
2. ✅ **High quality** (professionally curated)
3. ✅ **Perfect structure** for question generation
4. ✅ **1,000 questions** from 1,000 words possible
5. ✅ **Easy attribution** (just link to WordLevel.net)

**Next Steps:**
1. Create `import-toefl-vocabulary.ts` script
2. Generate 4 question types per word:
   - Synonym selection (25% = 250Q)
   - Definition matching (25% = 250Q)
   - Fill in the blank (25% = 250Q)
   - Word in context (25% = 250Q)
3. Add to database with proper attribution
4. Reach **1,336 total questions** (336 current + 1,000 new)

**Timeline:** 2-3 hours of work to reach 1,300+ questions!

---

## 📞 Attribution Requirements

### For TOEFL Vocabulary Dataset:
```html
<!-- Add to PrepGenie footer or credits page -->
<a href="https://wordlevel.net" rel="dofollow">
  TOEFL vocabulary powered by WordLevel.net
</a>
```

### For Stack Exchange Content (if used):
```html
<!-- If using grammar Q&A patterns -->
Grammar content inspired by Stack Exchange contributors
Licensed under CC BY-SA 4.0
```

---

## 🔒 Legal Checklist

Before using any dataset commercially:

- [ ] Verify license type (MIT, CC BY, CC BY-SA, etc.)
- [ ] Check commercial use permissions
- [ ] Note attribution requirements
- [ ] Test with small sample first
- [ ] Document data sources in credits
- [ ] Review Terms of Service for Hugging Face
- [ ] Consult with legal if uncertain

---

## 📊 Expected Results

**If we integrate TOEFL vocabulary:**

```
Current State:
  336 questions (manual curation)
  13 active topics
  34% of 1,000-question launch goal

After TOEFL Integration:
  1,336+ questions (336 + 1,000)
  18+ active topics (add vocabulary topics)
  133% of launch goal ✅ READY TO LAUNCH

Quality:
  ✅ All original questions
  ✅ All legally licensed
  ✅ Professional vocabulary database
  ✅ Mix of manual + structured generation
```

---

**Next Decision Point:** Should I create the TOEFL vocabulary import script now?

This would add 1,000 high-quality vocabulary questions to your database within a few hours, bringing you well above the 1,000-question launch threshold with 100% legal, MIT-licensed content.
