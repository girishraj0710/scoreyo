# PrepGenie - Smart Exam Prep for Indian Competitive Exams

## Project Overview
AI-powered exam preparation app for 20+ Indian competitive exams (JEE, NEET, UPSC, SSC, Banking, CAT, GATE, etc.). Features quiz engine, mock tests, spaced repetition review, performance reports, and Razorpay payments.

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
- **Database**: Turso (cloud SQLite via @libsql/client) — Mumbai region
- **AI**: OpenRouter API (Gemini) for question generation
- **Payments**: Razorpay (test mode)
- **Email OTP**: Resend
- **Auth**: Cookie-based (`prepgenie-user-id`)

## Key Files
- `src/lib/db.ts` — All database functions (async, Turso)
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
TURSO_DATABASE_URL=libsql://prepgenie-girishraj0710.aws-ap-south-1.turso.io
TURSO_AUTH_TOKEN=...
```

## GitHub
- Repo: https://github.com/girishraj0710/prepgenie (private)
- Branch: main

## Current Status (May 2026)
- ✅ Phase 1: Quiz engine, auth, dashboard, review, leaderboard
- ✅ Phase 2: OTP email auth, multilingual support (8 languages)
- ✅ Phase 3: Razorpay payments, mock tests, performance reports
- ✅ Database migrated from local SQLite to Turso (cloud)
- ✅ Deployed to Vercel: https://prepgenie.co.in
- ✅ Custom domain setup: prepgenie.co.in (DNS + SSL configured)
- ✅ Custom email domain: noreply@prepgenie.co.in (Resend verified)
- ✅ Production code cleanup: Removed debug logs, security fixes
- ✅ Multilingual: 8 Indian languages (English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada)
- ✅ **NEW: Gemini AI Recommendations Implemented (6 of 7 priorities = 86%):**
  - ✅ Priority 1: Rich Explanations (logic links, trap alerts, formulas, common mistakes)
  - ✅ Priority 2: Mistake Map (tracks calculation/concept/time/careless errors)
  - ✅ Priority 3: Midnight Doubt AI (instant clarification chat at any time)
  - ✅ Priority 4: Pressure Mode (adaptive timer, stress simulation)
  - ✅ Priority 5: Live Leaderboard Sprints (MVP - backend ready, UI pending)
  - ✅ Priority 7: Daily Practice Problems (10-min micro-learning with streaks)
- ⏳ Deferred: Priority 6 (True Offline Mode - complex, requires Service Worker + IndexedDB)
- ⏳ Later: Mobile app (Capacitor), Razorpay live keys
