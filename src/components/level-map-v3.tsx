"use client";

import { useState } from "react";
import { LevelDefinition } from "@/lib/level-definitions";
import { Lock, Star, Crown, ChevronLeft, ChevronRight } from "lucide-react";

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

export function LevelMapV3({ levels, userProgress, onLevelClick, currentLevel }: LevelMapProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const levelsPerPage = 15;
  const totalPages = Math.ceil(levels.length / levelsPerPage);

  const startIndex = currentPage * levelsPerPage;
  const endIndex = startIndex + levelsPerPage;
  const currentLevels = levels.slice(startIndex, endIndex);

  const getUserLevelData = (levelNumber: number): UserLevel | undefined => {
    return userProgress.find((l) => l.level_number === levelNumber);
  };

  const getLevelState = (level: LevelDefinition): "locked" | "unlocked" | "completed" => {
    const userData = getUserLevelData(level.levelNumber);
    if (!userData || !userData.is_unlocked) return "locked";
    if (userData.is_completed) return "completed";
    return "unlocked";
  };

  const renderStars = (stars: number, state: string) => {
    return (
      <div className="flex gap-0.5 absolute -bottom-2 left-1/2 -translate-x-1/2">
        {[1, 2, 3].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${
              state === "completed" && s <= stars
                ? "fill-amber-400 text-amber-500 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]"
                : "fill-slate-600 text-slate-700"
            }`}
          />
        ))}
      </div>
    );
  };

  const totalStars = userProgress.reduce((sum, l) => sum + l.stars_earned, 0);
  const completedLevels = userProgress.filter((l) => l.is_completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* Coin/Stars Display */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-amber-500/30">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 fill-amber-200 text-amber-200" />
              </div>
              <span className="text-2xl font-bold text-amber-400">{totalStars}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-indigo-500/30">
              <span className="text-sm text-slate-300">Progress:</span>
              <span className="text-lg font-bold text-indigo-400">{completedLevels}/30</span>
            </div>
          </div>

          {/* Page Indicator */}
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">Page</div>
            <div className="text-2xl font-bold text-white">
              {currentPage + 1} / {totalPages}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 tracking-wider drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
            LEVEL SELECTION
          </h1>
        </div>

        {/* Level Grid - 5 columns x 3 rows = 15 levels */}
        <div className="grid grid-cols-5 gap-x-6 gap-y-10 mb-12 max-w-4xl mx-auto">
          {currentLevels.map((level) => {
            const state = getLevelState(level);
            const userData = getUserLevelData(level.levelNumber);
            const isBoss = level.levelType === "boss";

            return (
              <div key={level.levelNumber} className="flex flex-col items-center">
                {/* Level Button */}
                <button
                  onClick={() => state !== "locked" && onLevelClick(level)}
                  disabled={state === "locked"}
                  className={`
                    relative w-full aspect-square rounded-2xl transition-all duration-300
                    ${isBoss ? 'ring-4 ring-amber-500/50' : ''}
                    ${state === "locked"
                      ? 'bg-slate-800 border-4 border-slate-700 cursor-not-allowed'
                      : state === "completed"
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-4 border-cyan-400 shadow-lg shadow-cyan-500/50 hover:scale-110 cursor-pointer'
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-indigo-400 shadow-lg shadow-indigo-500/50 hover:scale-110 animate-pulse cursor-pointer'
                    }
                  `}
                >
                  {/* Boss Crown Badge */}
                  {isBoss && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-600 z-10">
                      <Crown className="w-4 h-4 text-amber-900" />
                    </div>
                  )}

                  {/* Level Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {state === "locked" ? (
                      <Lock className="w-8 h-8 text-slate-600" />
                    ) : (
                      <span className="text-3xl font-bold text-white drop-shadow-lg">
                        {level.levelNumber}
                      </span>
                    )}
                  </div>

                  {/* Stars */}
                  {renderStars(userData?.stars_earned || 0, state)}
                </button>

                {/* Level Name (optional, on hover or always visible) */}
                {state !== "locked" && (
                  <div className="mt-6 text-center">
                    <div className="text-xs text-slate-400 max-w-[80px] truncate">
                      {isBoss ? '👑 Boss' : `Lv ${level.levelNumber}`}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-8 mt-8">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className={`
              flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all
              ${currentPage === 0
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:scale-105 shadow-lg hover:shadow-indigo-500/50'
              }
            `}
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="hidden sm:inline">BACK</span>
          </button>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className={`
              flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all
              ${currentPage === totalPages - 1
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:scale-105 shadow-lg hover:shadow-emerald-500/50'
              }
            `}
          >
            <span className="hidden sm:inline">NEXT</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Page Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`
                w-2 h-2 rounded-full transition-all
                ${currentPage === index
                  ? 'w-8 bg-indigo-500'
                  : 'bg-slate-700 hover:bg-slate-600'
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
