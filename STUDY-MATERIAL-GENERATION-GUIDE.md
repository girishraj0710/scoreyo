# Study Material Generation System

**Last Updated:** 2026-06-16  
**Purpose:** Generate comprehensive study materials for all topics on Krakkify

---

## Quick Start

### Prerequisites
- AI access for content generation (OpenRouter/Gemini)
- Study material templates ready
- Topic definitions from `english-content.ts` or `exams.ts`

### Generate Study Material (3 Steps)

**Step 1: Choose format**
```bash
# Markdown format (preferred - easier to edit)
npm run generate:study-markdown

# JSON format (for programmatic insertion)
npm run generate:study-json
```

**Step 2: Review generated content**
- Check `/scripts/output/study-materials-YYYY-MM-DD/`
- Verify formatting and accuracy

**Step 3: Insert into database**
- Use Supabase dashboard or SQL script
- Verify rendering on frontend

---

## Study Material Structure

### Database Schema

**For English topics:**
```sql
CREATE TABLE topic_study_content (
  id SERIAL PRIMARY KEY,
  topic_id TEXT NOT NULL UNIQUE,  -- e.g., 'parts-of-speech'
  title TEXT NOT NULL,
  content JSONB NOT NULL,         -- Structured sections
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Content JSON Structure:**
```json
{
  "sections": [
    {
      "id": "introduction",
      "title": "Introduction",
      "content": "Overview paragraph..."
    },
    {
      "id": "core-concepts",
      "title": "Core Concepts",
      "content": "## Nouns\n\n**Definition:** ...\n\n**Rules:**\n- Rule 1\n- Rule 2"
    },
    {
      "id": "common-mistakes",
      "title": "Common Mistakes",
      "items": [
        {
          "title": "Mistake 1",
          "wrong": "Wrong example",
          "correct": "Correct example",
          "explanation": "Why this is wrong..."
        }
      ]
    },
    {
      "id": "practice-problems",
      "title": "Practice Problems",
      "problems": [
        {
          "question": "Identify the noun...",
          "answer": "Teacher",
          "explanation": "Because..."
        }
      ]
    }
  ]
}
```

---

## Section Types (6 Types)

### 1. Introduction Section
**Purpose:** Topic overview and learning objectives

```json
{
  "id": "introduction",
  "title": "Introduction",
  "content": "Parts of speech are the building blocks of English grammar. There are 8 parts of speech: noun, pronoun, verb, adjective, adverb, preposition, conjunction, and interjection. Each serves a unique function in sentence construction.\n\nIn this lesson, you'll learn:\n- How to identify each part of speech\n- Rules and patterns for usage\n- Common mistakes to avoid\n- Practice exercises for mastery"
}
```

### 2. Core Concepts Section (Flashcards)
**Purpose:** Main content presented as flashcards (one at a time)

**CRITICAL FORMAT RULE:** Use Markdown headers (##) to separate flashcards

```markdown
## Nouns

**Definition:** A noun is a word that names a person, place, thing, or idea.

**Types:**
- Common nouns: teacher, city, book
- Proper nouns: Sarah, London, Harry Potter
- Abstract nouns: happiness, freedom, love
- Collective nouns: team, flock, committee

**Rules:**
1. Proper nouns are always capitalized
2. Plural nouns usually end in -s or -es
3. Some nouns have irregular plurals (child → children)

**Examples:**
- "The **teacher** gave **Sarah** a **book**." (3 nouns)
- "**Happiness** is a choice." (abstract noun)
- "A **flock** of birds flew overhead." (collective noun)

---

## Pronouns

**Definition:** A pronoun replaces a noun to avoid repetition.

**Types:**
- Personal: I, you, he, she, it, we, they
- Possessive: mine, yours, his, hers, ours, theirs
- Reflexive: myself, yourself, himself, herself
- Demonstrative: this, that, these, those

**Rules:**
1. Pronouns must agree with their antecedent in number and gender
2. Use "I" as subject, "me" as object
3. Reflexive pronouns end in -self or -selves

**Examples:**
- "**She** gave **him** the book." (personal pronouns)
- "The book is **hers**." (possessive pronoun)
- "He prepared **himself** for the exam." (reflexive)
```

**Storage format:**
```json
{
  "id": "core-concepts",
  "title": "Core Concepts",
  "content": "## Nouns\n\n**Definition:** ...\n\n---\n\n## Pronouns\n\n**Definition:** ..."
}
```

**Rendering:** Each `## Header` becomes a separate flashcard with Previous/Next navigation.

### 3. Key Points Section
**Purpose:** Quick reference bullet points

