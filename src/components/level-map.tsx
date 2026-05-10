"use client";

import { LevelDefinition } from "@/lib/level-definitions";
import { Lock, Star, Crown, Play, RotateCcw, Check } from "lucide-react";

interface UserLevel {
  level_number: number;
  level_type: string;
  is_unlocked: number;
  is_completed: number;
  stars_earned: number;
  best_accuracy: number;
  attempts: number;
}

interface LevelMapProps {
  levels: LevelDefinition[];
  userProgress: UserLevel[];
  onLevelClick: (level: LevelDefinition) => void;
  currentLevel?: number;
}

export function LevelMap({ levels, userProgress, onLevelClick, currentLevel }: LevelMapProps) {
  const getUserLevelData = (levelNumber: number): UserLevel | undefined => {
    return userProgress.find((l) => l.level_number === levelNumber);
  };

  const getLevelState = (level: LevelDefinition): "locked" | "unlocked" | "completed" => {
    const userData = getUserLevelData(level.levelNumber);
    if (!userData || !userData.is_unlocked) return "locked";
    if (userData.is_completed) return "completed";
    return "unlocked";
  };

  const getLevelStyle = (state: "locked" | "unlocked" | "completed", isBoss: boolean) => {
    if (state === "locked") {
      return "bg-slate-200 border-slate-300 cursor-not-allowed";
    }
    if (state === "completed") {
      return isBoss
        ? "bg-gradient-to-br from-amber-100 to-amber-200 border-amber-400 cursor-pointer hover:shadow-lg"
        : "bg-gradient-to-br from-emerald-100 to-cyan-100 border-emerald-400 cursor-pointer hover:shadow-lg";
    }
    // unlocked
    return isBoss
      ? "bg-gradient-to-br from-violet-100 to-indigo-100 border-violet-400 cursor-pointer hover:shadow-xl animate-pulse-slow"
      : "bg-gradient-to-br from-indigo-100 to-cyan-100 border-indigo-400 cursor-pointer hover:shadow-xl";
  };

  const renderStars = (stars: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3].map((s) => (
          <Star
            key={s}
            className={`w-4 h-4 ${
              s <= stars ? "fill-amber-400 text-amber-500" : "text-slate-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto py-8">
      {/* Vertical Path Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-200 via-violet-200 to-indigo-200 -translate-x-1/2 z-0" />

      <div className="relative z-10 space-y-6">
        {levels.map((level, index) => {
          const state = getLevelState(level);
          const userData = getUserLevelData(level.levelNumber);
          const isBoss = level.levelType === "boss";
          const isCurrentLevel = level.levelNumber === currentLevel;

          return (
            <div
              key={level.levelNumber}
              className={`flex items-center ${
                index % 2 === 0 ? "justify-end pr-8 md:pr-16" : "justify-start pl-8 md:pl-16"
              }`}
            >
              <div
                onClick={() => state !== "locked" && onLevelClick(level)}
                className={`relative ${isBoss ? "w-32 h-32" : "w-24 h-24"} transition-all duration-300 ${
                  isCurrentLevel ? "ring-4 ring-indigo-400 ring-offset-2" : ""
                }`}
              >
                {/* Level Node */}
                <div
                  className={`w-full h-full rounded-2xl border-4 flex flex-col items-center justify-center p-3 transition-all ${getLevelStyle(
                    state,
                    isBoss
                  )}`}
                >
                  {/* Icon */}
                  {state === "locked" && <Lock className="w-8 h-8 text-slate-400 mb-1" />}
                  {state === "unlocked" && !isBoss && <Play className="w-8 h-8 text-indigo-600 mb-1" />}
                  {state === "unlocked" && isBoss && <Crown className="w-10 h-10 text-violet-600 mb-1" />}
                  {state === "completed" && <Check className="w-8 h-8 text-emerald-600 mb-1" />}

                  {/* Level Number */}
                  <div
                    className={`text-lg font-bold ${
                      state === "locked"
                        ? "text-slate-400"
                        : state === "completed"
                          ? "text-emerald-700"
                          : "text-indigo-700"
                    }`}
                  >
                    {level.levelNumber}
                  </div>

                  {/* Stars (if completed) */}
                  {state === "completed" && userData && (
                    <div className="mt-1">{renderStars(userData.stars_earned)}</div>
                  )}
                </div>

                {/* Level Info Card (on hover or mobile) */}
                {state !== "locked" && (
                  <div
                    className={`absolute ${
                      index % 2 === 0 ? "right-full mr-4" : "left-full ml-4"
                    } top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg border-2 border-slate-200 p-4 w-64 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-800 text-sm leading-tight flex-1">
                        {level.levelName}
                      </h3>
                      {isBoss && <Crown className="w-5 h-5 text-amber-500 ml-2 flex-shrink-0" />}
                    </div>
                    {level.description && (
                      <p className="text-xs text-slate-600 mb-2">{level.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                        {level.questionCount}Q
                      </span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full capitalize">
                        {level.difficulty}
                      </span>
                      {userData && userData.attempts > 0 && (
                        <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full">
                          {userData.attempts} {userData.attempts === 1 ? "attempt" : "attempts"}
                        </span>
                      )}
                    </div>
                    {userData && userData.best_accuracy > 0 && (
                      <div className="mt-2 text-xs text-slate-600">
                        Best: {userData.best_accuracy}%
                      </div>
                    )}
                  </div>
                )}

                {/* Mobile Level Info (always visible below) */}
                <div className="block md:hidden mt-2 text-center">
                  <div className="text-xs font-semibold text-slate-700">{level.levelName}</div>
                  {userData && userData.best_accuracy > 0 && (
                    <div className="text-xs text-slate-500">{userData.best_accuracy}%</div>
                  )}
                </div>
              </div>

              {/* Action Button (Desktop) */}
              {state !== "locked" && (
                <div
                  className={`hidden md:block absolute ${
                    index % 2 === 0 ? "right-full mr-[420px]" : "left-full ml-[420px]"
                  } top-1/2 -translate-y-1/2`}
                >
                  {state === "completed" ? (
                    <button
                      onClick={() => onLevelClick(level)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 text-sm font-medium transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Replay
                    </button>
                  ) : (
                    <button
                      onClick={() => onLevelClick(level)}
                      className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-500 text-white rounded-lg hover:from-indigo-700 hover:to-violet-600 text-sm font-semibold shadow-lg transition-all"
                    >
                      <Play className="w-4 h-4" />
                      {isBoss ? "Start Boss Level" : "Start"}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="mt-12 bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Your Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {userProgress.filter((l) => l.is_completed).length}
            </div>
            <div className="text-sm text-slate-500">Levels Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-500">
              {userProgress.reduce((sum, l) => sum + l.stars_earned, 0)}
            </div>
            <div className="text-sm text-slate-500">Stars Earned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-500">
              {userProgress.filter((l) => l.stars_earned === 3).length}
            </div>
            <div className="text-sm text-slate-500">Perfect Scores</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-600">
              {userProgress.find((l) => l.is_unlocked && !l.is_completed)?.level_number || levels.length}
            </div>
            <div className="text-sm text-slate-500">Current Level</div>
          </div>
        </div>
      </div>
    </div>
  );
}
