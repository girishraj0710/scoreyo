/**
 * Capacitor utilities for mobile app
 *
 * This file provides platform detection and native feature access.
 * Safe to import on both web and mobile - gracefully degrades.
 */

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style as StatusBarStyle } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';

// Platform detection
export const isNative = Capacitor.isNativePlatform();
export const isIOS = Capacitor.getPlatform() === 'ios';
export const isAndroid = Capacitor.getPlatform() === 'android';
export const isWeb = Capacitor.getPlatform() === 'web';

/**
 * Initialize Capacitor plugins on app load
 */
export async function initCapacitor() {
  if (!isNative) return;

  try {
    // Hide splash screen after app is ready
    await SplashScreen.hide();

    // Configure status bar
    if (isIOS || isAndroid) {
      await StatusBar.setStyle({ style: StatusBarStyle.Dark });
      if (isAndroid) {
        await StatusBar.setBackgroundColor({ color: '#4F46E5' }); // Indigo-600
      }
    }

    // Listen for keyboard events (useful for scroll adjustments)
    if (Keyboard) {
      Keyboard.addListener('keyboardWillShow', (info) => {
        console.log('Keyboard will show with height:', info.keyboardHeight);
      });

      Keyboard.addListener('keyboardWillHide', () => {
        console.log('Keyboard will hide');
      });
    }

    // Listen for app state changes
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active:', isActive);
    });

    // Deep link handling (for OTP emails, payment callbacks)
    App.addListener('appUrlOpen', (event) => {
      console.log('App opened with URL:', event.url);
      handleDeepLink(event.url);
    });

    console.log('✅ Capacitor initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Capacitor:', error);
  }
}

/**
 * Handle deep links (OTP emails, payment callbacks)
 */
function handleDeepLink(url: string) {
  try {
    const urlObj = new URL(url);

    // Handle OTP verification links
    if (urlObj.pathname.includes('/verify-otp')) {
      const otp = urlObj.searchParams.get('otp');
      const email = urlObj.searchParams.get('email');
      if (otp && email) {
        // Store in sessionStorage for OTP screen to pick up
        sessionStorage.setItem('deep-link-otp', JSON.stringify({ otp, email }));
        window.location.href = '/auth';
      }
    }

    // Handle payment success/failure
    if (urlObj.pathname.includes('/payment-callback')) {
      const status = urlObj.searchParams.get('status');
      const orderId = urlObj.searchParams.get('order_id');
      window.location.href = `/payment-status?status=${status}&order_id=${orderId}`;
    }
  } catch (error) {
    console.error('Invalid deep link URL:', error);
  }
}

/**
 * Haptic feedback (vibration)
 */
export async function hapticImpact(style: 'light' | 'medium' | 'heavy' = 'light') {
  if (!isNative) return;

  try {
    const styleMap = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    };
    await Haptics.impact({ style: styleMap[style] });
  } catch (error) {
    // Silently fail if haptics not available
  }
}

/**
 * Open external URL in native browser
 * (Better than <a> tag on mobile - uses system browser)
 */
export async function openUrl(url: string) {
  if (!isNative) {
    window.open(url, '_blank');
    return;
  }

  try {
    await Browser.open({ url, presentationStyle: 'popover' });
  } catch (error) {
    console.error('Failed to open URL:', error);
    window.open(url, '_blank'); // Fallback
  }
}

/**
 * Close native browser (for OAuth flows)
 */
export async function closeBrowser() {
  if (!isNative) return;

  try {
    await Browser.close();
  } catch (error) {
    console.error('Failed to close browser:', error);
  }
}

/**
 * Get safe area insets (iOS notch handling)
 */
export function getSafeAreaInsets() {
  if (!isNative) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  // iOS provides safe area insets via CSS env()
  // Android typically doesn't need this
  return {
    top: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0'),
    right: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sar') || '0'),
    bottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0'),
    left: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sal') || '0'),
  };
}

/**
 * Check if app is running in standalone mode (mobile app vs browser)
 */
export function isStandalone() {
  if (isNative) return true;

  // Check for PWA standalone mode
  return window.matchMedia('(display-mode: standalone)').matches;
}

/**
 * Get app version (from native platform)
 */
export async function getAppVersion() {
  if (!isNative) return '0.0.0';

  try {
    const info = await App.getInfo();
    return info.version;
  } catch (error) {
    return '0.0.0';
  }
}

/**
 * Exit app (Android only)
 */
export async function exitApp() {
  if (!isAndroid) return;

  try {
    await App.exitApp();
  } catch (error) {
    console.error('Failed to exit app:', error);
  }
}
