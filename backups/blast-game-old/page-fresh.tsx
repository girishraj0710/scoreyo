"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";

// Sample questions
const SAMPLE_QUESTIONS = [
  { id: "1", question: "What year did WW2 end?", answer: "1945", options: ["1943", "1944", "1945", "1946"] },
  { id: "2", question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci", options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"] },
  { id: "3", question: "Who wrote Romeo and Juliet?", answer: "Shakespeare", options: ["4", "Paris", "Jupiter", "Shakespeare"] },
  { id: "4", question: "What is the capital of France?", answer: "Paris", options: ["London", "Berlin", "Paris", "Madrid"] },
  { id: "5", question: "What is 7 x 8?", answer: "56", options: ["48", "54", "56", "63"] },
];

interface Asteroid {
  id: string;
  label: string;
  isCorrect: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface Projectile {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface Explosion {
  id: string;
  x: number;
  y: number;
  correct: boolean;
}

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

// Star field background
const StarField = React.memo(() => {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      left: ((i * 7.3 + 13.7) % 100),
      top: ((i * 11.3 + 17.1) % 100),
      size: 0.5 + ((i % 4) * 0.4),
      opacity: 0.3 + ((i % 3) * 0.2),
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
          }}
          animate={{ opacity: [s.opacity * 0.5, s.opacity, s.opacity * 0.5] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
});

StarField.displayName = "StarField";

// Puffy cloud blob with many small scallops (Quizlet style)
const PuffyBlob = ({ size, color, id }: { size: number; color: string; id: string }) => {
  const scallops = 24; // Many small scallops for fluffy look
  const baseRadius = 42;
  const scallop = 4; // Small scallops

  const path = useMemo(() => {
    let d = '';
    const seed = parseInt(id.split('-').pop() || '0', 10);

    for (let i = 0; i < scallops; i++) {
      const angle = (i / scallops) * Math.PI * 2;
      const nextAngle = ((i + 1) / scallops) * Math.PI * 2;

      // Alternate between base and peak
      const r1 = baseRadius + Math.sin(seed + i * 0.5) * 1;
      const r2 = baseRadius + scallop + Math.cos(seed + i * 0.5) * 1;
      const r3 = baseRadius + Math.sin(seed + (i + 1) * 0.5) * 1;

      const x1 = 50 + Math.cos(angle) * r1;
      const y1 = 50 + Math.sin(angle) * r1;

      const midAngle = (angle + nextAngle) / 2;
      const x2 = 50 + Math.cos(midAngle) * r2;
      const y2 = 50 + Math.sin(midAngle) * r2;

      const x3 = 50 + Math.cos(nextAngle) * r3;
      const y3 = 50 + Math.sin(nextAngle) * r3;

      if (i === 0) {
        d = `M ${x1},${y1} `;
      }
      d += `Q ${x2},${y2} ${x3},${y3} `;
    }

    return d + 'Z';
  }, [id, scallops]);

  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
      <defs>
        <radialGradient id={`blob-grad-${id}`} cx="40%" cy="35%" r="60%">
          {color === 'purple' && (
            <>
              <stop offset="0%" stopColor="#A5B4FC" />
              <stop offset="100%" stopColor="#6366F1" />
            </>
          )}
          {color === 'green' && (
            <>
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#22C55E" />
            </>
          )}
          {color === 'red' && (
            <>
              <stop offset="0%" stopColor="#FCA5A5" />
              <stop offset="100%" stopColor="#EF4444" />
            </>
          )}
        </radialGradient>
        {/* Soft glow filter */}
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main blob shape */}
      <path
        d={path}
        fill={`url(#blob-grad-${id})`}
        filter={`url(#glow-${id})`}
      />

      {/* Highlight for 3D effect */}
      <ellipse
        cx="40"
        cy="35"
        rx="15"
        ry="10"
        fill="white"
        opacity="0.3"
      />
    </svg>
  );
};

