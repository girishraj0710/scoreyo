/**
 * SECURE AUTH ROUTE
 *
 * Security improvements:
 * ✅ Request validation with Zod
 * ✅ Email normalization
 * ✅ OTP verification required
 * ✅ Secure cookie settings
 * ✅ CSRF protection
 */

import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { withTransaction } from "@/lib/db/transaction";
import { withValidation } from "@/lib/middleware/validation";
import { loginSchema, updateProfileSchema } from "@/lib/validation/schemas";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/lib/logger";
import { generateCsrfToken, CSRF_COOKIE_NAME } from "@/lib/csrf";
import { getRedis } from "@/lib/redis";

const COOKIE_NAME = "scoreyo-user-id";
const AVATAR_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#3b82f6", "#ef4444", "#14b8a6"
];

/**
 * GET /api/auth - Get current user
 */
export async function GET(request: NextRequest) {
  const userId = request.cookies.get(COOKIE_NAME)?.value;

  if (!userId) {
    return NextResponse.json({ user: null });
  }

  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT id, name, email, age, location, phone_number as "phoneNumber",
              exam_preparing_for as "examPreparingFor", avatar_color as "avatarColor",
              role, created_at as "createdAt"
       FROM users
       WHERE id = $1`,
      [userId]
    );

    const user = result.rows[0] || null;
    return NextResponse.json({ user });

  } catch (error) {
    logger.error('Failed to fetch user', { userId }, error as Error);
    return NextResponse.json({ user: null });
  }
}

/**
 * POST /api/auth - Login or Register
 *
 * Requires OTP verification before allowing login/registration
 */
export const POST = withValidation(
  loginSchema,
  async (request, validatedData) => {
    console.log('🚨🚨🚨 [ROUTE-SECURE] POST HANDLER CALLED (INSIDE withValidation) 🚨🚨🚨');
    const { email, name, phoneNumber, examPreparingFor, role, age, location } = validatedData;
    console.log('[ROUTE-SECURE] Validated data:', { email, name, role });

    try {
      // Normalize email
      const cleanEmail = email.toLowerCase().trim();

      // ── STEP 1: Verify OTP ──────────────────────────────────
      let otpVerified = false;

      try {
        const redis = getRedis();
        const otpData = await redis.get(`otp:${cleanEmail}`);

        if (otpData) {
          const parsed = typeof otpData === 'string' ? JSON.parse(otpData) : otpData;
          otpVerified = parsed.verified === true;
        }
      } catch (error) {
        logger.warn('Redis OTP check failed', { email: cleanEmail, error: error instanceof Error ? error.message : String(error) });
      }

      // Fallback to database if Redis fails
      if (!otpVerified) {
        const pool = getPool();
        const result = await pool.query(
          `SELECT verified FROM otp_codes
           WHERE email = $1 AND verified = true
           ORDER BY created_at DESC LIMIT 1`,
          [cleanEmail]
        );
        otpVerified = result.rows.length > 0;
      }

      if (!otpVerified) {
        logger.warn('Login attempted without OTP verification', { email: cleanEmail });
        return NextResponse.json(
          {
            error: "Email not verified",
            message: "Please complete OTP verification first"
          },
          { status: 403 }
        );
      }

      // ── STEP 2: Check if User Exists ────────────────────────
      console.log('[ROUTE-SECURE] Step 2: Checking if user exists...');
      const pool = getPool();
      let user = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [cleanEmail]
      ).then(res => res.rows[0]);
      console.log('[ROUTE-SECURE] User exists:', !!user);

      let userId: string;

      if (user) {
        // ── STEP 3a: Existing User Login ─────────────────────
        userId = user.id;

        // Only update fields if provided (optional update)
        if (name || phoneNumber || examPreparingFor) {
          const updates: string[] = [];
          const values: any[] = [];
          let paramIndex = 1;

          if (name) {
            updates.push(`name = $${paramIndex++}`);
            values.push(name);
          }
          if (phoneNumber !== undefined) {
            updates.push(`phone_number = $${paramIndex++}`);
            values.push(phoneNumber || null);
          }
          if (examPreparingFor !== undefined) {
            updates.push(`exam_preparing_for = $${paramIndex++}`);
            values.push(examPreparingFor || null);
          }

          if (updates.length > 0) {
            updates.push(`updated_at = CURRENT_TIMESTAMP`);
            values.push(userId);
            await pool.query(
              `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
              values
            );
          }
        }

        logger.info('User logged in', { userId, email: cleanEmail });

      } else {
        // ── STEP 3b: New User Registration ──────────────────────
        console.log('[ROUTE-SECURE] Step 3b: Creating new user...');
        // Name is required for new users
        if (!name || !name.trim()) {
          return NextResponse.json(
            {
              error: "Name required",
              message: "Please provide your name to complete registration",
              needsSignup: true,
            },
            { status: 400 }
          );
        }

        userId = uuidv4();
        const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
        const finalRole = role || 'student';

        console.log('[ROUTE-SECURE] About to INSERT user:', { userId, name: name.trim(), email: cleanEmail, role: finalRole });

        await pool.query(
          `INSERT INTO users (
            id, name, email, age, location, phone_number, exam_preparing_for,
            avatar_color, role, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [userId, name.trim(), cleanEmail, age ? parseInt(age) : null, location || null, phoneNumber || null, examPreparingFor || null, avatarColor, finalRole]
        );

        console.log('[ROUTE-SECURE] ✅ User INSERT successful');
        logger.info('New user registered', { userId, email: cleanEmail });
      }

      // ── STEP 4: Fetch Updated User Data ─────────────────────
      console.log('[ROUTE-SECURE] Step 4: Fetching user data for userId:', userId);
      user = await pool.query(
        `SELECT id, name, email, age, location, phone_number as "phoneNumber",
                exam_preparing_for as "examPreparingFor", avatar_color as "avatarColor",
                role, created_at as "createdAt"
         FROM users
         WHERE id = $1`,
        [userId]
      ).then(res => res.rows[0]);
      console.log('[ROUTE-SECURE] User fetched:', !!user);

      // ── STEP 5: Set Cookies ─────────────────────────────────
      console.log('[ROUTE-SECURE] Step 5: Setting cookies and preparing response...');
      const csrfToken = generateCsrfToken();

      const response = NextResponse.json({
        success: true,
        user,
        message: "Login successful",
        csrfToken, // Send to client for X-CSRF-Token header
      });

      // Set auth cookie (secure in production)
      response.cookies.set(COOKIE_NAME, userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 365 * 24 * 60 * 60, // 1 year
        path: '/',
      });

      // Set CSRF token in TWO cookies:
      // 1. httpOnly for server-side validation
      response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 365 * 24 * 60 * 60,
        path: '/',
      });
      // 2. Non-httpOnly for client-side reading (to send in X-CSRF-Token header)
      response.cookies.set(`${CSRF_COOKIE_NAME}-client`, csrfToken, {
        httpOnly: false, // Client can read this
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 365 * 24 * 60 * 60,
        path: '/',
      });

      return response;

    } catch (error) {
      // Log detailed error information
      console.error('🚨🚨🚨 [ROUTE-SECURE] CRITICAL ERROR 🚨🚨🚨');
      console.error('[ROUTE-SECURE] Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('[ROUTE-SECURE] Error message:', error instanceof Error ? error.message : String(error));
      console.error('[ROUTE-SECURE] Error stack:', error instanceof Error ? error.stack : 'No stack trace');

      logger.error('Auth error', { email }, error as Error);

      // Return detailed error in response (temporarily for debugging)
      return NextResponse.json(
        {
          error: "Authentication failed",
          message: error instanceof Error ? error.message : "Please try again later",
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5) : undefined
        },
        { status: 500 }
      );
    }
  }
);

/**
 * PATCH /api/auth - Update user profile
 */
export const PATCH = withValidation(
  updateProfileSchema,
  async (request, validatedData) => {
    const userId = request.cookies.get(COOKIE_NAME)?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    try {
      const { name, phoneNumber, examPreparingFor, age, location } = validatedData;
      const pool = getPool();

      // Build dynamic UPDATE query for only provided fields
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(name);
      }
      if (phoneNumber !== undefined) {
        updates.push(`phone_number = $${paramIndex++}`);
        values.push(phoneNumber);
      }
      if (examPreparingFor !== undefined) {
        updates.push(`exam_preparing_for = $${paramIndex++}`);
        values.push(examPreparingFor);
      }
      if (age !== undefined) {
        updates.push(`age = $${paramIndex++}`);
        values.push(age);
      }
      if (location !== undefined) {
        updates.push(`location = $${paramIndex++}`);
        values.push(location);
      }

      if (updates.length === 0) {
        return NextResponse.json(
          { error: "No fields to update" },
          { status: 400 }
        );
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(userId);

      await pool.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
        values
      );

      // Fetch updated user
      const user = await pool.query(
        `SELECT id, name, email, age, location, phone_number as "phoneNumber",
                exam_preparing_for as "examPreparingFor", avatar_color as "avatarColor",
                created_at as "createdAt"
         FROM users
         WHERE id = $1`,
        [userId]
      ).then(res => res.rows[0]);

      logger.info('Profile updated', { userId });

      return NextResponse.json({
        success: true,
        user,
        message: "Profile updated successfully"
      });

    } catch (error) {
      logger.error('Profile update failed', { userId }, error as Error);
      return NextResponse.json(
        {
          error: "Profile update failed",
          message: "Please try again later"
        },
        { status: 500 }
      );
    }
  }
);

/**
 * DELETE /api/auth - Logout
 */
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully"
  });

  // Clear cookies
  response.cookies.delete(COOKIE_NAME);
  response.cookies.delete(CSRF_COOKIE_NAME);

  return response;
}
