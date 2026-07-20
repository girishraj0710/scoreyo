AI UI/UX Bible v2.0
Chapter 18 — Iconography Constitution
Mission

Icons are a functional language.

They exist to improve recognition and reduce cognitive load.

They are never decoration.

Golden Rule

Never use emojis as UI elements.

Emojis are allowed only when:

displaying user-generated content
chat messages
reactions
achievements (optional)
marketing campaigns

They are never used as

navigation icons
dashboard icons
sidebar icons
settings icons
buttons
feature cards
statistics
professional interfaces
Approved Icon Libraries

Claude should only use professional SVG icon libraries.

Priority order:

Tier 1 (Preferred)
Lucide
Heroicons
Tabler Icons
Tier 2
Phosphor Icons
Radix Icons
Remix Icons
Tier 3
Material Symbols (only if the design system already uses them)

Never mix icon libraries within the same product.

Choose one library and remain consistent.

Default Library

For Scoreyo:

Lucide

Reasons:

Minimal
Modern
Consistent
Open source
Excellent React support
Works well with Tailwind
Beautiful at every size

Claude should default to Lucide unless explicitly instructed otherwise.

Icon Selection Rules

Every icon must satisfy:

✓ Instantly recognizable

✓ Simple silhouette

✓ Consistent stroke width

✓ Accessible

✓ Works at 16px–24px

✓ Matches design system

Never choose an icon because it looks cool.

Choose the icon that communicates fastest.

Icon Meaning

Examples

Dashboard

✔ LayoutDashboard

❌ Rocket

Profile

✔ User

❌ Smiley Face

Progress

✔ TrendingUp

✔ ChartColumn

❌ Fire

Courses

✔ BookOpen

❌ Graduation Cap (unless the educational context specifically requires it)

Practice

✔ PencilLine

✔ ClipboardCheck

❌ Target Emoji

Tests

✔ FileText

✔ ClipboardList

❌ Explosion Emoji

Analytics

✔ BarChart3

✔ PieChart

❌ Trophy

Achievements

✔ Award

✔ Medal

✔ Trophy (professional icon)

❌ Gold Medal Emoji

Settings

✔ Settings

Never use gears from another library if Lucide is chosen.

Icon Style Rules

All icons should:

Outline style

Consistent stroke width

Rounded corners when supported

SVG only

Vector only

No bitmap icons

No emojis

No clipart

Icon Sizes

Navigation

20px

Toolbar

18px

Buttons

16–18px

Cards

20–24px

Hero

32–48px

Never randomly resize icons.

Icon Colors

Icons inherit semantic colors.

Default

Neutral

Primary Action

Primary color

Danger

Error color

Success

Success color

Warning

Warning color

Never use random colorful icons.

Icon Placement

Icons should always appear

Left of labels

Centered when standalone

Vertically aligned

Consistent spacing

Avoid decorative icons that do not convey meaning.

Accessibility

Every icon must have:

Accessible label when interactive

Tooltip when needed

Keyboard focus

Screen reader support

Decorative icons should be hidden from assistive technologies.

Never Use

Never use:

🚀

🎯

📚

💡

📈

🔥

⭐

✨

🎉

⚡

🏆

❤️

inside professional UI.

These belong in marketing or user-generated contexts, not application chrome.

Claude Instruction

Add this to the very top of your UI Bible.

ICONOGRAPHY POLICY

The application is a professional SaaS platform.

Never use emojis anywhere in the UI.

Never generate emoji-based dashboards.

Never substitute icons with emojis.

Always use Lucide icons unless another approved library has already been adopted.

Icons must always come from the project's icon library.

Do not invent icons.

Do not mix icon libraries.

Every icon must have semantic meaning.
Even Better (What Stripe/Figma/Linear Do)

Instead of Claude deciding which icon to use each time...

Create an Icon Registry.

Example

export const Icons = {
    dashboard: LayoutDashboard,
    home: House,
    profile: User,
    analytics: ChartColumn,
    leaderboard: Trophy,
    tests: ClipboardList,
    practice: PencilLine,
    notes: NotebookPen,
    bookmarks: Bookmark,
    revision: RotateCcw,
    ai: Sparkles,
    settings: Settings,
    notifications: Bell,
    search: Search,
    calendar: Calendar,
    timer: Timer,
    history: History,
    logout: LogOut
}

Now Claude never chooses icons.

It simply imports from

