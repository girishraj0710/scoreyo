'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import { isAdmin } from '@/lib/admin';
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Loader,
} from 'lucide-react';

interface Material {
  id: string;
  title: string;
  description: string;
  file_type: string;
  file_size: number;
  exam_name: string;
  subject_name: string;
  contributor_name: string;
  contributor_email: string;
  created_at: string;
}

interface ReviewState {
  materialId: string | null;
  reason: string;
  isSubmitting: boolean;
}

export default function AdminReviewMaterialsPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [reviewState, setReviewState] = useState<ReviewState>({
    materialId: null,
    reason: '',
    isSubmitting: false,
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Check auth
  useEffect(() => {
    if (!userLoading && user && !isAdmin(user.role, user.email)) {
      router.push('/');
    }
  }, [user, userLoading, router]);

  // Fetch materials
  useEffect(() => {
    if (user && isAdmin(user.role, user.email)) {
      fetchMaterials();
    }
  }, [user]);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch('/api/admin/study-materials?status=pending');

      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }

      const data = await response.json();
      setMaterials(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load materials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (materialId: string) => {
    try {
      setReviewState((prev) => ({ ...prev, isSubmitting: true }));
      const response = await fetch(
        `/api/admin/study-materials/${materialId}/approve`,
        { method: 'POST' }
      );

      if (!response.ok) {
        throw new Error('Failed to approve material');
      }

      setSuccessMessage('Material approved successfully!');
      setMaterials((prev) => prev.filter((m) => m.id !== materialId));

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setReviewState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleReject = async (materialId: string) => {
    if (!reviewState.reason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    try {
      setReviewState((prev) => ({ ...prev, isSubmitting: true }));
      const response = await fetch(
        `/api/admin/study-materials/${materialId}/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: reviewState.reason }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reject material');
      }

      setSuccessMessage('Material rejected and contributor notified');
      setMaterials((prev) => prev.filter((m) => m.id !== materialId));
      setReviewState({ materialId: null, reason: '', isSubmitting: false });

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setReviewState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const getFileSizeFormatted = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(1) + 'MB';
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return 'PDF';
      case 'docx':
        return 'DOCX';
      case 'ppt':
        return 'PPT';
      default:
        return 'FILE';
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[var(--card-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin(user.role, user.email)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--card-bg)] pt-8 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Review Study Materials
          </h1>
          <p className="text-lg text-slate-600">
            Approve or reject submitted study materials
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-slate-600">Loading materials...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && materials.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-lg font-semibold text-slate-900">
              All caught up!
            </p>
            <p className="text-slate-600 mt-2">
              No pending materials to review
            </p>
          </div>
        )}

        {/* Materials List */}
        {!isLoading && materials.length > 0 && (
          <div className="space-y-4">
            {materials.map((material) => (
              <div
                key={material.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600 flex-shrink-0">
                        {getFileIcon(material.file_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {material.title}
                        </h3>
                        {material.description && (
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                            {material.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-600">
                          <span>
                            <strong>Exam:</strong> {material.exam_name}
                          </span>
                          <span>•</span>
                          <span>
                            <strong>Subject:</strong> {material.subject_name}
                          </span>
                          <span>•</span>
                          <span>
                            <strong>Size:</strong> {getFileSizeFormatted(material.file_size)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                          <strong>Contributor:</strong> {material.contributor_name}{' '}
                          ({material.contributor_email})
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(material.id)}
                      disabled={reviewState.isSubmitting}
                      className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                      {reviewState.isSubmitting &&
                      reviewState.materialId === material.id ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        setReviewState({
                          ...reviewState,
                          materialId:
                            reviewState.materialId === material.id
                              ? null
                              : material.id,
                        })
                      }
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-medium hover:border-slate-400 transition-colors"
                    >
                      <XCircle className="w-4 h-4 inline mr-2" />
                      Reject
                    </button>
                  </div>
                </div>

                {/* Rejection Reason Input */}
                {reviewState.materialId === material.id && (
                  <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: "var(--card-border)" }}>
                    <p className="font-medium" style={{ color: "var(--foreground)" }}>
                      Please provide a rejection reason:
                    </p>
                    <textarea
                      value={reviewState.reason}
                      onChange={(e) =>
                        setReviewState({
                          ...reviewState,
                          reason: e.target.value,
                        })
                      }
                      maxLength={500}
                      placeholder="E.g., Quality issues, incorrect content, etc."
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    />
                    <p className="text-xs text-slate-500">
                      {reviewState.reason.length}/500 characters
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReject(material.id)}
                        disabled={
                          reviewState.isSubmitting ||
                          !reviewState.reason.trim()
                        }
                        className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Confirm Rejection
                      </button>
                      <button
                        onClick={() =>
                          setReviewState({
                            materialId: null,
                            reason: '',
                            isSubmitting: false,
                          })
                        }
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-medium hover:border-slate-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
