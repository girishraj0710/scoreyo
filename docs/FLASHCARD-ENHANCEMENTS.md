# 🚀 Flashcard System Enhancements - Implementation Plan

**Date**: July 11, 2026  
**Status**: ✅ Phase 1 Complete (Community Sharing) → Phase 2 In Progress  
**Goal**: Make flashcards the most engaging feature on Krakkify

---

## 📋 Features to Implement

### 1. ✅ Daily Goals
**Purpose**: Give students clear targets and progress tracking  
**User Story**: "I want to know how many cards I should study today"

**Implementation**:
- Calculate daily goal based on:
  - Due cards (spaced repetition)
  - New cards to learn
  - User preference (20 cards default)
- Show progress bar: "12/20 cards studied today 🎯"
- Celebration animation when goal reached
- Store in `flashcard_daily_goals` table

**DB Schema**:
```sql
CREATE TABLE flashcard_daily_goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_cards INTEGER DEFAULT 20,
  cards_studied INTEGER DEFAULT 0,
  goal_reached BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_goals_user_date ON flashcard_daily_goals(user_id, date);
```

**API**:
- `GET /api/flashcards/daily-goal` - Get today's goal + progress
- `POST /api/flashcards/daily-goal` - Update progress after study session

**UI**:
- Progress bar on `/flashcards` page header
- "🎉 Daily goal reached!" celebration
- Show tomorrow's target

---

### 2. ⭐ Deck Ratings/Reviews
**Purpose**: Quality control for community decks  
**User Story**: "I want to know which decks are worth studying"

**Implementation**:
- 5-star rating system
- Optional text review (max 500 chars)
- Average rating + review count on deck cards
- Filter by "Highest Rated"
- Users can rate each deck once

**DB Schema**:
```sql
CREATE TABLE flashcard_deck_ratings (
  id SERIAL PRIMARY KEY,
  deck_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(deck_id, user_id),
  FOREIGN KEY (deck_id) REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Add to flashcard_decks table
ALTER TABLE flashcard_decks
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

CREATE INDEX idx_ratings_deck ON flashcard_deck_ratings(deck_id);
CREATE INDEX idx_ratings_user ON flashcard_deck_ratings(user_id);
```

**API**:
- `POST /api/flashcards/decks/[deckId]/rate` - Submit rating/review
- `GET /api/flashcards/decks/[deckId]/reviews` - Get all reviews
- Update average_rating on each new rating

**UI**:
- Star rating component on deck cards
- "⭐ 4.8 (23 reviews)" badge
- Modal to submit review
- Reviews page showing all reviews

---

### 3. 🔥 Quiz Integration (KILLER FEATURE)
**Purpose**: Auto-generate flashcards from quiz mistakes  
**User Story**: "I got 5 questions wrong, help me remember them"

**Implementation**:
- After quiz submission, detect wrong answers
- Show prompt: "You missed 5 questions. Create flashcards? 🎯"
- One-click deck generation:
  - Front: Question text
  - Back: Correct answer + explanation
- Auto-link to quiz session
- Track "mistake decks" separately

**DB Schema**:
```sql
-- Add to flashcard_decks table
ALTER TABLE flashcard_decks
ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS source_quiz_session_id TEXT,
ADD COLUMN IF NOT EXISTS created_from_mistakes BOOLEAN DEFAULT false;

-- source_type: 'manual', 'ai_generated', 'quiz_mistakes'
CREATE INDEX idx_decks_source ON flashcard_decks(source_type, user_id);
```

**API**:
- `POST /api/flashcards/from-quiz` - Create deck from quiz session
- Input: sessionId
- Output: Generated deck with mistake cards

**UI**:
- "Create Flashcards from Mistakes" button on quiz results page
- Badge: "📝 From Quiz Mistakes" on deck cards
- Link back to original quiz session

**Integration Point**:
- Modify `/api/quiz` PUT endpoint (quiz submission)
- After saving results, check if wrong answers exist
- Return flag: `{ canCreateFlashcards: true, wrongCount: 5 }`
- Show modal on quiz results page

---

### 4. 🏆 Achievements/Badges (Flashcard-Specific)
**Purpose**: Gamification and motivation  
**User Story**: "I want to feel proud of my study progress"

**Implementation**:
- New badge category: "flashcards"
- Track flashcard-specific stats
- Unlock badges for milestones
- Show on achievements page

