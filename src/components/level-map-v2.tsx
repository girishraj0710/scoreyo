"use client";

import { LevelDefinition } from "@/lib/level-definitions";
import { Lock, Star, Crown, Play, RotateCcw, Check, Trophy, Zap } from "lucide-react";

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

export function LevelMapV2({ levels, userProgress, onLevelClick, currentLevel }: LevelMapProps) {
  const getUserLevelData = (levelNumber: number): UserLevel | undefined => {
    return userProgress.find((l) => l.level_number === levelNumber);
  };

  const getLevelState = (level: LevelDefinition): "locked" | "unlocked" | "completed" => {
    const userData = getUserLevelData(level.levelNumber);
    if (!userData || !userData.is_unlocked) return "locked";
    if (userData.is_completed) return "completed";
    return "unlocked";
  };

  const renderStars = (stars: number) => {
    return (
      <div className="flex gap-0.5 justify-center">
        {[1, 2, 3].map((s) => (
          <Star
            key={s}
            className={`w-3 h-3 ${
              s <= stars ? "fill-amber-400 text-amber-500" : "fill-slate-200 text-slate-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Group levels by rows (5 levels per row, alternating direction)
  const rows: LevelDefinition[][] = [];
  for (let i = 0; i < levels.length; i += 5) {
    rows.push(levels.slice(i, i + 5));
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8 bg-gradient-to-r from-[#4255FF] via-violet-500 to-purple-500 rounded-2xl p-6 shadow-xl text-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="w-5 h-5" />
              <span className="text-2xl font-bold">
                {userProgress.filter((l) => l.is_completed).length}/30
              </span>
            </div>
            <div className="text-sm opacity-90">Levels Completed</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
              <span className="text-2xl font-bold">
                {userProgress.reduce((sum, l) => sum + l.stars_earned, 0)}/90
              </span>
            </div>
            <div className="text-sm opacity-90">Stars Earned</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-5 h-5" />
              <span className="text-2xl font-bold">
                {userProgress.filter((l) => l.stars_earned === 3).length}
              </span>
            </div>
            <div className="text-sm opacity-90">Perfect Scores</div>
          </div>
        </div>
      </div>

      {/* Level Grid with Winding Path */}
      <div className="space-y-6">
        {rows.map((row, rowIndex) => {
          const isReversed = rowIndex % 2 === 1;
          const rowLevels = isReversed ? [...row].reverse() : row;

          return (
            <div key={rowIndex} className="relative">
              {/* Connecting Line */}
              {rowIndex < rows.length - 1 && (
                <div className={`absolute top-full left-1/2 w-1 h-6 bg-gradient-to-b from-indigo-200 to-transparent ${isReversed ? 'translate-x-[200%]' : '-translate-x-[200%]'}`} />
              )}

              <div className={`flex ${isReversed ? 'flex-row-reverse' : 'flex-row'} justify-center gap-4`}>
                {rowLevels.map((level, indexInRow) => {
                  const actualIndex = isReversed ? row.length - 1 - indexInRow : indexInRow;
                  const state = getLevelState(level);
                  const userData = getUserLevelData(level.levelNumber);
                  const isBoss = level.levelType === "boss";
                  const isCurrentLevel = level.levelNumber === currentLevel;

                  return (
                    <div key={level.levelNumber} className="relative flex flex-col items-center">
                      {/* Connecting Line to Next Level */}
                      {actualIndex < row.length - 1 && (
                        <div className={`absolute top-1/2 ${isReversed ? 'right-full' : 'left-full'} w-4 h-1 bg-[#90CAF9] -translate-y-1/2`} />
                      )}

                      {/* Level Node */}
                      <button
                        onClick={() => state !== "locked" && onLevelClick(level)}
                        disabled={state === "locked"}
                        className={`
                          relative group
                          ${isBoss ? 'w-20 h-20' : 'w-16 h-16'}
                          rounded-2xl shadow-lg transition-all duration-300
                          ${isCurrentLevel ? 'ring-4 ring-indigo-400 ring-offset-2 scale-110' : ''}
                          ${state === "locked"
                            ? 'bg-slate-300 cursor-not-allowed'
                            : state === "completed"
                              ? isBoss
                                ? 'bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 hover:scale-110 cursor-pointer'
                                : 'bg-gradient-to-br from-emerald-400 to-cyan-400 hover:scale-110 cursor-pointer'
                              : isBoss
                                ? 'bg-gradient-to-br from-violet-500 to-purple-500 hover:scale-110 animate-pulse cursor-pointer'
                                : 'bg-gradient-to-br from-[#4255FF] to-blue-500 hover:scale-110 animate-pulse cursor-pointer'
                          }
                        `}
                      >
                        {/* Level Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                          {/* Icon */}
                          {state === "locked" && <Lock className="w-6 h-6 text-slate-500 mb-1" />}
                          {state === "unlocked" && !isBoss && <Play className="w-6 h-6 text-white mb-1" />}
                          {state === "unlocked" && isBoss && <Crown className="w-7 h-7 text-white mb-1" />}
                          {state === "completed" && <Check className="w-6 h-6 text-white mb-1" />}

                          {/* Level Number */}
                          <div className={`text-xs font-bold ${state === "locked" ? "text-slate-500" : "text-white"}`}>
                            {level.levelNumber}
                          </div>

                          {/* Stars for completed */}
                          {state === "completed" && userData && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                              {renderStars(userData.stars_earned)}
                            </div>
                          )}

                          {/* Badge for boss levels */}
                          {isBoss && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                              <Crown className="w-3 h-3 text-amber-900" />
                            </div>
                          )}
                        </div>

                        {/* Tooltip on Hover */}
                        {state !== "locked" && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                              <div className="font-semibold mb-1">{level.levelName}</div>
                              <div className="text-slate-300">{level.questionCount} questions</div>
                              {userData && userData.best_accuracy > 0 && (
                                <div className="text-amber-300 mt-1">Best: {userData.best_accuracy}%</div>
                              )}
                              {/* Arrow */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                            </div>
                          </div>
                        )}
                      </button>

                      {/* Level Name Below (for mobile) */}
                      <div className="mt-2 text-center md:hidden">
                        <div className="text-xs font-medium text-slate-700 max-w-[80px] truncate">
                          Level {level.levelNumber}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievement Milestones */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border-2 text-center ${
          userProgress.filter(l => l.is_completed).length >= 10
            ? 'bg-emerald-50 border-emerald-300'
            : 'bg-[var(--primary-bg)] border-[var(--card-border)]'
        }`}>
          <div className="text-2xl mb-1">🏅</div>
          <div className="font-semibold text-sm text-slate-700">Beginner</div>
          <div className="text-xs text-slate-500">Complete 10 levels</div>
        </div>

        <div className={`p-4 rounded-xl border-2 text-center ${
          userProgress.filter(l => l.is_completed).length >= 20
            ? 'bg-violet-50 border-violet-300'
            : 'bg-[var(--primary-bg)] border-[var(--card-border)]'
        }`}>
          <div className="text-2xl mb-1">🏆</div>
          <div className="font-semibold text-sm text-slate-700">Expert</div>
          <div className="text-xs text-slate-500">Complete 20 levels</div>
        </div>

        <div className={`p-4 rounded-xl border-2 text-center ${
          userProgress.filter(l => l.is_completed).length >= 30
            ? 'bg-amber-50 border-amber-300'
            : 'bg-[var(--primary-bg)] border-[var(--card-border)]'
        }`}>
          <div className="text-2xl mb-1">👑</div>
          <div className="font-semibold text-sm text-slate-700">Master</div>
          <div className="text-xs text-slate-500">Complete all 30 levels</div>
        </div>
      </div>
    </div>
  );
}
