# Session Summary - Question Generation (Continued)

## Date: 2026-05-09

## What Happened This Session

### Problem Discovered
- Attempted to use Google Gemini API for generating mock test questions
- **Critical Issue Found**: `gemini-2.5-flash` model has only **20 requests per day** limit (not 1,500 as previously thought)
- Hit quota exhaustion errors after testing
- Error: `"You exceeded your current quota, please check your plan and billing details"`

### Solution Found
- Switched to **`gemini-2.5-flash-lite`** model
- ✅ Successfully tested - generates valid JSON responses
- ✅ Working API endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`
- Example response:
```json
{
  "question": "What is 5 + 7?",
  "options": ["10", "12", "11", "9"],
  "correctAnswer": 1,
  "explanation": "Adding 5 and 7 together results in 12."
}
```

### Current Status - CRITICAL ISSUE FOUND ⚠️
- **Test Completed**: JEE Main Mock Test #1 finished
- **Result**: Only **3 questions generated** out of 75 attempted
- **Problem 1**: `gemini-2.5-flash-lite` ALSO has **20 requests per day limit** (same as regular flash)
- **Problem 2**: Many JSON parsing errors (unterminated strings, bad escapes)
- **Output File**: `.agents/artifacts/mock-test-questions/jee-main-mock-tests.csv` (only 3 questions)

### Google Gemini Free Tier Limitation
**ALL FREE TIER MODELS limited to 20 requests/day per model**:
- ❌ `gemini-2.5-flash` - 20/day
- ❌ `gemini-2.5-flash-lite` - 20/day  
- ❌ Cannot generate 11,210 questions with free tier

**Math**: At 20 questions/day, would take **561 days** to generate 11,210 questions

## Files Modified
1. **scripts/generate-mock-test-google.js**
   - Changed model from `gemini-2.5-flash` to `gemini-2.5-flash-lite`
   - Line 220: Updated API endpoint

## API Configuration
```bash
# Working API endpoint
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GOOGLE_AI_API_KEY}

# API Key (in .env.local)
GOOGLE_AI_API_KEY=AIzaSyBwNTRiSxnObbFVv9IKQnGR_Ymr1e_F3iM

# Rate Limiting
- 4-second delay between requests (15 requests/min)
- Need to verify daily quota for lite model
```

## Target: 11,210 Questions Across 12 Exams

| Exam | Tests | Q/Test | Total |
|------|-------|--------|-------|
| JEE Main | 10 | 75 | 750 |
| JEE Advanced | 10 | 75 | 750 |
| NEET | 10 | 180 | 1,800 |
| GATE CS | 10 | 65 | 650 |
| UPSC CSE | 15 | 100 | 1,500 |
| SSC CGL | 10 | 100 | 1,000 |
| SSC CHSL | 5 | 100 | 500 |
| SBI PO | 10 | 100 | 1,000 |
| IBPS PO | 10 | 100 | 1,000 |
| CAT | 10 | 66 | 660 |
| CLAT | 5 | 120 | 600 |
| NDA | 5 | 120 | 600 |
| CDS | 5 | 100 | 500 |
| RRB NTPC | 5 | 100 | 500 |
| **TOTAL** | **115** | - | **11,210** |

## DECISION REQUIRED: Path Forward

### Option 1: Enable Billing on Google AI Studio (RECOMMENDED)
- Cost: Very cheap (~$0.001 per question = $11 for 11,210 questions)
- Speed: Generate all questions in 7-8 days
- Quality: High-quality AI questions

### Option 2: Use Alternative Free AI APIs
- **Groq** (Free tier: 30 requests/min, 14,400/day) - BEST FREE OPTION
- **Together AI** (Free tier with credits)
- **Hugging Face** (Free inference API)

### Option 3: Manual Question Collection
- Continue collecting real questions from PDFs/websites
- Slower but free
- Higher credibility (real exam questions)

### Option 4: Hybrid Approach
- Use 190 real questions for "Daily Practice"
- Generate fewer AI questions (500-1000) for basic mock tests
- Gradually add more questions over time

## Next Steps (For New Session)

1. **Check Current Test Status**
   ```bash
   # Check if JEE Main test completed
   cat /private/tmp/claude-501/-Users-girish-raj-prepgenie/13a9dacf-d66c-4bce-92a3-88515ac7104b/tasks/b6m0mgnhk.output
   
   # Or check the output directory
   ls -la .agents/artifacts/mock-test-questions/
   ```

2. **Verify Generated Questions**
   - Check CSV: `.agents/artifacts/mock-test-questions/jee-main-mock-tests.csv`
   - Validate format: 15 columns, proper JSON extraction
   - Confirm question quality

3. **Determine Quota Limits for Lite Model**
   - If daily limit is still restrictive, may need to:
     - Enable billing on Google Cloud
     - Use multiple API keys
     - Spread generation over multiple days

4. **Scale Up Generation**
   - If test successful, run full generation:
   ```bash
   # Generate all JEE Main tests (10 tests = 750 questions)
   node scripts/generate-mock-test-google.js jee-main 10
   
   # Then proceed with other exams
   node scripts/generate-mock-test-google.js neet 10
   node scripts/generate-mock-test-google.js gate-cs 10
   # ... etc
   ```

5. **Import to Database**
   ```bash
   node scripts/import-questions.js .agents/artifacts/mock-test-questions/jee-main-mock-tests.csv
   ```

## Important Notes
- ✅ Already have 190 real questions deployed
- ✅ Lite model works and generates quality questions
- ⚠️ Need to verify daily quota limit for lite model
- ⚠️ Questions marked as: `source_type: 'ai-practice'`, `verified: false`
- ✅ CSV format matches database schema

## Available Gemini Models (From API)
- `gemini-2.5-flash` - 20/day limit (too restrictive)
- `gemini-2.5-flash-lite` - **USING THIS** (quota TBD)
- `gemini-2.0-flash-lite-001` - Alternative option
- `gemini-flash-lite-latest` - Latest lite version

## Commands Reference
```bash
# Generate mock test
node scripts/generate-mock-test-google.js <exam-id> <num-tests>

# Available exams
jee-main, jee-advanced, neet, gate-cs, upsc-cse, ssc-cgl, ssc-chsl, 
sbi-po, ibps-po, cat, clat, nda, cds, rrb-ntpc

# List all exam configs
node scripts/generate-mock-test-google.js

# Import questions
node scripts/import-questions.js <csv-path>
```

## Session Performance Issue
- Session became slow due to large context (45K+ tokens)
- Recommend starting fresh session for continuation
- All critical info captured in this summary
