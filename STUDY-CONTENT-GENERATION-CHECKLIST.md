# Study Content Generation Checklist

**Purpose:** Ensure all future study materials are generated correctly the first time, avoiding the issues we fixed in June 2026.

---

## Before Generating Content

### 1. Choose the Right Format

| Topic Type | Format | Reason |
|------------|--------|--------|
| Grammar, English, Languages | **Markdown** | Simple concepts, rules, examples |
| Physics, Chemistry, Math | **JSON** | Complex structure, formulas, detailed examples |
| Biology (with processes) | **JSON** | Multi-step processes, diagrams needed |
| History, Geography | **Markdown** | Narrative content, dates, events |
| Current Affairs | **Markdown** | Simple facts, bullet points |

### 2. Study the Format Guide

**MUST READ:** `STUDY-MATERIALS-FORMAT-GUIDE.md`

**Key sections:**
- Markdown section structure (what levels to use)
- JSON section types (subsections, items, mistakes, points, problems)
- Required keywords (`**Definition:**`, `**Rules:**`, `**Examples:**`)
- Practice Problems format (exact regex expectations)

---

## Markdown Format Checklist

### ✅ Section Headings

```markdown
# What is [Topic]?           ← Level 1 (top sections)

# Core Concepts              ← Level 1 (main section)
### Concept Name             ← Level 3 (individual concepts)

## Practice Problems         ← Level 2 (practice section)
### Beginner Level           ← Level 3 (difficulty levels)
```

**❌ NEVER use:**
- `## Concept Name` (wrong level)
- `# Practice Problems` (too high)
- `## Beginner Level` (wrong level)
- `### . Concept Name` (dot after number)

### ✅ Core Concepts Structure

**Every concept MUST have at least ONE of these:**

```markdown
### Concept Name

**Definition:** [One clear sentence]

**Rules:**
1. **Rule Name** explanation text
2. **Another Rule** explanation text

**Examples:**
-  CORRECT: "Example sentence"
-  INCORRECT: "Wrong sentence" → WHY: Explanation
```

**❌ NEVER create sections with:**
- Only tables (will render blank)
- Only comparison charts (will render blank)
- Lists without Definition/Rules/Examples keywords

### ✅ Practice Problems Format

```markdown
## Practice Problems

### Beginner Level (30%)

1. **Question text here:** "Context sentence" (options if MCQ)  **Answer:** Correct answer - Explanation of why

2. **Another question:**  **Answer:** Answer - Explanation

### Intermediate Level (50%)

3. **Question text:**  **Answer:** Answer - Explanation
```

**CRITICAL:**
- Use `##` for Practice Problems header
- Use `###` for difficulty levels
- NO line breaks between question and `**Answer:**`
- Questions MUST be numbered (1. 2. 3.)
- Answer and explanation separated by ` - ` (space-dash-space)

### ✅ What NOT to Include

**❌ Emojis in headings:**
```markdown
# Core Concepts 📚    ← Remove emoji
```

**❌ Dots after section numbers:**
```markdown
### . Nouns    ← Remove dot
```

**❌ Summary tables as standalone sections:**
Tables can be INSIDE a section with Definition/Rules, but not the ONLY content.

---

## JSON Format Checklist

### ✅ File Structure

```json
{
  "subject_id": "physics",
  "topic_id": "thermodynamics",
  "title": "Topic Name - Complete Guide",
  "subtitle": "Brief description",
  "difficulty_level": "beginner|intermediate|advanced",
  "estimated_time_minutes": 45,
  "curriculum_standard": "NCERT Class 11 Physics",
  "content": {
    "sections": [...]
  }
}
```

### ✅ Section Types (Choose ONE per section)

#### 1. Simple Content Section
```json
{
  "id": "introduction",
  "title": "What is Thermodynamics?",
  "content": "Markdown text with **bold**, bullet points, code blocks",
  "order": 1
}
```

**Use for:** Introduction, overview, simple concepts

---

