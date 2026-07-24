"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/user-context";
import { useExamFilter } from "@/hooks/use-exam-filter";
import { X, RotateCcw } from "lucide-react";

interface Card {
  id: string;
  type: "question" | "answer";
  content: string;
  pairId: number;
  subject: string;
  matched?: boolean;
}

import GameIntroScreen from "@/components/common/GameIntroScreen";

interface MatchIntroProps {
  onStart: () => void;
  subjectName?: string;
  onBack: () => void;
}

function MatchIntro({ onStart, subjectName, onBack }: MatchIntroProps) {
  return (
    <GameIntroScreen
      icon={
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* White gradient for contrast */}
            <linearGradient id="cardWhite1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f0fdf4" />
            </linearGradient>
            <linearGradient id="cardWhite2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f0fdf4" />
              <stop offset="100%" stopColor="#dcfce7" />
            </linearGradient>
            <filter id="cardShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
              <feOffset dx="0" dy="4" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Back card (slight offset for depth) */}
          <g filter="url(#cardShadow)" opacity="0.6">
            <rect x="28" y="18" width="32" height="44" rx="4" fill="url(#cardWhite2)"/>
          </g>

          {/* Front card - WHITE for contrast */}
          <g filter="url(#cardShadow)">
            <rect x="20" y="22" width="32" height="44" rx="4" fill="url(#cardWhite1)"/>
            {/* Subtle shine effect */}
            <rect x="20" y="22" width="32" height="22" rx="4" fill="white" opacity="0.4"/>

            {/* Question mark - GREEN to match background theme */}
            <text x="36" y="52" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#059669" textAnchor="middle">?</text>
          </g>

          {/* Floating sparkle - yellow accent */}
          <circle cx="58" cy="28" r="3" fill="#fbbf24" opacity="0.9"/>
          <circle cx="58" cy="28" r="1.5" fill="#fef3c7"/>
        </svg>
      }
      title="Match"
      subtitle={subjectName || "GENERAL"}
      description="Match questions with their correct answers as fast as you can!"
      instructions={[
        { text: "• Click on a card to reveal a question or answer" },
        { text: "• Click on another card to find its matching pair" },
        { text: "• Correct matches stay revealed and earn you points" },
        { text: "• Wrong matches flip back - remember what you saw!" },
        { text: "• Complete all matches in the shortest time possible" },
      ]}
      buttonText="Play"
      onStart={onStart}
      onBack={onBack}
      accentColor="#10b981"
      iconBgColor="#059669"
    />
  );
}

interface MatchCompletionProps {
  timeSeconds: number;
  mistakes: number;
  onPlayAgain: () => void;
  onExit: () => void;
  isPersonalBest?: boolean;
}

