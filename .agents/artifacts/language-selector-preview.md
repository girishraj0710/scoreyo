# 🌍 Language Selector - Visual Preview

## Desktop View

### **Header (Before Login)**
```
┌──────────────────────────────────────────────────────────────────┐
│  [P] PrepGenie    Home  Dashboard  Review  Mock Tests  Reports   │
│                   Pricing  [🇮🇳 हिंदी ▼]  [Log in]  [Sign up]    │
└──────────────────────────────────────────────────────────────────┘
```

### **Language Dropdown (Open)**
```
                                    ┌───────────────────────────┐
                                    │ Select Language           │
                                    ├───────────────────────────┤
                                    │ 🇬🇧 English     ✓         │
                                    │    English                │
                                    ├───────────────────────────┤
                                    │ 🇮🇳 हिंदी    [selected]   │
                                    │    Hindi                  │
                                    ├───────────────────────────┤
                                    │ 🇮🇳 தமிழ்                  │
                                    │    Tamil                  │
                                    ├───────────────────────────┤
                                    │ 🇮🇳 తెలుగు                 │
                                    │    Telugu                 │
                                    ├───────────────────────────┤
                                    │ 🇮🇳 বাংলা                  │
                                    │    Bengali                │
                                    ├───────────────────────────┤
                                    │ 🇮🇳 मराठी                  │
                                    │    Marathi                │
                                    ├───────────────────────────┤
                                    │ 🇮🇳 ગુજરાતી                │
                                    │    Gujarati               │
                                    ├───────────────────────────┤
                                    │ 🇮🇳 ಕನ್ನಡ                  │
                                    │    Kannada                │
                                    ├───────────────────────────┤
                                    │ ℹ Questions in English +  │
                                    │   Selected language       │
                                    └───────────────────────────┘
```

---

## Mobile View

### **Header (Compact)**
```
┌──────────────────────────────┐
│ [P] PrepGenie    [🇮🇳 HI ▼] │
│                   [≡]        │
└──────────────────────────────┘
```

### **Language Dropdown (Mobile)**
```
              ┌────────────────┐
              │ Select Language│
              ├────────────────┤
              │ 🇬🇧 EN   ✓     │
              ├────────────────┤
              │ 🇮🇳 HI [sel]   │
              ├────────────────┤
              │ 🇮🇳 TA         │
              ├────────────────┤
              │ 🇮🇳 TE         │
              ├────────────────┤
              │ 🇮🇳 BN         │
              ├────────────────┤
              │ 🇮🇳 MR         │
              ├────────────────┤
              │ 🇮🇳 GU         │
              ├────────────────┤
              │ 🇮🇳 KN         │
              └────────────────┘
```

---

## Example Translations Across Languages

### **Navigation**
| Element | English | Hindi | Tamil | Telugu |
|---------|---------|-------|-------|--------|
| Home | Home | होम | முகப்பு | హోమ్ |
| Dashboard | Dashboard | डैशबोर्ड | டாஷ்போர்டு | డాష్‌బోర్డ్ |
| Start Quiz | Start Quiz | क्विज़ शुरू करें | வினாடி வினாவைத் தொடங்கு | క్విజ్ ప్రారంభించండి |

### **Quiz Interface**
| Element | English | Bengali | Marathi | Gujarati |
|---------|---------|---------|---------|----------|
| Check Answer | Check Answer | উত্তর পরীক্ষা করুন | उत्तर तपासा | જવાબ તપાસો |
| Next Question | Next Question | পরবর্তী প্রশ্ন | पुढील प्रश्न | આગળનો પ્રશ્ન |
| Correct | Correct | সঠিক | बरोबर | સાચો |
| Wrong | Wrong | ভুল | चुकीचे | ખોટો |

### **Hero Text (Home Page)**
**English:**
> "Smart Exam Prep - Practice with expert-curated questions from NCERT..."

**Hindi:**
> "स्मार्ट परीक्षा तैयारी - JEE, NEET, UPSC, SSC, Banking, CAT और 20+ भारतीय प्रतियोगी परीक्षाओं के लिए NCERT, पिछले वर्ष के प्रश्न पत्रों..."

**Tamil:**
> "திறமையான தேர்வு தயாரிப்பு - JEE, NEET, UPSC, SSC, வங்கி, CAT மற்றும் 20+ இந்திய போட்டித் தேர்வுகளுக்கு NCERT..."

**Kannada:**
> "ಸ್ಮಾರ್ಟ್ ಪರೀಕ್ಷಾ ತಯಾರಿಕೆ - JEE, NEET, UPSC, SSC, ಬ್ಯಾಂಕಿಂಗ್, CAT ಮತ್ತು 20+ ಭಾರತೀಯ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗೆ NCERT..."

---

## Color Scheme

### **Language Selector Button:**
- Border: `border-slate-200`
- Background: `bg-white` (hover: `bg-slate-50`)
- Text: `text-slate-700`
- Icon: Flag emoji + dropdown chevron

### **Dropdown:**
- Background: `bg-white`
- Border: `border-slate-200`
- Shadow: `shadow-lg`
- Hover: `bg-indigo-50`
- Active: `bg-indigo-50 text-indigo-700` with checkmark

### **Animations:**
- Dropdown chevron rotates 180° when open
- Smooth fade-in for dropdown (Tailwind transitions)
- Click outside to close

---

## User Flow

### **First Time User:**
1. Lands on PrepGenie → Default language: English
2. Sees `[🇬🇧 English ▼]` in header
3. Clicks dropdown → Sees all 8 languages
4. Selects `தமிழ்` → Entire UI updates instantly
5. Choice saved in `localStorage`

### **Returning User:**
1. Opens PrepGenie → Automatically loads saved language (e.g., Telugu)
2. Sees `[🇮🇳 తెలుగు ▼]` in header
3. Can switch anytime without losing progress

---

## Responsive Breakpoints

### **Desktop (≥640px):**
- Shows: `🇮🇳 हिंदी ▼` (flag + native name)
- Dropdown: 224px wide (w-56)

### **Mobile (<640px):**
- Shows: `🇮🇳 HI ▼` (flag + 2-letter code)
- Dropdown: Same width, scrollable if needed

---

## Accessibility

- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ ARIA labels for screen readers
- ✅ High contrast text (WCAG AA compliant)
- ✅ Clear visual hierarchy
- ✅ Touch-friendly targets (44px min height)

---

## Technical Notes

### **localStorage Key:**
```javascript
localStorage.getItem('prepgenie-locale') // "ta", "te", "hi", etc.
```

### **HTML Lang Attribute:**
```html
<html lang="ta"> <!-- Updates dynamically -->
```

### **Fallback Strategy:**
```typescript
// If selected language missing a key:
ta["unknownKey"] → en["unknownKey"] → "unknownKey"
```

---

## Future Enhancements

### **Smart Recommendations:**
- Detect browser language → pre-select
- IP-based region detection → suggest local language
- "Popular in your area: தமிழ்" banner

### **Language-Specific Content:**
- Tamil students → Show TNPSC prominently
- Bengali students → Show WBPSC first
- Regional exam content prioritization

### **Bilingual Questions:**
- Show question in English + Selected language side-by-side
- Toggle between scripts with keyboard shortcut

---

**Ready for Production! 🚀**
