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
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 shimmer h-64" />
    );
  }

  if (!streakData) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Study Streak Calendar
        </h3>
        <p className="text-slate-400 text-sm">No streak data available</p>
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
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 shadow-sm border border-amber-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Study Streak</h3>
            <p className="text-sm text-slate-500">Last 4 weeks</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200">
          <Flame className="w-4 h-4 text-amber-600" />
          <span className="text-lg font-bold text-amber-700">
            {streakData.currentStreak}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg p-3 border border-amber-100">
          <div className="flex items-center gap-1 mb-1">
            <Flame className="w-3 h-3 text-amber-500" />
            <span className="text-xs text-slate-500">Current</span>
          </div>
          <div className="text-xl font-bold text-amber-600">
            {streakData.currentStreak}
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-orange-100">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-orange-500" />
            <span className="text-xs text-slate-500">Longest</span>
          </div>
          <div className="text-xl font-bold text-orange-600">
            {streakData.longestStreak}
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-slate-200">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-slate-500">Total</span>
          </div>
          <div className="text-xl font-bold text-slate-700">
            {streakData.totalDays}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg p-4 border border-slate-200">
        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayLabels.map((label, idx) => (
            <div
              key={idx}
              className="text-center text-xs font-medium text-slate-400"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar Grid - 4 rows of 7 days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, idx) => {
            const isToday = date.toDateString() === today.toDateString();
            const studied = streakData.last30Days[27 - idx]; // Reverse index
            const isFuture = date > today;

            return (
              <div
                key={idx}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                  isFuture
                    ? "bg-slate-50 text-slate-300"
                    : studied
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm hover:shadow-md"
                      : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                } ${
                  isToday
                    ? "ring-2 ring-indigo-500 ring-offset-2"
                    : ""
                }`}
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
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-100">
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
        <div className="mt-4 p-3 bg-amber-100 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800 font-medium text-center">
            {streakData.currentStreak >= 7
              ? `🔥 Amazing! ${streakData.currentStreak} days strong! Keep it going!`
              : streakData.currentStreak >= 3
                ? `💪 Great work! ${streakData.currentStreak} days in a row!`
                : `✨ You're on a roll! Day ${streakData.currentStreak}!`}
          </p>
        </div>
      )}

      {streakData.currentStreak === 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium text-center">
            🎯 Start your streak today! Complete any quiz to begin.
          </p>
        </div>
      )}
    </div>
  );
}
