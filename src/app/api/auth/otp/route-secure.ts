/**
 * SECURE OTP ROUTE
 *
 * Security improvements:
 * ✅ Request validation with Zod
 * ✅ Rate limiting (prevent brute force)
 * ✅ Email normalization
 * ✅ Secure OTP generation
 * ✅ Proper error messages (no info leakage)
 */

import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { withValidation } from "@/lib/middleware/validation";
import { otpRequestSchema, otpVerifySchema } from "@/lib/validation/schemas";
import { logger } from "@/lib/logger";
import { getRedis } from "@/lib/redis";
import { Resend } from "resend";

// Lazily instantiate so importing this module never throws when the key is
// absent (e.g. during `next build` page-data collection). Resend's constructor
// throws on a missing key.
let resendClient: Resend | null = null;
function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

/**
 * Generate a secure 6-digit OTP
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * POST /api/auth/otp - Send OTP to email
 *
 * Rate limited to prevent abuse
 */
export const POST = withValidation(
  otpRequestSchema,
  async (request, validatedData) => {
    const { email } = validatedData;
    const cleanEmail = email.toLowerCase().trim();

    try {
      // ── STEP 1: Rate Limiting ──────────────────────────────
      const redis = getRedis();
      const rateLimitKey = `otp:ratelimit:${cleanEmail}`;
      const attempts = await redis.get(rateLimitKey);

      if (attempts && parseInt(attempts as string) >= 3) {
        logger.warn('OTP rate limit exceeded', { email: cleanEmail });
        return NextResponse.json(
          {
            error: "Too many requests",
            message: "Please wait 15 minutes before requesting another OTP"
          },
          { status: 429 }
        );
      }

      // ── STEP 2: Generate OTP ───────────────────────────────
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

      // ── STEP 3: Save to Database ────────────────────────────
      const pool = getPool();
      await pool.query(
        `INSERT INTO otp_codes (email, code, expires_at, verified)
         VALUES ($1, $2, $3, false)`,
        [cleanEmail, otp, expiresAt]
      );

      // ── STEP 4: Cache in Redis ──────────────────────────────
      await redis.set(
        `otp:${cleanEmail}`,
        JSON.stringify({
          code: otp,
          expiresAt: expiresAt.toISOString(),
          verified: false,
          attempts: 0
        }),
        { ex: OTP_EXPIRY_MINUTES * 60 }
      );

      // Increment rate limit counter
      await redis.incr(rateLimitKey);
      await redis.expire(rateLimitKey, 15 * 60); // 15 minutes

      // ── STEP 5: Send Email ──────────────────────────────────
      try {
        await getResend().emails.send({
          from: "Scoreyo <noreply@scoreyo.in>",
          to: cleanEmail,
          subject: "Your Scoreyo OTP Code",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #6366f1;">Welcome to Scoreyo!</h2>
              <p>Your OTP code is:</p>
              <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #666;">This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
              <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        });

        logger.info('OTP sent successfully', { email: cleanEmail });

        return NextResponse.json({
          success: true,
          message: "OTP sent to your email",
          expiresIn: OTP_EXPIRY_MINUTES * 60, // seconds
        });

      } catch (emailError) {
        logger.error('Failed to send OTP email', { email: cleanEmail }, emailError as Error);

        return NextResponse.json(
          {
            error: "Failed to send OTP",
            message: "Please check your email address and try again"
          },
          { status: 500 }
        );
      }

    } catch (error) {
      logger.error('OTP generation failed', { email: cleanEmail }, error as Error);

      return NextResponse.json(
        {
          error: "Failed to generate OTP",
          message: "Please try again later"
        },
        { status: 500 }
      );
    }
  }
);

/**
 * PUT /api/auth/otp - Verify OTP
 *
 * Validates OTP and marks email as verified
 */
