/**
 * Haptic Feedback Utility
 * Provides vibration feedback for touch interactions on mobile devices
 * Gracefully degrades on devices without vibration support
 */

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection';

/**
 * Check if device supports vibration
 */
export function isHapticsSupported(): boolean {
  return 'vibrate' in navigator;
}

/**
 * Trigger haptic feedback with predefined patterns
 */
export function triggerHaptic(pattern: HapticPattern = 'light'): void {
  if (!isHapticsSupported()) return;

  try {
    switch (pattern) {
      case 'light':
        navigator.vibrate(10); // Quick tap feedback
        break;
      case 'medium':
        navigator.vibrate(20); // Button press
        break;
      case 'heavy':
        navigator.vibrate(40); // Important action
        break;
      case 'success':
        navigator.vibrate([10, 50, 10]); // Double pulse
        break;
      case 'error':
        navigator.vibrate([20, 100, 20, 100, 20]); // Triple pulse
        break;
      case 'selection':
        navigator.vibrate(5); // Subtle feedback
        break;
      default:
        navigator.vibrate(10);
    }
  } catch (error) {
    // Silently fail on unsupported devices
    console.debug('[Haptics] Vibration not supported or failed:', error);
  }
}

/**
 * Custom vibration pattern (advanced usage)
 * @param pattern - Array of [vibrate, pause, vibrate, pause, ...]
 */
export function triggerCustomHaptic(pattern: number | number[]): void {
  if (!isHapticsSupported()) return;

  try {
    navigator.vibrate(pattern);
  } catch (error) {
    console.debug('[Haptics] Custom vibration failed:', error);
  }
}

/**
 * Cancel any ongoing vibration
 */
export function cancelHaptic(): void {
  if (!isHapticsSupported()) return;

  try {
    navigator.vibrate(0);
  } catch (error) {
    console.debug('[Haptics] Cancel vibration failed:', error);
  }
}
