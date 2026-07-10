# 🎴 FLASHCARD COMMUNITY FEATURE

**Inspired by**: Quizlet's community deck sharing  
**Goal**: Enable students to discover and learn from each other's decks

---

## 🎯 Feature Overview

### User Story:
```
As a GATE student (Student A),
I want to see flashcard decks created by other GATE students,
So I can benefit from their study materials and save time.
```

### Example Flow:
1. **Student A** creates a deck: "Digital Logic" (GATE → Computer Science)
2. Clicks "Share with community" toggle
3. **Student B** (also preparing for GATE) goes to Flashcards
4. Sees "Community Decks" tab
5. Finds "Digital Logic by @studentA" (23 students studying, 4.7★)
6. Clicks to study immediately
7. Progress tracked separately for Student B

---

## 🗄️ Database Schema Changes

### 1. Add Engagement Tracking Table

```sql
-- Track deck usage metrics
CREATE TABLE IF NOT EXISTS flashcard_deck_analytics (
  id SERIAL PRIMARY KEY,
  deck_id INTEGER NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  total_studies INTEGER DEFAULT 0,        -- Total study sessions
  unique_students INTEGER DEFAULT 0,      -- Unique users who studied
  studies_today INTEGER DEFAULT 0,        -- Studies in last 24h
  avg_rating DECIMAL DEFAULT 0,           -- Average rating (0-5)
  total_ratings INTEGER DEFAULT 0,        -- Number of ratings
  last_studied_at TIMESTAMP,              -- Most recent study session
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(deck_id)
);

-- Track individual study sessions
CREATE TABLE IF NOT EXISTS flashcard_study_sessions (
  id SERIAL PRIMARY KEY,
  deck_id INTEGER NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  cards_studied INTEGER DEFAULT 0,
  session_duration INTEGER,               -- Seconds
  created_at TIMESTAMP DEFAULT NOW()
);

-- Track deck ratings (optional)
CREATE TABLE IF NOT EXISTS flashcard_deck_ratings (
  id SERIAL PRIMARY KEY,
  deck_id INTEGER NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(deck_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_analytics_deck ON flashcard_deck_analytics(deck_id);
CREATE INDEX idx_sessions_deck_user ON flashcard_study_sessions(deck_id, user_id);
CREATE INDEX idx_sessions_created ON flashcard_study_sessions(created_at);
CREATE INDEX idx_ratings_deck ON flashcard_deck_ratings(deck_id);
```

### 2. Update Users Table (if not exists)

```sql
-- Add preferred exam to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_exam TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_subjects TEXT[];  -- Array of subject IDs

-- Update existing users (default to null, they'll select on first login)
```

---

## 🔧 API Endpoints

### 1. GET /api/flashcards/community

