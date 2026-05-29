"use client";

import { Flame } from "lucide-react";
import { motion } from "framer-motion";

interface StreakBadgeProps {
  currentStreak: number;
  bestStreak: number;
  size?: "sm" | "md" | "lg";
}

export function StreakBadge({
  currentStreak,
  bestStreak,
  size = "md"
}: StreakBadgeProps) {
  const isActive = currentStreak > 0;

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  if (!isActive) {
    return (
      <div className={`flex items-center gap-2 ${sizeClasses[size]} bg-gray-100 rounded-full text-gray-500`}>
        <Flame className={`${iconSizes[size]} opacity-50`} />
        <span>Start your streak!</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`flex items-center gap-2 ${sizeClasses[size]} bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white shadow-lg`}
    >
      <motion.div
        animate={{
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1.1, 1.1, 1]
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 3
        }}
      >
        <Flame className={iconSizes[size]} />
      </motion.div>
      <div className="flex flex-col">
        <span className="font-bold leading-tight">
          {currentStreak} Day Streak! 🔥
        </span>
        {currentStreak < bestStreak && (
          <span className="text-xs opacity-80">
            Best: {bestStreak} days
          </span>
        )}
        {currentStreak >= bestStreak && currentStreak > 1 && (
          <span className="text-xs opacity-80">
            New record! 🎉
          </span>
        )}
      </div>
    </motion.div>
  );
}

// Compact version for mobile/sidebar
export function StreakBadgeCompact({ currentStreak }: { currentStreak: number }) {
  if (currentStreak === 0) return null;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-sm font-semibold shadow">
      <Flame className="w-4 h-4" />
      <span>{currentStreak}</span>
    </div>
  );
}
