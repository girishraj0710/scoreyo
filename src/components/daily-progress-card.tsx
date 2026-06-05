"use client";

import { Target, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface DailyProgressCardProps {
  questionsToday: number;
  dailyGoal: number;
  personalBest: number;
}

export function DailyProgressCard({
  questionsToday,
  dailyGoal = 50,
  personalBest
}: DailyProgressCardProps) {
  const progress = Math.min((questionsToday / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - questionsToday, 0);
  const isGoalReached = questionsToday >= dailyGoal;
  const isPersonalBest = questionsToday > personalBest;

  return (
    <div className="rounded-2xl p-6 shadow-lg border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--foreground-secondary)" }}>
            Questions Today
          </p>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={questionsToday}
              initial={{ scale: 1.2, color: "#6366f1" }}
              animate={{ scale: 1, color: "var(--foreground)" }}
              className="text-4xl font-bold"
            >
              {questionsToday}
            </motion.span>
            <span className="text-xl" style={{ color: "var(--muted)" }}>/ {dailyGoal}</span>
          </div>
        </div>

        {/* Circular Progress */}
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              style={{ color: "var(--hover-bg)" }}
            />
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 36}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 36 * (1 - progress / 100)
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={
                isGoalReached
                  ? "text-green-500"
                  : progress > 70
                  ? "text-[#4255FF]"
                  : "text-blue-400"
              }
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold" style={{ color: "var(--foreground-secondary)" }}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {isGoalReached ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-lg border"
          style={{ background: "rgba(16, 185, 129, 0.1)", borderColor: "rgba(16, 185, 129, 0.3)" }}
        >
          <Zap className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium text-green-600">
            {isPersonalBest
              ? "🎉 New personal record!"
              : "🎯 Daily goal completed! Keep it up!"}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5" style={{ color: "var(--foreground-secondary)" }}>
              <Target className="w-4 h-4" />
              <span>
                {remaining} more to reach your goal
              </span>
            </div>
          </div>

          {personalBest > 0 && questionsToday < personalBest && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {personalBest - questionsToday} more to beat your record of {personalBest}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-4 rounded-full h-2 overflow-hidden" style={{ background: "var(--hover-bg)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${
            isGoalReached
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-gradient-to-r from-blue-500 to-[#4255FF]"
          }`}
        />
      </div>
    </div>
  );
}
