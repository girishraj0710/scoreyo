import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { approveStudyMaterial, getStudyMaterial } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const denied = await requireAdmin(request);
    if (denied) return denied;

    // requireAdmin already verified this cookie is present
    const userId = request.cookies.get('scoreyo-user-id')!.value;

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

    logger.debug('Admin approving study material', { materialId: id, admin: userId });

    // Approve the material
    await approveStudyMaterial(id, userId);

    logger.info('Study material approved', { materialId: id, admin: userId });

    return NextResponse.json({
      success: true,
      message: 'Material approved successfully',
    });
  } catch (error) {
    const { id: materialId } = await params;
    logger.error('Failed to approve study material', { id: materialId }, error as Error);
    return NextResponse.json(
      { error: 'Failed to approve material' },
      { status: 500 }
    );
  }
}
