# 📚 Bulk Question Import System

## Overview

This system allows you to easily import **hundreds or thousands** of verified questions from CSV or JSON files into PrepGenie's question bank.

---

## 🚀 Quick Start

### 1. Prepare Your Questions

Create a CSV or JSON file with your questions. Use the provided templates:

- **CSV Template:** `scripts/sample-questions-template.csv`
- **JSON Template:** `scripts/sample-questions-template.json`

### 2. Run the Import Script

```bash
node scripts/import-questions.js your-questions.csv
```

or

```bash
node scripts/import-questions.js your-questions.json
```

### 3. Review Generated Code

The script creates TypeScript files in `.agents/artifacts/imported-questions/`

### 4. Copy to Question Bank

Copy the generated arrays into `src/lib/question-bank.ts`

---

## 📋 File Format Specifications

### CSV Format

**Columns (in order):**

1. `question` - Question text (required)
2. `option_a` - First option (required)
3. `option_b` - Second option (required)
4. `option_c` - Third option (required)
5. `option_d` - Fourth option (required)
6. `correct_answer` - Correct answer index: 0, 1, 2, or 3 (required)
7. `explanation` - Detailed explanation (required)
8. `difficulty` - easy, medium, or hard (required)
9. `exam_id` - Exam identifier (required, see list below)
10. `subject_id` - Subject identifier (required, see list below)
11. `topic` - Topic name (required)
12. `year` - Source year (optional, e.g., "JEE Main 2024")
13. `source_detail` - Additional source info (optional, e.g., "Shift 1")

**Important CSV Rules:**
- Use quotes for fields containing commas
- First row must be the header
- No empty rows
- Escape quotes inside text with \"\"

**Example:**

```csv
question,option_a,option_b,option_c,option_d,correct_answer,explanation,difficulty,exam_id,subject_id,topic,year,source_detail
"A body of mass 2 kg...","10 m","20 m","30 m","40 m",1,"Using v² = u² - 2gh...",easy,jee-main,jee-physics,Mechanics,JEE Main 2024,Shift 1
```

### JSON Format

**Structure:**

```json
[
  {
    "question": "Question text here",
    "option_a": "First option",
    "option_b": "Second option",
    "option_c": "Third option",
    "option_d": "Fourth option",
    "correct_answer": 0,
    "explanation": "Detailed explanation",
    "difficulty": "medium",
    "exam_id": "jee-main",
    "subject_id": "jee-physics",
    "topic": "Mechanics",
    "year": "JEE Main 2024",
    "source_detail": "Shift 1"
  }
]
```

---

## 🎯 Valid Identifiers

### Exam IDs (`exam_id`)

**Engineering:**
- `jee-main`
- `jee-advanced`
- `gate`

**Medical:**
- `neet-ug`
- `neet-pg`
- `aiims-nursing`
- `aipvt`

**Civil Services:**
- `upsc-cse`
- `uppsc`
- `mppsc`
- `bpsc`
- `rpsc`
- `tnpsc`
- `kpsc`
- `wbpsc`

**Banking:**
- `ibps-po`
- `ibps-clerk`
- `sbi-po`
- `rbi-grade-b`
- `lic-aao`

**SSC:**
- `ssc-cgl`
- `ssc-chsl`

**Railways:**
- `rrb-ntpc`
- `rrb-group-d`
- `rrb-alp`
- `rrb-je`

**Defense:**
- `nda`
- `cds`
- `afcat`
- `indian-navy`
- `indian-army`
- `cisf`
- `up-police`
- `delhi-police`

**MBA:**
- `cat`
- `xat`

**Law:**
- `clat`
- `ailet`

**Teaching:**
- `ctet`
- `ugc-net`
- `htet`
- `uptet`
- `rtet`
- `kvs`
- `dsssb`

**Commerce:**
- `ca-foundation`
- `cs-foundation`

**Design:**
- `nid`
- `nata`
- `nift`

