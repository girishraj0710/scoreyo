# Question Generation Quality Rules

## CRITICAL FORMATTING RULES (Must Follow)

### 1. Instruction Words Must Have Colons
**WRONG:** ❌
```
"Use go instead of goes"
"Say They usually go"
"Arrange correctly: words here"
```

**CORRECT:** ✅
```
"Use: go instead of goes"
"Say: They usually go"
"Arrange correctly: words here"  (already has colon after "correctly")
```

### 2. Options Array Format
- Must be valid JSON array
- Exactly 4 options
- Options stored as TEXT in database (JSON string)
- Example: `'["option1", "option2", "option3", "option4"]'`

### 3. Explanation Format
- Clear, concise explanation
- Pattern shown explicitly (e.g., "Pattern: Subject + verb + object")
- No jargon for beginners
- Example included when helpful

### 4. Difficulty Distribution
For 100 questions:
- 40 easy (40%)
- 40 medium (40%)
- 20 hard (20%)

For 120 questions:
- 48 easy (40%)
- 48 medium (40%)
- 24 hard (20%)

### 5. Common Instruction Words (Require Colon)
- Use:
- Say:
- Arrange:
- Rearrange:
- Add:
- Remove:
- Change:
- Put:
- Choose:
- Complete:
- Fix:
- Correct:

### 6. Database Schema
```sql
CREATE TABLE english_questions (
  id SERIAL PRIMARY KEY,
  path_id TEXT NOT NULL,           -- 'foundation'
  topic_id TEXT NOT NULL,           -- e.g., 'nouns-detailed'
  level TEXT NOT NULL,              -- 'beginner', 'intermediate', 'advanced'
  question TEXT NOT NULL,           -- The question text
  options TEXT NOT NULL,            -- JSON array as TEXT: '["A", "B", "C", "D"]'
  correct_answer INTEGER NOT NULL,  -- 0, 1, 2, or 3 (index)
  explanation TEXT NOT NULL,        -- Detailed explanation
  difficulty TEXT NOT NULL          -- 'easy', 'medium', 'hard'
);
```

## Question Types

### Type 1: Fill in the Blank
```sql
('foundation', 'nouns-detailed', 'beginner', 
 'This is _____ apple.', 
 '["a", "an", "the", "some"]', 
 1, 
 'Use: "an" before vowel sounds. Apple starts with vowel sound /æ/. Pattern: an + vowel sound.', 
 'easy')
```

### Type 2: Error Identification
```sql
('foundation', 'nouns-detailed', 'beginner',
 'What is wrong? "She have three childs."',
 '["Use: has instead of have", "Use: children instead of childs", "Use: both corrections", "Nothing wrong"]',
 2,
 'Two errors: Subject-verb (she = has) + irregular plural (child → children). Both need fixing.',
 'medium')
```

### Type 3: Sentence Rearrangement
```sql
('foundation', 'nouns-detailed', 'beginner',
 'Arrange correctly: book / a / This / is',
 '["This is a book", "A book is this", "Is this a book", "Book this is a"]',
 0,
 'Pattern: Subject + verb + article + noun. Natural order: This is a book.',
 'medium')
```

### Type 4: Choose Best Answer
```sql
('foundation', 'nouns-detailed', 'beginner',
 'Which is a proper noun?',
 '["city", "Mumbai", "school", "teacher"]',
 1,
 'Proper noun = specific name (always capitalized). Mumbai = specific city name. Common nouns: city, school, teacher.',
 'easy')
```

## Subtopic Coverage Formula

For a topic with N subtopics and Q total questions:
- Questions per subtopic = Q / N
- Each subtopic must have balanced difficulty
- Example: 100 questions, 5 subtopics = 20 questions each
  - Subtopic 1: 8 easy, 8 medium, 4 hard = 20
  - Subtopic 2: 8 easy, 8 medium, 4 hard = 20
  - ... and so on

## Validation Checklist

Before submitting questions:
- [ ] All instruction words have colons
- [ ] Options are valid JSON arrays (4 options each)
- [ ] correct_answer is 0, 1, 2, or 3
- [ ] Difficulty distribution matches target
- [ ] Explanations are clear and beginner-friendly
- [ ] No special characters that break SQL
- [ ] topic_id matches exactly with UI (check english-content.ts)
- [ ] level matches topic level (beginner/intermediate/advanced)
- [ ] All subtopics covered proportionally
