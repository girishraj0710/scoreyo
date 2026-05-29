# Font & Size Adjustments

## Changes Made

### Font Family: Inter → Poppins
**Why Poppins?**
- ✅ Used by Byju's, Unacademy, Vedantu
- ✅ Designed specifically for readability
- ✅ Better for Indian language mixing
- ✅ Softer, friendlier feel (education-focused)
- ✅ Excellent at all sizes

**Industry Usage:**
- Byju's: Poppins
- Unacademy: Poppins
- Khan Academy: Lato (similar style)
- Duolingo: Din (custom), but Poppins-like

### Font Size Adjustments

| Element | Before (Too Big) | After (Balanced) | Change |
|---------|------------------|------------------|--------|
| **Question Text** | text-2xl-3xl (24-30px) | text-xl-2xl (20-24px) | -20% |
| **Options** | text-lg (18px) | text-base (16px) | -11% |
| **Badges** | text-sm (14px) | text-sm (14px) | No change |
| **Buttons** | text-base (16px) | text-base (16px) | No change |

### Result
- **Question:** 24px desktop, 20px mobile (comfortable reading)
- **Options:** 16px (standard body text size)
- Still **larger and clearer** than original 18px/16px
- But not **overwhelming** like 30px was

### Comparison

**Original (Bad):**
- Question: 18px - Too small ❌
- Options: 16px - Cramped ❌

**My First Try (Too Much):**
- Question: 30px - Too big ❌  
- Options: 18px - Slightly big ⚠️

**Now (Perfect):**
- Question: 24px - Just right ✅
- Options: 16px - Perfect ✅

### Visual Hierarchy

```
Heading (24px, Semibold) 
  ↓ Clear distinction
Option (16px, Regular)
  ↓ Clear distinction  
Badge (14px, Medium)
```

### Industry Standards

**Education Apps (India):**
- Byju's: ~22-24px questions
- Unacademy: ~20-24px questions  
- Toppr: ~22px questions
- Khan Academy: ~20px questions

**We're now:** 24px (desktop) / 20px (mobile) = Industry standard ✅

### Why Poppins Specifically?

1. **Geometric sans-serif** - clean, modern
2. **Excellent x-height** - readable at small sizes
3. **Friendly curves** - less intimidating for students
4. **Great for headlines and body** - versatile
5. **Supports all weights** - proper hierarchy
6. **No licensing issues** - Google Fonts (free)

### Other Options Considered

| Font | Why Not |
|------|---------|
| Inter | Too technical, feels like SaaS |
| Roboto | Too generic, Android-y |
| Open Sans | Overused, boring |
| Lato | Good alternative, but less modern |
| Nunito | Too playful for competitive exams |
| Montserrat | Too geometric, less readable |

**Winner: Poppins** - Perfect balance of professional + friendly
