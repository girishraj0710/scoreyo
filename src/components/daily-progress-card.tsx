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
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">
            Questions Today
          </p>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={questionsToday}
              initial={{ scale: 1.2, color: "#6366f1" }}
              animate={{ scale: 1, color: "#0f172a" }}
              className="text-4xl font-bold"
            >
              {questionsToday}
            </motion.span>
            <span className="text-xl text-slate-400">/ {dailyGoal}</span>
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
              className="text-slate-200"
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
            <span className="text-lg font-bold text-slate-700">
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
          className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
        >
          <Zap className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium text-green-700">
            {isPersonalBest
              ? "🎉 New personal record!"
              : "🎯 Daily goal completed! Keep it up!"}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Target className="w-4 h-4" />
              <span>
                {remaining} more to reach your goal
              </span>
            </div>
          </div>

          {personalBest > 0 && questionsToday < personalBest && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {personalBest - questionsToday} more to beat your record of {personalBest}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
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
