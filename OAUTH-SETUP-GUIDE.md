# 🔐 OAuth Setup Guide - Google Sign-In Integration

**Date:** July 19, 2026  
**Status:** ✅ Code Complete - Awaiting Google OAuth Credentials

---

## 📊 What Was Completed

### ✅ Phase 1: Database Migration
- OAuth columns added to `users` table
- Users cleaned (only 2 remain: admin + student)
- Indexes created for performance
- Migration script: `scripts/migrate-to-oauth.ts`

### ✅ Phase 2: NextAuth.js v5 Integration
- Installed: `next-auth@beta` + `@auth/core`
- Auth configuration: `src/lib/auth.ts`
- API route handler: `src/app/api/auth/[...nextauth]/route.ts`
- Database functions: `findUserByGoogleId()`, `createUserWithGoogle()`, `linkGoogleToUser()`

### ✅ Phase 3: Premium UI Components
- **AuthLayout**: Split-screen design with gradient + premium SVG illustrations
- **OAuthButtons**: Google sign-in button with loading states
- **SignupPage** (`/signup`): Full signup flow with email + Google OAuth
- **LoginPage** (`/login`): Full login flow with email + Google OAuth

### ✅ Phase 4: Code Cleanup
- Removed `LoginModal` from providers
- Removed `showLoginModal` state from UserContext
- Updated all auth flows to redirect to dedicated pages

---

## 🚀 Next Steps: Google OAuth Configuration

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing:
   - Name: **Krakkify**
   - Project ID: `krakkify-prod`

### Step 2: Enable Google OAuth API

1. Navigate to **APIs & Services** → **Library**
2. Search for **"Google+ API"** or **"Google OAuth2"**
3. Click **Enable**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** (for public users)
3. Fill in details:
   - **App name:** Krakkify
   - **User support email:** admin@krakkify.in
   - **Developer contact:** girish.raj0710@gmail.com
   - **App logo:** Upload Krakkify logo (512x512 PNG)
   - **App domain:** https://krakkify.in
   - **Authorized domains:** 
     - `krakkify.in`
     - `vercel.app` (for preview deployments)
   - **Privacy Policy:** https://krakkify.in/privacy
   - **Terms of Service:** https://krakkify.in/terms

4. **Scopes:** Add these OAuth scopes:
   - `openid` (required)
   - `email` (required)
   - `profile` (required)

5. **Test users (during development):**
   - Add: `girish.raj0710@gmail.com`
   - Add: `grgowda07.1992@gmail.com`

6. Click **Save and Continue**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. **Application type:** Web application
4. **Name:** Krakkify Web App
5. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   https://krakkify.in
   https://www.krakkify.in
   https://krakkify.vercel.app
   ```

6. **Authorized redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   https://krakkify.in/api/auth/callback/google
   https://www.krakkify.in/api/auth/callback/google
   https://krakkify.vercel.app/api/auth/callback/google
   ```

7. Click **CREATE**
8. **IMPORTANT:** Copy the credentials shown:
   - **Client ID:** (looks like `123456789-abc...xyz.apps.googleusercontent.com`)
   - **Client Secret:** (looks like `GOCSPX-...`)

### Step 5: Update Environment Variables

1. Open `.env.local` file
2. Replace the placeholder values:

```bash
# Google OAuth - Replace with actual credentials
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-YourActualSecretHere
```

3. For production (Vercel):
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - Set for **Production**, **Preview**, and **Development** environments

---

## 🧪 Testing the OAuth Flow

### Local Development

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Navigate to:
   - **Signup:** http://localhost:3000/signup
   - **Login:** http://localhost:3000/login

3. Click **"Continue with Google"** button

4. Expected flow:
   - Redirects to Google consent screen
   - User selects Google account
   - Redirects back to `/api/auth/callback/google`
   - User is created/logged in
   - Redirects to dashboard (`/`)

### Troubleshooting

**Error:** "redirect_uri_mismatch"
- **Fix:** Add the exact redirect URI to Google Cloud Console

**Error:** "Access blocked: This app's request is invalid"
- **Fix:** Complete OAuth consent screen configuration

**Error:** "NEXTAUTH_SECRET is not set"
- **Fix:** Already set in `.env.local` (auto-generated)

**Error:** "GOOGLE_CLIENT_ID is not set"
- **Fix:** Update `.env.local` with real credentials from Step 4

---

## 📁 File Structure