```json
{
  "id": "key-points",
  "title": "Key Points to Remember",
  "points": [
    "**Nouns** name people, places, things, or ideas",
    "**Pronouns** replace nouns (I, you, he, she, it)",
    "**Verbs** show action or state of being (run, is, have)",
    "**Adjectives** describe nouns (beautiful, tall, red)",
    "**Adverbs** modify verbs, adjectives, or other adverbs (quickly, very, often)",
    "**Prepositions** show relationships (in, on, at, by, with)",
    "**Conjunctions** connect words or clauses (and, but, or, because)",
    "**Interjections** express emotion (wow, ouch, alas)"
  ]
}
```

### 4. Common Mistakes Section
**Purpose:** Wrong vs. correct examples with explanations

```json
{
  "id": "common-mistakes",
  "title": "Common Mistakes",
  "mistakes": [
    {
      "title": "Confusing Adjectives and Adverbs",
      "wrong": "She sings beautiful.",
      "correct": "She sings beautifully.",
      "explanation": "Use an adverb (beautifully) to modify a verb (sings), not an adjective (beautiful)."
    },
    {
      "title": "Subject-Verb Agreement",
      "wrong": "The team are playing well.",
      "correct": "The team is playing well.",
      "explanation": "Collective nouns (team, family, committee) take singular verbs in American English."
    }
  ]
}
```

### 5. Examples Section
**Purpose:** Sentence examples with annotations

```json
{
  "id": "examples",
  "title": "Annotated Examples",
  "items": [
    {
      "sentence": "The **quick** brown **fox** **jumps** **over** the lazy **dog**.",
      "explanation": "**Quick** (adjective) describes fox. **Fox** and **dog** (nouns). **Jumps** (verb). **Over** (preposition)."
    },
    {
      "sentence": "**Wow**! **She** **really** **loves** **Italian** **cuisine**.",
      "explanation": "**Wow** (interjection). **She** (pronoun). **Really** (adverb). **Loves** (verb). **Italian** (proper adjective). **Cuisine** (noun)."
    }
  ]
}
```

### 6. Practice Problems Section
**Purpose:** Self-assessment exercises with answers

```json
{
  "id": "practice-problems",
  "title": "Practice Problems",
  "problems": [
    {
      "question": "Identify the parts of speech in: 'She quickly ran to the store.'",
      "answer": "She (pronoun), quickly (adverb), ran (verb), to (preposition), the (article), store (noun)",
      "explanation": "The sentence has 4 different parts of speech. Articles (the) are a type of adjective."
    },
    {
      "question": "Which word is an adverb: 'The extremely tall building'?",
      "answer": "extremely",
      "explanation": "'Extremely' is an adverb modifying the adjective 'tall'. It shows the degree of tallness."
    }
  ]
}
```

---

## Format Requirements (CRITICAL)

### ✅ DO:
- Use `##` headers to separate flashcards in Core Concepts
- Use `**bold**` for emphasis (Definition, Rules, Examples)
- Use `-` for unordered lists
- Use `1.` for ordered lists
- Keep explanations clear and concise
- Include 5-10 flashcards per Core Concepts section
- Add 5-10 common mistakes
- Add 8-12 practice problems

### ❌ DON'T:
- Don't use single `#` header (too large)
- Don't use raw HTML tags
- Don't use images (not supported yet)
- Don't use tables (use lists instead)
- Don't write one massive paragraph (break into sections)
- Don't skip separators (`---`) between flashcards

---

## AI Prompt Template

### For English Grammar Topics

```
You are an expert English teacher creating comprehensive study materials.

TOPIC: ${topicName}
LEVEL: ${level} (beginner/intermediate/advanced)
AUDIENCE: Indian students preparing for IELTS/competitive exams

Create a complete study guide with these sections:

1. INTRODUCTION (100-150 words)
   - Overview of the topic
   - Why it's important
   - What students will learn

2. CORE CONCEPTS (5-10 flashcards)
   - Each concept on a separate card
   - Format: ## Header for each card
   - Include: Definition, Types, Rules, Examples
   - Use --- separator between cards

3. KEY POINTS (8-12 bullet points)
   - Quick reference facts
   - One concept per point
   - Use **bold** for important terms

4. COMMON MISTAKES (5-10 mistakes)
   - Wrong example
   - Correct example
   - Clear explanation why

5. ANNOTATED EXAMPLES (5-8 sentences)
   - Complete sentences
   - Highlight parts being taught
   - Explain each highlighted part

6. PRACTICE PROBLEMS (8-12 problems)
   - Mix of identification and application
   - Include full answers
   - Explain reasoning

FORMAT RULES:
- Use ## for flashcard headers
- Use **bold** for emphasis
- Use - for lists
- Use --- to separate flashcards
- Keep language simple and clear
- Include Indian context examples where relevant

Return as valid JSON matching the schema provided.
```

