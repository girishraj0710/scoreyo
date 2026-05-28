# PrepGenie Question Scraper Guide

## Overview

The PrepGenie scraper extracts Multiple Choice Questions (MCQs) from **legally accessible, government-published educational resources**, specifically NCERT textbooks and exam board materials.

## Legal Compliance

✅ **What We Scrape (Legal & Ethical)**
- NCERT textbooks (Government of India, openly accessible)
- NCERT Exemplar Problems (public domain educational content)
- Previous year papers from NTA/UPSC/SSC (public after exam)
- State board materials with open access policies
- Creative Commons licensed educational content

❌ **What We DON'T Scrape (Copyright Protected)**
- Commercial test prep materials (Allen, Aakash, Unacademy, etc.)
- Paid question banks or proprietary content
- Copyrighted textbooks from private publishers
- Any content behind paywalls or requiring authentication

## How It Works

### 1. PDF Fetching
```typescript
// NCERT URLs are predictable and publicly accessible
const url = 'https://ncert.nic.in/textbook/pdf/leph101.pdf';
// Class 12 (le) Physics (ph) Chapter 01
```

### 2. AI-Powered Extraction
- Uses OpenRouter (Gemini) to intelligently parse PDF text
- Identifies MCQ patterns, options, answers, and explanations
- Handles complex formatting, equations, and multi-language content
- More reliable than regex for educational content

### 3. Data Validation
- Ensures exactly 4 options per question
- Validates correct answer format
- Cleans formatting and normalizes text
- Filters out non-MCQ content

### 4. Database Storage
- Saves to `verified_questions` table in Turso
- Tags with source, subject, topic, difficulty
- Links to relevant exams (JEE, NEET, etc.)

## Usage

### Option 1: CLI Script (Recommended)

```bash
# Install dependencies first (if not done)
npm install

# Scrape a single chapter
npm run scrape -- --subject physics --class 12 --chapter 1

# Scrape all chapters of a subject
npm run scrape -- --subject chemistry --class 11 --all

# Test the extraction on sample text
npm run scrape -- --test

# Available subjects: physics, chemistry, biology, mathematics
# Available classes: 11, 12
```

### Option 2: API Endpoint (For Automation)

```bash
# Scrape single chapter
curl -X POST http://localhost:3000/api/admin/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "action": "scrape-chapter",
    "subject": "physics",
    "class": 12,
    "chapter": 1,
    "adminKey": "your-secret-key"
  }'

# Scrape all chapters
curl -X POST http://localhost:3000/api/admin/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "action": "scrape-all",
    "subject": "chemistry",
    "class": 11,
    "adminKey": "your-secret-key"
  }'

# Test extraction
curl -X POST http://localhost:3000/api/admin/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "action": "test-extraction",
    "adminKey": "your-secret-key"
  }'

# Get statistics
curl "http://localhost:3000/api/admin/scrape?adminKey=your-secret-key"
```

## Configuration

### Environment Variables (.env.local)

```env
# Required for AI extraction
OPENROUTER_API_KEY=sk-or-v1-...

# Required for database storage
TURSO_DATABASE_URL=libsql://prepgenie-....turso.io
TURSO_AUTH_TOKEN=eyJ...

# Required for API security
SCRAPER_ADMIN_KEY=your-secure-random-key-here
```

### Rate Limiting

The scraper includes built-in rate limiting to be respectful to NCERT servers:
- 3 second delay between chapters
- Failed requests are logged, not retried aggressively
- Caches already-scraped content

## Output Format

Questions are saved with this structure:

```typescript
{
  question: "What is the SI unit of force?",
  options: [
    "Joule",
    "Watt", 
    "Newton",
    "Pascal"
  ],
  correctAnswer: 2, // Index 0-3 (C = Newton)
  explanation: "Newton (N) is the SI unit of force, defined as kg⋅m/s²",
  subject: "physics",
  topic: "Chapter 1",
  difficulty: "easy",
  source: "NCERT Class 12 Physics - Chapter 1",
  examRelevance: ["JEE", "NEET"]
}
```

## NCERT Coverage

### Physics
- **Class 11**: 15 chapters (Mechanics, Thermodynamics, Waves)
- **Class 12**: 15 chapters (Electromagnetism, Optics, Modern Physics)
- **Exam Relevance**: JEE Main, JEE Advanced, NEET

### Chemistry
- **Class 11**: 16 chapters (Physical, Organic, Inorganic basics)
- **Class 12**: 16 chapters (Solutions, Electrochemistry, Organic)
- **Exam Relevance**: JEE, NEET

### Biology
- **Class 11**: 15 chapters (Diversity, Cell Biology, Plant Physiology)
- **Class 12**: 15 chapters (Reproduction, Genetics, Evolution, Ecology)
- **Exam Relevance**: NEET

### Mathematics
- **Class 11**: 13 chapters (Algebra, Trigonometry, Calculus intro)
- **Class 12**: 13 chapters (Calculus, Vectors, Probability)
- **Exam Relevance**: JEE

## Expected Results

Based on NCERT Exemplar structure:
- **Per Chapter**: 10-30 MCQs (varies by chapter)
- **Total Class 12 Physics**: ~250-400 questions
- **Total All Subjects**: 2,000-3,000 quality MCQs

## Troubleshooting

### "PDF not found" error
- NCERT may have restructured URLs
- Check https://ncert.nic.in/textbook.php for current links
- Update `getNCERTUrl()` function if needed

### "No MCQs found"
- Some chapters don't have MCQ sections
- Try NCERT Exemplar books specifically (separate PDFs)
- Not all chapters have equal question distribution

### "AI extraction failed"
- Check OPENROUTER_API_KEY is valid
- Verify API quota hasn't been exceeded
- Try with `--test` flag first to validate setup

### Rate limiting
- If scraping fails repeatedly, increase delay in code
- NCERT servers may temporarily block rapid requests
- Run during off-peak hours (late night IST)

## Future Enhancements

1. **OCR for Diagrams**: Extract questions with figures using vision models
2. **Multi-language**: Extract Hindi/regional language questions
3. **Answer Verification**: Cross-check extracted answers
4. **Incremental Updates**: Track which chapters are already scraped
5. **NTA Paper Scraper**: Automate previous year paper extraction
6. **State Boards**: Add support for Maharashtra, Tamil Nadu boards

## Contributing

To add new sources:

1. Verify content is **legally accessible** (government/public domain)
2. Add URL patterns to appropriate scraper file
3. Update AI prompt for source-specific formatting
4. Add tests with sample extractions
5. Document in this guide

## License & Attribution

- **NCERT Content**: Published by Government of India, accessible under educational use
- **Scraper Code**: MIT License (PrepGenie project)
- **Attribution**: All questions maintain `source` field crediting NCERT

## Support

For issues or questions:
- GitHub Issues: https://github.com/girishraj0710/prepgenie/issues
- Email: support@prepgenie.co.in
