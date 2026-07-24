import { NextRequest, NextResponse } from "next/server";
import { enableEmergencyAuthMode, disableEmergencyAuthMode, isEmergencyAuthMode } from "@/lib/user-cache";
import { requireAdminSecret } from "@/lib/admin-guard";

// Admin secret key (from env)
const ADMIN_KEY = process.env.SCRAPER_ADMIN_KEY;

// GET - Check emergency mode status
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const urlKey = request.nextUrl.searchParams.get("key");

  const providedKey = authHeader?.replace("Bearer ", "") || urlKey;

  const denied = requireAdminSecret(providedKey, ADMIN_KEY);
  if (denied) return denied;

  const isEnabled = await isEmergencyAuthMode();

  return NextResponse.json({
    emergencyMode: isEnabled,
    status: isEnabled ? "ACTIVE - All auth bypasses database" : "INACTIVE - Normal auth flow",
    message: isEnabled ? "🚨 Emergency mode is ENABLED" : "✅ Normal mode",
  });
}

// POST - Enable emergency mode
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const body = await request.json().catch(() => ({}));
  const urlKey = request.nextUrl.searchParams.get("key");

  const providedKey = authHeader?.replace("Bearer ", "") || body.key || urlKey;

  const denied = requireAdminSecret(providedKey, ADMIN_KEY);
  if (denied) return denied;

  await enableEmergencyAuthMode();

  return NextResponse.json({
    success: true,
    emergencyMode: true,
    message: "🚨 Emergency mode ENABLED for 24 hours",
    details: [
      "✓ All OTP checks bypass database",
      "✓ User lookups use Redis cache only",
      "✓ New users stored in Redis (will sync to DB after migration)",
      "✓ Expires automatically in 24 hours"
    ]
  });
}

// DELETE - Disable emergency mode
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const urlKey = request.nextUrl.searchParams.get("key");

  const providedKey = authHeader?.replace("Bearer ", "") || urlKey;

  const denied = requireAdminSecret(providedKey, ADMIN_KEY);
  if (denied) return denied;

  await disableEmergencyAuthMode();

  return NextResponse.json({
    success: true,
    emergencyMode: false,
    message: "✅ Emergency mode DISABLED - normal auth restored"
  });
}
