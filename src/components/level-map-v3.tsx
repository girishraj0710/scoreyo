"use client";

import { useState } from "react";
import { LevelDefinition } from "@/lib/level-definitions";
import { Lock, Star, Crown, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

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
  examId?: string;
  subjectId?: string;
}

export function LevelMapV3({ levels, userProgress, onLevelClick, currentLevel, examId, subjectId }: LevelMapProps) {
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
                ? "fill-yellow-300 text-yellow-400 drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
                : "fill-slate-300 text-slate-400"
            }`}
          />
        ))}
      </div>
    );
  };

  const totalStars = userProgress.reduce((sum, l) => sum + l.stars_earned, 0);
  const completedLevels = userProgress.filter((l) => l.is_completed).length;

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 py-8 px-4">
      <div className="max-w-5xl mx-auto w-full pb-4">
        {/* Navigation Buttons Row */}
        <div className="flex items-center justify-between mb-3">
          {/* Back Button */}
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 font-semibold shadow-md transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </a>

          {/* Random Quiz Button */}
          <a
            href={`/?examId=${examId}&subjectId=${subjectId}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 font-semibold shadow-md transition-all text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="hidden sm:inline">Random Quiz</span>
          </a>
        </div>

        {/* Top Section - Stats */}
        <div className="mb-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-lg shadow-black/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Star className="w-4 h-4 fill-white text-white" />
                </div>
                <span className="text-2xl font-bold text-[#DAB661]">{totalStars}</span>
                <span className="text-white/70 text-sm">/90</span>
              </div>
              <div className="text-xs text-white font-semibold">Stars Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#DAB661] mb-2">{completedLevels}/30</div>
              <div className="text-xs text-white font-semibold">Levels Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#DAB661] mb-2">
                {userProgress.filter((l) => l.stars_earned === 3).length}
              </div>
              <div className="text-xs text-white font-semibold">Perfect Scores</div>
            </div>
          </div>
        </div>

        {/* Title Section with Legend */}
        <div className="mb-4">
          <div className="text-center mb-2">
            <h1 className="text-3xl font-bold text-[#DAB661] tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              SELECT LEVEL
            </h1>
          </div>

          {/* Legend - Achievement Info */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-sm">🏅</div>
              <span className="text-xs text-white font-semibold">Beginner (10)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-sm">🏆</div>
              <span className="text-xs text-white font-semibold">Expert (20)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-sm">👑</div>
              <span className="text-xs text-white font-semibold">Master (30)</span>
            </div>
          </div>
        </div>

        {/* Level Grid - 5 columns x 3 rows = 15 levels */}
        <div className="grid grid-cols-5 gap-4 mb-4 w-full max-w-xl mx-auto px-2">
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
                    ${isBoss ? 'ring-4 ring-[#00E5E5]/50' : ''}
                    ${state === "locked"
                      ? 'bg-slate-800/50 border-4 border-slate-700/50 cursor-not-allowed'
                      : state === "completed"
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-4 border-cyan-400 hover:scale-110 cursor-pointer animate-glow'
                        : 'bg-gradient-to-br from-[#4F9CF9] to-purple-600 border-4 border-indigo-400 hover:scale-110 cursor-pointer animate-glow'
                    }
                  `}
                >
                  {/* Boss Crown Badge */}
                  {isBoss && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                      <Crown className="w-3 h-3 text-amber-900" />
                    </div>
                  )}

                  {/* Level Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {state === "locked" ? (
                      <Lock className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                    ) : (
                      <span className="text-xl font-bold text-white drop-shadow-lg">
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
        <div className="text-center mb-2">
          <span className="text-sm text-[#C9A961] font-semibold">
            Page {currentPage + 1} of {totalPages}
          </span>
        </div>

        {/* Bottom Section - Navigation Only */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/20 mb-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-center gap-4">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`
                flex items-center gap-1 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
                ${currentPage === 0
                  ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-700 hover:to-cyan-700 shadow-lg shadow-emerald-500/50 hover:shadow-xl'
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
                    w-2.5 h-2.5 rounded-full transition-all
                    ${currentPage === index
                      ? 'w-8 bg-gradient-to-r from-cyan-400 to-blue-500'
                      : 'bg-white/30 hover:bg-white/50'
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
                flex items-center gap-1 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
                ${currentPage === totalPages - 1
                  ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-700 hover:to-cyan-700 shadow-lg shadow-emerald-500/50 hover:shadow-xl'
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
