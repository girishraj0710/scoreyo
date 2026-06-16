# Krakkify Content Generation System

**Last Updated:** 2026-06-16  
**Purpose:** Central hub for all content generation workflows

---

## 📚 Documentation Index

### 1. **Question Generation** → `QUESTION-GENERATION-GUIDE.md`
Generate MCQ questions for all 74+ exams
- English questions (parts of speech, grammar, vocabulary, IELTS)
- Main exam questions (JEE, NEET, UPSC, SSC, Banking, CAT, GATE)
- Validation rules and quality control
- Bulk generation commands
- Database insertion

### 2. **Study Material Generation** → `STUDY-MATERIAL-GENERATION-GUIDE.md`
Generate comprehensive study materials for all topics
- 6 section types (Introduction, Core Concepts, Key Points, Common Mistakes, Examples, Practice)
- Flashcard format for Core Concepts
- Markdown formatting rules
- AI prompt templates
- Frontend rendering components

### 3. **Original Formatting Reference** → `STUDY-CONTENT-GENERATION-CHECKLIST.md`
Historical reference for format decisions
- Markdown vs JSON comparison
- Initial formatting rules
- Issues encountered and fixed
- Kept for reference only

---

## 🚀 Quick Start Workflows

### Generate Questions for a Topic

```bash
# 1. Edit the generation script
code scripts/generate-questions.ts

# 2. Run generation
npm run generate:questions

# 3. Review output
cat scripts/output/questions-2026-06-16.json

# 4. Insert into database (Supabase SQL Editor)
# Copy SQL from output file
```

### Generate Study Material for a Topic

```bash
# 1. Edit the generation script
code scripts/generate-study-material.ts

# 2. Run generation
npm run generate:study

# 3. Review output
cat scripts/output/study-materials-2026-06-16/topic-name.json

# 4. Insert into database (Supabase dashboard)
```

---

## 📊 Current Status

### Questions Generated
- ✅ English Grammar: 40 questions (Parts of Speech - sample set)
- ⏳ English Grammar: 360 more questions needed (400 total target)
- ⏳ IELTS: 0/500 questions
- ⏳ JEE Main: 0/3000 questions
- ⏳ NEET: 0/3000 questions
- ⏳ UPSC: 0/2000 questions

**Total: 40/10,000+ target**

### Study Materials Generated
- ✅ Parts of Speech: Complete (all 6 sections)
- ⏳ Other English topics: 0/40 topics
- ⏳ JEE Main Physics: 0/30 topics
- ⏳ NEET Biology: 0/40 topics
- ⏳ UPSC GS: 0/50 topics

**Total: 1/200+ target**

---

## 🎯 Priority Roadmap

### Phase 1: English Foundation (Weeks 1-2)
**Goal:** Complete English grammar foundation

**Questions:**
- [ ] Parts of Speech: 360 more questions (400 total)
- [ ] Articles: 80 questions
- [ ] Present Simple: 100 questions
- [ ] Present Continuous: 100 questions
- [ ] Past Simple: 100 questions
- [ ] Total: 740 questions

**Study Materials:**
- [ ] Articles (A, An, The)
- [ ] Present Simple Tense
- [ ] Present Continuous Tense
- [ ] Past Simple Tense
- [ ] Future Simple Tense
- [ ] Present Perfect Tense
- [ ] Total: 6 topics

### Phase 2: IELTS Complete (Weeks 3-4)
**Goal:** Full IELTS preparation content

**Questions:**
- [ ] Reading Comprehension: 200 questions
- [ ] Vocabulary: 150 questions
- [ ] Grammar: 150 questions
- [ ] Total: 500 questions

**Study Materials:**
- [ ] IELTS Reading Strategies
- [ ] IELTS Writing Task 1
- [ ] IELTS Writing Task 2
- [ ] IELTS Speaking Parts 1-3
- [ ] Total: 4 topics

### Phase 3: JEE Main Physics (Weeks 5-8)
**Goal:** Complete JEE Main Physics coverage

**Questions:**
- [ ] Mechanics: 300 questions
- [ ] Thermodynamics: 200 questions
- [ ] Electromagnetism: 400 questions
- [ ] Optics: 200 questions
- [ ] Modern Physics: 200 questions
- [ ] Total: 1300 questions

**Study Materials:**
- [ ] All 30 Physics topics
- [ ] Each with formulas, examples, practice

