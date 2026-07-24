import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { requireAdminSecret } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/migrate-roles
 * Run the add-user-roles migration to enable role-based access control
 * Requires ADMIN_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    // Check for admin secret
    const url = new URL(request.url);
    const secretParam = url.searchParams.get('secret');

    const denied = requireAdminSecret(secretParam, process.env.ADMIN_SECRET);
    if (denied) return denied;

    const pool = getPool();
    const client = await pool.connect();

    try {
      console.log('[Migrate Roles] Starting user roles migration...');

      // Step 1: Add role column with default
      console.log('[Migrate Roles] Adding role column...');
      try {
        await client.query(`
          ALTER TABLE users
            ADD COLUMN role TEXT DEFAULT 'student'
            CHECK (role IN ('student', 'teacher', 'contributor', 'admin'));
        `);
        console.log('[Migrate Roles] ✓ Role column added');
      } catch (err: any) {
        if (err.code === '42701') {
          // Column already exists
          console.log('[Migrate Roles] Role column already exists, skipping');
        } else {
          throw err;
        }
      }

      // Step 2: Create index for role queries
      console.log('[Migrate Roles] Creating role index...');
      try {
        await client.query(`
          CREATE INDEX idx_users_role ON users(role);
        `);
        console.log('[Migrate Roles] ✓ Role index created');
      } catch (err: any) {
        if (err.code === '42P07') {
          // Index already exists
          console.log('[Migrate Roles] Role index already exists, skipping');
        } else {
          throw err;
        }
      }

      // Step 3: Create contribution leaderboard index
      console.log('[Migrate Roles] Creating contribution points index...');
      try {
        await client.query(`
          CREATE INDEX idx_users_contribution_points ON users(contribution_points DESC NULLS LAST)
            WHERE contribution_points > 0;
        `);
        console.log('[Migrate Roles] ✓ Contribution points index created');
      } catch (err: any) {
        if (err.code === '42P07') {
          // Index already exists
          console.log('[Migrate Roles] Contribution index already exists, skipping');
        } else {
          throw err;
        }
      }

      // Step 4: Ensure all existing users have role = 'student'
      console.log('[Migrate Roles] Updating existing users...');
      const updateResult = await client.query(
        `UPDATE users SET role = 'student' WHERE role IS NULL RETURNING id`
      );
      console.log(`[Migrate Roles] ✓ Updated ${updateResult.rowCount} users`);

      // Step 5: Make role NOT NULL
      console.log('[Migrate Roles] Setting role as NOT NULL...');
      try {
        await client.query(`ALTER TABLE users ALTER COLUMN role SET NOT NULL`);
        console.log('[Migrate Roles] ✓ Role set as NOT NULL');
      } catch (err: any) {
        console.warn('[Migrate Roles] Could not set NOT NULL (likely already set):', err.message);
      }

      // Step 6: Verify migration
      console.log('[Migrate Roles] Verifying migration...');
      const roleStats = await client.query(`
        SELECT role, COUNT(*) as count
        FROM users
        GROUP BY role
        ORDER BY count DESC
      `);

      const hasRoleColumn = await client.query(`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'role'
        ) as exists
      `);

      console.log('[Migrate Roles] ✓ Migration complete');

      return NextResponse.json({
        success: true,
        message: "User roles migration completed successfully",
        details: {
          roleColumnExists: hasRoleColumn.rows[0].exists,
          roleDistribution: roleStats.rows,
          usersUpdated: updateResult.rowCount,
        },
      });

    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error('[Migrate Roles] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
        errorCode: error.code,
        details: error.detail,
      },
      { status: 500 }
    );
  }
}
