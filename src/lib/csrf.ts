import { randomBytes, createHash } from "crypto";

/**
 * CSRF Protection Utilities
 *
 * Implements Double Submit Cookie pattern:
 * 1. Generate random token on login
 * 2. Store in httpOnly cookie
 * 3. Client includes token in X-CSRF-Token header
 * 4. Server verifies cookie matches header
 */

export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

export function verifyCsrfToken(headerToken: string | null, cookieToken: string | null): boolean {
  if (!headerToken || !cookieToken) {
    return false;
  }

  // Timing-safe comparison to prevent timing attacks
  const headerHash = createHash("sha256").update(headerToken).digest();
  const cookieHash = createHash("sha256").update(cookieToken).digest();

  if (headerHash.length !== cookieHash.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < headerHash.length; i++) {
    mismatch |= headerHash[i] ^ cookieHash[i];
  }

  return mismatch === 0;
}

export const CSRF_COOKIE_NAME = "prepgenie-csrf-token";
export const CSRF_HEADER_NAME = "x-csrf-token";
