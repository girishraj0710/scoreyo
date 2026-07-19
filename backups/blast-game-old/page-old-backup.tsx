"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/user-context";
import { useExamFilter } from "@/hooks/use-exam-filter";
import { X, Target, Zap } from "lucide-react";

// Game constants
const ASTEROID_COUNT = 4;
const LEVEL_TIME = 60; // 60 seconds per level
const POINTS_PER_LEVEL = 50;
const CORRECT_POINTS = 5;
const WRONG_PENALTY = 2;

interface QuestionData {
  id: string;
  question: string;
  answer: string;
  subject: string;
}

interface Asteroid {
  id: string;
  text: string;
  isCorrect: boolean;
  x: number; // 0-100 (percentage)
  y: number; // 0-100 (percentage)
  vx: number; // velocity x
  vy: number; // velocity y
  size: number;
  isExploding?: boolean; // For fade-out animation
  isClicked?: boolean; // Immediate highlight on click
}

interface PowerUp {
  id: string;
  type: "multishot" | "shield" | "freeze" | "double-points";
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Ship {
  x: number; // Fixed center
  y: number; // Fixed bottom
  angle: number; // Aim angle
}

interface Projectile {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface ScorePopup {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface BlastIntroProps {
  onStart: () => void;
  subjectName?: string;
}

function BlastIntro({ onStart, subjectName }: BlastIntroProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-[#0f0c29] via-[#1a1a3e] to-[#24243e]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        {/* Ship Illustration */}
        <div className="mb-8 flex justify-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.5)] relative"
          >
            <Target className="w-16 h-16 text-white" strokeWidth={2} />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-teal-400 blur-xl opacity-40 animate-pulse" />
          </motion.div>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-black mb-3 text-white">
          Play Blast!
        </h1>

        {subjectName && (
          <div className="text-xs uppercase font-bold text-teal-400 mb-4" style={{ letterSpacing: '0.2em' }}>
            {subjectName}
          </div>
        )}

        <p className="text-slate-300 mb-8">
          Match definitions to the correct terms. Click or tap the correct asteroid to destroy it with your ship's blaster before time runs out!
        </p>

        <button
          onClick={onStart}
          className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-4 px-6 transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] text-lg mb-4"
        >
          Play
        </button>

        <button
          onClick={() => setShowInstructions(true)}
          className="text-teal-400 hover:text-teal-300 font-semibold transition-colors"
        >
          How to play Blast
        </button>

        {/* Instructions Modal */}
        <AnimatePresence>
          {showInstructions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
              onClick={() => setShowInstructions(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-8 max-w-lg w-full border border-slate-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">How to play Blast</h2>
                  <button onClick={() => setShowInstructions(false)} className="text-slate-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4 text-slate-300">
                  <p>📍 <strong>Aim:</strong> Move your mouse to aim your ship's blaster.</p>
                  <p>💥 <strong>Shoot:</strong> Click on the correct asteroid to blast it.</p>
                  <p>⏱️ <strong>Timer:</strong> You have 60 seconds per level.</p>
                  <p>✅ <strong>Correct:</strong> Earn 5 points.</p>
                  <p>❌ <strong>Wrong:</strong> Lose 2 points.</p>
                  <p>🔥 <strong>Streak:</strong> Hit several correct asteroids in a row to build your streak bonus.</p>
                  <p>⚡ <strong>Power-ups:</strong> Blast special targets to earn ship abilities (multi-shot, shield, freeze, double points).</p>
                  <p>🎯 <strong>Goal:</strong> Reach 50 points to advance to the next level!</p>
                </div>

                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full mt-6 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 transition-colors"
                >
                  Got it!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

interface BlastCompletionProps {
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  highestStreak: number;
  levelsCompleted: number;
  onPlayAgain: () => void;
  onExit: () => void;
}

function BlastCompletion({
  score,
  questionsAnswered,
  correctAnswers,
  highestStreak,
  levelsCompleted,
  onPlayAgain,
  onExit,
}: BlastCompletionProps) {
  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-6 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full border border-slate-700 shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center shadow-[0_0_40px_rgba(20,184,166,0.4)]">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Game Over!</h2>
          <p className="text-slate-400">Great shooting, space cadet!</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center p-4 rounded-xl bg-slate-800/50">
            <span className="text-slate-400">Final Score</span>
            <span className="text-2xl font-bold text-teal-400">{score}</span>
          </div>
          <div className="flex justify-between items-center p-4 rounded-xl bg-slate-800/50">
            <span className="text-slate-400">Levels Completed</span>
            <span className="text-xl font-bold text-white">{levelsCompleted}</span>
          </div>
          <div className="flex justify-between items-center p-4 rounded-xl bg-slate-800/50">
            <span className="text-slate-400">Accuracy</span>
            <span className="text-xl font-bold text-white">{accuracy}%</span>
          </div>
          <div className="flex justify-between items-center p-4 rounded-xl bg-slate-800/50">
            <span className="text-slate-400">Highest Streak</span>
            <span className="text-xl font-bold text-orange-400">{highestStreak}x</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-3 transition-all shadow-lg"
          >
            Play Again
          </button>
          <button
            onClick={onExit}
            className="flex-1 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 transition-colors"
          >
            Exit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BlastGamePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const examFilterResult = useExamFilter();
  const examId = examFilterResult?.examId || "jee-main";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();

  // Game states
  const [gameState, setGameState] = useState<"intro" | "level-announcement" | "goal-announcement" | "playing" | "complete">("intro");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LEVEL_TIME);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [levelsCompleted, setLevelsCompleted] = useState(0);

  // Question data
  const [questionQueue, setQuestionQueue] = useState<QuestionData[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [subjectName, setSubjectName] = useState<string>("");

  // Ship
  const [ship, setShip] = useState<Ship>({ x: 50, y: 85, angle: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Active power-ups
  const [activePowerUps, setActivePowerUps] = useState<{
    multishot?: number; // timestamp when expires
    shield?: number;
    freeze?: number;
    doublePoints?: number;
  }>({});

  // Particle effects
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; color: string }>>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);

  // Load questions
  const loadQuestions = async () => {
    try {
      const response = await fetch(`/api/match/content?examId=${examId}`);
      const data = await response.json();

      const questions: QuestionData[] = [];
      for (let i = 0; i < data.pairCount; i++) {
        const qCard = data.cards.find((c: any) => c.pairId === i && c.type === "question");
        const aCard = data.cards.find((c: any) => c.pairId === i && c.type === "answer");

        if (qCard && aCard) {
          questions.push({
            id: `q_${Date.now()}_${i}`,
            question: qCard.content,
            answer: aCard.content,
            subject: qCard.subject || "General",
          });
        }
      }

      setQuestionQueue(questions);
      if (questions.length > 0) {
        setSubjectName(questions[0].subject);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  };

  useEffect(() => {
    if (user && !isLoading) {
      loadQuestions();
    }
  }, [user, isLoading]);

  // Mouse tracking removed - only shoot when clicking asteroid

  // Start game flow
  const handleStart = () => {
    setGameState("level-announcement");
    setTimeout(() => {
      setGameState("goal-announcement");
      setTimeout(() => {
        setGameState("playing");
        spawnQuestion();
      }, 2000);
    }, 2000);
  };

  // Spawn new question with asteroids
  const spawnQuestion = useCallback(() => {
    if (questionQueue.length === 0) {
      loadQuestions();
      return;
    }

    const nextQuestion = questionQueue[0];
    setCurrentQuestion(nextQuestion);
    setQuestionQueue((prev) => prev.slice(1));

    // Create 4 asteroids (1 correct + 3 wrong)
    const correctAnswer = nextQuestion.answer;
    const wrongAnswers: string[] = [];

    // Get 3 random wrong answers from other questions
    const otherQuestions = questionQueue.slice(1);
    while (wrongAnswers.length < 3 && otherQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherQuestions.length);
      const answer = otherQuestions[randomIndex].answer;
      if (answer !== correctAnswer && !wrongAnswers.includes(answer)) {
        wrongAnswers.push(answer);
      }
      otherQuestions.splice(randomIndex, 1);
    }

    // Fill remaining with placeholder if needed
    while (wrongAnswers.length < 3) {
      wrongAnswers.push(`Option ${wrongAnswers.length + 1}`);
    }

    // Shuffle and create asteroids
    const allAnswers = [
      { text: correctAnswer, isCorrect: true },
      ...wrongAnswers.map((text) => ({ text, isCorrect: false })),
    ].sort(() => Math.random() - 0.5);

    // Fixed positions in 2x2 grid - NO MOVEMENT, NO OVERLAP
    const positions = [
      { x: 25, y: 25 }, // Top-left
      { x: 75, y: 25 }, // Top-right
      { x: 25, y: 55 }, // Bottom-left
      { x: 75, y: 55 }, // Bottom-right
    ];

    const newAsteroids: Asteroid[] = allAnswers.map((answer, index) => ({
      id: `asteroid_${Date.now()}_${index}`,
      text: answer.text,
      isCorrect: answer.isCorrect,
      x: positions[index].x, // Fixed position
      y: positions[index].y, // Fixed position
      vx: 0, // No velocity
      vy: 0, // No velocity
      size: 200,
      isExploding: false,
      isClicked: false,
    }));

    setAsteroids(newAsteroids);

    // Power-ups removed for cleaner gameplay
  }, [questionQueue]);

  // Spawn power-up
  const spawnPowerUp = () => {
    const types: Array<"multishot" | "shield" | "freeze" | "double-points"> = [
      "multishot",
      "shield",
      "freeze",
      "double-points",
    ];
    const type = types[Math.floor(Math.random() * types.length)];

    const newPowerUp: PowerUp = {
      id: `powerup_${Date.now()}`,
      type,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 0.08, // Reduced from 0.4 to 0.08
      vy: (Math.random() - 0.5) * 0.08, // Reduced from 0.4 to 0.08
    };

    setPowerUps((prev) => [...prev, newPowerUp]);
  };

  // Handle asteroid click
  const handleAsteroidClick = (asteroid: Asteroid) => {
    // INSTANT HIGHLIGHT - Mark clicked asteroid immediately (green/red border)
    setAsteroids((prev) =>
      prev.map((a) => (a.id === asteroid.id ? { ...a, isClicked: true } : a))
    );

    // Shoot projectile immediately (no delay)
    const projectile: Projectile = {
      id: `proj_${Date.now()}`,
      startX: ship.x,
      startY: ship.y,
      endX: asteroid.x,
      endY: asteroid.y,
    };

    setProjectiles((prev) => [...prev, projectile]);

    // Wait for projectile animation (200ms - faster) then create explosion
    setTimeout(() => {
      // Remove projectile
      setProjectiles((prev) => prev.filter((p) => p.id !== projectile.id));

      // Create particle explosion
      createParticles(asteroid.x, asteroid.y, asteroid.isCorrect ? "#14b8a6" : "#ef4444");

      // Create score popup
      createScorePopup(asteroid.x, asteroid.y, asteroid.isCorrect);

      // Mark all asteroids as exploding (fade out)
      setAsteroids((prev) => prev.map((a) => ({ ...a, isExploding: true })));

      // Wait for explosion + fade out (500ms) before processing answer
      setTimeout(() => {
        setQuestionsAnswered((prev) => prev + 1);

        if (asteroid.isCorrect) {
          // Correct answer
          setCorrectAnswers((prev) => prev + 1);
          setCurrentStreak((prev) => prev + 1);
          if (currentStreak + 1 > highestStreak) {
            setHighestStreak(currentStreak + 1);
          }

          const basePoints = CORRECT_POINTS;
          const streakBonus = Math.floor(currentStreak * 0.5);
          const totalPoints = basePoints + streakBonus;

          setScore((prev) => prev + totalPoints);

          // Check if level complete
          if (score + totalPoints >= currentLevel * POINTS_PER_LEVEL) {
            handleLevelComplete();
          } else {
            spawnQuestion();
          }
        } else {
          // Wrong answer
          setCurrentStreak(0);
          setScore((prev) => Math.max(0, prev - WRONG_PENALTY));
          spawnQuestion();
        }
      }, 500); // Faster transition
    }, 200); // Faster projectile
  };

  // Handle power-up click
  const handlePowerUpClick = (powerUp: PowerUp) => {
    createParticles(powerUp.x, powerUp.y, "#fbbf24");

    const now = Date.now();
    const duration = 15000; // 15 seconds

    setActivePowerUps((prev) => ({
      ...prev,
      [powerUp.type]: now + duration,
    }));

    setPowerUps((prev) => prev.filter((p) => p.id !== powerUp.id));
  };

  // Create particle effect
  const createParticles = (x: number, y: number, color: string) => {
    const newParticles = Array.from({ length: 16 }, (_, i) => ({
      id: `particle_${Date.now()}_${i}`,
      x,
      y,
      color,
    }));
    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1000);
  };

  // Create score popup (shows +5 or -2)
  const createScorePopup = (x: number, y: number, isCorrect: boolean) => {
    const popup: ScorePopup = {
      id: `popup_${Date.now()}`,
      x,
      y,
      text: isCorrect ? "+5" : "-2",
      color: isCorrect ? "#14b8a6" : "#ef4444",
    };

    setScorePopups((prev) => [...prev, popup]);

    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== popup.id));
    }, 1000);
  };

  // Level complete
  const handleLevelComplete = () => {
    setLevelsCompleted((prev) => prev + 1);
    setCurrentLevel((prev) => prev + 1);
    setTimeLeft(LEVEL_TIME);
    setGameState("level-announcement");

    setTimeout(() => {
      setGameState("goal-announcement");
      setTimeout(() => {
        setGameState("playing");
        spawnQuestion();
      }, 2000);
    }, 2000);
  };

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("complete");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // NO PHYSICS LOOP - Asteroids stay still for easy clicking
  // This prevents the collision/movement issues

  // Handle play again
  const handlePlayAgain = () => {
    setGameState("intro");
    setCurrentLevel(1);
    setScore(0);
    setTimeLeft(LEVEL_TIME);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setCurrentStreak(0);
    setHighestStreak(0);
    setLevelsCompleted(0);
    setAsteroids([]);
    setPowerUps([]);
    setActivePowerUps({});
    loadQuestions();
  };

  const handleExit = () => {
    router.push("/");
  };

  // Render states
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0c29] via-[#1a1a3e] to-[#24243e]">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (gameState === "intro") {
    return <BlastIntro onStart={handleStart} subjectName={subjectName} />;
  }

