"use client";

import { useEffect, useState } from "react";
import { StarRating } from "./star-rating";
import { Trophy, TrendingUp, Clock, Target, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface LevelCompleteModalProps {
  isOpen: boolean;
  levelNumber: number;
  levelName: string;
  stars: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken?: number;
  isBossLevel?: boolean;
  isNewLevel?: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onClose: () => void;
}

export function LevelCompleteModal({
  isOpen,
  levelNumber,
  levelName,
  stars,
  accuracy,
  correctAnswers,
  totalQuestions,
  timeTaken,
  isBossLevel = false,
  isNewLevel = false,
  onNextLevel,
  onReplay,
  onClose,
}: LevelCompleteModalProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50;

        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.9),
            y: Math.random() - 0.2,
          },
          colors: stars === 3 ? ["#fbbf24", "#f59e0b", "#f97316"] : ["#6366f1", "#8b5cf6", "#06b6d4"],
        });
      }, 250);

      // Show content after brief delay
      setTimeout(() => setShowContent(true), 300);

      return () => {
        clearInterval(interval);
        setShowContent(false);
      };
    }
  }, [isOpen, stars]);

  if (!isOpen) return null;

  const getMessage = () => {
    if (stars === 3) return "Perfect! 🎉";
    if (stars === 2) return "Great Job! 👏";
    if (stars === 1) return "Good Start! 💪";
    return "Keep Practicing! 📚";
  };

  const getColor = () => {
    if (stars === 3) return "from-amber-500 to-orange-500";
    if (stars === 2) return "from-emerald-500 to-cyan-500";
    return "from-[#4F9CF9] to-violet-500";
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-3xl shadow-2xl max-w-lg w-full transform transition-all duration-500 ${
          showContent ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${getColor()} p-8 rounded-t-3xl text-white text-center`}>
          {isBossLevel && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold text-sm">Boss Level</span>
            </div>
          )}

          <h2 className="text-3xl font-bold mb-2">{getMessage()}</h2>
          <p className="text-white/90 mb-4">Level {levelNumber} Complete</p>

          {/* Star Rating */}
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
              <StarRating stars={stars} animated size="lg" />
            </div>
          </div>

          <p className="text-sm text-white/80">{levelName}</p>
        </div>

        {/* Stats Grid */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <Target className="w-6 h-6 text-[#00A1E0] mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{accuracy}%</div>
              <div className="text-xs text-slate-500">Accuracy</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">
                {correctAnswers}/{totalQuestions}
              </div>
              <div className="text-xs text-slate-500">Correct Answers</div>
            </div>

            {timeTaken && (
              <div className="bg-slate-50 rounded-xl p-4 text-center col-span-2">
                <Clock className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{formatTime(timeTaken)}</div>
                <div className="text-xs text-slate-500">Time Taken</div>
              </div>
            )}
          </div>

          {/* Unlock Message */}
          {isNewLevel && stars >= 1 && (
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border-2 border-[#90CAF9] rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00A1E0] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-[#005A7A]">Level Unlocked!</div>
                <div className="text-sm text-[#3B7FD9]">You can now access Level {levelNumber + 1}</div>
              </div>
            </div>
          )}

          {/* Failed to Unlock Message */}
          {!isNewLevel && stars === 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
              <p className="text-sm text-red-800 mb-1">
                <strong>Next level locked!</strong>
              </p>
              <p className="text-xs text-red-700">
                {isBossLevel
                  ? "Score 70%+ on boss levels to unlock the next level"
                  : "Score 60%+ to unlock the next level"}
              </p>
            </div>
          )}

          {/* Improvement Message */}
          {stars < 3 && stars >= 1 && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-center">
              <p className="text-sm text-amber-800">
                💡 <strong>Tip:</strong> Replay this level to earn 3 stars and improve your mastery!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {stars < 3 && (
              <button
                onClick={onReplay}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Replay
              </button>
            )}

            {stars >= 1 ? (
              <button
                onClick={onNextLevel}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#00A1E0] text-white rounded-xl font-semibold shadow-lg transition-all"
              >
                Next Level
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-semibold transition-all"
              >
                Close
              </button>
            )}
          </div>

          {stars >= 1 && (
            <button
              onClick={onClose}
              className="w-full text-sm text-slate-500 hover:text-slate-700 py-2"
            >
              Back to Level Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
