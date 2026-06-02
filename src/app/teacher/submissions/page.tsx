"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";

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

  // Check if user is teacher or contributor
  useEffect(() => {
    if (!isLoading && user && !isAdmin(user.role, user.email) && !['teacher', 'contributor'].includes(user.role || 'student')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch submissions
  useEffect(() => {
    if (!isLoading && user && ['teacher', 'contributor', 'admin'].includes(user.role || 'student')) {
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
      const res = await fetch('/api/teacher/submissions');
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p className="text-slate-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin(user.role, user.email) && !['teacher', 'contributor'].includes(user.role || 'student'))) {
    return null;
  }

  const statusConfig = {
    pending: { icon: Clock, color: 'yellow', label: 'Pending Review', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    approved: { icon: CheckCircle, color: 'green', label: 'Approved', bg: 'bg-green-50', border: 'border-green-200' },
    rejected: { icon: XCircle, color: 'red', label: 'Rejected', bg: 'bg-red-50', border: 'border-red-200' },
  };

  const tabs = [
    { id: 'all' as const, label: 'All', count: submissions.length },
    { id: 'pending' as const, label: '⏳ Pending', count: submissions.filter(s => s.status === 'pending').length },
    { id: 'approved' as const, label: '✅ Approved', count: submissions.filter(s => s.status === 'approved').length },
    { id: 'rejected' as const, label: '❌ Rejected', count: submissions.filter(s => s.status === 'rejected').length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              📝 My Submissions
            </h1>
            <p className="text-lg text-slate-600">
              Track and manage your contributed questions
            </p>
          </div>
          <Link
            href="/teacher"
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
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-sm opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-900 font-semibold">Error loading submissions</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {pageLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-slate-600">Loading submissions...</p>
            </div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-slate-200 p-12 text-center">
            <p className="text-2xl mb-3">📭</p>
            <p className="text-lg font-semibold text-slate-900 mb-2">No submissions yet</p>
            <p className="text-slate-600 mb-6">
              {activeTab === 'all' ? 'Start creating questions to see them here!' : `No ${activeTab} submissions`}
            </p>
            <Link
              href="/teacher"
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
                  className={`${config.bg} border-l-4 ${
                    submission.status === 'pending'
                      ? 'border-l-yellow-500'
                      : submission.status === 'approved'
                      ? 'border-l-green-500'
                      : 'border-l-red-500'
                  } rounded-lg p-6 transition-all hover:shadow-md`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Question */}
                      <p className="text-lg font-semibold text-slate-900 mb-3">
                        {submission.question.substring(0, 200)}
                        {submission.question.length > 200 ? '...' : ''}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-4 mb-3 text-sm">
                        <span className="text-slate-600">
                          📚 <strong>{submission.classification?.exam_name || 'Unknown Exam'}</strong>
                        </span>
                        <span className="text-slate-600">
                          📖 <strong>{submission.classification?.subject_name || 'Unknown Subject'}</strong>
                        </span>
                        <span className="text-slate-600">
                          ⚡ <strong className="capitalize">{submission.difficulty}</strong>
                        </span>
                        <span className="text-slate-500">
                          {new Date(submission.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      {/* Options Preview */}
                      <div className="mb-3 text-sm bg-white bg-opacity-60 rounded p-3">
                        <p className="text-slate-700 mb-2">
                          <strong>Options:</strong>
                        </p>
                        <ul className="space-y-1 text-slate-600">
                          {submission.options.map((option, idx) => (
                            <li key={idx} className={idx === submission.correctAnswer ? 'font-semibold text-green-700' : ''}>
                              {String.fromCharCode(65 + idx)}) {option.substring(0, 100)}...
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Admin Feedback for Rejected */}
                      {submission.status === 'rejected' && submission.admin_feedback && (
                        <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
                          <p className="text-sm font-semibold text-red-900 mb-1">Feedback:</p>
                          <p className="text-sm text-red-800">{submission.admin_feedback}</p>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusIcon className="w-6 h-6" />
                      <span className="font-semibold whitespace-nowrap">
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
