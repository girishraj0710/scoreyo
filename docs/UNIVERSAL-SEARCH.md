# Universal Search Implementation

## 🎯 Overview

Implemented a Quizlet-style universal search bar in the top fixed header that works across all pages for global navigation.

## ✅ Features Implemented

### 1. **Centered Search Bar**
- Position: Top fixed header, centered between logo and user actions
- Width: Flexible (max-width: 2xl / 672px)
- Always visible across all pages

### 2. **Quizlet-Style UX**
- ✅ Click on search → Shows recommendations immediately
- ✅ Type to search → Real-time filtered results
- ✅ Keyboard shortcut: `Ctrl+K` (Windows) / `Cmd+K` (Mac)
- ✅ Press `Escape` to close
- ✅ Visual feedback with border highlight on focus

### 3. **Recommendations (Empty State)**
When user clicks on search without typing:
- Shows 6 curated recommended items
- Categories: Topics, Quizzes, Study Guides, Flashcards
- Examples:
  - English Grammar Fundamentals
  - JEE Physics - Mechanics
  - UPSC History - Modern India
  - SSC CGL Quantitative Aptitude
  - NEET Biology - Cell Structure
  - Banking Awareness - Current Affairs

### 4. **Search Results**
When user types a query:
- Real-time search with 300ms debounce
- Filters through all content types
- Shows matching results with:
  - Icon (visual type indicator)
  - Title (main heading)
  - Subtitle (additional context like "100 questions • 120 min")
  - Category badge (e.g., "JEE Main", "UPSC CSE")
- Empty state: "No results found" with helpful message
- Footer: "View all X results" button for full search page

### 5. **Recent Searches**
- Stores last 5 searches in localStorage
- Persists across sessions
- Auto-updated when user selects a result

## 📁 Files Created/Modified

### New Files:
1. **`/src/components/universal-search.tsx`** (370 lines)
   - Main search component
   - Dropdown with recommendations
   - Keyboard shortcuts
   - Local storage for recent searches

### Modified Files:
1. **`/src/components/app-sidebar.tsx`**
   - Replaced basic search input with UniversalSearch component
   - Restructured header layout: Logo (left) → Search (center) → Actions (right)
   - Used flexbox with `flex-shrink-0` for sides, `flex-1` for search

## 🎨 Design Specifications

### Search Input:
```tsx
- Background: slate-100 (light) / slate-900 (dark)
- Border: 2px transparent → #5B7CFF on focus
- Padding: 10px (py-2.5) 16px (px-4)
- Border radius: 12px (rounded-xl)
- Font size: 14px (text-sm)
- Placeholder: "Search for topics, quizzes, study guides..."
```

### Dropdown:
```tsx
- Background: white (light) / slate-900 (dark)
- Border: 1px slate-200 / slate-800
- Border radius: 16px (rounded-2xl)
- Shadow: 2xl (large shadow)
- Max height: 500px
- Z-index: 50 (above everything except modals)
```

### Result Items:
```tsx
- Hover: slate-50 (light) / slate-800 (dark)
- Icon container: 40px × 40px, rounded-xl
- Title: 14px semibold, truncate
- Subtitle: 12px regular, text-slate-500
- Category badge: 12px medium, slate-100 bg
```

## 🔄 Data Flow

### Current (Mock Data):
```
User input → Local filter → RECOMMENDED_ITEMS array → Display
```

### Future (API Integration):
```
User input → Debounce 300ms → API call to /api/search
  ↓
Backend searches:
  - Topics (all exams)
  - Quizzes (by exam/subject)
  - Study guides
  - Flashcards
  - Mock tests
  ↓
Return unified results → Display
```

## 🔌 API Integration (To Be Implemented)

### Endpoint: `/api/search`
```typescript
// Request
GET /api/search?q=physics&limit=10

// Response
{
  results: [
    {
      id: "topic-123",
      type: "topic",
      title: "JEE Physics - Mechanics",
      subtitle: "Newton's Laws, Motion, Work-Energy",
      category: "JEE Main",
      href: "/study-guides/jee-physics-mechanics",
      exam_id: "jee-main",
      subject_id: "physics"
    },
    // ... more results
  ],
  total: 45
}
```

