import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { getUserByEmail, rejectStudyMaterial, getStudyMaterial } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get user from cookie
    const userId = request.cookies.get('prepgenie-user-id')?.value;

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

    // Parse request body
    const body = await request.json();
    const reason = body.reason as string;

    if (!reason || typeof reason !== 'string') {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    if (reason.length > 500) {
      return NextResponse.json(
        { error: 'Rejection reason exceeds 500 characters' },
        { status: 400 }
      );
    }

    // Verify material exists
    const material = await getStudyMaterial(id);
    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }

    if (material.status !== 'pending') {
      return NextResponse.json(
        { error: `Material is already ${material.status}` },
        { status: 400 }
      );
    }

    logger.debug('Admin rejecting study material', {
      materialId: id,
      admin: userId,
      reason_length: reason.length,
    });

    // Reject the material
    await rejectStudyMaterial(id, reason);

    logger.info('Study material rejected', {
      materialId: id,
      admin: userId,
    });

    return NextResponse.json({
      success: true,
      message: 'Material rejected successfully',
    });
  } catch (error) {
    const { id: materialId } = await params;
    logger.error('Failed to reject study material', { id: materialId }, error as Error);
    return NextResponse.json(
      { error: 'Failed to reject material' },
      { status: 500 }
    );
  }
}
