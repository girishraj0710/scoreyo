# AI Provider Pricing Research for Bulk Question Generation

**Date**: May 9, 2026  
**Task**: Generate 11,210 multiple-choice questions with explanations  
**Current Setup**: Google Gemini Flash-8B via OpenRouter  
**Current Cost**: $1.39

---

## Executive Summary

After researching 10+ AI providers, **2 providers can generate all 11,210 questions for FREE**:

1. **Groq** (Llama 3.1 8B) - $0.00, 6-7 hours
2. **Together AI** (Llama 3.1 8B) - $0.00 with $5 free credit, 20 minutes

Both use the same high-quality Llama 3.1 8B model and provide excellent results for MCQ generation.

---

## Complete Pricing Comparison

### Assumptions
- **Total questions**: 11,210
- **Output tokens**: 750/question × 11,210 = 8,407,500 tokens (8.4M)
- **Input tokens**: 300/question × 11,210 = 3,363,000 tokens (3.4M)
- **Total tokens**: ~11.8M

### Full Provider List (Ranked by Cost)

| Rank | Provider | Model | Cost/1M (In/Out) | Total Cost | Free Tier | Time | Quality |
|------|----------|-------|------------------|------------|-----------|------|---------|
| 1 | **Groq** | Llama 3.1 8B Instant | $0.05/$0.08 | **$0.00*** | 14.4k/day | 6-7h | Excellent |
| 2 | **Together AI** | Llama 3.1 8B Turbo | $0.06/$0.06 | **$0.00*** | $5 credit | 20min | Excellent |
| 3 | **OpenRouter** | Llama 3.2 3B | $0.06/$0.06 | **$0.70** | Limited | 30-60min | Good |
| 4 | **Together AI** | (paid) | $0.06/$0.06 | $0.71 | - | 20min | Excellent |
| 5 | **Groq** | (paid) | $0.05/$0.08 | $0.84 | - | 6-7h | Excellent |
| 6 | **Google AI** | Flash-8B | $0.0375/$0.15 | $1.39 | 1.5k/day | 8min | Excellent |
| 7 | **Replicate** | Llama 3.1 8B | $0.05/$0.25 | $2.27 | None | Moderate | Very Good |
| 8 | **AI21** | Jamba 1.5 Mini | $0.20/$0.20 | $2.36 | Trial | Moderate | Good |
| 9 | **Google AI** | Flash | $0.075/$0.30 | $2.78 | 1.5k/day | 8min | Excellent |
| 10 | **DeepSeek** | Chat | $0.14/$0.28 | $2.83 | None | Moderate | Very Good |
| 11 | **Mistral** | 7B | $0.25/$0.25 | $2.95 | Trial | Moderate | Very Good |
| 12 | **OpenAI** | GPT-4o-mini | $0.15/$0.60 | $5.55 | None | 23min | Excellent |
| 13 | **Cohere** | Command R | $0.15/$0.60 | $5.55 | Trial | Moderate | Very Good |
| 14 | **HuggingFace** | Dedicated | ~$0.60/hr | $7-10 | 1k/hr | Hours | Varies |
| 15 | **OpenAI** | GPT-3.5-Turbo | $0.50/$1.50 | $14.30 | None | 23min | Good |
| 16 | **Anthropic** | Claude 3.5 Haiku | $0.80/$4.00 | $36.32 | None | 20min | Excellent |
| 17 | **Cohere** | Command R+ | $2.50/$10.00 | $92.50 | None | Moderate | Excellent |

*Free tier fully covers the job

---

## TOP 3 RECOMMENDATIONS

### 🥇 1. GROQ - Llama 3.1 8B Instant (BEST VALUE)

**Cost**: $0.00 (Free tier covers entire job)

**Pros**:
- Free tier: 14,400 requests/day (11,210 needed - FULLY COVERED)
- No credit card required
- Excellent quality (Llama 3.1 8B)
- 800+ tokens/second inference speed
- No time limit on free tier
- Proven reliability

**Cons**:
- Rate limit: 30 RPM (takes 6-7 hours)
- Requires overnight run

**API Setup**:
```bash
# Sign up: https://console.groq.com
npm install groq-sdk
export GROQ_API_KEY="gsk_..."
```

