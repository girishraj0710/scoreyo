# Krakkify - Smart Exam Prep for Indian Competitive Exams

## Project Overview
AI-powered exam preparation app for **74+ Indian competitive exams** covering ALL major categories: Engineering (JEE, NEET, GATE, State CETs), Government Jobs (UPSC, SSC, Banking, Railways, Police), MBA (CAT, XAT), Law (CLAT, AILET), Teaching (CTET), Defense (NDA, CDS), and more.

**CRITICAL**: We serve ALL 74 exams with equal priority - not just top 10. Every exam must have:
- ✅ Complete subject mappings (exam-specific → shared subjects)
- ✅ All topics linked correctly in bridge table
- ✅ Questions accessible via quiz generation
- ✅ Study materials available
- ✅ Mock tests configured (for major exams)

**One broken exam = students fail to prepare = platform reputation at stake.**

Features: Quiz engine with 3-tier question sourcing (verified bank → cached → AI generation), mock tests, spaced repetition review, performance reports, mistake tracking, AI clarifications, and Razorpay payments.

## This is your instruction 
1. Think Before CodingDon't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:
State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them — don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask.



2. Simplicity FirstMinimum code that solves the problem. Nothing speculative.


No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.


Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.


3. Surgical ChangesTouch only what you must. Clean up only your own mess.

When editing existing code:
Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it — don't delete it.


When your changes create orphans:
Remove imports/variables/functions that your changes made unused.
Don't remove pre-existing dead code unless asked.


The test: Every changed line should trace directly to the user's request.


4. Goal-Driven ExecutionDefine success criteria. Loop until verified.

Transform tasks into verifiable goals:
"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"


For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

## Tech Stack
- **Framework**: Next.js 16.2.4 (App Router, TypeScript, Tailwind CSS)
- **Database**: Supabase PostgreSQL (cloud) — Mumbai region
- **AI**: OpenRouter API (Gemini) for question generation
- **Payments**: Razorpay (test mode)
- **Email OTP**: Resend
- **Auth**: Cookie-based (`krakkify-user-id`)

## Key Files
- `src/lib/db.ts` — All database functions (async, PostgreSQL via pg pool)
- `src/lib/exams.ts` — Exam/subject/topic definitions
- `src/lib/quiz-generator.ts` — AI question generation via OpenRouter
- `src/lib/question-bank.ts` — Verified question bank
- `src/lib/mock-test-config.ts` — Mock test configs (8 exams)
- `src/lib/i18n/translations.ts` — Multilingual (8 languages: en, hi, ta, te, bn, mr, gu, kn)
- `src/context/user-context.tsx` — User auth context
- `src/context/locale-context.tsx` — Language context

## API Routes
- `/api/auth` — Login/register (OTP verified)
- `/api/auth/otp` — Send/verify OTP via Resend
- `/api/quiz` — Generate quiz (3-tier: verified → cached → AI) + submit results
- `/api/stats` — User dashboard stats
- `/api/review` — Spaced repetition review data
- `/api/leaderboard` — Personal bests, milestones
- `/api/mock-test` — Full-length timed mock tests (Pro only)
- `/api/reports` — Detailed performance analytics (Pro only)
- `/api/payment` — Razorpay order creation + verification
- `/api/subscription` — Subscription status check
- `/api/report` — Report incorrect questions
- `/api/weakness` — Record/retrieve mistake patterns (NEW)
- `/api/clarify` — AI instant clarification chat (NEW)
- `/api/dpp` — Daily Practice Problems management (NEW)
- `/api/sprint` — Live leaderboard sprint competitions (NEW)
- `/api/study-content` — Fetch study materials for topics (Study Mode)

## Monetization
- **Free**: 3 quizzes/day, basic features
- **Pro Monthly**: ₹79/month — unlimited quizzes, mock tests, reports
- **Pro Quarterly**: ₹149/quarter (₹50/month, save 37%)

