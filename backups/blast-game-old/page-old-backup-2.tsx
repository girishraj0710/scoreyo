"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Zap, Trophy, RotateCw } from "lucide-react";

// Game constants
const LEVEL_TIME = 60;
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
  label: string;
  isCorrect: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  shape: string;
  rotate: number;
  isClicked?: boolean;
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

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

// Star field background (fixed positions to avoid hydration error)
const StarField = React.memo(() => {
  const stars = useMemo(() => {
    // Use fixed seed-based positions to match server and client
    const fixedStars = [];
    for (let i = 0; i < 80; i++) {
      fixedStars.push({
        left: ((i * 7 + 13) % 100),
        top: ((i * 11 + 17) % 100),
        size: 0.5 + ((i % 4) * 0.5),
        delay: (i % 6) * 0.5,
        duration: 1.5 + ((i % 3) * 0.5),
      });
    }
    return fixedStars;
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(88,28,135,0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(37,99,235,0.35) 0%, transparent 55%), radial-gradient(ellipse at 60% 20%, rgba(15,30,61,0.6) 0%, transparent 60%)",
        }}
      />
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
          }}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
});

StarField.displayName = "StarField";

// Large circular ship with rotating particles (Quizlet style)
const Ship = () => {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    angle: (i / 8) * Math.PI * 2,
    delay: i * 0.125,
  }));

  return (
    <motion.div
      className="absolute left-1/2 bottom-8 -translate-x-1/2 z-20 pointer-events-none"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
        <defs>
          <radialGradient id="shipGrad" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#22C55E" />
          </radialGradient>
        </defs>

        {/* Main ship circle */}
        <circle cx="50" cy="50" r="40" fill="url(#shipGrad)" />

        {/* Dark border */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="#166534" strokeWidth="2.5" opacity="0.7" />

        {/* Rotating particles around edge (Quizlet style) */}
        {particles.map((p, i) => (
          <motion.g
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: p.delay }}
            style={{ transformOrigin: "50px 50px" }}
          >
            <circle
              cx={50 + Math.cos(p.angle) * 46}
              cy={50 + Math.sin(p.angle) * 46}
              r="3"
              fill="#86EFAC"
              opacity="0.8"
            />
            <motion.circle
              cx={50 + Math.cos(p.angle) * 46}
              cy={50 + Math.sin(p.angle) * 46}
              r="5"
              fill="none"
              stroke="#86EFAC"
              strokeWidth="1.5"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: p.delay }}
            />
          </motion.g>
        ))}

        {/* Highlight */}
        <ellipse cx="40" cy="38" rx="14" ry="10" fill="white" opacity="0.25" />

        {/* Center white circle */}
        <circle cx="50" cy="50" r="18" fill="white" opacity="0.9" />
        <circle cx="50" cy="50" r="12" fill="#22C55E" opacity="0.3" />
      </svg>
    </motion.div>
  );
};

// Explosion particles
const Explosion = ({ x, y, correct }: { x: number; y: number; correct: boolean }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        angle: (i / 14) * Math.PI * 2,
        dist: rand(60, 130),
        size: rand(4, 10),
      })),
    []
  );
  const color = correct ? "#FCD34D" : "#EF4444";
  const color2 = correct ? "#F97316" : "#7F1D1D";
  return (
    <motion.div
      className="absolute pointer-events-none z-30"
      style={{ left: x, top: y }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: p.id % 2 ? color : color2 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            opacity: 0,
            scale: 0.2,
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ))}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 60,
          height: 60,
          left: -30,
          top: -30,
          background: `radial-gradient(circle, ${color} 0%, ${color2} 50%, transparent 80%)`,
        }}
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};

