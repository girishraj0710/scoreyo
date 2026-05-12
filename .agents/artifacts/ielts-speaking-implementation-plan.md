# IELTS Speaking Implementation Plan

**Issue**: IELTS Speaking currently shows MCQs instead of voice-based questions

**Current State**: Mapped to "idioms" topic (26 MCQ questions)

**Expected**: Real IELTS Speaking test format with voice recording

---

## 🎯 Proper IELTS Speaking Test Format

### Part 1: Introduction & Interview (4-5 mins)
- General questions about yourself
- Familiar topics (home, family, work, studies, interests)
- Example: "Tell me about your hometown", "Do you like reading?"

### Part 2: Long Turn (3-4 mins)
- Cue card with topic
- 1 minute preparation time
- 2 minutes speaking
- Example: "Describe a memorable event in your life"

### Part 3: Discussion (4-5 mins)
- Abstract questions related to Part 2 topic
- More complex discussions
- Example: "How have celebrations changed in your country?"

---

## 📋 Implementation Options

### Option 1: Quick Fix (Today - 1 hour)
**Change IELTS Speaking to text-based prompts instead of MCQs**

Changes:
1. Create special question format for speaking topics
2. Show cue cards with prompts
3. Display sample answer after user attempts
4. No voice recording yet

Pros:
- Quick to implement
- Better than MCQs
- Users can practice speaking (even without recording)

Cons:
- No voice recording
- Can't evaluate pronunciation
- Less authentic

### Option 2: Voice Recording Feature (This Week - 1 day)
**Add voice recording capability**

Tech Stack:
- Browser Web Audio API (MediaRecorder)
- Record audio in browser
- Store temporarily (no backend needed for MVP)
- Play back recording

Features:
- Record button
- Timer (2 mins for Part 2)
- Playback capability
- Sample answers for comparison

Pros:
- Authentic IELTS experience
- Users can hear themselves
- Practice pronunciation

Cons:
- No AI evaluation (need speech-to-text API)
- No scoring
- Browser compatibility issues possible

### Option 3: Full AI Evaluation (Next Month - 1 week)
**Complete IELTS Speaking simulation with AI scoring**

Features:
- Voice recording
- Speech-to-text (Whisper API)
- AI evaluation (GPT-4 scoring)
- Fluency, pronunciation, grammar feedback
- Band score (1-9)

Tech Stack:
- OpenAI Whisper for transcription
- GPT-4 for evaluation
- Audio storage (Vercel Blob or S3)

Pros:
- Professional-grade experience
- Real feedback
- Band score prediction
- Competitive advantage

Cons:
- Expensive (API costs)
- Complex implementation
- Need error handling

---

## 🚀 Recommended Approach

**Phase 1 (Today)**: Quick fix with text prompts
- Remove MCQs from IELTS Speaking
- Show cue cards and discussion prompts
- Display sample answers
- Allow text input (as practice)

**Phase 2 (This Week)**: Add voice recording
- Browser-based audio recording
- Playback capability
- No AI evaluation yet

**Phase 3 (Next Month)**: AI evaluation
- Whisper API for transcription
- GPT-4 for scoring
- Band score prediction

---

## 💻 Quick Fix Implementation (Option 1)

### 1. Create Speaking Question Type

**New table**: `ielts_speaking_questions`
```sql
CREATE TABLE ielts_speaking_questions (
  id INTEGER PRIMARY KEY,
  part INTEGER,  -- 1, 2, or 3
  topic TEXT,
  question TEXT,
  cue_card TEXT,  -- For Part 2
  follow_up TEXT,  -- For Part 3
  sample_answer TEXT,
  tips TEXT,
  keywords TEXT
);
```

### 2. Sample Questions

**Part 1**:
```
Topic: Hometown
Question: "Describe your hometown. What do you like about it?"
Sample Answer: "I'm from Mumbai, a vibrant coastal city..."
Tips: "Mention location, size, special features, personal connection"
```

**Part 2 (Cue Card)**:
```
Describe a book you recently read

You should say:
- What the book was about
- When you read it
- Why you chose to read it
- And explain what you learned from it

Preparation time: 1 minute
Speaking time: 2 minutes
```

**Part 3**:
```
Topic: Reading habits
Question: "How have reading habits changed with technology?"
Sample: "Technology has significantly transformed how people read..."
```

### 3. New API Endpoint

**File**: `src/app/api/english/speaking/route.ts`

