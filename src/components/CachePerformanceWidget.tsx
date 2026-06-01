"use client";

import { useEffect, useState } from "react";
import { Zap, Database, Clock } from "lucide-react";

interface CachePerformance {
  period: string;
  totals: {
    verified: number;
    ai: number;
    total: number;
  };
  cacheHitRate: number;
  performanceRating: string;
  quizzesTaken: number;
}

export default function CachePerformanceWidget() {
  const [data, setData] = useState<CachePerformance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance();
  }, []);

  async function fetchPerformance() {
    try {
      const res = await fetch("/api/stats/cache-performance?period=7d");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch cache performance:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!data || data.quizzesTaken === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-bold text-white">Question Sources</h3>
        </div>
        <p className="text-sm text-gray-400">
          Take a few quizzes to see your performance analytics here!
        </p>
      </div>
    );
  }

  const { totals, cacheHitRate, performanceRating } = data;

  // Color based on hit rate
  const ratingColor =
    cacheHitRate >= 80
      ? "text-green-400"
      : cacheHitRate >= 60
      ? "text-blue-400"
      : cacheHitRate >= 40
      ? "text-yellow-400"
      : "text-orange-400";

  const ratingBg =
    cacheHitRate >= 80
      ? "bg-green-500/10 border-green-500/20"
      : cacheHitRate >= 60
      ? "bg-[#E8EAFF]0/10 border-blue-500/20"
      : cacheHitRate >= 40
      ? "bg-yellow-500/10 border-yellow-500/20"
      : "bg-orange-500/10 border-orange-500/20";

  const verifiedPercent = totals.total > 0 ? Math.round((totals.verified / totals.total) * 100) : 0;
  const aiPercent = totals.total > 0 ? Math.round((totals.ai / totals.total) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-bold text-white">Question Sources</h3>
        </div>
        <span className="text-xs text-gray-400">(Last 7 Days)</span>
      </div>

      {/* Performance Rating Badge */}
      <div className={`${ratingBg} border rounded-lg p-3 mb-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">Cache Hit Rate</p>
            <p className={`text-2xl font-bold ${ratingColor}`}>{cacheHitRate}%</p>
          </div>
          <div className="text-right">
            <div className={`text-sm font-semibold ${ratingColor}`}>
              {performanceRating}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {data.quizzesTaken} {data.quizzesTaken === 1 ? "quiz" : "quizzes"}
            </p>
          </div>
        </div>
      </div>

      {/* Source Breakdown */}
      <div className="space-y-3">
        {/* Verified Questions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">Verified Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{totals.verified}</span>
            <span className="text-xs text-gray-400">({verifiedPercent}%)</span>
          </div>
        </div>

        {/* AI Generated Questions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">AI Generated</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{totals.ai}</span>
            <span className="text-xs text-gray-400">({aiPercent}%)</span>
          </div>
        </div>

        {/* Visual Bar */}
        <div className="pt-2">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden flex">
            <div
              className="bg-green-500"
              style={{ width: `${verifiedPercent}%` }}
            ></div>
            <div
              className="bg-[#E8EAFF]0"
              style={{ width: `${aiPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-xs text-gray-400 mt-4 leading-relaxed">
        {cacheHitRate >= 80 ? (
          <>
            <Zap className="w-3 h-3 inline text-green-400" /> Most questions loaded instantly
            from our verified bank!
          </>
        ) : (
          <>
            Questions are loading from our database and AI generation. Higher verified %
            means faster quiz loading.
          </>
        )}
      </p>
    </div>
  );
}
