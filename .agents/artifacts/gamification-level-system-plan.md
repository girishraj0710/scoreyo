# Level-Based Gamification System - Implementation Plan

## 🎮 Vision
Transform PrepGenie into an engaging, game-like learning experience where students progress through levels, earn stars, and unlock content sequentially - similar to Candy Crush progression.

## 🎯 Core Mechanics

### 1. Level System Architecture
- **Linear Progression**: Can't skip levels - must complete current to unlock next
- **Star Ratings**: 3-star system based on performance
  - ⭐ 1 Star: 60-74% accuracy (Pass - unlocks next level)
  - ⭐⭐ 2 Stars: 75-89% accuracy (Good)
  - ⭐⭐⭐ 3 Stars: 90%+ accuracy (Excellent)
- **Replay Ability**: Replay any completed level to improve star rating
- **Visual Progress Map**: See entire journey with locked/unlocked levels

### 2. For Quiz Section (Main Exams)
Each exam → subject has a **Level Journey**:
- **Level 1-10**: Easy topics, 5 questions each
- **Level 11-20**: Medium topics, 10 questions each
- **Level 21-30**: Hard topics, 15 questions each
- **Boss Levels** (10, 20, 30): Mixed topics, 20 questions

Example for JEE Physics:
```
Level 1: Kinematics Basics (5 easy questions)
Level 2: Motion in Straight Line (5 easy questions)
...
Level 10: BOSS LEVEL - Physics Chapter 1-2 Mix (20 questions)
Level 11: Laws of Motion (10 medium questions)
...
```

### 3. For Learn English Section
Each path has a **Topic Journey**:
- Topics unlock sequentially within each path
- Must complete "Practice" → earn stars → unlock "Test"
- Test completion unlocks next topic
- Each topic = 1 level

Example for Foundation Builder:
```
Level 1: Alphabets & Pronunciation → Practice (5Q) + Test (10Q)
Level 2: Basic Greetings → Practice (5Q) + Test (10Q)
Level 3: Simple Present Tense → Practice (5Q) + Test (10Q)
...
```

## 📊 Database Schema

### New Table: `user_quiz_levels`
```sql
CREATE TABLE user_quiz_levels (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  level_number INTEGER NOT NULL,
  level_type TEXT NOT NULL, -- 'normal' | 'boss'
  is_unlocked INTEGER DEFAULT 0,
  is_completed INTEGER DEFAULT 0,
  stars_earned INTEGER DEFAULT 0, -- 0-3
  best_accuracy INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  completed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, exam_id, subject_id, level_number)
);
```

### New Table: `user_english_levels`
```sql
CREATE TABLE user_english_levels (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  path_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  level_number INTEGER NOT NULL,
  is_unlocked INTEGER DEFAULT 0,
  practice_completed INTEGER DEFAULT 0,
  test_completed INTEGER DEFAULT 0,
  stars_earned INTEGER DEFAULT 0, -- 0-3
  best_accuracy INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  completed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, path_id, topic_id)
);
```

### New Table: `level_definitions`
```sql
CREATE TABLE level_definitions (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  level_number INTEGER NOT NULL,
  level_name TEXT NOT NULL,
  level_type TEXT NOT NULL, -- 'normal' | 'boss'
  difficulty TEXT NOT NULL, -- 'easy' | 'medium' | 'hard'
  topic TEXT,
  question_count INTEGER NOT NULL,
  unlock_requirement TEXT, -- e.g., "Complete Level 9 with 60%+"
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(exam_id, subject_id, level_number)
);
```

## 🎨 UI Components to Build

### 1. Level Map Component (`src/components/level-map.tsx`)
Visual journey showing all levels in a path:
```tsx
<LevelMap>
  - Vertical scrolling path
  - Each level = circular node
  - Connected by curved lines
  - Level states:
    * Locked (gray, lock icon)
    * Unlocked (blue glow, "Start" button)
    * In Progress (orange, "Continue")
    * Completed (green, star rating, "Replay")
  - Boss levels = larger nodes, crown icon
  - Current level highlighted with animation
</LevelMap>
```