**Code Example**:
```javascript
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateQuestion(topic) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are an expert MCQ generator..." },
      { role: "user", content: `Generate question on: ${topic}` }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });
  return completion.choices[0].message.content;
}

// Rate limiting: 30 RPM = 1 request every 2 seconds
async function generateWithRateLimit(topics) {
  for (let i = 0; i < topics.length; i++) {
    const result = await generateQuestion(topics[i]);
    console.log(`Progress: ${i+1}/${topics.length}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}
```

**Time Estimate**: 6-7 hours (374 minutes at 30 RPM)

---

### 🥈 2. TOGETHER AI - Llama 3.1 8B Turbo (FASTEST FREE)

**Cost**: $0.00 (Uses $5 free signup credit)

**Pros**:
- $5 free credit (covers $0.71 total cost)
- No credit card required for free tier
- Excellent quality (Llama 3.1 8B)
- Rate limit: 600 RPM (very fast)
- Complete in 20 minutes
- Same model as Groq

**Cons**:
- Free credit is one-time (future runs would cost $0.71)
- Need to sign up for credit

**API Setup**:
```bash
# Sign up: https://api.together.xyz
npm install together-ai
export TOGETHER_API_KEY="..."
```

**Code Example**:
```javascript
const Together = require("together-ai");
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

async function generateQuestion(topic) {
  const response = await together.chat.completions.create({
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    messages: [
      { role: "system", content: "You are an expert MCQ generator..." },
      { role: "user", content: `Generate question on: ${topic}` }
    ],
    max_tokens: 1000,
    temperature: 0.7,
  });
  return response.choices[0].message.content;
}

