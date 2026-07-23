"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getCsrfToken, CSRF_HEADER_NAME } from "@/lib/csrf-client";
import {
  X,
  Layers,
  ListChecks,
  Gamepad2,
  Grid3x3,
  Rocket,
  GraduationCap,
  Sparkles,
  Loader2,
} from "lucide-react";

/**
 * ConvertModal — the shared Quizlet-style "Turn this into…" mode picker.
 *
 * Given a SOURCE (deck / study guide / study material / uploaded file / pasted
 * text), it lets the student pick a target study MODE, POSTs to /api/convert,
 * and on success navigates straight to the matching player so the freshly
 * generated set is immediately playable.
 */

// Modes offered in the picker. The three game variants (match/blocks/blast)
// are surfaced as distinct tiles but all POST as mode:"game" with a gameType.
export type ConvertMode = "deck" | "quiz" | "match" | "blocks" | "blast" | "mock";

// Game tiles → the game_type persisted on the artifact.
const GAME_TYPES: Record<string, "match" | "blocks" | "blast"> = {
  match: "match",
  blocks: "blocks",
  blast: "blast",
};

// The source-identifying fields the caller supplies. The modal adds mode /
// count / difficulty. `file` is only used by the upload surface.
export interface ConvertSource {
  sourceType: "deck" | "text" | "upload" | "guide" | "material";
  sourceRef?: string;
  text?: string;
  file?: File | null;
  examCode?: string;
  subjectCode?: string;
  topicName?: string;
  pathId?: string;
  topicId?: string;
  materialId?: string;
}

interface ConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: ConvertSource;
  /** What we're converting — shown in the header, e.g. the deck/topic title. */
  sourceLabel?: string;
  /** Restrict the offered modes (defaults to all four). */
  allowedModes?: ConvertMode[];
}

const MODE_OPTIONS: {
  mode: ConvertMode;
  label: string;
  desc: string;
  Icon: typeof Layers;
  /** Distinct brand color per mode, so each tile reads at a glance. */
  color: string;
}[] = [
  { mode: "deck", label: "Flashcards", desc: "Study a flip-card deck", Icon: Layers, color: "#4255FF" },
  { mode: "quiz", label: "Quiz", desc: "Multiple-choice practice", Icon: ListChecks, color: "#E76F51" },
  { mode: "match", label: "Match", desc: "Match terms to meanings", Icon: Gamepad2, color: "#10B981" },
  { mode: "blocks", label: "Block", desc: "Tetris-style answer blocks", Icon: Grid3x3, color: "#A855F7" },
  { mode: "blast", label: "Blast", desc: "Blast the correct answers", Icon: Rocket, color: "#3B82F6" },
  { mode: "mock", label: "Mock Test", desc: "Timed exam-style test", Icon: GraduationCap, color: "#F59E0B" },
];

