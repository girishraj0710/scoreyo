import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { saveOtp, verifyOtp, getUserByEmail } from "@/lib/db";
import { otpSendLimiter, otpVerifyLimiter } from "@/lib/rate-limit";
import { saveOTPToCache, verifyOTPFromCache } from "@/lib/otp-cache";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST - Send OTP to email
export async function POST(request: NextRequest) {
  try {
    const { email, action } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Rate limit check - prevent email bombing
    const identifier = `${cleanEmail}:${action}`;
    const { success, limit, reset, remaining } = await otpSendLimiter.limit(identifier);

    if (!success) {
      return NextResponse.json(
        {
          error: "Too many OTP requests",
          message: "Please wait 10 minutes before requesting another OTP",
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
          }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(cleanEmail);

    // If action is "signup" and user exists, return error
    if (action === "signup" && existingUser) {
      return NextResponse.json({
        error: "An account with this email already exists. Please log in instead.",
        shouldLogin: true
      }, { status: 400 });
    }

    // If action is "login" and user doesn't exist, return error
    if (action === "login" && !existingUser) {
      return NextResponse.json({
        error: "No account found with this email. Please sign up first.",
        shouldSignup: true
      }, { status: 400 });
    }

    // Generate and save OTP (Redis first, database as backup)
    const code = generateOtp();
    try {
      await saveOTPToCache(cleanEmail, code, 10); // Expires in 10 minutes - REDIS (no DB hit!)
    } catch (error) {
      console.error('[OTP] Redis cache failed, falling back to database:', error);
      await saveOtp(cleanEmail, code, 10); // Fallback to database
    }

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: "PrepGenie <noreply@prepgenie.co.in>",
      to: cleanEmail,
      subject: `${code} is your PrepGenie verification code`,
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; width: 50px; height: 50px; background: linear-gradient(135deg, #6366f1, #9333ea); border-radius: 12px; color: white; font-size: 24px; font-weight: bold; line-height: 50px;">P</div>
          </div>
          <h2 style="text-align: center; color: #1e293b; margin-bottom: 8px;">Your Verification Code</h2>
          <p style="text-align: center; color: #64748b; font-size: 14px; margin-bottom: 24px;">Enter this code in PrepGenie to sign in</p>
          <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #6366f1;">${code}</span>
          </div>
          <p style="text-align: center; color: #94a3b8; font-size: 12px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send verification email. Please try again." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
  }
}

// PUT - Verify OTP
export async function PUT(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Rate limit verification attempts - prevent brute force
    const identifier = `verify:${cleanEmail}`;
    const { success, limit, reset, remaining } = await otpVerifyLimiter.limit(identifier);

    if (!success) {
      return NextResponse.json(
        {
          error: "Too many verification attempts",
          message: "Please wait 15 minutes before trying again",
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
          }
        }
      );
    }
    // Try Redis first (no DB hit!), fallback to database
    let isValid = false;
    try {
      isValid = await verifyOTPFromCache(cleanEmail, code.trim());
    } catch (error) {
      console.error('[OTP] Redis verification failed, falling back to database:', error);
      isValid = await verifyOtp(cleanEmail, code.trim());
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid or expired code. Please try again." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
