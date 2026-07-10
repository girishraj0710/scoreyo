# 🔧 Quick Debug Reference

## 🚀 Quick Start (3 Steps)

### 1️⃣ Debug - See What's Wrong
```javascript
(function(){console.clear();const h=document.querySelector('header[class*="fixed"]');const m=document.querySelector('main');const s=Array.from(document.querySelectorAll('[class*="sticky"]')).filter(e=>window.getComputedStyle(e).position==='sticky');console.log('🔍 ALIGNMENT DEBUG\n');if(h){const r=h.getBoundingClientRect();console.log(`Fixed Header: ${r.height}px, Top: ${r.top}px`);}else{console.log('❌ Fixed header not found');}if(m){const r=m.getBoundingClientRect();const c=window.getComputedStyle(m);console.log(`Main Content: Top ${r.top}px, Margin-top: ${c.marginTop}, Padding-top: ${c.paddingTop}`);}else{console.log('❌ Main element not found');}s.forEach((e,i)=>{const r=e.getBoundingClientRect();const c=window.getComputedStyle(e);console.log(`Sticky #${i+1}: Top ${r.top}px, Computed top: ${c.top}`);});const H=h?h.getBoundingClientRect().height:0;const M=m?m.getBoundingClientRect().top:0;console.log(`\n📊 Summary:\nFixed Header Height: ${H}px\nMain Content Top: ${M}px\nGap: ${M-H}px ${Math.abs(M-H)<5?'✅':'⚠️'}\n`);console.log(Math.abs(M-H)<5?'✅ Alignment looks correct':'⚠️ Alignment issue detected');})();
```

### 2️⃣ Read the Output
You'll see something like:
```
🔍 ALIGNMENT DEBUG

Fixed Header: 95px, Top: 0px
Main Content: Top 73px, Margin-top: 73px, Padding-top: 0px
Sticky #1: Top 0px, Computed top: 0px

📊 Summary:
Fixed Header Height: 95px
Main Content Top: 73px
Gap: -22px ⚠️

⚠️ Alignment issue detected
```

### 3️⃣ Fix It
```javascript
(function(){const h=document.querySelector('header[class*="fixed"]');if(!h)return console.error('Header not found');const H=h.getBoundingClientRect().height;const m=document.querySelector('main');if(m&&window.innerWidth>=768)m.style.marginTop=H+'px';document.querySelectorAll('[class*="sticky"]').forEach(e=>{if(window.innerWidth>=768)e.style.top=H+'px'});document.querySelectorAll('div[class*="min-h-screen"]').forEach(w=>{if(w.querySelector('[class*="sticky"]')&&window.innerWidth>=768){w.style.marginTop='-'+H+'px';w.style.paddingTop=H+'px'}});console.log('✅ Fixed! Header:'+H+'px');const i=document.createElement('div');i.textContent='✅ Alignment Fixed';i.style.cssText='position:fixed;top:10px;right:10px;background:#10B981;color:white;padding:12px 20px;border-radius:8px;font-weight:600;z-index:99999';document.body.appendChild(i);setTimeout(()=>i.remove(),2000)})();
```

---

## 📊 Understanding the Output

### ✅ Correct Alignment
```
Fixed Header Height: 95px
Main Content Top: 95px
Gap: 0px ✅
```
- Gap should be **0-5px** (small tolerance)
- Main content starts right below fixed header

### ⚠️ Content Too High (Hidden)
```
Fixed Header Height: 95px
Main Content Top: 73px
Gap: -22px ⚠️
```
- **Negative gap** = content is hidden under header
- Main top should equal header height

### ⚠️ Content Too Low (Excessive Space)
```
Fixed Header Height: 95px
Main Content Top: 120px
Gap: 25px ⚠️
```
- **Large positive gap** = too much white space
- Main top should equal header height

---

## 🎯 Common Issues & Fixes

### Issue 1: Content Hidden Under Header
**Symptom:**
```
Gap: -22px ⚠️
```

**Cause:** Main content margin is less than header height

**Fix:** Run the fix script (Step 3 above)

---

### Issue 2: Excessive White Space
**Symptom:**
```
Gap: 50px ⚠️
```

**Cause:** Main content margin is more than header height

**Fix:** Run the fix script (Step 3 above)

---

### Issue 3: Sticky Header Hidden
**Symptom:**
```
Sticky #1: Top 0px, Computed top: 0px
```

**Cause:** Sticky header's `top` value doesn't account for fixed header

**Fix:** Run the fix script (Step 3 above)

---

## 🔬 Advanced Debugging

### Full Visual Debug (Recommended)
Copy the **entire contents** of `debug-alignment.js` and paste into console.

**What you get:**
- 📊 Detailed table of all measurements
- 🎨 Visual overlay showing all elements
- ⚠️ List of specific issues found
- 💡 Exact recommendations for your case

**Visual Overlay Colors:**
- 🔴 Red = Fixed Header area
- 🟢 Green = Main Content start
- 🟣 Purple = Sticky Headers

---

## 📁 File Locations

| File | Purpose | Usage |
|------|---------|-------|
| `debug-alignment.js` | Full debug with visual overlay | Console - detailed analysis |
| `fix-alignment.js` | Automatic fix script | Console - quick fix |
| `public/debug-oneliner.txt` | One-liner debug | Console - quick check |
| `public/fix-alignment-oneliner.txt` | One-liner fix | Console - quick fix |
| `ALIGNMENT-FIX-GUIDE.md` | Complete documentation | Read - understand the issue |

---

## 🎓 How to Open Console

### Chrome / Edge / Brave
- **Windows:** `Ctrl + Shift + J` or `F12`
- **Mac:** `Cmd + Option + J`

### Firefox
- **Windows:** `Ctrl + Shift + K` or `F12`
- **Mac:** `Cmd + Option + K`

### Safari
1. Enable Developer Menu: Preferences → Advanced → Show Develop menu
2. **Mac:** `Cmd + Option + C`

---

## 💾 Save Scripts as Bookmarks

1. Create a new bookmark
2. Name it "Debug Alignment"
3. In URL field, paste:
```javascript
javascript:(function(){console.clear();const h=document.querySelector('header[class*="fixed"]');const m=document.querySelector('main');if(h){const r=h.getBoundingClientRect();console.log(`Header: ${r.height}px`);}if(m){const r=m.getBoundingClientRect();console.log(`Main: ${r.top}px`);}})();
```
4. Click bookmark to run instantly!

---

## 🆘 Still Not Working?

If scripts don't fix the issue:

1. **Take screenshots** showing:
   - The page with the issue
   - DevTools console with debug output
   - Browser zoom level (should be 100%)

2. **Share this info:**
   - Which page has the issue? (`/english`, `/study-guides`, etc.)
   - What you see vs what you expect
   - Browser name and version
   - Screen size / resolution

3. **Check these common causes:**
   - Browser zoom not at 100%
   - Browser extensions interfering (try incognito)
   - Cache not cleared (hard refresh: `Cmd+Shift+R`)
   - Mobile vs Desktop view (scripts only work on desktop)

---

## 🎯 Expected Values

For reference, correct alignment should show:

```
Fixed Header: 95-96px
Main Content: 95-96px (matches header)
Sticky Headers: 95-96px (matches header)
Gap: 0-5px ✅
```

Any deviation > 5px indicates an alignment issue.
