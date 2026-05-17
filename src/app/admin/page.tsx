"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
    icon: string;
    color?: string;
  }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📊 Admin Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Question quality metrics, usage patterns, and insights
            </p>
          </div>
          <Link
            href="/admin/questions"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            📝 Review Questions
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Questions"
            value={analytics.questionMetrics.total}
            icon="📚"
            color="blue"
          />
          <StatCard
            title="Total Users"
            value={analytics.usageMetrics.users.total}
            subtitle={`${analytics.usageMetrics.users.active30Days} active (30d)`}
            icon="👥"
            color="green"
          />
          <StatCard
            title="Total Quizzes"
            value={analytics.usageMetrics.quizzes.total}
            subtitle={`${analytics.usageMetrics.quizzes.last7Days} in last 7 days`}
            icon="🎯"
            color="purple"
          />
          <StatCard
            title="Pro Users"
            value={analytics.subscriptions.proUsers}
            subtitle={`₹${analytics.subscriptions.revenue30Days.total} (30d)`}
            icon="⭐"
            color="amber"
          />
        </div>

        {/* Question Quality Metrics */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📚 Question Quality Metrics
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🚨 Question Reports
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              👥 User Activity
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
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Active (30 days)
                </span>
                <span className="text-lg font-bold text-blue-700">
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🔥 Popular Exams (30 days)
            </h2>
            <div className="space-y-2">
              {analytics.usageMetrics.popularExams.slice(0, 8).map((item, idx) => (
                <div key={item.examId} className="flex items-center gap-3">
                  <span className="w-6 text-sm font-bold text-gray-400">
                    #{idx + 1}
                  </span>
                  <span className="flex-1 text-sm text-gray-700 truncate">
                    {item.examId}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {item.attempts} attempts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Average Scores */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📈 Average Scores by Exam
            </h2>
            <div className="space-y-2">
              {analytics.usageMetrics.avgScores.map((item) => (
                <div key={item.examId} className="flex items-center gap-3">
                  <span className="flex-1 text-sm text-gray-700 truncate">
                    {item.examId}
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              ⚠️ Questions Needing Review (Low Accuracy)
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
                        {item.examId} • {item.topic}
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

        {/* Daily Activity Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📅 Daily Activity (Last 14 Days)
          </h2>
          <div className="space-y-2">
            {analytics.dailyActivity.map((item) => (
              <div key={item.date} className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-24">{item.date}</span>
                <div className="flex-1 flex gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="bg-blue-500 h-6 rounded"
                        style={{
                          width: `${
                            (item.quizzes /
                              Math.max(
                                ...analytics.dailyActivity.map((d) => d.quizzes)
                              )) *
                            100
                          }%`,
                        }}
                      />
                      <span className="text-sm text-gray-700">
                        {item.quizzes} quizzes
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="bg-green-500 h-6 rounded"
                        style={{
                          width: `${
                            (item.users /
                              Math.max(
                                ...analytics.dailyActivity.map((d) => d.users)
                              )) *
                            100
                          }%`,
                        }}
                      />
                      <span className="text-sm text-gray-700">
                        {item.users} users
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