const COUNTS = [5, 10, 15, 20];
const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export function ConvertModal({
  isOpen,
  onClose,
  source,
  sourceLabel,
  allowedModes,
}: ConvertModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<ConvertMode | null>(null);
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options = allowedModes
    ? MODE_OPTIONS.filter((o) => allowedModes.includes(o.mode))
    : MODE_OPTIONS;

  function reset() {
    setMode(null);
    setCount(10);
    setDifficulty("medium");
    setLoading(false);
    setError(null);
  }

  function handleClose() {
    if (loading) return;
    reset();
    onClose();
  }

  async function handleConvert() {
    if (!mode) return;
    setLoading(true);
    setError(null);
    // Game tiles map to the generator's "game" mode + a specific game_type.
    const gameType = GAME_TYPES[mode];
    const apiMode = gameType ? "game" : mode;
    // /api/convert is CSRF-protected; send the double-submit token.
    const csrfToken = getCsrfToken();
    try {
      let res: Response;
      if (source.file) {
        // Upload source → multipart so the file rides along. Don't set
        // Content-Type here — the browser adds the multipart boundary.
        const form = new FormData();
        form.append("sourceType", source.sourceType);
        form.append("mode", apiMode);
        if (gameType) form.append("gameType", gameType);
        form.append("count", String(count));
        form.append("difficulty", difficulty);
        form.append("file", source.file);
        if (sourceLabel) form.append("title", sourceLabel);
        res = await fetch("/api/convert", {
          method: "POST",
          headers: csrfToken ? { [CSRF_HEADER_NAME]: csrfToken } : undefined,
          body: form,
        });
      } else {
        const body: Record<string, unknown> = {
          sourceType: source.sourceType,
          mode: apiMode,
          count,
          difficulty,
        };
        if (gameType) body.gameType = gameType;
        if (sourceLabel) body.title = sourceLabel;
        for (const k of [
          "sourceRef",
          "text",
          "examCode",
          "subjectCode",
          "topicName",
          "pathId",
          "topicId",
          "materialId",
        ] as const) {
          if (source[k] != null) body[k] = source[k];
        }
        res = await fetch("/api/convert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(csrfToken ? { [CSRF_HEADER_NAME]: csrfToken } : {}),
          },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Conversion failed. Please try again.");
        setLoading(false);
        return;
      }

      const artifact = data.artifact as {
        type: "deck" | "quiz" | "game" | "mock";
        id: string;
        shareSlug?: string;
      };
      // Deck plays by id (has its own /deck/[slug] share page). Quiz/game/mock
      // land on their shareable /shared/[slug] view — one click from Play and
      // ready to send to anyone.
      if (artifact.type === "deck") {
        router.push(`/flashcards/study/${artifact.id}`);
      } else {
        router.push(`/shared/${artifact.shareSlug}`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg pointer-events-auto"
            >
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F26A4B] to-[#E76F51] flex items-center justify-center shadow">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-black text-[#16213E] dark:text-white">
                        Turn this into…
                      </h3>
                      {sourceLabel && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                          {sourceLabel}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="px-6 pb-6">
                  {/* Mode grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {options.map(({ mode: m, label, desc, Icon, color }) => {
                      const active = mode === m;
                      return (
                        <button
                          key={m}
                          onClick={() => setMode(m)}
                          disabled={loading}
                          style={
                            active
                              ? { borderColor: color, backgroundColor: `${color}0D` }
                              : undefined
                          }
                          className={`text-left p-4 rounded-2xl border-2 transition-all disabled:opacity-50 ${
                            active
                              ? ""
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          <div
                            className="w-10 h-10 mb-2 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${color}1A` }}
                          >
                            <Icon className="w-5 h-5" style={{ color }} />
                          </div>
                          <div className="font-semibold text-sm text-[#16213E] dark:text-white">
                            {label}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Options (hidden for pure deck, which ignores difficulty) */}
                  {mode && (
                    <div className="space-y-4 mb-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                          {mode === "deck" ? "Number of cards" : "Number of questions"}
                        </label>
                        <div className="flex gap-2">
                          {COUNTS.map((c) => (
                            <button
                              key={c}
                              onClick={() => setCount(c)}
                              disabled={loading}
                              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all disabled:opacity-50 ${
                                count === c
                                  ? "border-[#E76F51] bg-[#E76F51] text-white"
                                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>

                      {mode !== "deck" && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                            Difficulty
                          </label>
                          <div className="flex gap-2">
                            {DIFFICULTIES.map((d) => (
                              <button
                                key={d}
                                onClick={() => setDifficulty(d)}
                                disabled={loading}
                                className={`flex-1 py-2 rounded-xl text-sm font-semibold border capitalize transition-all disabled:opacity-50 ${
                                  difficulty === d
                                    ? "border-[#E76F51] bg-[#E76F51] text-white"
                                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                }`}
                              >
                                {d}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleConvert}
                    disabled={!mode || loading}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#F26A4B] to-[#E76F51] hover:from-[#E76F51] hover:to-[#D35D42] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Create {mode ? MODE_OPTIONS.find((o) => o.mode === mode)?.label : "study set"}
                      </>
                    )}
                  </button>

                  {loading && (
                    <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                      Reading your content and building questions — this can take a few seconds.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
