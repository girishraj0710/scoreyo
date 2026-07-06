# Krakkify - Smart Exam Prep for Indian Competitive Exams

## 🧠 MANDATORY: Foundational Playbooks (READ BEFORE ANY WORK)

**Claude MUST consult these documents before implementing ANY feature:**

1. **[Krakkify Intelligence Architecture (KIA)](docs/Krakkify Intelligence Architecture (KIA).md)**
   - **Purpose**: Your AI Operating System - defines all 10 layers (Mission → Memory)
   - **When to Read**: Start of EVERY session, before ANY feature work
   - **Key Concepts**: Decision engines, expert agents, review layers, quality gates

2. **[AI Engineering Playbook v1.0](docs/AI Engineering Playbook v1.0.md)**
   - **Purpose**: Engineering standards (7-phase workflow, quality rubric, code standards)
   - **When to Read**: Before implementing features, database changes, API work
   - **Key Concepts**: Think → Research → Design → Evaluate → Plan → Implement → Review

3. **[AI UI/UX Bible v1.0](docs/AI UI:UX Bible v1.0.md)**
   - **Purpose**: Design philosophy - clarity over beauty, student-first, 9-step thinking process
   - **When to Read**: Before creating/modifying ANY screen, component, or interaction
   - **Key Concepts**: 3-second clarity rule, information hierarchy, accessibility, mobile-first

4. **[AI Question Generation Playbook v1.0](docs/AI Question Generation Playbook v1.0.md)**
   - **Purpose**: Standards for quiz questions (competency-driven, distractor quality, exam intelligence)
   - **When to Read**: When generating quiz questions, mock tests, practice problems
   - **Key Concepts**: Blueprint → Draft → Validate → Review, official syllabus as source of truth

5. **[AI Curriculum Playbook v1.0](docs/AI Curriculum Playbook v1.0.md)**
   - **Purpose**: Learning content design (concept sequencing, active recall, spaced revision)
   - **When to Read**: When creating study materials, topic explanations, lesson structures
   - **Key Concepts**: Prerequisite mapping, retrieval practice, misconception library

---

## Project Overview
AI-powered exam preparation app for **74+ Indian competitive exams** covering ALL major categories: Engineering (JEE, NEET, GATE, State CETs), Government Jobs (UPSC, SSC, Banking, Railways, Police), MBA (CAT, XAT), Law (CLAT, AILET), Teaching (CTET), Defense (NDA, CDS), and more.

**CRITICAL**: We serve ALL 74 exams with equal priority - not just top 10. Every exam must have:
- ✅ Complete subject mappings (exam-specific → shared subjects)
- ✅ All topics linked correctly in bridge table
- ✅ Questions accessible via quiz generation
- ✅ Study materials available
- ✅ Mock tests configured (for major exams)

**One broken exam = students fail to prepare = platform reputation at stake.**

Features: Quiz engine with 3-tier question sourcing (verified bank → cached → AI generation), mock tests, spaced repetition review, performance reports, mistake tracking, AI clarifications, and Razorpay payments.

## 🚦 Claude's Mandatory Workflow (Every Task, Every Time)

### Pre-Implementation Checklist:
```
Before ANY code changes:
□ Read relevant playbook sections (UI/UX for screens, Engineering for code, Question Gen for quizzes, Curriculum for study content)
□ Understand user goal (from UI/UX Bible: Who? What? Why? How?)
□ Check KIA layers (Mission → Constitution → Knowledge → Reasoning → Decision)
□ Follow 7-phase workflow (Understand → Research → Design → Evaluate → Plan → Implement → Review)
□ Compare at least 2 alternative approaches
□ Verify against quality rubric (score 4+ in all categories)
□ Self-review before presenting
```

### Task Routing (Which Playbook to Consult):
```
UI/Screen changes → Read: AI UI/UX Bible v1.0
Database/API/Code → Read: AI Engineering Playbook v1.0
Quiz questions → Read: AI Question Generation Playbook v1.0
Study content → Read: AI Curriculum Playbook v1.0
Any major decision → Read: Krakkify Intelligence Architecture (KIA)
```

