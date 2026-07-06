"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import { englishPaths } from '@/lib/english-content-redesigned';
import { Icons, IconSizes, IconColors, IconLabels } from '@/lib/icons';
import { getTopicIcon } from '@/components/icons/AllPremiumTopicIcons';

// Use comprehensive premium icon mapping
const getIllustratedIcon = getTopicIcon;

export default function IeltsToeflPathPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F1419]">
        <div className="w-12 h-12 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/');
    return null;
  }

  const ieltsToeflPath = englishPaths.find(p => p.id === 'ielts-toefl');

  if (!ieltsToeflPath) {
    return <div>Path not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F1419]">
      {/* Header */}
      <header className="bg-white/70 dark:bg-[#1A1F2E]/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/40 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
                  {ieltsToeflPath.name}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {ieltsToeflPath.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Topics</p>
                <p className="text-lg font-bold text-[#14B8A6]">{ieltsToeflPath.topics.length}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Est. Time</p>
                <p className="text-lg font-bold text-[#10B981]">{ieltsToeflPath.estimatedWeeks} weeks</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ieltsToeflPath.topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => router.push(`/learn/english/ielts-toefl/${topic.id}`)}
              className="group relative p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-[#14B8A6] hover:shadow-lg hover:-translate-y-0.5 transition-all text-left bg-white dark:bg-slate-800"
            >
              {/* Header Row: Icon + Title + Status (side by side, vertically centered) */}
              <div className="grid grid-cols-[3.5rem_1fr_1.5rem] gap-4 items-center mb-4">
                {/* Illustrated Icon */}
                {(() => {
                  const IllustratedIconComponent = getIllustratedIcon(topic.id);
                  return <IllustratedIconComponent className="w-14 h-14" />;
                })()}

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#14B8A6] transition-colors leading-tight break-words">
                  {topic.name}
                </h3>

                {/* Status Indicator */}
                <Icons.notStarted
                  className="w-6 h-6 text-slate-300 dark:text-slate-600"
                  aria-label={IconLabels.notStarted}
                />
              </div>

              {/* Description */}
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                {topic.description}
              </p>

              {/* Subtopics */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">What you'll learn:</p>
                <ul className="space-y-1.5">
                  {topic.subtopics.slice(0, 3).map((subtopic, index) => (
                    <li key={index} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
                      <div className="flex-shrink-0 w-1 h-1 rounded-full bg-[#14B8A6] mt-1.5" />
                      <span className="flex-1">{subtopic}</span>
                    </li>
                  ))}
                  {topic.subtopics.length > 3 && (
                    <li className="text-xs text-slate-400 dark:text-slate-500 pl-3">
                      +{topic.subtopics.length - 3} more topics...
                    </li>
                  )}
                </ul>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5" title="Estimated time to complete">
                  <Icons.time className={IconSizes.md} aria-label={IconLabels.time} />
                  <span>{topic.estimatedTime}m</span>
                </div>
                <div className="flex items-center gap-1.5" title="Number of practice questions">
                  <Icons.goal className={IconSizes.md} aria-label={IconLabels.goal} />
                  <span>{topic.questionCount}Q</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
