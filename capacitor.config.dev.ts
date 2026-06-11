import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.krakkify.app',
  appName: 'Krakkify',
  webDir: 'out',

  // LOCAL DEVELOPMENT: Load from Mac's network IP
  server: {
    url: 'http://192.168.31.225:3000',
    cleartext: true,
    androidScheme: 'http',
  },

  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    scrollEnabled: true,
  },

  android: {
    allowMixedContent: true, // Required for HTTP development
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#4F46E5',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#FFFFFF',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#4F46E5',
    },
  },
};

export default config;
