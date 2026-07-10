# Emergent Design System - Implementation Guide

## 🎨 Design Philosophy

**Theme**: Organic & Earthy + Pastel & Soft  
**Vibe**: Optimistic, Focused, Premium, Culturally Nuanced (Indian Competitive Exams)

---

## 🎨 Color Palette

### Core Colors

```css
/* CSS Variables */
:root {
  /* Backgrounds */
  --bg-base: #FAF8F5;           /* Main background - warm off-white */
  --surface-primary: #FFFFFF;    /* Cards, panels */
  --surface-secondary: #F1F5F9;  /* Secondary surfaces */
  
  /* Text */
  --text-primary: #1E293B;       /* Main text - dark slate */
  --text-secondary: #64748B;     /* Secondary text - muted slate */
  
  /* Brand */
  --brand-primary: #E76F51;      /* Primary actions - terracotta */
  --brand-primary-hover: #D65A3D; /* Hover state */
  --brand-secondary: #264653;    /* Secondary brand - deep teal */
  
  /* Status */
  --success-calm: #2A9D8F;       /* Success states - calm teal */
  --warning-streak: #E9C46A;     /* Warnings, streaks - gold */
  
  /* Utility */
  --border-subtle: rgba(0,0,0,0.06); /* Borders */
  --glass-bg: rgba(255,255,255,0.7);  /* Glass morphism */
}
```

### Tailwind Extension

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-base': '#FAF8F5',
        'surface': {
          primary: '#FFFFFF',
          secondary: '#F1F5F9',
        },
        'ink': {
          DEFAULT: '#1E293B',
          soft: '#64748B',
        },
        'brand': {
          DEFAULT: '#E76F51',
          hover: '#D65A3D',
          deep: '#264653',
        },
        'success': '#2A9D8F',
        'gold': '#E9C46A',
      },
      borderColor: {
        'subtle': 'rgba(0,0,0,0.06)',
      },
      backgroundColor: {
        'glass': 'rgba(255,255,255,0.7)',
      }
    }
  }
}
```

### Color Usage Rules

| Element | Color | Tailwind Class |
|---------|-------|----------------|
| Page background | `#FAF8F5` | `bg-[#FAF8F5]` or `bg-bg-base` |
| Card background | `#FFFFFF` | `bg-white` |
| Primary text | `#1E293B` | `text-[#1E293B]` or `text-ink` |
| Secondary text | `#64748B` | `text-[#64748B]` or `text-ink-soft` |
| Primary button | `#E76F51` | `bg-[#E76F51]` or `bg-brand` |
| Primary button hover | `#D65A3D` | `hover:bg-[#D65A3D]` |
| Success states | `#2A9D8F` | `text-[#2A9D8F]` or `bg-success` |
| Streaks, warnings | `#E9C46A` | `text-[#E9C46A]` or `bg-gold` |
| Borders | `rgba(0,0,0,0.06)` | `border-black/5` or `border-subtle` |

