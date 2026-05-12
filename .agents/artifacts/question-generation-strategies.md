# Question Generation Strategies for PrepGenie

**Date**: May 12, 2026  
**Goal**: Scale question bank to match displayed counts (120-150 questions per topic)

---

## 🎯 Current Situation

| Topic | Displayed | Actual | Gap |
|-------|-----------|--------|-----|
| IELTS Reading | 120Q | 42Q | -78Q |
| IELTS Writing | 50Q | 97Q | ✅ +47Q |
| IELTS Speaking | 60Q | 26Q | -34Q |
| TOEFL Integrated | 50Q | 42Q | -8Q |
| Grammar Basics | 50Q | 12Q | -38Q |
| Vocabulary SSC | 60Q | 11Q | -49Q |
| Sentence Improvement | - | 131Q | ✅ Good |
| Business English | - | 110Q | ✅ Good |
| Daily Conversations | - | 10Q | Need 30Q |
| Email Writing | - | 10Q | Need 30Q |

**Total Gap**: ~250-300 questions needed

---

## 🚀 Strategy 1: AI-Powered Bulk Generation (RECOMMENDED)

### Approach
Use OpenRouter API (Gemini 2.0 Flash) to generate questions in batches

### Advantages
✅ Fast: Generate 10-15 questions per API call (2-3 minutes)  
✅ Scalable: Can generate 500+ questions in 1 hour  
✅ Quality: AI generates diverse, contextually relevant questions  
✅ Cost: Free tier available (Gemini Flash)  
✅ Automated: Script handles everything  

### Implementation
```bash
# Already created and running!
npx tsx scripts/bulk-generate-questions-ai.ts
```

### Output
- Generates questions in batches of 10
- Automatically inserts into Turso database
- Includes proper difficulty levels, explanations
- Progress tracking in real-time

### Estimated Time
- 10 topics × ~50 questions each = 500 questions
- ~10 questions per 2 minutes = ~100 minutes (1.5 hours)

---

## 🚀 Strategy 2: Template-Based Generation

### Approach
Use question templates with variable substitution

### Example Templates

**Grammar Template**:
```typescript
{
  template: "Identify the {part} in: \"{sentence}\"",
  variables: {
    part: ["subject", "verb", "object", "adjective"],
    sentence: ["The cat runs", "She sings beautifully", ...]
  }
}
```

**Vocabulary Template**:
```typescript
{
  template: "What is the {type} of {word}?",
  variables: {
    type: ["synonym", "antonym", "meaning"],
    word: ["meticulous", "ubiquitous", "ephemeral", ...]
  }
}
```

### Advantages
✅ Very fast: Generate 1000+ questions instantly  
✅ Consistent format  
✅ Easy to maintain  

### Disadvantages
❌ Less variety than AI  
❌ Can feel repetitive  
❌ Requires manual template creation  

### Implementation Time
- Create templates: 2-3 hours
- Generate questions: Instant

---

## 🚀 Strategy 3: Crowdsourced Question Bank

### Approach
Allow teachers/contributors to submit questions through an admin panel

### Advantages
✅ High quality (human-created)  
✅ Community-driven  
✅ Can reward contributors  

### Disadvantages
❌ Slow: Depends on contributor engagement  
❌ Needs moderation  
❌ Not immediate solution  

### Implementation Time
- Build admin panel: 1-2 weeks
- Get contributions: Ongoing

---

## 🚀 Strategy 4: Import from Public Question Banks

### Approach
Source questions from open-source datasets

### Potential Sources
1. **Kaggle Datasets**: English exam questions
2. **Hugging Face**: NLP question datasets
3. **OpenStax**: Educational content
4. **Project Gutenberg**: Reading comprehension passages

### Advantages
✅ Free and legal (open source)  
✅ Large volume available  
✅ Already quality-checked  

### Disadvantages
❌ Need to find relevant datasets  
❌ May need format conversion  
❌ Licensing verification needed  

### Implementation Time
- Find datasets: 1-2 days
- Import and format: 1-2 days

---

## 🚀 Strategy 5: Hybrid Approach (BEST LONG-TERM)

### Combination
1. **Immediate**: AI bulk generation (500 questions in 2 hours)
2. **Short-term**: Template-based generation (500 more questions)
3. **Long-term**: Crowdsourced contributions
4. **Ongoing**: Import high-quality public datasets

### Timeline
- **Today**: AI generates 500 questions ✅
- **This week**: Add template system (500 more)
- **This month**: Build contributor system
- **Ongoing**: Community additions

---

## 📊 Recommended Implementation Plan

### Phase 1: Immediate (Today) - AI Generation ✅
**Target**: 500 questions  
**Topics**: 
- IELTS Reading: +78Q → 120Q total
- IELTS Speaking: +34Q → 60Q total
- Grammar Basics: +38Q → 50Q total
- Vocabulary SSC: +49Q → 60Q total
- Daily Conversations: +30Q → 40Q total
- Email Writing: +30Q → 40Q total
- Academic Vocabulary: +40Q → 50Q total

**Script**: `bulk-generate-questions-ai.ts` (already running!)

### Phase 2: Next Week - Template System
**Target**: 500 more questions  
**Focus**: 
- Reading comprehension passages
- Grammar error detection
- Vocabulary matching

**Script**: Create `template-based-generator.ts`

### Phase 3: This Month - Quality Enhancement
- Manual review of AI-generated questions
- Add more diverse topics
- Improve explanations

### Phase 4: Ongoing - Scaling
- Community contributions
- Import public datasets
- Regular AI generation runs

---

## 💡 Alternative: Purchase Pre-Made Question Banks

### Commercial Options
1. **Test Prep Companies**: Buy licensed question banks
2. **Educational Publishers**: Bulk question licensing
3. **Freelance Content Writers**: Commission custom questions

### Cost Estimates
- Freelance writers: ₹50-100 per question
- Licensed banks: ₹10,000-50,000 for 500-1000 questions
- Publishers: Negotiable bulk pricing

### Pros & Cons
✅ High quality  
✅ Professionally vetted  
❌ Expensive (₹25,000-50,000 for what we need)  
❌ May have licensing restrictions  

---

## 🎯 Current Status: AI Generation Running

The AI bulk generation script is currently running and will:
1. Generate ~500 questions automatically
2. Insert them into Turso database
3. Distribute across all needed topics
4. Include proper difficulty levels and explanations

**Estimated completion**: 1.5-2 hours

### Monitor Progress
```bash
# Check background task output
tail -f /private/tmp/claude-501/.../tasks/b4mn8m9q6.output
```

### Verify Results
```bash
# After completion, check question counts
npx tsx -e "
import { createClient } from '@libsql/client';
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});
(async () => {
  const result = await client.execute(
    'SELECT topic_id, COUNT(*) as count FROM english_questions GROUP BY topic_id ORDER BY count DESC'
  );
  console.log(result.rows);
})();
"
```

---

## 🚀 Conclusion

**Recommended Approach**: Use AI generation (Strategy 1) for immediate results, then enhance with templates and community contributions.

**Why AI Generation?**
- ✅ Fast and scalable
- ✅ Already implemented
- ✅ Free (using Gemini Flash)
- ✅ High quality output
- ✅ Running right now!

**Next Steps**:
1. ✅ Let AI generation complete (1-2 hours)
2. ✅ Verify question counts match display
3. ✅ Test questions in production
4. 📋 Plan Phase 2 (template system) if more needed

---

**Status**: Phase 1 in progress 🚀  
**ETA**: 1.5-2 hours for 500 questions
