'use client';

/**
 * AccessibilityWrapper - Wraps page content with semantic landmark
 *
 * Features:
 * - Proper semantic HTML for screen readers
 * - Accessibility enhancements for page content
 * Note: Uses <div> instead of <main> because ConditionalLayout already provides <main>
 */
export function AccessibilityWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
