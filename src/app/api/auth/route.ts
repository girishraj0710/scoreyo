import { NextRequest, NextResponse } from "next/server";
import { getUser, getUserByEmail, createNewUser, listUsers, updateUserProfile, isOtpVerified } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { generateCsrfToken, CSRF_COOKIE_NAME } from "@/lib/csrf";
import { isEmergencyAuthMode, checkUserExistsInCache, cacheUserExists } from "@/lib/user-cache";
import { verifyOTPFromCache } from "@/lib/otp-cache";
import { getRedis } from "@/lib/redis";

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
  try {
    const body = await request.json();
    const { email, name, age, location, phoneNumber, examPreparingFor } = body;

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
    if (emergencyMode) {
      console.log('[Auth] 🚨 Emergency mode - checking OTP in Redis cache only');
      // In emergency mode, check Redis OTP cache directly (OTP route already cached it)
      try {
        const redis = getRedis();
        const otpData = await redis.get(`otp:${cleanEmail}`);
        if (otpData) {
          const parsed = JSON.parse(otpData as string);
          otpVerified = parsed.verified === true;
        }
      } catch (error) {
        console.error('[Auth] Redis OTP check failed:', error);
      }
    } else {
      // Normal mode: check database
      otpVerified = await isOtpVerified(cleanEmail);
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
          user = JSON.parse(userData as string);
        }
      }
      // If cache says user doesn't exist or we couldn't get data, allow signup
    } else {
      // Normal mode: check database
      user = await getUserByEmail(cleanEmail);
    }

    if (user) {
      // Existing user — log them in
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

      // Set CSRF token in httpOnly cookie
      response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    // New user — require signup data (name is mandatory, others optional)
    if (!name || !name.trim()) {
      return NextResponse.json({
        needsSignup: true,
        message: "Please complete signup with your details"
      });
    }

    const id = uuidv4();
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

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
        avatarColor
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

    // Set CSRF token in httpOnly cookie
    response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
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
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}
