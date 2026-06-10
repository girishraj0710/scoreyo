/**
 * Supabase Storage Integration Module
 * Handles file uploads and storage for study materials
 */

import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

// Storage constants
export const STORAGE_CONSTANTS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_BATCH_SIZE: 200 * 1024 * 1024, // 200MB
  MAX_FILES: 10,
  ALLOWED_TYPES: ['pdf', 'docx', 'pptx'],
  MIME_TYPES: {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  } as Record<string, string>,
};

// Lazy-load Supabase client - only initialize when actually used
let supabaseClient: any = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
  }

  supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseClient;
}

// Export supabase accessor - will only initialize on first use
export const supabase = Object.create(null);
Object.defineProperty(supabase, 'storage', {
  get: () => getSupabaseClient().storage,
});

/**
 * Get file extension and validate it
 */
export function getFileType(filename: string): 'pdf' | 'docx' | 'ppt' | null {
  const name = filename.toLowerCase();

  if (name.endsWith('.pdf')) return 'pdf';
  if (name.endsWith('.docx')) return 'docx';
  if (name.endsWith('.pptx')) return 'ppt'; // Map .pptx to 'ppt' for consistency

  return null;
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > STORAGE_CONSTANTS.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 50MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)`,
    };
  }

  // Check file type
  const fileType = getFileType(file.name);
  if (!fileType) {
    return {
      valid: false,
      error: 'Invalid file type. Only PDF, DOCX, and PPTX files are allowed.',
    };
  }

  // Validate MIME type
  const expectedMimeType = STORAGE_CONSTANTS.MIME_TYPES[fileType];
  if (file.type && file.type !== expectedMimeType) {
    return {
      valid: false,
      error: `File MIME type mismatch for ${fileType} file.`,
    };
  }

  return { valid: true };
}

/**
 * Generate storage path for study material
 */
export function generateStoragePath(
  examId: string | number,
  subjectId: string | number,
  filename: string
): string {
  // Use UUID-based naming to avoid collisions
  const fileType = getFileType(filename);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const newFilename = `${timestamp}-${random}.${fileType}`;

  return `study-materials/exam-${examId}/subject-${subjectId}/${newFilename}`;
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  examId: string | number,
  subjectId: string | number,
  bucketName: string = 'krakkify-study-materials'
): Promise<{ path: string; size: number }> {
  try {
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const storagePath = generateStoragePath(examId, subjectId, file.name);

    logger.debug('Uploading file to Supabase', {
      filename: file.name,
      size: file.size,
      path: storagePath,
      bucket: bucketName,
    });

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      logger.error('Supabase upload error', { path: storagePath }, error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    logger.debug('File uploaded successfully', { path: storagePath });

    return {
      path: data.path,
      size: file.size,
    };
  } catch (error) {
    logger.error('File upload failed', {}, error as Error);
    throw error;
  }
}

/**
 * Upload multiple files
 */
export async function uploadFiles(
  files: File[],
  examId: string | number,
  subjectId: string | number,
  bucketName: string = 'krakkify-study-materials'
): Promise<Array<{ path: string; size: number; name: string }>> {
  if (files.length === 0) {
    throw new Error('No files provided');
  }

  if (files.length > STORAGE_CONSTANTS.MAX_FILES) {
    throw new Error(`Maximum ${STORAGE_CONSTANTS.MAX_FILES} files allowed`);
  }

  // Calculate total size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > STORAGE_CONSTANTS.MAX_BATCH_SIZE) {
    throw new Error('Total file size exceeds 200MB limit');
  }

  // Validate all files first
  for (const file of files) {
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(`${file.name}: ${validation.error}`);
    }
  }

  // Upload files sequentially
  const results: Array<{ path: string; size: number; name: string }> = [];
  for (const file of files) {
    try {
      const result = await uploadFile(file, examId, subjectId, bucketName);
      results.push({
        ...result,
        name: file.name,
      });
    } catch (error) {
      logger.error('Failed to upload file', { filename: file.name }, error as Error);
      throw error;
    }
  }

  return results;
}

/**
 * Delete file from storage
 */
export async function deleteFile(
  filePath: string,
  bucketName: string = 'krakkify-study-materials'
): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      logger.error('Failed to delete file', { path: filePath }, error);
      throw new Error(`Delete failed: ${error.message}`);
    }

    logger.debug('File deleted successfully', { path: filePath });
  } catch (error) {
    logger.error('File deletion failed', { filePath }, error as Error);
    throw error;
  }
}

/**
 * Get public URL for approved material
 */
export function getPublicUrl(
  filePath: string,
  bucketName: string = 'krakkify-study-materials'
): string {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
}
