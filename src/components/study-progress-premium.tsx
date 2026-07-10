"use client";

import React from 'react';
import { CheckCircle, BookOpen } from 'lucide-react';

interface StudyProgressPremiumProps {
  currentSection: number;
  totalSections: number;
  completedSections: Set<number>;
  sections: any[];
  onSectionClick: (index: number) => void;
}

export function StudyProgressPremium({
  currentSection,
  totalSections,
  completedSections,
  sections,
  onSectionClick
}: StudyProgressPremiumProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const progress = ((completedSections.size / totalSections) * 100).toFixed(0);
  const circumference = 2 * Math.PI * 20; // radius = 20
  const strokeDashoffset = circumference - (Number(progress) / 100) * circumference;

  return (
    <div className="fixed top-24 right-6 z-50">
      {/* Circular Progress Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative group"
        aria-label="Study progress and table of contents"
      >
        {/* Circular Progress Ring */}
        <svg width="56" height="56" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="28"
            cy="28"
            r="20"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <circle
            cx="28"
            cy="28"
            r="20"
            fill="none"
            stroke="#E76F51"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            style={{
              background: 'var(--card-bg)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <span className="text-sm font-bold" style={{ color: '#E76F51' }}>
              {progress}%
            </span>
          </div>
        </div>

        {/* Hover tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          <div
            className="px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              color: 'var(--foreground)'
            }}
          >
            {completedSections.size} of {totalSections} sections
          </div>
        </div>
      </button>

      {/* Expanded Table of Contents */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setIsExpanded(false)}
          />

          {/* ToC Panel */}
          <div
            className="absolute top-16 right-0 w-80 max-h-[70vh] overflow-y-auto rounded-2xl shadow-2xl border z-50 animate-in slide-in-from-top-4 duration-300"
            style={{
              background: 'var(--card-bg)',
              borderColor: 'var(--card-border)'
            }}
          >
            <div className="p-4 border-b sticky top-0 z-10 backdrop-blur-lg" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <BookOpen className="w-4 h-4" />
                  Table of Contents
                </h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-sm px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  style={{ color: 'var(--foreground-secondary)' }}
                >
                  Close
                </button>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--foreground-secondary)' }}>
                {completedSections.size} / {totalSections} completed
              </p>
            </div>

            <div className="p-3 space-y-1">
              {sections.map((section: any, idx: number) => {
                const isActive = idx === currentSection;
                const isCompleted = completedSections.has(idx);

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onSectionClick(idx);
                      setIsExpanded(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive ? 'shadow-sm' : ''
                    }`}
                    style={{
                      background: isActive ? '#E76F51' : 'transparent',
                      color: isActive ? 'white' : 'var(--foreground)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'var(--hover-bg)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Section number or checkmark */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : isActive
                            ? 'bg-white/20'
                            : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <span className={`text-xs font-semibold ${
                            isActive ? 'text-white' : 'text-gray-500'
                          }`}>
                            {idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Section title */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isActive ? 'text-white' : ''
                        }`} style={!isActive ? { color: 'var(--foreground)' } : {}}>
                          {section.title}
                        </p>
                        {isActive && (
                          <p className="text-xs text-white/70 mt-0.5">
                            Currently reading
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
