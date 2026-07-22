# English Study Content Authoring Guide

**Purpose:** The single reference for creating real, high-quality lesson content for
Learn English topics — including the 33 new C1/C2 (Advanced/Expert) topics that
currently have **no content** and render a "coming soon" state.

**Read this before authoring ANY English study content.** It documents the exact
storage schema, the block types the renderer actually supports, the quality bar,
and a repeatable recipe. Pair it with the "Learn English Content Architecture"
section in `CLAUDE.md`.

---

## 1. Current state (as of 2026-07-22)

- `topic_study_content` holds **real content for 116 existing topics**
  (foundation 83, advanced 22, ielts-toefl 6, real-world 5). Average ~29 KB/topic.
- The **33 new C1/C2 topics** (added to `english-advanced-path.ts`, modules 8–13)
  have **NO rows** in `topic_study_content`. They render a graceful "Study Material
  Not Available" state until authored. This is intentional — we do NOT seed
  placeholder rows (see §5).
- **API note:** `/api/study-content` supports two modes:
  1. **Exam mode** — `?exam=X&subject=Y&topic=Z` (study-guides, dim-table lookup).
  2. **Direct mode** — `?subject=english&topic=<topicId>&path=<pathId>` (Learn
     English study pages). No `exam` param → direct `topic_study_content` lookup.
  If English study pages ever show "under development" for a topic that HAS a DB
  row, check this route first — a regression once made direct mode require `exam`.

---

## 0. Target architecture decision (2026-07-22)

**English study content will move to its own table — `english_study_content` —
separate from exam content.** Rationale: English and exam are distinct domains and
must not mix; they are related only by `user_id`. This mirrors how
questions/progress are already separated (`english_questions`/`english_progress`
vs `fact_exam_questions`/`cached_questions`/`question_attempts`).

Planned content-phase steps (deferred until frontend work is complete):
1. Create `english_study_content` (same schema as §2, minus exam-only concerns).
2. Author fresh, Cambridge-aligned content directly into it for the full English
   topic set (the existing 116 rows are below standard and will be recreated, not
   migrated).
3. Repoint the English study API (`/api/study-content` direct mode, or a new
   `/api/english/study-content`) and `db.ts` helpers at the new table.
4. Purge the 116 English rows from `topic_study_content`, leaving that table
   exam-only.

Until then, §2 below describes the CURRENT (shared) storage. Do not migrate the
soon-to-be-deleted rows; the split happens once, when new content is ready.

**Current domain separation (verified):**
- Questions: English → `english_questions`; Exam → `fact_exam_questions` +
  `cached_questions`. Fully separate tables.
- Progress: English → `english_progress`; Exam → `question_attempts`,
  `quiz_sessions`, `topic_mastery`. Fully separate.
- Study content: currently SHARED in `topic_study_content` (segmented by
  `subject_id`). This is the only overlap, and it is what §0 resolves.

---

## 2. Where content lives (current, shared — pre-split)

Table: `topic_study_content` (Supabase Postgres, production).

| Column                   | Type      | Notes |
|--------------------------|-----------|-------|
| `subject_id`             | text      | Always `'english'` for these topics. |
| `path_id`                | text      | `'foundation'` \| `'advanced'` \| `'ielts-toefl'` \| `'real-world'`. New C1/C2 → `'advanced'`. |
| `topic_id`               | text      | MUST match the topic `id` in the TS library exactly (see §4). |
| `title`                  | text      | Display title (e.g. "Cleft Sentences"). |
| `subtitle`               | text      | One-line descriptor shown under the title. |
| `overview`               | text      | Optional longer intro (shown in header area). |
| `content`                | jsonb     | The lesson — `{ "sections": [...] }`. This is the core. |
| `difficulty_level`       | text      | Use `'advanced'` for C1/C2. |
| `estimated_time_minutes` | integer   | Optional; ~30–45 typical. |
| `curriculum_standard`    | text      | Use the CEFR level, e.g. `'CEFR C1'` / `'CEFR C2'`. |
| `prerequisites`          | text[]    | Optional; topic_ids the learner should do first. |
| `textbook_references`    | text[]    | Optional. |

Unique key in practice: (`subject_id`, `path_id`, `topic_id`).

---

## 3. `content` JSONB schema (what the renderer supports)

Source of truth = `src/components/study-material-content-v2.tsx`. The renderer
walks `content.sections`, and for each section renders its `content[]` array of
**blocks**. Supported block `type` values (anything else renders a red
"Unknown content type" warning):

