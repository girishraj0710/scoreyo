# Dimensional Model Design for PrepGenie

## Problem Statement

Current structure duplicates topics across exams:
- "Current Affairs" exists 36 times (1,402 questions for essentially same content)
- "Arithmetic" exists 24 times
- "Algebra" exists 22 times
- Total waste: ~15,000+ duplicate/similar questions

## Proposed Star Schema

```
┌─────────────────┐
│   dim_topics    │◄────┐
│  (Master)       │     │
├─────────────────┤     │
│ id (PK)         │     │
│ topic_name      │     │
│ category        │     │
│ scope           │     │
│ parent_topic_id │     │
└─────────────────┘     │
                        │
┌─────────────────┐     │      ┌──────────────────────┐
│   dim_exams     │     │      │  fact_exam_questions │
├─────────────────┤     │      ├──────────────────────┤
│ id (PK)         │     │      │ id (PK)              │
│ exam_code       │     │      │ topic_id (FK) ───────┤
│ exam_name       │     │      │ question             │
│ category        │     │      │ options              │
└─────────────────┘     │      │ correct_answer       │
        ▲               │      │ explanation          │
        │               │      │ difficulty           │
        │               │      │ source               │
┌──────────────────────┐│      │ valid_from           │
│bridge_exam_subject_topic││      │ valid_until          │
├──────────────────────┤│      └──────────────────────┘
│ id (PK)              ││           │
│ exam_id (FK)         ││           │
│ subject_id (FK)      ││           │
│ topic_id (FK)        │┘           │
│ is_mandatory         │◄───────────┘
│ weightage            │
└──────────────────────┘
        │
        │
┌─────────────────┐
│  dim_subjects   │
├─────────────────┤
│ id (PK)         │
│ subject_code    │
│ subject_name    │
│ category        │
└─────────────────┘
```

## Implementation Note

**Key Design Decision**: `fact_exam_questions` only stores `topic_id`, not `exam_id` or `subject_id`.

**Why?** Topics are inherently shared across exams. Instead of denormalizing exam/subject into each question row, we use the `bridge_exam_subject_topic` table to map which exams/subjects use which topics. This gives us:

1. **True topic sharing**: A single question for "Thermodynamics" can be used by JEE Main, JEE Advanced, NEET, and all State CETs without duplication
2. **Flexible mappings**: Topics can be added/removed from exams without touching question data
3. **Cleaner queries**: JOINing through the bridge table is explicit and predictable

**Query Pattern**:
```sql
-- To get questions for an exam+subject+topic:
SELECT q.*
FROM fact_exam_questions q
JOIN bridge_exam_subject_topic b ON q.topic_id = b.topic_id
WHERE b.exam_id = ? AND b.subject_id = ? AND b.topic_id = ?
```

## Table Definitions

### 1. dim_topics (Master Topics Dimension)

**Purpose:** Single source of truth for all topics

```sql
CREATE TABLE dim_topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'general-knowledge', 'mathematics', 'science', 'reasoning'
  scope TEXT NOT NULL, -- 'universal', 'state-specific', 'exam-specific'
  parent_topic_id INTEGER, -- for hierarchical topics (e.g., "Mechanics" → "Physics")
  description TEXT,
  keywords TEXT, -- comma-separated for search
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_topic_id) REFERENCES dim_topics(id)
);

CREATE INDEX idx_topics_category ON dim_topics(category);
CREATE INDEX idx_topics_scope ON dim_topics(scope);
```

**Examples:**
| id | topic_name | category | scope | parent_topic_id |
|----|------------|----------|-------|-----------------|
| 1 | Current Affairs | general-knowledge | universal | NULL |
| 2 | Indian Polity | general-knowledge | universal | NULL |
| 3 | Karnataka State GK | general-knowledge | state-specific | NULL |
| 4 | Mechanics | science | universal | NULL |
| 5 | Newton's Laws | science | universal | 4 |

### 2. dim_exams (Exam Dimension)

```sql
CREATE TABLE dim_exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_code TEXT NOT NULL UNIQUE, -- 'upsc-cse', 'ssc-cgl'
  exam_name TEXT NOT NULL,
  category TEXT, -- 'civil-services', 'banking', 'engineering'
  conducting_body TEXT, -- 'UPSC', 'SSC', 'NTA'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exams_category ON dim_exams(category);
```

### 3. dim_subjects (Subject Dimension)

```sql
CREATE TABLE dim_subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_code TEXT NOT NULL UNIQUE, -- 'gs', 'reasoning', 'quantitative'
  subject_name TEXT NOT NULL,
  category TEXT, -- 'aptitude', 'knowledge', 'language'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. bridge_exam_subject_topic (Bridge Table)

**Purpose:** Defines which topics belong to which exam-subject combinations

```sql
CREATE TABLE bridge_exam_subject_topic (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  is_mandatory BOOLEAN DEFAULT TRUE,
  weightage INTEGER DEFAULT 1, -- importance in exam (1-10)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES dim_exams(id),
  FOREIGN KEY (subject_id) REFERENCES dim_subjects(id),
  FOREIGN KEY (topic_id) REFERENCES dim_topics(id),
  UNIQUE(exam_id, subject_id, topic_id)
);

