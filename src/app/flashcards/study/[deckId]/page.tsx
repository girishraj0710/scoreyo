"use client";

import { useState, useEffect } from "react";
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
  Star,
  Wand2,
  Maximize,
  Minimize,
} from "lucide-react";
import { ConvertModal } from "@/components/convert/ConvertModal";

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
  const [trackProgress, setTrackProgress] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deckTitle, setDeckTitle] = useState("");
  const [studiedCount, setStudiedCount] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [deckRating, setDeckRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  // Deck metadata
  const [creatorName, setCreatorName] = useState<string>("");
  const [creatorId, setCreatorId] = useState<string>("");
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [userHasRated, setUserHasRated] = useState<boolean>(false);
  const [userPreviousRating, setUserPreviousRating] = useState<number>(0);

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
      setCreatorName(data.deck.creator_name || "Anonymous");
      setCreatorId(data.deck.user_id); // Store creator's user ID
      setAverageRating(Number(data.deck.average_rating) || 0);
      setRatingCount(Number(data.deck.rating_count) || 0);
      setLoading(false);

      // Debug: Check creator comparison
      console.log('🔍 Creator Check:', {
        currentUserId: user?.id,
        creatorId: data.deck.user_id,
        isCreator: user?.id === data.deck.user_id,
        userIdType: typeof user?.id,
        creatorIdType: typeof data.deck.user_id
      });

      // If user is the creator, hide rating prompt if it was somehow shown
      if (user?.id === data.deck.user_id) {
        console.log('👤 User is creator - hiding rating UI');
        setShowRatingPrompt(false);
        setUserHasRated(false); // Don't show "already rated" either
      }

      // Check if user has already rated this deck
      console.log('🔍 Checking if user already rated deck:', deckId);
      const ratingResponse = await fetch(`/api/flashcards/rate/${deckId}`);
      console.log('   Response status:', ratingResponse.status);

      if (ratingResponse.ok) {
        const ratingData = await ratingResponse.json();
        console.log('   Rating data:', ratingData);

        if (ratingData.hasRated) {
          console.log('   ✅ User HAS rated:', ratingData.rating, 'stars');
          setUserHasRated(true);
          setUserPreviousRating(ratingData.rating);
        } else {
          console.log('   ❌ User has NOT rated this deck');
        }
      } else {
        console.log('   ❌ Failed to check rating:', await ratingResponse.text());
      }
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

  // In-app immersive mode — overlays the app's sidebar/top-nav (like Quizlet's
  // fullscreen), but stays a normal page. Not the browser Fullscreen API.
  const toggleFullscreen = () => setIsFullscreen((v) => !v);

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
        if (trackProgress && isFlipped) handleRating("good");
        else goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        else handleExit();
      } else if (trackProgress && isFlipped && e.key === "1") {
        handleRating("again");
      } else if (trackProgress && isFlipped && e.key === "2") {
        handleRating("hard");
      } else if (trackProgress && isFlipped && e.key === "3") {
        handleRating("good");
      } else if (trackProgress && isFlipped && e.key === "4") {
        handleRating("easy");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFlipped, currentIndex, showExitModal, trackProgress]);

  const handleSubmitRating = async () => {
    if (deckRating === 0) return;

    console.log('🎯 Submitting rating:', { deckId, rating: deckRating });

    try {
      const response = await fetch(`/api/flashcards/rate/${deckId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // Include cookies for auth
        body: JSON.stringify({ rating: deckRating }),
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Rating submitted successfully:', data);

        // Update deck rating display
        setAverageRating(data.rating.averageRating);
        setRatingCount(data.rating.ratingCount);
        setUserHasRated(true);
        setUserPreviousRating(deckRating);

        setShowRatingPrompt(false);
        setDeckRating(0);
        setRatingSuccess(true);
        // Auto-hide success message after 3 seconds
        setTimeout(() => setRatingSuccess(false), 3000);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to submit rating:', errorText);
        alert(`Failed to submit rating: ${errorText}`);
      }
    } catch (error) {
      console.error('💥 Error submitting rating:', error);
      alert('Error submitting rating. Please try again.');
    }
  };

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

  return (
    <div
      className={`bg-[#FAF8F5] dark:bg-slate-950 px-6 py-8 overflow-y-auto ${
        isFullscreen ? "fixed inset-0 z-50 h-screen" : "min-h-screen"
      }`}
    >
      <div
        className={
          isFullscreen
            ? "max-w-6xl mx-auto flex flex-col h-full"
            : "max-w-4xl mx-auto"
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#E76F51] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Exit</span>
          </button>

          <div className="text-center flex-1 min-w-0 px-4">
            <h1 className="font-heading text-xl md:text-2xl font-bold text-[#16213E] dark:text-white truncate">
              {deckTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setConvertOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              title="Turn this deck into a quiz, game or mock test"
            >
              <Wand2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </button>
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
            className={isFullscreen ? "flex-1 min-h-0 mb-6 flex" : "mb-8"}
          >
            <FlashcardFlip
              front={currentCard.front}
              back={currentCard.back}
              hint={currentCard.hint}
              difficulty={currentCard.difficulty}
              onFlip={setIsFlipped}
              heightClassName={isFullscreen ? "h-full" : "h-[400px]"}
            />
          </motion.div>
        </AnimatePresence>

        {/* Rating row — enabled only when tracking is on and the card is flipped */}
        {trackProgress && isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-6"
          >
            <button
              onClick={() => handleRating("again")}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Again
            </button>
            <button
              onClick={() => handleRating("hard")}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 dark:border-orange-900/60 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-sm font-semibold transition-colors"
            >
              <Minus className="w-4 h-4" />
              Hard
            </button>
            <button
              onClick={() => handleRating("good")}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-200 dark:border-green-900/60 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 text-sm font-semibold transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Good
            </button>
            <button
              onClick={() => handleRating("easy")}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-semibold transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              Easy
            </button>
          </motion.div>
        )}

        {/* Bottom control bar — track toggle · arrows + counter · shuffle */}
        <div className="flex items-center justify-between gap-4">
          {/* Track progress switcher */}
          <button
            onClick={() => setTrackProgress((v) => !v)}
            className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 shrink-0"
            title="Track progress with Again / Hard / Good / Easy"
          >
            <span className="hidden sm:inline">Track progress</span>
            <span
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                trackProgress ? "bg-[#E76F51]" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  trackProgress ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>

          {/* Arrows + counter */}
          <div className="flex items-center gap-3">
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 tabular-nums min-w-[3.5rem] text-center">
              {currentIndex + 1} / {cards.length}
            </span>
            <button
              onClick={() => {
                if (currentIndex < cards.length - 1) {
                  goToNext();
                } else {
                  setShowCompletionModal(true);
                }
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Next card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Shuffle + restart */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRestart}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-[#E76F51]/15 active:text-[#E76F51] transition-colors"
              title="Restart from beginning"
              aria-label="Restart"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={handleShuffle}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-[#E76F51]/15 active:text-[#E76F51] transition-colors"
              title="Shuffle cards"
              aria-label="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${
                isFullscreen
                  ? "bg-[#E76F51]/15 text-[#E76F51]"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              title={isFullscreen ? "Exit full screen" : "Full screen"}
              aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>
            Space: Flip • ← →: Navigate{trackProgress ? " • 1-4: Rate" : ""} • Esc: Exit
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
                <div className="space-y-3">
                  {/* Know (Easy) */}
                  <div className="flex items-center gap-3">
                    <ThumbsUp className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-20">
                      Know
                    </span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                        style={{ width: `${cards.length > 0 ? (ratingStats.easy / cards.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-6 text-right">
                      {ratingStats.easy}
                    </span>
                  </div>

                  {/* Still learning (Good) */}
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-20">
                      Learning
                    </span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                        style={{ width: `${cards.length > 0 ? (ratingStats.good / cards.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-6 text-right">
                      {ratingStats.good}
                    </span>
                  </div>

                  {/* Still learning (Hard + Again) */}
                  <div className="flex items-center gap-3">
                    <Minus className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-20">
                      Review
                    </span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                        style={{ width: `${cards.length > 0 ? ((ratingStats.hard + ratingStats.again) / cards.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-6 text-right">
                      {ratingStats.hard + ratingStats.again}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next steps */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  Next steps
                </h3>
              </div>

              {/* Rate this deck - only show if user hasn't rated yet AND is not the creator */}
              {!userHasRated && !showRatingPrompt && !ratingSuccess && user?.id !== creatorId ? (
                <button
                  onClick={() => setShowRatingPrompt(true)}
                  className="w-full px-4 py-3 mb-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Rate this deck
                </button>
              ) : userHasRated && !ratingSuccess && user?.id !== creatorId ? (
                <div className="mb-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      You rated this deck {userPreviousRating} star{userPreviousRating !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ) : ratingSuccess && user?.id !== creatorId ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                      Thank you for rating this deck!
                    </p>
                  </div>
                </motion.div>
              ) : showRatingPrompt && user?.id !== creatorId ? (
                <div className="mb-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 text-center">
                    How would you rate this deck?
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setDeckRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoverRating || deckRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowRatingPrompt(false);
                        setDeckRating(0);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitRating}
                      disabled={deckRating === 0}
                      className="flex-1 px-4 py-2 rounded-lg text-sm bg-[#F26A4B] text-white font-semibold hover:bg-[#E76F51] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setConvertOpen(true)}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#F26A4B] to-[#E76F51] hover:from-[#E76F51] hover:to-[#D35D42] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-5 h-5" />
                  Turn into Quiz / Game / Mock
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

      {/* Convert Modal — turn this deck into a quiz/game/mock */}
      <ConvertModal
        isOpen={convertOpen}
        onClose={() => setConvertOpen(false)}
        source={{ sourceType: "deck", sourceRef: deckId }}
        sourceLabel={deckTitle}
        allowedModes={["quiz", "match", "blocks", "blast"]}
      />
    </div>
  );
}
