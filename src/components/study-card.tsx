"use client";

import React from 'react';
import { CheckCircle2, XCircle, Lightbulb, BookOpen } from 'lucide-react';

interface StudyCardProps {
  title: string;
  content: string;
  index: number;
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
    .map(r => r.trim());

  // Extract examples
  const correctExamples: string[] = [];
  const incorrectExamples: { text: string; reason: string }[] = [];

  const examplesMatch = content.match(/\*\*Examples:\*\*(.*)/s);
  if (examplesMatch) {
    const examplesText = examplesMatch[1];

    // Find CORRECT examples
    const correctMatches = examplesText.matchAll(/(?:✅|CORRECT:)\s*(.+?)(?=\n|$)/g);
    for (const match of correctMatches) {
      correctExamples.push(match[1].trim().replace(/^["']|["']$/g, ''));
    }

    // Find INCORRECT examples with reasons
    const incorrectMatches = examplesText.matchAll(/(?:❌|INCORRECT:)\s*(.+?)\s*→\s*WHY:\s*(.+?)(?=\n|$)/g);
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
        className="px-6 py-4 border-b-2"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderColor: 'var(--card-border)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
            {index}
          </div>
          <h3 className="text-2xl font-bold text-white">
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
                      {rule}
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
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm mb-2">
                        ✓ CORRECT
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
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-600 dark:text-red-400 text-sm mb-2">
                        ✗ INCORRECT
                      </p>
                      <p className="text-red-700 dark:text-red-300 leading-relaxed mb-2">
                        {example.text}
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        <strong>Why?</strong> {example.reason}
                      </p>
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
