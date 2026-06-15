"use client";

import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

interface StudyNavigationPremiumProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onStartQuiz: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastSection: boolean;
}

export function StudyNavigationPremium({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onStartQuiz,
  canGoPrevious,
  canGoNext,
  isLastSection
}: StudyNavigationPremiumProps) {
  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowLeft' && canGoPrevious) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && canGoNext) {
        onNext();
      } else if (e.key === 'Enter' && isLastSection) {
        onStartQuiz();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [canGoPrevious, canGoNext, isLastSection, onPrevious, onNext, onStartQuiz]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      {/* Gradient fade at bottom */}
      <div
        className="h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, var(--card-bg) 0%, transparent 100%)'
        }}
      />

      {/* Navigation bar */}
      <div
        className="border-t backdrop-blur-lg pointer-events-auto"
        style={{
          background: 'rgba(var(--card-bg-rgb), 0.8)',
          borderColor: 'var(--card-border)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Previous button */}
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="group flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{
                background: canGoPrevious ? 'var(--hover-bg)' : 'var(--muted)',
                color: 'var(--foreground)',
                boxShadow: canGoPrevious ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Previous</span>
              <kbd className="hidden lg:inline-block px-2 py-1 text-xs rounded bg-black/5 dark:bg-white/10 ml-2">
                ←
              </kbd>
            </button>

            {/* Progress indicator */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalSections }).map((_, idx) => (
                    <div
                      key={idx}
                      className="transition-all duration-300"
                      style={{
                        width: idx === currentSection ? '32px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background: idx === currentSection
                          ? '#4255FF'
                          : idx < currentSection
                            ? '#10B981'
                            : 'var(--muted)'
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium ml-3" style={{ color: 'var(--foreground-secondary)' }}>
                  {currentSection + 1} / {totalSections}
                </span>
              </div>
            </div>

            {/* Next/Quiz button */}
            {isLastSection ? (
              <button
                onClick={onStartQuiz}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white'
                }}
              >
                <Sparkles className="w-5 h-5" />
                <span>Start Quiz Now</span>
                <kbd className="hidden lg:inline-block px-2 py-1 text-xs rounded bg-white/20 ml-2">
                  Enter
                </kbd>
              </button>
            ) : (
              <button
                onClick={onNext}
                disabled={!canGoNext}
                className="group flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                style={{
                  background: canGoNext ? 'linear-gradient(135deg, #4255FF 0%, #3644CC 100%)' : 'var(--muted)',
                  color: 'white'
                }}
              >
                <span className="hidden sm:inline">Next Section</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                <kbd className="hidden lg:inline-block px-2 py-1 text-xs rounded bg-white/20 ml-2">
                  →
                </kbd>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
