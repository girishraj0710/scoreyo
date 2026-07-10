"use client";

import React from 'react';
import { StudyCard } from './study-card';
import { StudyCardNavigator } from './study-card-navigator';
import { PremiumMarkdownRenderer } from './premium-markdown-renderer';
import { PracticeProblemsSection } from './practice-problems-section';
import { BookOpen, Lightbulb, AlertTriangle, Target, Zap } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  content?: string;
  order: number;
}

interface StudyContentPremiumProps {
  section: Section;
}

/**
 * Premium content renderer with enhanced visual hierarchy
 */
export function StudyContentPremium({ section }: StudyContentPremiumProps) {
  if (!section) return null;

  const cleanTitle = section.title
    ? section.title.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim()
    : '';

  // Detect section type
  const hasSubsections = (section as any).subsections && Array.isArray((section as any).subsections);
  const hasItems = (section as any).items && Array.isArray((section as any).items);
  const hasMistakes = (section as any).mistakes && Array.isArray((section as any).mistakes);
  const hasPoints = (section as any).points && Array.isArray((section as any).points);
  const hasProblems = (section as any).problems && Array.isArray((section as any).problems);
  const isCoreConceptsSection = cleanTitle.toLowerCase().includes('core concepts');

  // Get icon based on section type
  const getSectionIcon = () => {
    if (hasMistakes) return <AlertTriangle className="w-6 h-6" />;
    if (hasProblems) return <Target className="w-6 h-6" />;
    if (hasPoints) return <Zap className="w-6 h-6" />;
    if (hasItems) return <Lightbulb className="w-6 h-6" />;
    return <BookOpen className="w-6 h-6" />;
  };

  // Get gradient based on section type
  const getSectionGradient = () => {
    if (hasMistakes) return 'from-red-500/10 to-orange-500/10';
    if (hasProblems) return 'from-emerald-500/10 to-teal-500/10';
    if (hasPoints) return 'from-purple-500/10 to-pink-500/10';
    if (hasItems) return 'from-amber-500/10 to-yellow-500/10';
    return 'from-indigo-500/10 to-purple-500/10';
  };

  return (
    <div className="max-w-4xl mx-auto pb-32">
      {/* Section header with icon */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${getSectionGradient()} backdrop-blur-sm border`}
            style={{ borderColor: 'var(--card-border)' }}
          >
            {getSectionIcon()}
          </div>
          <div className="flex-1">
            <h1
              className="text-4xl sm:text-5xl font-bold mb-2 leading-tight"
              style={{ color: 'var(--foreground)' }}
            >
              {cleanTitle}
            </h1>
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          </div>
        </div>
      </div>

      {/* Render content based on type */}
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Simple content sections */}
        {section.content && !hasSubsections && !hasItems && !hasMistakes && !hasPoints && !hasProblems && !isCoreConceptsSection && (
          <div
            className="p-8 sm:p-10 rounded-3xl border-2 shadow-sm hover:shadow-lg transition-all duration-300"
            style={{
              background: 'var(--card-bg)',
              borderColor: 'var(--card-border)'
            }}
          >
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PremiumMarkdownRenderer content={section.content} />
            </div>
          </div>
        )}

        {/* Core Concepts (flashcard style) */}
        {isCoreConceptsSection && section.content && (
          <StudyCardNavigator
            cards={parseCoreConceptsIntoCards(section.content)}
            sectionTitle={cleanTitle}
            practiceProblemsComponent={
              extractPracticeProblems(section.content) ? (
                <PracticeProblemsSection content={extractPracticeProblems(section.content)!} />
              ) : undefined
            }
          />
        )}

        {/* Subsections */}
        {hasSubsections && (
          <div className="space-y-6">
            {(section as any).subsections.map((sub: any, idx: number) => (
              <div
                key={idx}
                className="group p-8 sm:p-10 rounded-3xl border-2 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'var(--card-bg)',
                  borderColor: 'var(--card-border)'
                }}
              >
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  {sub.title}
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <PremiumMarkdownRenderer content={sub.content} />
                </div>
                {/* Examples */}
                {sub.examples && sub.examples.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      Examples
                    </h3>
                    {sub.examples.map((example: any, exIdx: number) => (
                      <div
                        key={exIdx}
                        className="p-6 rounded-2xl border-l-4"
                        style={{
                          background: 'var(--hover-bg)',
                          borderColor: '#E76F51'
                        }}
                      >
                        <p className="font-semibold mb-3 text-lg" style={{ color: 'var(--foreground)' }}>
                          {example.title}
                        </p>
                        {example.problem && (
                          <div className="mb-4">
                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Problem: </span>
                            <span style={{ color: 'var(--foreground-secondary)' }}>{example.problem}</span>
                          </div>
                        )}
                        {example.solution && (
                          <div className="mb-4">
                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Solution: </span>
                            <div className="mt-2 whitespace-pre-wrap font-mono text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                              {example.solution}
                            </div>
                          </div>
                        )}
                        {example.key_insight && (
                          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">💡 Key Insight: </span>
                            <span className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>{example.key_insight}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Items (Formulas) */}
        {hasItems && (
          <div className="grid gap-4 sm:gap-6">
            {(section as any).items.map((item: any, idx: number) => (
              <div
                key={idx}
                className="group p-6 sm:p-8 rounded-3xl border-2 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'var(--card-bg)',
                  borderColor: 'var(--card-border)'
                }}
              >
                {item.formula && (
                  <div
                    className="mb-5 p-5 rounded-2xl font-mono text-xl sm:text-2xl font-bold text-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(66, 85, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                      color: 'var(--foreground)'
                    }}
                  >
                    {item.formula}
                  </div>
                )}
                {item.name && (
                  <h3 className="text-xl font-bold mb-3 text-indigo-600 dark:text-indigo-400">
                    {item.name}
                  </h3>
                )}
                {item.explanation && (
                  <p className="mb-4 text-lg" style={{ color: 'var(--foreground-secondary)' }}>
                    {item.explanation}
                  </p>
                )}
                {item.when_to_use && (
                  <div
                    className="p-4 rounded-xl mb-3"
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderLeft: '4px solid #10B981'
                    }}
                  >
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">When to use: </span>
                    <span style={{ color: 'var(--foreground-secondary)' }}>{item.when_to_use}</span>
                  </div>
                )}
                {item.units && (
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground-secondary)' }}>
                    <span className="font-semibold">Units:</span> {item.units}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Mistakes */}
        {hasMistakes && (
          <div className="grid gap-6">
            {(section as any).mistakes.map((mistake: any, idx: number) => (
              <div
                key={idx}
                className="group p-6 sm:p-8 rounded-3xl border-2 border-l-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'var(--card-bg)',
                  borderColor: 'var(--card-border)',
                  borderLeftColor: '#EF4444'
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">✗</span>
                  </div>
                  <h3 className="text-xl font-bold text-red-600 dark:text-red-400 flex-1">
                    {mistake.mistake}
                  </h3>
                </div>
                {mistake.why_wrong && (
                  <div className="mb-5 p-5 rounded-2xl bg-red-50 dark:bg-red-950/30">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                      Why this is wrong:
                    </p>
                    <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                      {mistake.why_wrong}
                    </p>
                  </div>
                )}
                {mistake.correct_approach && (
                  <div
                    className="p-5 rounded-2xl"
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderLeft: '4px solid #10B981'
                    }}
                  >
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
                      ✓ Correct Approach:
                    </p>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <PremiumMarkdownRenderer content={mistake.correct_approach} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Revision Points */}
        {hasPoints && (
          <div
            className="p-8 sm:p-10 rounded-3xl border-2 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              borderColor: 'var(--card-border)'
            }}
          >
            <div className="grid gap-3">
              {(section as any).points.map((point: string, idx: number) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover:scale-110 transition-transform duration-200">
                    <span className="text-white text-sm font-bold">{idx + 1}</span>
                  </div>
                  <p className="text-base sm:text-lg flex-1 leading-relaxed" style={{ color: 'var(--foreground)' }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practice Problems */}
        {hasProblems && <PracticeProblemsSection content={JSON.stringify((section as any).problems)} />}
      </div>
    </div>
  );
}

// Helper functions (reused from v1)
function parseCoreConceptsIntoCards(content: string): Array<{ title: string; content: string }> {
  const cards: Array<{ title: string; content: string }> = [];
  const parts = content.split(/^###\s+/m);

  for (let i = 1; i < parts.length; i++) {
    const lines = parts[i].split('\n');
    const title = lines[0].trim();
    const conceptContent = lines.slice(1).join('\n').trim();

    if (title.toLowerCase().includes('practice') || title.toLowerCase().includes('beginner level')) {
      break;
    }

    if (!conceptContent) continue;

    const hasDefinition = conceptContent.includes('**Definition:**');
    const hasRules = conceptContent.includes('**Rules:**');
    const hasExamples = conceptContent.includes('**Examples:**');

    if (!hasDefinition && !hasRules && !hasExamples) {
      continue;
    }

    cards.push({ title, content: conceptContent });
  }

  return cards;
}

function extractPracticeProblems(content: string): string | null {
  const match = content.match(/##\s+(Practice Problems|Beginner Level)(.*)/is);
  return match ? '## ' + match[1] + match[2] : null;
}
