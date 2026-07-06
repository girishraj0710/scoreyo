"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import { foundationPathRedesigned } from '@/lib/english-foundation-32';
import { Icons, IconSizes, IconColors, IconLabels } from '@/lib/icons';
import { getTopicIcon } from '@/components/icons/AllPremiumTopicIcons';

// Use comprehensive premium icon mapping (16 unique icons + 3D library)
const getIllustratedIcon = getTopicIcon;

export default function FoundationPathPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F1419]">
        <div className="w-12 h-12 border-4 border-[#5B7CFF] border-t-transparent rounded-full animate-spin"></div>
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
                  {foundationPathRedesigned.name}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {foundationPathRedesigned.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Topics</p>
                <p className="text-lg font-bold text-[#5B7CFF]">{foundationPathRedesigned.modules.reduce((acc, m) => acc + m.topics.length, 0)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Est. Time</p>
                <p className="text-lg font-bold text-[#10B981]">{foundationPathRedesigned.estimatedWeeks} weeks</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Modules */}
        <div className="space-y-6">
          {foundationPathRedesigned.modules.map((module, moduleIndex) => (
            <div
              key={module.id}
              className="bg-white/90 dark:bg-[#1A1F2E]/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/40 p-6"
            >
              {/* Module Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#5B7CFF]/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-[#5B7CFF]">{moduleIndex + 1}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{module.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{module.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Topics</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{module.topics.length}</p>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {module.topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => router.push(`/learn/english/foundation/${topic.id}`)}
                    className="group relative p-5 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-[#5B7CFF] hover:shadow-lg hover:-translate-y-0.5 transition-all text-left bg-white dark:bg-slate-800"
                  >
                    {/* CEFR Level Badge - Top Right */}
                    <div className="absolute top-4 right-4 px-2 py-0.5 rounded-md bg-[#10B981]/10 text-[10px] font-bold text-[#10B981]">
                      {topic.cefrLevel}
                    </div>

                    {/* Header Row: Icon + Title (side by side, vertically centered) */}
                    <div className="grid grid-cols-[3rem_1fr] gap-3 items-center mb-3">
                      {/* Illustrated Icon */}
                      {(() => {
                        const IllustratedIconComponent = getIllustratedIcon(topic.id);
                        return <IllustratedIconComponent className="w-12 h-12" />;
                      })()}

                      {/* Title */}
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-[#5B7CFF] transition-colors text-sm leading-tight pr-10 break-words">
                        {topic.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                      {topic.description}
                    </p>

                    {/* Meta + Status Row */}
                    <div className="flex items-center justify-between">
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                        <div className="flex items-center gap-1" title="Estimated time to complete">
                          <Icons.time className={IconSizes.sm} aria-label={IconLabels.time} />
                          <span>{topic.estimatedTime}m</span>
                        </div>
                        <div className="flex items-center gap-1" title="Number of practice questions">
                          <Icons.goal className={IconSizes.sm} aria-label={IconLabels.goal} />
                          <span>{topic.questionCount}Q</span>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <Icons.notStarted
                        className="w-5 h-5 text-slate-300 dark:text-slate-600"
                        aria-label={IconLabels.notStarted}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