function MatchCompletion({ timeSeconds, mistakes, onPlayAgain, onExit, isPersonalBest }: MatchCompletionProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getPerformance = () => {
    if (timeSeconds < 60) return { label: "⚡ Lightning Fast!", color: "#2E8B57" };
    if (timeSeconds < 120) return { label: "🎯 Great Job!", color: "#2A9D8F" };
    return { label: "💪 Keep Practicing!", color: "#E76F51" };
  };

  const performance = getPerformance();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-6 z-50"
      onClick={onExit}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="text-center">
          <div className="text-5xl mx-auto mb-4">
            🎴
          </div>

          <h2 className="font-heading text-3xl font-black mb-2 text-[#16213E] dark:text-white">
            Game Complete!
          </h2>

          {isPersonalBest && (
            <div className="inline-block px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold mb-4">
              🏆 NEW PERSONAL BEST!
            </div>
          )}

          <div className="text-lg font-semibold mb-6" style={{ color: performance.color }}>
            {performance.label}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl bg-[#FAF8F5] dark:bg-slate-800 p-4">
              <div className="text-xs uppercase font-bold text-[#5A6478] dark:text-slate-400 mb-1" style={{ letterSpacing: '0.2em' }}>
                Time
              </div>
              <div className="font-mono font-black text-2xl text-[#16213E] dark:text-white">
                {formatTime(timeSeconds)}
              </div>
            </div>

            <div className="rounded-2xl bg-[#FAF8F5] dark:bg-slate-800 p-4">
              <div className="text-xs uppercase font-bold text-[#5A6478] dark:text-slate-400 mb-1" style={{ letterSpacing: '0.2em' }}>
                Mistakes
              </div>
              <div className="font-mono font-black text-2xl text-[#16213E] dark:text-white">
                {mistakes}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onPlayAgain}
              className="w-full rounded-xl bg-[#2A9D8F] hover:bg-[#238276] text-white font-bold py-3 px-6 transition-all"
            >
              Play Again
            </button>
            <button
              onClick={onExit}
              className="w-full rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-black/10 dark:border-white/10 text-[#16213E] dark:text-white font-semibold py-3 px-6 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MatchGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const artifactSlug = searchParams.get("artifact") || "";
  const { user, isLoading } = useUser();
  const examFilter = useExamFilter();
  const isArtifactRef = useRef(false);
  const [gameState, setGameState] = useState<"intro" | "playing" | "complete">("intro");
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [totalPairs, setTotalPairs] = useState(6);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCheckingMatch, setIsCheckingMatch] = useState(false);
  const [subjectName, setSubjectName] = useState<string>("");
  const [contentSource, setContentSource] = useState<any>(null);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const [matchedCardIds, setMatchedCardIds] = useState<string[]>([]); // For green animation

  // Timer
  useEffect(() => {
    if (gameState === "playing" && startTime > 0) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, startTime]);

  // Load content
  const loadContent = async () => {
    try {
      // Generated game artifact: build cards from term/definition pairs.
      if (artifactSlug) {
        const response = await fetch(`/api/generated/${artifactSlug}`);
        if (!response.ok) throw new Error("Failed to fetch study set");
        const data = await response.json();
        isArtifactRef.current = true;
        const pairs = (data.pairs || []).slice(0, 6);
        const cards: Card[] = pairs.flatMap(
          (p: { term: string; definition: string }, i: number) => [
            { id: `q-${i}`, type: "question" as const, content: p.term, pairId: i, subject: data.title || "Study set" },
            { id: `a-${i}`, type: "answer" as const, content: p.definition, pairId: i, subject: data.title || "Study set" },
          ]
        );
        setCards(cards);
        setTotalPairs(pairs.length);
        setSubjectName(data.title || "Study set");
        return;
      }

      const response = await fetch(`/api/match/content?examId=${examFilter || user?.current_exam || "upsc-cse"}`);
      if (!response.ok) throw new Error("Failed to fetch content");

      const data = await response.json();
      setCards(data.cards);
      setContentSource(data.contentSource);
      setTotalPairs(Math.floor((data.cards?.length || 12) / 2));

      // Set subject name from first card
      if (data.cards.length > 0) {
        setSubjectName(data.cards[0].subject);
      }
    } catch (error) {
      console.error("Error loading match content:", error);
    }
  };

  useEffect(() => {
    if (artifactSlug) {
      loadContent();
      return;
    }
    if (user && !isLoading) {
      loadContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading, artifactSlug]);

  const handleStart = () => {
    setGameState("playing");
    setStartTime(Date.now());
    setElapsedTime(0);
    setMatchedPairs([]);
    setSelectedCards([]);
    setMistakes(0);
  };

  const handleCardClick = (cardId: string) => {
    if (isCheckingMatch || matchedPairs.includes(cards.find((c) => c.id === cardId)!.pairId)) {
      return;
    }

    if (selectedCards.includes(cardId)) {
      // Deselect
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
      return;
    }

    const newSelection = [...selectedCards, cardId];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      setIsCheckingMatch(true);

      const card1 = cards.find((c) => c.id === newSelection[0])!;
      const card2 = cards.find((c) => c.id === newSelection[1])!;

      // Check if it's a match
      if (card1.pairId === card2.pairId && card1.type !== card2.type) {
        // Match! Show green animation
        setMatchedCardIds([card1.id, card2.id]);

        setTimeout(() => {
          // Remove matched cards and reshuffle remaining
          const newMatchedPairs = [...matchedPairs, card1.pairId];
          setMatchedPairs(newMatchedPairs);

          // Reshuffle remaining cards
          setCards(prevCards => {
            const remaining = prevCards.filter(c => c.pairId !== card1.pairId);
            return remaining.sort(() => Math.random() - 0.5);
          });

          setSelectedCards([]);
          setMatchedCardIds([]);
          setIsCheckingMatch(false);

          // Check if game complete
          if (newMatchedPairs.length === totalPairs) {
            handleGameComplete();
          }
        }, 600); // Longer delay to show green animation
      } else {
        // No match
        setMistakes(mistakes + 1);
        setTimeout(() => {
          setSelectedCards([]);
          setIsCheckingMatch(false);
        }, 600);
      }
    }
  };

  const handleGameComplete = async () => {
    const finalTime = Math.floor((Date.now() - startTime) / 1000);

    // Generated game artifacts aren't tied to an exam — skip the leaderboard save.
    if (isArtifactRef.current) {
      setGameState("complete");
      return;
    }

    try {
      const response = await fetch("/api/match/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: examFilter || user?.current_exam || "upsc-cse",
          subjectName,
          timeSeconds: finalTime,
          pairsCount: 6,
          mistakes,
          contentSource: contentSource ?
            (contentSource.weak > 0 ? "mixed" : contentSource.recent > 0 ? "studied" : "new")
            : "mixed",
        }),
      });

      const data = await response.json();
      setIsPersonalBest(data.isPersonalBest || false);
    } catch (error) {
      console.error("Error saving match game:", error);
    }

    setGameState("complete");
  };

  const handleRestart = () => {
    setGameState("intro");
    loadContent();
  };

  const handleExit = () => {
    router.push("/");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: "var(--card-border)", borderTopColor: "var(--primary)" }}></div>
      </div>
    );
  }

  if (!user) {
    const dest = artifactSlug ? `/match?artifact=${artifactSlug}` : "/match";
    router.push(`/login?redirect=${encodeURIComponent(dest)}`);
    return null;
  }

  if (gameState === "intro") {
    return <MatchIntro onStart={handleStart} subjectName={subjectName} onBack={handleExit} />;
  }

  if (gameState === "complete") {
    return (
      <MatchCompletion
        timeSeconds={elapsedTime}
        mistakes={mistakes}
        onPlayAgain={handleRestart}
        onExit={handleExit}
        isPersonalBest={isPersonalBest}
      />
    );
  }

  return (
    <div className="min-h-screen py-8 px-6" style={{ background: "var(--background)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-sm font-semibold text-[#5A6478] dark:text-slate-400 hover:text-[#16213E] dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
            Exit
          </button>

          <div className="flex-1 flex justify-center">
            <div className="rounded-full bg-[#16213E] dark:bg-slate-900 px-6 py-2 font-mono font-bold text-white text-lg">
              {formatTime(elapsedTime)}
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center gap-2 text-sm font-semibold text-[#5A6478] dark:text-slate-400 hover:text-[#16213E] dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Restart
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-xs uppercase font-bold text-[#2A9D8F]" style={{ letterSpacing: '0.2em' }}>
            STUDY MODES
          </div>
          <h1 className="font-heading text-4xl font-black mt-1 text-[#16213E] dark:text-white">
            Match · {subjectName || "General"}
          </h1>
          <p className="text-[#5A6478] dark:text-slate-400 mt-2">Speed pairing game</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {cards.map((card) => {
              const isMatched = matchedPairs.includes(card.pairId);
              const isSelected = selectedCards.includes(card.id);
              const isCorrectMatch = matchedCardIds.includes(card.id);
              const isWrongMatch = selectedCards.length === 2 && isSelected && isCheckingMatch && !isCorrectMatch;

              if (isMatched) return null;

              return (
                <motion.button
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCardClick(card.id)}
                  transition={{ layout: { duration: 0.3 } }}
                  className={`
                    rounded-2xl p-5 text-left transition-all min-h-[140px] flex flex-col
                    ${isCorrectMatch
                      ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500 shadow-pop"
                      : isSelected
                      ? "bg-[#FAF8F5] dark:bg-slate-800 border-2 border-[#2A9D8F] shadow-pop"
                      : "bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-soft hover:shadow-pop"
                    }
                    ${isWrongMatch ? "animate-shake border-red-500" : ""}
                  `}
                  disabled={isCheckingMatch}
                >
                  <div className={`text-[10px] uppercase font-bold mb-2 ${
                    isCorrectMatch
                      ? "text-green-600 dark:text-green-400"
                      : card.type === "question" ? "text-[#F26A4B]" : "text-[#2A9D8F]"
                  }`} style={{ letterSpacing: '0.2em' }}>
                    {isCorrectMatch ? "✓ MATCHED" : card.type === "question" ? "QUESTION" : "ANSWER"}
                  </div>
                  <div className={`text-sm font-semibold leading-snug flex-1 ${
                    isCorrectMatch ? "text-green-700 dark:text-green-300" : "text-[#16213E] dark:text-white"
                  }`}>
                    {card.content}
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Stats */}
        <div className="mt-8 flex justify-center gap-6">
          <div className="text-center">
            <div className="text-xs uppercase font-bold text-[#5A6478] dark:text-slate-400" style={{ letterSpacing: '0.2em' }}>
              Matched
            </div>
            <div className="font-mono font-bold text-xl text-[#16213E] dark:text-white mt-1">
              {matchedPairs.length} / {totalPairs}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs uppercase font-bold text-[#5A6478] dark:text-slate-400" style={{ letterSpacing: '0.2em' }}>
              Mistakes
            </div>
            <div className="font-mono font-bold text-xl text-[#E76F51] mt-1">
              {mistakes}
            </div>
          </div>
        </div>
      </div>

      {/* Shake animation for wrong matches */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default function MatchPage() {
  return (
    <Suspense fallback={null}>
      <MatchGame />
    </Suspense>
  );
}
