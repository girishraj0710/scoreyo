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

const COOKIE_NAME = "prepgenie-user-id";
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
              created_at as "createdAt"
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
    const { email, name, phoneNumber, examPreparingFor } = validatedData;

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
        logger.warn('Redis OTP check failed', { email: cleanEmail }, error as Error);
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
      const pool = getPool();
      let user = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [cleanEmail]
      ).then(res => res.rows[0]);

      let userId: string;

      if (user) {
        // ── STEP 3a: Update Existing User ─────────────────────
        userId = user.id;

        await pool.query(
          `UPDATE users
           SET name = $1,
               phone_number = $2,
               exam_preparing_for = $3,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $4`,
          [name, phoneNumber || null, examPreparingFor || null, userId]
        );

        logger.info('User logged in', { userId, email: cleanEmail });

      } else {
        // ── STEP 3b: Create New User ──────────────────────────
        userId = uuidv4();
        const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

        await pool.query(
          `INSERT INTO users (
            id, name, email, phone_number, exam_preparing_for,
            avatar_color, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [userId, name, cleanEmail, phoneNumber || null, examPreparingFor || null, avatarColor]
        );

        logger.info('New user registered', { userId, email: cleanEmail });
      }

      // ── STEP 4: Fetch Updated User Data ─────────────────────
      user = await pool.query(
        `SELECT id, name, email, age, location, phone_number as "phoneNumber",
                exam_preparing_for as "examPreparingFor", avatar_color as "avatarColor",
                created_at as "createdAt"
         FROM users
         WHERE id = $1`,
        [userId]
      ).then(res => res.rows[0]);

      // ── STEP 5: Set Cookies ─────────────────────────────────
      const response = NextResponse.json({
        success: true,
        user,
        message: "Login successful"
      });

      // Set auth cookie (secure in production)
      response.cookies.set(COOKIE_NAME, userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60, // 1 year
        path: '/',
      });

      // Set CSRF token
      const csrfToken = generateCsrfToken();
      response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 365 * 24 * 60 * 60,
        path: '/',
      });

      return response;

    } catch (error) {
      logger.error('Auth error', { email }, error as Error);
      return NextResponse.json(
        {
          error: "Authentication failed",
          message: "Please try again later"
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