### 2. Star Rating Display (`src/components/star-rating.tsx`)
Show performance stars:
```tsx
<StarRating stars={2} maxStars={3} animated />
```

### 3. Level Completion Modal (`src/components/level-complete-modal.tsx`)
Celebration on level completion:
```tsx
<LevelCompleteModal>
  - Confetti animation
  - Star count animation (filling one by one)
  - Performance stats
  - "Next Level" button (if unlocked)
  - "Replay for 3 Stars" button
</LevelCompleteModal>
```

### 4. Progress Bar (`src/components/level-progress-bar.tsx`)
Overall progress:
```tsx
<LevelProgressBar 
  currentLevel={12} 
  totalLevels={30} 
  starsEarned={28} 
  maxStars={90}
/>
```

## 🔧 Implementation Steps

### Phase 1: Database & Backend (2-3 hours)
1. ✅ Create migration script for new tables
2. ✅ Add level definitions data for top 5 exams
3. ✅ Update `/api/quiz/levels` - get user's level progress
4. ✅ Update `/api/quiz` - check if level is unlocked
5. ✅ Add `/api/quiz/complete-level` - save stars, unlock next
6. ✅ Update `/api/english/levels` - get user's English progress
7. ✅ Add `/api/english/complete-level` - save English progress

### Phase 2: Quiz Section UI (3-4 hours)
1. ✅ Create `LevelMap` component
2. ✅ Create `StarRating` component
3. ✅ Create `LevelCompleteModal` component
4. ✅ Update `/quiz` page → replace topic selection with level map
5. ✅ Update quiz submission → calculate stars, show modal
6. ✅ Add "Replay Level" functionality

### Phase 3: English Section UI (2-3 hours)
1. ✅ Update `/english/[pathId]` page → show topics as locked levels
2. ✅ Add level completion flow for English topics
3. ✅ Show star ratings on completed topics
4. ✅ Lock/unlock logic for sequential topics

### Phase 4: Gamification Polish (2-3 hours)
1. ✅ Add confetti animations on level completion
2. ✅ Add sound effects (optional - can be muted)
3. ✅ Add daily challenges (beat your yesterday's performance)
4. ✅ Add milestone rewards (every 10 levels)
5. ✅ Update dashboard to show level progress

### Phase 5: Testing & Deployment (1-2 hours)
1. ✅ Test level unlock logic
2. ✅ Test star calculation
3. ✅ Test replay functionality
4. ✅ Deploy to production

## 🎁 Additional Gamification Features

### Immediate Dopamine Triggers
- ✨ Confetti on level completion
- 🎵 Celebration sound effects
- ⭐ Star animation (filling one by one)
- 🏆 Badge unlocks at milestones
- 🔥 Streak bonuses (2x stars if daily streak active)

### Visual Feedback
- Level nodes pulse when unlocked
- Progress bar fills with gradient
- "New Level Unlocked!" notification
- Boss level has special crown badge
- Perfect score (100%) gets "Perfect!" badge

### Social Elements (Future)
- Share level completion on social media
- Challenge friends to beat your score
- Leaderboard per level
- "Friend is on Level 15" notifications

## 📱 Mobile-First Design
- Level map scrolls vertically (natural phone gesture)
- Large touch targets for level nodes
- Swipe between levels
- Bottom sheet for level details

## 🚀 Expected Impact
- **Engagement**: +40% daily active users (based on game psychology)
- **Retention**: +60% week-2 retention (clear progression path)
- **Session Length**: +50% (one more level syndrome)
- **Completion Rate**: +35% (structured journey vs random quizzes)

## 🎯 Success Metrics
- % of users who complete Level 10
- Average levels per session
- Star distribution (1★ vs 2★ vs 3★)
- Replay rate for better stars
- Drop-off points (which levels users quit)

---

**Total Development Time**: 10-15 hours
**Priority**: HIGH (Core engagement feature)
**Dependencies**: None (can start immediately)
