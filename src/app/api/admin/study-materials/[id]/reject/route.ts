import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { rejectStudyMaterial, getStudyMaterial } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const denied = await requireAdmin(request);
    if (denied) return denied;

    const userId = request.cookies.get('scoreyo-user-id')?.value;

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