```jsonc
{
  "sections": [
    {
      "id": "introduction",              // stable slug, unique within the topic
      "title": "What is X?",             // section heading
      "content": [                        // array of BLOCKS (this is the shape
                                          // used by all advanced English topics)
        { "type": "paragraph", "text": "..." },

        { "type": "list",
          "title": "Optional heading",
          "items": ["point one.", "point two."],
          "examples": [                    // optional
            { "text": "Example.", "explanation": "Why it works." }
          ]
        },

        { "type": "example",
          "title": "Optional heading",
          "examples": [
            { "text": "Had I known, I would have called.",
              "explanation": "Type-3 inverted conditional; formal register.",
              "context": "optional", "meaning": "optional", "breakdown": "optional" }
          ]
        },

        { "type": "formula",             // great for grammar patterns/structures
          "title": "The pattern",
          "formula": "Had + subject + past participle, ...",
          "description": "optional italic line",
          "explanation": "optional",
          "examples": [ { "text": "...", "explanation": "..." } ]
        },

        { "type": "note",                // amber callout
          "title": "Watch out",
          "text": "A key caution or tip." },   // note also accepts "content"

        { "type": "table",
          "title": "Optional",
          "headers": ["Normal", "Inverted"],
          "rows": [ ["If I were...", "Were I..."] ] },

        { "type": "practice",            // Q&A practice block
          "title": "Practice",
          "instructions": "optional italic line",
          "questions": [
            { "question": "Rewrite using inversion: If you should need help...",
              "answer": "Should you need help, ...",
              "explanation": "Why this is the correct transformation." }
          ]
        }
      ]
    }
  ]
}
```

### Special renderer behaviors to know
- A section whose title contains **"core concepts"** is rendered as a flashcard
  navigator and expects a `cards` array (or markdown), NOT a `content[]` array.
  For C1/C2 topics, **avoid titling a section "Core Concepts"** — use titles like
  "Core Structures", "How It Works", etc., so the standard block renderer applies.
- Blocks with a string `content` (markdown) instead of a `content[]` array take a
  different, simpler markdown path. For rich lessons, always use the `content[]`
  block array shown above.
- `example`/`formula`/`list` example items can be plain strings OR
  `{ text, explanation }` objects. Prefer objects — the explanation teaches.

---

## 4. Topic ID consistency (non-negotiable)

The `topic_id` in `topic_study_content` MUST equal the topic `id` in the TS
library, or the study page 404s ("under development").

| Layer          | Location                                              | Example |
|----------------|-------------------------------------------------------|---------|
| TS definition  | `src/lib/english-advanced-path.ts` (modules 8–13)     | `id: 'cleft-sentences'` |
| Route          | `/english/advanced/cleft-sentences/study`             | URL segment |
| API query      | `?subject=english&topic=cleft-sentences&path=advanced`| params |
| DB row         | `topic_id='cleft-sentences'`, `path_id='advanced'`    | column values |

The 33 new topic ids are defined in `english-advanced-path.ts` modules 8–13.
Load them from there — never guess from memory.

---

## 5. Quality bar (ZERO TOLERANCE — from CLAUDE.md)

Every block of every section is checked. Reject and rewrite if any of these appear:

- ❌ Generic placeholders ("Understanding this grammar point improves...",
  "Native speakers use this...", "Apply the rule.", "[Example]", "[Correct form]").
- ❌ Incomplete sentences — every paragraph/explanation ends with `.` `!` `?` or `:`.
- ❌ Short paragraphs — paragraph text must be **> 50 characters** (headers exempt).
- ❌ **Exam references** — no UPSC, SSC, banking, railway, IELTS, TOEFL,
  "competitive exam". Content is **universal English learning**. (Note: some
  *existing* legacy rows still contain exam references — clean those opportunistically.)
- ❌ Empty arrays — `examples: []`, `questions: []`, `items: []`.

Accept only if:
- ✅ Real, topic-specific examples (correct usage + common wrong→right where useful).
- ✅ Complete sentences, proper punctuation, meaningful length.
- ✅ Educational explanation attached to every example.
- ✅ CEFR/Cambridge-aligned framing (see §6).

**Do NOT insert placeholder rows to "fill" the 33 empty topics.** A missing row
renders an honest "coming soon" state; a placeholder row is fake content that
violates the rule above and must later be detected and replaced. Author real
content or leave the topic empty.

---

## 6. Cambridge / CEFR alignment for C1/C2

