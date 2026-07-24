import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

/**
 * Server-only guard for session/cookie-based admin API routes.
 *
 * Reads the `scoreyo-user-id` cookie, loads the user, and checks admin status
 * via the canonical `isAdmin(role, email)` helper (role-based, with email
 * fallback). Returns a 401/403 NextResponse if the caller is not an admin, or
 * `null` if the request is authorized.
 *
 * Usage:
 *   const denied = await requireAdmin(request);
 *   if (denied) return denied;
 */
export async function requireAdmin(
  request: NextRequest
): Promise<NextResponse | null> {
  const userId = request.cookies.get("scoreyo-user-id")?.value;
  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const user = await getUser(userId);
  if (!isAdmin(user?.role, user?.email)) {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Guard for machine/ops admin endpoints authenticated by a shared secret
 * (migrations, cache syncs, one-off maintenance). These have no user session,
 * so they can't use role-based auth.
 *
 * Fails closed: if `expected` (the configured env secret) is missing or empty,
 * the endpoint is treated as disabled (503) rather than accepting a guessable
 * default. Returns a NextResponse on failure, or `null` if authorized.
 */
export function requireAdminSecret(
  provided: string | null | undefined,
  expected: string | undefined
): NextResponse | null {
  if (!expected) {
    return NextResponse.json(
      { error: "Admin endpoints not configured" },
      { status: 503 }
    );
  }
  if (provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