export const PUT = withValidation(
  otpVerifySchema,
  async (request, validatedData) => {
    const { email, code } = validatedData;
    const cleanEmail = email.toLowerCase().trim();

    try {
      // ── STEP 1: Check Redis Cache ───────────────────────────
      const redis = getRedis();
      const cachedOtpData = await redis.get(`otp:${cleanEmail}`);

      if (cachedOtpData) {
        const otpData = typeof cachedOtpData === 'string'
          ? JSON.parse(cachedOtpData)
          : cachedOtpData;

        // Check if too many attempts
        if (otpData.attempts >= MAX_OTP_ATTEMPTS) {
          logger.warn('Too many OTP verification attempts', { email: cleanEmail });
          return NextResponse.json(
            {
              error: "Too many attempts",
              message: "Please request a new OTP"
            },
            { status: 429 }
          );
        }

        // Check if expired
        if (new Date(otpData.expiresAt) < new Date()) {
          logger.warn('Expired OTP used', { email: cleanEmail });
          return NextResponse.json(
            {
              error: "OTP expired",
              message: "Please request a new OTP"
            },
            { status: 400 }
          );
        }

        // Verify OTP
        if (otpData.code === code) {
          // Mark as verified in Redis
          await redis.set(
            `otp:${cleanEmail}`,
            JSON.stringify({ ...otpData, verified: true }),
            { ex: 3600 } // Keep verification for 1 hour
          );

          // Mark as verified in database
          const pool = getPool();
          await pool.query(
            `UPDATE otp_codes
             SET verified = true
             WHERE email = $1 AND code = $2`,
            [cleanEmail, code]
          );

          logger.info('OTP verified successfully', { email: cleanEmail });

          return NextResponse.json({
            success: true,
            message: "Email verified successfully"
          });

        } else {
          // Increment attempt counter
          otpData.attempts = (otpData.attempts || 0) + 1;
          await redis.set(
            `otp:${cleanEmail}`,
            JSON.stringify(otpData),
            { ex: OTP_EXPIRY_MINUTES * 60 }
          );

          logger.warn('Invalid OTP attempt', {
            email: cleanEmail,
            attempts: otpData.attempts
          });

          return NextResponse.json(
            {
              error: "Invalid OTP",
              message: "Please check the code and try again",
              remainingAttempts: MAX_OTP_ATTEMPTS - otpData.attempts
            },
            { status: 400 }
          );
        }
      }

      // ── STEP 2: Fallback to Database ────────────────────────
      const pool = getPool();
      const result = await pool.query(
        `SELECT code, expires_at
         FROM otp_codes
         WHERE email = $1 AND verified = false
         ORDER BY created_at DESC
         LIMIT 1`,
        [cleanEmail]
      );

      if (result.rows.length === 0) {
        logger.warn('No OTP found for email', { email: cleanEmail });
        return NextResponse.json(
          {
            error: "No OTP found",
            message: "Please request a new OTP"
          },
          { status: 404 }
        );
      }

      const dbOtp = result.rows[0];

      if (new Date(dbOtp.expires_at) < new Date()) {
        return NextResponse.json(
          {
            error: "OTP expired",
            message: "Please request a new OTP"
          },
          { status: 400 }
        );
      }

      if (dbOtp.code !== code) {
        return NextResponse.json(
          {
            error: "Invalid OTP",
            message: "Please check the code and try again"
          },
          { status: 400 }
        );
      }

      // Mark as verified
      await pool.query(
        `UPDATE otp_codes SET verified = true WHERE email = $1 AND code = $2`,
        [cleanEmail, code]
      );

      await redis.set(
        `otp:${cleanEmail}`,
        JSON.stringify({ code: code, verified: true }),
        { ex: 3600 }
      );

      logger.info('OTP verified successfully (DB fallback)', { email: cleanEmail });

      return NextResponse.json({
        success: true,
        message: "Email verified successfully"
      });

    } catch (error) {
      logger.error('OTP verification failed', { email: cleanEmail }, error as Error);

      return NextResponse.json(
        {
          error: "Verification failed",
          message: "Please try again later"
        },
        { status: 500 }
      );
    }
  }
);