### Search Logic:
```sql
-- Pseudocode for backend search
SELECT 
  id, type, title, subtitle, category, href
FROM (
  -- Search topics
  SELECT topic_id as id, 'topic' as type, name as title, 
         description as subtitle, exam_name as category
  FROM topics 
  WHERE name ILIKE '%query%' OR description ILIKE '%query%'
  
  UNION ALL
  
  -- Search study guides
  SELECT guide_id as id, 'study-guide' as type, title, 
         summary as subtitle, exam_name as category
  FROM study_guides
  WHERE title ILIKE '%query%'
  
  UNION ALL
  
  -- Search flashcards
  SELECT deck_id as id, 'flashcard' as type, deck_name as title,
         card_count as subtitle, exam_name as category
  FROM flashcard_decks
  WHERE deck_name ILIKE '%query%'
) 
LIMIT 10;
```

## 🎯 User Flows

### Flow 1: Browse Recommendations
```
1. User clicks search bar
2. Dropdown opens with "RECOMMENDED FOR YOU" header
3. Shows 6 curated items (no scrolling needed)
4. User clicks an item → Navigates to that page
5. Recent search is saved
```

### Flow 2: Search & Navigate
```
1. User types "upsc history"
2. After 300ms debounce, search executes
3. Dropdown shows: "4 results for 'upsc history'"
4. Matching items appear with highlights
5. User clicks result → Navigates
6. Search term saved to recent searches
```

### Flow 3: Keyboard Power User
```
1. User presses Ctrl+K (anywhere on site)
2. Search input focuses, dropdown opens
3. User types query
4. User presses Escape to close
```

## 📊 Analytics Events (To Track)

```typescript
// Search performed
analytics.track('search_performed', {
  query: string,
  results_count: number,
  source: 'header' | 'keyboard_shortcut'
});

// Result clicked
analytics.track('search_result_clicked', {
  query: string,
  result_type: 'topic' | 'quiz' | 'study-guide' | 'flashcard',
  result_id: string,
  result_position: number
});

// Recommendation clicked
analytics.track('recommendation_clicked', {
  item_id: string,
  item_type: string
});
```

## 🔐 Permissions & Access

- **All users**: Can search all content
- **Free users**: See all results, but locked content shows 🔒 icon
- **Pro users**: Full access to all search results

## 🚀 Future Enhancements

### Phase 2:
- [ ] Search filters (by exam, subject, difficulty)
- [ ] Search history dropdown (recent searches)
- [ ] Autocomplete suggestions
- [ ] Trending searches widget
- [ ] Voice search (mobile)

### Phase 3:
- [ ] Advanced search syntax ("physics AND mechanics")
- [ ] Search within results
- [ ] Save searches (for Pro users)
- [ ] Search analytics dashboard (admin)

## 📱 Mobile Considerations

Current implementation is desktop-only (`hidden md:flex` on header).

Mobile search will be:
- Separate search icon in mobile tab bar
- Full-screen search overlay when clicked
- Same dropdown results, optimized for touch

## 🧪 Testing Checklist

- [ ] Search opens on click
- [ ] Recommendations load immediately
- [ ] Typing filters results correctly
- [ ] Clear button (X) works
- [ ] Keyboard shortcut (Ctrl+K) opens search
- [ ] Escape closes dropdown
- [ ] Clicking outside closes dropdown
- [ ] Navigation works for all result types
- [ ] Recent searches persist across page loads
- [ ] Dark mode styling correct
- [ ] Responsive width (doesn't overflow header)

## 🎨 Visual Comparison

**Before:**
```
[Logo] [Small Search Input]                      [Notifications] [Sound] [Language] [Profile]
```

**After:**
```
[Logo]        [─────── Universal Search (Centered, Wide) ───────]        [Notifications] [Sound] [Language] [Profile]
```

## 💡 Key Design Decisions

1. **Why center the search?**
   - Follows Quizlet, Google, and modern web apps
   - Makes search the primary action
   - Symmetric, balanced layout

2. **Why show recommendations immediately?**
   - Reduces cognitive load (users don't need to know what to search)
   - Encourages exploration
   - Surfaces popular/relevant content

3. **Why use local storage for recent searches?**
   - Fast, no API call needed
   - Privacy-friendly (client-side only)
   - Works offline

4. **Why keep page-specific search bars?**
   - Different use case: filter within a page vs. global navigation
   - Example: Study guides page filters 400+ topics, not for navigation

## 🔗 Related Documentation

- UI/UX Bible: Search & Navigation patterns
- AI Engineering Playbook: Search API implementation
- Database schema: `search_index` table (future)

---

**Status:** ✅ Implemented (UI complete, API integration pending)
**Version:** 1.0
**Last Updated:** June 10, 2026
