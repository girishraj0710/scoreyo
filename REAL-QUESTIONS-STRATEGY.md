# 🎯 Real Question Bank Strategy for Krakkify

**Goal:** Build a credible, legal, high-quality question bank  
**Approach:** Multi-source hybrid strategy  

---

## 📊 Research Findings: Public Sources

### ✅ **What's Publicly Available:**

1. **UPSC (upsc.gov.in):**
   - Previous year question papers mentioned
   - Cut-off marks available
   - Answer keys published
   - **Status:** Partially public (need to verify exact access)

2. **NTA (nta.ac.in):**
   - Abhyas platform (practice questions)
   - Mock tests available
   - Answer keys after exams
   - **Status:** Some materials available

3. **NCERT:**
   - Exemplar problems (fully public)
   - Chapter-wise questions
   - **Status:** Freely available

4. **Archive.org:**
   - May have archived old papers
   - User-contributed content
   - **Status:** Need to search manually

### ❌ **What's NOT Available:**
- Direct downloadable question banks from NTA/exam boards
- Recent year full papers (protected)
- Official question pools

---

## ⚠️ **CRITICAL: Content Labeling Policy**

### **Non-Negotiable Rules:**

**IF content is AI-generated:**
- ✅ MUST label as "AI-Generated Practice Questions"
- ✅ MUST label as "Exam-Style Questions" or "Similar to Exam Pattern"
- ❌ CANNOT claim "Previous Year Questions"
- ❌ CANNOT claim "Official Questions"

**IF content is from public sources:**
- ✅ CAN label as "UPSC 2015 Question" (if actually from there)
- ✅ MUST cite source: "Source: UPSC Official Website"
- ✅ MUST verify it's truly public domain

**IF mixing sources:**
- ✅ Tag each question with source type
- ✅ Filter UI by source (AI / Official / Community)
- ✅ Be transparent to users

### **Why This Matters:**

**Legal Protection:**
```
"Krakkify offers a mix of:
- AI-Generated exam-style practice questions
- Public domain questions from official sources
- Community-contributed questions

All questions are clearly labeled with their source."
```

This protects you from:
- False advertising claims
- Copyright infringement
- Consumer protection violations
- App store bans

---

## 🚀 **Recommended Strategy: 3-Tier System**

### **Tier 1: AI-Generated Questions** (Immediate, FREE)

**Label:** "AI Practice Questions - Exam Style"

**Approach:**
- Generate high-quality exam-style questions
- Label clearly as AI-generated
- Focus on quality over quantity
- 100-200 questions per exam (curated)

**Implementation:**
```javascript
{
  question: "...",
  source: "ai-generated",
  sourceDetail: "Generated using AI (2026)",
  verified: false,
  examStyle: "JEE Main",
  // ... rest of fields
}
```

**UI Display:**
```
🤖 AI Practice Question - JEE Main Style
Subject: Physics | Topic: Mechanics
Generated: 2026 | Similar to exam pattern
```

---

### **Tier 2: Public Domain Questions** (Manual Collection)

**Label:** "Official Question - [Source] [Year]"

**Sources to Manually Collect:**

1. **UPSC Questions:**
   - Visit upsc.gov.in
   - Download available PDFs
   - Convert to CSV manually
   - Cite: "UPSC CSE 2015"

2. **NCERT Exemplar:**
   - Download from ncert.nic.in
   - Extract questions
   - Cite: "NCERT Class 12 Physics Exemplar"

3. **Sample Papers:**
   - Check exam board websites
   - Download allowed sample papers
   - Cite source properly

**Implementation:**
```javascript
{
  question: "...",
  source: "official",
  sourceDetail: "UPSC CSE Prelims 2015",
  verified: true,
  officialYear: 2015,
  // ... rest of fields
}
```

**UI Display:**
```
✅ Official Question
UPSC CSE 2015 | Prelims GS Paper I
Source: UPSC Official Website
```

---

### **Tier 3: Community Questions** (Future)

**Label:** "Community Contributed - Verified by Experts"

**Approach:**
- User submissions
- Expert review
- Peer voting
- Quality score

---

## 📝 **Immediate Action Plan**

### **Phase 1: This Week**

**1. Update Database Schema:**
```sql
ALTER TABLE questions ADD COLUMN source_type TEXT;
-- Values: 'ai-generated', 'official', 'community', 'ncert'

ALTER TABLE questions ADD COLUMN source_citation TEXT;
-- Values: "UPSC CSE 2015", "AI Generated 2026", etc.

ALTER TABLE questions ADD COLUMN verified BOOLEAN DEFAULT FALSE;
```

