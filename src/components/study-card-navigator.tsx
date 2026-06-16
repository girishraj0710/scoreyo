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
  practiceProblemsComponent?: React.ReactNode;
}

/**
 * Flashcard-style navigation for study concepts
 * Shows one card at a time with Previous/Next controls
 * Shows practice problems ONLY after all cards are completed
 */
export function StudyCardNavigator({ cards, sectionTitle, practiceProblemsComponent }: StudyCardNavigatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [showAllCards, setShowAllCards] = useState(false);
  const [showPracticeProblems, setShowPracticeProblems] = useState(false);

  const totalCards = cards.length;
  const currentCard = cards[currentIndex];
  const allCardsCompleted = completedCards.size === totalCards;

  // Keyboard navigation (arrow keys only)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showAllCards || showPracticeProblems) return;

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < totalCards - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalCards, showAllCards, showPracticeProblems]);

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

  // Show Practice Problems view when button clicked
  if (showPracticeProblems && practiceProblemsComponent) {
    return (
      <div className="space-y-6">
        {/* Back to Study button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowPracticeProblems(false)}
            className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            ← Back to Study
          </button>
        </div>

        {/* Practice Problems Component */}
        {practiceProblemsComponent}
      </div>
    );
  }

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
      {/* Card Progress Indicator */}
      <div className="text-center mb-4">
        <p className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>
          Card {currentIndex + 1} of {totalCards}
        </p>
      </div>

      {/* Current Card */}
      <div className="relative">
        <StudyCard
          title={currentCard.title}
          content={currentCard.content}
          index={currentIndex + 1}
        />
      </div>

      {/* Simple Navigation - Previous and Next only */}
      <div className="flex items-center justify-center gap-4 mt-6">
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

      {/* Show "Start Practice" button ALWAYS after last card */}
      {currentIndex === totalCards - 1 && practiceProblemsComponent && (
        <div className="mt-8">
          <div
            className="p-8 rounded-2xl border-2 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
              borderColor: '#10B981'
            }}
          >
            <div className="mb-4">
              <CheckCircle className="w-16 h-16 mx-auto text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
              Ready to Practice?
            </h3>
            <p className="text-lg mb-6" style={{ color: 'var(--foreground-secondary)' }}>
              You've gone through all {totalCards} concept cards. Test your understanding with practice problems!
            </p>
            <button
              onClick={() => setShowPracticeProblems(true)}
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white'
              }}
            >
              Start Practice Problems →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
