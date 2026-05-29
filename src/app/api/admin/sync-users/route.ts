import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getUserByEmail } from "@/lib/db";
import { Pool } from 'pg';

const ADMIN_KEY = process.env.SCRAPER_ADMIN_KEY || "default-key";

// Sync users from Redis cache to database
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const body = await request.json().catch(() => ({}));
  const urlKey = request.nextUrl.searchParams.get("key");

  const providedKey = authHeader?.replace("Bearer ", "") || body.key || urlKey;

  if (providedKey !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    const results = {
      synced: [] as string[],
      alreadyExists: [] as string[],
      errors: [] as string[],
    };

    // Get all user:data:* keys
    const pattern = 'user:data:*';
    let cursor: string | number = '0';
    const userKeys: string[] = [];

    // Scan for keys
    do {
      const result = await redis.scan(cursor, { match: pattern, count: 100 });
      cursor = result[0];
      userKeys.push(...result[1]);
    } while (cursor !== '0' && cursor !== 0);

    console.log(`[Sync] Found ${userKeys.length} users in Redis`);

    for (const key of userKeys) {
      try {
        const userData = await redis.get(key);
        if (!userData) continue;

        const user = typeof userData === 'string' ? JSON.parse(userData) : userData;

        // Check if user exists in database
        const existing = await getUserByEmail(user.email);

        if (existing) {
          results.alreadyExists.push(user.email);
          console.log(`[Sync] ${user.email} already exists`);
          continue;
        }

        // Insert into database
        await pool.query(
          `INSERT INTO users (id, name, email, age, location, phone_number, exam_preparing_for, avatar_color, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
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

        // Clear cache
        await redis.del(`user:exists:${user.email}`);

        results.synced.push(user.email);
        console.log(`[Sync] ✅ Synced ${user.email}`);

      } catch (error: any) {
        results.errors.push(key);
        console.error(`[Sync] Error syncing ${key}:`, error.message);
      }
    }

    await pool.end();

    return NextResponse.json({
      success: true,
      message: `Synced ${results.synced.length} users`,
      details: results,
    });

  } catch (error: any) {
    console.error('[Sync] Fatal error:', error);
    return NextResponse.json({
      error: "Sync failed",
      details: error.message
    }, { status: 500 });
  }
}
