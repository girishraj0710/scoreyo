import { NextRequest, NextResponse } from "next/server";
import { verifyCsrfToken, CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/csrf";

/**
 * Proxy for CSRF Protection + Edge Performance (Next.js 16+)
 *
 * 1. CSRF Protection: Checks tokens on state-changing requests
 * 2. Edge Performance: Adds performance headers, runs on edge runtime
 */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Create response early for header manipulation
  const response = NextResponse.next();

  // Add performance headers for all requests
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  // CSRF Protection: Only check for state-changing methods
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    return response;
  }

  // Exclude authentication endpoints (they generate the CSRF token)
  // and endpoints that use cookie-based auth verification
  const csrfExemptPaths = [
    "/api/auth",
    "/api/auth/otp",
    "/api/quiz", // Uses cookie-based auth, not CSRF tokens
    "/api/stats",
    "/api/review",
    "/api/leaderboard",
    "/api/mock-test",
    "/api/reports",
    "/api/payment",
    "/api/subscription",
    "/api/report",
    "/api/weakness",
    "/api/clarify",
    "/api/dpp",
    "/api/sprint",
    "/api/admin/emergency", // Admin endpoint for emergency mode
    "/api/admin/sync-users", // Admin endpoint for user sync
  ];

  if (csrfExemptPaths.some((path) => pathname.startsWith(path))) {
    return response;
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

  return response;
}

// Configure which routes use this proxy
export const config = {
  matcher: [
    // Match all API routes except static files
    "/api/:path*",
    // Match all pages for performance headers
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};

// Note: Proxy in Next.js 16+ runs on Node.js runtime (not edge)
// Edge distribution is handled by Vercel automatically
