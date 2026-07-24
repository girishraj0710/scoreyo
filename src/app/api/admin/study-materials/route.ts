import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { getPendingStudyMaterials } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return denied;

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
