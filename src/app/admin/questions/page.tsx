"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHeadersWithCsrf } from "@/lib/csrf-client";

interface Reporter {
  userId: string;
  name: string;
  email: string;
}

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  subjectId: string;
  examId: string;
  difficulty: string;
  source: string;
}

interface Report {
  reportId: string;
  questionId: number;
  reporter: Reporter;
  reason: string;
  details: string;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  resolvedAt: string | null;
  question: Question;
}

export default function AdminQuestionReviewPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingQuestion, setEditingQuestion] = useState<Report | null>(null);
  const [editForm, setEditForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    difficulty: "medium",
  });
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [statusFilter, currentPage]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/questions?status=${statusFilter}&page=${currentPage}&limit=10`
      );
      if (!res.ok) {
        if (res.status === 403) {
          alert("Admin access required");
          router.push("/");
          return;
        }
        throw new Error("Failed to fetch reports");
      }
      const data = await res.json();
      setReports(data.reports);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching reports:", error);
      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (report: Report) => {
    setEditingQuestion(report);
    setEditForm({
      question: report.question.text,
      options: [...report.question.options],
      correctAnswer: report.question.correctAnswer,
      explanation: report.question.explanation,
      difficulty: report.question.difficulty,
    });
    setAdminNotes(report.adminNotes || "");
  };

  const handleSaveQuestion = async () => {
    if (!editingQuestion) return;

    try {
      setSaving(true);

      // Update question
      const questionRes = await fetch("/api/admin/questions", {
        method: "PUT",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({
          questionId: editingQuestion.questionId,
          ...editForm,
        }),
      });

      if (!questionRes.ok) {
        throw new Error("Failed to update question");
      }

      // Update report status to 'fixed'
      const reportRes = await fetch("/api/admin/questions", {
        method: "PATCH",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({
          reportId: editingQuestion.reportId,
          status: "fixed",
          adminNotes,
        }),
      });

      if (!reportRes.ok) {
        throw new Error("Failed to update report status");
      }

      alert("Question updated successfully!");
      setEditingQuestion(null);
      fetchReports();
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save question");
    } finally {
      setSaving(false);
    }
  };

  const handleDismiss = async (report: Report) => {
    if (!confirm("Dismiss this report without making changes?")) return;

    try {
      const res = await fetch("/api/admin/questions", {
        method: "PATCH",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({
          reportId: report.reportId,
          status: "dismissed",
          adminNotes: "No action needed",
        }),
      });

      if (!res.ok) throw new Error("Failed to dismiss report");

      alert("Report dismissed");
      fetchReports();
    } catch (error) {
      console.error("Error dismissing report:", error);
      alert("Failed to dismiss report");
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      incorrect_answer: "Incorrect Answer",
      wrong_explanation: "Wrong Explanation",
      unclear_question: "Unclear Question",
      typo: "Typo/Grammar",
      other: "Other",
    };
    return labels[reason] || reason;
  };

  if (loading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F9CF9] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reported questions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📝 Question Review Dashboard
          </h1>
          <p className="text-gray-600">
            Review and fix reported questions from users
          </p>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex gap-4">
            {["pending", "reviewing", "fixed", "dismissed"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-[#4F9CF9] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Reports List */}
        {reports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">
              No {statusFilter} reports found
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div
                key={report.reportId}
                className="bg-white rounded-xl shadow-md p-6"
              >
                {/* Report Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-2">
                      {getReasonLabel(report.reason)}
                    </span>
                    <p className="text-sm text-gray-600">
                      Reported by: {report.reporter.name} ({report.reporter.email})
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(report)}
                      className="px-4 py-2 bg-[#4F9CF9] text-white rounded-lg hover:bg-[#3B7FD9] transition-colors"
                    >
                      ✏️ Edit Question
                    </button>
                    <button
                      onClick={() => handleDismiss(report)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      ❌ Dismiss
                    </button>
                  </div>
                </div>

                {/* Report Details */}
                {report.details && (
                  <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>User feedback:</strong> {report.details}
                    </p>
                  </div>
                )}

                {/* Question Details */}
                <div className="border-t pt-4">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">
                      {report.question.examId} • {report.question.topic} •{" "}
                      {report.question.difficulty}
                    </span>
                  </div>

                  <p className="font-medium text-gray-900 mb-3">
                    {report.question.text}
                  </p>

                  <div className="space-y-2 mb-3">
                    {report.question.options.map((option, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded ${
                          idx === report.question.correctAnswer
                            ? "bg-green-50 border border-green-300"
                            : "bg-gray-50"
                        }`}
                      >
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {option}
                        {idx === report.question.correctAnswer && (
                          <span className="ml-2 text-green-600 font-medium">
                            ✓ Correct
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-[#E3F2FD] rounded">
                    <p className="text-sm text-gray-700">
                      <strong>Explanation:</strong> {report.question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ← Previous
            </button>
            <span className="px-4 py-2 bg-white rounded-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-6">Edit Question</h2>

            {/* Question Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text
              </label>
              <textarea
                value={editForm.question}
                onChange={(e) =>
                  setEditForm({ ...editForm, question: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            {/* Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              {editForm.options.map((option, idx) => (
                <div key={idx} className="flex items-center gap-3 mb-3">
                  <input
                    type="radio"
                    checked={editForm.correctAnswer === idx}
                    onChange={() =>
                      setEditForm({ ...editForm, correctAnswer: idx })
                    }
                    className="w-5 h-5 text-green-600"
                  />
                  <span className="font-medium w-8">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...editForm.options];
                      newOptions[idx] = e.target.value;
                      setEditForm({ ...editForm, options: newOptions });
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-2">
                Select the correct answer by clicking the radio button
              </p>
            </div>

            {/* Explanation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanation
              </label>
              <textarea
                value={editForm.explanation}
                onChange={(e) =>
                  setEditForm({ ...editForm, explanation: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={editForm.difficulty}
                onChange={(e) =>
                  setEditForm({ ...editForm, difficulty: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Admin Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Internal notes about this fix..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingQuestion(null)}
                disabled={saving}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuestion}
                disabled={saving}
                className="px-6 py-2 bg-[#4F9CF9] text-white rounded-lg hover:bg-[#3B7FD9] transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
