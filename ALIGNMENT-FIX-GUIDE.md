# Header Alignment Fix Guide

## The Problem

The app has a **fixed header** at the top, but content was getting hidden underneath it or positioned incorrectly. This happens because:

1. **Fixed header height varies** (95-96px depending on content/padding)
2. **Multiple layout levels** (layout wrapper → page → sticky headers)
3. **CSS cascade conflicts** between different spacing approaches

## Quick Fix (Console Script)

### Method 1: One-Liner (Fast)
1. Open any page with the issue (e.g., `/english` or `/study-guides`)
2. Open DevTools: `F12` or `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Windows)
3. Go to **Console** tab
4. Paste this and press Enter:

```javascript
(function(){const h=document.querySelector('header[class*="fixed"]');if(!h)return console.error('Header not found');const H=h.getBoundingClientRect().height;const m=document.querySelector('main');if(m&&window.innerWidth>=768)m.style.marginTop=H+'px';document.querySelectorAll('[class*="sticky"]').forEach(e=>{if(window.innerWidth>=768)e.style.top=H+'px'});document.querySelectorAll('div[class*="min-h-screen"]').forEach(w=>{if(w.querySelector('[class*="sticky"]')&&window.innerWidth>=768){w.style.marginTop='-'+H+'px';w.style.paddingTop=H+'px'}});console.log('✅ Fixed! Header:'+H+'px');const i=document.createElement('div');i.textContent='✅ Alignment Fixed';i.style.cssText='position:fixed;top:10px;right:10px;background:#10B981;color:white;padding:12px 20px;border-radius:8px;font-weight:600;z-index:99999';document.body.appendChild(i);setTimeout(()=>i.remove(),2000)})();
```

You'll see a green notification: **✅ Alignment Fixed**

### Method 2: Detailed Script (With Debugging)
1. Open the file: `/Users/girish.raj/prepgenie/fix-alignment.js`
2. Copy the **entire contents**
3. Paste into Console and press Enter
4. You'll see detailed logs showing what was fixed

## What The Script Does

```
┌─────────────────────────────┐
│   Fixed Header (95px)       │  ← Measures actual height
├─────────────────────────────┤
│                             │
│   Main Content              │  ← Adds margin-top: 95px
│   (pushed down)             │
│                             │
│   ┌──────────────────────┐  │
│   │ Sticky Header        │  ← Sets top: 95px
│   │ (Welcome back...)    │  │   (sticks below fixed header)
│   └──────────────────────┘  │
│                             │
│   Page Content              │  ← Flows naturally
│   (learning paths...)       │
│                             │
└─────────────────────────────┘
```

## Permanent Fix (Code Changes)

The correct CSS structure should be:

### 1. Layout Level (`conditional-layout.tsx`)
```tsx
<main className="md:mt-[96px]"> {/* Push content below fixed header */}
  {children}
</main>
```

### 2. Pages WITHOUT Sticky Headers (home, dashboard, etc.)
```tsx
<div className="min-h-screen">
  {/* Content starts at 96px naturally */}
</div>
```

### 3. Pages WITH Sticky Headers (english, study-guides, etc.)
```tsx
<div className="min-h-screen md:-mt-[96px] md:pt-[96px]">
  {/* Negative margin cancels layout margin */}
  {/* Padding creates space for sticky header */}
  
  <header className="sticky top-0 md:top-[96px]">
    {/* Sticks at 96px below fixed header */}
  </header>
  
  {/* Content flows naturally below sticky header */}
</div>
```

### The Math
```
Layout margin:    +96px  (pushes content down)
Page neg margin:  -96px  (pulls page back up)
Page padding:     +96px  (creates internal space)
─────────────────────────
Net result:       Content at 96px, sticky header at 96px ✓
```

## Why It Keeps Breaking

The issue keeps recurring because:

1. **Dynamic header height** - The fixed header height changes based on:
   - Padding (`py-4`)
   - Content (buttons, text, icons)
   - Border (`border-b`)
   - Browser zoom level
   - Actual rendered: **95.05px** (not the assumed 73px)

2. **Multiple approaches mixed** - The code has tried:
   - Padding on layout
   - Margin on layout  
   - Negative margins on pages
   - Different values (73px vs 96px)

3. **No single source of truth** - The `96px` value is hardcoded in multiple places

## The Right Way Forward

### Option A: CSS Variable (Recommended)
```css
/* In app-sidebar.tsx */
<header 
  ref={headerRef}
  style={{ '--header-height': `${headerRef.current?.offsetHeight}px` }}
  className="fixed..."
>
```

```css
/* In conditional-layout.tsx */
<main style={{ marginTop: 'var(--header-height, 96px)' }}>
```

### Option B: Dynamic Calculation
```tsx
// In a shared hook
export function useHeaderHeight() {
  const [height, setHeight] = useState(96);
  
  useEffect(() => {
    const header = document.querySelector('header[class*="fixed"]');
    if (header) {
      setHeight(header.getBoundingClientRect().height);
    }
  }, []);
  
  return height;
}
```

### Option C: Accept Dynamic Fix
Keep the console script available and run it when needed. Add to the app:

```tsx
// In development mode only
{process.env.NODE_ENV === 'development' && (
  <button onClick={runAlignmentFix}>
    Fix Alignment
  </button>
)}
```

## Testing Checklist

After any alignment changes, test:

- [ ] Home page: Content not hidden under header
- [ ] English page: "Welcome back" header visible, proper spacing
- [ ] Study Guides: "Select an Exam" header visible, proper spacing
- [ ] Learn English paths: Topic headers aligned correctly
- [ ] Mobile view: No excessive spacing
- [ ] Desktop view: Content at correct position
- [ ] Hard refresh: Changes persist (Cmd+Shift+R)

## Quick Debug Commands

Run these in console to diagnose issues:

```javascript
// Check fixed header height
document.querySelector('header[class*="fixed"]').getBoundingClientRect().height

// Check main margin
window.getComputedStyle(document.querySelector('main')).marginTop

// Check sticky header position
window.getComputedStyle(document.querySelector('[class*="sticky"]')).top

// Check all spacing
console.table({
  'Fixed Header': document.querySelector('header[class*="fixed"]')?.getBoundingClientRect().height + 'px',
  'Main Margin': window.getComputedStyle(document.querySelector('main')).marginTop,
  'Sticky Top': window.getComputedStyle(document.querySelector('[class*="sticky"]'))?.top
});
```

## Files to Check

When debugging alignment issues:

1. `src/components/conditional-layout.tsx` - Main layout wrapper
2. `src/components/app-sidebar.tsx` - Fixed header component
3. `src/app/english/page.tsx` - Page with sticky header
4. `src/app/study-guides/page.tsx` - Page with sticky header
5. `src/app/learn/english/*/page.tsx` - English learning pages

## Support

If the script doesn't work:
1. Take a screenshot with DevTools open showing the Console tab
2. Share the output of the debug commands above
3. Note which page has the issue and what you see vs. what you expect
