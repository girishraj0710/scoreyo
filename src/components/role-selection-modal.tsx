"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onRoleSelect: (role: 'student' | 'teacher') => Promise<void>;
}

export function RoleSelectionModal({ isOpen, onRoleSelect }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectRole = async (role: 'student' | 'teacher') => {
    setSelectedRole(role);
    setError(null);
    setIsLoading(true);

    try {
      await onRoleSelect(role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select role');
      setIsLoading(false);
      setSelectedRole(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="rounded-2xl p-8 max-w-md w-full shadow-2xl" style={{ background: "var(--card-bg)" }}>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Welcome to PrepGenie! 🎉
          </h2>
          <p style={{ color: "var(--foreground-secondary)" }}>
            We've added new features for teachers and contributors. Tell us what you'd like to do:
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 text-sm mb-1">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Role Options */}
        <div className="space-y-3 mb-8">
          {/* Student Option */}
          <button
            onClick={() => handleSelectRole('student')}
            disabled={isLoading}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            style={{
              borderColor: selectedRole === 'student' ? '#3b82f6' : 'var(--card-border)',
              background: selectedRole === 'student' ? 'var(--primary-bg)' : 'transparent'
            }}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl mt-1">📚</div>
              <div>
                <h3 className="font-bold" style={{ color: "var(--foreground)" }}>I'm a Student</h3>
                <p className="text-sm mt-1" style={{ color: "var(--foreground-secondary)" }}>
                  Take quizzes, practice problems, track progress, and prepare for exams
                </p>
              </div>
              {selectedRole === 'student' && isLoading && (
                <div className="ml-auto">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                </div>
              )}
            </div>
          </button>

          {/* Teacher Option */}
          <button
            onClick={() => handleSelectRole('teacher')}
            disabled={isLoading}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            style={{
              borderColor: selectedRole === 'teacher' ? '#10b981' : 'var(--card-border)',
              background: selectedRole === 'teacher' ? 'var(--primary-bg)' : 'transparent'
            }}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl mt-1">👨‍🏫</div>
              <div>
                <h3 className="font-bold" style={{ color: "var(--foreground)" }}>I'm a Contributor</h3>
                <p className="text-sm mt-1" style={{ color: "var(--foreground-secondary)" }}>
                  Create and submit verified questions, earn contribution points, build the question bank
                </p>
              </div>
              {selectedRole === 'teacher' && isLoading && (
                <div className="ml-auto">
                  <div className="animate-spin h-5 w-5 border-2 border-emerald-600 border-t-transparent rounded-full" />
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="p-4 rounded-lg border border-blue-200" style={{ background: "var(--primary-bg)" }}>
          <p className="text-sm text-blue-900">
            💡 You can change your role later in settings if needed.
          </p>
        </div>
      </div>
    </div>
  );
}