Target the Cambridge descriptors so "Expert" means something concrete:

- **C1 (Advanced / CAE):** nuance, formality, near-native control. Topics cover
  cleft/fronting, participle clauses, advanced passive & reporting, subjunctive,
  nominalisation, hedging, discourse markers, ellipsis, word formation, advanced
  phrasal verbs, register control, advanced essays/proposals, reading for inference.
- **C2 (Proficiency / CPE = "Expert"):** full mastery, subtlety, effortless
  fluency. Topics cover stylistic inversion, complex fronting, nuanced modality,
  mixed hypotheticals, cohesion mastery, idiomatic mastery, figurative language,
  collocation precision, near-synonym nuance, rhetorical devices, formality
  gradation, paraphrase/summary, pragmatics & implicature, proficiency
  writing/speaking, reading for tone & attitude.

A good C1/C2 topic lesson has ~6–9 sections: intro → core structure(s) with
`formula` + `example` blocks → transformation/usage rules → register & when-to-use
→ common mistakes (`example` wrong→right or `note`) → practice (`practice` block).

---

## 7. Authoring recipe (repeatable)

1. **Load the topic list from the TS library**, not memory:
   `english-advanced-path.ts` modules 8–13 for the 33 C1/C2 ids + subtopics.
2. **Draft content** as `{ sections: [...] }` using only the block types in §3.
   Use each topic's `subtopics` as the section backbone.
3. **Self-scan against §5** before writing to the DB. A scan script should flag
   GENERIC_PLACEHOLDER, INCOMPLETE_SENTENCE, SHORT_PARAGRAPH, EXAM_REFERENCE,
   EMPTY_ARRAY, and UNKNOWN_BLOCK_TYPE.
4. **Upsert** into `topic_study_content` with
   `ON CONFLICT (subject_id, path_id, topic_id) DO UPDATE`. Set
   `difficulty_level='advanced'`, `curriculum_standard='CEFR C1'|'CEFR C2'`.
5. **Re-scan** the DB → confirm 0 issues for the authored topics.
6. **Verify rendering path**: the topic id resolves via `getTopicById` and the
   study page fetches `?subject=english&topic=<id>&path=advanced`.
   (Live HTTP check requires network egress; otherwise verify via DB + build.)
7. **Author incrementally** — a few topics per pass, each fully verified, rather
   than a large batch of thin stubs.

### Insert/upsert SQL shape
```sql
INSERT INTO topic_study_content
  (subject_id, path_id, topic_id, title, subtitle, overview,
   content, difficulty_level, estimated_time_minutes, curriculum_standard)
VALUES ('english', 'advanced', $1, $2, $3, $4, $5::jsonb, 'advanced', $6, $7)
ON CONFLICT (subject_id, path_id, topic_id) DO UPDATE
  SET title = EXCLUDED.title,
      subtitle = EXCLUDED.subtitle,
      overview = EXCLUDED.overview,
      content = EXCLUDED.content,
      difficulty_level = EXCLUDED.difficulty_level,
      curriculum_standard = EXCLUDED.curriculum_standard,
      updated_at = NOW();
```

> **Production write policy:** writing to `topic_study_content` is a production DB
> write and requires explicit user authorization naming the target before running.

---

## 8. The 33 topics awaiting content

Defined in `src/lib/english-advanced-path.ts`:

**C1 (path_id `advanced`, curriculum `CEFR C1`) — 14**
`cleft-sentences`, `fronting-emphasis`, `participle-clauses`,
`advanced-passive-reporting`, `subjunctive-unreal-past`, `nominalisation`,
`hedging-cautious-language`, `discourse-markers-cohesion`, `ellipsis-substitution`,
`word-formation-affixation`, `advanced-phrasal-verbs`, `advanced-essay-genres`,
`reading-for-inference`, `register-tone-control`.

**C2 / Expert (path_id `advanced`, curriculum `CEFR C2`) — 18**
`stylistic-inversion`, `complex-fronting-thematisation`,
`advanced-ellipsis-substitution`, `nuanced-modality`, `mixed-hypotheticals`,
`cohesion-referencing-mastery`, `idiomatic-mastery`, `figurative-language`,
`collocation-precision`, `near-synonym-nuance`, `advanced-word-formation`,
`rhetorical-devices`, `formality-gradation`, `paraphrase-summary-mastery`,
`pragmatics-implicature`, `proficiency-writing`, `reading-tone-attitude`,
`proficiency-speaking`.
