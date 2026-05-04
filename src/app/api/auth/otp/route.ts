import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { saveOtp, verifyOtp } from "@/lib/db";

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Generate and save OTP
    const code = generateOtp();
    await saveOtp(cleanEmail, code, 10); // Expires in 10 minutes

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: "PrepGenie <onboarding@resend.dev>",
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
    const isValid = await verifyOtp(cleanEmail, code.trim());

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