#### 2. Subsections (Laws, Processes)
```json
{
  "id": "laws",
  "title": "The Four Laws of Thermodynamics",
  "subsections": [
    {
      "title": "First Law: Energy Conservation",
      "content": "**Statement:** Energy cannot be...\n\n**Mathematical Form:**\n```\nΔU = Q - W\n```",
      "examples": [
        {
          "title": "Example 1: Heating a Gas",
          "problem": "100 J of heat is added...",
          "solution": "**Given:**\n- Q = +100 J\n\n**Apply First Law:**\n```\nΔU = Q - W = 100 - 0 = 100 J\n```",
          "key_insight": "At constant volume: ΔU = Q"
        }
      ]
    }
  ],
  "order": 2
}
```

**Use for:** Multiple related concepts (laws, processes, types)

---

#### 3. Items (Formulas, Reference Lists)
```json
{
  "id": "formulas",
  "title": "Essential Formulas",
  "items": [
    {
      "formula": "ΔU = Q - W",
      "name": "First Law of Thermodynamics",
      "explanation": "Change in internal energy = Heat absorbed - Work done",
      "when_to_use": "ALWAYS - fundamental equation",
      "units": "Joules (J)"
    }
  ],
  "order": 4
}
```

**Use for:** Formula lists, reference tables, key concepts list

---

#### 4. Mistakes Array
```json
{
  "id": "common-mistakes",
  "title": "Common Mistakes & How to Avoid Them",
  "mistakes": [
    {
      "mistake": "Confusing signs of Q and W",
      "why_wrong": "Students often mix up when Q and W are positive vs negative",
      "correct_approach": "**Remember:**\n- Q > 0: Heat INTO system\n- W > 0: Work BY system"
    }
  ],
  "order": 5
}
```

**Use for:** Common errors, traps, misconceptions

---

#### 5. Points Array (Quick Revision)
```json
{
  "id": "quick-revision",
  "title": "Quick Revision Points",
  "points": [
    "First Law: ΔU = Q - W (energy conservation)",
    "Second Law: Heat flows hot → cold",
    "Isothermal: T constant, ΔU = 0, Q = W"
  ],
  "order": 7
}
```

**Use for:** Quick reference, key takeaways, revision lists

---

#### 6. Problems Array (Practice)
```json
{
  "id": "practice",
  "title": "Practice Problems (Try Before Quiz!)",
  "problems": [
    {
      "question": "A gas absorbs 500 J and does 300 J work. Find ΔU.",
      "hint": "Use First Law: ΔU = Q - W",
      "answer": "200 J",
      "explanation": "**Solution:**\n\nGiven:\n- Q = +500 J\n- W = +300 J\n\nApply First Law:\n```\nΔU = 500 - 300 = 200 J\n```"
    }
  ],
  "order": 8
}
```

**Use for:** Practice questions with step-by-step solutions

---

## Pre-Generation Validation

### Before Writing Content:

1. **Decide format:** Markdown or JSON?
2. **List all sections:** What is, Core Concepts, Processes, Formulas, Mistakes, Revision, Practice
3. **Choose section types:** For each section, which structure? (content/subsections/items/mistakes/points/problems)
4. **Check hierarchy:** Are heading levels correct?
5. **Verify keywords:** Does every Core Concept have Definition/Rules/Examples?

### After Writing Content:

1. **Run these checks:**
   ```bash
   # Check heading levels
   grep "^#" your-file.md
   
   # Verify structure keywords
   grep -E "\*\*(Definition|Rules|Examples):\*\*" your-file.md
   
   # Check practice problems hierarchy
   grep -A 1 "## Practice Problems" your-file.md
   ```

2. **Manual review:**
   - [ ] No emojis in headings
   - [ ] No dots after numbers (`### . Nouns` ❌)
   - [ ] Rules are numbered (1. 2. 3.)
   - [ ] Practice Problems use correct hierarchy (`##` then `###`)
   - [ ] No line breaks in question-answer pairs
   - [ ] All JSON is valid (run through `jq` or JSON validator)

3. **Section structure check:**
   - [ ] Every section has ONE structure type (content OR subsections OR items OR mistakes OR points OR problems)
   - [ ] No empty sections
   - [ ] No sections with ONLY tables/charts

---

## Common Mistakes Reference

