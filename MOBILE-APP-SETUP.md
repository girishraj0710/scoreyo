# Scoreyo Mobile App Setup Guide

## Overview

Scoreyo mobile app uses **Capacitor** to wrap the Next.js web app into native iOS and Android apps. This is a **hybrid approach** where the app loads the live website (`https://scoreyo.in`) inside a native container.

### Architecture

- **Frontend**: Same Next.js app (no duplicate code)
- **Backend**: Hosted on Vercel, accessed via HTTPS API calls
- **Mode**: Server-rendered (hybrid) - not static export
- **Benefit**: Instant updates without app store approval

---

## Prerequisites

### For iOS Development (Mac required)

1. **Install Xcode** (from App Store)
   ```bash
   xcode-select --install
   ```

2. **Install CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

3. **Verify Installation**
   ```bash
   xcodebuild -version
   pod --version
   ```

### For Android Development (Mac/Windows/Linux)

1. **Install Android Studio** from [developer.android.com/studio](https://developer.android.com/studio)

2. **Install Android SDK** (via Android Studio > SDK Manager):
   - Android SDK Platform 34 (or latest)
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android Emulator

3. **Set Environment Variables** (add to `~/.zshrc` or `~/.bash_profile`):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

4. **Verify Installation**
   ```bash
   source ~/.zshrc
   java -version
   $ANDROID_HOME/tools/bin/sdkmanager --version
   ```

---

## Quick Start

### 1. Initial Setup (One-time)

```bash
# Install dependencies (already done)
npm install

# Sync Capacitor platforms (creates native projects)
npm run mobile:sync
```

### 2. Development Workflow

#### Option A: Test with Live Server (Recommended)

The app is already configured to load from `https://scoreyo.in`:

```bash
# Open iOS in Xcode
npm run mobile:ios

# Open Android in Android Studio
npm run mobile:android
```

Then click **Run** in Xcode/Android Studio.

#### Option B: Test with Local Development Server

1. **Find your Mac's local IP**:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   Example: `192.168.1.42`

2. **Edit `capacitor.config.ts`**:
   ```typescript
   server: {
     url: 'http://192.168.1.42:3000', // Your Mac's IP
     cleartext: true,
     androidScheme: 'http',
   }
   ```

3. **Start dev server and sync**:
   ```bash
   npm run dev
   npm run mobile:sync
   npm run mobile:ios  # or mobile:android
   ```

   **Note**: Phone/emulator must be on same WiFi network.

4. **When done, revert to production**:
   ```typescript
   server: {
     url: 'https://scoreyo.in',
     cleartext: false,
   }
   ```

---

## Building for Production

### iOS (App Store)

1. **Open in Xcode**:
   ```bash
   npm run mobile:ios
   ```

2. **Configure App**:
   - In Xcode, select `App` target
   - **General** tab:
     - Bundle Identifier: `com.scoreyo.app`
     - Version: `1.0.0` (increment for updates)
     - Build: `1` (increment for each build)
     - Display Name: `Scoreyo`
   - **Signing & Capabilities**:
     - Team: Select your Apple Developer account
     - Provisioning Profile: Automatic

3. **Build Archive**:
   - Product → Archive
   - Upload to App Store Connect
   - Submit for review

**Deep Links (iOS)**: Handled automatically via `associated-domains` capability:
- Add domain: `applinks:scoreyo.in`
- Upload `apple-app-site-association` to `https://scoreyo.in/.well-known/`

### Android (Play Store)

1. **Open in Android Studio**:
   ```bash
   npm run mobile:android
   ```

2. **Configure App**:
   - Edit `android/app/build.gradle`:
     ```gradle
     android {
       defaultConfig {
         applicationId "com.scoreyo.app"
         versionCode 1      // Increment for each release
         versionName "1.0.0"
       }
     }
     ```

3. **Generate Signed APK/AAB**:
   - Build → Generate Signed Bundle / APK
   - Create keystore (first time):
     ```bash
     keytool -genkey -v -keystore scoreyo-release.keystore \
       -alias scoreyo -keyalg RSA -keysize 2048 -validity 10000
     ```
   - Select **Android App Bundle (AAB)** for Play Store
   - Upload AAB to Play Console

**Deep Links (Android)**: Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="scoreyo.in" />
</intent-filter>
```

---

## App Icons & Splash Screens

### Generate Assets

Use [Capacitor Asset Generator](https://github.com/capacitor-community/capacitor-assets):

```bash
npm install -g @capacitor/assets

# Create source files:
# - resources/icon.png (1024x1024px, transparent background)
# - resources/splash.png (2732x2732px, centered logo)

npx capacitor-assets generate --iconBackgroundColor '#4F46E5' --splashBackgroundColor '#4F46E5'
```

This auto-generates all required sizes for iOS and Android.

---

## Features & Native Integration

### Already Implemented

✅ **Status Bar Styling** - Matches brand color (#4F46E5)  
✅ **Keyboard Handling** - Auto-adjust layout, 16px inputs prevent iOS zoom  
✅ **Splash Screen** - 2-second branded splash  
✅ **Haptic Feedback** - Use `hapticImpact('light'|'medium'|'heavy')` from `@/lib/capacitor`  
✅ **Deep Links** - OTP emails, payment callbacks  
✅ **Safe Areas** - iOS notch/home indicator support  
✅ **Platform Detection** - `isNative`, `isIOS`, `isAndroid` from `@/lib/capacitor`  

### Usage Example

```typescript
import { isNative, hapticImpact, openUrl } from '@/lib/capacitor';

// Conditional behavior
if (isNative) {
  await hapticImpact('medium'); // Vibrate on button press
}

// Open external links (uses in-app browser)
await openUrl('https://example.com');
```

---

## Razorpay Payment Integration (Mobile)

Razorpay checkout works identically on mobile via the `@capacitor/browser` plugin. No code changes needed:

```typescript
// src/components/payment-modal.tsx (already implemented)
const rzp = new (window as any).Razorpay({
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: plan.price * 100,
  handler: (response) => {
    // Verify payment via /api/payment/verify
  },
});
rzp.open();
```

**Mobile Flow**:
1. User clicks "Subscribe"
2. Razorpay modal opens in WebView
3. User completes payment (UPI/Card/NetBanking)
4. Callback triggers, verification runs
5. User unlocked as Pro

**No app store commission** - payment via Razorpay, not in-app purchase.

---

## Testing Checklist

### iOS Simulator

```bash
npm run mobile:run:ios
```

**Test**:
- [ ] App launches, no console errors
- [ ] Login with OTP works
- [ ] Quiz engine loads questions
- [ ] Mock tests work
- [ ] Payment flow (test mode)
- [ ] AI features (clarify chat, DPP)
- [ ] Sprints leaderboard
- [ ] Dashboard stats load

### Android Emulator

```bash
npm run mobile:run:android
```

**Same tests as iOS.**

### Physical Devices

1. **iOS**: Connect iPhone, select device in Xcode, click Run
2. **Android**: Enable USB debugging, connect device, click Run in Android Studio

---

## Common Issues

### "Missing out directory" warning

**Cause**: Capacitor expects static export, but we're using server mode.  
**Solution**: Ignore warning - it's expected. App loads from `server.url` instead.

### iOS build fails with "Code signing error"

**Solution**: Select a valid Team in Xcode → Signing & Capabilities.

### Android build fails with "SDK location not found"

**Solution**: Create `android/local.properties`:
```properties
sdk.dir=/Users/yourname/Library/Android/sdk
```

### App shows blank white screen

**Causes**:
1. Wrong `server.url` in `capacitor.config.ts`
2. CORS issue (check Vercel allows app origin)
3. CSP blocking (check `next.config.ts` headers)

**Debug**: Open Safari/Chrome DevTools → Connect to device → Inspect WebView console.

### Keyboard covers input fields (iOS)

**Solution**: Already handled via `Keyboard` plugin - layout auto-adjusts.

---

## Deployment Checklist

### Before Submitting to App Stores

- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] All features work (auth, quiz, payments, AI)
- [ ] No console errors
- [ ] Icons/splash screens look correct
- [ ] Deep links work (OTP emails)
- [ ] Payment flow completes (test mode)
- [ ] Performance is acceptable (no lag)
- [ ] Update version numbers (iOS: `Info.plist`, Android: `build.gradle`)
- [ ] Generate signed builds (iOS: Archive, Android: AAB)

### App Store Metadata

**App Name**: Scoreyo - Smart Exam Prep  
**Subtitle**: JEE, NEET, UPSC & 20+ Exams  
**Keywords**: exam prep, JEE, NEET, UPSC, SSC, banking, CAT, GATE, mock tests, previous year questions  
**Category**: Education  
**Age Rating**: 4+  
**Privacy Policy**: https://scoreyo.in/privacy  
**Support URL**: https://scoreyo.in/support  

**Description** (use from web version, emphasize):
- 20+ exams supported
- NCERT-based questions
- Mock tests with detailed reports
- AI-powered recommendations
- Free & Pro plans

---

## Next Steps

1. **Install Xcode** (if not done)
2. **Run `npm run mobile:ios`** to test
3. **Generate app icons** (`@capacitor/assets`)
4. **Test all features** on simulator
5. **Build production archive**
6. **Submit to App Store**

Repeat for Android after iOS is stable.

---

## Support

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Razorpay Mobile**: https://razorpay.com/docs/payment-gateway/web-integration/standard/
- **Apple App Store**: https://developer.apple.com/app-store/submissions/
- **Google Play Store**: https://play.google.com/console
