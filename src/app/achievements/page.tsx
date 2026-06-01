"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { BADGES, RARITY_STYLES, checkBadges, getNextMilestones, type Badge } from "@/lib/achievements";
import { Trophy, Award, Lock, Share2, TrendingUp } from "lucide-react";

interface BadgeWithStatus extends Badge {
  unlocked: boolean;
  unlocked_at?: string;
}

export default function AchievementsPage() {
  const { user } = useUser();
  const [badges, setBadges] = useState<BadgeWithStatus[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      loadBadges();
    }
  }, [user]);

  async function loadBadges() {
    try {
      const res = await fetch("/api/achievements");
      const data = await res.json();

      console.log("Badges API response:", data);
      console.log("Badges count:", data.badges?.length || 0);

      setBadges(data.badges || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error("Failed to load badges:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function shareBadge(badge: BadgeWithStatus) {
    const text = `🎉 Just unlocked "${badge.name}" badge on PrepGenie!\n${badge.description}\n\nJoin me: https://prepgenie.co.in`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(text);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="shimmer h-20 bg-white rounded-xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="shimmer h-40 bg-white rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const unlockedBadges = badges.filter((b) => b.unlocked);
  const lockedBadges = badges.filter((b) => !b.unlocked);

  const categories = ["all", "level", "streak", "accuracy", "speed", "mastery", "special"];

  const filteredBadges =
    selectedCategory === "all"
      ? badges
      : badges.filter((b) => b.category === selectedCategory);

  const completionPercentage = badges.length > 0
    ? Math.round((unlockedBadges.length / badges.length) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-[#00A1E0] rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Achievements & Badges</h1>
            <p className="text-indigo-100">Track your progress and earn rewards</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{unlockedBadges.length}</div>
            <div className="text-sm text-indigo-100">Badges Earned</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{badges.length}</div>
            <div className="text-sm text-indigo-100">Total Badges</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <div className="text-sm text-indigo-100">Completion</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{stats?.streak || 0}</div>
            <div className="text-sm text-indigo-100">Day Streak</div>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-indigo-100">Overall Progress</span>
            <span className="text-sm font-bold">{unlockedBadges.length} / {badges.length}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-[#4255FF] text-white shadow-lg"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Share Success Message */}
      {shareSuccess && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-down">
          ✓ Copied to clipboard!
        </div>
      )}

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Unlocked Badges First */}
        {filteredBadges
          .filter((b) => b.unlocked)
          .sort((a, b) => {
            // Sort by rarity, then by unlock date
            const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
            if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
              return rarityOrder[a.rarity] - rarityOrder[b.rarity];
            }
            return (
              new Date(b.unlocked_at || "").getTime() -
              new Date(a.unlocked_at || "").getTime()
            );
          })
          .map((badge) => {
            const style = RARITY_STYLES[badge.rarity];
            return (
              <div
                key={badge.id}
                className={`relative rounded-xl p-6 border-2 ${style.bg} ${style.border} ${style.glow} transform hover:scale-105 transition-all cursor-pointer`}
              >
                {/* Badge Icon */}
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2 animate-bounce-slow">{badge.icon}</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text} border ${style.border}`}>
                    {badge.rarity.toUpperCase()}
                  </div>
                </div>

                {/* Badge Info */}
                <div className="text-center mb-4">
                  <h3 className={`text-lg font-bold mb-1 ${style.text}`}>
                    {badge.name}
                  </h3>
                  <p className="text-sm text-slate-600">{badge.description}</p>
                  {badge.unlocked_at && (
                    <p className="text-xs text-slate-400 mt-2">
                      Unlocked on{" "}
                      {new Date(badge.unlocked_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                {/* Share Button */}
                <button
                  onClick={() => shareBadge(badge)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            );
          })}

        {/* Locked Badges */}
        {filteredBadges
          .filter((b) => !b.unlocked)
          .sort((a, b) => {
            const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
            return rarityOrder[a.rarity] - rarityOrder[b.rarity];
          })
          .map((badge) => {
            const style = RARITY_STYLES[badge.rarity];
            return (
              <div
                key={badge.id}
                className={`relative rounded-xl p-6 border-2 bg-slate-50 border-slate-200 opacity-60`}
              >
                {/* Lock Overlay */}
                <div className="absolute top-4 right-4">
                  <Lock className="w-6 h-6 text-slate-400" />
                </div>

                {/* Badge Icon (grayscale) */}
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2 filter grayscale opacity-50">
                    {badge.icon}
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-500 border border-slate-300">
                    {badge.rarity.toUpperCase()}
                  </div>
                </div>

                {/* Badge Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-1 text-slate-500">
                    {badge.name}
                  </h3>
                  <p className="text-sm text-slate-400">{badge.description}</p>

                  {/* Requirement Hint */}
                  <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                      <TrendingUp className="w-3 h-3" />
                      <span>
                        {badge.requirement.type.replace(/_/g, " ")}:{" "}
                        {badge.requirement.value}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* No badges message */}
      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-20 h-20 mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-600 mb-2">
            No badges in this category yet
          </h3>
          <p className="text-slate-500">
            Keep practicing to unlock more achievements!
          </p>
        </div>
      )}
    </div>
  );
}
