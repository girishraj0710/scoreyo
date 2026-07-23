"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@/context/user-context";
import {
  Layers,
  ListChecks,
  Gamepad2,
  Grid3x3,
  Rocket,
  GraduationCap,
  FolderOpen,
  Play,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

/**
 * /library — "Your Library": every study set the signed-in student has created
 * via the "Turn this into…" convert flow (quizzes / games / mock tests) plus
 * their flashcard decks. Fetches GET /api/library and lets them jump back into
 * any set (Play) or grab its share link (Copy).
 */

type Kind = "deck" | "quiz" | "match" | "blocks" | "blast" | "mock";

interface LibraryItem {
  kind: Kind;
  title: string;
  count: number;
  createdAt: string;
  href: string;
  shareSlug?: string;
}

const KIND_META: Record<
  Kind,
  { label: string; unit: string; Icon: typeof Layers; color: string }
> = {
  deck: { label: "Flashcards", unit: "cards", Icon: Layers, color: "#4255FF" },
  quiz: { label: "Quiz", unit: "questions", Icon: ListChecks, color: "#E76F51" },
  match: { label: "Match", unit: "pairs", Icon: Gamepad2, color: "#10B981" },
  blocks: { label: "Block", unit: "pairs", Icon: Grid3x3, color: "#A855F7" },
  blast: { label: "Blast", unit: "pairs", Icon: Rocket, color: "#3B82F6" },
  mock: { label: "Mock Test", unit: "questions", Icon: GraduationCap, color: "#F59E0B" },
};

const FILTERS: { key: "all" | Kind; label: string }[] = [
  { key: "all", label: "All" },
  { key: "deck", label: "Flashcards" },
  { key: "quiz", label: "Quizzes" },
  { key: "match", label: "Match" },
  { key: "blocks", label: "Block" },
  { key: "blast", label: "Blast" },
  { key: "mock", label: "Mock Tests" },
];

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const s = Math.max(0, Math.floor((now - then) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function LibraryPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | Kind>("all");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/login?redirect=/library");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/library");
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
        } else {
          setError("Failed to load your library.");
        }
      } catch {
        setError("Failed to load your library.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, isLoading, router]);

  const handleCopy = (item: LibraryItem) => {
    if (!item.shareSlug) return;
    navigator.clipboard.writeText(`${window.location.origin}/shared/${item.shareSlug}`);
    setCopiedSlug(item.shareSlug);
    setTimeout(() => setCopiedSlug((s) => (s === item.shareSlug ? null : s)), 2000);
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.kind === filter);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-[#F26A4B]/20 border-t-[#F26A4B] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 px-6 md:px-10 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-black text-[#16213E] dark:text-white">
            Your Library
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Every study set you&apos;ve created — jump back in or share it.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  active
                    ? "border-[#F26A4B] bg-[#F26A4B] text-white"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#F26A4B]/10 flex items-center justify-center">
              <FolderOpen className="w-7 h-7 text-[#F26A4B]" />
            </div>
            <h2 className="font-heading text-xl font-bold text-[#16213E] dark:text-white mb-2">
              {items.length === 0 ? "No study sets yet" : "Nothing here"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
              {items.length === 0
                ? "Turn any deck, study guide, or your own notes into a quiz, game, or mock test — it'll show up here."
                : "No sets match this filter."}
            </p>
            {items.length === 0 && (
              <a
                href="/flashcards"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F26A4B] hover:bg-[#E76F51] text-white rounded-lg font-semibold transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Create a study set
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => {
              const meta = KIND_META[item.kind];
              const Icon = meta.Icon;
              const isCopied = copiedSlug && copiedSlug === item.shareSlug;
              return (
                <motion.div
                  key={`${item.kind}-${item.shareSlug ?? item.href}-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${meta.color}1A` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: meta.color }} />
                    </div>
                    <div className="min-w-0">
                      <span
                        className="text-xs font-semibold uppercase tracking-wide"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {timeAgo(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-semibold text-[#16213E] dark:text-white line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {item.count} {meta.unit}
                  </p>

                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => router.push(item.href)}
                      className="flex-1 px-3 py-2 bg-[#F26A4B] hover:bg-[#E76F51] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Open
                    </button>
                    {item.shareSlug && (
                      <button
                        onClick={() => handleCopy(item)}
                        className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors"
                        title="Copy share link"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
