"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Clock } from "lucide-react";

interface PendingQuestion {
  id: string;
  user_id: string;
  source_type: string;
  source_file: string | null;
  content_preview: string;
  detected_exam_id: string;
  detected_subject_id: string;
  detected_topics: string[];
  classification_confidence: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  trap_alerts: string[];
  difficulty: string;
  quality_score: number;
  duplicate_check_passed: boolean;
  status: string;
  created_at: string;
}

interface Stats {
  totalPending: number;
  highConfidence: number;
  needsReview: number;
  potentialDuplicates: number;
}

export default function ReviewQuestionsPage() {
  const [questions, setQuestions] = useState<PendingQuestion[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<PendingQuestion | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'high-confidence' | 'needs-review'>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/pending-questions?filter=${filter}`);
      const data = await response.json();

      if (data.success) {
        setQuestions(data.questions);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('[Review] Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
    setSelectedIds(new Set()); // Clear selections when filter changes
  }, [filter]);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === questions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(questions.map(q => q.id)));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) {
      alert('Please select at least one question');
      return;
    }

    if (!confirm(`Approve ${selectedIds.size} questions and add them to the question bank?`)) return;

    setBulkActionLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const questionId of selectedIds) {
        try {
          const response = await fetch(`/api/admin/pending-questions/${questionId}/approve`, {
            method: 'POST',
          });
          const data = await response.json();
          if (data.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      alert(`✅ Approved ${successCount} questions!${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
      setSelectedIds(new Set());
      loadQuestions();
      setSelectedQuestion(null);
    } catch (error) {
      alert('❌ Bulk approval failed');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.size === 0) {
      alert('Please select at least one question');
      return;
    }

    const reason = prompt(`Reject ${selectedIds.size} questions? Enter reason (optional):`);
    if (reason === null) return; // User clicked cancel

    setBulkActionLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const questionId of selectedIds) {
        try {
          const response = await fetch(`/api/admin/pending-questions/${questionId}/reject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
          });
          const data = await response.json();
          if (data.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      alert(`✅ Rejected ${successCount} questions${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
      setSelectedIds(new Set());
      loadQuestions();
      setSelectedQuestion(null);
    } catch (error) {
      alert('❌ Bulk rejection failed');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleApprove = async (questionId: string) => {
    if (!confirm('Approve this question and add it to the question bank?')) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/pending-questions/${questionId}/approve`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Question approved! ${data.pointsAwarded} points awarded to contributor.`);
        loadQuestions();
        setSelectedQuestion(null);
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('[Review] Approve error:', error);
      alert('❌ Failed to approve question');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (questionId: string) => {
    const reason = prompt('Reason for rejection (optional):');
    if (reason === null) return; // User clicked cancel

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/pending-questions/${questionId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Question rejected');
        loadQuestions();
        setSelectedQuestion(null);
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('[Review] Reject error:', error);
      alert('❌ Failed to reject question');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Review Pending Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review AI-generated questions from custom quiz uploads
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Pending</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPending}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">High Confidence</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.highConfidence}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Needs Review</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{stats.needsReview}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Potential Duplicates</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.potentialDuplicates}</div>
            </div>
          </div>
        )}

        {/* Filters and Bulk Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All ({stats?.totalPending || 0})
            </button>
            <button
              onClick={() => setFilter('high-confidence')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'high-confidence'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              High Confidence ({stats?.highConfidence || 0})
            </button>
            <button
              onClick={() => setFilter('needs-review')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'needs-review'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Needs Review ({stats?.needsReview || 0})
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedIds.size} selected
              </span>
              <button
                onClick={handleBulkApprove}
                disabled={bulkActionLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve All
              </button>
              <button
                onClick={handleBulkReject}
                disabled={bulkActionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject All
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No pending questions in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question List */}
            <div className="space-y-4 max-h-[calc(100vh-20rem)] overflow-y-auto">
              {/* Select All Header */}
              <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3 z-10">
                <input
                  type="checkbox"
                  checked={questions.length > 0 && selectedIds.size === questions.length}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer" onClick={toggleSelectAll}>
                  Select All ({questions.length} questions)
                </label>
              </div>

              {questions.map((q) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedQuestion?.id === q.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.has(q.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelection(q.id);
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-0.5 flex-shrink-0"
                    />

                    {/* Question Info - Click to view details */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => setSelectedQuestion(q)}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {q.detected_exam_id} / {q.detected_subject_id}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {q.detected_topics.join(', ')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              q.quality_score >= 80
                                ? 'bg-green-100 text-green-700'
                                : q.quality_score >= 60
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            Q: {q.quality_score}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              q.classification_confidence >= 0.8
                                ? 'bg-green-100 text-green-700'
                                : q.classification_confidence >= 0.6
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            C: {Math.round(q.classification_confidence * 100)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {q.question}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Review Panel */}
            {selectedQuestion && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Review Question</h2>

                {/* Classification Info */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {selectedQuestion.detected_exam_id} → {selectedQuestion.detected_subject_id}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Topics: {selectedQuestion.detected_topics.join(', ')}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs">
                      Quality: <strong>{selectedQuestion.quality_score}/100</strong>
                    </span>
                    <span className="text-xs">
                      Confidence: <strong>{Math.round(selectedQuestion.classification_confidence * 100)}%</strong>
                    </span>
                    {!selectedQuestion.duplicate_check_passed && (
                      <span className="text-xs text-red-600 dark:text-red-400">⚠️ Possible duplicate</span>
                    )}
                  </div>
                </div>

                {/* Question */}
                <div className="mb-4">
                  <div className="font-semibold text-gray-900 dark:text-white mb-2">Question:</div>
                  <div className="text-gray-700 dark:text-gray-300">{selectedQuestion.question}</div>
                </div>

                {/* Options */}
                <div className="mb-4">
                  <div className="font-semibold text-gray-900 dark:text-white mb-2">Options:</div>
                  <div className="space-y-2">
                    {selectedQuestion.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded ${
                          idx === selectedQuestion.correct_answer
                            ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {opt}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div className="mb-4">
                  <div className="font-semibold text-gray-900 dark:text-white mb-2">Explanation:</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">{selectedQuestion.explanation}</div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(selectedQuestion.id)}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                    Approve & Add to Bank
                  </button>
                  <button
                    onClick={() => handleReject(selectedQuestion.id)}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <XCircle className="w-5 h-5 inline mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
