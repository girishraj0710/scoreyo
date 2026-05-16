"use client";

import { useState } from "react";
import { AlertCircle, Check, X } from "lucide-react";

interface ReportQuestionButtonProps {
  questionId: string;
  compact?: boolean;
}

export default function ReportQuestionButton({
  questionId,
  compact = false,
}: ReportQuestionButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    { value: "incorrect_answer", label: "Incorrect Answer" },
    { value: "wrong_explanation", label: "Wrong Explanation" },
    { value: "unclear_question", label: "Unclear Question" },
    { value: "typo", label: "Typo/Grammar Error" },
    { value: "other", label: "Other Issue" },
  ];

  const handleSubmit = async () => {
    if (!reason) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/report-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, reason, details }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setShowModal(false);
          setSubmitted(false);
          setReason("");
          setDetails("");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to report question:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`${
          compact
            ? "text-xs text-gray-500 hover:text-red-600"
            : "px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        } flex items-center gap-1.5`}
      >
        <AlertCircle className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
        <span>Report Issue</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600">
                  We'll review this question and fix any issues.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Report Question Issue
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What's wrong with this question?
                    </label>
                    <div className="space-y-2">
                      {reasons.map((r) => (
                        <label
                          key={r.value}
                          className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="reason"
                            value={r.value}
                            checked={reason === r.value}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-4 h-4 text-red-600"
                          />
                          <span className="text-sm text-gray-700">
                            {r.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Details (Optional)
                    </label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Provide more context or suggest a correction..."
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!reason || submitting}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? "Submitting..." : "Submit Report"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