---

## This is your instruction 
1. Think Before CodingDon't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:
State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them — don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask.



2. Simplicity FirstMinimum code that solves the problem. Nothing speculative.


No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.


Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.


3. Surgical ChangesTouch only what you must. Clean up only your own mess.

When editing existing code:
Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it — don't delete it.


When your changes create orphans:
Remove imports/variables/functions that your changes made unused.
Don't remove pre-existing dead code unless asked.


The test: Every changed line should trace directly to the user's request.


4. Goal-Driven ExecutionDefine success criteria. Loop until verified.

Transform tasks into verifiable goals:
"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"


For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]


## 🔴 CRITICAL: COMPREHENSIVE END-TO-END VERIFICATION PROTOCOL 🔴

**NEVER do piecemeal fixes. ALWAYS follow this complete verification flow:**

### 1. UI Layer Verification (MANDATORY FIRST STEP)
```
BEFORE touching database/API/content:
✓ Check UI code for ALL topic definitions
✓ Verify topic IDs match between UI components
✓ Map out complete data flow: UI → API → Database
✓ Identify ALL topics that should exist
```

**Key Files to Check:**
- `src/lib/english-content.ts` — Path definitions
- `src/lib/english-foundation-complete-43.ts` — Foundation topics
- `src/lib/english-advanced-path.ts` — Advanced topics
- `src/app/learn/[subject]/[pathId]/[topicId]/page.tsx` — Topic rendering
- `src/components/learn/*` — Study components

### 2. API Layer Verification
```
✓ Check /api/study-content route for data fetching
✓ Verify query parameters (subject_id, path_id, topic_id)
✓ Test error handling for missing content
✓ Confirm JSON response structure matches UI expectations
```

### 3. Database Schema Verification
```
✓ Check topic_study_content table structure
✓ Verify column types: content JSONB, path_id TEXT, topic_id TEXT
✓ Confirm indexes exist for fast lookups
✓ Test queries with actual topic IDs from UI
```

### 4. Content Structure Verification (DEEP DIVE)
```
For EVERY topic, check EVERY section, check EVERY block:

content: {
  sections: [
    {
      title: string,
      content: [
        {
          type: 'paragraph',
          text: string  ← CHECK: No generic text, proper punctuation, >50 chars
        },
        {
          type: 'example',
          examples: [
            {
              text: string,      ← CHECK: Real specific examples
              explanation: string ← CHECK: Educational value
            }
          ]
        },
        {
          type: 'practice',
          questions: [
            {
              question: string,
              answer: string,
              explanation: string
            }
          ]
        },
        {
          type: 'note',
          text: string
        }
      ]
    }
  ]
}
```

### 5. Content Quality Verification (ZERO TOLERANCE)
```
❌ REJECT if found:
- Generic placeholders: "Understanding this grammar point improves..."
- Incomplete sentences: Text not ending with . ! ? :
- Short paragraphs: <50 characters (unless headers)
- Exam references: UPSC, SSC, banking, railway, competitive exam
- Empty arrays: examples: [], questions: []
- Placeholder text: "[Example]", "[Correct form]", "Apply the rule"

✅ ACCEPT only if:
- Real, specific examples for the topic
- Complete sentences with proper punctuation
- Meaningful paragraph length (>50 chars)
- Universal English learning (no exam-specific references)
- Educational value in every example/explanation
```

### 6. Comprehensive Scanning Protocol
```python
# ALWAYS create a comprehensive scan script that:

1. Loads ALL topics from UI definitions (not guessing)
2. Fetches ALL content from database
3. Checks EVERY section of EVERY topic
4. Detects ALL issue types:
   - GENERIC_EXAMPLE
   - INCOMPLETE_SENTENCE
   - SHORT_PARAGRAPH
   - EXAM_REFERENCE
   - EMPTY_CONTENT
5. Generates detailed report with:
   - Total topics scanned
   - Total sections checked
   - Issue count by type
   - Specific locations of issues
6. Returns verifiable metrics
```

