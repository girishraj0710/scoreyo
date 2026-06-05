'use client';

/**
 * AccessibilityWrapper - Provides core accessibility features
 *
 * Features:
 * - Skip to main content link (hidden, visible on focus)
 * - Proper <main> landmark for assistive technology
 * - Ensures WCAG 2.1 A compliance for all pages
 */
export function AccessibilityWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        Skip to main content link
        - Hidden by default (sr-only class)
        - Becomes visible when focused (focus:not-sr-only)
        - Allows keyboard users to skip menu/navigation
        - Helps screen reader users reach content quickly
      */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-indigo-600 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:outline-2 focus:outline-offset-2 focus:outline-white"
      >
        Skip to main content
      </a>

      {/*
        Main landmark
        - Required for WCAG compliance
        - Tells assistive tech where main content is
        - Screen readers can jump directly here
      */}
      <main id="main">
        {children}
      </main>
    </>
  );
}
