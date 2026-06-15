"use client";

import React from 'react';
import { CheckCircle2, XCircle, Lightbulb, BookOpen } from 'lucide-react';

interface StudyCardProps {
  title: string;
  content: string;
  index: number;
}

/**
 * Render text with bold markdown (**text** -> <strong>)
 */
function renderBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

/**
 * Individual concept card - Quizlet/Duolingo style
 */
export function StudyCard({ title, content, index }: StudyCardProps) {
  // Parse the content into structured parts
  const lines = content.split('\n').filter(line => line.trim());

  // Extract definition
  const definitionMatch = content.match(/\*\*Definition:\*\*\s*(.+?)(?=\*\*|$)/s);
  const definition = definitionMatch ? definitionMatch[1].trim() : '';

  // Extract rules
  const rulesMatch = content.match(/\*\*Rules:\*\*(.*?)(?=\*\*Examples:|$)/s);
  const rulesText = rulesMatch ? rulesMatch[1].trim() : '';
  const rules = rulesText
    .split(/\n\d+\.\s+/)
    .filter(r => r.trim())
    .map(r => r.trim().replace(/^\d+\.\s*/, '')); // Remove leading numbers like "1. "

  // Extract examples
  const correctExamples: string[] = [];
  const incorrectExamples: { text: string; reason: string }[] = [];

  const examplesMatch = content.match(/\*\*Examples:\*\*(.*)/s);
  if (examplesMatch) {
    const examplesText = examplesMatch[1];

    // Find CORRECT examples (remove emoji from regex)
    const correctMatches = examplesText.matchAll(/(?:CORRECT:)\s*(.+?)(?=\n|$)/g);
    for (const match of correctMatches) {
      correctExamples.push(match[1].trim().replace(/^["']|["']$/g, ''));
    }

    // Find INCORRECT examples with reasons (remove emoji from regex)
    const incorrectMatches = examplesText.matchAll(/(?:INCORRECT:)\s*(.+?)\s*→\s*WHY:\s*(.+?)(?=\n|$)/g);
    for (const match of incorrectMatches) {
      incorrectExamples.push({
        text: match[1].trim().replace(/^["']|["']$/g, ''),
        reason: match[2].trim()
      });
    }
  }

  return (
    <div
      className="mb-6 rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
      style={{
        background: 'var(--card-bg)',
        borderColor: 'var(--card-border)'
      }}
    >
      {/* Card Header */}
      <div
        className="px-6 py-4 border-b-2 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderColor: 'var(--card-border)'
        }}
      >
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="flex items-center gap-3 relative z-10">
          <h3 className="text-2xl font-bold text-white drop-shadow-md">
            {title.replace(/^###\s*\.?\s*/, '').replace(/\([^)]+\)$/, '').trim()}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-6">
        {/* Definition Box */}
        {definition && (
          <div
            className="p-5 rounded-xl border-l-4"
            style={{
              background: 'var(--hover-bg)',
              borderColor: '#667eea'
            }}
          >
            <div className="flex items-start gap-3">
              <BookOpen className="w-6 h-6 text-[#667eea] flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-[#667eea] mb-2">Definition</p>
                <p style={{ color: 'var(--foreground)' }} className="leading-relaxed">
                  {definition}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rules Section */}
        {rules.length > 0 && (
          <div className="space-y-3">
            <p className="font-bold text-lg flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Rules to Remember
            </p>
            <div className="space-y-3">
              {rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border-l-4 border-amber-500"
                  style={{ background: 'var(--hover-bg)' }}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <p style={{ color: 'var(--foreground)' }} className="leading-relaxed flex-1">
                      {renderBoldText(rule)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Examples Section - Side by Side Cards */}
        {(correctExamples.length > 0 || incorrectExamples.length > 0) && (
          <div className="space-y-4">
            <p className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>
              Examples
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Correct Examples */}
              {correctExamples.map((example, idx) => (
                <div
                  key={`correct-${idx}`}
                  className="p-5 rounded-xl border-2 border-emerald-500"
                  style={{ background: 'rgba(16, 185, 129, 0.05)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm mb-2">
                        CORRECT
                      </p>
                      <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed">
                        {example}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Incorrect Examples */}
              {incorrectExamples.map((example, idx) => (
                <div
                  key={`incorrect-${idx}`}
                  className="p-5 rounded-xl border-2 border-red-500"
                  style={{ background: 'rgba(239, 68, 68, 0.05)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-red-600 dark:text-red-400 text-sm mb-2">
                        INCORRECT
                      </p>
                      <p className="text-red-700 dark:text-red-300 leading-relaxed mb-2">
                        {example.text}
                      </p>
                      <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-700 dark:text-red-300">
                          <strong className="text-red-800 dark:text-red-200">Why?</strong> {example.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
