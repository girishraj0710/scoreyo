"use client";

import { useState, useEffect } from "react";
import { Flame, Calendar, TrendingUp } from "lucide-react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  last30Days: boolean[]; // true = studied that day
}

export function StudyStreakCalendar() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStreakData();
  }, []);

  async function loadStreakData() {
    try {
      const res = await fetch("/api/streak-calendar");
      const data = await res.json();
      setStreakData(data);
    } catch (error) {
      console.error("Failed to load streak data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-xl p-6 shadow-sm border shimmer h-64" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }} />
    );
  }

  if (!streakData) {
    return (
      <div className="rounded-xl p-6 shadow-sm border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Study Streak Calendar
        </h3>
        <p className="text-sm" style={{ color: "var(--muted)" }}>No streak data available</p>
      </div>
    );
  }

  // Get last 28 days (4 weeks)
  const today = new Date();
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date);
  }

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="rounded-2xl p-6 shadow-lg border h-[500px] flex flex-col" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>Study Streak</h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Last 4 weeks</p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full border" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)" }}>
          <Flame className="w-4 h-4 text-amber-600" />
          <span className="text-lg font-bold text-amber-700">
            {streakData.currentStreak}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4 shrink-0">
        <div className="rounded-lg p-3 border" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-1 mb-1">
            <Flame className="w-3 h-3 text-amber-500" />
            <span className="text-xs" style={{ color: "var(--muted)" }}>Current</span>
          </div>
          <div className="text-xl font-bold text-amber-600">
            {streakData.currentStreak}
          </div>
        </div>

        <div className="rounded-lg p-3 border" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-orange-500" />
            <span className="text-xs" style={{ color: "var(--muted)" }}>Longest</span>
          </div>
          <div className="text-xl font-bold text-orange-600">
            {streakData.longestStreak}
          </div>
        </div>

        <div className="rounded-lg p-3 border" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3" style={{ color: "var(--muted)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>Total</span>
          </div>
          <div className="text-xl font-bold" style={{ color: "var(--foreground-secondary)" }}>
            {streakData.totalDays}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-lg p-4 border flex-1 flex flex-col min-h-0" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)" }}>
        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-2 mb-2 shrink-0">
          {dayLabels.map((label, idx) => (
            <div
              key={idx}
              className="text-center text-xs font-medium"
              style={{ color: "var(--muted)" }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar Grid - 4 rows of 7 days */}
        <div className="grid grid-cols-7 grid-rows-4 gap-2 flex-1 min-h-0">
          {days.map((date, idx) => {
            const isToday = date.toDateString() === today.toDateString();
            const studied = streakData.last30Days[27 - idx]; // Reverse index
            const isFuture = date > today;

            return (
              <div
                key={idx}
                className="rounded-lg flex items-center justify-center text-xs font-medium transition-all"
                style={
                  isFuture
                    ? { background: "var(--card-bg)", color: "var(--muted)" }
                    : studied
                      ? { background: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)", color: "white" }
                      : { background: "var(--card-bg)", color: "var(--muted)" }
                }
                title={date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              >
                {studied ? (
                  <Flame className="w-3 h-3" />
                ) : isFuture ? (
                  ""
                ) : (
                  date.getDate()
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded"></div>
            <span className="text-xs text-slate-500">Studied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-100 rounded"></div>
            <span className="text-xs text-slate-500">Missed</span>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      {streakData.currentStreak > 0 && (
        <div className="mt-3 p-2.5 bg-amber-100 border border-amber-200 rounded-lg shrink-0">
          <p className="text-xs text-amber-800 font-medium text-center">
            {streakData.currentStreak >= 7
              ? `🔥 Amazing! ${streakData.currentStreak} days strong! Keep it going!`
              : streakData.currentStreak >= 3
                ? `💪 Great work! ${streakData.currentStreak} days in a row!`
                : `✨ You're on a roll! Day ${streakData.currentStreak}!`}
          </p>
        </div>
      )}

      {streakData.currentStreak === 0 && (
        <div className="mt-3 p-2.5 bg-[#E8EAFF] border border-blue-200 rounded-lg shrink-0">
          <p className="text-xs text-blue-800 font-medium text-center">
            🎯 Start your streak today! Complete any quiz to begin.
          </p>
        </div>
      )}
    </div>
  );
}
