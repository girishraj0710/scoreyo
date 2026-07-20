import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { getUserByEmail } from '@/lib/db';
import { getPendingStudyMaterials } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Get user from cookie
    const userId = request.cookies.get('scoreyo-user-id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin status
    const user = await getUserByEmail(userId);
    if (!isAdmin(user?.role, user?.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get query params
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get('limit') || '50'),
      200
    );
    const offset = Math.max(
      parseInt(request.nextUrl.searchParams.get('offset') || '0'),
      0
    );

    logger.debug('Admin fetching pending study materials', { limit, offset });

    const materials = await getPendingStudyMaterials(limit, offset);

    return NextResponse.json({
      success: true,
      data: materials,
      count: materials.length,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('Failed to fetch pending study materials', {}, error as Error);
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}
