import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { getUserByEmail, approveStudyMaterial, getStudyMaterial } from '@/lib/db';
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
