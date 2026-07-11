"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/context/user-context";
import { FlashcardFlip } from "@/components/flashcards/FlashcardFlip";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  X,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Minus,
  ThumbsUp,
} from "lucide-react";

interface Card {
  id: number;
  front: string;
  back: string;
  hint?: string;
  difficulty?: string;
  times_reviewed?: number;
  times_correct?: number;
}

export default function FlashcardStudyPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: userLoading } = useUser();
  const deckId = params.deckId as string;

  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deckTitle, setDeckTitle] = useState("");
  const [studiedCount, setStudiedCount] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Track ratings for summary
  const [ratingStats, setRatingStats] = useState({
    again: 0,    // Red - <1min
    hard: 0,     // Orange - 1day
    good: 0,     // Green - 3days
    easy: 0      // Blue - 7days
  });

  // Fetch deck and cards
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/");
      return;
    }

    if (user && deckId) {
      fetchDeck();
    }
  }, [user, userLoading, deckId]);

  const fetchDeck = async () => {
    try {
      const response = await fetch(`/api/flashcards/decks/${deckId}`);
      if (!response.ok) throw new Error("Failed to fetch deck");

      const data = await response.json();
      setCards(data.deck.cards);
      setDeckTitle(data.deck.title);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching deck:", error);
      router.push("/flashcards");
    }
  };

  const handleRating = async (rating: "again" | "hard" | "good" | "easy") => {
    const currentCard = cards[currentIndex];

    // Update rating stats
    setRatingStats(prev => ({
      ...prev,
      [rating]: prev[rating] + 1
    }));

    try {
      await fetch("/api/flashcards/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: currentCard.id,
          deckId: parseInt(deckId),
          rating,
        }),
      });

      setStudiedCount(studiedCount + 1);
      goToNext();
    } catch (error) {
      console.error("Error recording progress:", error);
      goToNext(); // Still advance even if recording fails
    }
  };

  const goToNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      // On last card, show completion modal
      setShowCompletionModal(true);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudiedCount(0);
    setShowCompletionModal(false);
    setRatingStats({ again: 0, hard: 0, good: 0, easy: 0 });
  };

  const handleExit = () => {
    if (studiedCount > 0) {
      setShowExitModal(true);
    } else {
      router.push("/flashcards");
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showExitModal) return;

      if (e.key === " ") {
        e.preventDefault();
        setIsFlipped(!isFlipped);
      } else if (e.key === "ArrowRight") {
        if (isFlipped) handleRating("good");
        else goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "Escape") {
        handleExit();
      } else if (e.key === "1") {
        if (isFlipped) handleRating("again");
      } else if (e.key === "2") {
        if (isFlipped) handleRating("hard");
      } else if (e.key === "3") {
        if (isFlipped) handleRating("good");
      } else if (e.key === "4") {
        if (isFlipped) handleRating("easy");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFlipped, currentIndex, showExitModal]);

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-[#E76F51]/20 border-t-[#E76F51] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-slate-950 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#16213E] dark:text-white mb-4">
            No cards in this deck
          </h1>
          <button
            onClick={() => router.push("/flashcards")}
            className="px-6 py-3 bg-[#E76F51] text-white rounded-xl font-semibold hover:bg-[#D65A3D] transition-colors"
          >
            Back to Flashcards
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#E76F51] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Exit</span>
          </button>

          <div className="text-center flex-1">
            <h1 className="font-heading text-xl md:text-2xl font-bold text-[#16213E] dark:text-white mb-1">
              {deckTitle}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Card {currentIndex + 1} of {cards.length}
            </p>
          </div>

          <button
            onClick={handleShuffle}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            title="Shuffle cards"
          >
            <Shuffle className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#E76F51] to-[#F4A79D]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{progress}% complete</span>
            <span>{studiedCount} studied</span>
          </div>
        </div>

        {/* Flashcard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <FlashcardFlip
              front={currentCard.front}
              back={currentCard.back}
              hint={currentCard.hint}
              difficulty={currentCard.difficulty}
              onFlip={setIsFlipped}
            />
          </motion.div>
        </AnimatePresence>

        {/* Rating buttons (show only when flipped) */}
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
          >
            <button
              onClick={() => handleRating("again")}
              className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-900 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
            >
              <XCircle className="w-6 h-6 text-red-500" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Again
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                &lt;1 min
              </span>
            </button>

            <button
              onClick={() => handleRating("hard")}
              className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-orange-200 dark:border-orange-900 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all group"
            >
              <Minus className="w-6 h-6 text-orange-500" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Hard
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                1 day
              </span>
            </button>

            <button
              onClick={() => handleRating("good")}
              className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-green-200 dark:border-green-900 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group"
            >
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Good
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                3 days
              </span>
            </button>

            <button
              onClick={() => handleRating("easy")}
              className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-900 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
            >
              <ThumbsUp className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Easy
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                7 days
              </span>
            </button>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Prev</span>
          </button>

          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            title="Restart from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => (isFlipped ? handleRating("good") : goToNext())}
            disabled={currentIndex === cards.length - 1 && !isFlipped}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E76F51] hover:bg-[#D65A3D] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
          <p className="font-semibold mb-1">Keyboard shortcuts:</p>
          <p>
            Space: Flip • ← →: Navigate • 1-4: Rate • Esc: Exit
          </p>
        </div>
      </div>

      {/* Exit confirmation modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full"
          >
            <h2 className="font-heading text-2xl font-bold text-[#16213E] dark:text-white mb-3">
              Exit study session?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              You've studied {studiedCount} cards so far. Your progress has been saved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Continue studying
              </button>
              <button
                onClick={() => router.push("/flashcards")}
                className="flex-1 px-4 py-3 rounded-xl bg-[#E76F51] text-white font-semibold hover:bg-[#D65A3D] transition-colors"
              >
                Exit
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full relative overflow-hidden"
          >
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative">
              {/* Success icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-green-500"
                  />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                </motion.div>
              </div>

              <h2 className="font-heading text-3xl font-black text-center text-[#16213E] dark:text-white mb-2">
                Nice work! You've studied all the cards.
              </h2>
              <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-6">
                Your progress has been saved automatically.
              </p>

              {/* How you're doing */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  How you're doing
                </h3>
                <div className="space-y-2">
                  {/* Know (Easy) */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                        style={{ width: `${cards.length > 0 ? (ratingStats.easy / cards.length) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <ThumbsUp className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Know
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {ratingStats.easy}
                      </span>
                    </div>
                  </div>

                  {/* Still learning (Good) */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                        style={{ width: `${cards.length > 0 ? (ratingStats.good / cards.length) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Learning
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {ratingStats.good}
                      </span>
                    </div>
                  </div>

                  {/* Still learning (Hard + Again) */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                        style={{ width: `${cards.length > 0 ? ((ratingStats.hard + ratingStats.again) / cards.length) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Minus className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Review
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {ratingStats.hard + ratingStats.again}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next steps */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  Next steps
                </h3>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    // TODO: Navigate to quiz with same topic
                    alert("Quiz feature coming soon! This will generate a quiz with the same cards.");
                  }}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#F26A4B] to-[#E76F51] hover:from-[#E76F51] hover:to-[#D35D42] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Take Quiz
                </button>
                <button
                  onClick={handleRestart}
                  className="w-full px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-base transition-all"
                >
                  Restart Flashcards
                </button>
                <button
                  onClick={() => router.push("/flashcards")}
                  className="w-full px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#F26A4B] transition-colors"
                >
                  Back to Decks
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
