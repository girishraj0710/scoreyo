"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import { Icons, IconSizes, IconColors, IconLabels } from '@/lib/icons';

export default function VocabularyPathPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F1419]">
        <div className="w-12 h-12 border-4 border-[#E9C46A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F1419]">
      {/* Header */}
      <header className="bg-white/70 dark:bg-[#1A1F2E]/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/40 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/english')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={IconLabels.back}
              title="Back to English Dashboard"
            >
              <Icons.back className={`${IconSizes.lg} ${IconColors.neutral}`} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Dedicated Vocabulary Builder
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                5,000+ high-frequency words, idioms, phrasal verbs, and professional jargon
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white/90 dark:bg-[#1A1F2E]/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/40 p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#E9C46A]/10 flex items-center justify-center mx-auto mb-6">
            <Icons.vocabulary className={`${IconSizes['3xl']} ${IconColors.amber}`} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Vocabulary Path Coming Soon
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            We're building a comprehensive vocabulary builder with smart flashcards, spaced repetition, and contextual learning. Stay tuned!
          </p>
          <button
            onClick={() => router.push('/english')}
            className="px-6 py-3 rounded-xl bg-[#E9C46A] text-white font-semibold hover:bg-[#D4A840] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
