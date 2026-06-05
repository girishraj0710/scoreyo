import { NextRequest, NextResponse } from 'next/server';
import { getStudyMaterial, incrementDownloadCount } from '@/lib/db';
import { getPublicUrl } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    logger.debug('Download request for study material', { materialId: id });

    // Fetch material from database
    const material = await getStudyMaterial(id);

    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }

    // Verify material is approved
    if (material.status !== 'approved') {
      return NextResponse.json(
        { error: 'Material is not available for download' },
        { status: 403 }
      );
    }

    // Increment download count asynchronously (don't wait for it)
    incrementDownloadCount(id).catch((error) => {
      logger.error('Failed to increment download count', { materialId: id }, error as Error);
    });

    // Get public URL from Supabase
    const publicUrl = getPublicUrl(material.file_path);

    logger.info('Study material downloaded', {
      materialId: id,
      title: material.title,
      contributor: material.contributor_name,
    });

    // Redirect to public URL with proper headers
    return NextResponse.redirect(publicUrl, {
      status: 302,
    });
  } catch (error) {
    const { id } = await params;
    logger.error('Failed to process download request', { id }, error as Error);
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}
