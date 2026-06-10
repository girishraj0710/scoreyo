import { NextRequest, NextResponse } from 'next/server';
import { insertStudyMaterial } from '@/lib/db';
import { uploadFiles, STORAGE_CONSTANTS } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const maxDuration = 90; // 90 seconds timeout for upload

export async function POST(request: NextRequest) {
  try {
    // Check Supabase configuration
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Study materials feature not configured. Contact administrator.' },
        { status: 503 }
      );
    }

    // Get user from cookie
    const userId = request.cookies.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const examId = formData.get('examId') as string;
    const subjectId = formData.get('subjectId') as string;

    // Validate inputs
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (!examId || !subjectId) {
      return NextResponse.json(
        { error: 'examId and subjectId are required' },
        { status: 400 }
      );
    }

    if (files.length > STORAGE_CONSTANTS.MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${STORAGE_CONSTANTS.MAX_FILES} files allowed` },
        { status: 400 }
      );
    }

    // Calculate total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > STORAGE_CONSTANTS.MAX_BATCH_SIZE) {
      return NextResponse.json(
        { error: 'Total file size exceeds 200MB limit' },
        { status: 400 }
      );
    }

    // Upload files to Supabase storage
    logger.debug('Starting study material uploads', {
      userId,
      fileCount: files.length,
      totalSize,
      examId,
      subjectId,
    });

    const uploadedFiles = await uploadFiles(
      files,
      parseInt(examId),
      parseInt(subjectId)
    );

    // Create database records for each file
    const materialIds: string[] = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = files[i];
      const uploadedFile = uploadedFiles[i];
      const title = (formData.get(`titles[${i}]`) as string) || file.name;
      const description = (formData.get(`descriptions[${i}]`) as string) || '';

      try {
        const fileType = uploadedFile.name.toLowerCase().endsWith('.pptx')
          ? 'ppt'
          : uploadedFile.name.toLowerCase().endsWith('.docx')
            ? 'docx'
            : 'pdf';

        const materialId = await insertStudyMaterial({
          contributor_id: userId,
          exam_id: parseInt(examId),
          subject_id: parseInt(subjectId),
          title: title.slice(0, 255),
          description: description.slice(0, 500),
          file_path: uploadedFile.path,
          file_type: fileType as 'pdf' | 'docx' | 'ppt',
          file_size: uploadedFile.size,
        });

        materialIds.push(materialId);
        logger.debug('Study material record created', {
          materialId,
          title,
          path: uploadedFile.path,
        });
      } catch (error) {
        logger.error('Failed to create study material record', {}, error as Error);
        // Continue with other files even if one fails
      }
    }

    if (materialIds.length === 0) {
      return NextResponse.json(
        { error: 'Failed to save study materials' },
        { status: 500 }
      );
    }

    logger.info('Study materials uploaded successfully', {
      userId,
      count: materialIds.length,
      ids: materialIds,
    });

    return NextResponse.json({
      success: true,
      message: `${materialIds.length} material(s) uploaded for review`,
      materialIds,
    });
  } catch (error) {
    logger.error('Study material upload failed', {}, error as Error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
