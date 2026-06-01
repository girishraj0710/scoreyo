"use client";

import { useEffect, useState } from "react";
import { X, Award, Star } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface BadgeUnlockModalProps {
  badges: Badge[];
  onClose: () => void;
}

const RARITY_STYLES = {
  common: "from-slate-500 to-slate-600",
  rare: "from-blue-500 to-blue-600",
  epic: "from-purple-500 to-purple-600",
  legendary: "from-amber-500 to-amber-600",
};

const RARITY_GLOW = {
  common: "shadow-slate-400/50",
  rare: "shadow-blue-400/50",
  epic: "shadow-purple-400/50",
  legendary: "shadow-amber-400/50",
};

export function BadgeUnlockModal({ badges, onClose }: BadgeUnlockModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const currentBadge = badges[currentIndex];

  useEffect(() => {
    // Play unlock sound
    sounds.badgeUnlock();

    // Auto-advance to next badge after 3 seconds
    if (currentIndex < badges.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, badges.length]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleNext = () => {
    if (currentIndex < badges.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleClose();
    }
  };

  if (!currentBadge) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-md transform transition-all duration-500 ${
          isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -right-2 -top-2 z-10 rounded-full bg-slate-800 p-2 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Main card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          {/* Header with animated stars */}
          <div className="relative bg-gradient-to-r from-[#00A1E0] to-purple-600 p-6 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <Star
                  key={i}
                  className="absolute animate-pulse"
                  style={{
                    width: Math.random() * 20 + 10,
                    height: Math.random() * 20 + 10,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
            <div className="relative text-center">
              <Award className="w-8 h-8 text-white mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-white">Badge Unlocked!</h2>
              <p className="text-indigo-100 text-sm mt-1">
                {currentIndex + 1} of {badges.length}
              </p>
            </div>
          </div>

          {/* Badge display */}
          <div className="p-8 text-center">
            {/* Badge icon with glow */}
            <div
              className={`inline-block p-6 rounded-full bg-gradient-to-br ${
                RARITY_STYLES[currentBadge.rarity]
              } shadow-2xl ${RARITY_GLOW[currentBadge.rarity]} animate-pulse`}
            >
              <span className="text-6xl" role="img" aria-label={currentBadge.name}>
                {currentBadge.icon}
              </span>
            </div>

            {/* Badge details */}
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-white mb-2">{currentBadge.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{currentBadge.description}</p>

              {/* Rarity badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700">
                <div
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                    RARITY_STYLES[currentBadge.rarity]
                  }`}
                />
                <span className="text-xs font-semibold text-slate-300 uppercase">
                  {currentBadge.rarity}
                </span>
              </div>
            </div>
          </div>

          {/* Footer with progress */}
          <div className="px-8 pb-6">
            {/* Progress dots */}
            {badges.length > 1 && (
              <div className="flex justify-center gap-2 mb-4">
                {badges.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-[#4F9CF9]"
                        : index < currentIndex
                        ? "w-2 bg-indigo-400"
                        : "w-2 bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Action button */}
            <button
              onClick={handleNext}
              className="w-full py-3 bg-gradient-to-r from-[#00A1E0] to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              {currentIndex < badges.length - 1 ? "Next Badge" : "Awesome!"}
            </button>
          </div>
        </div>

        {/* Confetti effect (optional - simple version) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                backgroundColor: ["#f59e0b", "#8b5cf6", "#3b82f6", "#10b981"][i % 4],
                left: `${Math.random() * 100}%`,
                top: "-10px",
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
}
