# Krakkify Mobile App - Quick Start

**Status**: ✅ Code complete, ready for testing  
**Platform**: Capacitor 8.4 (iOS + Android)  
**Mode**: Hybrid (loads from https://krakkify.in)

---

## What's Been Done

✅ Capacitor integrated with all required plugins  
✅ iOS & Android platforms added (`ios/`, `android/` folders)  
✅ Mobile-optimized CSS (safe areas, keyboard, touch targets)  
✅ Deep links configured (OTP emails, payment callbacks)  
✅ Platform detection utils (`@/lib/capacitor`)  
✅ Build tested — compiles successfully  

---

## Prerequisites (Install First)

### macOS (for iOS builds)
```bash
# 1. Install Xcode from App Store
# 2. Install Xcode command-line tools
xcode-select --install

# 3. Install CocoaPods
sudo gem install cocoapods
```

### Android (Mac/Windows/Linux)
1. Download **Android Studio**: https://developer.android.com/studio
2. Install **Android SDK** (API 34 or latest) via SDK Manager
3. Set environment variables:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

---

## Test on iOS (5 minutes)

```bash
# Open Xcode
npm run mobile:ios

# In Xcode:
# 1. Select "App" scheme at top
# 2. Choose iOS Simulator (iPhone 15 Pro)
# 3. Click Run ▶️
```

**Expected**: App launches → loads krakkify.in → login works → quiz runs

---

## Test on Android (5 minutes)

```bash
# Open Android Studio
npm run mobile:android

# In Android Studio:
# 1. Let Gradle sync finish (progress bar at bottom)
# 2. Select device/emulator at top
# 3. Click Run ▶️ (green play button)
```

**Expected**: Same as iOS

---

## Next Steps

### 1. Test All Features
- [ ] Login with OTP
- [ ] Start a quiz
- [ ] Submit quiz results
- [ ] Check dashboard stats
- [ ] Try mock test
- [ ] Test payment (Razorpay test mode)
- [ ] AI clarify chat
- [ ] DPP
- [ ] Sprints

### 2. Create App Icons & Splash Screens

1. **Design assets**:
   - `resources/icon.png` (1024x1024px, transparent)
   - `resources/splash.png` (2732x2732px, logo on #4F46E5 background)

2. **Generate**:
   ```bash
   npm install -g @capacitor/assets
   npx capacitor-assets generate --iconBackgroundColor '#4F46E5' --splashBackgroundColor '#4F46E5'
   ```

3. **Sync**:
   ```bash
   npm run mobile:sync
   ```

### 3. Test on Physical Devices

**iOS**:
- Connect iPhone via USB
- Xcode → Select device → Run

**Android**:
- Enable USB debugging on phone
- Connect via USB
- Android Studio → Select device → Run

### 4. Production Builds

**iOS** (App Store):
- Xcode → Product → Archive
- Upload to App Store Connect

**Android** (Play Store):
- Android Studio → Build → Generate Signed Bundle (AAB)
- Upload to Google Play Console

---

## Troubleshooting

### "Missing out directory" warning
**Expected** — we're using server mode, not static export. Ignore.

### Xcode signing error
Select **Team** in Xcode → Signing & Capabilities.

### Android SDK not found
Create `android/local.properties`:
```
sdk.dir=/Users/yourname/Library/Android/sdk
```

### App shows blank screen
1. Check `capacitor.config.ts` → `server.url` is correct
2. Check Chrome DevTools → Connect to device → inspect console
3. Verify Vercel deployment is live

### Development with local server
Edit `capacitor.config.ts`:
```typescript
server: {
  url: 'http://192.168.1.x:3000', // Your Mac's local IP
  cleartext: true,
}
```
Then: `npm run dev` + `npm run mobile:sync` + run app.

---

## Commands Reference

```bash
# Development
npm run mobile:ios          # Open iOS in Xcode
npm run mobile:android      # Open Android in Android Studio
npm run mobile:sync         # Sync web code to native platforms

# Running
npm run mobile:run:ios      # Build + run on iOS simulator
npm run mobile:run:android  # Build + run on Android emulator

# Building
npm run mobile:build:ios    # Build iOS
npm run mobile:build:android # Build Android
```

---

## Resources

- **Full Guide**: `MOBILE-APP-SETUP.md` (comprehensive 300+ line guide)
- **Capacitor Docs**: https://capacitorjs.com/docs
- **Platform Utils**: `src/lib/capacitor.ts` (isNative, hapticImpact, openUrl)
- **Mobile CSS**: `src/app/globals.css` (line 680+)

---

## Support

Issues? Questions? Read the full guide in `MOBILE-APP-SETUP.md`.
