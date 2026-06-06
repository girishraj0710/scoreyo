'use client';

/**
 * AccessibilityWrapper - Wraps page content with semantic <main> landmark
 *
 * Features:
 * - Proper <main> landmark for assistive technology
 * - Semantic HTML for screen readers
 */
export function AccessibilityWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {children}
    </main>
  );
}