### 7. Fix-All-At-Once Protocol (NO PIECEMEAL)
```python
# When fixing issues, create ONE comprehensive script that:

1. Loads real content library for ALL topic types
2. Processes ALL topics in ONE pass
3. Fixes ALL issue types simultaneously:
   - Replace generic examples → Real topic-specific examples
   - Complete incomplete sentences → Add proper endings
   - Expand short paragraphs → Meaningful content
   - Remove exam references → Universal language
4. Updates database with atomic transactions
5. Commits only after ALL topics processed
6. Verifies ZERO issues remain
```

### 8. Post-Fix Verification (MANDATORY)
```
After ANY content changes:
✓ Re-run comprehensive scan script
✓ Verify ZERO issues remain
✓ Test specific topics user mentioned in screenshots
✓ Check topic IDs match UI definitions
✓ Confirm database queries return correct content
✓ Test UI rendering with real data
✓ Verify no cache issues (check updated_at timestamps)
```

### 9. Topic ID Consistency Check
```
ALWAYS verify topic IDs match across:
✓ UI component props: topicId in page.tsx
✓ Database queries: WHERE topic_id = %s
✓ Content definitions: topic_id in english-content.ts
✓ API routes: params.topicId in route handlers

Mismatch = content not found = broken user experience
```

### 10. Real Content Requirements
```
Every example MUST be:
✓ Topic-specific (not generic fallback)
✓ Grammatically correct
✓ Educationally valuable
✓ Clear and concise
✓ With explanation that teaches

For grammar topics:
✓ Show correct usage with real sentences
✓ Include wrong vs right examples for common mistakes
✓ Provide context for when to use the structure
✓ Add practical application examples
```

### Example of WRONG vs RIGHT Approach:

❌ **WRONG (Piecemeal):**
```
User: "Fix imperative-mood topic"
Claude: "Let me fix just that one topic..."
Result: 1 topic fixed, 115 still broken
```

✅ **RIGHT (Comprehensive):**
```
User: "Fix imperative-mood topic"
Claude: 
1. Check UI: Load ALL 116 topic IDs from english-*.ts files
2. Scan DB: Check ALL 116 topics, 782 sections for issues
3. Report: "Found 206 issues across 50 topics"
4. Fix: Create comprehensive script that fixes ALL 206 issues in one pass
5. Verify: Re-scan confirms ZERO issues remain
6. Test: Check user's specific topic + others for completeness
```

### Verification Checklist for EVERY Content Task:
```
□ Checked UI code for topic definitions
□ Verified topic IDs match across UI/API/DB
□ Scanned ALL topics, not just the one mentioned
□ Created comprehensive fix script (not one-off)
□ Fixed ALL issue types simultaneously
□ Verified ZERO issues remain after fix
□ Tested specific topics from user screenshots
□ Confirmed content renders correctly in UI
□ Documented what was fixed and verification results
□ Created reusable scripts for future similar tasks
```

**Golden Rule**: If you're about to fix "one topic" or "one section" — STOP. Scan ALL first, fix ALL together, verify ALL complete.

## Tech Stack
- **Framework**: Next.js 16.2.4 (App Router, TypeScript, Tailwind CSS)
- **Database**: Supabase PostgreSQL (cloud) — Mumbai region
- **AI**: OpenRouter API (Gemini) for question generation
- **Payments**: Razorpay (test mode)
- **Email OTP**: Resend
- **Auth**: Cookie-based (`krakkify-user-id`)