**Others:**
- `nchmct` (Hotel Management)
- `gpat` (Pharmacy)
- `icar-aieea` (Agriculture)
- `isi` (Statistics)
- `postal-assistant`
- `gds`
- `judicial-services`
- `iimc` (Mass Communication)
- `ifs` (Forest Service)

### Subject IDs (`subject_id`)

**JEE Main:**
- `jee-physics`
- `jee-chemistry`
- `jee-maths`

**JEE Advanced:**
- `jee-adv-physics`
- `jee-adv-chemistry`
- `jee-adv-maths`

**NEET:**
- `neet-physics`
- `neet-chemistry`
- `neet-biology`

**UPSC:**
- `upsc-polity`
- `upsc-history`
- `upsc-geography`
- `upsc-economy`
- `upsc-science`

**SSC:**
- `ssc-quant`
- `ssc-reasoning`
- `ssc-english`
- `ssc-gk`

**Banking:**
- `ibps-quant`
- `ibps-reasoning`
- `ibps-english`
- `ibps-ga` (General Awareness)

**CAT:**
- `cat-quant`
- `cat-varc` (Verbal Ability & RC)
- `cat-dilr` (Data Interpretation & LR)

**GATE:**
- `gate-cs` (Computer Science)
- `gate-aptitude`
- `gate-engineering-math`

*(See `src/lib/exams.ts` for complete list)*

---

## 📝 Step-by-Step Guide

### Example: Importing JEE Physics Questions

**Step 1: Create CSV file** (`jee-physics-mechanics-2024.csv`)

```csv
question,option_a,option_b,option_c,option_d,correct_answer,explanation,difficulty,exam_id,subject_id,topic,year,source_detail
"A body of mass 2 kg is thrown vertically upward with an initial velocity of 20 m/s. The maximum height reached is (g = 10 m/s²):","10 m","20 m","30 m","40 m",1,"Using v² = u² - 2gh, at maximum height v = 0. So 0 = (20)² - 2(10)h → h = 400/20 = 20 m.",easy,jee-main,jee-physics,Mechanics,JEE Main 2024,Shift 1
"A block of mass 5 kg is placed on a frictionless surface. A force of 20 N is applied. The acceleration is:","2 m/s²","4 m/s²","5 m/s²","10 m/s²",1,"By Newton's second law, F = ma → a = F/m = 20/5 = 4 m/s².",easy,jee-main,jee-physics,Mechanics,JEE Main 2024,Shift 1
```

**Step 2: Run import**

```bash
node scripts/import-questions.js jee-physics-mechanics-2024.csv
```

**Output:**

```
📂 Reading file: jee-physics-mechanics-2024.csv
📊 Parsing CSV...
✅ Found 2 questions

🔍 Validating questions...
✅ All questions validated successfully!

📦 Grouped into 1 arrays:

   ✅ jee-main → jee-physics → Mechanics: 2 questions
      Saved to: .agents/artifacts/imported-questions/jee_main_jee_physics_Mechanics.ts

✨ Success! 2 questions imported.
```

**Step 3: Review generated file**

Check `.agents/artifacts/imported-questions/jee_main_jee_physics_Mechanics.ts`:

```typescript
const jee_main_jee_physics_Mechanics: BankQuestion[] = [
  {
    question: "A body of mass 2 kg is thrown vertically upward...",
    options: [
      "10 m",
      "20 m",
      "30 m",
      "40 m",
    ],
    correctAnswer: 1,
    explanation: "Using v² = u² - 2gh...",
    difficulty: "easy",
    source: "verified",
    year: "JEE Main 2024",
    sourceDetail: "Shift 1",
  },
  // ... more questions
];

export { jee_main_jee_physics_Mechanics };
```

**Step 4: Copy to question bank**

Open `src/lib/question-bank.ts` and:

1. Copy the array
2. Add to the appropriate section
3. Update the export mapping

