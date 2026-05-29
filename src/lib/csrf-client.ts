// Client-side CSRF token utilities
export const CSRF_COOKIE_NAME = "prepgenie-csrf-token";
export const CSRF_HEADER_NAME = "x-csrf-token";

// Get CSRF token from cookie
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === CSRF_COOKIE_NAME) {
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