## Key Files
- `src/lib/db.ts` — All database functions (async, PostgreSQL via pg pool)
- `src/lib/exams.ts` — Exam/subject/topic definitions
- `src/lib/quiz-generator.ts` — AI question generation via OpenRouter
- `src/lib/question-bank.ts` — Verified question bank
- `src/lib/mock-test-config.ts` — Mock test configs (8 exams)
- `src/lib/i18n/translations.ts` — Multilingual (8 languages: en, hi, ta, te, bn, mr, gu, kn)
- `src/context/user-context.tsx` — User auth context
- `src/context/locale-context.tsx` — Language context
- **Learn English Study Content:**
  - `src/lib/english-content.ts` — Master English paths definitions (foundation, advanced, ielts-toefl, real-world)
  - `src/lib/english-foundation-complete-43.ts` — All 43 foundation topics (A1-B1 level)
  - `src/lib/english-advanced-path.ts` — All 22 advanced topics (B2-C1 level)
  - `src/app/learn/[subject]/[pathId]/[topicId]/page.tsx` — Topic study page renderer
  - `src/components/learn/TopicContent.tsx` — Content block renderer (paragraphs, examples, practice)
  - Database: `topic_study_content` table (subject_id, path_id, topic_id, title, content JSONB)

## API Routes
- `/api/auth` — Login/register (OTP verified)
- `/api/auth/otp` — Send/verify OTP via Resend
- `/api/quiz` — Generate quiz (3-tier: verified → cached → AI) + submit results
- `/api/stats` — User dashboard stats
- `/api/review` — Spaced repetition review data
- `/api/leaderboard` — Personal bests, milestones
- `/api/mock-test` — Full-length timed mock tests (Pro only)
- `/api/reports` — Detailed performance analytics (Pro only)
- `/api/payment` — Razorpay order creation + verification
- `/api/subscription` — Subscription status check
- `/api/report` — Report incorrect questions
- `/api/weakness` — Record/retrieve mistake patterns (NEW)
- `/api/clarify` — AI instant clarification chat (NEW)
- `/api/dpp` — Daily Practice Problems management (NEW)
- `/api/sprint` — Live leaderboard sprint competitions (NEW)
- `/api/study-content` — Fetch study materials for topics (Study Mode)
  - Query params: `subject`, `path`, `topic`
  - Returns: `{ title, content: { sections: [...] } }`
  - Content blocks: paragraph, example, practice, note, formula, list, table

## Monetization
- **Free**: 3 quizzes/day, basic features
- **Pro Monthly**: ₹79/month — unlimited quizzes, mock tests, reports
- **Pro Quarterly**: ₹149/quarter (₹50/month, save 37%)

## Environment Variables (.env.local)
```
OPENROUTER_API_KEY=...
RESEND_API_KEY=...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
POSTGRES_URL=postgresql://...
```

## GitHub
- Repo: https://github.com/girishraj0710/krakkify (private)
- Branch: main

## Current Status (June 2026)
- ✅ Phase 1: Quiz engine, auth, dashboard, review, leaderboard
- ✅ Phase 2: OTP email auth, multilingual support (8 languages)
- ✅ Phase 3: Razorpay payments, mock tests, performance reports
- ✅ Database migrated from Turso to Supabase PostgreSQL (cloud, production-ready)
- ✅ Deployed to Vercel: https://krakkify.in
- ✅ **PRIMARY DOMAIN**: https://krakkify.in (GoDaddy + Vercel, DNS synced)
- ✅ **ALTERNATE DOMAIN**: https://crackify.in (redirects to krakkify.in via 308 permanent redirect)
- ✅ **LEGACY DOMAIN**: https://krakkify.co.in (kept for backward compatibility, can redirect later)
- ✅ Custom email domain: noreply@krakkify.in (Resend verified, admin: admin@krakkify.in)
- ✅ Production code cleanup: Removed debug logs, security fixes, all hardcoded admin emails updated
- ✅ Multilingual: 8 Indian languages (English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada)
- ✅ **NEW: Gemini AI Recommendations Implemented (6 of 7 priorities = 86%):**
  - ✅ Priority 1: Rich Explanations (logic links, trap alerts, formulas, common mistakes)
  - ✅ Priority 2: Mistake Map (tracks calculation/concept/time/careless errors)
  - ✅ Priority 3: Midnight Doubt AI (instant clarification chat at any time)
  - ✅ Priority 4: Pressure Mode (adaptive timer, stress simulation)
  - ✅ Priority 5: Live Leaderboard Sprints (MVP - backend ready, UI pending)
  - ✅ Priority 7: Daily Practice Problems (10-min micro-learning with streaks)
