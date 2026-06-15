"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Target, CheckCircle2, XCircle } from 'lucide-react';

interface PracticeProblem {
  level: string;
  number: number;
  question: string;
  answer: string;
  explanation?: string;
}

interface PracticeProblemsProps {
  content: string;
}

/**
 * Premium UI for practice problems
 * Parses markdown and displays as interactive cards
 */
export function PracticeProblemsSection({ content }: PracticeProblemsProps) {
  const [expandedProblem, setExpandedProblem] = useState<number | null>(null);

  // Parse practice problems from markdown
  const problems = parsePracticeProblems(content);

  const toggleProblem = (index: number) => {
    setExpandedProblem(expandedProblem === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div
        className="p-8 rounded-2xl border-2"
        style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            Practice Problems
          </h2>
          <p className="text-lg" style={{ color: 'var(--foreground-secondary)' }}>
            Test your understanding with {problems.length} questions
          </p>
        </div>

        {/* Problem Cards */}
        <div className="space-y-4">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="rounded-xl border-2 overflow-hidden transition-all duration-200"
              style={{
                background: expandedProblem === index ? 'var(--hover-bg)' : 'var(--card-bg)',
                borderColor: expandedProblem === index ? '#10B981' : 'var(--card-border)'
              }}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleProblem(index)}
                className="w-full px-6 py-4 flex items-start gap-4 text-left transition-all duration-200 hover:bg-opacity-80"
                style={{
                  background: getLevelColor(problem.level)
                }}
              >
                {/* Number Badge */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                  <span className="text-lg font-bold" style={{ color: getLevelColorDark(problem.level) }}>
                    {problem.number}
                  </span>
                </div>

                {/* Question Text */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90" style={{ color: getLevelColorDark(problem.level) }}>
                      {problem.level}
                    </span>
                  </div>
                  <p className="text-base font-medium text-white leading-relaxed">
                    {problem.question}
                  </p>
                </div>

                {/* Expand Icon */}
                <div className="flex-shrink-0">
                  {expandedProblem === index ? (
                    <ChevronUp className="w-6 h-6 text-white" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-white" />
                  )}
                </div>
              </button>

              {/* Answer Section (Expandable) */}
              {expandedProblem === index && (
                <div className="px-6 py-5 border-t-2" style={{ borderColor: 'var(--card-border)' }}>
                  {/* Answer */}
                  <div className="mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                          ANSWER
                        </p>
                        <p className="text-base font-medium" style={{ color: 'var(--foreground)' }}>
                          {problem.answer}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  {problem.explanation && (
                    <div className="p-4 rounded-lg" style={{ background: 'var(--hover-bg)' }}>
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                            EXPLANATION
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                            {problem.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Start Quiz CTA */}
        <div className="mt-8 text-center">
          <button
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white'
            }}
          >
            Start Quiz Now →
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Parse practice problems from markdown text
 */
function parsePracticeProblems(content: string): PracticeProblem[] {
  const problems: PracticeProblem[] = [];

  // Split by difficulty levels (### headings)
  const beginnerMatch = content.match(/###\s*Beginner Level.*?\n([\s\S]*?)(?=###|$)/i);
  const intermediateMatch = content.match(/###\s*Intermediate Level.*?\n([\s\S]*?)(?=###|$)/i);
  const advancedMatch = content.match(/###\s*Advanced Level.*?\n([\s\S]*?)(?=###|$)/i);

  if (beginnerMatch) {
    parseLevel(beginnerMatch[1], 'Beginner', problems);
  }
  if (intermediateMatch) {
    parseLevel(intermediateMatch[1], 'Intermediate', problems);
  }
  if (advancedMatch) {
    parseLevel(advancedMatch[1], 'Advanced', problems);
  }

  return problems;
}

function parseLevel(text: string, level: string, problems: PracticeProblem[]) {
  // Match pattern: 1. **Question** ... **Answer:** ... - explanation
  const questionPattern = /(\d+)\.\s*\*\*(.+?)\*\*.*?\*\*Answer:\*\*\s*(.+?)(?=\d+\.\s*\*\*|$)/gs;

  let match;
  while ((match = questionPattern.exec(text)) !== null) {
    const number = parseInt(match[1]);
    const question = match[2].trim();
    const answerText = match[3].trim();

    // Split answer and explanation (usually separated by " - ")
    const answerParts = answerText.split(/\s*-\s*/);
    const answer = answerParts[0].trim();
    const explanation = answerParts.slice(1).join(' - ').trim() || undefined;

    problems.push({
      level,
      number,
      question,
      answer,
      explanation
    });
  }
}

function getLevelColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'beginner':
      return 'linear-gradient(135deg, #10B981 0%, #059669 100%)'; // Emerald
    case 'intermediate':
      return 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'; // Amber
    case 'advanced':
      return 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'; // Red
    default:
      return 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)'; // Indigo
  }
}

function getLevelColorDark(level: string): string {
  switch (level.toLowerCase()) {
    case 'beginner':
      return '#059669';
    case 'intermediate':
      return '#D97706';
    case 'advanced':
      return '#DC2626';
    default:
      return '#4F46E5';
  }
}