### For Main Exam Topics (JEE/NEET/UPSC)

```
You are an expert ${examName} teacher creating study materials.

EXAM: ${examName}
SUBJECT: ${subjectName}
TOPIC: ${topicName}
DIFFICULTY: ${difficulty}

Create comprehensive notes covering:

1. INTRODUCTION
   - Topic relevance to ${examName}
   - Weightage in exam
   - Prerequisites

2. CORE CONCEPTS (Theory)
   - Fundamental principles
   - Formulas/theorems (if applicable)
   - Derivations (if needed)
   - Diagrams (describe in text)

3. KEY FORMULAS (if applicable)
   - All important formulas
   - When to use each
   - Units and dimensions

4. COMMON MISTAKES
   - Calculation errors
   - Conceptual misunderstandings
   - Exam-specific pitfalls

5. SOLVED EXAMPLES (5-8)
   - Previous year questions
   - Step-by-step solutions
   - Alternative approaches

6. PRACTICE PROBLEMS (10-15)
   - Mixed difficulty
   - Exam-style questions
   - Detailed solutions

Return as JSON matching the schema.
```

---

## Generation Workflow

### Step 1: Prepare Topic List

```typescript
// English topics from src/lib/english-content.ts
const englishTopics = [
  { id: 'parts-of-speech', name: '8 Parts of Speech', level: 'beginner' },
  { id: 'articles', name: 'Articles (A, An, The)', level: 'beginner' },
  { id: 'present-simple', name: 'Present Simple Tense', level: 'beginner' },
  // ... 30+ more topics
];

// Exam topics from src/lib/exams.ts
const jeeTopics = [
  { subject: 'physics', topic: 'mechanics', name: 'Mechanics' },
  { subject: 'physics', topic: 'thermodynamics', name: 'Thermodynamics' },
  { subject: 'chemistry', topic: 'organic', name: 'Organic Chemistry Basics' },
  // ... 100+ topics
];
```

### Step 2: Generate Content

```typescript
import { generateStudyMaterial } from '@/lib/study-generator';

for (const topic of englishTopics) {
  const material = await generateStudyMaterial({
    topicId: topic.id,
    topicName: topic.name,
    level: topic.level,
    format: 'json' // or 'markdown'
  });

  // Validate structure
  if (validateStudyMaterial(material)) {
    // Save to file
    await saveStudyMaterial(topic.id, material);
  }

  // Rate limit delay
  await sleep(2000);
}
```

### Step 3: Review and Edit

```bash
# Generated files location
ls scripts/output/study-materials-2026-06-16/

# Review each file
cat scripts/output/study-materials-2026-06-16/parts-of-speech.json

# Edit if needed (fix formatting, add examples, etc.)
code scripts/output/study-materials-2026-06-16/parts-of-speech.json
```

### Step 4: Insert into Database

**Option A: Supabase Dashboard**
```sql
-- Insert English study material
INSERT INTO topic_study_content (topic_id, title, content)
VALUES (
  'parts-of-speech',
  '8 Parts of Speech',
  '{"sections": [...]}'::jsonb
)
ON CONFLICT (topic_id) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;
```

**Option B: Bulk Insert Script**
```typescript
import { insertStudyMaterials } from '@/lib/db';

const materials = await loadGeneratedMaterials('./scripts/output/study-materials-2026-06-16/');

for (const material of materials) {
  await insertStudyMaterials(material.topicId, material.title, material.content);
}
```

---

## Quality Checklist

Before publishing study materials:

### Content Quality
- [ ] All sections present (Introduction, Core Concepts, Key Points, Common Mistakes, Examples, Practice)
- [ ] Core Concepts properly formatted with ## headers
- [ ] All examples are accurate and relevant
- [ ] Explanations are clear for target level
- [ ] No grammar/spelling errors
- [ ] Indian context included where relevant

