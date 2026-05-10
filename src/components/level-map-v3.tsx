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
      <div className="flex gap-0.5 absolute -bottom-1 left-1/2 -translate-x-1/2">
        {[1, 2, 3].map((s) => (
          <Star
            key={s}
            className={`w-3 h-3 ${
              state === "completed" && s <= stars
                ? "fill-white text-white drop-shadow-lg"
                : "fill-slate-400 text-slate-500"
            }`}
          />
        ))}
      </div>
    );
  };

  const totalStars = userProgress.reduce((sum, l) => sum + l.stars_earned, 0);
  const completedLevels = userProgress.filter((l) => l.is_completed).length;

  return (
    <div className="bg-[#F4F7F8] py-4 px-4">
      <div className="max-w-5xl mx-auto w-full pb-8">
        {/* Top Section - Stats */}
        <div className="mb-2 bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00C4CC] to-[#7D2AE8] flex items-center justify-center shadow-lg">
                  <Star className="w-4 h-4 fill-white text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#00C4CC] to-[#7D2AE8] bg-clip-text text-transparent">{totalStars}</span>
                <span className="text-slate-500 text-sm">/90</span>
              </div>
              <div className="text-xs text-[#0E1318]">Stars Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#3969E7] mb-2">{completedLevels}/30</div>
              <div className="text-xs text-[#0E1318]">Levels Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#7D2AE8] mb-2">
                {userProgress.filter((l) => l.stars_earned === 3).length}
              </div>
              <div className="text-xs text-[#0E1318]">Perfect Scores</div>
            </div>
          </div>
        </div>

        {/* Title Section with Legend */}
        <div className="mb-6">
          <div className="text-center mb-1.5">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00C4CC] via-[#7D2AE8] to-[#3969E7] tracking-wider">
              LEVEL SELECTION
            </h1>
          </div>

          {/* Legend - Achievement Info */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white border border-slate-200">
              <div className="text-sm">🏅</div>
              <span className="text-xs text-[#0E1318]">Beginner (10)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white border border-slate-200">
              <div className="text-sm">🏆</div>
              <span className="text-xs text-[#0E1318]">Expert (20)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white border border-slate-200">
              <div className="text-sm">👑</div>
              <span className="text-xs text-[#0E1318]">Master (30)</span>
            </div>
          </div>
        </div>

        {/* Level Grid - 5 columns x 3 rows = 15 levels */}
        <div className="grid grid-cols-5 gap-4 mb-6 w-full max-w-xl mx-auto px-2">
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
                    ${isBoss ? 'ring-4 ring-[#7D2AE8]/50' : ''}
                    ${state === "locked"
                      ? 'bg-slate-200 border-4 border-slate-300 cursor-not-allowed'
                      : state === "completed"
                        ? 'bg-gradient-to-r from-[#00C4CC] to-[#7D2AE8] border-4 border-[#00C4CC] shadow-lg shadow-[#00C4CC]/30 hover:scale-110 cursor-pointer'
                        : 'bg-gradient-to-r from-[#3969E7] to-[#7D2AE8] border-4 border-[#3969E7] shadow-lg shadow-[#3969E7]/30 hover:scale-110 animate-pulse cursor-pointer'
                    }
                  `}
                >
                  {/* Boss Crown Badge */}
                  {isBoss && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#00C4CC] to-[#7D2AE8] rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                      <Crown className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}

                  {/* Level Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {state === "locked" ? (
                      <Lock className="w-4 h-4 text-slate-400" />
                    ) : (
                      <span className="text-lg font-bold text-white drop-shadow-lg">
                        {level.levelNumber}
                      </span>
                    )}
                  </div>

                  {/* Stars */}
                  {renderStars(userData?.stars_earned || 0, state)}
                </button>
              </div>
            );
          })}
        </div>

        {/* Page Text Indicator - Above Navigation */}
        <div className="text-center mb-1.5">
          <span className="text-sm text-[#0E1318] font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>
        </div>

        {/* Bottom Section - Navigation Only */}
        <div className="bg-white rounded-2xl p-2.5 border border-slate-200 mb-4 shadow-sm">
          <div className="flex items-center justify-center gap-4">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`
                flex items-center gap-1 px-4 py-2 rounded-lg font-bold text-sm transition-all
                ${currentPage === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#3969E7] to-[#7D2AE8] text-white hover:scale-105 shadow-lg'
                }
              `}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">BACK</span>
            </button>

            {/* Page Dots Indicator */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`
                    w-2 h-2 rounded-full transition-all
                    ${currentPage === index
                      ? 'w-6 bg-gradient-to-r from-[#00C4CC] to-[#7D2AE8]'
                      : 'bg-slate-300 hover:bg-slate-400'
                    }
                  `}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className={`
                flex items-center gap-1 px-4 py-2 rounded-lg font-bold text-sm transition-all
                ${currentPage === totalPages - 1
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#00C4CC] to-[#7D2AE8] text-white hover:scale-105 shadow-lg'
                }
              `}
            >
              <span className="hidden sm:inline">NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