// Ship with orbiting particles
const Ship = () => {
  const orbitRadius = 55;
  const particleCount = 8;

  return (
    <div className="relative w-32 h-32">
      {/* Orbiting particles */}
      {Array.from({ length: particleCount }).map((_, i) => {
        const angle = (i / particleCount) * Math.PI * 2;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              marginLeft: '-4px',
              marginTop: '-4px',
            }}
            animate={{
              x: Math.cos(angle) * orbitRadius,
              y: Math.sin(angle) * orbitRadius,
              rotate: 360,
            }}
            transition={{
              x: { duration: 3, repeat: Infinity, ease: "linear" },
              y: { duration: 3, repeat: Infinity, ease: "linear" },
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            }}
          >
            <div className="relative w-2 h-2">
              <div className="absolute inset-0 rounded-full bg-green-300/80" />
              <motion.div
                className="absolute inset-0 rounded-full bg-green-300/40 scale-150"
                animate={{ scale: [1.5, 2, 1.5], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        );
      })}

      {/* Ship body */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <defs>
            <radialGradient id="ship-grad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#22C55E" />
            </radialGradient>
          </defs>

          {/* Main circle */}
          <circle cx="50" cy="50" r="38" fill="url(#ship-grad)" />

          {/* Border */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#166534" strokeWidth="2" opacity="0.6" />

          {/* Highlight */}
          <ellipse cx="38" cy="35" rx="12" ry="8" fill="white" opacity="0.3" />

          {/* Center white circle */}
          <circle cx="50" cy="50" r="15" fill="white" opacity="0.9" />
          <circle cx="50" cy="50" r="10" fill="#22C55E" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
};

// Explosion effect
const Explosion = ({ x, y, correct }: { x: number; y: number; correct: boolean }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        angle: (i / 12) * Math.PI * 2,
        dist: rand(50, 100),
        size: rand(4, 8),
      })),
    []
  );

  const color = correct ? "#FCD34D" : "#EF4444";

  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      style={{ left: x, top: y }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: color,
          }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 50,
          height: 50,
          left: -25,
          top: -25,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};