  if (gameState === "complete") {
    return (
      <BlastCompletion
        score={score}
        questionsAnswered={questionsAnswered}
        correctAnswers={correctAnswers}
        highestStreak={highestStreak}
        levelsCompleted={levelsCompleted}
        onPlayAgain={handlePlayAgain}
        onExit={handleExit}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#0f0c29] via-[#1a1a3e] to-[#24243e] overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 stars-bg" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#1e1b4b] to-transparent z-10 flex items-center justify-between px-6">
        <div className="text-white font-semibold">Lvl {currentLevel}</div>
        <div className="text-white font-semibold">{currentQuestion?.question || ""}</div>
        <button
          onClick={handleExit}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Level/Goal Announcement */}
      <AnimatePresence>
        {gameState === "level-announcement" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center z-50"
          >
            <h1 className="text-6xl font-black text-yellow-300">Level {currentLevel}</h1>
          </motion.div>
        )}

        {gameState === "goal-announcement" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center z-50"
          >
            <h1 className="text-5xl font-black text-yellow-300">Goal: {currentLevel * POINTS_PER_LEVEL} points</h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game area */}
      {gameState === "playing" && (
        <>
          {/* Asteroids */}
          <AnimatePresence mode="popLayout">
            {asteroids.map((asteroid) => (
              <motion.div
                key={asteroid.id}
                className="absolute cursor-pointer z-30"
                style={{
                  left: `${asteroid.x}%`,
                  top: `${asteroid.y}%`,
                  width: `${asteroid.size}px`,
                  height: `${asteroid.size}px`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!asteroid.isExploding && !asteroid.isClicked) {
                    handleAsteroidClick(asteroid);
                  }
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: asteroid.isExploding ? 0 : 1,
                  opacity: asteroid.isExploding ? 0 : 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                whileHover={!asteroid.isExploding && !asteroid.isClicked ? { scale: 1.05 } : {}}
                whileTap={!asteroid.isExploding && !asteroid.isClicked ? { scale: 0.98 } : {}}
              >
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 opacity-30 blur-xl pointer-events-none" />
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center p-6 transition-all duration-150 ${
                      asteroid.isClicked
                        ? asteroid.isCorrect
                          ? 'border-4 border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.8)]' // Green highlight
                          : 'border-4 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.8)]' // Red highlight
                        : 'border-2 border-purple-300/30'
                    }`}
                  >
                    <p className="text-white text-center text-sm leading-tight font-medium overflow-hidden line-clamp-6" style={{ wordBreak: "break-word" }}>
                      {asteroid.text.length > 120 ? asteroid.text.substring(0, 120) + "..." : asteroid.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Power-ups removed for cleaner gameplay */}

          {/* Projectiles (shooting animation) */}
          {projectiles.map((projectile) => (
            <motion.div
              key={projectile.id}
              className="absolute w-4 h-4 rounded-full bg-teal-400 z-40"
              style={{
                boxShadow: "0 0 20px rgba(20,184,166,1), 0 0 40px rgba(20,184,166,0.8)",
              }}
              initial={{
                left: `${projectile.startX}%`,
                top: `${projectile.startY}%`,
              }}
              animate={{
                left: `${projectile.endX}%`,
                top: `${projectile.endY}%`,
              }}
              transition={{ duration: 0.3, ease: "linear" }}
            />
          ))}

          {/* Particles (explosion effect) */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-6 h-6 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                backgroundColor: particle.color,
                boxShadow: `0 0 20px ${particle.color}, 0 0 40px ${particle.color}`,
              }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                scale: 0,
                opacity: 0,
                x: (Math.random() - 0.5) * 150,
                y: (Math.random() - 0.5) * 150,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          ))}

          {/* Score popups (+5 or -2) */}
          {scorePopups.map((popup) => (
            <motion.div
              key={popup.id}
              className="absolute font-black text-6xl pointer-events-none z-50"
              style={{
                left: `${popup.x}%`,
                top: `${popup.y}%`,
                color: popup.color,
                textShadow: `0 0 20px ${popup.color}, 0 0 40px ${popup.color}`,
              }}
              initial={{ scale: 0.5, opacity: 1, y: 0 }}
              animate={{ scale: 2, opacity: 0, y: -80 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {popup.text}
            </motion.div>
          ))}

          {/* Ship */}
          <div
            className="absolute"
            style={{
              left: `${ship.x}%`,
              top: `${ship.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative w-24 h-24">
              {/* Ship glow */}
              <div className="absolute inset-0 rounded-full bg-teal-400 opacity-40 blur-xl animate-pulse" />
              {/* Ship body */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 to-green-500 border-4 border-teal-300 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500" />
                </div>
              </div>
              {/* Aim line removed - only shows when shooting */}
            </div>
          </div>

          {/* Bottom HUD */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1e1b4b] to-transparent z-10 flex items-center justify-between px-6">
            <div className="text-white">
              <div className="text-sm text-slate-400">Level {currentLevel}</div>
              <div className="text-2xl font-bold">{score}/{currentLevel * POINTS_PER_LEVEL}</div>
            </div>

            <div className="text-white text-center">
              <div className="text-4xl font-bold">{timeLeft}</div>
              <div className="text-sm text-slate-400">seconds</div>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-400">Streak</div>
              <div className="text-2xl font-bold text-orange-400">{currentStreak}x</div>
            </div>
          </div>

          {/* Power-ups display removed */}
        </>
      )}

      <style jsx global>{`
        .stars-bg {
          background-image:
            radial-gradient(2px 2px at 20px 30px, white, transparent),
            radial-gradient(2px 2px at 60px 70px, white, transparent),
            radial-gradient(1px 1px at 50px 50px, white, transparent),
            radial-gradient(1px 1px at 130px 80px, white, transparent),
            radial-gradient(2px 2px at 90px 10px, white, transparent);
          background-size: 200px 200px;
          background-repeat: repeat;
          animation: twinkle 3s infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