// Batch processing (600 RPM allows parallel requests)
async function generateInBatches(topics, batchSize = 50) {
  const results = [];
  for (let i = 0; i < topics.length; i += batchSize) {
    const batch = topics.slice(i, i + batchSize);
    const promises = batch.map(topic => generateQuestion(topic));
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    console.log(`Completed ${i + batch.length}/${topics.length}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return results;
}
```

**Time Estimate**: 20 minutes (11,210 requests at 600 RPM)

---

### 🥉 3. OPENROUTER - Llama 3.2 3B (CHEAPEST PAID)

**Cost**: $0.70

**Pros**:
- Absolute cheapest paid option
- Fast processing (200-500 RPM)
- Good quality for MCQs
- Already familiar (current provider)

**Cons**:
- Smaller 3B model (vs 8B in Groq/Together)
- May need more prompt engineering
- Costs $0.70 (not free)

**API Setup**:
```bash
# Sign up: https://openrouter.ai
export OPENROUTER_API_KEY="sk-or-..."
```

**Code Example**:
```javascript
async function generateQuestion(topic) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.2-3b-instruct",
      messages: [
        { role: "system", content: "You are an expert MCQ generator..." },
        { role: "user", content: `Generate question on: ${topic}` }
      ],
      max_tokens: 1000,
    })
  });
  return await response.json();
}
```

**Time Estimate**: 30-60 minutes

---

## Quality Comparison

### Tier 1 (Excellent) - Best for MCQ Generation
- ✅ **Groq Llama 3.1 8B** (RECOMMENDED)
- ✅ **Together AI Llama 3.1 8B** (RECOMMENDED)
- Google Gemini Flash-8B (current setup)
- OpenAI GPT-4o-mini
- Anthropic Claude 3.5 Haiku

### Tier 2 (Very Good)
- Qwen 2.5 7B
- Gemma 2 9B
- DeepSeek Chat
- Mistral 7B

### Tier 3 (Good - needs more prompt engineering)
- OpenRouter Llama 3.2 3B (smaller model)

---

## Cost vs Time vs Quality Analysis

```
GROQ:
- Cost: $0.00 ✅✅✅
- Time: 6-7h ⚠️
- Quality: Excellent ✅✅

TOGETHER AI:
- Cost: $0.00 ✅✅✅
- Time: 20min ✅✅✅
- Quality: Excellent ✅✅

OPENROUTER:
- Cost: $0.70 ✅✅
- Time: 30-60min ✅
- Quality: Good ✅

CURRENT (Gemini):
- Cost: $1.39 ✅
- Time: 8min ✅✅✅
- Quality: Excellent ✅✅
```

---

## Savings Analysis

### Compared to Current Setup (Gemini $1.39)

- **Groq**: Save $1.39 (100% savings) ⭐
- **Together AI**: Save $1.39 (100% savings) ⭐
- **OpenRouter**: Save $0.69 (50% savings)

### Compared to Premium Options

- **vs OpenAI GPT-4o-mini ($5.55)**: Save $5.55 with Groq/Together
- **vs Anthropic Claude ($36.32)**: Save $36.32 with Groq/Together
- **vs Cohere Command R+ ($92.50)**: Save $92.50 with Groq/Together

---

## Rate Limit Considerations

| Provider | Rate Limit | Time for 11,210 | Batching Strategy |
|----------|------------|-----------------|-------------------|
| Groq | 30 RPM | 6-7 hours | 2-second delays |
| Together AI | 600 RPM | 20 minutes | 50-request batches |
| OpenRouter | 200-500 RPM | 30-60 minutes | 10-request batches |
| Google Gemini | 1,500 RPM | 8 minutes | 100-request batches |
| OpenAI | 500 RPM | 23 minutes | 50-request batches |

---

## Implementation Recommendations

### Scenario 1: Maximum Savings (No Budget)
**Use GROQ**
- Cost: $0.00
- Setup time: 5 minutes
- Run time: 6-7 hours (overnight)
- Quality: Excellent

### Scenario 2: Speed + Free
**Use TOGETHER AI**
- Cost: $0.00 (free credit)
- Setup time: 5 minutes
- Run time: 20 minutes
- Quality: Excellent

### Scenario 3: Keep Current Setup
**Stay with Gemini**
- Cost: $1.39 (already low)
- Setup time: 0 (no changes)
- Run time: 8 minutes
- Quality: Excellent

---

## Migration Steps (to Groq)

1. **Sign up**: https://console.groq.com
2. **Get API key** from dashboard
3. **Install SDK**: 
   ```bash
   npm install groq-sdk
   ```
4. **Update environment**:
   ```bash
   export GROQ_API_KEY="gsk_..."
   ```
5. **Update code**: Modify `src/lib/quiz-generator.ts` to use Groq SDK
6. **Add rate limiting**: Implement 2-second delays
7. **Test**: Generate 10 questions first
8. **Run full batch**: 11,210 questions overnight

**Estimated effort**: 30-60 minutes of development

---

## Other Providers Considered

### Not Recommended
- **Anthropic Claude**: Too expensive ($36.32)
- **Cohere Command R+**: Way too expensive ($92.50)
- **GPT-3.5 Turbo**: Expensive and lower quality ($14.30)
- **Hugging Face Free**: Too slow (11+ hours)

### Honorable Mentions
- **Replicate Llama 3.1 8B**: $2.27 (good quality, moderate price)
- **DeepSeek Chat**: $2.83 (decent option)
- **Mistral 7B**: $2.95 (reliable)

---

## Key Insights

1. **Groq's free tier is generous**: 14,400 requests/day easily covers 11,210 questions
2. **Together AI's $5 credit is perfect**: Exactly covers the $0.71 cost
3. **Llama 3.1 8B is excellent**: Both Groq and Together use this proven model
4. **Time vs Cost trade-off**: Groq is free but slow; Together is free and fast (one-time)
5. **Current Gemini setup is already cheap**: At $1.39, switching saves money but requires work

---

## Final Recommendation

**For this specific job (11,210 questions):**

### If time is not critical:
➡️ **Use GROQ** (free, excellent quality, run overnight)

### If you need it fast:
➡️ **Use TOGETHER AI** (free with credit, 20 minutes)

### If you want to avoid setup:
➡️ **Keep current Gemini** ($1.39, 8 minutes)

All three options are excellent choices depending on your priorities!

---

## Resources

- **Groq Console**: https://console.groq.com
- **Together AI**: https://api.together.xyz
- **OpenRouter**: https://openrouter.ai
- **Groq SDK Docs**: https://www.npmjs.com/package/groq-sdk
- **Together SDK Docs**: https://www.npmjs.com/package/together-ai

---

**Research Date**: May 9, 2026  
**Researched by**: Claude Code Agent  
**Pricing sources**: Official provider documentation (as of May 2026)
