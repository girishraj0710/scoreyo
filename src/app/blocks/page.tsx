"use client";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/user-context";
import { useExamFilter } from "@/hooks/use-exam-filter";
import { X, RotateCcw } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

// Grid dimensions - Compact Tetris (fits on screen)
const GRID_WIDTH = 10;
const GRID_HEIGHT = 13;

interface QuestionData {
  id: string;
  question: string;
  answer: string;
  topic: string;
  subject: string;
}

interface GridCell {
  filled: boolean;
  color: string;
}

// Tetromino shapes (4 rotation states each)
type TetrominoType = "I" | "O" | "T" | "L" | "J" | "S" | "Z";

interface Tetromino {
  type: TetrominoType;
  shape: number[][][]; // 4 rotation states
  color: string;
}

const TETROMINOS: Record<TetrominoType, Tetromino> = {
  I: {
    type: "I",
    color: "#00f0f0",
    shape: [
      [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
      [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
      [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
      [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
    ],
  },
  O: {
    type: "O",
    color: "#f0f000",
    shape: [
      [[1, 1], [1, 1]],
      [[1, 1], [1, 1]],
      [[1, 1], [1, 1]],
      [[1, 1], [1, 1]],
    ],
  },
  T: {
    type: "T",
    color: "#a000f0",
    shape: [
      [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
      [[0, 1, 0], [1, 1, 0], [0, 1, 0]],
    ],
  },
  L: {
    type: "L",
    color: "#f0a000",
    shape: [
      [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
      [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
      [[1, 1, 0], [0, 1, 0], [0, 1, 0]],
    ],
  },
  J: {
    type: "J",
    color: "#0000f0",
    shape: [
      [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
      [[0, 1, 0], [0, 1, 0], [1, 1, 0]],
    ],
  },
  S: {
    type: "S",
    color: "#00f000",
    shape: [
      [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
      [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
      [[1, 0, 0], [1, 1, 0], [0, 1, 0]],
    ],
  },
  Z: {
    type: "Z",
    color: "#f00000",
    shape: [
      [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
      [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
      [[0, 1, 0], [1, 1, 0], [1, 0, 0]],
    ],
  },
};

interface FallingPiece {
  id: string;
  question: QuestionData;
  type: TetrominoType;
  rotation: number; // 0-3
  row: number;
  col: number;
  color: string;
}

import GameIntroScreen from "@/components/common/GameIntroScreen";

interface BlocksIntroProps {
  onStart: () => void;
  subjectName?: string;
  onBack: () => void;
}

function BlocksIntro({ onStart, subjectName, onBack }: BlocksIntroProps) {
  return (
    <GameIntroScreen
      icon={
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* White gradient for contrast */}
            <linearGradient id="blockWhite" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#faf5ff" />
            </linearGradient>
            <linearGradient id="blockLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#faf5ff" />
              <stop offset="100%" stopColor="#f3e8ff" />
            </linearGradient>
            <filter id="blockShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
              <feOffset dx="0" dy="3" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.4"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Tetris T-piece falling - WHITE for contrast */}
          <g filter="url(#blockShadow)">
            {/* Top horizontal blocks */}
            <rect x="18" y="15" width="12" height="12" rx="2" fill="url(#blockWhite)"/>
            <rect x="18" y="15" width="12" height="6" rx="2" fill="white" opacity="0.4"/>
            <rect x="18" y="15" width="12" height="12" rx="2" fill="none" stroke="#E76F51" strokeWidth="1.5" opacity="0.3"/>

            <rect x="32" y="15" width="12" height="12" rx="2" fill="url(#blockWhite)"/>
            <rect x="32" y="15" width="12" height="6" rx="2" fill="white" opacity="0.4"/>
            <rect x="32" y="15" width="12" height="12" rx="2" fill="none" stroke="#E76F51" strokeWidth="1.5" opacity="0.3"/>

            <rect x="46" y="15" width="12" height="12" rx="2" fill="url(#blockWhite)"/>
            <rect x="46" y="15" width="12" height="6" rx="2" fill="white" opacity="0.4"/>
            <rect x="46" y="15" width="12" height="12" rx="2" fill="none" stroke="#E76F51" strokeWidth="1.5" opacity="0.3"/>

            {/* Center vertical block */}
            <rect x="32" y="29" width="12" height="12" rx="2" fill="url(#blockWhite)"/>
            <rect x="32" y="29" width="12" height="6" rx="2" fill="white" opacity="0.4"/>
            <rect x="32" y="29" width="12" height="12" rx="2" fill="none" stroke="#E76F51" strokeWidth="1.5" opacity="0.3"/>
          </g>

          {/* Stacked blocks at bottom (landed) - lighter */}
          <g filter="url(#blockShadow)" opacity="0.6">
            <rect x="18" y="55" width="12" height="10" rx="1.5" fill="url(#blockLight)"/>
            <rect x="32" y="55" width="12" height="10" rx="1.5" fill="url(#blockLight)"/>
            <rect x="46" y="55" width="12" height="10" rx="1.5" fill="url(#blockLight)"/>
          </g>

          {/* Motion lines - white */}
          <line x1="15" y1="20" x2="13" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
          <line x1="15" y1="34" x2="13" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        </svg>
      }
      title="Blocks"
      subtitle={subjectName || "GENERAL"}
      description="Classic Tetris with questions - answer correctly to place pieces!"
      instructions={[
        { text: "• Tetromino pieces fall with questions attached" },
        { text: "• Desktop: Use arrow keys (← → ↑ ↓) or spacebar to rotate" },
        { text: "• Mobile: Touch controls at bottom (move, drop, rotate)" },
        { text: "• Type your answer and press Enter or Submit" },
        { text: "• Correct answer locks piece - wrong answer makes it vanish!" },
        { text: "• Complete full horizontal rows to clear them for big points" },
      ]}
      buttonText="Play"
      onStart={onStart}
      onBack={onBack}
      accentColor="#E76F51"
      iconBgColor="#d96043"
    />
  );
}

interface BlocksCompletionProps {
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  linesCleared: number;
  highestCombo: number;
  timeSeconds: number;
  onPlayAgain: () => void;
  onExit: () => void;
  isPersonalBest?: boolean;
}

function BlocksCompletion({
  score,
  questionsAnswered,
  correctAnswers,
  linesCleared,
  highestCombo,
  timeSeconds,
  onPlayAgain,
  onExit,
  isPersonalBest,
}: BlocksCompletionProps) {
  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--background)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <h1 className="font-heading text-3xl md:text-4xl font-black mb-2 text-[#16213E] dark:text-white">
          Game Complete!
        </h1>

        {isPersonalBest && (
          <div className="mb-4 text-lg font-bold text-[#E76F51] animate-pulse">
            🎉 New Personal Best!
          </div>
        )}

        <div className="text-5xl font-black text-[#E76F51] mb-6">
          {score.toLocaleString()}
        </div>

        <div className="bg-[#FAF8F5] dark:bg-slate-800 rounded-2xl p-6 mb-6 space-y-3 text-left">
          <div className="flex justify-between items-center">
            <span className="text-[#5A6478] dark:text-slate-400">Questions Answered</span>
            <span className="font-bold text-[#16213E] dark:text-white">{questionsAnswered}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#5A6478] dark:text-slate-400">Correct Answers</span>
            <span className="font-bold text-green-600 dark:text-green-400">{correctAnswers}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#5A6478] dark:text-slate-400">Accuracy</span>
            <span className="font-bold text-[#16213E] dark:text-white">{accuracy}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#5A6478] dark:text-slate-400">Lines Cleared</span>
            <span className="font-bold text-[#4255FF]">{linesCleared}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#5A6478] dark:text-slate-400">Highest Combo</span>
            <span className="font-bold text-[#E76F51]">{highestCombo}×</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#5A6478] dark:text-slate-400">Time</span>
            <span className="font-bold text-[#16213E] dark:text-white">
              {Math.floor(timeSeconds / 60)}:{(timeSeconds % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full rounded-xl bg-[#E76F51] hover:bg-[#d96043] text-white font-bold py-4 px-6 transition-all shadow-soft hover:shadow-pop"
          >
            Play Again
          </button>
          <button
            onClick={onExit}
            className="w-full rounded-xl bg-transparent border-2 border-black/10 dark:border-white/10 text-[#16213E] dark:text-white font-bold py-4 px-6 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Exit to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Brightness helper
const adjustBrightness = (color: string, percent: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

function BlocksGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const artifactSlug = searchParams.get("artifact");
  const { user, isLoading } = useUser();
  const examId = useExamFilter() || "jee-main";
  const inputRef = useRef<HTMLInputElement>(null);

  // Game state
  const [gameState, setGameState] = useState<"intro" | "playing" | "complete">("intro");
  const [grid, setGrid] = useState<GridCell[][]>(
    Array(GRID_HEIGHT).fill(null).map(() =>
      Array(GRID_WIDTH).fill(null).map(() => ({ filled: false, color: "" }))
    )
  );
  const [fallingPiece, setFallingPiece] = useState<FallingPiece | null>(null);
  const [pieceLanded, setPieceLanded] = useState(false);
  const [questionQueue, setQuestionQueue] = useState<QuestionData[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [piecesForCurrentQuestion, setPiecesForCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(null);
  const [subjectName, setSubjectName] = useState<string>("");
  const [contentSource, setContentSource] = useState<string>("");

  // Stats
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [currentCombo, setCurrentCombo] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);
  const [level, setLevel] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPersonalBest, setIsPersonalBest] = useState(false);

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Level up
  useEffect(() => {
    const newLevel = Math.floor(linesCleared / 10) + 1;
    setLevel(newLevel);
  }, [linesCleared]);

  const handleStart = () => {
    setGameState("playing");
    setGrid(
      Array(GRID_HEIGHT).fill(null).map(() =>
        Array(GRID_WIDTH).fill(null).map(() => ({ filled: false, color: "" }))
      )
    );
    setScore(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setLinesCleared(0);
    setCurrentCombo(0);
    setHighestCombo(0);
    setLevel(1);
    setElapsedTime(0);
    setIsPersonalBest(false);
    setUserAnswer("");
    setShowFeedback(null);
    setPieceLanded(false);
    setCurrentQuestion(null);
    setPiecesForCurrentQuestion(0);

    setTimeout(() => {
      spawnPiece();
    }, 500);
  };

  // Filter for simple questions (short answers, no complex logic)
  const isSimpleQuestion = (question: string, answer: string): boolean => {
    // Answer should be reasonably short (max 10 words or 100 characters)
    const wordCount = answer.trim().split(/\s+/).length;
    const charCount = answer.trim().length;

    if (wordCount > 10 || charCount > 100) return false;

    // Only exclude extremely complex patterns
    const complexPatterns = [
      /\bexplain in detail\b/i,
      /\bdescribe the process\b/i,
      /\bwrite an essay\b/i,
    ];

    for (const pattern of complexPatterns) {
      if (question.match(pattern)) return false;
    }

    return true;
  };

  // Load content
  const loadContent = async () => {
    // Generated artifact: convert term/definition pairs into questions.
    // Question = definition (the prompt), answer = term (what you type).
    if (artifactSlug) {
      try {
        const res = await fetch(`/api/generated/${artifactSlug}`);
        if (!res.ok) throw new Error("Artifact not found");
        const data = await res.json();
        const pairs: { term: string; definition: string }[] = data.pairs || [];
        const questions: QuestionData[] = pairs
          .filter((p) => p.term && p.definition && isSimpleQuestion(p.definition, p.term))
          .map((p, i) => ({
            id: `art_${i}`,
            question: p.definition,
            answer: p.term,
            topic: "General",
            subject: data.title || "Study Set",
          }));
        // Fallback: if the simple-question filter drops everything, keep them all.
        const finalQuestions =
          questions.length > 0
            ? questions
            : pairs
                .filter((p) => p.term && p.definition)
                .map((p, i) => ({
                  id: `art_${i}`,
                  question: p.definition,
                  answer: p.term,
                  topic: "General",
                  subject: data.title || "Study Set",
                }));
        setQuestionQueue(finalQuestions);
        setContentSource("generated");
        setSubjectName(data.title || "Study Set");
      } catch (error) {
        console.error("Error loading blocks artifact:", error);
      }
      return;
    }

    try {
      const response = await fetch(`/api/match/content?examId=${examId}`);
      const data = await response.json();

      const questions: QuestionData[] = [];
      for (let i = 0; i < data.pairCount; i++) {
        const qCard = data.cards.find((c: any) => c.pairId === i && c.type === "question");
        const aCard = data.cards.find((c: any) => c.pairId === i && c.type === "answer");

        if (qCard && aCard && isSimpleQuestion(qCard.content, aCard.content)) {
          questions.push({
            id: `q_${i}`,
            question: qCard.content,
            answer: aCard.content,
            topic: "General",
            subject: qCard.subject || "General",
          });
        }
      }

      console.log(`[Blocks] Loaded ${questions.length} simple questions out of ${data.pairCount} total`);

      // Fallback: If no questions pass filter, use all questions
      if (questions.length === 0) {
        console.warn("[Blocks] No questions passed filter, using all questions as fallback");
        for (let i = 0; i < data.pairCount; i++) {
          const qCard = data.cards.find((c: any) => c.pairId === i && c.type === "question");
          const aCard = data.cards.find((c: any) => c.pairId === i && c.type === "answer");

          if (qCard && aCard) {
            questions.push({
              id: `q_${i}`,
              question: qCard.content,
              answer: aCard.content,
              topic: "General",
              subject: qCard.subject || "General",
            });
          }
        }
      }

      setQuestionQueue(questions);
      setContentSource(data.contentSource);
      if (questions.length > 0) {
        setSubjectName(questions[0].subject);
      }
    } catch (error) {
      console.error("Error loading blocks content:", error);
    }
  };

  // Load more questions
  const loadMoreQuestions = useCallback(async () => {
    // Generated artifacts are a finite set — don't top up from the exam bank.
    if (artifactSlug) return 0;
    try {
      const response = await fetch(`/api/match/content?examId=${examId}`);
      const data = await response.json();

      const newQuestions: QuestionData[] = [];
      for (let i = 0; i < data.pairCount; i++) {
        const qCard = data.cards.find((c: any) => c.pairId === i && c.type === "question");
        const aCard = data.cards.find((c: any) => c.pairId === i && c.type === "answer");

        if (qCard && aCard && isSimpleQuestion(qCard.content, aCard.content)) {
          newQuestions.push({
            id: `q_${Date.now()}_${i}`,
            question: qCard.content,
            answer: aCard.content,
            topic: "General",
            subject: qCard.subject || "General",
          });
        }
      }

      // Fallback: If no questions pass filter, use all questions
      if (newQuestions.length === 0) {
        console.warn("[Blocks] No more questions passed filter, loading all as fallback");
        for (let i = 0; i < data.pairCount; i++) {
          const qCard = data.cards.find((c: any) => c.pairId === i && c.type === "question");
          const aCard = data.cards.find((c: any) => c.pairId === i && c.type === "answer");

          if (qCard && aCard) {
            newQuestions.push({
              id: `q_${Date.now()}_${i}`,
              question: qCard.content,
              answer: aCard.content,
              topic: "General",
              subject: qCard.subject || "General",
            });
          }
        }
      }

      setQuestionQueue(prev => [...prev, ...newQuestions]);
      return newQuestions.length;
    } catch (error) {
      console.error("Error loading more questions:", error);
      return 0;
    }
  }, [examId]);

  useEffect(() => {
    if (user && !isLoading) {
      loadContent();
    }
  }, [user, isLoading]);

  // Random tetromino type
  const getRandomTetrominoType = (): TetrominoType => {
    const types: TetrominoType[] = ["I", "O", "T", "L", "J", "S", "Z"];
    return types[Math.floor(Math.random() * types.length)];
  };

  // Spawn new piece
  const spawnPiece = useCallback(() => {
    // Check if we need a new question (first time or after answering correctly)
    if (!currentQuestion) {
      if (questionQueue.length === 0) {
        loadMoreQuestions().then(() => {
          setTimeout(() => spawnPiece(), 500);
        });
        return;
      }

      const nextQuestion = questionQueue[0];
      setCurrentQuestion(nextQuestion);
      setQuestionQueue(prev => prev.slice(1));
      setPiecesForCurrentQuestion(0);

      if (questionQueue.length <= 3) {
        loadMoreQuestions();
      }
    }

    // Spawn piece with current question
    const type = getRandomTetrominoType();
    const tetromino = TETROMINOS[type];

    const newPiece: FallingPiece = {
      id: `piece_${Date.now()}`,
      question: currentQuestion!,
      type,
      rotation: 0,
      row: 0,
      col: Math.floor(GRID_WIDTH / 2) - 1,
      color: tetromino.color,
    };

    // Check if spawn position is blocked (game over)
    const testPiece = { ...newPiece, row: 1 };
    if (checkCollision(newPiece, grid) && checkCollision(testPiece, grid)) {
      handleGameOver();
      return;
    }

    setFallingPiece(newPiece);
    setPiecesForCurrentQuestion(prev => prev + 1);
  }, [questionQueue, grid, loadMoreQuestions, currentQuestion]);

  // Check collision
  const checkCollision = (piece: FallingPiece, currentGrid: GridCell[][]): boolean => {
    const shape = TETROMINOS[piece.type].shape[piece.rotation];

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const gridRow = piece.row + row;
          const gridCol = piece.col + col;

          // Out of bounds
          if (gridRow < 0 || gridRow >= GRID_HEIGHT || gridCol < 0 || gridCol >= GRID_WIDTH) {
            return true;
          }

          // Collision with filled cell
          if (currentGrid[gridRow][gridCol].filled) {
            return true;
          }
        }
      }
    }

    return false;
  };

  // Piece falling mechanic
  useEffect(() => {
    if (gameState !== "playing" || !fallingPiece || pieceLanded) return;

    const fallSpeed = Math.max(1000 - (level * 80), 300);
    const interval = setInterval(() => {
      setFallingPiece(prev => {
        if (!prev) return null;

        const nextPiece = { ...prev, row: prev.row + 1 };

        // Check if can move down
        if (checkCollision(nextPiece, grid)) {
          setPieceLanded(true);
          return prev;
        }

        return nextPiece;
      });
    }, fallSpeed);

    return () => clearInterval(interval);
  }, [gameState, fallingPiece, grid, level, pieceLanded]);

  // Auto-spawn next piece when current lands (if < 3 pieces for current question)
  useEffect(() => {
    if (gameState !== "playing" || !pieceLanded || !fallingPiece) return;

    // If we haven't dropped 3 pieces yet, auto-spawn another
    if (piecesForCurrentQuestion < 3) {
      const timer = setTimeout(() => {
        placePiece(fallingPiece);
        setFallingPiece(null);
        setPieceLanded(false);
        spawnPiece();
      }, 500);

      return () => clearTimeout(timer);
    }
    // If we've dropped 3 pieces, wait for correct answer or "Don't Know"
  }, [pieceLanded, fallingPiece, piecesForCurrentQuestion, gameState]);

  // Game control handlers (used by both keyboard and touch)
  const moveLeft = useCallback(() => {
    if (!fallingPiece || pieceLanded) return;
    triggerHaptic('light'); // Haptic feedback
    setFallingPiece(prev => {
      if (!prev) return null;
      const nextPiece = { ...prev, col: prev.col - 1 };
      if (checkCollision(nextPiece, grid)) return prev;
      return nextPiece;
    });
  }, [fallingPiece, pieceLanded, grid]);

  const moveRight = useCallback(() => {
    if (!fallingPiece || pieceLanded) return;
    triggerHaptic('light'); // Haptic feedback
    setFallingPiece(prev => {
      if (!prev) return null;
      const nextPiece = { ...prev, col: prev.col + 1 };
      if (checkCollision(nextPiece, grid)) return prev;
      return nextPiece;
    });
  }, [fallingPiece, pieceLanded, grid]);

  const rotatePiece = useCallback(() => {
    if (!fallingPiece || pieceLanded) return;
    triggerHaptic('medium'); // Haptic feedback
    setFallingPiece(prev => {
      if (!prev) return null;
      const nextPiece = { ...prev, rotation: (prev.rotation + 1) % 4 };
      if (checkCollision(nextPiece, grid)) return prev;
      return nextPiece;
    });
  }, [fallingPiece, pieceLanded, grid]);

  const dropFaster = useCallback(() => {
    if (!fallingPiece || pieceLanded) return;
    triggerHaptic('light'); // Haptic feedback
    setFallingPiece(prev => {
      if (!prev) return null;
      const nextPiece = { ...prev, row: prev.row + 1 };
      if (checkCollision(nextPiece, grid)) {
        setPieceLanded(true);
        triggerHaptic('medium'); // Landing feedback
        return prev;
      }
      return nextPiece;
    });
  }, [fallingPiece, pieceLanded, grid]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== "playing" || !fallingPiece || pieceLanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveLeft();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        moveRight();
      } else if (e.key === "ArrowUp" || e.key === " ") {
        e.preventDefault();
        rotatePiece();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        dropFaster();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, fallingPiece, pieceLanded, moveLeft, moveRight, rotatePiece, dropFaster]);

  // Place piece in grid
  const placePiece = (piece: FallingPiece) => {
    const shape = TETROMINOS[piece.type].shape[piece.rotation];

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);

      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const gridRow = piece.row + row;
            const gridCol = piece.col + col;
            if (gridRow >= 0 && gridRow < GRID_HEIGHT && gridCol >= 0 && gridCol < GRID_WIDTH) {
              newGrid[gridRow][gridCol] = {
                filled: true,
                color: piece.color,
              };
            }
          }
        }
      }

      return newGrid;
    });
  };

  // Check and clear lines
  const checkLines = () => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      let clearedCount = 0;

      for (let row = GRID_HEIGHT - 1; row >= 0; row--) {
        if (newGrid[row].every(cell => cell.filled)) {
          clearedCount++;
          newGrid.splice(row, 1);
          newGrid.unshift(Array(GRID_WIDTH).fill(null).map(() => ({ filled: false, color: "" })));
          row++;
        }
      }

      if (clearedCount > 0) {
        // Line clear bonuses
        const bonuses = [0, 100, 300, 600, 1000]; // 0, 1, 2, 3, 4 lines
        const bonus = bonuses[Math.min(clearedCount, 4)] * level;
        setScore(prev => prev + bonus);
        setLinesCleared(prev => prev + clearedCount);
      }

      return newGrid;
    });
  };

  // Fuzzy match helper - checks if answer is similar enough
  const fuzzyMatch = (userAnswer: string, correctAnswer: string): boolean => {
    const normalize = (str: string) => str.toLowerCase().trim().replace(/[^\w\s]/g, '');
    const user = normalize(userAnswer);
    const correct = normalize(correctAnswer);

    // Exact match
    if (user === correct) return true;

    // Check if user answer contains the correct answer or vice versa
    if (user.includes(correct) || correct.includes(user)) {
      // Must be at least 70% of the length
      const minLen = Math.min(user.length, correct.length);
      const maxLen = Math.max(user.length, correct.length);
      if (minLen / maxLen >= 0.7) return true;
    }

    // Calculate similarity (Levenshtein-like)
    const longer = user.length > correct.length ? user : correct;
    const shorter = user.length > correct.length ? correct : user;

    if (longer.length === 0) return false;

    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) matches++;
    }

    const similarity = matches / longer.length;
    return similarity >= 0.75; // 75% character overlap
  };

  // Handle answer submission
  const handleAnswerSubmit = () => {
    if (!fallingPiece || !userAnswer.trim()) return;

    const isCorrect = fuzzyMatch(userAnswer, fallingPiece.question.answer);

    if (isCorrect) {
      triggerHaptic('success'); // Success haptic
      setQuestionsAnswered(prev => prev + 1);
      setCorrectAnswers(prev => prev + 1);

      const comboMultiplier = currentCombo + 1;
      const basePoints = 50;
      const comboBonus = basePoints * comboMultiplier;
      setScore(prev => prev + comboBonus);

      setCurrentCombo(comboMultiplier);
      if (comboMultiplier > highestCombo) {
        setHighestCombo(comboMultiplier);
      }

      setShowFeedback("correct");

      // Place current piece if landed
      if (pieceLanded) {
        placePiece(fallingPiece);
      }

      // Move to NEXT QUESTION
      setFallingPiece(null);
      setPieceLanded(false);
      setCurrentQuestion(null);
      setPiecesForCurrentQuestion(0);

      setTimeout(() => {
        setShowFeedback(null);
        checkLines();
        spawnPiece();
      }, 500);

      setUserAnswer("");
      inputRef.current?.focus();
    } else {
      // Wrong answer - show feedback but keep trying
      triggerHaptic('error'); // Error haptic
      setShowFeedback("wrong");

      // Clear feedback after 2 seconds
      setTimeout(() => {
        setShowFeedback(null);
      }, 2000);

      // Clear input
      setTimeout(() => {
        setUserAnswer("");
        inputRef.current?.focus();
      }, 1500);

      // Note: Auto-spawn effect will handle spawning next piece when current lands
    }
  };

  // Handle "Don't Know"
  const handleDontKnow = () => {
    if (!currentQuestion) return;

    setQuestionsAnswered(prev => prev + 1);
    setCurrentCombo(0);
    setUserAnswer("");

    // Place current piece if it exists
    if (fallingPiece) {
      placePiece(fallingPiece);
    }

    // Move to NEXT QUESTION
    setFallingPiece(null);
    setPieceLanded(false);
    setCurrentQuestion(null);
    setPiecesForCurrentQuestion(0);

    setTimeout(() => {
      checkLines();
      spawnPiece();
    }, 100);
  };

  const handleGameOver = async () => {
    try {
      const response = await fetch("/api/blocks/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId,
          subjectName,
          score,
          questionsAnswered,
          correctAnswers,
          linesCleared,
          highestCombo,
          timeSeconds: elapsedTime,
          levelReached: level,
          contentSource,
        }),
      });

      const data = await response.json();
      setIsPersonalBest(data.isPersonalBest || false);
    } catch (error) {
      console.error("Error saving blocks game:", error);
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

  // Render piece on grid
  const renderGrid = () => {
    const displayGrid = grid.map(row => row.map(cell => ({ ...cell })));

    // Overlay falling piece
    if (fallingPiece) {
      const shape = TETROMINOS[fallingPiece.type].shape[fallingPiece.rotation];
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const gridRow = fallingPiece.row + row;
            const gridCol = fallingPiece.col + col;
            if (gridRow >= 0 && gridRow < GRID_HEIGHT && gridCol >= 0 && gridCol < GRID_WIDTH) {
              displayGrid[gridRow][gridCol] = {
                filled: true,
                color: fallingPiece.color,
              };
            }
          }
        }
      }
    }

    return displayGrid;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: "var(--card-border)", borderTopColor: "var(--primary)" }}></div>
      </div>
    );
  }

  if (!user) {
    const dest = artifactSlug ? `/blocks?artifact=${artifactSlug}` : "/blocks";
    router.push(`/login?redirect=${encodeURIComponent(dest)}`);
    return null;
  }

  if (gameState === "intro") {
    return <BlocksIntro onStart={handleStart} subjectName={subjectName} onBack={handleExit} />;
  }

  if (gameState === "complete") {
    return (
      <BlocksCompletion
        score={score}
        questionsAnswered={questionsAnswered}
        correctAnswers={correctAnswers}
        linesCleared={linesCleared}
        highestCombo={highestCombo}
        timeSeconds={elapsedTime}
        onPlayAgain={handleRestart}
        onExit={handleExit}
        isPersonalBest={isPersonalBest}
      />
    );
  }

  const displayGrid = renderGrid();

  // MAIN GAME LAYOUT
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-black/5 dark:border-white/5">
        <button
          onClick={handleGameOver}
          className="flex items-center gap-2 text-sm font-semibold text-[#5A6478] dark:text-slate-400 hover:text-[#16213E] dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-6 text-base font-bold text-[#16213E] dark:text-white">
          <span>Score: <span className="text-[#E76F51]">{score}</span></span>
          <span>Lines: <span className="text-[#4255FF]">{linesCleared}</span></span>
          <span>Combo: <span className="text-green-600">{currentCombo}×</span></span>
        </div>

        <button
          onClick={handleRestart}
          className="flex items-center gap-2 text-sm font-semibold text-[#5A6478] dark:text-slate-400 hover:text-[#16213E] dark:hover:text-white transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Restart</span>
        </button>
      </div>

      {/* Main Game Area: Question TOP-LEFT (desktop), Grid RIGHT (desktop), stacked on mobile */}
      <div className="flex-1 flex flex-col md:flex-row items-start justify-start md:justify-center gap-6 md:gap-8 lg:gap-12 px-4 md:px-8 py-4 md:py-6 overflow-hidden pb-28 md:pb-6 max-w-[1400px] mx-auto">
        {/* LEFT: Question Panel - Always show, use placeholder if loading */}
        {(fallingPiece || currentQuestion) && (
          <motion.div
            key={fallingPiece?.id || 'loading'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full md:w-[320px] lg:w-[380px] flex flex-col gap-4 flex-shrink-0"
          >
            {/* Question */}
            <div className="text-xl md:text-2xl font-bold text-[#16213E] dark:text-white leading-relaxed min-h-[60px] flex items-center">
              {fallingPiece?.question?.question || currentQuestion?.question || "Loading question..."}
            </div>

            {/* Answer Input */}
            <div className="space-y-3">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnswerSubmit()}
                placeholder="Type your answer..."
                autoFocus
                style={{ outline: 'none', boxShadow: 'none' }}
                className={`w-full rounded-lg px-4 py-3 border-2 transition-all text-base ${
                  showFeedback === "correct"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-[#16213E] dark:text-white"
                    : showFeedback === "wrong"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-[#16213E] dark:text-white"
                    : "border-gray-300 dark:border-slate-700 focus:border-gray-400 dark:focus:border-slate-500 bg-white dark:bg-slate-800 text-[#16213E] dark:text-white"
                }`}
              />

              <div className="flex justify-between items-center">
                <button
                  onClick={handleDontKnow}
                  className="text-sm text-[#5A6478] dark:text-slate-400 hover:text-[#16213E] dark:hover:text-white transition-colors underline"
                >
                  Don't Know? (Skip)
                </button>

                <button
                  onClick={handleAnswerSubmit}
                  disabled={!userAnswer.trim()}
                  className="px-6 py-2 rounded-lg bg-[#E76F51] hover:bg-[#d96043] text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-sm font-semibold p-3 rounded-lg ${
                    showFeedback === "correct"
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                  }`}
                >
                  {showFeedback === "correct"
                    ? "✓ Correct! Piece placed!"
                    : `✗ Wrong! Piece vanished. Answer: ${fallingPiece?.question?.answer || currentQuestion?.answer || ""}`}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instructions - Desktop only (mobile has touch controls) */}
            <div className="hidden md:block text-xs text-[#5A6478] dark:text-slate-400 space-y-1 pt-4 border-t border-black/5 dark:border-white/5">
              <div>← → Move piece</div>
              <div>↑ or Space: Rotate</div>
              <div>↓ Drop faster</div>
            </div>
          </motion.div>
        )}

        {/* RIGHT: Tetris Grid (Responsive Boxes) */}
        <div className="grid gap-0.5 md:gap-1 mx-auto flex-shrink-0" style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))` }}>
          {displayGrid.map((row, rowIdx) =>
            row.map((cell, colIdx) => {
              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className="relative rounded-sm md:rounded-lg w-[28px] h-[28px] md:w-[50px] md:h-[50px]"
                >
                  {cell.filled ? (
                    <div
                      className="w-full h-full rounded-lg shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${cell.color} 0%, ${adjustBrightness(cell.color, -15)} 100%)`,
                        boxShadow: `
                          0 4px 8px ${cell.color}50,
                          inset 0 2px 0 ${adjustBrightness(cell.color, 30)},
                          inset 0 -2px 0 ${adjustBrightness(cell.color, -30)}
                        `,
                        border: `2px solid ${adjustBrightness(cell.color, -20)}`,
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-lg"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                      }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MOBILE TOUCH CONTROLS - Fixed bottom, thumb-friendly zones */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-black/10 dark:border-white/10 px-6 py-4 pb-safe">
        <div className="flex items-center justify-between gap-6 max-w-md mx-auto">
          {/* LEFT: D-Pad (Move) */}
          <div className="flex items-center gap-2">
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                moveLeft();
              }}
              className="w-14 h-14 rounded-xl bg-[#FAF8F5] dark:bg-slate-800 border-2 border-black/10 dark:border-white/10 flex items-center justify-center active:scale-95 active:bg-[#E76F51] active:text-white transition-all shadow-soft"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              onTouchStart={(e) => {
                e.preventDefault();
                moveRight();
              }}
              className="w-14 h-14 rounded-xl bg-[#FAF8F5] dark:bg-slate-800 border-2 border-black/10 dark:border-white/10 flex items-center justify-center active:scale-95 active:bg-[#E76F51] active:text-white transition-all shadow-soft"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* CENTER: Drop Down */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              dropFaster();
            }}
            className="w-16 h-16 rounded-xl bg-[#E76F51] text-white flex items-center justify-center active:scale-95 transition-all shadow-pop font-bold text-sm"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* RIGHT: Rotate */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              rotatePiece();
            }}
            className="w-16 h-16 rounded-xl bg-[#4255FF] text-white flex items-center justify-center active:scale-95 transition-all shadow-pop font-bold text-sm"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.5 2V8H15.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 16C3 12.4 3.8 9.5 5.8 7.5C8 5.4 11.2 4.3 15 5L21.5 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12V17L8 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Helper text for first-time users */}
        <div className="text-center mt-3 text-xs text-[#5A6478] dark:text-slate-400 space-x-4">
          <span>⬅️➡️ Move</span>
          <span>⬇️ Drop</span>
          <span>🔄 Rotate</span>
        </div>
      </div>
    </div>
  );
}

export default function BlocksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
          <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: "var(--card-border)", borderTopColor: "var(--primary)" }}></div>
        </div>
      }
    >
      <BlocksGame />
    </Suspense>
  );
}
