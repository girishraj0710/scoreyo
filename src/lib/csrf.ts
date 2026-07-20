/**
 * CSRF Protection Utilities
 *
 * Implements Double Submit Cookie pattern:
 * 1. Generate random token on login
 * 2. Store in httpOnly cookie
 * 3. Client includes token in X-CSRF-Token header
 * 4. Server verifies cookie matches header
 *
 * Note: Uses Web Crypto API for Edge Runtime compatibility (middleware)
 */

export function generateCsrfToken(): string {
  // Use Web Crypto API (works in both Node and Edge Runtime)
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function verifyCsrfToken(headerToken: string | null, cookieToken: string | null): boolean {
  if (!headerToken || !cookieToken) {
    return false;
  }

  // Simple comparison - tokens must match exactly
  // In Edge Runtime, we can't use crypto.subtle in middleware due to async
  // So we do direct comparison (still secure with random tokens)
  return headerToken === cookieToken;
}

export const CSRF_COOKIE_NAME = "scoreyo-csrf-token";
export const CSRF_HEADER_NAME = "x-csrf-token";
