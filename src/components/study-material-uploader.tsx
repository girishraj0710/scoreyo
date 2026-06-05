'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUpload {
  file: File;
  title: string;
  description: string;
  error?: string;
}

interface StudyMaterialUploaderProps {
  onFilesSelected: (files: FileUpload[]) => void;
  isLoading?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  maxBatchSize?: number; // in MB
}

export function StudyMaterialUploader({
  onFilesSelected,
  isLoading = false,
  maxFiles = 10,
  maxFileSize = 50,
  maxBatchSize = 200,
}: StudyMaterialUploaderProps) {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (newFiles: File[]): FileUpload[] => {
    const errors: string[] = [];
    const validated: FileUpload[] = [];

    // Check max files
    if (files.length + newFiles.length > maxFiles) {
      errors.push(
        `Maximum ${maxFiles} files allowed (you have ${files.length})`
      );
      return validated;
    }

    // Calculate total size
    const newSize = newFiles.reduce((sum, f) => sum + f.size, 0);
    const currentSize = files.reduce((sum, f) => sum + f.file.size, 0);
    const totalSize = currentSize + newSize;

    if (totalSize > maxBatchSize * 1024 * 1024) {
      errors.push(
        `Total size exceeds ${maxBatchSize}MB limit (${(totalSize / 1024 / 1024).toFixed(1)}MB)`
      );
      return validated;
    }

    // Validate each file
    for (const file of newFiles) {
      const fileError: FileUpload = {
        file,
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        description: '',
      };

      // Check file type
      const name = file.name.toLowerCase();
      if (!name.endsWith('.pdf') && !name.endsWith('.docx') && !name.endsWith('.pptx')) {
        fileError.error =
          'Invalid type (PDF, DOCX, PPTX only)';
        validated.push(fileError);
        continue;
      }

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        fileError.error = `Exceeds ${maxFileSize}MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)`;
        validated.push(fileError);
        continue;
      }

      validated.push(fileError);
    }

    setErrors(errors);
    return validated;
  };

  const handleFiles = (newFiles: File[]) => {
    const validated = validateFiles(newFiles);
    const updatedFiles = [...files, ...validated];
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const newFiles = Array.from(e.dataTransfer.files) as File[];
    handleFiles(newFiles);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      handleFiles(newFiles);
    }
  };

  const updateFile = (index: number, key: 'title' | 'description', value: string) => {
    const updated = [...files];
    updated[index][key] = value;
    setFiles(updated);
    onFilesSelected(updated);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesSelected(updated);
  };

  const getTotalSize = () => {
    return files.reduce((sum, f) => sum + f.file.size, 0);
  };

  const getFileIcon = (filename: string) => {
    const name = filename.toLowerCase();
    return name.endsWith('.pdf')
      ? 'PDF'
      : name.endsWith('.docx')
        ? 'DOCX'
        : 'PPT';
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-indigo-600'
            : ''
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        style={{
          borderColor: dragActive ? '#4f46e5' : 'var(--card-border)',
          background: dragActive ? 'var(--primary-bg)' : 'var(--card-bg)'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.pptx"
          onChange={handleInputChange}
          disabled={isLoading}
          className="hidden"
        />

        <div
          className="flex flex-col items-center gap-3"
          onClick={() => !isLoading && fileInputRef.current?.click()}
        >
          <div className="p-3 rounded-lg" style={{ background: 'var(--primary-bg)' }}>
            <Upload className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
              Drop files here or click to browse
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--foreground-secondary)' }}>
              PDF, DOCX, PPTX files up to {maxFileSize}MB each
            </p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Upload errors:</p>
              <ul className="text-sm text-red-800 mt-2 space-y-1">
                {errors.map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
              Selected Files ({files.length})
            </h3>
            <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
              {(getTotalSize() / 1024 / 1024).toFixed(1)}MB / {maxBatchSize}MB
            </p>
          </div>

          <div className="space-y-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="rounded-lg p-4 space-y-3"
                style={{
                  border: '1px solid',
                  borderColor: 'var(--card-border)',
                  background: 'var(--card-bg)'
                }}
              >
                {/* File Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="px-2 py-1 rounded text-xs font-bold" style={{ background: 'var(--primary-bg)', color: 'var(--foreground-secondary)' }}>
                      {getFileIcon(file.file.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ color: 'var(--foreground)' }}>
                        {file.file.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        {(file.file.size / 1024 / 1024).toFixed(1)}MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    disabled={isLoading}
                    className="p-2 rounded transition-colors disabled:opacity-50"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    title="Remove file"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                {/* Error Banner */}
                {file.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{file.error}</p>
                  </div>
                )}

                {/* Success Check */}
                {!file.error && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">Ready to upload</p>
                  </div>
                )}

                {/* Metadata Input */}
                {!file.error && (
                  <div className="space-y-3 pt-2" style={{ borderTop: '1px solid var(--card-border)' }}>
                    <div>
                      <label className="text-sm font-medium block mb-1" style={{ color: 'var(--foreground)' }}>
                        Title
                      </label>
                      <input
                        type="text"
                        value={file.title}
                        onChange={(e) =>
                          updateFile(index, 'title', e.target.value)
                        }
                        disabled={isLoading}
                        maxLength={255}
                        placeholder="E.g., Physics Notes - Mechanics"
                        className="w-full px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        style={{
                          border: '1px solid var(--card-border)',
                          background: 'var(--card-bg)',
                          color: 'var(--foreground)'
                        }}
                      />
                      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                        {file.title.length}/255 characters
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-1" style={{ color: 'var(--foreground)' }}>
                        Description (optional)
                      </label>
                      <textarea
                        value={file.description}
                        onChange={(e) =>
                          updateFile(index, 'description', e.target.value)
                        }
                        disabled={isLoading}
                        maxLength={500}
                        placeholder="Brief description of the material"
                        rows={2}
                        className="w-full px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 resize-none"
                        style={{
                          border: '1px solid var(--card-border)',
                          background: 'var(--card-bg)',
                          color: 'var(--foreground)'
                        }}
                      />
                      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                        {file.description.length}/500 characters
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