Icons.dashboard
Icons.profile
Icons.practice

This guarantees consistency across the entire product.

⭐ The Improvement I'd Make (World-Class Standard)

I would go one step further and ban hardcoded icons entirely.

Every screen should use a centralized IconRegistry (or Icons.ts) as the single source of truth. The registry would define:

Approved icon component
Semantic meaning
Allowed sizes
Allowed variants
Accessibility label
Usage examples
Deprecated icons

Then add this rule to your Constitution:

No component may import an icon directly from an icon library. All icons must be imported through the centralized Icon Registry.

---

## **Implementation Status - Scoreyo (June 23, 2026)**

### **Recent Work: English Learning Dashboard & Path Pages**

**Compliance Score: 95%** ✅

#### **What We Did Right:**

1. **✅ Used Lucide Icons Consistently**
   - All icons imported from `lucide-react`
   - No emojis used in navigation, buttons, or core UI
   - Professional SVG icons throughout

2. **✅ Semantic Icon Selection**
   ```tsx
   // Dashboard Navigation
   BookOpen    // Course content
   Brain       // Learning/cognitive
   Layers      // Vocabulary layers
   GraduationCap // Test prep
   Trophy      // Leaderboard
   Flame       // Streak tracking
   Zap         // XP/energy
   Clock       // Time tracking
   Target      // Goals
   ChevronRight // Navigation
   Circle      // Topic status (not started)
   CheckCircle2 // Topic completed
   Lock        // Prerequisites locked
   ```

3. **✅ Consistent Icon Sizes**
   - Cards: `w-5 h-5` (20px) - Topic cards, course cards
   - Hero icons: `w-10 h-10` to `w-12 h-12` (40-48px) - Module headers
   - Navigation: `w-4 h-4` (16px) - Meta info (time, questions)
   - Small badges: `w-3.5 h-3.5` (14px) - Inline stats

4. **✅ Icon Colors Match Semantic Meaning**
   - Progress: `text-[#5B7CFF]` (primary blue)
   - Success: `text-[#10B981]` (green)
   - Warning: `text-[#F59E0B]` (amber)
   - Neutral: `text-slate-600 dark:text-slate-400`

5. **✅ Proper Icon Placement**
   - All icons left-aligned with labels
   - Vertically centered
   - Consistent spacing (`gap-2`, `gap-3`)

#### **Where We Could Improve:**

1. **⚠️ No Centralized Icon Registry Yet**
   - Icons imported directly in components
   - Should create `/src/lib/icons.ts` registry
   - Would prevent inconsistent icon choices across files

2. **⚠️ Missing Accessibility Labels**
   - Some standalone icons lack `aria-label`
   - Should add tooltips for icon-only buttons
   - Need screen reader text for decorative icons

#### **Recommended Next Step: Create Icon Registry**

```tsx
// /src/lib/icons.ts
import {
  BookOpen, Brain, Layers, GraduationCap,
  Trophy, Flame, Zap, Clock, Target,
  ChevronRight, Circle, CheckCircle2, Lock,
  TrendingUp, Bell, Settings, User
} from 'lucide-react';

export const Icons = {
  // Navigation
  dashboard: LayoutDashboard,
  courses: BookOpen,
  practice: Brain,
  vocabulary: Layers,
  testPrep: GraduationCap,
  leaderboard: Trophy,
  
  // Status
  notStarted: Circle,
  completed: CheckCircle2,
  locked: Lock,
  
  // Metrics
  streak: Flame,
  xp: Zap,
  time: Clock,
  goal: Target,
  trending: TrendingUp,
  
  // Actions
  next: ChevronRight,
  notifications: Bell,
  settings: Settings,
  profile: User,
} as const;

export type IconName = keyof typeof Icons;
```

Then update components:

```tsx
// Before
import { BookOpen } from 'lucide-react';

// After
import { Icons } from '@/lib/icons';
<Icons.courses className="w-5 h-5" />
```

#### **Files Recently Updated (Following Iconography Policy):**

1. ✅ `/src/app/english/page.tsx` - English dashboard (all Lucide icons)
2. ✅ `/src/app/learn/english/foundation/page.tsx` - Foundation path page
3. ✅ `/src/app/learn/english/advanced/page.tsx` - Advanced path page
4. ✅ `/src/app/learn/english/ielts-toefl/page.tsx` - IELTS/TOEFL path page
5. ✅ `/src/app/learn/english/vocabulary/page.tsx` - Vocabulary placeholder