CREATE INDEX idx_bridge_exam ON bridge_exam_subject_topic(exam_id);
CREATE INDEX idx_bridge_topic ON bridge_exam_subject_topic(topic_id);
```

**Example:**
| exam_id | subject_id | topic_id | is_mandatory | weightage |
|---------|------------|----------|--------------|-----------|
| 1 (UPSC) | 1 (GS) | 1 (Current Affairs) | TRUE | 10 |
| 2 (SSC-CGL) | 1 (GS) | 1 (Current Affairs) | TRUE | 8 |
| 3 (KPSC) | 1 (GS) | 1 (Current Affairs) | TRUE | 9 |
| 3 (KPSC) | 1 (GS) | 3 (Karnataka GK) | TRUE | 10 |

### 5. fact_exam_questions (Fact Table)

```sql
CREATE TABLE fact_exam_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL, -- JSON array
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
  source TEXT,
  valid_from INTEGER,
  valid_until INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES dim_topics(id)
);

-- Prevent exact duplicates per topic
CREATE UNIQUE INDEX idx_unique_question 
ON fact_exam_questions(topic_id, substr(question, 1, 100));

-- Query performance indexes
CREATE INDEX idx_questions_topic ON fact_exam_questions(topic_id);
CREATE INDEX idx_questions_difficulty ON fact_exam_questions(difficulty);
```

## Benefits

### 1. Storage Efficiency
- **Before:** 1,402 Current Affairs questions (many duplicates)
- **After:** ~400 unique Current Affairs questions, referenced by 36 exams
- **Savings:** ~70% reduction in duplicate content

### 2. Data Quality
- Single source of truth for each topic
- Update once, reflects everywhere
- Consistent question quality across exams

### 3. Query Flexibility

**Get all Current Affairs questions:**
```sql
SELECT * FROM fact_exam_questions WHERE topic_id = 1;
```

**Get Current Affairs for specific exam:**
```sql
SELECT q.*
FROM fact_exam_questions q
JOIN bridge_exam_subject_topic b ON q.topic_id = b.topic_id
WHERE b.exam_id = 1 AND q.topic_id = 1;
```

**Get all topics for an exam:**
```sql
SELECT t.* FROM dim_topics t
JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
WHERE b.exam_id = 1;
```

**Cross-exam question sharing:**
```sql
-- All exams using "Current Affairs" questions
SELECT e.exam_name, COUNT(*) as mapped_topic_count
FROM dim_exams e
JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
WHERE b.topic_id = 1
GROUP BY e.exam_name;
```

### 4. Scalability

**Universal Topics (shared across all exams):**
- Current Affairs
- Indian History
- Indian Geography
- Indian Polity
- Basic Mathematics
- Basic Science

**State-Specific Topics (shared within state):**
- Karnataka State GK (KPSC, KCET)
- Maharashtra State GK (MPSC, MHT-CET)
- UP State GK (UPPSC, UP-Police)

**Exam-Specific Topics (unique to exam):**
- UPSC Essay Writing
- CAT Reading Comprehension (high difficulty)
- GATE Computer Science specific topics

## Migration Strategy

> Status note (2026-05-20): Dimensional model is implemented with feature-flagged dual mode.
> The phases below are retained as design history/reference.

### Phase 1: Create Dimensional Schema (Week 1)
- Create new tables alongside existing structure
- No disruption to existing app

### Phase 2: Populate Dimensions (Week 1-2)
- Extract unique topics from exam_questions
- Populate dim_topics, dim_exams, dim_subjects
- Create bridge table entries

### Phase 3: Migrate Questions (Week 2-3)
- Copy questions to fact_exam_questions
- Deduplicate where possible
- Maintain mapping for rollback

### Phase 4: Update Application Code (Week 3-4)
- Update `src/lib/db.ts` queries
- Update quiz generation logic
- Update admin dashboard
- Dual-read (old + new) for validation

### Phase 5: Cutover (Week 4)
- Switch to dimensional model
- Monitor for issues
- Keep old structure for 1 week backup

### Phase 6: Cleanup (Week 5)
- Drop old exam_questions table
- Remove legacy code
- Celebrate! 🎉

## Implementation Priority

**High Priority (Universal Topics):**
1. Current Affairs
2. Indian History
3. Indian Geography
4. Indian Polity
5. Basic Mathematics (Arithmetic, Algebra, Geometry)
6. Basic Science
7. English Grammar

**Medium Priority (State-Specific):**
8. State-wise GK topics
9. Regional language topics

**Low Priority (Exam-Specific):**
10. Unique exam topics
11. Very specialized topics

## Estimated Impact

**Database Size:**
- Current: ~44,000 questions (with duplicates)
- After migration: ~25,000 unique questions
- Reduction: ~43% smaller database

**Question Quality:**
- Can focus on improving 25K questions instead of 44K
- Easier to maintain, update, and verify

**Development Efficiency:**
- Simpler seeding logic
- No duplicate topic handling
- Cleaner codebase

## Next Steps

1. Review and approve design
2. Create migration scripts
3. Test on staging environment
4. Gradual rollout to production
