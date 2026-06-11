import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.krakkify.app',
  appName: 'Krakkify',
  webDir: 'out', // Not used in server mode, but required

  // Production mode: load from live server (hybrid app)
  server: {
    url: 'https://krakkify.in',
    cleartext: false, // HTTPS only
    androidScheme: 'https',
    iosScheme: 'https',
  },

  // For local development ONLY, uncomment and restart:
  // server: {
  //   url: 'http://192.168.1.x:3000', // Replace with your Mac's local IP
  //   cleartext: true,
  //   androidScheme: 'http',
  //   iosScheme: 'ionic',
  // },

  // iOS-specific configuration
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    scrollEnabled: true,
  },

  // Android-specific configuration
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Set to true for debugging
  },

  // Plugins configuration
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#4F46E5', // Indigo-600 (Krakkify brand color)
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#FFFFFF',
      splashFullScreen: true,
      splashImmersive: true,
    },
    // Keyboard plugin (configured at runtime in @/lib/capacitor)
    StatusBar: {
      style: 'dark',
      backgroundColor: '#4F46E5',
    },
  },
};

export default config;
