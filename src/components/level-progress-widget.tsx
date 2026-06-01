"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Target, TrendingUp } from "lucide-react";
import { BADGES, RARITY_STYLES, type Badge } from "@/lib/achievements";

interface LevelProgressWidgetProps {
  userId?: string;
}

interface LevelProgress {
  totalLevelsCompleted: number;
  totalStars: number;
  currentLevelNumber: number;
  progressToNext: number;
  recentBadges: Array<{
    badge_id: string;
    unlocked_at: string;
  }>;
}

export function LevelProgressWidget({ userId }: LevelProgressWidgetProps) {
  const [progress, setProgress] = useState<LevelProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [userId]);

  async function loadProgress() {
    try {
      const res = await fetch("/api/level-progress");
      const data = await res.json();
      setProgress(data);
    } catch (error) {
      console.error("Failed to load level progress:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 shimmer h-64" />
    );
  }

  if (!progress || progress.totalLevelsCompleted === 0) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 shadow-lg border border-indigo-100 h-[400px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00A1E0] to-violet-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Level Progress</h3>
            <p className="text-sm text-slate-500">Start your journey</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-center py-8">
            <div className="text-6xl mb-3">🎯</div>
            <p className="text-slate-600 font-medium">Begin Level Mode</p>
            <p className="text-sm text-slate-500 mt-2">
              Complete structured levels and earn badges
            </p>
          </div>

          <a
            href="/quiz/levels?examId=jee-main&subjectId=jee-physics"
            className="block w-full py-3 bg-[#4F9CF9] text-white text-center font-semibold rounded-lg transition-all"
          >
            Start Level 1
          </a>
        </div>
      </div>
    );
  }

  const recentBadges = progress.recentBadges
    .slice(0, 3)
    .map((rb) => BADGES.find((b) => b.id === rb.badge_id))
    .filter((b): b is Badge => b !== undefined);

  const nextMilestone = [10, 20, 30, 40, 50, 75, 100].find(
    (m) => m > progress.totalLevelsCompleted
  );

  const milestoneProgress = nextMilestone
    ? (progress.totalLevelsCompleted / nextMilestone) * 100
    : 100;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 shadow-lg border border-indigo-100 h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00A1E0] to-violet-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Level Progress</h3>
            <p className="text-sm text-slate-500">Keep climbing!</p>
          </div>
        </div>

        {progress.totalStars > 0 && (
          <div className="flex items-center gap-1 bg-amber-100 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-amber-700">
              {progress.totalStars}
            </span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-lg p-4 border border-indigo-100">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-[#4F9CF9]" />
            <span className="text-xs text-slate-500">Levels</span>
          </div>
          <div className="text-2xl font-bold text-[#4F9CF9]">
            {progress.totalLevelsCompleted}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-violet-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-violet-600" />
            <span className="text-xs text-slate-500">Current</span>
          </div>
          <div className="text-2xl font-bold text-violet-600">
            Level {progress.currentLevelNumber}
          </div>
        </div>
      </div>

      {/* Next Milestone */}
      {nextMilestone && (
        <div className="bg-white rounded-lg p-4 border border-slate-200 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Next Milestone: Level {nextMilestone}
            </span>
            <span className="text-sm font-bold text-[#4F9CF9]">
              {progress.totalLevelsCompleted}/{nextMilestone}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-[#4F9CF9] to-violet-500 h-3 rounded-full transition-all duration-500 animate-progress"
              style={{ width: `${milestoneProgress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {nextMilestone - progress.totalLevelsCompleted} levels to earn badge
          </p>
        </div>
      )}

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">
            Recent Badges
          </h4>
          <div className="space-y-2">
            {recentBadges.map((badge) => {
              const style = RARITY_STYLES[badge.rarity];
              return (
                <div
                  key={badge.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 ${style.bg} ${style.border} ${style.glow}`}
                >
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold ${style.text}`}>
                      {badge.name}
                    </div>
                    <div className="text-xs text-slate-600 truncate">
                      {badge.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <a
            href="/achievements"
            className="block w-full mt-4 py-2 bg-white border-2 border-[#90CAF9] text-[#4F9CF9] text-center text-sm font-semibold rounded-lg hover:bg-[#E3F2FD] transition-all"
          >
            View All Badges
          </a>
        </div>
      )}
    </div>
  );
}