### New Files Created:
```
src/
├── app/
│   ├── signup/
│   │   └── page.tsx                  # Signup page with OAuth
│   ├── login/
│   │   └── page.tsx                  # Login page with OAuth
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts          # NextAuth API handler
├── components/
│   └── auth/
│       ├── AuthLayout.tsx            # Premium split-screen layout
│       └── OAuthButtons.tsx          # Google OAuth button
└── lib/
    └── auth.ts                       # NextAuth v5 configuration

scripts/
└── migrate-to-oauth.ts               # Database migration script

.env.local.example                    # Environment template
OAUTH-SETUP-GUIDE.md                  # This file
```

### Modified Files:
```
src/
├── app/
│   └── providers.tsx                 # Removed LoginModal
├── context/
│   └── user-context.tsx              # Removed modal state
└── lib/
    └── db.ts                         # Added OAuth functions
```

---

## 🔄 Auth Flow Diagram

### Email OTP Flow (Existing - Still Works)
```
User enters email → OTP sent to email → User enters code → Verified → Logged in
```

### Google OAuth Flow (New)
```
User clicks "Continue with Google"
  ↓
Redirects to Google consent screen
  ↓
User selects account & grants permissions
  ↓
Google redirects back to /api/auth/callback/google
  ↓
NextAuth verifies the authorization code
  ↓
Check if user exists in database:
  - If exists with google_id → Log in
  - If exists with email → Link Google account + log in
  - If new → Create user + log in
  ↓
Set session cookie
  ↓
Redirect to dashboard (/)
```

---

## 🎨 Design Features

### Premium Split-Screen Layout:
- **Left Side (40%):**
  - Gradient background (purple → pink → orange)
  - Custom SVG illustrations (books, trophy, flashcards, stars)
  - Motivational copy
  - Platform stats
  - Krakkify logo

- **Right Side (60%):**
  - Clean white form area
  - Tab-based navigation (Sign up / Log in)
  - OAuth buttons with branded colors
  - Email form with OTP flow
  - Smooth animations with Framer Motion

### Responsive Design:
- **Desktop:** Split-screen layout
- **Mobile:** Stacked layout (form only, logo at top)
- **Dark Mode:** Fully compatible

---

## 🔐 Security Features

1. **OAuth State Protection:** NextAuth handles CSRF protection
2. **Email Verification:** OTP still required for email signup
3. **Session Management:** JWT-based sessions (1 year expiry)
4. **Database Normalization:** User linking prevents duplicates
5. **HTTPS Only:** Enforced in production

---

## 📊 Database Schema

### Users Table (Updated):
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  age INTEGER,
  location TEXT,
  phone_number TEXT,
  exam_preparing_for TEXT,
  avatar_color TEXT DEFAULT '#6366f1',
  role TEXT DEFAULT 'student',
  
  -- OAuth columns (NEW)
  auth_provider TEXT DEFAULT 'email',
  google_id TEXT UNIQUE,
  profile_picture TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_provider ON users(auth_provider);
```

---

## 🚀 Deployment Checklist

### Before Deploying to Production:

- [ ] Google OAuth credentials created
- [ ] Environment variables set in Vercel
- [ ] OAuth consent screen published (not in testing mode)
- [ ] Privacy Policy and Terms of Service pages created
- [ ] Authorized redirect URIs include production domain
- [ ] Test Google sign-in flow on staging
- [ ] Monitor auth logs for errors
- [ ] Remove test users once live

### Post-Deployment:

- [ ] Test signup with Google
- [ ] Test login with Google
- [ ] Test email OTP flow (still works)
- [ ] Verify user data in database
- [ ] Check profile pictures load correctly
- [ ] Test on mobile devices
- [ ] Monitor error logs

---

## 📞 Support

**Questions?** Contact:
- Email: admin@krakkify.in
- GitHub: https://github.com/girishraj0710/krakkify

**Google OAuth Issues:**
- Google Cloud Console: https://console.cloud.google.com/
- NextAuth.js Docs: https://next-auth.js.org/

---

## ✅ Success Criteria

- [x] Database migration successful (2 users remain)
- [x] NextAuth.js v5 configured
- [x] Premium signup/login pages created
- [x] LoginModal removed completely
- [x] OAuth buttons designed
- [ ] Google OAuth credentials added
- [ ] End-to-end auth flow tested
- [ ] Deployed to production

---

**Status:** Ready for Google OAuth credentials! Once added, the entire auth system will be functional. 🎉
