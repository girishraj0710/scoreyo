import { NextRequest, NextResponse } from "next/server";
import { verifyCsrfToken, CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/csrf";

/**
 * Middleware for CSRF Protection
 *
 * Checks CSRF tokens on state-changing requests (POST, PUT, DELETE, PATCH)
 * Excludes: auth endpoints (login/register), public APIs
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Only check CSRF for state-changing methods
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    return NextResponse.next();
  }

  // Exclude authentication endpoints (they generate the CSRF token)
  const csrfExemptPaths = [
    "/api/auth",
    "/api/auth/otp",
    "/api/admin/emergency", // Admin endpoint for emergency mode
    "/api/admin/sync-users", // Admin endpoint for user sync
  ];

  if (csrfExemptPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Verify CSRF token for protected endpoints
  const csrfTokenFromHeader = request.headers.get(CSRF_HEADER_NAME);
  const csrfTokenFromCookie = request.cookies.get(CSRF_COOKIE_NAME)?.value || null;

  if (!verifyCsrfToken(csrfTokenFromHeader, csrfTokenFromCookie)) {
    console.warn(`[CSRF] Token mismatch on ${method} ${pathname}`);
    return NextResponse.json(
      { error: "Invalid CSRF token. Please refresh and try again." },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Match all API routes except static files
    "/api/:path*",
  ],
};
