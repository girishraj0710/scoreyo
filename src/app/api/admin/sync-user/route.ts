import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getUserByEmail } from "@/lib/db";
import { requireAdminSecret } from "@/lib/admin-guard";
import { Pool } from 'pg';

const ADMIN_KEY = process.env.SCRAPER_ADMIN_KEY;

// Sync a specific user with detailed error reporting
export async function GET(request: NextRequest) {
  const urlKey = request.nextUrl.searchParams.get("key");
  const email = request.nextUrl.searchParams.get("email") || "girish.raj0710@gmail.com";

  const denied = requireAdminSecret(urlKey, ADMIN_KEY);
  if (denied) return denied;

  const redis = getRedis();
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log(`[Sync] Looking for user: ${email}`);

    // Get user from Redis
    const userData = await redis.get(`user:data:${email}`);

    if (!userData) {
      return NextResponse.json({
        error: "User not found in Redis",
        key: `user:data:${email}`
      });
    }

    console.log(`[Sync] Found user data in Redis`);

    const user = typeof userData === 'string' ? JSON.parse(userData) : userData;

    console.log(`[Sync] User details:`, {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    // Check if user exists in database
    const existing = await getUserByEmail(user.email);

    if (existing) {
      await pool.end();
      return NextResponse.json({
        success: true,
        message: "User already exists in database",
        user: existing
      });
    }

    console.log(`[Sync] User not in database, inserting...`);

    // Insert into database
    const result = await pool.query(
      `INSERT INTO users (id, name, email, age, location, phone_number, exam_preparing_for, avatar_color, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [
        user.id,
        user.name,
        user.email,
        user.age || null,
        user.location || '',
        user.phone_number || '',
        user.exam_preparing_for || '',
        user.avatar_color || '#6366f1'
      ]
    );

    console.log(`[Sync] Insert successful`);

    // Clear cache
    await redis.del(`user:exists:${user.email}`);

    await pool.end();

    return NextResponse.json({
      success: true,
      message: "User synced successfully",
      user: result.rows[0]
    });

  } catch (error: any) {
    await pool.end().catch(() => {});

    console.error('[Sync] Error:', error);

    return NextResponse.json({
      error: "Sync failed",
      message: error.message,
      stack: error.stack,
      code: error.code,
    }, { status: 500 });
  }
}