### Phase 4: Scale to All Exams (Weeks 9+)
- JEE Advanced, NEET, UPSC, SSC, Banking, CAT, GATE
- 10,000+ questions target
- 200+ study materials target

---

## 🛠️ Tools and Scripts

### Generation Scripts
```
/scripts/
  generate-questions.ts           # Main question generator
  generate-study-material.ts      # Main study material generator
  validate-questions.ts           # Question validation
  validate-study-materials.ts     # Study material validation
  insert-questions.ts             # Bulk question insertion
  insert-study-materials.ts       # Bulk study material insertion
  restore-sample-questions.sql    # Emergency question restore
```

### Output Directories
```
/scripts/output/
  questions-YYYY-MM-DD.json       # Generated questions
  /study-materials-YYYY-MM-DD/    # Generated study materials
    topic-1.json
    topic-2.json
    ...
```

### NPM Commands
```bash
npm run generate:questions          # Generate questions
npm run generate:study              # Generate study materials
npm run validate:questions          # Validate question format
npm run validate:study              # Validate study material format
npm run insert:questions            # Bulk insert questions
npm run insert:study                # Bulk insert study materials
```

---

## 📝 Content Standards

### Questions
- ✅ Question text >= 20 characters
- ✅ Exactly 4 options
- ✅ Explanation >= 30 characters
- ✅ Valid difficulty (easy/medium/hard)
- ✅ No placeholders or incomplete text
- ✅ Correct answer is one of the 4 options

### Study Materials
- ✅ All 6 sections present (Introduction, Core Concepts, Key Points, Common Mistakes, Examples, Practice)
- ✅ Core Concepts formatted as flashcards (## headers)
- ✅ Markdown formatting correct (**, ##, -, ---)
- ✅ 5-10 flashcards per Core Concepts
- ✅ 5-10 common mistakes
- ✅ 8-12 practice problems

---

## 🔍 Quality Control

### Pre-Generation Checks
- [ ] Topic definitions verified in codebase
- [ ] AI prompt template tested
- [ ] Validation functions ready
- [ ] Output directory exists

### Post-Generation Checks
- [ ] All items pass validation
- [ ] 10% manual review completed
- [ ] No duplicates
- [ ] Formatting correct
- [ ] Ready for insertion

### Post-Insertion Checks
- [ ] Database count verified
- [ ] Frontend rendering tested
- [ ] All sections display correctly
- [ ] Navigation works
- [ ] Dark mode compatible

---

## 📞 Support

### Issues?
1. Check the relevant guide first (Question or Study Material)
2. Review troubleshooting section
3. Check file locations
4. Verify database schema

### Need to Regenerate?
- Questions accidentally deleted: Use `restore-sample-questions.sql`
- Study materials lost: Regenerate from scripts
- Format issues: Check validation rules

---

## 📈 Progress Tracking

### Weekly Targets
- **Week 1:** 500 questions + 10 study materials
- **Week 2:** 500 questions + 10 study materials
- **Week 3:** 500 questions + 10 study materials
- **Week 4:** 500 questions + 10 study materials

### Monthly Targets
- **Month 1:** 2000 questions + 40 study materials (English complete)
- **Month 2:** 3000 questions + 50 study materials (JEE Main Physics + IELTS)
- **Month 3:** 5000 questions + 60 study materials (NEET Biology + UPSC GS)

### By End of Q3 2026
- **10,000+ questions** across all 74 exams
- **200+ study materials** covering all major topics
- **Full coverage** for top 20 exams

---

## 🎓 Learning Resources

### For Content Creators
- Study the existing sample question (40Q in Parts of Speech)
- Review the existing study material (Parts of Speech)
- Follow validation rules strictly
- Test on frontend before bulk generation

### For Developers
- Read both generation guides completely
- Understand database schemas
- Test validation functions
- Review frontend components

---

**Remember:**
- Quality > Quantity
- Validate before inserting
- Test on frontend
- Follow formatting rules
- Keep documentation updated

---

**Quick Links:**
- [Question Generation Guide](QUESTION-GENERATION-GUIDE.md)
- [Study Material Generation Guide](STUDY-MATERIAL-GENERATION-GUIDE.md)
- [Original Format Checklist](STUDY-CONTENT-GENERATION-CHECKLIST.md)
- [Project Instructions](CLAUDE.md)