```typescript
// In question-bank.ts

// Add the imported array
const jeePhysicsMechanics2024: BankQuestion[] = [
  // ... paste from generated file
];

// Update the questionBank object
const questionBank: { [examId: string]: { [subjectId: string]: { [topic: string]: BankQuestion[] } } } = {
  "jee-main": {
    "jee-physics": {
      "Mechanics": [...jeePhysicsMechanics, ...jeePhysicsMechanics2024], // Merge with existing
      // ... other topics
    },
  },
};
```

**Step 5: Test**

```bash
npm run build
```

---

## 💡 Tips & Best Practices

### 1. **Use Excel/Google Sheets**

- Create questions in spreadsheet software
- Export as CSV
- Easier to manage large datasets

### 2. **Organize by Source**

File naming convention:
- `jee-main-physics-2024.csv`
- `neet-biology-ncert-class12.csv`
- `upsc-history-modern-india.csv`

### 3. **Validate Before Import**

- Check all rows have same number of columns
- Verify correct_answer is 0-3
- Ensure difficulty is lowercase (easy/medium/hard)
- Confirm exam_id and subject_id exist in system

### 4. **Batch Processing**

Import multiple files at once:

```bash
for file in questions/*.csv; do
  node scripts/import-questions.js "$file"
done
```

### 5. **Source Attribution**

Always fill in `year` and `source_detail`:
- `year`: "JEE Main 2024", "NEET 2023", "NCERT Class 12"
- `source_detail`: "Shift 1", "Chapter 1", "Paper 1"

This helps with:
- Legal compliance
- User trust
- Quality tracking

---

## 🔧 Troubleshooting

### Error: "All 4 options are required"

**Problem:** One or more options are empty

**Solution:** Ensure every question has option_a, option_b, option_c, option_d filled

### Error: "correct_answer must be 0, 1, 2, or 3"

**Problem:** Correct answer is not a valid index

**Solution:** Use 0 for option_a, 1 for option_b, 2 for option_c, 3 for option_d

### Error: "exam_id is required"

**Problem:** Missing or invalid exam identifier

**Solution:** Check the valid exam IDs list above and ensure exact match

### CSV Parsing Issues

**Problem:** Columns not aligned

**Solution:**
- Use quotes for fields with commas
- Check for extra commas
- Ensure UTF-8 encoding

---

## 📊 Scale Recommendations

### Target Question Counts

**Per Exam:**
- **JEE Main/Advanced:** 500-1000 questions per subject
- **NEET UG:** 500-1000 questions per subject
- **UPSC CSE:** 300-500 questions per subject
- **Banking/SSC:** 200-300 questions per section
- **Others:** 100-200 questions per exam

**Per Topic:**
- Aim for 20-50 questions per topic
- Mix of easy:medium:hard = 40:40:20

### Source Priority

1. **Previous Year Papers** (last 10 years)
2. **NCERT/Standard Textbooks**
3. **Coaching Institute Materials** (with permission)
4. **AI-generated** (as last resort, manually verified)

---

## 🎓 Where to Get Questions

### Legal & Free Sources

1. **Official Websites:**
   - JEE: https://jeemain.nta.nic.in
   - NEET: https://neet.nta.nic.in
   - UPSC: https://upsc.gov.in

2. **NCERT:**
   - Textbooks (free PDFs): https://ncert.nic.in
   - Exemplar problems

3. **Public Domain:**
   - Questions older than copyright period
   - Creative Commons licensed content

### Paid Sources (Require Permission)

- Coaching institute materials
- Commercial question banks
- Licensed content

**⚠️ Important:** Always respect copyright. Only use questions you have rights to distribute.

---

## 🤝 Contributing

Want to help build the question bank?

1. Pick an exam category
2. Source 100+ questions
3. Format as CSV/JSON
4. Submit via pull request

---

## 📞 Support

Need help?
- Check `scripts/sample-questions-template.csv` for examples
- Run `node scripts/import-questions.js` for usage help
- Review error messages carefully - they're descriptive!

---

**Happy importing! 🎉**
