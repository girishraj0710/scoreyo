# IELTS Speaking - Testing Guide

## 🎯 Quick Test (2 Minutes)

### Step 1: Access the Page
```
Local: http://localhost:3000/english/foundation/ielts-speaking/practice
Production: https://prepgenie.co.in/english/foundation/ielts-speaking/practice
```

### Step 2: Test Part Selection
Click through the tabs:
- [ ] Part 1 (Interview) - Purple badge
- [ ] Part 2 (Long Turn) - Blue badge  
- [ ] Part 3 (Discussion) - Green badge

### Step 3: Test Voice Recording (Part 1)
1. Click "Start Recording"
2. Allow microphone permissions (browser will prompt)
3. Speak for 10-15 seconds (e.g., answer the hometown question)
4. Click "Stop Recording"
5. Audio player should appear with playback controls
6. Click play button to hear your recording
7. Click "Record Again" to clear and re-record

### Step 4: Test Part 2 Timer
1. Switch to Part 2 tab
2. Read the cue card
3. Click "Start Preparation Timer"
4. Timer counts down from 1:00 to 0:00
5. Click "Start Recording" after prep time
6. Speak your answer (timer shows speaking time)
7. Recording auto-stops at 2:00 or click "Stop Recording" earlier

### Step 5: Test Learning Features
1. Scroll down to see:
   - [ ] Tips section (4-5 bullet points)
   - [ ] Keywords section (5-8 vocabulary words)
   - [ ] "Show Sample Answer" button
2. Click "Show Sample Answer"
3. Read the model answer

### Step 6: Test Navigation
1. Click "Next Question" button
2. New random question should load
3. Recording and sample answer should reset
4. Click "← Back" to exit

---

## ✅ Expected Behavior

### Part 1 Question Format
```
┌─────────────────────────────────────────────────────┐
│ [Part 1: Interview] Topic: Hometown                 │
│                                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Can you describe your hometown?                 │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ 🎙️ Voice Recording                                  │
│ [Start Recording]                                    │
│                                                      │
│ 💡 Tips                                              │
│ • Mention the location and size                     │
│ • Describe what it's known for                      │
│ • Express your personal feelings                    │
│                                                      │
│ 🔑 Useful Keywords                                   │
│ [coastal] [metropolitan] [diverse] [vibrant]       │
│                                                      │
│ [Show Sample Answer]                                 │
└─────────────────────────────────────────────────────┘
```

### Part 2 Cue Card Format
```
┌─────────────────────────────────────────────────────┐
│ [Part 2: Long Turn] Topic: Memorable Event          │
│                                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Describe a memorable event in your life         │ │
│ │                                                  │ │
│ │ You should say:                                  │ │
│ │  • What the event was                           │ │
│ │  • When it happened                             │ │
│ │  • Who was there with you                       │ │
│ │  • And explain why it was memorable             │ │
│ │                                                  │ │
│ │ ⏱️ Preparation: 1 minute                         │ │
│ │ 🎤 Speaking: 2 minutes                           │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ [Start Preparation Timer]                            │
│                                                      │
│ ⏱️ Preparation Time                                  │
│ 0:45                                                 │
│                                                      │
│ 🎙️ Voice Recording                                  │
│ [Start Recording]                                    │
└─────────────────────────────────────────────────────┘
```

### While Recording
```
┌─────────────────────────────────────────────────────┐
│ 🎙️ Voice Recording                                  │
│ [■ Stop Recording] (pulsing red button)             │
└─────────────────────────────────────────────────────┘
```

