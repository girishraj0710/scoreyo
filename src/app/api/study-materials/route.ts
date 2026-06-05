import { NextRequest, NextResponse } from 'next/server';
import { getStudyMaterialsByExamSubject } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const examId = request.nextUrl.searchParams.get('examId');
    const subjectId = request.nextUrl.searchParams.get('subjectId');
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get('limit') || '50'),
      200
    );
    const offset = Math.max(
      parseInt(request.nextUrl.searchParams.get('offset') || '0'),
      0
    );

    // Validate inputs
    if (!examId || !subjectId) {
      return NextResponse.json(
        { error: 'examId and subjectId query parameters are required' },
        { status: 400 }
      );
    }

    logger.debug('Fetching study materials', {
      examId,
      subjectId,
      limit,
      offset,
    });

    const materials = await getStudyMaterialsByExamSubject(
      parseInt(examId),
      parseInt(subjectId),
      limit,
      offset
    );

    return NextResponse.json({
      success: true,
      data: materials,
      count: materials.length,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('Failed to fetch study materials', {}, error as Error);
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}