**❌ DO NOT USE:**
- Default Tailwind blue (#3B82F6)
- Indigo (#6366F1)
- Purple/Violet gradients
- Any color not in the palette above

---

## ✍️ Typography

### Font Families

```css
/* Import in index.css or globals.css */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

body {
  font-family: 'Manrope', system-ui, sans-serif;
}

.font-heading {
  font-family: 'Outfit', sans-serif;
  letter-spacing: -0.02em; /* Tighter tracking for headings */
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}
```

### Typography Hierarchy

| Element | Classes | Usage |
|---------|---------|-------|
| **H1 Hero** | `text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-[#1E293B] leading-tight font-heading` | Landing page hero titles |
| **H2 Section** | `text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1E293B] font-heading` | Section headers |
| **H3 Card** | `text-xl sm:text-2xl font-semibold tracking-tight text-[#1E293B] font-heading` | Card titles |
| **Overline** | `text-xs font-bold tracking-[0.2em] uppercase text-[#E76F51]` | Labels above content |
| **Body** | `text-base font-medium text-[#64748B] leading-relaxed` | Paragraph text |
| **Stats Mono** | `text-2xl sm:text-3xl font-bold font-mono tracking-tighter text-[#264653]` | Numbers, stats |

### Font Weight Guidelines

- **Manrope (Body)**: Use `font-medium` (500) for body text, `font-semibold` (600) for emphasis
- **Outfit (Headings)**: Use `font-bold` (700) for H2/H3, `font-black` (900) for H1
- **JetBrains Mono**: Use `font-bold` (700) for stats, `font-medium` (500) for code

---

## 🧩 Component Patterns

### 1. Primary Button

```jsx
<button className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#E76F51] text-white font-semibold tracking-wide hover:bg-[#D65A3D] transition-colors focus:ring-4 focus:ring-[#E76F51]/20 shadow-[0_4px_14px_0_rgb(231,111,81,0.39)] hover:shadow-[0_6px_20px_rgba(231,111,81,0.23)] hover:-translate-y-0.5 active:translate-y-0">
  {children}
</button>
```

**Key Features:**
- Background: `#E76F51` (brand primary)
- Hover: `#D65A3D` (darker)
- Shadow: Custom shadow with brand color
- Lift on hover: `-translate-y-0.5`
- Active press: `translate-y-0`

### 2. Card (Dashboard Widget)

```jsx
<div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 flex flex-col h-full hover:border-[#E76F51]/30 hover:shadow-md transition-all">
  {children}
</div>
```

**Key Features:**
- Large border radius: `rounded-3xl`
- Subtle border: `border-black/5`
- Hover effect: Border changes to brand color
- Padding: `p-6` (24px)

### 3. Glass Header (Sticky Navigation)

```jsx
<header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-black/5 transition-all">
  {children}
</header>
```

**Key Features:**
- Backdrop blur: `backdrop-blur-xl`
- Semi-transparent: `bg-white/70`
- Fixed position: Always on top
- Z-index: `z-50`

### 4. Flashcard (3D Flip)

```jsx
<div className="relative w-full aspect-[4/3] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 cursor-pointer flex items-center justify-center p-8 text-center">
  {/* Front/Back content */}
</div>
```

**Key Features:**
- Aspect ratio: `4:3`
- Large rounded corners: `rounded-3xl`
- Soft shadow: Custom shadow
- Neumorphic style: Subtle border

### 5. Overline Label

```jsx
<div className="text-xs font-bold tracking-[0.2em] uppercase text-[#E76F51]">
  {label}
</div>
```

**Key Features:**
- Wide letter spacing: `tracking-[0.2em]`
- Uppercase: `uppercase`
- Brand color: `text-[#E76F51]`
- Small size: `text-xs`

### 6. Stat Display (Mono Font)

```jsx
<div className="font-mono font-bold text-2xl sm:text-3xl tracking-tighter text-[#264653]">
  {number}
</div>
```

**Key Features:**
- Monospace font: `font-mono`
- Tight tracking: `tracking-tighter`
- Secondary brand color: `text-[#264653]`

---

## 📐 Spacing & Layout

### Global Padding

```jsx
<div className="px-6 md:px-12 lg:px-24 py-12 md:py-20">
  {/* Page content */}
</div>
```

### Container

```jsx
<div className="max-w-7xl mx-auto">
  {/* Contained content */}
</div>
```

### Bento Grid (Dashboard)

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {/* Grid items */}
</div>
```

### Border Radius Standards

- **Small**: `rounded-xl` (12px) - Buttons, inputs
- **Medium**: `rounded-2xl` (16px) - Small cards
- **Large**: `rounded-3xl` (24px) - Large cards, flashcards

---

## 🎭 Motion & Interactions

### Hover Lift

```jsx
className="transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
```

### Button Tap

```jsx
className="active:scale-95 transition-transform duration-150"
```

### Fade In Animation (Framer Motion)

```jsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.05 }}
>
  {children}
</motion.div>
```

### List Stagger (Framer Motion)

```jsx
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>

// Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
```

---

## 📄 Page-Specific Patterns

### Home (Landing/Dashboard)

**Layout**: Bento Grid + Hero Card

```jsx
<div className="max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-10">
  {/* Greeting header with streak */}
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
    {/* Left: Greeting */}
    <div>
      <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#E76F51]">
        Good morning
      </div>
      <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black mt-2 leading-tight">
        Hey {name}, ready to move the needle?
      </h1>
    </div>
    
    {/* Right: Streak cards */}
    <div className="flex items-center gap-3">
      {/* Streak card */}
    </div>
  </div>
  
  {/* Bento grid */}
  <div className="grid lg:grid-cols-3 gap-5">
    {/* Cards */}
  </div>
</div>
```

### Study Guides

**Layout**: Sidebar + Content

```jsx
<div className="flex h-screen">
  {/* Sidebar */}
  <aside className="w-64 border-r border-black/5 bg-white">
    {/* Topic tree */}
  </aside>
  
  {/* Main content */}
  <main className="flex-1 overflow-y-auto p-8">
    {/* Content */}
  </main>
</div>
```

### Flashcards

**Layout**: Immersive Full-Screen

```jsx
<div className="min-h-screen bg-[#FAF8F5] flex flex-col">
  {/* Header: Progress */}
  <header className="border-b border-black/5 bg-white/70 backdrop-blur-xl">
    {/* Deck name, progress */}
  </header>
  
  {/* Center: Card */}
  <div className="flex-1 flex items-center justify-center p-6">
    {/* 3D Flashcard */}
  </div>
  
  {/* Footer: Actions */}
  <footer className="border-t border-black/5 bg-white">
    {/* Hard, Good, Easy buttons */}
  </footer>
</div>
```

---

## 🛠️ Migration Checklist

### Step 1: Global Setup

- [ ] Update `tailwind.config.js` with Emergent colors
- [ ] Import Outfit, Manrope, JetBrains Mono fonts in `globals.css`
- [ ] Add CSS variables to `:root`
- [ ] Update body background to `#FAF8F5`
- [ ] Add radial gradient overlays (optional)

