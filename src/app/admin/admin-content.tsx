"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getExamById, examCategories } from "@/lib/exams";

interface Analytics {
  questionMetrics: {
    total: number;
    bySource: Array<{ source: string; count: number }>;
    byDifficulty: Array<{ difficulty: string; count: number }>;
    byExam: Array<{ examId: string; count: number }>;
  };
  reportMetrics: {
    byStatus: Array<{ status: string; count: number }>;
    recentCount: number;
  };
  usageMetrics: {
    users: {
      total: number;
      active7Days: number;
      active30Days: number;
    };
    quizzes: {
      total: number;
      last7Days: number;
      last30Days: number;
    };
    popularExams: Array<{ examId: string; attempts: number }>;
    popularSubjects: Array<{ subjectId: string; attempts: number }>;
    avgScores: Array<{ examId: string; avgScore: string }>;
  };
  dailyActivity: Array<{ date: string; quizzes: number; users: number }>;
  questionQuality: {
    lowAccuracy: Array<{
      id: number;
      question: string;
      examId: string;
      topic: string;
      correctCount: number;
      totalAttempts: number;
      accuracy: string;
    }>;
  };
  subscriptions: {
    proUsers: number;
    revenue30Days: {
      count: number;
      total: number;
    };
  };
  topicBreakdown: Array<{
    // Legacy format fields (when modelType = "legacy")
    examId?: string;
    subjectId?: string;
    topic: string;
    source?: string;
    difficulty?: string;
    count?: number;
    // Dimensional format fields (when modelType = "dimensional")
    scope?: string;
    exam_count?: number;
    question_count?: number;
    sources?: string;
    difficulties?: string;
  }>;
  modelType?: "legacy" | "dimensional";
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>("all");
  const [topicSearchQuery, setTopicSearchQuery] = useState<string>("");
  const [topicBreakdownLoading, setTopicBreakdownLoading] = useState(false);

  // Helper to get exam display name
  const getExamName = (examId: string): string => {
    const exam = getExamById(examId);
    return exam?.name || examId;
  };

  // Helper to get subject display name
  const getSubjectName = (examId: string, subjectId: string): string => {
    const exam = getExamById(examId);
    if (!exam) return subjectId;
    const subject = exam.subjects.find(s => s.id === subjectId);
    return subject?.name || subjectId;
  };

  // Calculate total available exams from config
  const getTotalAvailableExams = (): number => {
    return examCategories.reduce((total, category) => total + category.exams.length, 0);
  };

  // Get all exams with their question counts (including 0 for new exams)
  const getAllExamsWithCounts = () => {
    if (!analytics) return [];

    // Get all exams from config
    const allExams = examCategories.flatMap(cat => cat.exams);

    // Create a map of exam counts from database
    const countsMap = new Map(
      analytics.questionMetrics.byExam.map(item => [item.examId, item.count])
    );

    // Merge: all exams with their counts (0 if not in DB)
    const merged = allExams.map(exam => ({
      examId: exam.id,
      examName: exam.name,
      count: countsMap.get(exam.id) || 0,
      isNew: !countsMap.has(exam.id), // Flag new exams without questions
    }));

    // Sort: exams with questions first (by count desc), then new exams alphabetically
    return merged.sort((a, b) => {
      if (a.count === 0 && b.count === 0) return a.examName.localeCompare(b.examName);
      if (a.count === 0) return 1;
      if (b.count === 0) return -1;
      return b.count - a.count;
    });
  };