**New Badges**:
```typescript
{
  id: "flashcard-creator",
  name: "Deck Builder",
  description: "Create your first flashcard deck",
  icon: "🃏",
  category: "flashcards",
  requirement: { type: "decks_created", value: 1 },
  rarity: "common",
},
{
  id: "flashcard-10-decks",
  name: "Library Curator",
  description: "Create 10 flashcard decks",
  icon: "📚",
  category: "flashcards",
  requirement: { type: "decks_created", value: 10 },
  rarity: "rare",
},
{
  id: "flashcard-100-cards",
  name: "Card Master",
  description: "Study 100 flashcards",
  icon: "🎴",
  category: "flashcards",
  requirement: { type: "cards_studied", value: 100 },
  rarity: "common",
},
{
  id: "flashcard-1000-cards",
  name: "Memory Champion",
  description: "Study 1000 flashcards",
  icon: "🧠",
  category: "flashcards",
  requirement: { type: "cards_studied", value: 1000 },
  rarity: "epic",
},
{
  id: "flashcard-perfect-recall",
  name: "Perfect Recall",
  description: "Get 20 cards correct in a row",
  icon: "✨",
  category: "flashcards",
  requirement: { type: "correct_streak", value: 20 },
  rarity: "rare",
},
{
  id: "flashcard-community-star",
  name: "Community Star",
  description: "Your deck has been studied by 50+ students",
  icon: "⭐",
  category: "flashcards",
  requirement: { type: "deck_unique_students", value: 50 },
  rarity: "epic",
},
```

**DB Schema**:
```sql
-- Add to badge_stats table
ALTER TABLE badge_stats
ADD COLUMN IF NOT EXISTS decks_created INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS cards_studied INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS correct_streak_current INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS correct_streak_best INTEGER DEFAULT 0;
```

**API**:
- Update `checkBadges()` function in `@/lib/achievements`
- Track stats after each study session
- Unlock badges when thresholds met

**UI**:
- Show unlocked flashcard badges on `/achievements` page
- Badge notification after study session
- Progress toward next badge

---

### 5. 🔗 Share Deck Links
**Purpose**: Viral growth, student-to-student sharing  
**User Story**: "I want to share this great deck with my friends"

**Implementation**:
- Generate shareable URL: `krakkify.in/deck/abc123`
- Public deck view page (no auth required)
- QR code generation
- Share buttons: WhatsApp, Telegram, Copy Link
- Track views and shares

**DB Schema**:
```sql
-- Add to flashcard_decks table
ALTER TABLE flashcard_decks
ADD COLUMN IF NOT EXISTS share_slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Auto-generate share_slug on insert (use nanoid)
CREATE INDEX idx_decks_share_slug ON flashcard_decks(share_slug);
```

**API**:
- `GET /api/flashcards/deck/[slug]` - Get public deck by slug
- `POST /api/flashcards/decks/[deckId]/share` - Increment share count
- `POST /api/flashcards/decks/[deckId]/clone` - Clone deck to my account

**UI**:
- Share button on deck cards: 🔗 Share
- Modal with:
  - Shareable link
  - QR code
  - WhatsApp/Telegram quick share
  - Copy link button
- Public deck view page: `/deck/[slug]`
  - Show deck info + cards preview (first 5)
  - "Study This Deck" button (requires login)
  - "Clone to My Library" button

**Integration**:
- Add share button to deck card menu
- Track share analytics
- Show "🔥 Shared 50 times" badge

---

## 🚀 Implementation Order

### Phase 2A: Quick Wins (2-3 days)
1. ✅ **Daily Goals** - Immediate engagement boost
2. ✅ **Share Deck Links** - Viral growth potential

### Phase 2B: Quality & Retention (3-4 days)
3. ⭐ **Deck Ratings/Reviews** - Community quality
4. 🏆 **Flashcard Badges** - Gamification

### Phase 2C: Integration (3-4 days)
5. 🔥 **Quiz Integration** - Complete learning loop

**Total Time**: ~2 weeks for all 5 features

---

## 📊 Success Metrics

**Daily Goals**:
- % of users setting daily goals
- Daily goal completion rate
- Avg cards studied per day

**Deck Ratings**:
- % of decks with ratings
- Avg rating across platform
- Review submission rate

**Quiz Integration**:
- % of users creating flashcards from mistakes
- Conversion rate: quiz → flashcards
- Retention: do students study mistake decks?

**Achievements**:
- Badge unlock rate
- Most popular flashcard badges
- Correlation: badges → retention

**Share Links**:
- Share count per deck
- Viral coefficient (shares → new users)
- Clone rate (shared deck → new deck)

---

## 🎯 Expected Impact

**Engagement**: 📈 +40% daily active users  
**Retention**: 📈 +25% 7-day retention  
**Virality**: 📈 +15% student referrals  
**Quality**: 📈 Better community deck quality via ratings  
**Learning**: 📈 Students master their weak topics via quiz integration

---

## 🔄 Future Enhancements (Phase 3)

- Collaborative decks (multiple contributors)
- Deck collections (bundle related decks)
- Voice/image support (audio pronunciation)
- Import/Export (CSV, Anki)
- Leaderboards (top creators)
- Verified creator badges
- Email notifications (daily reminder)
- Offline mode (sync later)

---

**Next Steps**: Start with Daily Goals + Share Links (quickest wins) ✅
