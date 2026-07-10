"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@/context/user-context";
import {
  BookOpen,
  Users,
  Eye,
  Share2,
  Star,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import { InteractiveStarRating } from "@/components/interactive-star-rating";
import { getHeadersWithCsrf } from "@/lib/csrf-client";

interface PublicDeckData {
  deck: {
    id: number;
    title: string;
    description: string;
    exam: string;
    subject: string;
    topic: string;
    totalCards: number;
    creator: {
      name: string;
      username: string;
    };
    analytics: {
      studiesToday: number;
      uniqueStudents: number;
      totalStudies: number;
      shareCount: number;
      viewCount: number;
    };
    rating: {
      average: number;
      count: number;
    };
    cardPreview: Array<{
      id: number;
      front: string;
      back: string;
    }>;
  };
}

export default function PublicDeckPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { user } = useUser();
  const [deckData, setDeckData] = useState<PublicDeckData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchDeck = async () => {
      try {
        const response = await fetch(`/api/flashcards/public/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setDeckData(data);
        } else {
          setError("Deck not found");
        }
      } catch (err) {
        console.error("Error fetching deck:", err);
        setError("Failed to load deck");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeck();
  }, [slug]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStudyDeck = () => {
    if (!user) {
      // Redirect to login with return URL
      router.push(`/login?redirect=/flashcards/study/${deckData?.deck.id}`);
    } else {
      router.push(`/flashcards/study/${deckData?.deck.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-[#F26A4B]/20 border-t-[#F26A4B] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !deckData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-slate-950 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Deck Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error || "This flashcard deck doesn't exist or has been removed."}
          </p>
          <a
            href="/flashcards"
            className="px-6 py-3 bg-[#F26A4B] hover:bg-[#E76F51] text-white rounded-lg font-semibold transition-colors"
          >
            Browse Flashcards
          </a>
        </div>
      </div>
    );
  }

  const { deck } = deckData;

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 px-6 md:px-10 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F26A4B] mb-3">
            SHARED FLASHCARD DECK
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-[#16213E] dark:text-white mb-4">
            {deck.title}
          </h1>
          {deck.description && (
            <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl mx-auto">
              {deck.description}
            </p>
          )}
        </div>

        {/* Deck Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 mb-8"
        >
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <span className="px-3 py-1 bg-[#F26A4B]/10 text-[#F26A4B] rounded-lg text-sm font-semibold">
              {deck.exam}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {deck.subject}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {deck.topic}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#F26A4B]/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#F26A4B]" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {deck.totalCards}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Cards</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {deck.analytics.uniqueStudents}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Students</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {deck.analytics.viewCount}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Views</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {deck.rating.average > 0 ? deck.rating.average.toFixed(1) : "—"}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Rating</div>
            </div>
          </div>

          {/* Creator */}
          <div className="flex items-center justify-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F26A4B] to-[#E76F51] flex items-center justify-center text-white font-bold">
              {deck.creator.name[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {deck.creator.name}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                @{deck.creator.username}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleStudyDeck}
              className="flex-1 px-6 py-3 bg-[#F26A4B] hover:bg-[#E76F51] text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              {user ? "Study This Deck" : "Login to Study"}
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
        </motion.div>

        {/* Card Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Card Preview
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            First {Math.min(5, deck.cardPreview.length)} cards (Study to see all {deck.totalCards} cards)
          </p>

          <div className="space-y-4">
            {deck.cardPreview.map((card, index) => (
              <div
                key={card.id}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#F26A4B] text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-white font-medium mb-3 whitespace-pre-wrap">
                      {card.front}
                    </p>
                    <div className="pl-4 border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded">
                      <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {card.back}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {deck.totalCards > 5 && (
              <div className="text-center py-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400 mb-3">
                  {deck.totalCards - 5} more cards hidden
                </p>
                <button
                  onClick={handleStudyDeck}
                  className="px-6 py-2 bg-[#F26A4B] hover:bg-[#E76F51] text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  Study to Unlock All Cards
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Rating Section */}
        {deck.rating.count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8"
          >
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Student Ratings
            </h2>
            <div className="flex items-center gap-4">
              <InteractiveStarRating rating={deck.rating.average} readonly size="lg" />
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {deck.rating.average.toFixed(1)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {deck.rating.count} {deck.rating.count === 1 ? "rating" : "ratings"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Want to create your own flashcard decks?
          </p>
          <a
            href={user ? "/flashcards" : "/"}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {user ? "Go to My Flashcards" : "Get Started Free"}
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
