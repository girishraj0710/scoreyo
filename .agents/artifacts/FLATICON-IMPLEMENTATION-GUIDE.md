# Flaticon Icon Implementation Guide for PrepGenie

**Date**: May 10, 2026  
**Purpose**: Replace emoji icons with professional Flaticon illustrations

---

## Overview

Since Flaticon blocks automated scraping, you'll need to manually download icons. This guide shows you:
1. **Search terms** for each exam category
2. **Recommended icon styles**
3. **Implementation steps**
4. **Code examples**

---

## Part 1: Icon Search Terms for Flaticon

### 🔧 Engineering Exams
**Search Terms**: `"engineering student"`, `"mechanical engineer"`, `"computer engineer"`, `"technical education"`

**Exam Mappings**:
- **JEE Main/Advanced**: Engineering student with books, circuit board, gear
- **GATE**: Graduate with technical symbols, engineering hat
- **IIT JAM**: Laboratory equipment, engineering tools

**Style Recommendation**: Line art with accent colors (blue/purple tones)

---

### 🏥 Medical Exams  
**Search Terms**: `"medical student"`, `"doctor stethoscope"`, `"healthcare education"`, `"nursing student"`

**Exam Mappings**:
- **NEET UG**: Medical student with stethoscope, medical books
- **NEET PG**: Doctor with clipboard, medical graduate
- **AIIMS**: Hospital building with medical cross

**Style Recommendation**: Healthcare icons in teal/green tones

---

### 🏛️ Government/Civil Services
**Search Terms**: `"government building"`, `"civil service"`, `"administration"`, `"parliament"`

**Exam Mappings**:
- **UPSC CSE**: Government building (India Gate style), officer badge
- **SSC CGL**: Staff selection, office worker with documents
- **RRB**: Railway station, train conductor
- **NDA**: Military badge, defense academy

**Style Recommendation**: Professional blue/navy tones, official look

---

### 💼 Business & Management
**Search Terms**: `"business student"`, `"mba graduate"`, `"business strategy"`, `"management"`

**Exam Mappings**:
- **CAT**: Business person with briefcase, growth chart
- **MAT**: Management graduate with lightbulb
- **SNAP**: Business analytics, strategy planning
- **XAT**: Executive with presentation

**Style Recommendation**: Professional gradient icons (blue/purple)

---

### ⚖️ Law & Judiciary
**Search Terms**: `"law student"`, `"judge gavel"`, `"legal education"`, `"justice scale"`

**Exam Mappings**:
- **CLAT**: Law book with gavel, legal document
- **AILET**: Law college building, judicial badge
- **Judiciary Exams**: Judge with gavel, justice scales

**Style Recommendation**: Formal dark blue/black tones

---

### 💰 Banking & Finance
**Search Terms**: `"bank employee"`, `"finance professional"`, `"banking service"`, `"cashier"`

**Exam Mappings**:
- **IBPS PO**: Bank building with rupee symbol
- **SBI Clerk**: Banking professional with documents
- **RBI Grade B**: Reserve bank, financial analyst

**Style Recommendation**: Trustworthy green/gold tones

---

### 🎓 Teaching & Education
**Search Terms**: `"teacher"`, `"professor"`, `"education"`, `"classroom"`

**Exam Mappings**:
- **CTET**: Teacher with students, blackboard
- **UGC NET**: University building with graduation cap
- **DSSSB**: School teacher, educational institution

**Style Recommendation**: Warm orange/yellow tones

---

### 🚂 Railways & Transport
**Search Terms**: `"railway"`, `"train conductor"`, `"transport"`, `"railway station"`

**Exam Mappings**:
- **Railway RRB**: Train with tracks, railway officer
- **Metro Rail**: Metro train, station platform

**Style Recommendation**: Red/gray industrial tones

---

### 🛡️ Defense & Police
**Search Terms**: `"police officer"`, `"military"`, `"defense"`, `"security badge"`

**Exam Mappings**:
- **NDA**: Military cadet, defense academy badge
- **CDS**: Defense officer, armed forces
- **Police Exams**: Police badge, law enforcement

**Style Recommendation**: Strong navy/black tones

---

### 📊 Commerce & Accounts
**Search Terms**: `"accountant"`, `"chartered accountant"`, `"bookkeeping"`, `"financial calculator"`