**Query Params:**
- `exam` - Filter by exam (defaults to user's preferred_exam)
- `subject` - Filter by subject
- `sort` - "popular", "recent", "top-rated"
- `limit` - Number of results

**Response:**
```json
{
  "decks": [
    {
      "id": 42,
      "title": "Digital Logic",
      "topic": "Digital Logic",
      "exam": "gate",
      "subject": "computer-science",
      "card_count": 25,
      "creator": {
        "id": 123,
        "name": "Rajesh Kumar",
        "username": "rajesh_gate2027",
        "avatar": "https://..."
      },
      "analytics": {
        "studies_today": 23,
        "total_studies": 456,
        "unique_students": 89,
        "avg_rating": 4.7,
        "total_ratings": 34
      },
      "created_at": "2026-07-01T10:00:00Z",
      "updated_at": "2026-07-10T15:30:00Z"
    }
  ],
  "total": 145,
  "page": 1
}
```

### 2. PATCH /api/flashcards/decks/[deckId]/visibility

**Body:**
```json
{
  "is_public": true
}
```

**Response:**
```json
{
  "success": true,
  "deck": { "id": 42, "is_public": true }
}
```

### 3. POST /api/flashcards/decks/[deckId]/study-session

**Body:**
```json
{
  "cards_studied": 15,
  "session_duration": 420  // seconds
}
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "total_studies": 457,
    "studies_today": 24
  }
}
```

### 4. POST /api/flashcards/decks/[deckId]/rate

**Body:**
```json
{
  "rating": 5,
  "review_text": "Excellent deck! Very helpful for GATE prep."
}
```

**Response:**
```json
{
  "success": true,
  "avg_rating": 4.8,
  "total_ratings": 35
}
```

---

## 🎨 UI Components

### 1. Flashcards Page - Community Tab

```tsx
// src/app/flashcards/page.tsx

<Tabs defaultValue="my-decks">
  <TabsList>
    <TabsTrigger value="my-decks">My Decks</TabsTrigger>
    <TabsTrigger value="community">
      Community
      <Badge>New</Badge>
    </TabsTrigger>
    <TabsTrigger value="generate">Generate</TabsTrigger>
  </TabsList>

  <TabsContent value="my-decks">
    {/* Existing user decks */}
  </TabsContent>

  <TabsContent value="community">
    <CommunityDecks userExam={user.preferred_exam} />
  </TabsContent>

  <TabsContent value="generate">
    {/* Existing AI generator */}
  </TabsContent>
</Tabs>
```

### 2. Community Decks Component

```tsx
// src/components/flashcards/CommunityDecks.tsx

export function CommunityDecks({ userExam }: { userExam: string }) {
  const [decks, setDecks] = useState<CommunityDeck[]>([]);
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'top-rated'>('popular');

  useEffect(() => {
    fetchCommunityDecks(userExam, sortBy);
  }, [userExam, sortBy]);

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="recent">Recently Created</SelectItem>
              <SelectItem value="top-rated">Top Rated</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Search decks..."
            className="w-64"
          />
        </div>

        <Badge variant="outline">
          {decks.length} decks for {examName}
        </Badge>
      </div>

      {/* Deck Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map(deck => (
          <CommunityDeckCard key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
}
```

### 3. Community Deck Card

```tsx
// src/components/flashcards/CommunityDeckCard.tsx

export function CommunityDeckCard({ deck }: { deck: CommunityDeck }) {
  return (
    <div className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 hover:border-[#F26A4B]/40 hover:-translate-y-1 hover:shadow-xl transition-all"
      onClick={() => router.push(`/flashcards/study/${deck.id}`)}>
      
      {/* Header: Exam Badge + Engagement */}
      <div className="flex items-center justify-between mb-3">
        <Badge className="bg-[#2A9D8F] text-white">
          {deck.exam.toUpperCase()}
        </Badge>

        {deck.analytics.studies_today > 0 && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <TrendingUp className="w-3 h-3" />
            <span>{deck.analytics.studies_today} today</span>
          </div>
        )}
      </div>

      {/* Title + Topic */}
      <h3 className="font-heading text-xl font-black text-[#16213E] dark:text-white leading-tight mb-1">
        {deck.title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        {deck.topic}
      </p>

      {/* Creator Info */}
      <div className="flex items-center gap-2 mb-4">
        <Avatar className="w-6 h-6">
          <AvatarImage src={deck.creator.avatar} />
          <AvatarFallback>{deck.creator.name[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          by @{deck.creator.username}
        </span>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {deck.card_count} cards
        </span>

        <div className="flex items-center gap-3">
          {/* Rating */}
          {deck.analytics.avg_rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {deck.analytics.avg_rating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">
                ({deck.analytics.total_ratings})
              </span>
            </div>
          )}

          {/* Students */}
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {deck.analytics.unique_students}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4. Share Toggle on User's Decks

```tsx
// Add to existing deck card in My Decks tab

<div className="flex items-center justify-between">
  <span>Share with community</span>
  <Switch
    checked={deck.is_public}
    onCheckedChange={async (checked) => {
      await fetch(`/api/flashcards/decks/${deck.id}/visibility`, {
        method: 'PATCH',
        body: JSON.stringify({ is_public: checked })
      });
      // Refresh decks
    }}
  />
</div>
```

### 5. Study Session Tracking

```tsx
// Update study page to track sessions

// src/app/flashcards/study/[deckId]/page.tsx

useEffect(() => {
  const startTime = Date.now();
  let cardsStudied = 0;

  return () => {
    // On unmount or exit
    const duration = Math.floor((Date.now() - startTime) / 1000);
    
    fetch(`/api/flashcards/decks/${deckId}/study-session`, {
      method: 'POST',
      body: JSON.stringify({
        cards_studied: cardsStudied,
        session_duration: duration
      })
    });
  };
}, [deckId]);
```

---

## 🎯 User Flow Examples

### Flow 1: Student Creates and Shares Deck

1. **Create Deck**
   - Student A generates "Operating Systems" deck (GATE)
   - 15 cards created via AI

2. **Share with Community**
   - Toggles "Share with community" ON
   - Deck becomes public (visible to GATE students)

3. **Others Discover**
   - Student B (GATE student) goes to Community tab
   - Sees "Operating Systems by @studentA"
   - Clicks to study immediately

4. **Engagement Tracked**
   - Badge shows "5 students today"
   - Rating: 4.8★ (after 12 ratings)
   - Student A sees their deck is helping others

### Flow 2: Exam-Based Filtering

**Student Preferences:**
- Student A: GATE (Computer Science)
- Student B: JEE (Physics)
- Student C: UPSC (History)

**Community Tab Shows:**
- Student A sees: GATE CS decks (Digital Logic, OS, Networks)
- Student B sees: JEE Physics decks (Mechanics, Thermodynamics)
- Student C sees: UPSC History decks (Ancient India, Freedom Struggle)

**Cross-Exam Discovery (Optional):**
- Toggle "Show all exams" to see decks from other exams
- Example: GATE student might study Math decks from JEE

### Flow 3: Rating and Reviews

1. Student studies a community deck
2. After finishing, prompted: "Rate this deck?"
3. Selects 5 stars + optional review
4. Review shows on deck card
5. Creator gets notification (future feature)

---

## 💡 Smart Features

### 1. Relevance Ranking

**Algorithm:**
```typescript
function calculateRelevance(deck, user) {
  let score = 0;

  // Exact exam match (highest priority)
  if (deck.exam_id === user.preferred_exam) {
    score += 100;
  }

  // Subject match
  if (user.preferred_subjects?.includes(deck.subject_id)) {
    score += 50;
  }

  // Engagement (popular decks rank higher)
  score += deck.analytics.studies_today * 2;
  score += deck.analytics.unique_students * 0.5;

  // Quality (high-rated decks rank higher)
  score += deck.analytics.avg_rating * 10;

  // Recency (newer decks get small boost)
  const daysOld = (Date.now() - deck.created_at) / (1000 * 60 * 60 * 24);
  if (daysOld < 7) score += 20;

  return score;
}
```

### 2. Trending Decks

**Criteria:**
- Studies increased 50%+ in last 24h
- Rating 4.5+ with 10+ ratings
- Created in last 30 days

**Display:**
```tsx
<Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-pink-500">
  🔥 Trending
</Badge>
```

### 3. Verified Creators

**For:**
- Teachers
- Top contributors (100+ decks)
- Exam toppers

**Display:**
```tsx
<div className="flex items-center gap-1">
  <span>by @professor_gate</span>
  <BadgeCheck className="w-4 h-4 text-blue-500" />
</div>
```

### 4. Duplicate Detection

**Before making public:**
```typescript
// Check if similar deck exists
const similarDecks = await findSimilarDecks(exam, subject, topic);

if (similarDecks.length > 0) {
  showWarning("Similar decks exist. Consider studying those first or add unique content.");
}
```

---

## 🔒 Privacy & Moderation

### Privacy Settings:

**User Profile:**
- Show real name: Yes/No
- Show username publicly: Yes/No (default: Yes)
- Allow others to study my decks: Yes/No (default: Yes)

**Deck Settings:**
- Public/Private toggle
- Allow ratings: Yes/No
- Allow comments (future): Yes/No

### Moderation:

**Auto-Moderation:**
- Filter offensive content in deck titles
- Detect spam (same deck created 10+ times)
- Quality threshold (min 5 cards, properly formatted)

**User Reports:**
- "Report deck" button
- Reasons: Spam, Incorrect content, Offensive, Copyright
- Admin review queue

**Quality Control:**
- Decks with <3.0 rating → Hidden from discovery
- Decks with 5+ reports → Auto-hidden, pending review
- Verified creators → Skip moderation

---

## 📊 Analytics Dashboard (for Creators)

**Show deck creators:**
```tsx
// src/app/flashcards/my-decks/[deckId]/analytics

<div className="grid grid-cols-3 gap-4">
  <StatCard
    title="Total Studies"
    value={analytics.total_studies}
    icon={<BookOpen />}
  />
  
  <StatCard
    title="Unique Students"
    value={analytics.unique_students}
    icon={<Users />}
  />
  
  <StatCard
    title="Average Rating"
    value={analytics.avg_rating.toFixed(1)}
    icon={<Star />}
  />
</div>

{/* Chart: Studies over time */}
<LineChart data={analytics.studies_per_day} />

{/* Recent Reviews */}
<div className="mt-6">
  <h3>Recent Reviews</h3>
  {analytics.recent_reviews.map(review => (
    <ReviewCard key={review.id} review={review} />
  ))}
</div>
```

---

## 🚀 Implementation Phases

### Phase 1: Basic Sharing (Week 1)
- [ ] Add `is_public` toggle to user decks
- [ ] Create community API endpoint
- [ ] Show community decks filtered by exam
- [ ] Basic deck card with creator info
- [ ] Track study sessions (simple counter)

### Phase 2: Discovery & Engagement (Week 2)
- [ ] Search and filters (exam, subject, sort)
- [ ] Engagement metrics ("23 students today")
- [ ] Trending badge
- [ ] Creator profile page
- [ ] Analytics dashboard for creators

### Phase 3: Quality & Social (Week 3)
- [ ] Rating system (5 stars)
- [ ] Reviews/comments
- [ ] Verified creator badges
- [ ] Report/moderation system
- [ ] Email notifications (optional)

### Phase 4: Advanced (Future)
- [ ] Deck collections/playlists
- [ ] Collaborative decks (multiple creators)
- [ ] Deck templates
- [ ] Import/export
- [ ] Mobile app integration

---

## 💰 Monetization Opportunities

**Pro Features (Optional):**
- Unlimited public decks (free: 5 public, pro: unlimited)
- Analytics dashboard (free: basic, pro: detailed)
- Verified badge (pro members auto-verified)
- Priority in search results (pro decks rank higher)

**Not Recommended:**
- ❌ Charging to access community decks (kills engagement)
- ❌ Charging to make decks public (limits content)

---

## 🎯 Success Metrics

**Engagement:**
- 40%+ of users browse community tab
- 20%+ of users study community decks
- 10%+ of users create public decks

**Quality:**
- Average deck rating: 4.2+
- <5% of decks reported
- 80%+ of decks have 2+ students

**Growth:**
- New public decks: 50+/week
- Active creators: 100+ users
- Community studies: 1000+/day

---

## ✅ Summary

**What This Adds:**
1. ✅ Community deck discovery (Quizlet-like)
2. ✅ Exam-based filtering (GATE sees GATE decks)
3. ✅ Creator attribution (username, avatar)
4. ✅ Engagement metrics (students today, ratings)
5. ✅ Quality control (ratings, moderation)
6. ✅ Analytics for creators (track impact)

**Benefits:**
- **For Students**: More content, learn from peers, save time
- **For Creators**: Recognition, help others, analytics
- **For Platform**: More engagement, retention, network effects

**Implementation:**
- Phase 1 (basic): ~1 week
- Phase 2 (complete): ~2-3 weeks
- Phase 3 (polish): ~1 week

**Estimated Cost:**
- Development: Already scoped
- Storage: Minimal (public decks use same storage)
- Moderation: Manual initially, auto-moderation later

---

**Ready to implement? Start with Phase 1 (basic sharing) and iterate!** 🚀
