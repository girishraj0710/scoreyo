"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@/context/user-context";
import {
  ListChecks,
  Gamepad2,
  GraduationCap,
  Play,
  Copy,
  Check,
  ChevronRight,
  Clock,
} from "lucide-react";

/**
 * /shared/[slug] — public "live-link" view for a generated study artifact
 * (quiz / game / mock test). Fetches GET /api/generated/[slug] (no auth),
 * shows a preview + a Play CTA + copy/share options.
 *
 * This is the shareable landing produced right after a conversion. Flashcard
 * decks keep their own /deck/[slug] page; this covers the other three modes.
 *
 * Play gating mirrors /deck/[slug]: logged-in users go straight to the matching
 * player (?artifact=slug); anonymous users are routed to login with a redirect
 * back to the player.
 */

type ArtifactType = "quiz" | "mock" | "game";

interface QuizQuestion {
  question: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
}

interface GamePair {
  term: string;
  definition: string;
}

interface SharedArtifact {
  type: ArtifactType;
  title: string;
  difficulty?: string | null;
  durationMinutes?: number | null;
  gameType?: string;
  questions?: QuizQuestion[];
  pairs?: GamePair[];
}

const TYPE_META: Record<
  ArtifactType,
  { label: string; Icon: typeof ListChecks; playPath: (slug: string) => string }
> = {
  quiz: { label: "Quiz", Icon: ListChecks, playPath: (s) => `/quiz?artifact=${s}` },
  mock: { label: "Mock Test", Icon: GraduationCap, playPath: (s) => `/mock-test?artifact=${s}` },
  game: { label: "Match Game", Icon: Gamepad2, playPath: (s) => `/match?artifact=${s}` },
};

// Games ship as three distinct players. Route by the stored game_type.
const GAME_META: Record<string, { label: string; playPath: (slug: string) => string }> = {
  match: { label: "Match Game", playPath: (s) => `/match?artifact=${s}` },
  blocks: { label: "Block Game", playPath: (s) => `/blocks?artifact=${s}` },
  blast: { label: "Blast Game", playPath: (s) => `/blast-game?artifact=${s}` },
};

function resolveMeta(artifact: SharedArtifact) {
  if (artifact.type === "game") {
    const game = GAME_META[artifact.gameType || "match"] ?? GAME_META.match;
    return { label: game.label, Icon: Gamepad2, playPath: game.playPath };
  }
  return TYPE_META[artifact.type];
}

export default function SharedArtifactPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { user } = useUser();
  const [slug, setSlug] = useState("");
  const [artifact, setArtifact] = useState<SharedArtifact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`/api/generated/${slug}`);
        if (res.ok) {
          setArtifact(await res.json());
        } else {
          setError("This study set doesn't exist or has been removed.");
        }
      } catch {
        setError("Failed to load this study set.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlay = () => {
    if (!artifact) return;
    const playPath = resolveMeta(artifact).playPath(slug);
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(playPath)}`);
    } else {
      router.push(playPath);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-[#F26A4B]/20 border-t-[#F26A4B] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !artifact) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-slate-950 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Study Set Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error || "This study set doesn't exist or has been removed."}
          </p>
          <a
            href="/"
            className="px-6 py-3 bg-[#F26A4B] hover:bg-[#E76F51] text-white rounded-lg font-semibold transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const meta = resolveMeta(artifact);
  const Icon = meta.Icon;
  const itemCount =
    artifact.type === "game" ? artifact.pairs?.length ?? 0 : artifact.questions?.length ?? 0;
  const itemLabel = artifact.type === "game" ? "pairs" : "questions";
  const shareText = `Check out this ${meta.label.toLowerCase()}: ${artifact.title}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 px-6 md:px-10 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p
            className="text-xs font-bold uppercase text-[#F26A4B] mb-3"
            style={{ letterSpacing: "0.2em" }}
          >
            SHARED {meta.label.toUpperCase()}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-[#16213E] dark:text-white mb-4">
            {artifact.title}
          </h1>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 mb-8"
        >
          {/* Meta row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#F26A4B]/10 text-[#F26A4B] rounded-lg text-sm font-semibold">
              <Icon className="w-4 h-4" />
              {meta.label}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {itemCount} {itemLabel}
            </span>
            {artifact.difficulty && (
              <>
                <span className="text-slate-400">•</span>
                <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                  {artifact.difficulty}
                </span>
              </>
            )}
            {artifact.type === "mock" && artifact.durationMinutes && (
              <>
                <span className="text-slate-400">•</span>
                <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  {artifact.durationMinutes} min
                </span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePlay}
              className="flex-1 px-6 py-3 bg-[#F26A4B] hover:bg-[#E76F51] text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-5 h-5" />
              {user ? `Play ${meta.label}` : `Login to Play`}
            </button>
            <button
              onClick={handleCopyLink}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Link
                </>
              )}
            </button>
          </div>

          {/* Share via */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-lg text-sm font-semibold text-center transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-lg text-sm font-semibold text-center transition-colors"
            >
              Telegram
            </a>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Preview
          </h2>

          {artifact.type === "game" ? (
            <div className="space-y-3">
              {(artifact.pairs ?? []).slice(0, 5).map((pair, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3"
                >
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#F26A4B] text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-slate-900 dark:text-white font-medium">
                    {pair.term}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="flex-1 text-sm text-slate-600 dark:text-slate-400 text-right">
                    {pair.definition}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(artifact.questions ?? []).slice(0, 3).map((q, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-[#F26A4B] text-white flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-slate-900 dark:text-white font-medium mb-3">
                        {q.question}
                      </p>
                      {Array.isArray(q.options) && (
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => (
                            <div
                              key={oi}
                              className="text-sm text-slate-600 dark:text-slate-400 pl-4 border-l-2 border-slate-200 dark:border-slate-700"
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {itemCount > (artifact.type === "game" ? 5 : 3) && (
            <div className="text-center py-6 mt-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {itemCount - (artifact.type === "game" ? 5 : 3)} more {itemLabel} hidden
              </p>
              <button
                onClick={handlePlay}
                className="px-6 py-2 bg-[#F26A4B] hover:bg-[#E76F51] text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                {user ? "Play to see all" : "Login to see all"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* CTA Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Want to create your own study sets?
          </p>
          <a
            href={user ? "/dashboard" : "/"}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {user ? "Go to Dashboard" : "Get Started Free"}
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
