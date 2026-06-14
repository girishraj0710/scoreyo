import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.krakkify.app',
  appName: 'Krakkify',
  webDir: 'out',

  // Using latest Vercel deployment (with landing page skip)
  server: {
    url: 'https://krakkify-52ykfabc7-girishraj0710-1629s-projects.vercel.app',
    cleartext: false,
    androidScheme: 'https',
    iosScheme: 'https',
  },

  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    scrollEnabled: true,
  },

  android: {
    allowMixedContent: false,
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
