# Study Materials Format Guide

This guide defines the **standard formats** for creating study materials that work with Scoreyo's rendering system.

---

## Table of Contents

1. [Markdown Format (Grammar/English)](#markdown-format)
2. [JSON Format (Physics/Math/Science)](#json-format)
3. [Practice Problems Format](#practice-problems-format)
4. [Common Mistakes to Avoid](#common-mistakes-to-avoid)

---

## Markdown Format

**Use for:** Grammar, English, simple conceptual topics

### File Structure

```markdown
# Topic Title

**Level:** A1 | **Time:** 30 mins | **Category:** Grammar

---

# What is [Topic]?

[Introduction paragraph explaining the topic...]

---

# Core Concepts

### Concept 1 (Descriptive Name)

**Definition:** [Clear, one-sentence definition]

**Rules:**
1. **Rule Name** explanation text here
2. **Another Rule** explanation text here
3. **Third Rule** explanation text here

**Examples:**
-  CORRECT: "Example sentence"
-  INCORRECT: "Wrong sentence" → WHY: Explanation of why it's wrong
-  CORRECT: "Another correct example"
-  INCORRECT: "Another wrong example" → WHY: Explanation

---

### Concept 2 (Another Name)

[Same structure as Concept 1...]

---

## Practice Problems

### Beginner Level (30%)

1. **Question text here:** "Example sentence or context" (options if MCQ)  **Answer:** Correct answer - Explanation of why

2. **Another question:** "Context"  **Answer:** Answer - Explanation

### Intermediate Level (50%)

3. **Question text:**  **Answer:** Answer - Explanation

### Advanced Level (20%)

6. **Question text:**  **Answer:** Answer - Explanation

---
```

### Critical Rules for Markdown:

1. **Section Headings:**
   - Use `# ` (single hash) for TOP-LEVEL sections: `# What is`, `# Core Concepts`
   - Use `### ` (triple hash) for CONCEPTS inside Core Concepts
   - Use `## ` (double hash) for Practice Problems header
   - Use `### ` (triple hash) for difficulty levels (Beginner, Intermediate, Advanced)

2. **Required Keywords in Concepts:**
   - MUST have at least ONE of: `**Definition:**`, `**Rules:**`, or `**Examples:**`
   - Without these, the card will be skipped (empty)

3. **Rules Format:**
   - Start with `**Rules:**`
   - Each rule: `1. **Rule Name** explanation`
   - Numbering is REQUIRED (parser removes it automatically)

4. **Examples Format:**
   - Start with `**Examples:**`
   - Correct: `-  CORRECT: "sentence"`
   - Incorrect: `-  INCORRECT: "sentence" → WHY: reason`

5. **Practice Problems Format:**
   - Question: `1. **Question:** "context"  **Answer:** answer - explanation`
   - Number + bold question + optional context + bold Answer + answer + dash + explanation
   - NO line breaks between question and answer (parser splits by `\n\d+\.`)

6. **What NOT to Include in Core Concepts:**
   - Summary tables (they render blank - put in separate section)
   - Comparison charts (no Definition/Rules/Examples)
   - Lists without structure

---

## JSON Format

**Use for:** Physics, Chemistry, Math, complex topics with examples/formulas

### File Structure

```json
{
  "subject_id": "physics",
  "topic_id": "thermodynamics",
  "title": "Thermodynamics - Complete Guide",
  "subtitle": "Laws, Processes, and Real-World Applications",
  "difficulty_level": "intermediate",
  "estimated_time_minutes": 45,
  "curriculum_standard": "NCERT Class 11",
  "content": {
    "sections": [
      {
        "id": "introduction",
        "title": "What is Thermodynamics?",
        "content": "**Thermodynamics** studies how energy moves...",
        "order": 1
      },
      {
        "id": "laws",
        "title": "The Four Laws of Thermodynamics",
        "subsections": [
          {
            "title": "First Law: Energy Conservation",
            "content": "**Statement:** Energy cannot be created...\n\n**Mathematical Form:**\n```\nΔU = Q - W\n```",
            "examples": [
              {
                "title": "Example 1: Heating a Gas",
                "problem": "100 J of heat is added to a gas at constant volume. Find ΔU.",
                "solution": "**Given:**\n- Q = +100 J\n- V = constant → W = 0\n\n**Apply First Law:**\n```\nΔU = Q - W = 100 - 0 = 100 J\n```",
                "key_insight": "At constant volume: ΔU = Q"
              }
            ]
          }
        ],
        "order": 2
      }
    ]
  }
}
```

### Critical Rules for JSON:

1. **Section Structure:**
   - Flat `content` for simple sections
   - `subsections` array for complex sections (laws, processes)

2. **Examples Structure:**
   ```json
   {
     "title": "Example title",
     "problem": "Problem statement",
     "solution": "Step-by-step solution with **bold** for emphasis",
     "key_insight": "Takeaway lesson"
   }
   ```

3. **Markdown in JSON:**
   - Use `**bold**` for emphasis
   - Use `` ```formula``` `` for code/formulas
   - Use `\n\n` for paragraph breaks

4. **Subsections Rendering:**
   - Each subsection becomes a card
   - Examples render in colored boxes below content
   - Key insights get special styling (💡)

---

## Practice Problems Format

### For Markdown Files

**Critical Pattern:**
```markdown
## Practice Problems

### Beginner Level (30%)

1. **Question text:** "Context sentence" (options)  **Answer:** answer - explanation

2. **Next question:**  **Answer:** answer - explanation
```

**Regex Expectations:**
- Parser splits by: `\n\d+\.\s+` (newline + number + dot + space)
- Extracts question: Everything from `**question**` to `**Answer:**`
- Extracts answer: Everything after `**Answer:**` until next number or end
- Splits answer/explanation by: ` - ` (space dash space)

**Common Mistakes:**
- ❌ Using `# Practice Problems` (should be `##`)
- ❌ Using `## Beginner Level` (should be `###`)
- ❌ Line break between question and answer (breaks parser)
- ❌ Missing `**Answer:**` keyword

### For JSON Files

```json
{
  "practice_problems": [
    {
      "level": "beginner",
      "number": 1,
      "question": "Calculate work done when...",
      "answer": "W = 150 J",
      "explanation": "Using W = PΔV formula..."
    }
  ]
}
```

---

## Common Mistakes to Avoid

### 1. Heading Level Confusion

❌ **WRONG:**
```markdown
# Core Concepts
## Nouns  ← Wrong level
```

✅ **CORRECT:**
```markdown
# Core Concepts
### Nouns  ← Correct level (three hashes)
```

### 2. Missing Structure Keywords

❌ **WRONG:**
```markdown
### Time Expressions

| Tense | Words |
|-------|-------|
| ...   | ...   |
```
→ **Result:** Empty card (no Definition/Rules/Examples)

✅ **CORRECT:**
```markdown
### Time Expressions

**Definition:** Words that indicate when an action happens.

**Rules:**
1. Present Simple uses: always, usually, often
2. Present Continuous uses: now, right now
```

### 3. Practice Problems Hierarchy

❌ **WRONG:**
```markdown
# Practice Problems  ← Level 1
## Beginner Level     ← Level 2
```
→ **Result:** Parser can't find subsections

✅ **CORRECT:**
```markdown
## Practice Problems  ← Level 2
### Beginner Level    ← Level 3
```

### 4. Rule Numbering

❌ **WRONG:**
```markdown
**Rules:**
- Common Nouns name general items  ← No number
- Proper Nouns are capitalized
```

✅ **CORRECT:**
```markdown
**Rules:**
1. **Common Nouns** name general items  ← Numbered
2. **Proper Nouns** are capitalized
```

### 5. Practice Problem Formatting

❌ **WRONG:**
```markdown
1. **Question:**
"Example sentence"
**Answer:**
Correct answer
```
→ **Result:** Parser breaks (line breaks between question/answer)

✅ **CORRECT:**
```markdown
1. **Question:** "Example sentence"  **Answer:** Correct answer - Explanation
```

---

## Testing Your Format

### Before Loading to Database:

1. **Check heading levels:**
   ```bash
   grep "^#" your-file.md
   ```
   - Should see: `#`, `# `, `###` (not `##` for concepts)

2. **Validate structure:**
   ```bash
   grep -E "\*\*(Definition|Rules|Examples):\*\*" your-file.md
   ```
   - Every `###` concept should have at least ONE match

3. **Check Practice Problems:**
   ```bash
   grep -A 1 "## Practice Problems" your-file.md
   ```
   - Next line should be `### Beginner Level`

4. **Verify rule numbering:**
   ```bash
   grep "1\. \*\*" your-file.md
   ```
   - Should find numbered rules

### After Loading to Database:

1. Navigate to the study page
2. Check "Core Concepts" cards load content (not blank)
3. Navigate to last card → "Start Practice Problems" button appears
4. Click button → questions expand with answers

---

## Quick Reference

| Element | Markdown | JSON |
|---------|----------|------|
| Top section | `# What is` | `"title": "What is..."` |
| Core Concepts | `# Core Concepts` | N/A (use subsections) |
| Individual concept | `### Concept Name` | `"subsections": [...]` |
| Definition | `**Definition:** text` | `"content": "**Definition:** text"` |
| Rules | `**Rules:**\n1. **Name** text` | (inline in content) |
| Examples | `**Examples:**\n-  CORRECT:` | `"examples": [...]` |
| Practice Problems | `## Practice Problems` | `"practice_problems": [...]` |
| Difficulty levels | `### Beginner Level` | `"level": "beginner"` |

---

## Future Materials Checklist

Before creating new study materials:

- [ ] Choose format (Markdown for grammar, JSON for science/math)
- [ ] Follow heading hierarchy exactly (`#` → `###` → `##` → `###`)
- [ ] Every concept has Definition/Rules/Examples
- [ ] Rules are numbered (1., 2., 3.)
- [ ] Practice Problems use correct hierarchy
- [ ] No line breaks in question/answer pairs
- [ ] Test with `grep` commands before loading
- [ ] Load to database with `npx tsx scripts/load-study-materials.ts`
- [ ] Verify on website (no blank cards, practice problems work)

---

**Last Updated:** 2026-06-15
**Maintained By:** Scoreyo Development Team
