"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/user-context";
import GameIntroScreen from "@/components/common/GameIntroScreen";

// Import PREMIUM Blast component with no SSR (Phaser only works client-side)
const BlastGame = dynamic(() => import("@/components/games/BlastGamePremium"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0820] to-[#000000]">
      <div className="text-white text-2xl font-bold">Loading Premium Blast Game...</div>
    </div>
  ),
});

interface BlastQuestion {
  id: string;
  question: string;
  answer: string;
  options: string[];
  topic: string;
  subject: string;
  source: string;
}

// Derive 4-option MCQs from term/definition pairs.
// Prompt = definition, correct answer = term, distractors = other terms.
function pairsToQuestions(
  pairs: { term: string; definition: string }[],
  title: string
): BlastQuestion[] {
  const valid = pairs.filter((p) => p.term && p.definition);
  const allTerms = valid.map((p) => p.term);

  return valid.map((p, i) => {
    const distractors = allTerms.filter((t) => t !== p.term).slice(0, 3);
    // Deterministic placement: rotate the correct answer through the 4 slots.
    const options = [...distractors];
    const correctIndex = i % (options.length + 1);
    options.splice(correctIndex, 0, p.term);

    return {
      id: `art_${i}`,
      question: p.definition,
      answer: p.term,
      options,
      topic: "General",
      subject: title,
      source: "generated",
    };
  });
}

function BlastGameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const artifactSlug = searchParams.get("artifact");
  const { user, isLoading } = useUser();
  const [gameStarted, setGameStarted] = useState(false);
  const [artifactQuestions, setArtifactQuestions] = useState<BlastQuestion[] | null>(null);
  const [artifactTitle, setArtifactTitle] = useState("");
  const [artifactLoading, setArtifactLoading] = useState(!!artifactSlug);
  const [artifactError, setArtifactError] = useState("");

  // Gate anonymous users: playing requires an account.
  useEffect(() => {
    if (isLoading || user) return;
    const dest = artifactSlug ? `/blast-game?artifact=${artifactSlug}` : "/blast-game";
    router.push(`/login?redirect=${encodeURIComponent(dest)}`);
  }, [isLoading, user, artifactSlug, router]);

  // Load generated artifact pairs → MCQs.
  useEffect(() => {
    if (!artifactSlug) return;
    (async () => {
      try {
        const res = await fetch(`/api/generated/${artifactSlug}`);
        if (!res.ok) throw new Error("Artifact not found");
        const data = await res.json();
        const questions = pairsToQuestions(data.pairs || [], data.title || "Study Set");
        if (questions.length < 2) {
          setArtifactError("This study set doesn't have enough pairs to play Blast.");
        } else {
          setArtifactQuestions(questions);
          setArtifactTitle(data.title || "Study Set");
        }
      } catch {
        setArtifactError("Failed to load this study set.");
      } finally {
        setArtifactLoading(false);
      }
    })();
  }, [artifactSlug]);

  const handleExit = () => {
    router.push("/");
  };

  const handleStart = () => {
    setGameStarted(true);
  };

  if (isLoading || !user || artifactLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0820] to-[#000000]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (artifactError) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0820] to-[#000000] px-6">
        <div className="text-center max-w-md">
          <h2 className="text-white text-2xl font-bold mb-3">Oops!</h2>
          <p className="text-gray-400 mb-6">{artifactError}</p>
          <button
            onClick={handleExit}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <GameIntroScreen
        icon={
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* White gradient for rocket body */}
              <linearGradient id="rocketWhite" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#f0f9ff" />
                <stop offset="100%" stopColor="#e0f2fe" />
              </linearGradient>
              <linearGradient id="rocketWindow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="flame" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <filter id="rocketShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                <feOffset dx="0" dy="4" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.4"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Rocket body - WHITE for contrast */}
            <g filter="url(#rocketShadow)">
              {/* Main body */}
              <ellipse cx="40" cy="35" rx="10" ry="15" fill="url(#rocketWhite)"/>
              <rect x="30" y="35" width="20" height="20" fill="url(#rocketWhite)"/>

              {/* Shine effect */}
              <ellipse cx="40" cy="30" rx="8" ry="10" fill="white" opacity="0.5"/>

              {/* Window - blue accent */}
              <circle cx="40" cy="32" r="5" fill="url(#rocketWindow)"/>
              <circle cx="38" cy="30" r="2" fill="#dbeafe" opacity="0.8"/>

              {/* Left fin */}
              <path d="M 30 45 L 22 55 L 28 55 Z" fill="url(#rocketWhite)"/>
              <path d="M 30 45 L 22 55 L 28 55 Z" fill="white" opacity="0.3"/>

              {/* Right fin */}
              <path d="M 50 45 L 58 55 L 52 55 Z" fill="url(#rocketWhite)"/>
              <path d="M 50 45 L 58 55 L 52 55 Z" fill="white" opacity="0.3"/>

              {/* Blue accent stripes */}
              <rect x="30" y="40" width="20" height="2" rx="1" fill="#3b82f6" opacity="0.3"/>
              <rect x="30" y="47" width="20" height="2" rx="1" fill="#3b82f6" opacity="0.3"/>
            </g>

            {/* Rocket flames (animated feel) */}
            <g filter="url(#glow)">
              <path d="M 35 55 L 33 65 L 37 60 Z" fill="url(#flame)" opacity="0.9"/>
              <path d="M 40 55 L 38 68 L 42 68 L 40 55 Z" fill="url(#flame)"/>
              <path d="M 45 55 L 43 60 L 47 65 Z" fill="url(#flame)" opacity="0.9"/>
            </g>

            {/* Stars - white/yellow */}
            <circle cx="15" cy="20" r="2" fill="#fef3c7" opacity="0.9"/>
            <circle cx="65" cy="25" r="1.5" fill="white" opacity="0.8"/>
            <circle cx="20" cy="50" r="1.5" fill="#fef3c7" opacity="0.8"/>
            <circle cx="60" cy="45" r="2" fill="white" opacity="0.9"/>

            {/* Speed lines - white */}
            <line x1="25" y1="30" x2="20" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
            <line x1="55" y1="35" x2="60" y2="35" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
          </svg>
        }
        title="Blast"
        subtitle={artifactTitle ? artifactTitle.toUpperCase() : "GENERAL"}
        description="Blast asteroids with correct answers before time runs out!"
        instructions={[
          { text: "• Move your mouse to aim the cannon at moving asteroids" },
          { text: "• Click on asteroids with correct answers to blast them" },
          { text: "• Each correct answer earns you +5 XP and builds your streak" },
          { text: "• Wrong answers cost -2 XP and reset your streak" },
          { text: "• Beat the clock — answer as many as you can in 60 seconds!" },
        ]}
        buttonText="Start game"
        onStart={handleStart}
        onBack={handleExit}
        accentColor="#3b82f6"
        iconBgColor="#2563eb"
      />
    );
  }

  return <BlastGame onExit={handleExit} initialQuestions={artifactQuestions ?? undefined} />;
}

export default function BlastGamePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0820] to-[#000000]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <BlastGameContent />
    </Suspense>
  );
}