```typescript
export async function GET(request: NextRequest) {
  const part = request.nextUrl.searchParams.get("part") || "1";
  
  // Get random speaking question for specified part
  const questions = await getSpeakingQuestions(part);
  
  return NextResponse.json({ questions });
}
```

### 4. New UI Component

**File**: `src/app/english/foundation/ielts-speaking/practice/page.tsx`

Features:
- Part selector (1, 2, 3)
- Timer display
- Question/Cue card display
- Text area for notes (optional)
- "Show Sample Answer" button
- Tips and keywords

---

## 📊 Database Setup

```sql
-- Part 1 Questions (30 questions)
INSERT INTO ielts_speaking_questions VALUES
(1, 1, 'Hometown', 'Tell me about your hometown.', NULL, NULL, 
 'I come from a vibrant city...', 
 'Mention location, population, famous for, personal feelings',
 'coastal, metropolitan, heritage, culture'),

(2, 1, 'Work/Study', 'What do you do? Do you work or are you a student?', NULL, NULL,
 'I am currently a student studying...', 
 'Be specific about field, why you chose it, what you enjoy',
 'major, university, career, passion'),

...

-- Part 2 Cue Cards (20 questions)
INSERT INTO ielts_speaking_questions VALUES
(31, 2, 'Events', NULL, 
 'Describe a memorable event in your life\n\nYou should say:\n- What the event was\n- When it happened\n- Who was there\n- And explain why it was memorable',
 NULL,
 'One of the most memorable events in my life was...',
 'Use past tenses, add details, express emotions',
 'celebration, achievement, milestone, unforgettable'),

...

-- Part 3 Discussion (25 questions)
INSERT INTO ielts_speaking_questions VALUES
(51, 3, 'Technology', 'How has technology changed the way people communicate?', NULL, NULL,
 'Technology has revolutionized communication in several ways...',
 'Discuss both positive and negative aspects, give examples',
 'social media, instant messaging, video calls, connectivity'),

...
```

---

## 🎨 UI Mockup

### Speaking Practice Page

```
┌────────────────────────────────────────────────┐
│  IELTS Speaking Practice - Part 2             │
│  ─────────────────────────────────────────────│
│                                                │
│  [Part 1] [Part 2] [Part 3]                   │
│                                                │
│  📝 Cue Card                                   │
│  ┌──────────────────────────────────────────┐│
│  │ Describe a book you recently read        ││
│  │                                           ││
│  │ You should say:                           ││
│  │  • What the book was about               ││
│  │  • When you read it                      ││
│  │  • Why you chose to read it              ││
│  │  • What you learned from it              ││
│  │                                           ││
│  │ ⏱️ Preparation: 1 minute                  ││
│  │ 🎤 Speaking: 2 minutes                    ││
│  └──────────────────────────────────────────┘│
│                                                │
│  💡 Tips:                                      │
│  • Use past tenses to describe the experience │
│  • Add specific details about the plot       │
│  • Explain personal impact                   │
│                                                │
│  🔑 Keywords: novel, genre, author, themes    │
│                                                │
│  [Start Timer] [Show Sample Answer]           │
│                                                │
│  ─────────────────────────────────────────────│
│  [Next Question] [Back to Topics]            │
└────────────────────────────────────────────────┘
```

---

## ⏱️ Implementation Timeline

### Today (1-2 hours):
- [x] Identify issue
- [ ] Create speaking questions database table
- [ ] Add 30 Part 1 questions
- [ ] Add 20 Part 2 cue cards
- [ ] Add 25 Part 3 discussions
- [ ] Create basic UI component
- [ ] Remove MCQ mapping from IELTS Speaking
- [ ] Test and deploy

### This Week (if needed):
- [ ] Add voice recording
- [ ] Add timer functionality
- [ ] Add audio playback

### Later:
- [ ] AI evaluation with Whisper + GPT-4
- [ ] Band score prediction
- [ ] Fluency/pronunciation feedback

---

## 🔧 Immediate Action

Should I:

**A) Quick fix now** - Change to text-based prompts with cue cards (1-2 hours)

**B) Wait for voice recording** - Implement proper audio recording feature first (1 day)

**C) Keep as is** - IELTS Speaking stays with idioms MCQs for now

**Recommendation**: **Option A** - Quick fix now, add voice recording later. This gives users proper speaking prompts immediately while we work on the voice feature.

---

**Your call!** What would you like me to do?
