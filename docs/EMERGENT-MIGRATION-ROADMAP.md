# Emergent Design Migration Roadmap

**Generated**: June 10, 2026  
**Status**: Analysis Complete - Ready for Implementation  
**Total Pages to Migrate**: 15 pages  
**Estimated Timeline**: 15-18 days (full-time) or 4-5 weeks (part-time)

---

## 📊 EXECUTIVE SUMMARY

### Current Status
- ✅ **30% Complete**: Global CSS variables, fonts (Outfit, Manrope, JetBrains Mono), landing page
- ⚠️ **70% Needs Update**: 15+ pages still use legacy colors (#5B7CFF, #4255FF)
- 🎯 **Goal**: Unified Emergent design with warm terracotta (#E76F51), consistent spacing

### Key Findings

**Pages Already Using Emergent Colors**:
- ✅ `/` - Home page (uses #F26A4B correctly)
- ✅ `/landing-emergent` - Landing component
- ✅ `globals.css` - All CSS variables correct

**Pages Needing Major Updates**:
- ⚠️ `/english` - Uses #5B7CFF (old blue) extensively
- ⚠️ `/learn/english/*` - All English path pages
- ⚠️ `/quiz` - Uses #4255FF
- ⚠️ `/mock-test` - Legacy blue colors
- ⚠️ `/sprint` - Inconsistent badge colors
- ⚠️ `/custom-quiz` - Blue file upload UI

---

## 🎨 COLOR MIGRATION MAP

### Complete Replacement Table

| OLD Color | NEW Color | Context | Files Affected |
|-----------|-----------|---------|----------------|
| `#5B7CFF` | `#E76F51` | Primary blue → Terracotta | `/english`, `/learn/english/*` |
| `#4255FF` | `#E76F51` | Quiz primary | `/quiz`, `/mock-test` |
| `#6B9FD6` | `#E76F51` | File upload blue | `/custom-quiz` |
| `from-blue-500` | `from-[#E76F51]` | Gradients | `/english` cards |
| `to-cyan-500` | `to-[#E15838]` | Gradient end | `/english` cards |
| `slate-200/60` | `border-black/5` | Card borders | All pages |
| `slate-700/40` | `text-[#64748B]` | Secondary text | All pages |
| `#F8FAFC` | `#FAF8F5` | Cool gray → Warm | Body background |
| `emerald-500` | `#2A9D8F` | Success states | Badges, progress |
| `purple-500` | `#7C3AED` | Keep for advanced | Already correct |

### Emergent Color Palette

```typescript
// Copy this to: src/lib/emergent-colors.ts
export const emergentColors = {
  // Backgrounds
  background: '#FAF8F5',        // Warm off-white
  surface: '#FFFFFF',           // White cards
  surfaceCool: '#F1F5F9',       // Cool gray
  
  // Text
  textPrimary: '#1E293B',       // Dark slate
  textSecondary: '#64748B',     // Muted slate
  textMuted: '#8B94A6',         // Lighter muted
  
  // Brand
  primary: '#E76F51',           // Terracotta (main CTA)
  primaryHover: '#D65A3D',      // Darker terracotta
  secondary: '#264653',         // Deep teal
  
  // Accents
  success: '#2A9D8F',           // Calm teal
  warning: '#E9C46A',           // Gold (streaks)
  danger: '#DC2626',            // Red
  info: '#7C3AED',              // Purple
  gold: '#C89B3C',              // Premium gold
  
  // Borders
  borderSubtle: 'rgba(0,0,0,0.06)',
  borderMedium: 'rgba(0,0,0,0.10)',
} as const;
```

---

## 📋 IMPLEMENTATION ROADMAP

### PHASE 1: Component Library (Days 1-3)

**Create**: `/src/components/emergent/`

#### 1. EmergentButton.tsx
```typescript
// Variants: primary, secondary, outline, ghost
// Sizes: sm, md, lg
// Features: Loading state, disabled state, hover lift effect

<EmergentButton variant="primary" size="md">
  Start Learning
</EmergentButton>
```

#### 2. EmergentCard.tsx
```typescript
// Variants: default, dark, hero, glass
// Features: Hover effect, rounded-3xl, custom shadows

<EmergentCard variant="default" hover>
  {children}
</EmergentCard>
```

#### 3. EmergentBadge.tsx
```typescript
// Variants: success, warning, error, info, neutral
<EmergentBadge variant="success">Completed</EmergentBadge>
```

#### 4. EmergentInput.tsx
```typescript
// Form input with focus ring, error states
<EmergentInput 
  label="Email" 
  error="Invalid email"
/>
```

#### 5. EmergentProgress.tsx
```typescript
// Horizontal bar + circular ring variants
<EmergentProgress value={64} color="#E76F51" />
```

#### 6. EmergentStatTile.tsx
```typescript
// Small stat display with mono font
<EmergentStatTile label="XP Earned" value={2590} />
```

---

### PHASE 2: High Priority Pages (Days 4-6)

#### **Priority HIGH** (User-facing landing pages)

**Day 4: Home Page**
- File: `/src/app/page.tsx`
- Changes:
  - Replace CSS variables with EmergentCard components
  - Update stat cards to use EmergentStatTile
  - Daily MCQ card: Add glass effect
  - Navigation buttons: Use EmergentButton
- Test: Greeting, stats, daily MCQ, achievements grid

**Day 5: English Dashboard**
- File: `/src/app/english/page.tsx`
- **Major Changes**:
  ```typescript
  // BEFORE
  <div className="bg-gradient-to-br from-blue-500 to-cyan-500">
  
  // AFTER
  <div className="bg-gradient-to-br from-[#E76F51] to-[#D65A3D]">
  ```
- Colors:
  - Foundation path: `from-[#E76F51] to-[#D65A3D]`
  - Advanced path: `from-[#7C3AED] to-[#A855F7]` (keep purple)
  - IELTS/TOEFL: `from-[#2A9D8F] to-[#10B981]` (teal)
- Test: All 4 learning paths, progress bars, leaderboard

**Day 6: English Path Pages**
- Files:
  - `/src/app/learn/english/foundation/page.tsx`
  - `/src/app/learn/english/advanced/page.tsx`
  - `/src/app/learn/english/ielts-toefl/page.tsx`
  - `/src/app/learn/english/vocabulary/page.tsx`
- Changes:
  - Module cards: Use EmergentCard with hover
  - Topic grid: Replace #5B7CFF with #E76F51
  - CEFR badges: Use EmergentBadge
  - Progress indicators: EmergentProgress
- Test: Module expansion, topic navigation, CEFR levels

---

### PHASE 3: Medium Priority Pages (Days 7-9)

**Day 7: Dashboard + Quiz**
- Files:
  - `/src/app/dashboard/page.tsx`
  - `/src/app/quiz/page.tsx`
- Dashboard changes:
  - Stat cards: EmergentStatTile with mono font
  - Exam breakdown: EmergentProgress bars
  - Mistake map: EmergentCard variant="hero"
  - Charts: Update colors to emergentColors
- Quiz changes:
  - Question card: EmergentCard variant="glass"
  - Answer options: Custom styling with #E76F51 selected state
  - Progress: EmergentProgress
  - Results: EmergentStatTile for metrics

**Day 8: Mock Test + Sprint**
- Files:
  - `/src/app/mock-test/page.tsx`
  - `/src/app/sprint/page.tsx`
- Mock Test:
  - Test type toggle: Active uses #E76F51
  - Timer: Mono font with #1E293B
  - Question palette: answered=#2A9D8F, flagged=#E76F51
  - Navigation: EmergentButton variants
- Sprint:
  - Leaderboard: Gold/Silver/Bronze badges
  - Challenge cards: EmergentCard with hover
  - Category filters: Active #E76F51
  - Medal badges: Custom colors

**Day 9: Review**
- File: `/src/app/review/page.tsx`
- Changes:
  - Urgent cards: border-[#DC2626] with bg-red-50/50
  - Soon cards: border-[#E9C46A]
  - Later cards: border-[#2A9D8F]
  - Mastery score: EmergentProgress with color based on value
  - Review queue: EmergentCard with hover

---

### PHASE 4: Low Priority Pages (Days 10-11)

**Day 10: Settings + Contact**
- Files:
  - `/src/app/settings/page.tsx`
  - `/src/app/contact/page.tsx`
- Settings:
  - Form inputs: Use EmergentInput
  - Toggle switches: Active #E76F51
  - Subscription badge: Gold color for Pro
- Contact:
  - Form container: EmergentCard
  - Success message: #2A9D8F with border
  - Submit button: EmergentButton primary

**Day 11: Custom Quiz + Static Pages**
- Files:
  - `/src/app/custom-quiz/page.tsx`
  - `/src/app/privacy/page.tsx`
- Custom Quiz:
  - Drag & drop zone: border-[#E76F51] on active
  - File icons: Replace blue with terracotta
  - Tab interface: Active #E76F51
  - Configuration cards: EmergentCard with radio groups
- Privacy/Terms:
  - Minimal changes (already using CSS variables)
  - Add font-heading to titles
  - Update link colors to #E76F51

---

### PHASE 5: Testing & Polish (Days 12-15)

**Day 12: Comprehensive QA**
- Visual regression testing (Percy/Chromatic)
- Test matrix: Chrome, Firefox, Safari, Edge
- Viewports: 375px, 768px, 1440px
- Dark mode verification on all pages
- Accessibility audit (axe DevTools)

**Day 13: Accessibility Fixes**
- Color contrast validation (WCAG AA)
- Keyboard navigation testing
- Screen reader testing (NVDA/VoiceOver)
- Focus indicators verification
- ARIA labels check

**Day 14: Performance Optimization**
- Font preloading (Outfit, Manrope, JetBrains Mono)
- Image optimization
- Lazy loading below-the-fold components
- CSS containment for grids
- Bundle size analysis

**Day 15: Production Deployment**
- Deploy to staging
- User acceptance testing (UAT)
- Production deployment
- Monitoring setup (Sentry, Vercel Analytics)
- User feedback collection

---

## ✅ TESTING CHECKLIST

### Per-Page Verification

```
Page: _______________

Visual:
[ ] Colors match Emergent palette (no #5B7CFF, #4255FF)
[ ] Shadows use .shadow-soft or .shadow-pop
[ ] Borders use border-black/5
[ ] Rounded corners: rounded-2xl or rounded-3xl
[ ] Hover effects work (-translate-y-1)

Typography:
[ ] Headings use font-heading (Outfit)
[ ] Stats use font-mono (JetBrains Mono)
[ ] Body text uses Manrope
[ ] Letter spacing correct (tracking-tight, tracking-tighter)

Components:
[ ] Buttons use EmergentButton
[ ] Cards use EmergentCard
[ ] Badges use EmergentBadge
[ ] Inputs use EmergentInput
[ ] Progress uses EmergentProgress

Functionality:
[ ] All interactions work
[ ] No console errors
[ ] Data loads correctly
[ ] Navigation works

Responsive:
[ ] Mobile (375px) displays correctly
[ ] Tablet (768px) displays correctly
[ ] Desktop (1440px) displays correctly
[ ] No horizontal scroll

Accessibility:
[ ] WCAG AA color contrast
[ ] Keyboard navigation works
[ ] Focus indicators visible
[ ] Screen reader friendly
[ ] No accessibility violations

Performance:
[ ] LCP < 2.5s
[ ] FCP < 1.8s
[ ] CLS < 0.1
[ ] TTI < 3.8s
```

---

## 🚨 CRITICAL ISSUES FOUND

### Issues from Audit:

1. **English Dashboard** (`/english`)
   - Severity: HIGH
   - Issue: Uses #5B7CFF extensively for primary actions and gradients
   - Impact: Brand inconsistency on key learning page
   - Fix Priority: 1

2. **Quiz Interface** (`/quiz`)
   - Severity: HIGH
   - Issue: #4255FF used for answer options, progress bars
   - Impact: Color clash with brand identity
   - Fix Priority: 2

3. **Mock Test** (`/mock-test`)
   - Severity: MEDIUM
   - Issue: Legacy blue for timer, question palette
   - Impact: Important feature but less visible
   - Fix Priority: 3

4. **Custom Quiz** (`/custom-quiz`)
   - Severity: MEDIUM
   - Issue: Blue file upload UI (#6B9FD6)
   - Impact: Secondary feature
   - Fix Priority: 4

---

## 💡 QUICK WINS

### Can Be Fixed in < 1 Hour Each:

1. **Universal Search Bar**
   - File: `/src/components/universal-search.tsx`
   - Change: Update border-[#5B7CFF] → border-[#E76F51] on focus
   - Lines: ~153

2. **English Vocabulary Page**
   - File: `/src/app/learn/english/vocabulary/page.tsx`
   - Change: Update #F59E0B → #E9C46A (gold)
   - Already close to Emergent palette

3. **Settings Toggles**
   - File: `/src/app/settings/page.tsx`
   - Change: Toggle active state to #E76F51
   - Simple CSS update

4. **Sprint Category Filters**
   - File: `/src/app/sprint/page.tsx`
   - Change: Active filter #4255FF → #E76F51
   - Single line change

---

## 📁 FILES TO CREATE

### Component Library
```
src/components/emergent/
├── EmergentButton.tsx
├── EmergentCard.tsx
├── EmergentBadge.tsx
├── EmergentInput.tsx
├── EmergentProgress.tsx
├── EmergentStatTile.tsx
└── index.ts (barrel export)
```

### Configuration
```
src/lib/
├── emergent-colors.ts (color constants)
└── emergent-utils.ts (helper functions)
```

### Documentation
```
docs/
├── EMERGENT-DESIGN-SYSTEM.md (✅ Already created)
└── EMERGENT-MIGRATION-ROADMAP.md (This file)
```

---

## 🎯 SUCCESS METRICS

### Target Goals:

- ✅ **0** hardcoded legacy colors (#5B7CFF, #4255FF)
- ✅ **100%** pages use Emergent components
- ✅ **WCAG AA** compliance (4.5:1 contrast ratios)
- ✅ **0** visual regressions (Percy tests)
- ✅ **LCP < 2.5s** on all pages
- ✅ **Dark mode** works on all pages
- ✅ **Mobile responsive** (no horizontal scroll)

### User Experience Improvements:

- Consistent button hover effects (-translate-y-1)
- Unified card styling (rounded-3xl, subtle shadows)
- Faster perceived performance
- Clearer visual hierarchy (Outfit for headings)
- Better touch targets (min 44px)
- Smooth transitions (300ms ease-out)

---

## 🔄 ROLLBACK PLAN

If issues found in production:

```bash
# Instant rollback to previous deployment
vercel rollback

# Or revert specific commit
git revert <migration-commit-hash>
git push origin main
```

**Monitoring During Rollout**:
- Sentry error rates
- Vercel Analytics performance
- Hotjar session recordings
- User feedback (support tickets, NPS)

---

## 📞 SUPPORT RESOURCES

### Design System Docs:
- **Main Guide**: `/docs/EMERGENT-DESIGN-SYSTEM.md`
- **Color Palette**: See `emergent-colors.ts`
- **Component Examples**: Storybook (to be created)

### Reference Mockup:
- **Location**: `/Users/girish.raj/Downloads/EmergentDesignMockup-main 2/`
- **Key Files**:
  - `design_guidelines.json` - Complete design system
  - `frontend/src/pages/Home.jsx` - Reference implementation
  - `frontend/src/pages/StudyGuides.jsx` - Layout example
  - `frontend/src/pages/Flashcards.jsx` - Interactive component

---

## 🏁 NEXT STEPS

### Immediate Actions (Today):

1. ✅ Review this roadmap
2. ⏳ Create component library folder: `src/components/emergent/`
3. ⏳ Implement EmergentButton component
4. ⏳ Implement EmergentCard component
5. ⏳ Create `emergent-colors.ts` with color constants

### This Week:

1. Complete all 7 reusable components
2. Set up Storybook for documentation
3. Write unit tests for components
4. Migrate Home page as proof of concept
5. QA testing on Home page

### Next Week:

1. Migrate English dashboard + all English learning pages
2. Update universal search bar
3. Visual regression testing
4. Accessibility audit
5. Performance optimization

---

**Status**: ✅ **READY FOR IMPLEMENTATION**  
**Next Action**: Create component library and start with EmergentButton

---

*This roadmap was generated by analyzing 15 pages, 7 component patterns, and the complete Emergent Design mockup. Estimated completion: 15-18 days full-time.*