  // Get filtered topic breakdown (only client-side search, exam filter is handled by API)
  const getFilteredTopicBreakdown = () => {
    if (!analytics) return [];

    let filtered = [...analytics.topicBreakdown]; // Create a copy to avoid mutation

    // Note: Exam filtering is now handled server-side by the API
    // This function only handles client-side search filtering

    // Apply search query filter (works for both models)
    if (topicSearchQuery.trim()) {
      const query = topicSearchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const topicMatch = item.topic?.toLowerCase().includes(query);
        const examMatch = analytics.modelType === "dimensional"
          ? false
          : getExamName(item.examId!).toLowerCase().includes(query);
        const subjectMatch = analytics.modelType === "dimensional"
          ? false
          : getSubjectName(item.examId!, item.subjectId!).toLowerCase().includes(query);
        const sourceMatch = item.source?.toLowerCase().includes(query) || item.sources?.toLowerCase().includes(query);
        return topicMatch || examMatch || subjectMatch || sourceMatch;
      });
    }

    return filtered;
  };

  // Get unique exams from topic breakdown for filter
  const getUniqueExamsInBreakdown = () => {
    if (!analytics) return [];

    // For dimensional model, use all available exams from config
    if (analytics.modelType === "dimensional") {
      return examCategories
        .flatMap(cat => cat.exams)
        .map(exam => ({ id: exam.id, name: exam.name }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    // Legacy model: extract unique exams from breakdown
    const uniqueExamIds = [...new Set(analytics.topicBreakdown.map(item => item.examId!))];
    return uniqueExamIds.map(examId => ({
      id: examId,
      name: getExamName(examId),
    })).sort((a, b) => a.name.localeCompare(b.name));
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) {
        if (res.status === 403) {
          alert("Admin access required");
          router.push("/");
          return;
        }
        throw new Error("Failed to fetch analytics");
      }
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      alert("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopicBreakdown = async () => {
    try {
      setTopicBreakdownLoading(true);
      // Build URL with optional exam filter
      const url = selectedExamFilter !== "all"
        ? `/api/admin/analytics?examId=${encodeURIComponent(selectedExamFilter)}`
        : "/api/admin/analytics";

      console.log("Fetching topic breakdown with URL:", url);

      const res = await fetch(url);
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API error response:", errorText);
        throw new Error("Failed to fetch topic breakdown");
      }
      const data = await res.json();
      console.log("Topic breakdown data received:", data.topicBreakdown?.length, "entries");

      // Only update the topic breakdown, keep other analytics data
      setAnalytics(prev => prev ? {
        ...prev,
        topicBreakdown: data.topicBreakdown,
        modelType: data.modelType,
      } : null);
    } catch (error) {
      console.error("Error fetching topic breakdown:", error);
      alert("Failed to fetch topic breakdown: " + (error as Error).message);
    } finally {
      setTopicBreakdownLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []); // Only fetch once on mount

  useEffect(() => {
    // Re-fetch only topic breakdown when exam filter changes (skip initial render)
    if (analytics && selectedExamFilter) {
      console.log("Exam filter changed to:", selectedExamFilter);
      fetchTopicBreakdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExamFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F9CF9] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color?: string;
  }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`text-${color}-500`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <svg className="w-8 h-8 text-[#4F9CF9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Admin Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Question quality metrics, usage patterns, and insights
            </p>
          </div>
          <Link
            href="/admin/questions"
            className="px-6 py-3 bg-[#4F9CF9] text-white rounded-lg hover:bg-[#3B7FD9] transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Review Questions
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Questions"
            value={analytics.questionMetrics.total}
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            color="blue"
          />
          <StatCard
            title="Total Users"
            value={analytics.usageMetrics.users.total}
            subtitle={`${analytics.usageMetrics.users.active30Days} active (30d)`}
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            color="green"
          />
          <StatCard
            title="Total Quizzes"
            value={analytics.usageMetrics.quizzes.total}
            subtitle={`${analytics.usageMetrics.quizzes.last7Days} in last 7 days`}
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
            color="indigo"
          />
          <StatCard
            title="Pro Users"
            value={analytics.subscriptions.proUsers}
            subtitle={`₹${analytics.subscriptions.revenue30Days.total} (30d)`}
            icon={
              <svg className="w-12 h-12 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            }
            color="yellow"
          />
        </div>

        {/* Question Quality Metrics */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#00A1E0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Question Quality Metrics
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Questions by Difficulty */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                By Difficulty
              </h3>
              <div className="space-y-2">
                {analytics.questionMetrics.byDifficulty.map((item) => (
                  <div key={item.difficulty} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-gray-600 capitalize">
                      {item.difficulty}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.difficulty === "easy"
                            ? "bg-green-500"
                            : item.difficulty === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${
                            (item.count / analytics.questionMetrics.total) * 100
                          }%`,
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Sources */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Top Question Sources
              </h3>
              <div className="space-y-2">
                {analytics.questionMetrics.bySource.slice(0, 5).map((item) => (
                  <div key={item.source} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                      {item.source}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Report Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Question Reports */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Question Reports
            </h2>
            <div className="space-y-3">
              {analytics.reportMetrics.byStatus.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {item.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.status === "pending"
                        ? "bg-orange-100 text-orange-700"
                        : item.status === "fixed"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.count}
                  </span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  📅 {analytics.reportMetrics.recentCount} reports in last 7 days
                </p>
              </div>
            </div>
          </div>

          {/* User Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              User Activity
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Active (7 days)
                </span>
                <span className="text-lg font-bold text-green-700">
                  {analytics.usageMetrics.users.active7Days}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#E3F2FD] rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Active (30 days)
                </span>
                <span className="text-lg font-bold text-[#3B7FD9]">
                  {analytics.usageMetrics.users.active30Days}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Retention Rate:{" "}
                  {(
                    (analytics.usageMetrics.users.active30Days /
                      analytics.usageMetrics.users.total) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Popular Exams */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Popular Exams (30 days)
            </h2>
            <div className="space-y-2">
              {analytics.usageMetrics.popularExams.slice(0, 8).map((item, idx) => (
                <div key={item.examId} className="flex items-center gap-3">
                  <span className="w-6 text-sm font-bold text-gray-400">
                    #{idx + 1}
                  </span>
                  <span className="flex-1 text-sm text-gray-700 truncate" title={item.examId}>
                    {getExamName(item.examId)}
                  </span>
                  <span className="text-sm font-semibold text-[#4F9CF9]">
                    {item.attempts} attempts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Average Scores */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#00A1E0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              Average Scores by Exam
            </h2>
            <div className="space-y-2">
              {analytics.usageMetrics.avgScores.map((item) => (
                <div key={item.examId} className="flex items-center gap-3">
                  <span className="flex-1 text-sm text-gray-700 truncate" title={item.examId}>
                    {getExamName(item.examId)}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `${item.avgScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12">
                      {item.avgScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Accuracy Questions */}
        {analytics.questionQuality.lowAccuracy.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Questions Needing Review (Low Accuracy)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Questions with less than 30% accuracy (10+ attempts) may have issues
            </p>
            <div className="space-y-3">
              {analytics.questionQuality.lowAccuracy.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">{item.question}</p>
                      <p className="text-xs text-gray-600">
                        {getExamName(item.examId)} • {item.topic}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">
                        {item.accuracy}%
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.correctCount}/{item.totalAttempts} correct
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Activity & Top Exams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Activity Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Daily Activity Trend (Last 14 Days)
            </h2>

            {/* Legend */}
            <div className="flex items-center gap-6 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#E3F2FD]0 rounded"></div>
                <span className="text-gray-700">Quizzes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-700">Active Users</span>
              </div>
            </div>

            {/* Chart */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {[...analytics.dailyActivity]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((item) => (
                <div key={item.date} className="flex items-center gap-4">
                  <span className="text-xs text-gray-600 w-20 text-right whitespace-nowrap flex-shrink-0">
                    {item.date}
                  </span>
                  <div className="flex-1 space-y-2">
                    {/* Quizzes Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-5">
                        <div
                          className="bg-[#E3F2FD]0 h-5 rounded-full transition-all"
                          style={{
                            width: `${Math.max(
                              5,
                              (item.quizzes /
                                Math.max(
                                  ...analytics.dailyActivity.map((d) => d.quizzes)
                                )) *
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-700 font-medium whitespace-nowrap w-16">
                        {item.quizzes} quiz
                      </span>
                    </div>
                    {/* Users Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-5">
                        <div
                          className="bg-green-500 h-5 rounded-full transition-all"
                          style={{
                            width: `${Math.max(
                              5,
                              (item.users /
                                Math.max(
                                  ...analytics.dailyActivity.map((d) => d.users)
                                )) *
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-700 font-medium whitespace-nowrap w-16">
                        {item.users} user
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Exams by Questions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#00A1E0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Question Bank Coverage
            </h2>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-800 font-medium">
                ✨ 7 new state CETs added: UPSEE, BCECE, OJEE, TNEA, GUJCET, REAP, JCECE
              </p>
              <p className="text-xs text-green-700 mt-1">
                Run question seeders to populate these exams with questions
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Exams with questions in the database
            </p>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {getAllExamsWithCounts().map((item, idx) => {
                const maxCount = Math.max(...getAllExamsWithCounts().map(e => e.count), 1);
                return (
                  <div key={item.examId} className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm flex-shrink-0 ${
                      item.isNew
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-[#E3F2FD] text-[#3B7FD9]'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 truncate flex items-center gap-2" title={item.examId}>
                          {item.examName}
                          {item.isNew && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                              NEW
                            </span>
                          )}
                        </span>
                        <span className={`text-sm font-bold whitespace-nowrap ${
                          item.count === 0 ? 'text-gray-400' : 'text-[#4F9CF9]'
                        }`}>
                          {item.count === 0 ? '0 (needs seeding)' : item.count.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            item.count === 0 ? 'bg-gray-300' : 'bg-[#4F9CF9]'
                          }`}
                          style={{
                            width: item.count === 0 ? '2%' : `${Math.max(5, (item.count / maxCount) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {getAllExamsWithCounts().length}
                </p>
                <p className="text-xs text-gray-600 mt-1">Total Exams</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {getAllExamsWithCounts().filter(e => e.count > 0).length}
                </p>
                <p className="text-xs text-gray-600 mt-1">Exams with Questions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#4F9CF9]">
                  {Math.round(
                    analytics.questionMetrics.total /
                    getAllExamsWithCounts().filter(e => e.count > 0).length
                  )}
                </p>
                <p className="text-xs text-gray-600 mt-1">Avg Questions per Exam</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Topic-Level Breakdown */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#4F9CF9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Topic-Level Question Breakdown
                  {analytics?.modelType && (
                    <span className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
                      analytics.modelType === "dimensional"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {analytics.modelType === "dimensional" ? "📊 Dimensional Model" : "📦 Legacy Model"}
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {analytics?.modelType === "dimensional"
                    ? "Showing shared topics across all exams with question pools"
                    : "Detailed view of questions by exam, subject, topic, source, and difficulty"}
                </p>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Input */}
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search topics, exams, subjects, sources..."
                    value={topicSearchQuery}
                    onChange={(e) => setTopicSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                  {topicSearchQuery && (
                    <button
                      onClick={() => setTopicSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Exam Filter Dropdown (Always Visible for Both Models) */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Filter by Exam:
                </label>
                <select
                  value={selectedExamFilter}
                  onChange={(e) => {
                    setSelectedExamFilter(e.target.value);
                  }}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[200px]"
                >
                  <option value="all">All Exams ({getUniqueExamsInBreakdown().length})</option>
                  {getUniqueExamsInBreakdown().map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Filters Count */}
              {(selectedExamFilter !== "all" || topicSearchQuery) && (
                <button
                  onClick={() => {
                    setSelectedExamFilter("all");
                    setTopicSearchQuery("");
                  }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Loading indicator for topic breakdown */}
          {topicBreakdownLoading && (
            <div className="mb-4 p-4 bg-[#E3F2FD] border border-blue-200 rounded-lg text-sm text-[#3B7FD9] flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4F9CF9]"></div>
              Loading topics for selected exam...
            </div>
          )}

          <div className="overflow-y-auto max-h-[600px] border border-gray-200 rounded-lg relative">
            {topicBreakdownLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F9CF9]"></div>
              </div>
            )}
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {analytics?.modelType === "dimensional" ? (
                    // Dimensional model headers
                    <>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 w-[35%]">
                        Topic
                      </th>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 w-[15%]">
                        Scope
                      </th>
                      <th scope="col" className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase bg-gray-50 w-[10%]">
                        Exams
                      </th>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 w-[18%]">
                        Sources
                      </th>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 w-[12%]">
                        Difficulties
                      </th>
                      <th scope="col" className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase bg-gray-50 w-[10%]">
                        Questions
                      </th>
                    </>
                  ) : (
                    // Legacy model headers
                    <>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 w-[12%]">
                        Exam
                      </th>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 w-[10%]">
                        Subject
                      </th>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 w-[32%]">
                        Topic
                      </th>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 w-[16%]">
                        Source
                      </th>
                      <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 w-[14%]">
                        Difficulty
                      </th>
                      <th scope="col" className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase bg-gray-50 w-[16%]">
                        Count
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredTopicBreakdown().map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    {analytics?.modelType === "dimensional" ? (
                      // Dimensional model row
                      <>
                        <td className="px-2 py-2 text-xs font-medium text-gray-900 overflow-hidden">
                          <div className="truncate" title={item.topic}>
                            {item.topic}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-xs overflow-hidden">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                            item.scope === 'universal'
                              ? 'bg-green-100 text-green-700'
                              : item.scope === 'state-specific'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-[#3B7FD9]'
                          }`}>
                            {item.scope}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-xs text-right font-semibold text-[#4F9CF9]">
                          {item.exam_count}
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600 overflow-hidden">
                          <div className="truncate text-[10px]" title={item.sources}>
                            {item.sources}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600 overflow-hidden">
                          <div className="truncate text-[10px]" title={item.difficulties}>
                            {item.difficulties}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-xs text-right font-semibold text-gray-900">
                          {item.question_count?.toLocaleString()}
                        </td>
                      </>
                    ) : (
                      // Legacy model row
                      <>
                        <td className="px-2 py-2 text-xs font-medium text-gray-900 overflow-hidden">
                          <div className="truncate" title={getExamName(item.examId!)}>
                            {getExamName(item.examId!)}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600 overflow-hidden">
                          <div className="truncate" title={getSubjectName(item.examId!, item.subjectId!)}>
                            {getSubjectName(item.examId!, item.subjectId!)}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-600 overflow-hidden">
                          <div className="truncate" title={item.topic}>
                            {item.topic}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-xs overflow-hidden">
                          <div className="truncate" title={item.source}>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium inline-block ${
                              item.source?.includes('pyq') || item.source?.includes('verified')
                                ? 'bg-green-100 text-green-700'
                                : item.source?.includes('ai')
                                ? 'bg-blue-100 text-[#3B7FD9]'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {item.source}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-2 text-xs">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize inline-block ${
                            item.difficulty === 'easy'
                              ? 'bg-green-100 text-green-700'
                              : item.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {item.difficulty}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-xs text-right font-semibold text-gray-900">
                          {item.count}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {getFilteredTopicBreakdown().length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No topic data available</p>
            </div>
          ) : (
            <div className="mt-3 text-right text-xs text-gray-500">
              Showing {getFilteredTopicBreakdown().length} {getFilteredTopicBreakdown().length === 1 ? 'entry' : 'entries'}
              {selectedExamFilter !== "all" && (
                <span className="ml-1">for {getExamName(selectedExamFilter)}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