export default function BlastGame() {
  const router = useRouter();
  const arenaRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<"playing" | "victory" | "gameover">("playing");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [bounds, setBounds] = useState({ w: 1000, h: 600 });
  const [locked, setLocked] = useState(false);

  const currentQuestion = SAMPLE_QUESTIONS[qIndex % SAMPLE_QUESTIONS.length];

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

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPhase("gameover");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // Build asteroid
  const buildAsteroid = useCallback((id: string, label: string, isCorrect: boolean, bounds: { w: number; h: number }): Asteroid => {
    const size = 140;
    const speed = 0.4;
    const angle = rand(0, Math.PI * 2);

    return {
      id,
      label,
      isCorrect,
      x: rand(50, bounds.w - size - 50),
      y: rand(100, bounds.h - size - 200),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size,
    };
  }, []);

  // Spawn asteroids
  useEffect(() => {
    if (phase !== "playing" || !currentQuestion || bounds.w < 100) return;

    const options = currentQuestion.options;
    const newAsteroids: Asteroid[] = [];

    for (let i = 0; i < options.length; i++) {
      const ast = buildAsteroid(
        `ast-${qIndex}-${i}`,
        options[i],
        options[i] === currentQuestion.answer,
        bounds
      );
      newAsteroids.push(ast);
    }

    setAsteroids(newAsteroids);
  }, [qIndex, phase, bounds, currentQuestion, buildAsteroid]);

  // Physics loop
  useEffect(() => {
    if (phase !== "playing") return;
    let raf: number;
    let last = performance.now();

    const tick = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;

      setAsteroids((prev) => {
        let updated = prev.map((a) => {
          let nx = a.x + a.vx * dt * 0.06;
          let ny = a.y + a.vy * dt * 0.06;
          let vx = a.vx;
          let vy = a.vy;

          // Wall bounce
          const maxX = bounds.w - a.size;
          const maxY = bounds.h - a.size;

          if (nx <= 0) {
            nx = 0;
            vx = Math.abs(vx);
          }
          if (nx >= maxX) {
            nx = maxX;
            vx = -Math.abs(vx);
          }
          if (ny <= 0) {
            ny = 0;
            vy = Math.abs(vy);
          }
          if (ny >= maxY) {
            ny = maxY;
            vy = -Math.abs(vy);
          }

          return { ...a, x: nx, y: ny, vx, vy };
        });

        // Collision detection
        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const a1 = updated[i];
            const a2 = updated[j];
            const dx = (a2.x + a2.size / 2) - (a1.x + a1.size / 2);
            const dy = (a2.y + a2.size / 2) - (a1.y + a1.size / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = (a1.size + a2.size) / 2;

            if (distance < minDistance && distance > 0) {
              const overlap = minDistance - distance;
              const pushX = (dx / distance) * overlap * 0.6;
              const pushY = (dy / distance) * overlap * 0.6;
              const repulsion = 1.5;

              updated[i] = {
                ...a1,
                x: a1.x - pushX,
                y: a1.y - pushY,
                vx: a1.vx - (dx / distance) * repulsion,
                vy: a1.vy - (dy / distance) * repulsion,
              };
              updated[j] = {
                ...a2,
                x: a2.x + pushX,
                y: a2.y + pushY,
                vx: a2.vx + (dx / distance) * repulsion,
                vy: a2.vy + (dy / distance) * repulsion,
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

  // Click handler
  const handleClick = useCallback((ast: Asteroid) => {
    if (locked || phase !== "playing") return;
    setLocked(true);

    // Projectile
    const shipX = bounds.w / 2;
    const shipY = bounds.h - 60;
    const targetX = ast.x + ast.size / 2;
    const targetY = ast.y + ast.size / 2;

    const projId = `proj-${Date.now()}`;
    setProjectiles((prev) => [...prev, { id: projId, startX: shipX, startY: shipY, endX: targetX, endY: targetY }]);
    setTimeout(() => {
      setProjectiles((prev) => prev.filter((p) => p.id !== projId));
    }, 200);

    // Explosion
    setTimeout(() => {
      const expId = `exp-${Date.now()}`;
      setExplosions((prev) => [...prev, { id: expId, x: targetX, y: targetY, correct: ast.isCorrect }]);
      setTimeout(() => {
        setExplosions((prev) => prev.filter((e) => e.id !== expId));
      }, 700);

      // Update score
      if (ast.isCorrect) {
        setScore((s) => s + 5);
        setStreak((st) => st + 1);
      } else {
        setScore((s) => Math.max(0, s - 2));
        setStreak(0);
      }

      // Next question
      setTimeout(() => {
        setQIndex((i) => i + 1);
        setLocked(false);
      }, 400);
    }, 150);
  }, [locked, phase, bounds]);

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
          {/* Question Banner */}
          <div className="relative z-10 w-full py-6 px-6" style={{ background: "linear-gradient(135deg, #5B21B6 0%, #4338CA 100%)" }}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-white/70 text-xs uppercase font-bold mb-2 tracking-widest">
                Question {qIndex + 1}
              </div>
              <div className="text-white text-2xl font-bold leading-snug">
                {currentQuestion.question}
              </div>
            </div>
          </div>

          {/* Arena */}
          <div ref={arenaRef} className="relative mx-auto" style={{ width: "90%", height: "58vh", maxWidth: "1200px" }}>
            {/* Asteroids */}
            <AnimatePresence>
              {asteroids.map((ast) => (
                <motion.div
                  key={ast.id}
                  className="absolute cursor-pointer z-20"
                  style={{ left: ast.x, top: ast.y, width: ast.size, height: ast.size }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  onClick={() => handleClick(ast)}
                >
                  <PuffyBlob size={ast.size} color="purple" id={ast.id} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-white font-bold text-sm text-center px-4 leading-tight drop-shadow-lg">
                      {ast.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Projectiles */}
            <AnimatePresence>
              {projectiles.map((proj) => (
                <motion.svg
                  key={proj.id}
                  className="absolute inset-0 pointer-events-none z-30"
                  style={{ width: "100%", height: "100%" }}
                >
                  <defs>
                    <linearGradient id={`laser-${proj.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(34,211,238,0)" />
                      <stop offset="40%" stopColor="rgba(34,211,238,0.9)" />
                      <stop offset="60%" stopColor="rgba(34,211,238,0.9)" />
                      <stop offset="100%" stopColor="rgba(34,211,238,0)" />
                    </linearGradient>
                  </defs>
                  <motion.line
                    x1={proj.startX}
                    y1={proj.startY}
                    x2={proj.startX}
                    y2={proj.startY}
                    stroke={`url(#laser-${proj.id})`}
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ x2: proj.startX, y2: proj.startY }}
                    animate={{ x2: proj.endX, y2: proj.endY }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.8))" }}
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

            {/* Ship */}
            <div className="absolute left-1/2 bottom-2 -translate-x-1/2 z-20">
              <Ship />
            </div>
          </div>

          {/* Bottom HUD */}
          <div className="relative z-10 px-6 py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-end text-white">
              {/* Left: Score + Level */}
              <div className="flex items-end gap-8">
                <div>
                  <div className="text-xs text-white/50 uppercase font-bold mb-1 tracking-wider">Score</div>
                  <div className="text-4xl font-black">{score}</div>
                </div>
                <div>
                  <div className="text-xs text-white/50 uppercase font-bold mb-1 tracking-wider">Level</div>
                  <div className="text-4xl font-black">{level}</div>
                </div>
              </div>

              {/* Center: Time */}
              <div className="text-center">
                <div className="text-xs text-white/50 uppercase font-bold mb-1 tracking-wider">Time</div>
                <div className="text-4xl font-black">{timeLeft}s</div>
              </div>

              {/* Right: Streak */}
              <div className="flex items-center gap-3">
                <Zap size={20} className="text-purple-300" fill="#C084FC" />
                <div className="text-white font-bold text-2xl">{streak}</div>
                <div className="w-44 h-3 rounded-full bg-white/10">
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
    </div>
  );
}
