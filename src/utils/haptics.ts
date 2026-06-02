/**
 * Haptic Feedback Utilities for Mobile
 * Provides tactile feedback for user interactions
 */

export const haptics = {
  /**
   * Light tap - For button presses, selections
   */
  light: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  },

  /**
   * Medium impact - For important actions
   */
  medium: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(20);
    }
  },

  /**
   * Heavy impact - For critical actions, errors
   */
  heavy: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
  },

  /**
   * Success pattern - For correct answers, achievements
   */
  success: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([10, 50, 10]);
    }
  },

  /**
   * Error pattern - For wrong answers, failed actions
   */
  error: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }
  },

  /**
   * Warning pattern - For caution, limits reached
   */
  warning: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
  },

  /**
   * Notification pattern - For updates, badges
   */
  notification: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  },

  /**
   * Selection change - For swipe gestures, navigation
   */
  selection: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(5);
    }
  },
};

/**
 * Check if haptic feedback is supported
 */
export const isHapticsSupported = (): boolean => {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
};