// Check if position overlaps with existing asteroids
const hasOverlap = (x: number, y: number, size: number, existing: Asteroid[]): boolean => {
  for (const ast of existing) {
    const dx = (x + size / 2) - (ast.x + ast.size / 2);
    const dy = (y + size / 2) - (ast.y + ast.size / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (size + ast.size) / 2 + 20; // 20px padding
    if (distance < minDistance) return true;
  }
  return false;
};

// Build asteroid
const buildAsteroid = (
  id: string,
  label: string,
  isCorrect: boolean,
  bounds: { w: number; h: number },
  level: number,
  existing: Asteroid[] = []
): Asteroid => {
  const size = 150; // Fixed size - Quizlet style
  const speedMul = 1 + (level - 1) * 0.15;
  const speed = rand(0.3, 0.5) * speedMul;
  const angle = rand(0, Math.PI * 2);

  // Find non-overlapping position
  let x = 0;
  let y = 0;
  let attempts = 0;
  const maxAttempts = 50;

  do {
    x = rand(20, bounds.w - size - 20);
    y = rand(80, Math.max(90, bounds.h - size - 220));
    attempts++;
  } while (hasOverlap(x, y, size, existing) && attempts < maxAttempts);

  return {
    id,
    label,
    isCorrect,
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size,
    shape: "", // Not used anymore
    rotate: 0,
    isClicked: false,
  };
};

export default function BlastGame() {
  const router = useRouter();

  // Force reload verification
  console.log("🎮 Blast Game Loaded - Quizlet Style v2.0");

  const [phase, setPhase] = useState<"playing" | "victory" | "gameover">("playing");
  const [qIndex, setQIndex] = useState(0);
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [explosions, setExplosions] = useState<Array<{ id: string; x: number; y: number; correct: boolean }>>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [locked, setLocked] = useState(false);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(LEVEL_TIME);
  const [correct, setCorrect] = useState(0);

  const [bounds, setBounds] = useState({ w: 800, h: 600 });
  const arenaRef = useRef<HTMLDivElement>(null);

  const sampleQuestions: QuestionData[] = useMemo(
    () => [
      { id: "1", question: "What is the capital of France?", answer: "Paris", subject: "Geography" },
      { id: "2", question: "What is 2 + 2?", answer: "4", subject: "Math" },
      { id: "3", question: "Who wrote Romeo and Juliet?", answer: "Shakespeare", subject: "Literature" },
      { id: "4", question: "What is the largest planet?", answer: "Jupiter", subject: "Science" },
      { id: "5", question: "What year did WW2 end?", answer: "1945", subject: "History" },
    ],
    []
  );

  const currentQuestion = sampleQuestions[qIndex % sampleQuestions.length];

  // Measure arena
  useEffect(() => {
    const measure = () => {
      if (arenaRef.current) {
        const r = arenaRef.current.getBoundingClientRect();
        setBounds({ w: r.width, h: r.height });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Spawn asteroids (prevent overlap)
  useEffect(() => {
    if (phase !== "playing") return;
    const q = currentQuestion;
    const wrongAnswers = sampleQuestions
      .filter((qq) => qq.id !== q.id)
      .map((qq) => qq.answer)
      .slice(0, 3);
    const allOptions = [q.answer, ...wrongAnswers];
    const shuffled = allOptions.sort(() => Math.random() - 0.5);

    // Build asteroids one by one, checking for overlap
    const newAsteroids: Asteroid[] = [];
    for (let i = 0; i < shuffled.length; i++) {
      const ast = buildAsteroid(`ast-${qIndex}-${i}`, shuffled[i], shuffled[i] === q.answer, bounds, level, newAsteroids);
      newAsteroids.push(ast);
    }

    setAsteroids(newAsteroids);
  }, [qIndex, phase, currentQuestion, sampleQuestions, bounds, level]);

  // Physics loop with collision detection
  useEffect(() => {
    if (phase !== "playing") return;
    let raf: number;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      setAsteroids((prev) => {
        // First pass: update positions
        let updated = prev.map((a) => {
          let nx = a.x + a.vx * dt * 0.06;
          let ny = a.y + a.vy * dt * 0.06;
          let vx = a.vx;
          let vy = a.vy;
          const maxX = bounds.w - a.size;
          const minY = 90;
          const maxY = bounds.h - a.size - 140;
          // Wall bouncing
          if (nx <= 0) {
            nx = 0;
            vx = Math.abs(vx);
          }
          if (nx >= maxX) {
            nx = maxX;
            vx = -Math.abs(vx);
          }
          if (ny <= minY) {
            ny = minY;
            vy = Math.abs(vy);
          }
          if (ny >= maxY) {
            ny = maxY;
            vy = -Math.abs(vy);
          }
          return { ...a, x: nx, y: ny, vx, vy };
        });

        // Second pass: check collisions and drift apart
        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const a1 = updated[i];
            const a2 = updated[j];
            const dx = (a2.x + a2.size / 2) - (a1.x + a1.size / 2);
            const dy = (a2.y + a2.size / 2) - (a1.y + a1.size / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = (a1.size + a2.size) / 2;

            // If colliding, drift apart with STRONG repulsion
            if (distance < minDistance && distance > 0) {
              const overlap = minDistance - distance;
              // Much stronger position correction
              const pushX = (dx / distance) * overlap * 0.7;
              const pushY = (dy / distance) * overlap * 0.7;

              // MUCH stronger repulsion velocity (5x stronger)
              const repulsion = 2.0;
              const repelX = (dx / distance) * repulsion;
              const repelY = (dy / distance) * repulsion;

              // Push both asteroids apart with STRONG force
              updated[i] = {
                ...a1,
                x: a1.x - pushX,
                y: a1.y - pushY,
                vx: a1.vx - repelX,  // Strong repulsion
                vy: a1.vy - repelY,
              };
              updated[j] = {
                ...a2,
                x: a2.x + pushX,
                y: a2.y + pushY,
                vx: a2.vx + repelX,  // Strong repulsion
                vy: a2.vy + repelY,
              };
            }
          }
        }

        return updated;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, bounds]);

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    const iv = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(iv);
          setPhase("gameover");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [phase]);

  // Victory condition (50 correct)
  useEffect(() => {
    if (correct >= 50) {
      setPhase("victory");
    }
  }, [correct]);

  const handleAsteroidClick = (ast: Asteroid) => {
    if (locked || phase !== "playing" || ast.isClicked) return;
    setLocked(true);

    // Instant highlight
    setAsteroids((prev) => prev.map((a) => (a.id === ast.id ? { ...a, isClicked: true } : a)));

    // Shoot projectile
    const shipX = bounds.w / 2;
    const shipY = bounds.h - 40;
    const targetX = ast.x + ast.size / 2;
    const targetY = ast.y + ast.size / 2;
    const projId = `proj-${Date.now()}`;
    setProjectiles((prev) => [...prev, { id: projId, startX: shipX, startY: shipY, endX: targetX, endY: targetY }]);

    setTimeout(() => {
      setProjectiles((prev) => prev.filter((p) => p.id !== projId));

      // Explosion
      const expId = `exp-${Date.now()}`;
      setExplosions((prev) => [...prev, { id: expId, x: targetX, y: targetY, correct: ast.isCorrect }]);
      setTimeout(() => {
        setExplosions((prev) => prev.filter((e) => e.id !== expId));
      }, 800);

      // Score popup
      const popId = `pop-${Date.now()}`;
      if (ast.isCorrect) {
        setScore((s) => s + CORRECT_POINTS);
        setStreak((st) => {
          const newStreak = st + 1;
          if (newStreak > bestStreak) setBestStreak(newStreak);
          return newStreak;
        });
        setCorrect((c) => {
          const newCorrect = c + 1;
          const newLevel = Math.floor(newCorrect / 10) + 1;
          if (newLevel > level) setLevel(newLevel);
          return newCorrect;
        });
        setScorePopups((prev) => [...prev, { id: popId, x: targetX, y: targetY, text: `+${CORRECT_POINTS}`, color: "#FCD34D" }]);
      } else {
        setScore((s) => Math.max(0, s - WRONG_PENALTY));
        setStreak(0);
        setScorePopups((prev) => [...prev, { id: popId, x: targetX, y: targetY, text: `-${WRONG_PENALTY}`, color: "#EF4444" }]);
      }
      setTimeout(() => {
        setScorePopups((prev) => prev.filter((p) => p.id !== popId));
      }, 1000);

      // Next question
      setTimeout(() => {
        setQIndex((i) => i + 1);
        setLocked(false);
      }, 500);
    }, 200);
  };

  const handleRestart = () => {
    setPhase("playing");
    setQIndex(0);
    setScore(0);
    setStreak(0);
    setLevel(1);
    setCorrect(0);
    setTimeLeft(LEVEL_TIME);
    setLocked(false);
    setAsteroids([]);
    setProjectiles([]);
    setExplosions([]);
    setScorePopups([]);
  };

  const streakPct = (streak % 10) * 10;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a1a] via-[#0f0f28] to-[#141430]">
      <StarField />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <button onClick={() => router.push("/")} className="text-slate-300 hover:text-white transition-colors">
          <X size={24} />
        </button>
        <div className="text-white font-bold text-lg">Blast</div>
        <div className="w-6" />
      </div>

      {phase === "playing" && (
        <>
          {/* Question - LARGE BANNER like Quizlet */}
          <div className="relative z-10 w-full py-6 px-6" style={{ background: "linear-gradient(135deg, #4338CA 0%, #3730A3 100%)" }}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-white/80 text-xs uppercase font-bold mb-2" style={{ letterSpacing: "0.15em" }}>
                Question {qIndex + 1}
              </div>
              <div className="text-white text-2xl font-bold leading-tight">{currentQuestion.question}</div>
            </div>
          </div>

          {/* Arena */}
          <div ref={arenaRef} className="relative mx-auto" style={{ width: "90%", height: "60vh", maxWidth: "1200px" }}>
            {/* Asteroids - Quizlet style circles */}
            <AnimatePresence>
              {asteroids.map((ast) => (
                <motion.div
                  key={ast.id}
                  className="absolute cursor-pointer z-30"
                  style={{ left: ast.x, top: ast.y, width: ast.size, height: ast.size }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAsteroidClick(ast);
                  }}
                >
                  {/* Clean scalloped blob (Quizlet style) */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                    <defs>
                      <radialGradient id={`blob-${ast.id}`} cx="35%" cy="35%" r="65%">
                        {ast.isClicked ? (
                          ast.isCorrect ? (
                            <>
                              <stop offset="0%" stopColor="#93C5FD" />
                              <stop offset="100%" stopColor="#3B82F6" />
                            </>
                          ) : (
                            <>
                              <stop offset="0%" stopColor="#FCA5A5" />
                              <stop offset="100%" stopColor="#EF4444" />
                            </>
                          )
                        ) : (
                          <>
                            <stop offset="0%" stopColor="#C7D2FE" />
                            <stop offset="100%" stopColor="#6366F1" />
                          </>
                        )}
                      </radialGradient>
                    </defs>
                    {/* Wavy ruffled blob like Quizlet (14 visible waves) */}
                    <path
                      d={(() => {
                        const waves = 14; // More visible waves
                        const baseRadius = 36;
                        const waveDepth = 6; // More pronounced waves

                        let path = '';

                        // Use asteroid ID for consistent unique shape
                        const seed = parseInt(ast.id.split('-').pop() || '0', 10);

                        for (let i = 0; i < waves; i++) {
                          const angle1 = (i / waves) * Math.PI * 2;
                          const angle2 = ((i + 0.5) / waves) * Math.PI * 2;
                          const angle3 = ((i + 1) / waves) * Math.PI * 2;

                          // Create wavy ruffle effect
                          const r1 = baseRadius + Math.sin(seed + i) * 1.5;
                          const r2 = baseRadius + waveDepth + Math.cos(seed + i) * 1.5;
                          const r3 = baseRadius + Math.sin(seed + i + 1) * 1.5;

                          const x1 = 50 + Math.cos(angle1) * r1;
                          const y1 = 50 + Math.sin(angle1) * r1;
                          const x2 = 50 + Math.cos(angle2) * r2;
                          const y2 = 50 + Math.sin(angle2) * r2;
                          const x3 = 50 + Math.cos(angle3) * r3;
                          const y3 = 50 + Math.sin(angle3) * r3;

                          if (i === 0) {
                            path = `M ${x1},${y1} `;
                          }

                          // Quadratic curve for smooth waves
                          path += `Q ${x2},${y2} ${x3},${y3} `;
                        }

                        return path + 'Z';
                      })()}
                      fill={`url(#blob-${ast.id})`}
                    />
                    {/* Wavy border */}
                    <path
                      d={(() => {
                        const waves = 14;
                        const baseRadius = 36;
                        const waveDepth = 6;
                        const seed = parseInt(ast.id.split('-').pop() || '0', 10);

                        let path = '';

                        for (let i = 0; i < waves; i++) {
                          const angle1 = (i / waves) * Math.PI * 2;
                          const angle2 = ((i + 0.5) / waves) * Math.PI * 2;
                          const angle3 = ((i + 1) / waves) * Math.PI * 2;

                          const r1 = baseRadius + Math.sin(seed + i) * 1.5;
                          const r2 = baseRadius + waveDepth + Math.cos(seed + i) * 1.5;
                          const r3 = baseRadius + Math.sin(seed + i + 1) * 1.5;

                          const x1 = 50 + Math.cos(angle1) * r1;
                          const y1 = 50 + Math.sin(angle1) * r1;
                          const x2 = 50 + Math.cos(angle2) * r2;
                          const y2 = 50 + Math.sin(angle2) * r2;
                          const x3 = 50 + Math.cos(angle3) * r3;
                          const y3 = 50 + Math.sin(angle3) * r3;

                          if (i === 0) {
                            path = `M ${x1},${y1} `;
                          }

                          path += `Q ${x2},${y2} ${x3},${y3} `;
                        }

                        return path + 'Z';
                      })()}
                      fill="none"
                      stroke={ast.isClicked ? (ast.isCorrect ? "#1E40AF" : "#B91C1C") : "#4338CA"}
                      strokeWidth="2"
                      opacity="0.6"
                    />
                    {/* Subtle inner highlight */}
                    <ellipse
                      cx="42"
                      cy="38"
                      rx="12"
                      ry="8"
                      fill="white"
                      opacity="0.25"
                    />
                  </svg>
                  {/* Text overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="px-4 py-2 text-center max-w-[80%]">
                      <div className="text-white font-bold text-sm leading-tight drop-shadow-lg">{ast.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Projectiles - Laser beam (the working version you liked) */}
            <AnimatePresence>
              {projectiles.map((proj) => (
                <motion.svg
                  key={proj.id}
                  className="absolute inset-0 pointer-events-none z-25"
                  style={{ width: "100%", height: "100%" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <defs>
                    <linearGradient id={`laser-${proj.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(34,211,238,0)" />
                      <stop offset="30%" stopColor="rgba(34,211,238,0.8)" />
                      <stop offset="50%" stopColor="rgba(34,211,238,1)" />
                      <stop offset="70%" stopColor="rgba(34,211,238,0.8)" />
                      <stop offset="100%" stopColor="rgba(34,211,238,0)" />
                    </linearGradient>
                  </defs>
                  <motion.line
                    x1={proj.startX}
                    y1={proj.startY}
                    x2={proj.startX}
                    y2={proj.startY}
                    stroke={`url(#laser-${proj.id})`}
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ x2: proj.startX, y2: proj.startY }}
                    animate={{ x2: proj.endX, y2: proj.endY }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(34,211,238,0.9))",
                    }}
                  />
                </motion.svg>
              ))}
            </AnimatePresence>

            {/* Explosions */}
            <AnimatePresence>
              {explosions.map((exp) => (
                <Explosion key={exp.id} x={exp.x} y={exp.y} correct={exp.correct} />
              ))}
            </AnimatePresence>

            {/* Score popups */}
            <AnimatePresence>
              {scorePopups.map((pop) => (
                <motion.div
                  key={pop.id}
                  className="absolute z-40 pointer-events-none font-black text-2xl"
                  style={{ left: pop.x, top: pop.y, color: pop.color }}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -60, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {pop.text}
                </motion.div>
              ))}
            </AnimatePresence>

            <Ship />
          </div>

          {/* Bottom HUD - Quizlet style */}
          <div className="relative z-10 px-6 py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
              {/* Left: Score + Level (horizontal like Quizlet) */}
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-start">
                  <div className="text-xs text-white/60 uppercase font-bold mb-1">Score</div>
                  <div className="text-3xl font-black">{score}</div>
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-xs text-white/60 uppercase font-bold mb-1">Level</div>
                  <div className="text-3xl font-black">{level}</div>
                </div>
              </div>

              {/* Center: Time */}
              <div className="text-center">
                <div className="text-xs text-white/60 uppercase font-bold mb-1">Time</div>
                <div className="text-3xl font-black">{timeLeft}s</div>
              </div>

              {/* Right: Streak bar with lightning */}
              <div className="flex items-center gap-3">
                <Zap size={18} className="text-purple-300" fill="#C084FC" />
                <div className="text-white font-bold text-xl">{streak}</div>
                <div className="w-40 h-3 rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #7C3AED, #A855F7, #D946EF)",
                      boxShadow: "0 0 12px rgba(168,85,247,0.6)",
                    }}
                    animate={{ width: `${streakPct}%` }}
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Victory Screen */}
      {phase === "victory" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full mx-6 border border-slate-700 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Trophy size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Victory!</h2>
            <p className="text-slate-300 mb-6">You completed 50 correct answers!</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-xs text-white/60 uppercase font-bold mb-1">Score</div>
                <div className="text-2xl font-black text-white">{score}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-xs text-white/60 uppercase font-bold mb-1">Best Streak</div>
                <div className="text-2xl font-black text-white">{bestStreak}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-xs text-white/60 uppercase font-bold mb-1">Level</div>
                <div className="text-2xl font-black text-white">{level}</div>
              </div>
            </div>
            <button
              onClick={handleRestart}
              className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-3 px-6 transition-all mb-3"
            >
              <RotateCw size={20} className="inline mr-2" />
              Play Again
            </button>
            <button onClick={() => router.push("/")} className="text-slate-400 hover:text-white font-semibold">
              Exit
            </button>
          </div>
        </motion.div>
      )}

      {/* Game Over Screen */}
      {phase === "gameover" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full mx-6 border border-slate-700 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <X size={40} className="text-white" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Time's Up!</h2>
            <p className="text-slate-300 mb-6">You scored {score} points with {correct} correct answers!</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-xs text-white/60 uppercase font-bold mb-1">Score</div>
                <div className="text-2xl font-black text-white">{score}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-xs text-white/60 uppercase font-bold mb-1">Best Streak</div>
                <div className="text-2xl font-black text-white">{bestStreak}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-xs text-white/60 uppercase font-bold mb-1">Level</div>
                <div className="text-2xl font-black text-white">{level}</div>
              </div>
            </div>
            <button
              onClick={handleRestart}
              className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-3 px-6 transition-all mb-3"
            >
              <RotateCw size={20} className="inline mr-2" />
              Try Again
            </button>
            <button onClick={() => router.push("/")} className="text-slate-400 hover:text-white font-semibold">
              Exit
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