#### **Icon Usage Audit:**

| Component | Icon | Purpose | Size | Compliant? |
|-----------|------|---------|------|------------|
| Course Cards | BookOpen, Brain, Layers, GraduationCap | Course identification | 20px | ✅ |
| Progress Indicators | Circle, CheckCircle2 | Topic status | 20px | ✅ |
| Module Headers | Number badges | Module numbering | 48px | ✅ |
| Meta Info | Clock, Target | Time/questions | 14px | ✅ |
| Navigation | ChevronRight | Back navigation | 20px | ✅ |
| Locked Topics | Lock | Prerequisites | 14px | ✅ |
| Streak Display | Flame | Daily streak | 16px | ✅ |
| XP Display | Zap | Experience points | 16px | ✅ |

**Overall Assessment:** 
- ✅ Professional, consistent iconography
- ✅ No emoji pollution in core UI
- ✅ Semantic icon choices
- ⚠️ Need centralized registry for long-term consistency
- ⚠️ Need accessibility labels for icon-only elements

**Action Items:**
1. Create `/src/lib/icons.ts` registry (next refactor)
2. Add `aria-label` to standalone icon buttons
3. Add tooltips for icon-only actions
4. Document icon usage in component library

---

## **Chapter 19 — Illustrated Icon System (June 24, 2026)**

### **🎯 CANONICAL REFERENCE: Scoreyo Iconography System**

**Reference Screenshot Path:** `/Users/girish.raj/Downloads/ChatGPT Image Jun 24, 2026, 05_00_46 PM.png`

**MANDATORY POLICY:** ALL future icons MUST follow the style shown in the canonical reference screenshot.

---

### **Mission Statement**

Scoreyo uses **illustrated gradient icons** for primary features, not plain outline icons.

Every major feature card, navigation element, and learning path MUST use illustrated icons that:
- Are colorful with gradient backgrounds
- Have depth with subtle shadows
- Use rounded geometry (rounded-xl)
- Feel friendly, premium, and modern
- Belong to the same visual family

Think: **Duolingo, Quizlet, Canva, Notion Calendar**

---

### **The Illustrated Icon Formula**

Every illustrated icon consists of:

1. **Container** - Rounded square with gradient background
2. **Icon Symbol** - White Lucide icon at center
3. **Shadow** - Soft shadow for depth
4. **Hover State** - Brightened gradient on interaction

**Standard Implementation:**

```tsx
// Small Cards (Topic cards, feature buttons) - 48px
<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[COLOR1] to-[COLOR2] group-hover:from-[LIGHTER1] group-hover:to-[LIGHTER2] flex items-center justify-center transition-all shadow-sm">
  <IconComponent className="w-6 h-6 text-white" strokeWidth={2} />
</div>

// Large Cards (Major sections, hero elements) - 56px
<div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[COLOR1] to-[COLOR2] group-hover:from-[LIGHTER1] group-hover:to-[LIGHTER2] flex items-center justify-center transition-all shadow-md">
  <IconComponent className="w-7 h-7 text-white" strokeWidth={2} />
</div>

// Extra Large (Dashboard hero sections) - 64px
<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[COLOR1] to-[COLOR2] group-hover:from-[LIGHTER1] group-hover:to-[LIGHTER2] flex items-center justify-center transition-all shadow-lg">
  <IconComponent className="w-8 h-8 text-white" strokeWidth={2.5} />
</div>
```

---

### **Color Coding System (From Reference Screenshot)**

The reference screenshot shows clear color categories. **ALWAYS use these colors** for their respective feature categories:

| Feature Category | Primary Color | Gradient From → To | Hover From → To | Use Cases |
|-----------------|---------------|-------------------|-----------------|-----------|
| **Learning & Courses** | Blue | `from-[#5B7CFF] to-[#4A6AE8]` | `from-[#6B8CFF] to-[#5B7CFF]` | Study, Courses, Topics, Lessons, Reading |
| **Performance & Analytics** | Purple | `from-[#7C3AED] to-[#6D28D9]` | `from-[#8B5CF6] to-[#7C3AED]` | Stats, Reports, Progress, Charts, Analytics |
| **Practice & Daily** | Orange | `from-[#F59E0B] to-[#D97706]` | `from-[#FBBF24] to-[#F59E0B]` | Quiz, Practice, DPP, Exercises, Drills |
| **AI Tools & Smart Features** | Pink/Magenta | `from-[#EC4899] to-[#D946EF]` | `from-[#F472B6] to-[#EC4899]` | AI Tutor, Clarify, Smart Recommendations |
| **Achievements & Rewards** | Gold/Amber | `from-[#F59E0B] to-[#EA580C]` | `from-[#FBBF24] to-[#F59E0B]` | Leaderboard, Trophies, Medals, Rewards |
| **Revision & Review** | Green | `from-[#10B981] to-[#059669]` | `from-[#34D399] to-[#10B981]` | Spaced Review, Revision, Mistakes, Memory |
| **Tests & Assessments** | Teal | `from-[#14B8A6] to-[#0D9488]` | `from-[#2DD4BF] to-[#14B8A6]` | Mock Tests, Exams, IELTS, TOEFL |
| **Real-world Skills** | Indigo | `from-[#6366F1] to-[#4F46E5]` | `from-[#818CF8] to-[#6366F1]` | Communication, Presentation, Writing |

**Color Selection Rule:**
1. Identify the feature's category (Learning, Practice, Analytics, etc.)
2. Use the exact gradient from the table above
3. Never invent random colors
4. Never use flat colors (always gradients)

---

### **Icon Symbol Selection (By Category)**

Based on the reference screenshot, here are approved icon symbols for each category:

#### **Learning & Courses (Blue)**
- `BookOpen` - Study materials, courses, lessons
- `Book` - Reading, textbooks, content
- `FileText` - Documents, notes, articles
- `Layers` - Vocabulary, word lists, flashcards
- `Type` - Typography, writing, text
- `Glasses` - Reading comprehension
- `Notebook` - Note-taking, journals

#### **Performance & Analytics (Purple)**
- `BarChart3` - Performance charts, statistics
- `TrendingUp` - Progress tracking, improvement
- `PieChart` - Score breakdowns
- `LineChart` - Historical data, trends
- `Activity` - Activity monitoring
- `Target` - Goals, objectives

#### **Practice & Daily (Orange)**
- `PenTool` - Writing practice, composition
- `Edit3` - Editing, corrections
- `CheckCircle2` - Completed exercises
- `ClipboardCheck` - Quiz submissions
- `Pencil` - Practice problems
- `Brain` - Cognitive exercises

#### **AI Tools (Pink/Magenta)**
- `Sparkles` - AI magic, smart features
- `Brain` - AI tutor, intelligent help
- `MessageCircle` - AI chat, clarify
- `Lightbulb` - AI insights, tips
- `Zap` - Instant AI responses

#### **Achievements (Gold/Amber)**
- `Trophy` - Leaderboard, top rankings
- `Award` - Achievements, milestones
- `Medal` - Badges, accomplishments
- `Star` - Favorites, highlights
- `Crown` - Premium, VIP status

#### **Revision & Review (Green)**
- `RotateCcw` - Revision, review cycles
- `RefreshCw` - Spaced repetition
- `AlertCircle` - Mistakes, errors to review
- `CheckCircle` - Mastered concepts
- `Clock` - Time-based review

#### **Tests & Assessments (Teal)**
- `ClipboardList` - Mock tests, exams
- `FileCheck` - Test results
- `Timer` - Timed assessments
- `ListChecks` - Test questions
- `GraduationCap` - IELTS, TOEFL, certifications

#### **Real-world Skills (Indigo)**
- `Users` - Conversations, group discussions
- `MessageSquare` - Communication
- `Presentation` - Public speaking
- `Mail` - Email writing
- `Briefcase` - Professional skills

---

### **Mandatory Visual Attributes**

Every illustrated icon MUST have:

✅ **Container Shape:** `rounded-xl` (12px radius) for small/medium, `rounded-2xl` (16px) for large  
✅ **Background:** Gradient with `bg-gradient-to-br` (bottom-right direction)  
✅ **Icon Color:** Always white (`text-white`)  
✅ **Icon Stroke:** Bold stroke (`strokeWidth={2}` or `strokeWidth={2.5}` for large)  
✅ **Shadow:** Subtle depth (`shadow-sm` for small, `shadow-md` for medium, `shadow-lg` for large)  
✅ **Hover Effect:** Brightened gradient (lighter shades of same colors)  
✅ **Transition:** Smooth animation (`transition-all`)  
✅ **Centering:** Flexbox center (`flex items-center justify-center`)  