- ⏳ Deferred: Priority 6 (True Offline Mode - complex, requires Service Worker + IndexedDB)
- ✅ **Study Mode (Learn Before Quiz):**
  - ✅ Universal study pages work for all exams (JEE, NEET, UPSC, SSC, etc.)
  - ✅ Structured content: sections, examples, formulas, common mistakes, practice problems
  - ✅ Progress tracking, table of contents, section navigation
  - ✅ "Study First" button on all quiz topic selections
  - ✅ Dark mode compatible, mobile responsive
  - ✅ Database: `topic_study_content` table in Supabase
  - ✅ Sample content: Thermodynamics (Physics) ready
  - ✅ **English Learning Content - 100% COMPLETE (June 22, 2026)**
    - ✅ **116 topics** fully populated with real content
    - ✅ **782 sections** - all verified complete
    - ✅ **1,632 examples** - all topic-specific, educational
    - ✅ **683 paragraphs** - all properly formatted
    - ✅ **4 learning paths**: Foundation (43 topics), Advanced (22 topics), IELTS/TOEFL (6 topics), Real-world (5 topics)
    - ✅ **ZERO generic placeholders** - comprehensive scan verified
    - ✅ **ZERO exam references** - universal English learning content (not exam-specific)
    - ✅ **Quality Score: 100%** - Production ready
    - ✅ **Content Philosophy**: Generic English learning for worldwide audience, not tied to Indian competitive exams
    - ✅ **Fix Scripts Created**: 
      - `fix-all-ui-topics-comprehensive.py` (50 topics, 205 sections)
      - `final-cleanup-remaining-41-issues.py` (18 topics, 34 sections)
      - `remove-all-exam-references-final.py` (93 topics, 155 sections)
    - ✅ **Verification**: All topics from user screenshots confirmed working (imperative-mood, verbs-basics, common-mistakes, debate-discussion)
  - ⏳ Content generation: Need to add more topics (Chemistry, Biology, History, etc.)
