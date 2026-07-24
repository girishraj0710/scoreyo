"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Folder, Layers, Trash2 } from "lucide-react";
import { getHeadersWithCsrf } from "@/lib/csrf-client";

interface FolderDeck {
  id: number;
  title: string;
  description: string | null;
  exam_id: string | null;
  subject_id: string | null;
  topic: string | null;
  card_count: number;
}

interface FolderData {
  id: number;
  name: string;
  decks: FolderDeck[];
}

export default function FolderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [folder, setFolder] = useState<FolderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/folders/${id}`);
        if (cancelled) return;
        if (res.status === 401) {
          router.push("/");
          return;
        }
        if (res.status === 404) {
          setError("This folder doesn't exist.");
          return;
        }
        if (!res.ok) {
          setError("Failed to load this folder.");
          return;
        }
        const data = await res.json();
        if (!cancelled) setFolder(data.folder);
      } catch {
        if (!cancelled) setError("Failed to load this folder.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  const removeDeck = async (deckId: number) => {
    if (!folder) return;
    // Optimistic update.
    const previous = folder.decks;
    setFolder({ ...folder, decks: previous.filter((d) => d.id !== deckId) });
    try {
      const res = await fetch(`/api/folders/${id}/decks`, {
        method: "DELETE",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({ deckId }),
      });
      if (!res.ok) {
        setFolder({ ...folder, decks: previous }); // revert
      }
    } catch {
      setFolder({ ...folder, decks: previous }); // revert
    }
  };

  const deleteFolder = async () => {
    if (!confirm("Delete this folder? The study sets inside will not be deleted.")) {
      return;
    }
    try {
      const res = await fetch(`/api/folders/${id}`, {
        method: "DELETE",
        headers: getHeadersWithCsrf(),
      });
      if (res.ok) {
        router.push("/flashcards");
      }
    } catch {
      // no-op: stay on page if delete fails
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-[#F26A4B]/20 border-t-[#F26A4B] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !folder) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push("/flashcards")}
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#E76F51] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Flashcards
          </button>
          <div className="text-center py-20">
            <Folder className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p className="text-slate-600 dark:text-slate-400">
              {error || "Folder not found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 px-6 md:px-10 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push("/flashcards")}
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#E76F51] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Flashcards
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#16213E] flex items-center justify-center flex-shrink-0">
              <Folder className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-black text-[#16213E] dark:text-white leading-tight">
                {folder.name}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {folder.decks.length} study {folder.decks.length === 1 ? "set" : "sets"}
              </p>
            </div>
          </div>
          <button
            onClick={deleteFolder}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete folder
          </button>
        </div>

        {/* Decks */}
        {folder.decks.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <Layers className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p className="text-slate-600 dark:text-slate-400 mb-1">
              This folder is empty.
            </p>
            <p className="text-sm text-slate-500">
              Add study sets to it from the Flashcards page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {folder.decks.map((deck) => (
              <div
                key={deck.id}
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 hover:border-[#F26A4B]/40 hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/flashcards/study/${deck.id}`)}
                >
                  {deck.exam_id && (
                    <p
                      className="text-[10px] font-bold uppercase mb-2 text-[#E76F51]"
                      style={{ letterSpacing: "0.2em" }}
                    >
                      {deck.exam_id}
                    </p>
                  )}
                  <h3 className="font-heading text-lg font-black text-[#16213E] dark:text-white leading-tight mb-1 group-hover:text-[#E76F51] transition-colors">
                    {deck.title}
                  </h3>
                  {deck.topic && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {deck.topic}
                    </p>
                  )}
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {deck.card_count} cards
                  </span>
                </div>
                <button
                  onClick={() => removeDeck(deck.id)}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove from folder
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