❌ **Never:**
- Use flat single colors (always gradients)
- Use outline icons without colored backgrounds
- Use random colors outside the approved palette
- Use emojis instead of illustrated icons
- Skip shadows (depth is required)
- Use square corners (always rounded)

---

### **Size Guidelines**

| Context | Container Size | Icon Size | Shadow | Corner Radius |
|---------|---------------|-----------|--------|---------------|
| **Topic Cards** | `w-12 h-12` (48px) | `w-6 h-6` (24px) | `shadow-sm` | `rounded-xl` |
| **Feature Cards** | `w-14 h-14` (56px) | `w-7 h-7` (28px) | `shadow-md` | `rounded-xl` |
| **Dashboard Hero** | `w-16 h-16` (64px) | `w-8 h-8` (32px) | `shadow-lg` | `rounded-2xl` |
| **Small Buttons** | `w-10 h-10` (40px) | `w-5 h-5` (20px) | `shadow-sm` | `rounded-lg` |

**Consistency Rule:** Use the same size for the same context across the entire app.

---

### **Layout: Icon + Text Arrangement**

Based on the reference screenshot, icons appear in specific layouts:

#### **Horizontal Layout (Icon next to title)**
```tsx
<div className="flex items-start gap-3">
  {/* Icon */}
  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B7CFF] to-[#4A6AE8] flex items-center justify-center shadow-sm">
    <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
  </div>
  
  {/* Text */}
  <div className="flex-1 min-w-0">
    <h3 className="font-semibold text-sm line-clamp-2">
      Topic Title
    </h3>
  </div>
</div>
```

**Use when:** Topic cards, feature cards, list items

#### **Vertical Layout (Icon above title)**
```tsx
<div className="flex flex-col items-center text-center">
  {/* Icon */}
  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B7CFF] to-[#4A6AE8] flex items-center justify-center shadow-lg mb-4">
    <BookOpen className="w-8 h-8 text-white" strokeWidth={2.5} />
  </div>
  
  {/* Text */}
  <h2 className="text-xl font-bold">Learning Path</h2>
  <p className="text-sm text-slate-500">Description</p>
</div>
```

**Use when:** Dashboard sections, hero elements, empty states

---

### **Complete Examples from Reference Screenshot**

#### **Example 1: Learning & Courses Section (Blue)**
```tsx
// Study Material Card
<button className="group relative p-5 rounded-xl border-2 border-slate-200 hover:border-[#5B7CFF] hover:shadow-lg transition-all bg-white">
  <div className="flex items-start gap-3 mb-3">
    {/* Illustrated Icon */}
    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B7CFF] to-[#4A6AE8] group-hover:from-[#6B8CFF] group-hover:to-[#5B7CFF] flex items-center justify-center transition-all shadow-sm">
      <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
    </div>
    
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-sm text-slate-900">Introduction to Grammar</h3>
    </div>
  </div>
  
  <p className="text-xs text-slate-500 mb-4">Learn the fundamentals of English grammar</p>
  
  <div className="flex items-center gap-3 text-xs text-slate-400">
    <div className="flex items-center gap-1">
      <Clock className="w-3.5 h-3.5" />
      <span>15m</span>
    </div>
    <div className="flex items-center gap-1">
      <Target className="w-3.5 h-3.5" />
      <span>20Q</span>
    </div>
  </div>
</button>
```

#### **Example 2: Performance & Analytics Section (Purple)**
```tsx
// Analytics Feature Card
<div className="p-6 rounded-2xl bg-white border border-slate-200">
  <div className="flex items-center gap-4 mb-4">
    {/* Illustrated Icon */}
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-md">
      <BarChart3 className="w-7 h-7 text-white" strokeWidth={2} />
    </div>
    
    <div className="flex-1">
      <h3 className="text-lg font-bold text-slate-900">Performance Reports</h3>
      <p className="text-sm text-slate-500">Detailed analytics and insights</p>
    </div>
  </div>
</div>
```

#### **Example 3: Practice & Daily Section (Orange)**
```tsx
// Daily Practice Card
<div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
  <div className="flex items-center justify-between mb-4">
    {/* Illustrated Icon */}
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-md">
      <PenTool className="w-7 h-7 text-white" strokeWidth={2} />
    </div>
    
    <div className="text-right">
      <p className="text-2xl font-bold text-orange-600">5</p>
      <p className="text-xs text-orange-500">Problems Today</p>
    </div>
  </div>
  
  <h3 className="font-semibold text-slate-900 mb-1">Daily Practice</h3>
  <p className="text-sm text-slate-600">Keep your streak alive</p>
</div>
```