### Format Quality
- [ ] Valid JSON structure
- [ ] Markdown formatting correct (**, ##, -, ---)
- [ ] No raw HTML tags
- [ ] Flashcard separators (`---`) present
- [ ] Lists properly formatted
- [ ] No missing sections

### Technical Quality
- [ ] JSON validates (no syntax errors)
- [ ] Topic ID matches definition in code
- [ ] All required fields present
- [ ] Renders correctly on frontend
- [ ] Flashcard navigation works
- [ ] Practice problems display properly

---

## Frontend Components

### Study Material Display

**Main Component:** `src/components/study-material-content.tsx`

**Key Features:**
- Table of contents with smooth scroll
- Collapsible sections
- Flashcard navigator for Core Concepts (Previous/Next)
- Expandable practice problems
- Dark mode support
- Mobile responsive

**Rendering Priority:**
1. Check if section is Core Concepts → Use flashcard navigator
2. Check if section has mistakes → Render wrong/correct examples
3. Check if section has practice problems → Render with show/hide answers
4. Check if section has items/points → Render as list
5. Otherwise → Render as markdown content

### Markdown Rendering

**Component:** `src/components/premium-markdown-renderer.tsx`

**Supported:**
- Headers (##, ###, ####)
- Bold (**text**)
- Lists (- item, 1. item)
- Code blocks (\`\`\`)
- Inline code (\`code\`)
- Blockquotes (>)
- Horizontal rules (---)

**NOT Supported:**
- Images
- Tables (workaround: use lists)
- HTML tags (stripped for security)

---

## Batch Generation Scripts

### Generate All English Foundation Topics (40 topics)

```bash
npm run generate:english-foundation
# Outputs: 40 JSON files in /scripts/output/study-materials-*/
# Estimated time: 2-3 hours (with rate limits)
# Cost: Free (using Gemini Flash)
```

### Generate All JEE Main Topics (100+ topics)

```bash
npm run generate:jee-main
# Outputs: 100+ JSON files
# Estimated time: 5-6 hours
# Cost: Free (using Gemini Flash)
```

### Generate All UPSC GS Topics (150+ topics)

```bash
npm run generate:upsc-gs
# Outputs: 150+ JSON files
# Estimated time: 8-10 hours
# Cost: Free (using Gemini Flash)
```

---

## File Locations

```
/scripts/
  generate-study-materials.ts      # Main generation script
  validate-study-materials.ts      # Validation utility
  insert-study-materials.ts        # Bulk insertion script
  /output/study-materials-YYYY-MM-DD/
    parts-of-speech.json
    articles.json
    present-simple.json
    ...

/src/components/
  study-material-content.tsx       # Main study page component
  study-card-navigator.tsx         # Flashcard navigation
  premium-markdown-renderer.tsx    # Markdown rendering
  practice-problems-section.tsx    # Practice problems display

/src/app/
  study/page.tsx                   # Universal study page (all exams)
  english/[pathId]/[topicId]/study/page.tsx  # English study page
```

---

## Examples

### Complete Study Material Example

See: `scripts/examples/study-material-template.json`

### Minimal Study Material (for testing)

```json
{
  "sections": [
    {
      "id": "introduction",
      "title": "Introduction",
      "content": "This is an introduction to the topic."
    },
    {
      "id": "core-concepts",
      "title": "Core Concepts",
      "content": "## Concept 1\n\n**Definition:** First concept.\n\n---\n\n## Concept 2\n\n**Definition:** Second concept."
    },
    {
      "id": "key-points",
      "title": "Key Points",
      "points": [
        "Point 1",
        "Point 2",
        "Point 3"
      ]
    }
  ]
}
```

---

## Troubleshooting

### Issue: Flashcards not showing

**Cause:** Core Concepts section not formatted correctly

**Fix:**
- Ensure section ID is exactly "core-concepts" (lowercase, hyphenated)
- Use `##` headers to separate cards (not `#` or `###`)
- Add `---` separator between cards
- Check content is stored as string, not array

### Issue: Markdown not rendering

**Cause:** Invalid markdown syntax

**Fix:**
- Use `**text**` for bold (not `<b>text</b>`)
- Use `-` for lists (not `•` or `*`)
- Use `##` for headers (not underlines)
- Escape special characters if needed

### Issue: Practice problems not expandable

**Cause:** Wrong section structure

**Fix:**
- Ensure section ID is "practice-problems"
- Use `problems` array (not `items` or `content`)
- Each problem needs: question, answer, explanation

---

## Next Steps

1. **Week 1:** Generate study materials for top 10 English topics
2. **Week 2:** Generate materials for JEE Main Physics (all topics)
3. **Week 3:** Generate materials for NEET Biology (all topics)
4. **Week 4:** Generate materials for UPSC GS Paper 1

**Target:** Complete study materials for all 74+ exams by Q4 2026

---

## Related Documents

- `QUESTION-GENERATION-GUIDE.md` - Question generation system
- `STUDY-CONTENT-GENERATION-CHECKLIST.md` - Original formatting guide
- `src/lib/english-content.ts` - English topic definitions
- `src/lib/exams.ts` - Exam and subject definitions