| Issue | ❌ Wrong | ✅ Correct |
|-------|----------|-----------|
| Heading levels | `## Nouns` | `### Nouns` |
| Practice hierarchy | `# Practice Problems` | `## Practice Problems` |
| Difficulty levels | `## Beginner Level` | `### Beginner Level` |
| Dots in titles | `### . Nouns` | `### Nouns` |
| Emojis | `# Core Concepts 📚` | `# Core Concepts` |
| Rule format | `- Common Nouns...` | `1. **Common Nouns**...` |
| Question breaks | `1. Question\n**Answer:**` | `1. Question  **Answer:**` |
| Missing keywords | Just text | Must have `**Definition:**` |
| Tables only | `### Time Expressions\n\|...\|` | Add Definition first |

---

## AI Generation Prompt Template

When generating study materials via AI, use this system prompt:

```
You are creating study materials for Krakkify exam prep platform.

FORMAT: [Markdown/JSON - specify which]

STRUCTURE REQUIREMENTS:
- Markdown: Follow EXACTLY the hierarchy in STUDY-MATERIALS-FORMAT-GUIDE.md
  * # for top sections (What is, Core Concepts)
  * ### for individual concepts
  * ## for Practice Problems
  * ### for difficulty levels
- JSON: Use appropriate section type (content/subsections/items/mistakes/points/problems)

MANDATORY KEYWORDS:
Every Core Concept MUST have at least ONE:
- **Definition:** [text]
- **Rules:** [numbered list]
- **Examples:** [correct/incorrect pairs]

PRACTICE PROBLEMS FORMAT:
- ## Practice Problems
- ### Beginner Level (30%)
- 1. **Question:**  **Answer:** answer - explanation (NO line breaks)

FORBIDDEN:
- ❌ Emojis in headings
- ❌ Dots after numbers (### . Nouns)
- ❌ Tables/charts as standalone sections
- ❌ Line breaks between question and answer
- ❌ Sections without Definition/Rules/Examples

GENERATE:
[Topic-specific instructions...]
```

---

## Testing Before Database Load

### 1. Visual Review
- Open the markdown/JSON file
- Verify all sections present
- Check no empty sections
- Confirm structure matches format guide

### 2. Automated Checks
```bash
# For Markdown
grep "^#" file.md              # Check heading levels
grep "\*\*Definition:\*\*" file.md   # Verify keywords exist
grep -A 2 "## Practice" file.md      # Check practice format

# For JSON
cat file.json | jq .           # Validate JSON syntax
cat file.json | jq '.content.sections[] | .title'  # List sections
```

### 3. Load to Database
```bash
# For Markdown
npx tsx scripts/load-study-materials.ts

# For JSON (create specific loader if needed)
npx tsx scripts/load-[topic]-study-material.ts
```

### 4. Test on Website
- Navigate to study page
- Check all sections load (no blank sections)
- Verify practice problems appear
- Test on both light and dark mode
- Check mobile responsiveness

---

## Future Sessions Reference

**When generating new study materials:**

1. Read this checklist FIRST
2. Choose format based on topic type
3. Follow structure requirements exactly
4. Use validation checks before loading
5. Test on actual website before claiming "done"

**Files to reference:**
- `STUDY-MATERIALS-FORMAT-GUIDE.md` — Complete format documentation
- `STUDY-MODE-FIXES-SUMMARY.md` — All issues we fixed (learn from these)
- `content-generated/study-materials/*.md` — Working markdown examples
- `.agents/artifacts/thermodynamics-study-material.json` — Working JSON example

---

**Last Updated:** 2026-06-15  
**Next Review:** After generating 5+ new study materials  
**Maintained By:** Krakkify Development Team

---

## Quick Command Reference

```bash
# Generate new content (via AI or manual)
# → Follow format guide strictly

# Validate markdown
grep "^#" your-file.md
grep -E "\*\*(Definition|Rules|Examples):\*\*" your-file.md

# Validate JSON
cat your-file.json | jq .

# Load to database
npx tsx scripts/load-study-materials.ts

# Test on website
# → https://krakkify.in/[exam]/[subject]/[topic]/study

# Fix issues before claiming done
# → Check all 8 sections render properly
# → No blank sections
# → Practice problems work
```