**Exam Mappings**:
- **CA Foundation**: Calculator with ledger
- **CS Executive**: Corporate secretary, legal documents
- **CMA**: Cost accountant, financial charts

**Style Recommendation**: Professional blue/green tones

---

## Part 2: Downloading from Flaticon

### Step 1: Create Free Account
1. Go to https://www.flaticon.com/
2. Sign up (free tier allows downloads with attribution)
3. Choose **Premium** for commercial use without attribution

### Step 2: Search & Download
1. Use search terms from above
2. Filter by:
   - **Style**: Flat, Line art, Hand-drawn, or Gradient
   - **Color**: Yes (for colored icons)
   - **Format**: SVG (scalable) or PNG (if SVG not available)
3. Download icon (SVG recommended)
4. **Attribution**: Save author info for free icons

### Step 3: Organize Downloads
Create folder structure:
```
/public/exam-icons/
  ├── engineering/
  │   ├── jee-main.svg
  │   ├── jee-advanced.svg
  │   └── gate.svg
  ├── medical/
  │   ├── neet-ug.svg
  │   └── neet-pg.svg
  ├── government/
  │   ├── upsc.svg
  │   └── ssc.svg
  ├── business/
  │   └── cat.svg
  └── law/
      └── clat.svg
```

---

## Part 3: Implementation Code

### Option A: Direct SVG Import (Recommended)

#### 1. Create Icon Component
```typescript
// src/components/exam-icon.tsx
import { FC } from 'react';

interface ExamIconProps {
  examId: string;
  className?: string;
  size?: number;
}

export const ExamIcon: FC<ExamIconProps> = ({ examId, className = '', size = 48 }) => {
  // Map exam IDs to icon paths
  const iconMap: Record<string, string> = {
    'jee-main': '/exam-icons/engineering/jee-main.svg',
    'jee-advanced': '/exam-icons/engineering/jee-advanced.svg',
    'neet-ug': '/exam-icons/medical/neet-ug.svg',
    'upsc': '/exam-icons/government/upsc.svg',
    'cat': '/exam-icons/business/cat.svg',
    'clat': '/exam-icons/law/clat.svg',
    // Add all 60+ exams...
  };

  const iconPath = iconMap[examId] || '/exam-icons/default.svg';

  return (
    <img 
      src={iconPath} 
      alt={examId}
      className={className}
      width={size}
      height={size}
    />
  );
};
```

#### 2. Update Mock Test Page
```typescript
// src/app/mock-test/page.tsx
import { ExamIcon } from '@/components/exam-icon';

// Replace current icon rendering:
<div className="w-12 h-12 rounded-xl flex items-center justify-center">
  <ExamIcon examId={examId} size={32} className="group-hover:scale-110 transition-transform" />
</div>
```

---

### Option B: Inline SVG (Better Performance)

#### 1. Convert SVG to React Components
Use tool: https://react-svgr.com/playground/

**Example for JEE Main**:
```typescript
// src/components/exam-icons/jee-main-icon.tsx
export const JeeMainIcon = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    {/* Paste SVG path data here */}
    <path d="M..." fill="#3B82F6" />
  </svg>
);
```

#### 2. Create Icon Registry
```typescript
// src/lib/exam-icon-registry.tsx
import { JeeMainIcon } from '@/components/exam-icons/jee-main-icon';
import { NeetUgIcon } from '@/components/exam-icons/neet-ug-icon';
// ... import all icons

export const EXAM_ICONS: Record<string, React.ComponentType<any>> = {
  'jee-main': JeeMainIcon,
  'neet-ug': NeetUgIcon,
  // ... map all exams
};

export const getExamIconComponent = (examId: string) => {
  return EXAM_ICONS[examId] || DefaultIcon;
};
```

#### 3. Use in Components
```typescript
const IconComponent = getExamIconComponent(examId);
<IconComponent size={32} className="text-blue-600" />
```

---

## Part 4: Color Customization

### Match Exam Colors from exams.ts
```typescript
// In your icon component
<ExamIcon 
  examId="jee-main"
  color={exam.color} // "#3B82F6" from exams.ts
  size={32}
/>
```

### SVG Color Override
```typescript
// For SVG files
<img 
  src={iconPath}
  style={{ filter: `hue-rotate(${getHueRotation(exam.color)}deg)` }}
/>

// Or use CSS filters in className
className="brightness-110 saturate-150"
```