### After Recording
```
┌─────────────────────────────────────────────────────┐
│ 🎙️ Voice Recording                                  │
│ [Audio Player Controls ────▶────]                   │
│ [Record Again]                                       │
└─────────────────────────────────────────────────────┘
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Microphone Permission Denied
**Symptom:** Red error message appears
```
Microphone access denied. Please enable microphone 
permissions in your browser.
```

**Solution:**
1. Click the lock icon in browser address bar
2. Change microphone permission to "Allow"
3. Refresh the page
4. Try recording again

### Issue 2: No Sound on Playback
**Symptom:** Recording plays but no audio heard

**Possible Causes:**
- Volume is muted
- Microphone was muted during recording
- Browser doesn't support audio recording

**Solution:**
1. Check system volume
2. Try recording again (speak louder)
3. Test in Chrome/Firefox (best support)

### Issue 3: Timer Doesn't Start
**Symptom:** Clicking timer button does nothing

**Solution:**
1. Refresh the page
2. Try a different part/question
3. Check browser console for errors (F12)

---

## 📊 Browser Compatibility Test

### ✅ Fully Supported
- Chrome 47+ (Desktop & Mobile)
- Firefox 25+ (Desktop & Mobile)
- Edge 79+ (Desktop & Mobile)
- Safari 14.1+ (Desktop & Mobile)
- Opera 36+

### ⚠️ Limited Support
- Safari < 14.1 (no MediaRecorder)
- iOS Safari < 14.5 (no getUserMedia)

### ❌ Not Supported
- Internet Explorer 11

---

## 🎨 Visual Verification Checklist

### Colors & Badges
- [ ] Part 1 badge: Purple background with white text
- [ ] Part 2 badge: Blue background with white text
- [ ] Part 3 badge: Green background with white text
- [ ] Background: Gradient from purple-50 to blue-50

### Card Styling
- [ ] Question cards have rounded corners (rounded-2xl)
- [ ] Cards have shadow (shadow-lg)
- [ ] Border-left accent color matches part badge color

### Buttons
- [ ] Start Recording: Red background (bg-red-600)
- [ ] Stop Recording: Gray background, pulsing animation
- [ ] Show Sample Answer: Gradient purple-to-blue
- [ ] Next Question: White background with shadow

### Timer Display
- [ ] Yellow background (bg-yellow-50)
- [ ] Large font for time (text-3xl)
- [ ] Counts down smoothly (1 second intervals)

---

## 🔍 API Endpoint Testing

### Test 1: Get All Part 1 Questions
```bash
curl 'http://localhost:3000/api/english/speaking?part=1'
```

**Expected Output:** JSON with 5 questions
```json
{
  "questions": [
    {
      "id": 1,
      "part": 1,
      "topic": "Hometown",
      "question": "Can you describe your hometown?",
      "sampleAnswer": "I come from Mumbai...",
      "tips": ["Mention the location...", ...],
      "keywords": ["coastal", "metropolitan", ...]
    },
    ...
  ]
}
```

### Test 2: Get Random Part 2 Question
```bash
curl 'http://localhost:3000/api/english/speaking?part=2&random=true'
```

**Expected Output:** JSON with 1 random cue card
```json
{
  "question": {
    "id": 32,
    "part": 2,
    "topic": "Book",
    "cueCard": {
      "title": "Describe a book you recently read",
      "points": ["What the book was about", ...],
      "prepTime": 60,
      "speakTime": 120
    },
    "sampleAnswer": "I recently finished reading...",
    "tips": [...],
    "keywords": [...]
  }
}
```

### Test 3: Get All Part 3 Questions
```bash
curl 'http://localhost:3000/api/english/speaking?part=3'
```

**Expected Output:** JSON with 5 discussion questions

---

## 📱 Mobile Testing

### Responsive Design Check
1. Open on mobile browser (Chrome/Safari)
2. Check layout:
   - [ ] Tab buttons are full-width and stackable
   - [ ] Question cards fit screen width
   - [ ] Recording button is touch-friendly (min 44px height)
   - [ ] Timer is clearly visible
   - [ ] Sample answer is readable without zooming

### Touch Interactions
- [ ] Tapping part tabs switches correctly
- [ ] Record button responds to touch
- [ ] Audio player controls work with touch
- [ ] "Show Sample Answer" expands smoothly

---

## 🚀 Production Verification

Once deployed to Vercel, test:

### URL
```
https://prepgenie.co.in/english/foundation/ielts-speaking/practice
```

### Deployment Checklist
- [ ] Page loads without errors
- [ ] All 3 parts are accessible
- [ ] Voice recording works on HTTPS
- [ ] Timer functions correctly
- [ ] Sample answers display
- [ ] "Next Question" loads new content
- [ ] No console errors in browser DevTools

---

## 📝 Sample Test Scenarios

### Scenario 1: Complete Part 1 Practice
1. Load page → Part 1 selected by default
2. Read question: "Can you describe your hometown?"
3. Click "Start Recording"
4. Speak answer for 30 seconds
5. Click "Stop Recording"
6. Play back recording
7. Scroll down, click "Show Sample Answer"
8. Compare your answer with sample
9. Click "Next Question"
10. New Part 1 question loads

### Scenario 2: Complete Part 2 with Timer
1. Switch to Part 2 tab
2. Read cue card about memorable event
3. Click "Start Preparation Timer"
4. Take notes mentally for 60 seconds
5. Timer reaches 0:00
6. Click "Start Recording"
7. Speak for 2 minutes (or until auto-stop)
8. Listen to playback
9. Check tips and keywords
10. View sample answer

### Scenario 3: Error Recovery
1. Switch to Part 3 tab
2. Click "Start Recording" → Deny microphone permission
3. Error message appears
4. Enable microphone in browser settings
5. Refresh page
6. Click "Start Recording" again
7. Successfully record answer

---

## 🎯 Success Criteria

✅ **All tests pass if:**
1. All 3 parts load different questions
2. Voice recording captures and plays back audio
3. Part 2 timer counts down correctly
4. Sample answers are visible and complete
5. Tips and keywords display for each question
6. "Next Question" loads new content without refresh
7. No console errors in browser DevTools
8. Mobile layout is responsive and touch-friendly
9. Microphone permission errors are handled gracefully
10. Navigation (back button) works correctly

---

## 🔗 Related Documentation
- [Implementation Plan](./ielts-speaking-implementation-plan.md)
- [Implementation Summary](./ielts-speaking-implementation-summary.md)
- [MDN Web Docs: MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [IELTS Speaking Test Format](https://www.ielts.org/for-test-takers/test-format)
