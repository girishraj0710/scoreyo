# Scoreyo App Assets

Place the following files here to generate mobile app icons and splash screens:

## Required Files

1. **icon.png** (1024x1024px, PNG)
   - App icon source
   - Transparent background recommended
   - Centered logo
   - Will be auto-resized for all platforms

2. **splash.png** (2732x2732px, PNG)
   - Splash screen source
   - Centered logo on solid background
   - Background color: #4F46E5 (Indigo-600, Scoreyo brand color)
   - Logo should fit in center 1200x1200px area

## Generate Assets

Once you have the source files:

```bash
npm install -g @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor '#4F46E5' --splashBackgroundColor '#4F46E5'
```

This will auto-generate all required sizes for iOS and Android.

## Current Status

Assets not yet created. Using default Capacitor placeholders for now.

## Design Guidelines

- **Icon**: Simple, recognizable at small sizes (60x60px)
- **Colors**: Scoreyo brand colors (Indigo #4F46E5, Amber accent)
- **Style**: Modern, professional, EdTech aesthetic
- **Text**: Avoid text in icon (illegible at small sizes)