---

## Part 5: Fallback Strategy

Always have a fallback for missing icons:

```typescript
export const ExamIcon: FC<ExamIconProps> = ({ examId, fallbackEmoji, ...props }) => {
  const iconPath = iconMap[examId];
  
  // If no icon found, use emoji from exams.ts
  if (!iconPath) {
    return (
      <div className={props.className}>
        {fallbackEmoji || '📚'}
      </div>
    );
  }
  
  return <img src={iconPath} {...props} />;
};
```

---

## Part 6: Licensing & Attribution

### Free Flaticon Icons
- ✅ **Free for personal/commercial use**
- ⚠️ **Requires attribution** (add to footer or credits page)

**Attribution Format**:
```html
Icons made by <a href="https://www.flaticon.com/authors/author-name">Author Name</a> 
from <a href="https://www.flaticon.com/">www.flaticon.com</a>
```

### Premium Flaticon Subscription
- ✅ **No attribution required**
- ✅ **Unlimited downloads**
- ✅ **Commercial license**
- 💰 **Cost**: ~$10-15/month

**Recommendation**: Get Premium for PrepGenie (commercial app)

---

## Part 7: Implementation Checklist

### Phase 1: Download Icons (Manual)
- [ ] Create Flaticon account
- [ ] Search for each exam category
- [ ] Download 60+ icons (one per exam)
- [ ] Save SVG files to `/public/exam-icons/`
- [ ] Document attribution requirements

### Phase 2: Code Implementation
- [ ] Create `ExamIcon` component
- [ ] Create icon map/registry
- [ ] Update mock-test page
- [ ] Update dashboard page
- [ ] Update leaderboard page
- [ ] Update review page

### Phase 3: Testing
- [ ] Verify all icons load correctly
- [ ] Test on mobile/tablet/desktop
- [ ] Check bundle size impact
- [ ] Test with slow network (lazy loading?)

### Phase 4: Production
- [ ] Add attribution footer (if using free icons)
- [ ] Optimize SVG files (SVGO)
- [ ] Add loading states
- [ ] Deploy and test

---

## Part 8: Alternative Icon Sources

If Flaticon doesn't work:

### 1. **Icons8** (https://icons8.com/)
- Similar to Flaticon
- Free with attribution, Premium available
- More illustration styles

### 2. **Noun Project** (https://thenounproject.com/)
- Massive icon library
- Free with attribution or Premium

### 3. **Storyset** by Freepik (https://storyset.com/)
- Free customizable illustrations
- Perfect for exam categories
- Attribution required

### 4. **Custom Design** (Fiverr/Upwork)
- Hire designer for custom icon set
- Cost: $50-200 for 60 icons
- Fully custom, brand-aligned

---

## Estimated Time & Cost

| Task | Time | Cost |
|------|------|------|
| **Manual Download (60 icons)** | 2-3 hours | Free or $10/month Premium |
| **Code Implementation** | 2-3 hours | $0 |
| **Testing & Optimization** | 1 hour | $0 |
| **Total** | **5-7 hours** | **$0-10/month** |

---

## Recommendation

Given the time investment vs. benefit:

### Option 1: Keep Emoji Icons ✅ (Current)
- **Pros**: Zero work, already recognizable, cross-platform
- **Cons**: Less professional appearance
- **Best for**: MVP, quick launch

### Option 2: Flaticon Icons 🎨 (Professional)
- **Pros**: Very professional, customizable, brand-aligned
- **Cons**: 5-7 hours work, ongoing attribution/licensing
- **Best for**: Post-launch polish, paid app

### My Suggestion:
**Launch with emojis first** → Get users → **Upgrade to Flaticon icons later** when you have revenue to justify Premium subscription and designer time.

---

## Next Steps

If you want to proceed with Flaticon:

1. **I can help you**:
   - Create the `ExamIcon` component structure
   - Write icon mapping code
   - Update all pages to use new icons
   - Set up fallback system

2. **You need to**:
   - Manually download 60+ icons from Flaticon
   - Place them in `/public/exam-icons/` folder
   - Provide me with the file names/paths

Let me know if you want me to create the implementation code now, or if you'd like to keep the emoji icons for now! 🚀
