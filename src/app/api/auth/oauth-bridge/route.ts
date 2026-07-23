import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateCsrfToken, CSRF_COOKIE_NAME } from "@/lib/csrf";
import { safeRedirect } from "@/lib/safe-redirect";

/**
 * OAuth → app-cookie bridge.
 *
 * Google sign-in authenticates via NextAuth (JWT session cookie), but the rest
 * of the app authenticates via the `scoreyo-user-id` cookie (set by the email
 * OTP flow). Without this bridge a Google sign-in leaves the user "logged in"
 * to NextAuth but logged OUT everywhere useUser() is read.
 *
 * OAuthButtons points Google's callbackUrl here. We read the NextAuth session,
 * mint the same app + CSRF cookies the OTP flow sets, then forward the user to
 * their intended destination.
 */
const COOKIE_NAME = "scoreyo-user-id";
const YEAR = 365 * 24 * 60 * 60;

export async function GET(request: NextRequest) {
  const redirectTo = safeRedirect(request.nextUrl.searchParams.get("redirect"));

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    // Session missing/expired — send back to login, preserving the destination.
    const back = redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : "";
    return NextResponse.redirect(new URL(`/login${back}`, request.url));
  }

  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  const csrfToken = generateCsrfToken();
  const secure = process.env.NODE_ENV === "production";
  const base = { secure, sameSite: "lax" as const, maxAge: YEAR, path: "/" };

  response.cookies.set(COOKIE_NAME, userId, { ...base, httpOnly: true });
  response.cookies.set(CSRF_COOKIE_NAME, csrfToken, { ...base, httpOnly: true });
  response.cookies.set(`${CSRF_COOKIE_NAME}-client`, csrfToken, { ...base, httpOnly: false });

  return response;
}
