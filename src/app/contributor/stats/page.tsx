"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { Icon3DChart, Icon3DSparkle, Icon3DNotebook, Icon3DTrophy } from "@/components/premium-3d-icons";

interface ContributorStats {
  questions_contributed: number;
  contribution_points: number;
  pending_questions: number;
  approved_questions: number;
  rejected_questions: number;
  approval_rate: number;
}

export default function StatsPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [stats, setStats] = useState<ContributorStats | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is contributor or contributor
  useEffect(() => {
    if (!isLoading && user && !isAdmin(user.role, user.email) && !['contributor', 'contributor'].includes(user.role || 'student')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch stats
  useEffect(() => {
    if (!isLoading && user && ['contributor', 'contributor', 'admin'].includes(user.role || 'student')) {
      fetchStats();
    }
  }, [isLoading, user]);

  async function fetchStats() {
    try {
      setPageLoading(true);
      setError(null);
      const res = await fetch('/api/contributor/stats');
      if (!res.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setPageLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p className="text-slate-600">Loading stats...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin(user.role, user.email) && !['contributor', 'contributor'].includes(user.role || 'student'))) {
    return null;
  }

  const getLevel = (points: number) => {
    if (points < 100) return 'Contributor';
    if (points < 500) return 'Expert Contributor';
    if (points < 1000) return 'Master Contributor';
    return 'Legend Contributor';
  };

  return (
    <div className="min-h-screen bg-white pt-8 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Icon3DChart size={56} />
              <h1 className="text-4xl font-bold text-slate-900">
                Contribution Stats
              </h1>
            </div>
            <p className="text-lg text-slate-600">
              Track your contribution to PrepGenie's question bank
            </p>
          </div>
          <Link
            href="/contributor"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Create Questions
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-900 font-semibold">Error loading stats</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {pageLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-slate-600">Loading stats...</p>
            </div>
          </div>
        ) : stats ? (
          <>
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Questions Contributed */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-blue-900">Questions Contributed</h3>
                  <Icon3DNotebook size={48} />
                </div>
                <p className="text-5xl font-bold text-blue-600 mb-2">{stats.questions_contributed}</p>
                <p className="text-sm text-blue-700">Total questions submitted</p>
              </div>

              {/* Contribution Points */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-purple-900">Contribution Points</h3>
                  <Icon3DTrophy size={48} />
                </div>
                <p className="text-5xl font-bold text-purple-600 mb-2">{stats.contribution_points}</p>
                <p className="text-sm text-purple-700">Points earned from approved questions</p>
              </div>

              {/* Approval Rate */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-green-900">Approval Rate</h3>
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-5xl font-bold text-green-600 mb-2">{stats.approval_rate}%</p>
                <p className="text-sm text-green-700">Percentage of approved questions</p>
              </div>
            </div>

            {/* Level & Status */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-2">Your Current Level</p>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon3DTrophy size={48} />
                    <h2 className="text-4xl font-bold">{getLevel(stats.contribution_points)}</h2>
                  </div>
                  <p className="text-sm opacity-90">Keep contributing to reach the next level!</p>
                </div>
                <Icon3DSparkle size={80} />
              </div>
            </div>

            {/* Question Status Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Status Chart */}
              <div className="bg-white border-2 border-slate-200 rounded-xl p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Question Status</h3>

                <div className="space-y-4">
                  {/* Pending */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span className="text-slate-700 font-medium">Pending</span>
                      </div>
                      <span className="font-bold text-slate-900">{stats.pending_questions}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all"
                        style={{
                          width: stats.questions_contributed > 0 ? `${(stats.pending_questions / stats.questions_contributed) * 100}%` : '0%'
                        }}
                      />
                    </div>
                  </div>

                  {/* Approved */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-slate-700 font-medium">Approved</span>
                      </div>
                      <span className="font-bold text-slate-900">{stats.approved_questions}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{
                          width: stats.questions_contributed > 0 ? `${(stats.approved_questions / stats.questions_contributed) * 100}%` : '0%'
                        }}
                      />
                    </div>
                  </div>

                  {/* Rejected */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-slate-700 font-medium">Rejected</span>
                      </div>
                      <span className="font-bold text-slate-900">{stats.rejected_questions}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{
                          width: stats.questions_contributed > 0 ? `${(stats.rejected_questions / stats.questions_contributed) * 100}%` : '0%'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white border-2 border-slate-200 rounded-xl p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Summary</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <span className="text-slate-700">Total Submissions</span>
                    <span className="text-2xl font-bold text-blue-600">{stats.questions_contributed}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <span className="text-slate-700">Earning Per Question</span>
                    <span className="text-2xl font-bold text-green-600">+10 pts</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <span className="text-slate-700">Current Earnings</span>
                    <span className="text-2xl font-bold text-purple-600">{stats.contribution_points} pts</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                    <span className="text-slate-700">Success Rate</span>
                    <span className="text-2xl font-bold text-amber-600">{stats.approval_rate}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard Info */}
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6">
              <p className="text-indigo-900 mb-2">
                <strong>🎯 Tip:</strong> Higher quality questions and consistent contributions help you climb the contributor leaderboard. Keep improving your submissions!
              </p>
              <p className="text-sm text-indigo-800">
                Last updated: {new Date().toLocaleTimeString('en-IN')}
              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
