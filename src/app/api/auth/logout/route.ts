import { NextRequest, NextResponse } from "next/server";
import { CSRF_COOKIE_NAME } from "@/lib/csrf";

const COOKIE_NAME = "scoreyo-user-id";

// GET - Logout via top-level browser navigation.
//
// A full-page GET navigation (window.location = "/api/auth/logout") guarantees
// the browser commits the cookie-clear Set-Cookie headers before it loads the
// redirect target. This avoids the fetch("DELETE") + client-reload race where a
// refresh could still send a not-yet-cleared cookie and re-authenticate.
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));

  // Clear cookies. Attributes (sameSite/secure/path) match how login SET them
  // so the browser reliably expires the existing cookie.
  const clear = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, maxAge: 0, path: "/" };

  response.cookies.set(COOKIE_NAME, "", clear);
  response.cookies.set(CSRF_COOKIE_NAME, "", clear);
  response.cookies.set(`${CSRF_COOKIE_NAME}-client`, "", { ...clear, httpOnly: false });

  return response;
}
