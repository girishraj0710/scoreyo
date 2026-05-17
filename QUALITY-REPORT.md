# Question Quality Report

**Date:** May 17, 2026
**Total Questions:** 31,179
**New Questions Today:** +4,743

---

## 📊 Quality Analysis by Source

### 1. Ollama Free Seeder (`ollama-local-free`)
**Total Generated:** ~874 questions
**Cost:** $0 (100% FREE)
**Success Rate:** ~70% (parsing failures)

#### ✅ Strengths:
- **FREE:** No cost at all
- **Good difficulty distribution:**
  - Easy: 307 (35%)
  - Medium: 272 (31%)
  - Hard: 295 (34%)
- **Decent coverage:** Covers all subjects equally

#### ⚠️ Issues Found:

1. **Duplicate/Similar Questions:**
   - Found patterns with 6-11 duplicates
   - Example: "Find the general solution of the differential equation" (11x)
   - Same question structure, different parameters

2. **Short Explanations:**
   - Average: 146 characters
   - Minimum: 27 characters (too short!)
   - Many explanations incomplete

3. **Suspicious Answer Patterns:**
   - 3 consecutive questions all have "D. e^(x)" as correct answer
   - May indicate pattern repetition in AI generation

4. **Quality Issues in Sample:**
   - COMEDK Differential Equations questions all suspiciously similar
   - Options don't match question complexity (sin, cos, tan, e^x for complex DEs)
   - Explanations truncated mid-sentence

#### 📈 Quality Score: **60/100**
- Useful for practice volume
- NOT suitable as primary learning resource
- Needs human review before marking as "verified"

---

### 2. Verified Top 20 Extractor (`verified-*`)
**Total Generated:** ~3,410 questions
**Cost:** ~$5-6
**Success Rate:** ~100%

#### ✅ Strengths:
- **High quality explanations:**
  - Average: 314 characters (2x better than Ollama)
  - Minimum: 139 characters (always substantial)
- **Clear step-by-step solutions**
- **Proper formula citations**
- **Referenced to source books** (R.S. Aggarwal, etc.)

#### Good Examples from Sample:

**Question:** "A train 240m long crosses platform 260m long in 25 seconds. Speed in km/hr?"
- ✅ Clear problem statement
- ✅ Step-by-step calculation shown
- ✅ Proper unit conversion explained
- ✅ Reference to "Standard conversion formula"

**Question:** "Boat downstream 12km in 2hrs, upstream 4km in 2hrs. Current speed?"
- ✅ Standard aptitude problem pattern
- ✅ Formula clearly stated: (Downstream - Upstream) / 2
- ✅ All steps shown

#### 📈 Quality Score: **85/100**
- Suitable for actual student practice
- Can be used as primary learning resource
- Minor issues: some generic "Standard Exam Preparation Books" citations

---

## 🔍 Key Findings

### Duplicate Detection
Found 5 patterns with multiple duplicates:
1. Differential equations (11 similar questions)
2. Probability with dice (9 similar)
3. Car speed problems (8 similar)
4. Permutation/combination (7 similar)
5. Coordination compounds (6 similar)

**Recommendation:** Add deduplication check in seeder scripts

### Explanation Quality

| Source | Avg Length | Min Length | Quality |
|--------|-----------|-----------|---------|
| Ollama Free | 146 chars | 27 chars | ⚠️ Poor |
| Verified Top 20 | 314 chars | 139 chars | ✅ Good |

**Recommendation:** Set minimum explanation length requirement (100+ chars)

### Difficulty Distribution

**Ollama Free:** Balanced (33-35% each)
**Verified Top 20:** Medium-heavy (53% medium, 26% easy, 21% hard)

Both distributions are acceptable.

---

## 🎯 Recommendations

### Immediate Actions:

1. **Add Duplicate Detection:**
```typescript
// Before inserting, check first 50 chars of question
const similar = await db.execute({
  sql: `SELECT id FROM exam_questions 
        WHERE LOWER(SUBSTR(question, 1, 50)) = LOWER(SUBSTR(?, 1, 50))
        AND exam_id = ? AND topic = ?`,
  args: [newQuestion, examId, topic]
});
```

2. **Add Explanation Length Validation:**
```typescript
if (question.explanation.length < 100) {
  console.log('⚠️ Explanation too short, skipping');
  continue;
}
```

3. **Review Ollama Questions:**
   - Mark all `ollama-local-free` questions for review
   - Add "AI-generated, needs review" flag
   - Don't show in quiz until reviewed

4. **Continue Verified Extractor:**
   - High quality, worth the cost
   - Use as primary source
   - Ollama as backup/filler only

### Long-term Strategy:

**Quality Tiers:**
1. **Tier 1 (95%+ accuracy):** Official PYQs, NCERT
2. **Tier 2 (85%+ accuracy):** Verified AI (Top 20 Extractor) ✅
3. **Tier 3 (60-70% accuracy):** Free AI (Ollama) ⚠️
4. **Tier 4 (Unverified):** Other AI sources

**Show to Students:**
- Tier 1 & 2: Primary quiz pool
- Tier 3: Only after review OR marked as "Practice Mode (Beta)"
- Tier 4: Never show without review

---

## 📝 Summary

### Ollama Free Seeder:
- ✅ Good for volume
- ⚠️ Quality issues (duplicates, short explanations)
- 💡 Use as backup, not primary source
- 🔍 Needs human review before production use

### Verified Top 20 Extractor:
- ✅ Excellent quality
- ✅ Suitable for student practice
- ✅ Worth the $5-6 cost
- 💚 Can use in production immediately

**Overall Verdict:** 
Continue both processes, but prioritize Verified Top 20 for actual student quizzes. Use Ollama questions only after adding them to a "review queue" or marking as "beta practice mode."
