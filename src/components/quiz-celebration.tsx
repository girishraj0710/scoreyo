"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

interface QuizCelebrationProps {
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  isNewRecord?: boolean;
}

export function QuizCelebration({
  accuracy,
  correctAnswers,
  totalQuestions,
  isNewRecord = false
}: QuizCelebrationProps) {

  useEffect(() => {
    // Trigger confetti based on performance
    const triggerConfetti = () => {
      if (accuracy === 100) {
        // Perfect score - epic celebration!
        const duration = 3000;
        const animationEnd = Date.now() + duration;

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            clearInterval(interval);
            return;
          }

          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#10b981', '#34d399', '#6ee7b7']
          });

          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#10b981', '#34d399', '#6ee7b7']
          });
        }, 250);

      } else if (accuracy >= 90) {
        // Excellent performance
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#8b5cf6', '#a855f7']
        });

      } else if (accuracy >= 75) {
        // Good performance
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#3b82f6', '#60a5fa', '#93c5fd']
        });
      }

      // Extra confetti for new record
      if (isNewRecord) {
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 180,
            origin: { y: 0.5 },
            colors: ['#f59e0b', '#fbbf24', '#fcd34d'],
            shapes: ['star']
          });
        }, 500);
      }
    };

    triggerConfetti();
  }, [accuracy, isNewRecord]);

  const getGrade = () => {
    if (accuracy === 100) return { label: "Perfect!", emoji: "🏆", color: "text-yellow-500" };
    if (accuracy >= 90) return { label: "Excellent!", emoji: "🌟", color: "text-purple-600" };
    if (accuracy >= 75) return { label: "Great Job!", emoji: "🎉", color: "text-[#4255FF]" };
    if (accuracy >= 60) return { label: "Good!", emoji: "👍", color: "text-green-600" };
    if (accuracy >= 50) return { label: "Keep Practicing!", emoji: "💪", color: "text-orange-600" };
    return { label: "Needs Work", emoji: "📚", color: "text-red-600" };
  };

  const grade = getGrade();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2
      }}
      className="text-center mb-8"
    >
      {/* Emoji Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 10,
          delay: 0.3
        }}
        className="text-6xl mb-4"
      >
        {grade.emoji}
      </motion.div>

      {/* Grade Label */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`text-3xl font-bold ${grade.color} mb-2`}
      >
        {grade.label}
      </motion.h2>

      {/* Score Display */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.5
        }}
        className="text-7xl font-bold text-slate-800 mb-2"
      >
        {accuracy}%
      </motion.div>

      {/* Details */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-slate-600"
      >
        {correctAnswers} out of {totalQuestions} correct
      </motion.p>

      {/* New Record Badge */}
      {isNewRecord && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 15,
            delay: 0.8
          }}
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold shadow-lg"
        >
          <span className="text-lg">🏆</span>
          <span>New Personal Record!</span>
        </motion.div>
      )}
    </motion.div>
  );
}
