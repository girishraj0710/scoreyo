import { NextRequest, NextResponse } from "next/server";
import { getUser, getUserByEmail, createNewUser, listUsers, updateUserProfile, isOtpVerified, setUserRole } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { generateCsrfToken, CSRF_COOKIE_NAME } from "@/lib/csrf";
import { isEmergencyAuthMode, checkUserExistsInCache, cacheUserExists } from "@/lib/user-cache";
import { verifyOTPFromCache } from "@/lib/otp-cache";
import { getRedis } from "@/lib/redis";
import { POST as securePOST, PATCH as securePATCH } from "./route-secure";
import { isAdminEmail, determineUserRole } from "@/lib/admin";

const COOKIE_NAME = "prepgenie-user-id";
const AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#14b8a6"];

// GET - Get current user
export async function GET(request: NextRequest) {
  const userId = request.cookies.get(COOKIE_NAME)?.value;

  if (userId) {
    const user = await getUser(userId);
    if (user) {
      return NextResponse.json({ user });
    }
  }

  return NextResponse.json({ user: null });
}

// POST - Login or Register (after OTP verification)
export async function POST(request: NextRequest) {
  console.log('🔥🔥🔥 [AUTH ROUTE.TS] POST CALLED - MAIN ROUTE (NOT SECURE) 🔥🔥🔥');

  // Feature flag: Use secure route if enabled
  if (process.env.ENABLE_SECURE_ROUTES === 'true') {
    console.log('🚨 [AUTH] Redirecting to SECURE route');
    return securePOST(request);
  }

  console.log('✅ [AUTH] Using MAIN route (no validation)');

  try {
    const body = await request.json();
    const { email, name, age, location, phoneNumber, examPreparingFor, role } = body;

    console.log('[Auth POST] Full request body received:', JSON.stringify(body, null, 2));
    console.log('[Auth POST] Extracted values:', { email, name, role, type_of_role: typeof role });

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if we're in emergency auth mode (during migration)
    console.log('[Auth] Checking emergency mode...');
    const emergencyMode = await isEmergencyAuthMode();
    console.log(`[Auth] Emergency mode: ${emergencyMode}`);

    // Check that the email was verified via OTP
    let otpVerified = false;

    // Always check Redis first (OTPs are cached there)
    try {
      console.log('[Auth] Checking OTP in Redis cache...');
      const redis = getRedis();
      const otpData = await redis.get(`otp:${cleanEmail}`);
      if (otpData) {
        // Upstash Redis auto-parses JSON - no need for JSON.parse
        const parsed = typeof otpData === 'string' ? JSON.parse(otpData) : otpData;
        otpVerified = parsed.verified === true;
        console.log(`[Auth] Redis OTP check: ${otpVerified}`);
      }
    } catch (error) {
      console.error('[Auth] Redis OTP check failed:', error);
    }

    // If not found in Redis, check database as fallback
    if (!otpVerified && !emergencyMode) {
      console.log('[Auth] Checking OTP in database...');
      otpVerified = await isOtpVerified(cleanEmail);
      console.log(`[Auth] Database OTP check: ${otpVerified}`);
    }

    if (!otpVerified) {
      return NextResponse.json({ error: "Email not verified. Please complete OTP verification first." }, { status: 403 });
    }

    // Check if user already exists with this email
    let user = null;
    if (emergencyMode) {
      console.log('[Auth] 🚨 Emergency mode - checking user in Redis cache');
      // Try Redis cache first
      const cachedExists = await checkUserExistsInCache(cleanEmail);
      if (cachedExists === true) {
        // User exists in cache - try to get from Redis user data cache
        const redis = getRedis();
        const userData = await redis.get(`user:data:${cleanEmail}`);
        if (userData) {
          // Upstash Redis auto-parses JSON - no need for JSON.parse
          user = typeof userData === 'string' ? JSON.parse(userData) : userData;
        }
      }
      // If cache says user doesn't exist or we couldn't get data, allow signup
    } else {
      // Normal mode: check database
      user = await getUserByEmail(cleanEmail);
    }

    if (user) {
      // Existing user — log them in
      // Auto-promote admin emails if they don't have admin role yet
      if (isAdminEmail(cleanEmail) && user.role !== 'admin') {
        console.log(`[Auth] Auto-promoting ${cleanEmail} to admin role`);
        await setUserRole(user.id, 'admin');
        user.role = 'admin';
      }

      console.log('[Auth] Logging in existing user:', { email: cleanEmail, id: user.id });

      const csrfToken = generateCsrfToken();

      const response = NextResponse.json({
        user,
        isNewUser: false,
        csrfToken, // Send to client for X-CSRF-Token header
      });

      response.cookies.set(COOKIE_NAME, user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
      });

      // Set CSRF token in TWO cookies:
      // 1. httpOnly for server-side validation
      response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
      });
      // 2. Non-httpOnly for client-side reading (to send in X-CSRF-Token header)
      response.cookies.set(`${CSRF_COOKIE_NAME}-client`, csrfToken, {
        httpOnly: false, // Client can read this
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    // New user — require signup data (name is mandatory, others optional)
    console.log('[Auth] New user detected, checking signup data:', { hasName: !!name });
    if (!name || !name.trim()) {
      return NextResponse.json({
        error: "No account found with this email. Please sign up first.",
        needsSignup: true,
      }, { status: 400 });
    }

    const id = uuidv4();
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    // Determine appropriate role (admin email gets admin role, otherwise use provided role or default)
    const finalRole = isAdminEmail(cleanEmail) ? 'admin' : (role || 'student');
    console.log('[Auth POST] Final role determined:', { providedRole: role, finalRole, isAdmin: isAdminEmail(cleanEmail) });

    if (emergencyMode) {
      console.log('[Auth] 🚨 Emergency mode - creating user in Redis cache only');
      // In emergency mode, store user in Redis (we'll sync to database after migration)
      user = {
        id,
        name: name.trim(),
        email: cleanEmail,
        age: age ? parseInt(age) : null,
        location: location?.trim() || "",
        phone_number: phoneNumber?.trim() || "",
        exam_preparing_for: examPreparingFor?.trim() || "",
        avatar_color: avatarColor,
        role: finalRole,
        subscription_status: 'free',
        subscription_expires_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Cache user data in Redis (expires in 7 days - enough time to complete migration)
      const redis = getRedis();
      await redis.setex(`user:data:${cleanEmail}`, 604800, JSON.stringify(user));
      await cacheUserExists(cleanEmail, true);

      console.log('[Auth] ✓ User cached in Redis, will be synced to database after migration');
    } else {
      // Normal mode: create in database
      await createNewUser(
        id,
        name.trim(),
        cleanEmail,
        age ? parseInt(age) : null,
        location?.trim() || "",
        phoneNumber?.trim() || "",
        examPreparingFor?.trim() || "",
        avatarColor,
        finalRole
      );
      user = await getUser(id);
    }

    const csrfToken = generateCsrfToken();

    const response = NextResponse.json({
      user,
      isNewUser: true,
      csrfToken, // Send to client for X-CSRF-Token header
    });

    response.cookies.set(COOKIE_NAME, user!.id as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
    });

    // Set CSRF token in TWO cookies:
    // 1. httpOnly for server-side validation
    response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
    });
    // 2. Non-httpOnly for client-side reading (to send in X-CSRF-Token header)
    response.cookies.set(`${CSRF_COOKIE_NAME}-client`, csrfToken, {
      httpOnly: false, // Client can read this
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    // Return detailed error in development, generic in production
    const errorMessage = process.env.NODE_ENV === 'development'
      ? (error instanceof Error ? error.message : String(error))
      : "Please try again later";

    return NextResponse.json({
      error: "Authentication failed",
      message: errorMessage,
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  // Feature flag: Use secure route if enabled
  if (process.env.ENABLE_SECURE_ROUTES === 'true') {
    return securePATCH(request);
  }

  try {
    const userId = request.cookies.get(COOKIE_NAME)?.value;
    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, age, location, phoneNumber, examPreparingFor } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await updateUserProfile(
      userId,
      name.trim(),
      email?.trim() || "",
      age ? parseInt(age) : undefined,
      location?.trim(),
      phoneNumber?.trim(),
      examPreparingFor?.trim()
    );
    const user = await getUser(userId);

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

// DELETE - Logout (clear cookie)
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  // Clear user ID cookie
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  // Clear CSRF token cookies
  response.cookies.set(CSRF_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set(`${CSRF_COOKIE_NAME}-client`, "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}