- ✅ **Mobile App Conversion (Capacitor - iOS & Android)**
  - ✅ Capacitor 8.4 integrated (hybrid mode - loads from https://krakkify.in)
  - ✅ iOS platform configured (requires Xcode + CocoaPods for building)
  - ✅ Android platform configured (requires Android Studio + SDK for building)
  - ✅ Native plugins: StatusBar, Keyboard, SplashScreen, Haptics, Browser, App
  - ✅ Mobile-optimized CSS (safe areas, keyboard handling, 44px touch targets)
  - ✅ Deep link support (OTP emails, payment callbacks)
  - ✅ Platform detection utilities (`isNative`, `isIOS`, `isAndroid` in `@/lib/capacitor`)
  - ✅ Razorpay works identically on mobile (no code changes needed)
  - ⏳ App icons & splash screens (need design assets - see `resources/README.md`)
  - ⏳ Testing on physical devices (iPhone + Android)
  - ⏳ App Store & Play Store submissions (post-testing)
  - 📖 Full guide: `MOBILE-APP-SETUP.md`
- ⏳ Later: Razorpay live keys (after app store approval)

---

## 📚 Learn English Content Architecture (100% Complete)

### Content Structure Overview
```
English Learning → 4 Paths → 116 Topics → 782 Sections → 1632 Examples + 683 Paragraphs

Paths:
1. Foundation (43 topics) - A1 to B1 level (basics, tenses, grammar)
2. Advanced (22 topics) - B2 to C1 level (complex structures, formal writing)
3. IELTS/TOEFL (6 topics) - Test preparation (reading, writing, speaking, listening)
4. Real-world (5 topics) - Practical English (conversations, emails, presentations)
```

### Database Schema: `topic_study_content`
```sql
CREATE TABLE topic_study_content (
  id SERIAL PRIMARY KEY,
  subject_id TEXT NOT NULL,        -- 'english'
  path_id TEXT NOT NULL,           -- 'foundation', 'advanced', 'ielts-toefl', 'real-world'
  topic_id TEXT NOT NULL,          -- 'imperative-mood', 'verbs-basics', etc.
  title TEXT NOT NULL,             -- Display title
  content JSONB NOT NULL,          -- Full structured content
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(subject_id, path_id, topic_id)
);

CREATE INDEX idx_topic_lookup ON topic_study_content(subject_id, path_id, topic_id);
```

### Content JSONB Structure (Validated)
```typescript
interface TopicContent {
  sections: Section[];
}

interface Section {
  title: string;           // "Introduction", "Core Concepts", "Examples", etc.
  content: ContentBlock[]; // Array of different block types
}

type ContentBlock = 
  | ParagraphBlock 
  | ExampleBlock 
  | PracticeBlock 
  | NoteBlock 
  | FormulaBlock 
  | ListBlock 
  | TableBlock;

interface ParagraphBlock {
  type: 'paragraph';
  text: string;           // Must end with . ! ? : and be >50 chars
}

interface ExampleBlock {
  type: 'example';
  examples: {
    text: string;         // Real, specific example (NOT generic)
    explanation: string;  // Educational explanation
  }[];
}

interface PracticeBlock {
  type: 'practice';
  questions: {
    question: string;
    answer: string;
    explanation: string;
  }[];
}
```

### UI → API → Database Flow
```
1. User clicks "Study" on topic
   ↓
2. Next.js dynamic route: /learn/english/foundation/imperative-mood
   ↓
3. Page component: src/app/learn/[subject]/[pathId]/[topicId]/page.tsx
   ↓
4. Fetches: GET /api/study-content?subject=english&path=foundation&topic=imperative-mood
   ↓
5. API queries database:
   SELECT content FROM topic_study_content 
   WHERE subject_id='english' AND path_id='foundation' AND topic_id='imperative-mood'
   ↓
6. Returns JSONB content with sections array
   ↓
7. UI renders: TopicContent.tsx loops through sections and blocks
   ↓
8. User sees: Title, paragraphs, examples (with cards), practice questions
```

### Content Quality Standards (ENFORCED)

**✅ REQUIRED for ALL content:**
1. **Real Examples**: Topic-specific, not generic fallbacks
   - ✅ "Sit down. Stand up. Close the door." (imperative-mood)
   - ❌ "Understanding this grammar point improves fluency" (generic)

2. **Proper Punctuation**: All paragraphs end with . ! ? :
   - ✅ "This concept is essential for communication."
   - ❌ "This concept is essential for communication"

3. **Meaningful Length**: Paragraphs must be >50 characters
   - ✅ "Adverbs modify verbs and describe how actions are performed. Regular practice helps."
   - ❌ "Adverbs modify verbs." (too short)

4. **Universal Content**: No exam-specific references
   - ✅ "This topic is essential for English learners."
   - ❌ "This topic is tested in UPSC, SSC, banking exams."

5. **Educational Value**: Every example must teach something
   - ✅ "❌ She don't → ✅ She doesn't" with explanation
   - ❌ "[Correct form]" placeholder

### Verification Scripts (Reusable)

**1. Comprehensive Scan** (`scripts/comprehensive-english-content-audit.py`)
```python
# Scans ALL 116 topics, 782 sections
# Detects: GENERIC_EXAMPLE, INCOMPLETE_SENTENCE, SHORT_PARAGRAPH, EXAM_REFERENCE
# Reports: Issue count by type, specific locations
# Result: 206 issues found initially → 0 issues after fixes
```

**2. Fix-All Script** (`scripts/fix-all-ui-topics-comprehensive.py`)
```python
# Real content library for ALL grammar topics
# Fixes ALL issue types in ONE pass
# Updates database atomically
# Result: 50 topics fixed, 205 sections updated
```

**3. Exam Reference Removal** (`scripts/remove-all-exam-references-final.py`)
```python
# Aggressive regex patterns for UPSC/SSC/banking/railway
# Replaces exam-specific language with universal English learning
# Result: 93 topics cleaned, 155 sections updated
```

### Topic ID Consistency Matrix

**CRITICAL**: Topic IDs must match EXACTLY across all layers:

| Layer | Location | Example |
|-------|----------|---------|
| UI Definition | `src/lib/english-foundation-complete-43.ts` | `id: 'imperative-mood'` |
| Page Route | `/learn/english/foundation/imperative-mood` | URL segment |
| API Query | `?topic=imperative-mood` | Query parameter |
| Database | `WHERE topic_id='imperative-mood'` | Column value |

**Mismatch = Content not found = Broken UX**

### Content Generation Guidelines

When creating NEW English topics:

1. **Check UI first**: Load topic definitions from `english-*.ts` files
2. **Follow structure**: Use validated JSONB schema
3. **Quality checklist**:
   - [ ] Real, specific examples for the topic
   - [ ] All paragraphs >50 chars and end with punctuation
   - [ ] No generic placeholders ("Understanding this...", "Native speakers...")
   - [ ] No exam references (UPSC, SSC, banking, competitive exam)
   - [ ] Educational explanations for every example
   - [ ] Practice questions with answers and explanations
4. **Insert to database**: Use topic_study_content table
5. **Verify**: Run comprehensive scan to confirm zero issues
6. **Test UI**: Load topic in browser, check all sections render

### Common Pitfalls (AVOID)

❌ **Piecemeal fixes**: "Let me fix just imperative-mood"
✅ **Comprehensive approach**: Scan ALL 116 topics, fix ALL issues together

❌ **Generic fallbacks**: Returning "Understanding this..." when topic doesn't match
✅ **Real content library**: Specific examples for 50+ grammar topics

❌ **Incomplete verification**: "Looks good based on one section"
✅ **Full scan**: Check EVERY section of EVERY topic with metrics

❌ **Assuming topic IDs**: Guessing topic names from memory
✅ **Load from UI**: Read actual definitions from english-content.ts files

❌ **Ignoring context**: Fixing database without checking UI/API flow
✅ **End-to-end**: Verify UI → API → Database → Rendering chain

### Success Metrics (Achieved June 22, 2026)

- ✅ **116/116 topics** populated with real content (100%)
- ✅ **782/782 sections** complete and verified (100%)
- ✅ **1,632 examples** - all topic-specific, educational
- ✅ **683 paragraphs** - all properly formatted
- ✅ **0 generic placeholders** (was 156)
- ✅ **0 incomplete sentences** (was 44)
- ✅ **0 short paragraphs** (was 8)
- ✅ **0 exam references** (was 60)
- ✅ **Quality score: 100%** - Production ready

### Lessons Learned

1. **Scan first, fix once**: Never fix individual topics. Always scan ALL, report metrics, fix comprehensively.

2. **UI is source of truth**: Topic IDs, paths, names come from UI code, not assumptions.

3. **Verify end-to-end**: Check UI rendering, API response, database content, not just database.

4. **Real content library**: Build comprehensive examples for all topic types upfront, don't generate on-the-fly.

5. **Zero tolerance policy**: ANY generic placeholder, incomplete sentence, or exam reference = issue to fix.

6. **Metrics prove completion**: "COMPLETE: X topics fixed" vs actual verification scan showing 0 issues.

7. **Reusable scripts**: Save verification and fix scripts for future similar tasks (Chemistry, Biology, etc.).


### Always refer these docs for better results
/Users/girish.raj/prepgenie/docs/AI UI:UX Bible v1.0.md
/Users/girish.raj/prepgenie/docs/AI Question Generation Playbook v1.0.md
/Users/girish.raj/prepgenie/docs/AI Engineering Playbook v1.0.md
/Users/girish.raj/prepgenie/docs/AI Curriculum Playbook v1.0.md
/Users/girish.raj/prepgenie/docs/Krakkify Intelligence Architecture (KIA).md
/Users/girish.raj/prepgenie/docs/AI UI/UX Bible v2.0
/Users/girish.raj/prepgenie/docs/Icon generation.md