### Step 2: Component Library

- [ ] Create `EmergentButton.tsx` (primary, secondary, outline)
- [ ] Create `EmergentCard.tsx` (standard, glass, neumorphic)
- [ ] Create `EmergentBadge.tsx` (status indicators)
- [ ] Create `EmergentInput.tsx` (form inputs)
- [ ] Update existing buttons to use EmergentButton

### Step 3: Page-by-Page Migration

**Priority HIGH (User-facing):**
- [ ] Home page (`/` or `/dashboard`)
- [ ] English learning page (`/english`)
- [ ] Study Guides (`/study-guides`)
- [ ] Flashcards (`/flashcards`)
- [ ] Review (`/review`)

**Priority MEDIUM (Internal tools):**
- [ ] Mock Test (`/mock-test`)
- [ ] Sprint (`/sprint`)
- [ ] Reports (`/reports`)
- [ ] Custom Quiz (`/custom-quiz`)

**Priority LOW (Settings):**
- [ ] Achievements (`/achievements`)
- [ ] Settings (`/settings`)

### Step 4: Color Replacement

Run global find-and-replace:

| OLD | NEW | Context |
|-----|-----|---------|
| `#5B7CFF` | `#E76F51` | Primary blue → Terracotta |
| `#3B82F6` | `#E76F51` | Tailwind blue → Brand |
| `bg-blue-500` | `bg-[#E76F51]` | Buttons, badges |
| `text-blue-600` | `text-[#E76F51]` | Links, accents |
| `#10B981` | `#2A9D8F` | Green → Calm teal |
| `#F59E0B` | `#E9C46A` | Orange → Gold |
| `#F8FAFC` | `#FAF8F5` | Cool gray → Warm off-white |

### Step 5: Typography Update

```tsx
// OLD
<h1 className="text-3xl font-bold text-slate-900">

// NEW
<h1 className="text-3xl font-bold text-[#1E293B] font-heading tracking-tight">
```

### Step 6: Testing

- [ ] Check all pages in light mode
- [ ] Verify all hover states work
- [ ] Test button focus states
- [ ] Ensure text contrast meets WCAG AA
- [ ] Mobile responsiveness check

---

## 📊 Design Tokens (for Design-Dev Handoff)

```json
{
  "colors": {
    "background": {
      "base": "#FAF8F5",
      "surface": "#FFFFFF",
      "surface-alt": "#F1F5F9"
    },
    "text": {
      "primary": "#1E293B",
      "secondary": "#64748B"
    },
    "brand": {
      "primary": "#E76F51",
      "primary-hover": "#D65A3D",
      "secondary": "#264653"
    },
    "status": {
      "success": "#2A9D8F",
      "warning": "#E9C46A"
    },
    "border": {
      "subtle": "rgba(0,0,0,0.06)"
    }
  },
  "typography": {
    "fontFamily": {
      "heading": "Outfit, sans-serif",
      "body": "Manrope, sans-serif",
      "mono": "JetBrains Mono, monospace"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem"
    }
  },
  "spacing": {
    "page-padding-x": ["1.5rem", "3rem", "6rem"],
    "page-padding-y": ["3rem", "5rem"],
    "card-padding": "1.5rem",
    "gap-small": "0.75rem",
    "gap-medium": "1.25rem",
    "gap-large": "1.5rem"
  },
  "borderRadius": {
    "small": "0.75rem",
    "medium": "1rem",
    "large": "1.5rem"
  }
}
```

---

## 🚫 Don'ts (Common Mistakes)

❌ **Don't use default Tailwind colors**
```tsx
// BAD
<button className="bg-blue-500">

// GOOD
<button className="bg-[#E76F51]">
```

❌ **Don't use purple/violet gradients**
```tsx
// BAD
<div className="bg-gradient-to-r from-purple-500 to-pink-500">

// GOOD
<div className="bg-white rounded-3xl border border-black/5">
```

❌ **Don't forget font-heading for titles**
```tsx
// BAD
<h1 className="text-4xl font-bold">

// GOOD
<h1 className="text-4xl font-bold font-heading tracking-tight">
```

❌ **Don't use small border radius for cards**
```tsx
// BAD
<div className="rounded-lg">

// GOOD
<div className="rounded-3xl">
```

---

## ✅ Quick Reference Card

**Colors**: `#E76F51` (brand), `#FAF8F5` (bg), `#1E293B` (text), `#2A9D8F` (success)  
**Fonts**: Outfit (headings), Manrope (body), JetBrains Mono (stats)  
**Radius**: `rounded-3xl` for cards, `rounded-xl` for buttons  
**Shadow**: `shadow-[0_8px_30px_rgb(0,0,0,0.04)]` for cards  
**Hover**: `-translate-y-1` with shadow increase  
**Border**: `border-black/5` for subtle separation

---

**Last Updated**: June 10, 2026  
**Version**: 1.0  
**Status**: Ready for implementation
