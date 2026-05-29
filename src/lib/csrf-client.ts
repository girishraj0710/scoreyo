// Client-side CSRF token utilities
export const CSRF_COOKIE_NAME = "prepgenie-csrf-token";
export const CSRF_HEADER_NAME = "x-csrf-token";

// Get CSRF token from cookie
// Note: The server sets two cookies:
// 1. prepgenie-csrf-token (httpOnly) - for server validation
// 2. prepgenie-csrf-token-client (readable) - for client to send in headers
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    // Read from the client-readable cookie
    if (name === `${CSRF_COOKIE_NAME}-client`) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// Get headers with CSRF token
export function getHeadersWithCsrf(additionalHeaders: Record<string, string> = {}): HeadersInit {
  const csrfToken = getCsrfToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  if (csrfToken) {
    headers[CSRF_HEADER_NAME] = csrfToken;
  }

  return headers;
}
