import { NextRequest, NextResponse } from "next/server";
import { getUser, getUserByEmail, createNewUser, listUsers, updateUserProfile, isOtpVerified } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

const COOKIE_NAME = "prepgenie-user-id";
const AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#14b8a6"];

// GET - Get current user
export async function GET(request: NextRequest) {
  const userId = request.cookies.get(COOKIE_NAME)?.value;

  if (userId) {
    const user = getUser(userId);
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
    const { email, name } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check that the email was verified via OTP
    if (!isOtpVerified(cleanEmail)) {
      return NextResponse.json({ error: "Email not verified. Please complete OTP verification first." }, { status: 403 });
    }

    // Check if user already exists with this email
    let user = getUserByEmail(cleanEmail);

    if (user) {
      // Existing user — log them in
      const response = NextResponse.json({ user, isNewUser: false });
      response.cookies.set(COOKIE_NAME, user.id, {
        httpOnly: false,
        sameSite: "lax",
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
      });
      return response;
    }

    // New user — name is required for registration
    if (!name || !name.trim()) {
      return NextResponse.json({ needsName: true, message: "Please provide your name to complete registration" });
    }

    const id = uuidv4();
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    createNewUser(id, name.trim(), cleanEmail, avatarColor);
    user = getUser(id);

    const response = NextResponse.json({ user, isNewUser: true });
    response.cookies.set(COOKIE_NAME, user!.id as string, {
      httpOnly: false,
      sameSite: "lax",
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
    const { name, email } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    updateUserProfile(userId, name.trim(), email?.trim() || "");
    const user = getUser(userId);

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
    httpOnly: false,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
