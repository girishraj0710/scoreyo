"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, RotateCw } from "lucide-react";

interface FlashcardFlipProps {
  front: string;
  back: string;
  hint?: string;
  difficulty?: string;
  onFlip?: (isFlipped: boolean) => void;
}

export function FlashcardFlip({
  front,
  back,
  hint,
  difficulty,
  onFlip,
}: FlashcardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.(!isFlipped);
  };

  const difficultyColors = {
    easy: "#2A9D8F",
    medium: "#E9C46A",
    hard: "#E76F51",
  };

  const difficultyColor = difficultyColors[difficulty as keyof typeof difficultyColors] || "#E9C46A";

  return (
    <div className="perspective-1000 w-full">
      <motion.div
        className="relative w-full h-[400px] cursor-pointer"
        onClick={handleFlip}
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl shadow-2xl backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="h-full rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 flex flex-col">
            {/* Difficulty badge */}
            {difficulty && (
              <div className="flex justify-between items-center mb-4">
                <span
                  className="text-xs font-bold uppercase px-3 py-1 rounded-full"
                  style={{
                    letterSpacing: '0.2em',
                    backgroundColor: `${difficultyColor}20`,
                    color: difficultyColor,
                  }}
                >
                  {difficulty}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                  TAP TO FLIP
                </span>
              </div>
            )}

            {/* Question */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#16213E] dark:text-white leading-relaxed mb-6">
                {front}
              </div>

              {/* Hint button */}
              {hint && !showHint && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHint(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E9C46A]/10 text-[#E9C46A] hover:bg-[#E9C46A]/20 transition-colors text-sm font-semibold"
                >
                  <Lightbulb className="w-4 h-4" />
                  Show hint
                </button>
              )}

              {/* Hint display */}
              {hint && showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 rounded-xl bg-[#E9C46A]/10 border border-[#E9C46A]/30 text-sm text-[#E9C46A] font-medium"
                >
                  💡 {hint}
                </motion.div>
              )}
            </div>

            {/* Flip icon */}
            <div className="flex justify-center mt-4">
              <RotateCw className="w-6 h-6 text-slate-300 dark:text-slate-700" />
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl shadow-2xl backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="h-full rounded-3xl bg-gradient-to-br from-[#E76F51] to-[#D65A3D] p-8 flex flex-col text-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase text-white/70" style={{ letterSpacing: '0.2em' }}>
                ANSWER
              </span>
              <span className="text-xs text-white/70 font-semibold">
                TAP TO FLIP BACK
              </span>
            </div>

            {/* Answer */}
            <div className="flex-1 flex items-center justify-center text-center">
              <div className="text-lg md:text-xl leading-relaxed font-medium">
                {back}
              </div>
            </div>

            {/* Flip icon */}
            <div className="flex justify-center mt-4">
              <RotateCw className="w-6 h-6 text-white/50" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
