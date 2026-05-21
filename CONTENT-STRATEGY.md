# PrepGenie Content Strategy: Unlimited Questions for All Topics

## Core Philosophy
**"Every student matters. Every topic matters. Unlimited practice for all."**

Students should NEVER:
- ❌ Run out of questions to practice
- ❌ Need to go to other websites
- ❌ Find empty or low-stock topics
- ❌ Feel we don't serve their exam/subject

## Current Status (May 17, 2026)
- Database: 25,332 questions
- Coverage: All topics have SOME questions (0 empty topics!)
- Gap: 711 topics still below 100 questions

## MEGA Content Acquisition Strategy

### Strategy 1: Web Scraping (IN PROGRESS - FREE)
**Sources:**
- IndiaBix (Aptitude, Reasoning, Verbal) - 10,000+ questions
- GeeksforGeeks (Programming, CS, Gate) - 50,000+ questions  
- Sanfoundry (Technical MCQs) - 100,000+ questions
- GKToday (Current Affairs, Polity, History) - 20,000+ questions
- BankersAdda (Banking, SSC) - 15,000+ questions

**Current issue:** Need better URL mapping for specific topics
**Solution:** Build comprehensive topic-to-URL database

### Strategy 2: PDF Question Extraction (NOT STARTED - FREE)
**Sources:**
- NCERT textbooks (end-of-chapter questions)
- Previous Year Question papers (all exams, last 10 years)
- Free coaching material PDFs
- Government exam board sample papers

**Approach:** OCR + AI extraction
**Potential:** 100,000+ questions

### Strategy 3: Educational Content → MCQ Conversion (NOT STARTED - FREE)
**Sources:**
- Wikipedia articles (convert to comprehension MCQs)
- Khan Academy transcripts
- NPTEL video transcripts
- MIT OpenCourseWare

**Approach:** AI reads content, generates questions
**Potential:** UNLIMITED questions

### Strategy 4: Question Database APIs (NOT STARTED - FREE/PAID)
**Free APIs:**
- Open Trivia Database (general knowledge)
- Quiz API (various topics)
- Educational institution APIs

**Paid APIs (if needed):**
- Testbook API
- Unacademy content partnerships

### Strategy 5: Continuous AI Generation (IN PROGRESS - FREE with rate limits)
**Current:** DeepSeek free model (rate-limited)
**Target:** 7,880 questions
**Status:** Slow but FREE

**Improvement needed:**
- Multiple free API keys (rotate to avoid rate limits)
- Run on multiple servers
- Queue system for 24/7 generation

### Strategy 6: User-Generated Content (FUTURE)
**Approach:**
- Allow educators to submit questions
- Community contribution with moderation
- Reward system for quality submissions

## Immediate Action Plan (Next 7 Days)

### Day 1-2: Fix Aggressive Scraper
- [ ] Build comprehensive topic-to-URL mapping (500+ sources)
- [ ] Add pagination support (scrape page 1, 2, 3... until empty)
- [ ] Improve AI extraction accuracy
- [ ] Target: +10,000 questions

### Day 3-4: PDF Extraction System
- [ ] Download NCERT PDFs (all subjects, all classes)
- [ ] Download last 10 years PYQs for all exams
- [ ] Build PDF → MCQ extraction pipeline
- [ ] Target: +20,000 questions

### Day 4-5: Content Conversion System
- [ ] Wikipedia → MCQ converter for current affairs/GK topics
- [ ] NPTEL transcripts → Technical MCQs
- [ ] Target: +15,000 questions

### Day 6-7: Multi-Model AI Generation
- [ ] Setup multiple free API keys
- [ ] Rotate between DeepSeek, Gemini, others
- [ ] Queue-based generation system
- [ ] Target: +20,000 questions

**Total Target (7 days): +65,000 questions = 90,000+ total**

## Long-term Vision (3 Months)

### Month 1: Foundation (100K questions)
- Complete all scraping
- Setup continuous generation
- Cover all topics with 100+ questions

### Month 2: Excellence (250K questions)
- Deep coverage (500+ per major topic)
- PDF extraction at scale
- User contribution system

### Month 3: Dominance (500K+ questions)
- Become largest free question bank in India
- Every topic has 1000+ questions
- Students never need another platform

## Success Metrics

### Coverage Metrics
- ✅ **Zero empty topics** (ACHIEVED!)
- 🎯 **All topics >100 questions** (Target: 7 days)
- 🎯 **All topics >500 questions** (Target: 30 days)
- 🎯 **All topics >1000 questions** (Target: 90 days)

### Quality Metrics
- Question accuracy: >95%
- Explanation quality: >90% helpful
- Curriculum alignment: 100%
- Freshness: Current affairs updated daily

### User Trust Metrics
- Students practice only on PrepGenie: >80%
- Average questions per user session: >50
- Return rate: >70%
- Recommendation rate: >60%

## Investment Required

### Time Investment
- Initial setup: 40 hours (1 week intensive)
- Ongoing: 5 hours/week (monitoring, quality checks)

### Money Investment
- **$0 for first 100K questions** (all free sources)
- **$50-100** for premium APIs (optional, only if needed)
- **Total: Essentially FREE**

## Why This Works

1. **Abundant Free Content:** Millions of educational questions exist freely
2. **AI for Scale:** Convert any content to MCQs automatically  
3. **Scraping for Speed:** Harvest what's already available
4. **Generation for Gaps:** AI fills niche topics
5. **Community for Freshness:** Users keep content updated

## Next Steps

**Immediate (Today):**
1. ✅ Keep free AI seeder running (slow but continuous)
2. ✅ Fix aggressive scraper URL mappings
3. ✅ Start PDF extraction pipeline

**This Week:**
1. Reach 50,000 questions
2. All topics >50 questions

**This Month:**
1. Reach 100,000 questions
2. All topics >100 questions
3. Launch user contribution

**Vision:** PrepGenie becomes THE platform for exam practice in India
**Promise:** Unlimited questions, forever FREE for students