## Environment Variables (.env.local)
```
OPENROUTER_API_KEY=...
RESEND_API_KEY=...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
POSTGRES_URL=postgresql://...
```

## GitHub
- Repo: https://github.com/girishraj0710/krakkify (private)
- Branch: main

## Current Status (June 2026)
- ✅ Phase 1: Quiz engine, auth, dashboard, review, leaderboard
- ✅ Phase 2: OTP email auth, multilingual support (8 languages)
- ✅ Phase 3: Razorpay payments, mock tests, performance reports
- ✅ Database migrated from Turso to Supabase PostgreSQL (cloud, production-ready)
- ✅ Deployed to Vercel: https://krakkify.in
- ✅ **PRIMARY DOMAIN**: https://krakkify.in (GoDaddy + Vercel, DNS synced)
- ✅ **ALTERNATE DOMAIN**: https://crackify.in (redirects to krakkify.in via 308 permanent redirect)
- ✅ **LEGACY DOMAIN**: https://krakkify.co.in (kept for backward compatibility, can redirect later)
- ✅ Custom email domain: noreply@krakkify.in (Resend verified, admin: admin@krakkify.in)
- ✅ Production code cleanup: Removed debug logs, security fixes, all hardcoded admin emails updated
- ✅ Multilingual: 8 Indian languages (English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada)
- ✅ **NEW: Gemini AI Recommendations Implemented (6 of 7 priorities = 86%):**
  - ✅ Priority 1: Rich Explanations (logic links, trap alerts, formulas, common mistakes)
  - ✅ Priority 2: Mistake Map (tracks calculation/concept/time/careless errors)
  - ✅ Priority 3: Midnight Doubt AI (instant clarification chat at any time)
  - ✅ Priority 4: Pressure Mode (adaptive timer, stress simulation)
  - ✅ Priority 5: Live Leaderboard Sprints (MVP - backend ready, UI pending)
  - ✅ Priority 7: Daily Practice Problems (10-min micro-learning with streaks)
- ⏳ Deferred: Priority 6 (True Offline Mode - complex, requires Service Worker + IndexedDB)
- ✅ **Study Mode (Learn Before Quiz):**
  - ✅ Universal study pages work for all exams (JEE, NEET, UPSC, SSC, etc.)
  - ✅ Structured content: sections, examples, formulas, common mistakes, practice problems
  - ✅ Progress tracking, table of contents, section navigation
  - ✅ "Study First" button on all quiz topic selections
  - ✅ Dark mode compatible, mobile responsive
  - ✅ Database: `topic_study_content` table in Supabase
  - ✅ Sample content: Thermodynamics (Physics) ready
  - ⏳ Content generation: Need to add more topics (English, Chemistry, Biology, etc.)
- ✅ **Mobile App Conversion (Capacitor - iOS & Android)**
  - ✅ Capacitor 8.4 integrated (hybrid mode - loads from https://krakkify.in)
  - ✅ iOS platform configured (requires Xcode + CocoaPods for building)
  - ✅ Android platform configured (requires Android Studio + SDK for building)
  - ✅ Native plugins: StatusBar, Keyboard, SplashScreen, Haptics, Browser, App
  - ✅ Mobile-optimized CSS (safe areas, keyboard handling, 44px touch targets)
  - ✅ Deep link support (OTP emails, payment callbacks)
  - ✅ Platform detection utilities (`isNative`, `isIOS`, `isAndroid` in `@/lib/capacitor`)
  - ✅ Razorpay works identically on mobile (no code changes needed)
  - ⏳ App icons & splash screens (need design assets - see `resources/README.md`)
  - ⏳ Testing on physical devices (iPhone + Android)
  - ⏳ App Store & Play Store submissions (post-testing)
  - 📖 Full guide: `MOBILE-APP-SETUP.md`
- ⏳ Later: Razorpay live keys (after app store approval)