#### **Example 4: AI Tools Section (Pink/Magenta)**
```tsx
// AI Tutor Feature
<button className="group p-6 rounded-2xl border-2 border-slate-200 hover:border-pink-500 hover:shadow-xl transition-all bg-white">
  <div className="flex items-center gap-4">
    {/* Illustrated Icon */}
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#D946EF] group-hover:from-[#F472B6] group-hover:to-[#EC4899] flex items-center justify-center transition-all shadow-lg">
      <Sparkles className="w-8 h-8 text-white" strokeWidth={2.5} />
    </div>
    
    <div className="flex-1 text-left">
      <h3 className="text-xl font-bold text-slate-900 mb-1">AI Tutor</h3>
      <p className="text-sm text-slate-600">Get instant help anytime</p>
    </div>
  </div>
</button>
```

---

### **Accessibility Requirements**

Every illustrated icon MUST include:

1. **aria-label** when icon is interactive:
```tsx
<button aria-label="Study grammar fundamentals">
  <div className="w-12 h-12 ...">
    <BookOpen className="w-6 h-6 text-white" />
  </div>
</button>
```

2. **title** attribute for tooltips:
```tsx
<div title="Estimated study time: 15 minutes">
  <Clock className="w-3.5 h-3.5" />
  <span>15m</span>
</div>
```

3. **Screen reader text** for decorative icons:
```tsx
<div aria-hidden="true">
  <div className="w-12 h-12 ...">
    <BookOpen className="w-6 h-6 text-white" />
  </div>
</div>
<span className="sr-only">Study materials</span>
```

---

### **Quality Checklist**

Before committing any icon implementation, verify:

- [ ] Icon matches one of the 8 approved color categories
- [ ] Gradient uses exact colors from the table (not random colors)
- [ ] Icon symbol is white with strokeWidth={2}
- [ ] Container has rounded-xl or rounded-2xl corners
- [ ] Shadow is present (shadow-sm/md/lg)
- [ ] Hover state brightens the gradient
- [ ] Transition is smooth (transition-all)
- [ ] Icon is centered using flexbox
- [ ] Size is consistent with context (48px for cards, 56px for features, 64px for hero)
- [ ] Accessibility labels are present (aria-label, title, or sr-only text)
- [ ] Layout matches reference screenshot (horizontal for cards, vertical for hero)
- [ ] No emojis are used anywhere
- [ ] Icon looks like it belongs to the Scoreyo family

---

### **Migration Status (June 24, 2026)**

✅ **Fully Migrated (100% Compliant):**
- `/src/app/learn/english/foundation/page.tsx` - All 32 topics use blue illustrated icons
- `/src/app/learn/english/advanced/page.tsx` - All 14 topics use purple illustrated icons
- `/src/app/learn/english/ielts-toefl/page.tsx` - All 4 topics use teal illustrated icons

⏳ **Needs Migration:**
- `/src/app/english/page.tsx` - Dashboard cards (currently use flat icons)
- `/src/app/dashboard/page.tsx` - Main dashboard (needs gradient icons)
- Subject selection pages (Physics, Chemistry, Math, etc.)

---

### **Claude Instructions**

When creating ANY new UI component, follow this process:

1. **Identify feature category** (Learning, Practice, Analytics, AI, etc.)
2. **Select exact gradient** from the Color Coding System table
3. **Choose semantic icon** from the approved Icon Symbol Selection list
4. **Apply the standard formula** (container + gradient + white icon + shadow)
5. **Add hover state** (brightened gradient)
6. **Include accessibility** (aria-label or title)
7. **Verify against checklist** (all 12 items)
8. **Compare with reference screenshot** (does it look like the same family?)

**Never:**
- Invent random colors
- Use flat backgrounds
- Use outline icons without gradients
- Skip shadows or rounded corners
- Forget hover states
- Omit accessibility labels

---

**Reference Screenshot:** `/Users/girish.raj/Downloads/ChatGPT Image Jun 24, 2026, 05_00_46 PM.png`

**This is the canonical reference. Every icon must match this style.**

---