**2. Update UI to Show Source:**
- Question card shows source badge
- Filter by source type
- Transparency about AI vs Official

**3. Generate High-Quality AI Questions:**
```bash
# Better prompt, better validation
# 100 questions per exam (curated, not 500)
```

---

### **Phase 2: Next Month**

**1. Manual Collection:**
- Spend 1-2 hours per exam finding public questions
- UPSC: Check official website
- NCERT: Download exemplars
- Archive.org: Search old papers

**2. CSV Import:**
```bash
# Use existing import script
node scripts/import-questions.js upsc-2015.csv
```

**3. Build Mixed Question Bank:**
- 100 AI questions per exam
- 50-100 official questions per exam (if found)
- Clearly labeled

---

### **Phase 3: Ongoing**

**1. User Contributions:**
- Add "Submit Question" feature
- Expert review workflow
- Community voting

**2. Partnerships:**
- Reach out to test prep companies
- Licensing deals
- API partnerships

---

## 🎯 **Honest Marketing Strategy**

### **Free Tier:**
```
Krakkify Free:
✅ 1,000+ AI-Generated Practice Questions
✅ Exam-Style Questions for 18+ Exams
✅ Based on Official Syllabi & Patterns
✅ Quality-Checked & Reviewed

Note: Questions are AI-generated for practice.
Not official previous year questions.
```

### **Pro Tier (Future):**
```
Krakkify Pro:
✅ Everything in Free
✅ Official Previous Year Questions*
✅ NCERT/NCERT Exemplar Questions
✅ Expert-Verified Content
✅ Detailed Performance Analytics

*Where publicly available or licensed
```

---

## 📋 **Tasks for Today**

### **Option A: High-Quality AI Generation** (4 hours)

1. **Improve AI Prompt:**
   - Better quality control
   - More realistic questions
   - Better explanations

2. **Generate Small Batch:**
   - 50 questions per exam (curated)
   - Review each one
   - Keep only good ones

3. **Label Properly:**
   - Update all AI questions with source tags
   - Update UI to show "AI Practice Question"

---

### **Option B: Manual Public Domain Collection** (8 hours)

1. **Research Each Exam:**
   - UPSC: Download what's available
   - JEE/NEET: Check Abhyas platform
   - SSC: Check official site
   - NCERT: Download exemplars

2. **Convert to CSV:**
   - Manual entry (tedious but accurate)
   - Or use OCR on PDFs
   - Verify each question

3. **Import & Label:**
   - Use import script
   - Cite sources properly
   - Mark as verified

---

### **Option C: Hybrid (Recommended)** (6 hours)

1. **AI Questions:** Generate 50 high-quality per exam (2 hours)
2. **NCERT Questions:** Extract from exemplars (2 hours)
3. **UPSC Questions:** Manually collect what's public (2 hours)
4. **Label Everything:** Properly tag all sources (included above)

**Result:** 
- ~900 AI questions (clearly labeled)
- ~200 NCERT questions (official)
- ~100 UPSC questions (official)
- **Total: 1,200 questions (honestly sourced)**

---

## ✅ **What I Can Help With RIGHT NOW:**

1. **Improve AI generation** with better prompts
2. **Build web scraper** for allowed public sources (respecting robots.txt)
3. **Convert PDFs to CSV** if you have downloaded papers
4. **Update database schema** to track sources
5. **Update UI** to show source badges
6. **Build import pipeline** for manual questions

---

## ❌ **What I CANNOT Do:**

1. Scrape copyrighted exam portals
2. Help you misrepresent AI content
3. Bypass paywalls or auth
4. Copy questions from paid apps
5. Violate terms of service

---

## 🎯 **Decision Time:**

Pick your path:

**Path A: All AI (Fast, Labeled Honestly)**
- 900 high-quality AI questions
- Labeled as "AI Practice Questions"
- Ready in 4 hours
- Legally safe

**Path B: Manual Collection (Slow, Official)**
- 200-300 real questions from public sources
- Takes 1-2 weeks
- High quality, verified
- Legally safe

**Path C: Hybrid (Balanced)**
- 900 AI + 200-300 official
- Mix of both
- Ready in 1 week
- Best of both worlds

**What do you choose?** I'll execute immediately. 🚀
