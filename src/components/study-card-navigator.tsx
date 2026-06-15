"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Grid3x3, CheckCircle } from 'lucide-react';
import { StudyCard } from './study-card';

interface ConceptCard {
  title: string;
  content: string;
}

interface StudyCardNavigatorProps {
  cards: ConceptCard[];
  sectionTitle: string;
}

/**
 * Flashcard-style navigation for study concepts
 * Shows one card at a time with Previous/Next controls
 */
export function StudyCardNavigator({ cards, sectionTitle }: StudyCardNavigatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [showAllCards, setShowAllCards] = useState(false);

  const totalCards = cards.length;
  const currentCard = cards[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showAllCards) return;

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < totalCards - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        markAsCompleted();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalCards, showAllCards]);

  const goToNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const markAsCompleted = () => {
    const newCompleted = new Set(completedCards);
    newCompleted.add(currentIndex);
    setCompletedCards(newCompleted);

    // Auto-advance to next card if not the last one
    if (currentIndex < totalCards - 1) {
      setTimeout(() => goToNext(), 300);
    }
  };

  const jumpToCard = (index: number) => {
    setCurrentIndex(index);
    setShowAllCards(false);
  };

  if (showAllCards) {
    // Grid view of all cards
    return (
      <div className="space-y-6">
        {/* Grid Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {sectionTitle}
            </h2>
            <p className="text-lg mt-2" style={{ color: 'var(--foreground-secondary)' }}>
              All {totalCards} concepts
            </p>
          </div>
          <button
            onClick={() => setShowAllCards(false)}
            className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            Back to Cards
          </button>
        </div>

        {/* All Cards */}
        <div className="space-y-6">
          {cards.map((card, index) => (
            <div key={index} onClick={() => jumpToCard(index)} className="cursor-pointer">
              <StudyCard
                title={card.title}
                content={card.content}
                index={index + 1}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Single card view
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold" style={{ color: 'var(--foreground-secondary)' }}>
            Concept {currentIndex + 1} of {totalCards}
          </div>
          <button
            onClick={() => setShowAllCards(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{
              background: 'var(--hover-bg)',
              color: 'var(--foreground)'
            }}
          >
            <Grid3x3 className="w-4 h-4" />
            View All
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full" style={{ background: 'var(--hover-bg)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / totalCards) * 100}%`,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
            }}
          />
        </div>

        {/* Completion dots */}
        <div className="flex items-center justify-center gap-2">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'w-8' : ''
              }`}
              style={{
                background: completedCards.has(index)
                  ? '#10B981'
                  : index === currentIndex
                  ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                  : 'var(--card-border)'
              }}
              aria-label={`Go to concept ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Current Card */}
      <div className="relative">
        <StudyCard
          title={currentCard.title}
          content={currentCard.content}
          index={currentIndex + 1}
        />

        {/* Mark as completed button */}
        {!completedCards.has(currentIndex) && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={markAsCompleted}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white'
              }}
            >
              <CheckCircle className="w-5 h-5" />
              Got It!
            </button>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: currentIndex === 0 ? 'var(--hover-bg)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: currentIndex === 0 ? 'var(--foreground-secondary)' : 'white'
          }}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {/* Center Info */}
        <div className="text-center">
          <p className="text-sm font-semibold" style={{ color: 'var(--foreground-secondary)' }}>
            {completedCards.size} / {totalCards} completed
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--foreground-secondary)' }}>
            Use ← → arrow keys to navigate
          </p>
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          disabled={currentIndex === totalCards - 1}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: currentIndex === totalCards - 1 ? 'var(--hover-bg)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: currentIndex === totalCards - 1 ? 'var(--foreground-secondary)' : 'white'
          }}
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-4 px-6 py-3 rounded-xl" style={{ background: 'var(--hover-bg)' }}>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded text-xs font-semibold" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              ←
            </kbd>
            <span className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Previous</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded text-xs font-semibold" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              Space
            </kbd>
            <span className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Got It!</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded text-xs font-semibold" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              →
            </kbd>
            <span className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Next</span>
          </div>
        </div>
      </div>
    </div>
  );
}
