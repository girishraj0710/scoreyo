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
                ? "fill-white text-white"
                : "fill-[#1A1A1A]/20 text-[#1A1A1A]/20"
            }`}
          />
        ))}
      </div>
    );
  };

  const totalStars = userProgress.reduce((sum, l) => sum + l.stars_earned, 0);
  const completedLevels = userProgress.filter((l) => l.is_completed).length;

  return (
    <div className="bg-[#F5F5F0] py-4 px-4">
      <div className="max-w-5xl mx-auto w-full pb-8">
        {/* Top Section - Stats */}
        <div className="mb-2 bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center shadow-md">
                  <Star className="w-4 h-4 fill-white text-white" />
                </div>
                <span className="text-2xl font-bold text-[#4F46E5]">{totalStars}</span>
                <span className="text-[#1A1A1A]/60 text-sm">/90</span>
              </div>
              <div className="text-xs text-[#1A1A1A]/80 font-medium">Stars Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1A1A1A] mb-2">{completedLevels}/30</div>
              <div className="text-xs text-[#1A1A1A]/80 font-medium">Levels Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#4F46E5] mb-2">
                {userProgress.filter((l) => l.stars_earned === 3).length}
              </div>
              <div className="text-xs text-[#1A1A1A]/80 font-medium">Perfect Scores</div>
            </div>
          </div>
        </div>

        {/* Title Section with Legend */}
        <div className="mb-6">
          <div className="text-center mb-1.5">
            <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-wide">
              LEVEL SELECTION
            </h1>
          </div>

          {/* Legend - Achievement Info */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#1A1A1A]/10">
              <div className="text-sm">🏅</div>
              <span className="text-xs text-[#1A1A1A]/80 font-medium">Beginner (10)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#1A1A1A]/10">
              <div className="text-sm">🏆</div>
              <span className="text-xs text-[#1A1A1A]/80 font-medium">Expert (20)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#1A1A1A]/10">
              <div className="text-sm">👑</div>
              <span className="text-xs text-[#1A1A1A]/80 font-medium">Master (30)</span>
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
                    relative w-full aspect-square rounded-lg transition-all duration-300
                    ${isBoss ? 'ring-4 ring-[#4F46E5]/30' : ''}
                    ${state === "locked"
                      ? 'bg-[#1A1A1A]/5 border-2 border-[#1A1A1A]/10 cursor-not-allowed'
                      : state === "completed"
                        ? 'bg-[#4F46E5] border-2 border-[#4F46E5] shadow-lg shadow-[#4F46E5]/20 hover:scale-105 cursor-pointer'
                        : 'bg-[#4F46E5]/80 border-2 border-[#4F46E5] shadow-md hover:scale-105 hover:bg-[#4F46E5] animate-pulse cursor-pointer'
                    }
                  `}
                >
                  {/* Boss Crown Badge */}
                  {isBoss && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#4F46E5] rounded-md flex items-center justify-center shadow-md border-2 border-white z-10">
                      <Crown className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}

                  {/* Level Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {state === "locked" ? (
                      <Lock className="w-4 h-4 text-[#1A1A1A]/30" />
                    ) : (
                      <span className="text-lg font-bold text-white">
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
          <span className="text-sm text-[#1A1A1A]/70 font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>
        </div>

        {/* Bottom Section - Navigation Only */}
        <div className="bg-white rounded-lg p-2.5 border border-[#1A1A1A]/10 mb-4 shadow-sm">
          <div className="flex items-center justify-center gap-4">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`
                flex items-center gap-1 px-4 py-2 rounded-md font-semibold text-sm transition-all
                ${currentPage === 0
                  ? 'bg-[#1A1A1A]/5 text-[#1A1A1A]/30 cursor-not-allowed'
                  : 'bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-md'
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
                      ? 'w-6 bg-[#4F46E5]'
                      : 'bg-[#1A1A1A]/20 hover:bg-[#1A1A1A]/30'
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
                flex items-center gap-1 px-4 py-2 rounded-md font-semibold text-sm transition-all
                ${currentPage === totalPages - 1
                  ? 'bg-[#1A1A1A]/5 text-[#1A1A1A]/30 cursor-not-allowed'
                  : 'bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-md'
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
