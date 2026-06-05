"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { Icon3DNotebook, Icon3DBook } from "@/components/premium-3d-icons";

interface Submission {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  status: 'pending' | 'approved' | 'rejected';
  exam_id: string;
  subject_id: string;
  classification?: {
    exam_name: string;
    subject_name: string;
  };
  admin_feedback?: string;
  created_at: string;
}

export default function SubmissionsPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(false);

  // Check if user is contributor or contributor
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    if (!isLoading && user && !isAdmin(user.role, user.email) && !['contributor', 'contributor'].includes(user.role || 'student')) {
      router.push('/');
    }
  }, [user, isLoading]);

  // Fetch submissions
  useEffect(() => {
    if (!isLoading && user && ['contributor', 'contributor', 'admin'].includes(user.role || 'student')) {
      fetchSubmissions();
    }
  }, [isLoading, user]);

  // Filter submissions when active tab changes
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredSubmissions(submissions);
    } else {
      setFilteredSubmissions(submissions.filter(s => s.status === activeTab));
    }
  }, [activeTab, submissions]);

  async function fetchSubmissions() {
    try {
      setPageLoading(true);
      setError(null);
      const res = await fetch('/api/contributor/submissions');
      if (!res.ok) {
        throw new Error('Failed to fetch submissions');
      }
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setPageLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p style={{ color: "var(--foreground-secondary)" }}>Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin(user.role, user.email) && !['contributor', 'contributor'].includes(user.role || 'student'))) {
    return null;
  }

  const statusConfig = {
    pending: { icon: Clock, color: 'yellow', label: 'Pending Review', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    approved: { icon: CheckCircle, color: 'green', label: 'Approved', bg: 'bg-green-50', border: 'border-green-200' },
    rejected: { icon: XCircle, color: 'red', label: 'Rejected', bg: 'bg-red-50', border: 'border-red-200' },
  };

  const tabs = [
    { id: 'all' as const, label: 'All', count: submissions.length },
    { id: 'pending' as const, label: 'Pending', count: submissions.filter(s => s.status === 'pending').length },
    { id: 'approved' as const, label: 'Approved', count: submissions.filter(s => s.status === 'approved').length },
    { id: 'rejected' as const, label: 'Rejected', count: submissions.filter(s => s.status === 'rejected').length },
  ];

  return (
    <div className="min-h-screen pt-8 pb-12 px-4" style={{ background: "var(--background)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Icon3DNotebook size={56} />
              <h1 className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>
                My Submissions
              </h1>
            </div>
            <p className="text-lg" style={{ color: "var(--foreground-secondary)" }}>
              Track and manage your contributed questions
            </p>
          </div>
          <Link
            href="/contributor"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Create More
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : ''
              }`}
              style={activeTab !== tab.id ? {
                background: "var(--card-bg)",
                color: "var(--foreground)",
                borderColor: "var(--card-border)",
                borderWidth: "1px",
                borderStyle: "solid"
              } : undefined}
            >
              {tab.label}
              <span className="ml-2 text-sm opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-lg" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
            <p className="font-semibold text-red-500">Error loading submissions</p>
            <p className="text-sm text-red-500 mt-1 opacity-75">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {pageLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
              <p style={{ color: "var(--foreground-secondary)" }}>Loading submissions...</p>
            </div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="rounded-xl border-2 p-12 text-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <div className="flex justify-center mb-4">
              <Icon3DBook size={80} />
            </div>
            <p className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>No submissions yet</p>
            <p className="mb-6" style={{ color: "var(--foreground-secondary)" }}>
              {activeTab === 'all' ? 'Start creating questions to see them here!' : `No ${activeTab} submissions`}
            </p>
            <Link
              href="/contributor"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Create Questions
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => {
              const config = statusConfig[submission.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={submission.id}
                  className={`border-l-4 rounded-lg p-6 transition-all hover:shadow-md ${
                    submission.status === 'pending'
                      ? 'border-l-yellow-500'
                      : submission.status === 'approved'
                      ? 'border-l-green-500'
                      : 'border-l-red-500'
                  }`}
                  style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Question */}
                      <p className="text-lg font-semibold mb-3" style={{ color: "var(--foreground)" }}>
                        {submission.question.substring(0, 200)}
                        {submission.question.length > 200 ? '...' : ''}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-4 mb-3 text-sm">
                        <span className="flex items-center gap-1" style={{ color: "var(--foreground-secondary)" }}>
                          <Icon3DBook size={16} /> <strong>{submission.classification?.exam_name || 'Unknown Exam'}</strong>
                        </span>
                        <span className="flex items-center gap-1" style={{ color: "var(--foreground-secondary)" }}>
                          <Icon3DNotebook size={16} /> <strong>{submission.classification?.subject_name || 'Unknown Subject'}</strong>
                        </span>
                        <span style={{ color: "var(--foreground-secondary)" }}>
                          <strong className="capitalize">{submission.difficulty}</strong>
                        </span>
                        <span style={{ color: "var(--muted)" }}>
                          {new Date(submission.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      {/* Options Preview */}
                      <div className="mb-3 text-sm rounded p-3" style={{ background: "var(--primary-bg)", borderColor: "var(--card-border)", borderWidth: "1px", borderStyle: "solid" }}>
                        <p className="mb-2" style={{ color: "var(--foreground)" }}>
                          <strong>Options:</strong>
                        </p>
                        <ul className="space-y-1">
                          {submission.options.map((option, idx) => (
                            <li key={idx} style={{ color: idx === submission.correctAnswer ? "#22c55e" : "var(--foreground-secondary)" }} className={idx === submission.correctAnswer ? 'font-semibold' : ''}>
                              {String.fromCharCode(65 + idx)}) {option.substring(0, 100)}...
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Admin Feedback for Rejected */}
                      {submission.status === 'rejected' && submission.admin_feedback && (
                        <div className="mt-3 p-3 rounded border" style={{ background: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.3)" }}>
                          <p className="text-sm font-semibold mb-1" style={{ color: "#ef4444" }}>Feedback:</p>
                          <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>{submission.admin_feedback}</p>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusIcon className="w-6 h-6" />
                      <span className="font-semibold whitespace-nowrap" style={{ color: "var(--foreground)" }}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
