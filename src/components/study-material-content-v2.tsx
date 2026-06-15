"use client";

import React from 'react';
import { StudyCard } from './study-card';
import { StudyCardNavigator } from './study-card-navigator';
import { PremiumMarkdownRenderer } from './premium-markdown-renderer';
import { PracticeProblemsSection } from './practice-problems-section';

interface Section {
  id: string;
  title: string;
  content?: string;
  order: number;
}

interface StudyMaterialContentProps {
  section: Section;
}

/**
 * Parses Core Concepts section into individual concept cards
 */
function parseCoreConceptsIntoCards(content: string): Array<{ title: string; content: string }> {
  const cards: Array<{ title: string; content: string }> = [];

  // Split by ### headings (concept titles like "### . Nouns")
  const parts = content.split(/^###\s+/m);

  for (let i = 1; i < parts.length; i++) {
    const lines = parts[i].split('\n');
    const title = lines[0].trim();
    const conceptContent = lines.slice(1).join('\n').trim();

    // Stop at Practice Problems section
    if (title.toLowerCase().includes('practice') || title.toLowerCase().includes('beginner level')) {
      break;
    }

    // Skip if no meaningful content
    if (!conceptContent) continue;

    // Skip sections that don't have the required structure (Definition, Rules, or Examples)
    // These are usually summary tables or comparison sections
    const hasDefinition = conceptContent.includes('**Definition:**');
    const hasRules = conceptContent.includes('**Rules:**');
    const hasExamples = conceptContent.includes('**Examples:**');

    if (!hasDefinition && !hasRules && !hasExamples) {
      continue; // Skip this section - likely a table or summary
    }

    cards.push({ title, content: conceptContent });
  }

  return cards;
}

/**
 * Extract Practice Problems section (everything after ## Practice Problems or ## Beginner Level)
 */
function extractPracticeProblems(content: string): string | null {
  const match = content.match(/##\s+(Practice Problems|Beginner Level)(.*)/is);
  return match ? '## ' + match[1] + match[2] : null;
}

export function StudyMaterialContent({ section }: StudyMaterialContentProps) {
  if (!section) return null;

  const cleanTitle = section.title
    ? section.title.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim()
    : '';

  const isCoreConceptsSection = cleanTitle.toLowerCase().includes('core concepts');
  const isIntroSection = cleanTitle.toLowerCase().includes('what is');

  // Check if section has subsections (JSON format from Thermodynamics)
  const hasSubsections = (section as any).subsections && Array.isArray((section as any).subsections);
  const hasItems = (section as any).items && Array.isArray((section as any).items);

  // For "What is..." section - simple intro
  if (isIntroSection && section.content) {
    return (
      <div className="space-y-6">
        <div
          className="p-8 rounded-2xl border-2"
          style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderColor: 'var(--card-border)'
          }}
        >
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            {cleanTitle}
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <PremiumMarkdownRenderer content={section.content} />
          </div>
        </div>
      </div>
    );
  }

  // Handle sections with items (formulas, mistakes lists)
  if (hasItems) {
    const items = (section as any).items;
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
          {cleanTitle}
        </h2>
        <div className="grid gap-4">
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="p-6 rounded-xl border-2"
              style={{
                background: 'var(--card-bg)',
                borderColor: 'var(--card-border)'
              }}
            >
              {/* Formula/Title */}
              {item.formula && (
                <div className="mb-4 p-4 rounded-lg font-mono text-xl font-bold text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(66, 85, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    color: 'var(--foreground)'
                  }}>
                  {item.formula}
                </div>
              )}

              {/* Name */}
              {item.name && (
                <h3 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                  {item.name}
                </h3>
              )}

              {/* Explanation */}
              {item.explanation && (
                <p className="mb-3" style={{ color: 'var(--foreground-secondary)' }}>
                  {item.explanation}
                </p>
              )}

              {/* When to use */}
              {item.when_to_use && (
                <div className="p-3 rounded-lg mb-3"
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderLeft: '4px solid #10B981'
                  }}>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">When to use: </span>
                  <span style={{ color: 'var(--foreground-secondary)' }}>{item.when_to_use}</span>
                </div>
              )}

              {/* Units */}
              {item.units && (
                <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                  <span className="font-semibold">Units:</span> {item.units}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle sections with subsections (JSON format like Thermodynamics)
  if (hasSubsections) {
    const subsections = (section as any).subsections;
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
          {cleanTitle}
        </h2>
        {subsections.map((sub: any, idx: number) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border-2"
            style={{
              background: 'var(--card-bg)',
              borderColor: 'var(--card-border)'
            }}
          >
            <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {sub.title}
            </h3>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PremiumMarkdownRenderer content={sub.content} />
            </div>
            {/* Render examples if present */}
            {sub.examples && sub.examples.length > 0 && (
              <div className="mt-6 space-y-4">
                <h4 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  Examples
                </h4>
                {sub.examples.map((example: any, exIdx: number) => (
                  <div
                    key={exIdx}
                    className="p-4 rounded-lg border-l-4"
                    style={{
                      background: 'var(--hover-bg)',
                      borderColor: '#4255FF'
                    }}
                  >
                    <p className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                      {example.title}
                    </p>
                    {example.problem && (
                      <div className="mb-3">
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Problem: </span>
                        <span style={{ color: 'var(--foreground-secondary)' }}>{example.problem}</span>
                      </div>
                    )}
                    {example.solution && (
                      <div className="mb-3">
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Solution: </span>
                        <div className="mt-2 whitespace-pre-wrap" style={{ color: 'var(--foreground-secondary)' }}>
                          {example.solution}
                        </div>
                      </div>
                    )}
                    {example.key_insight && (
                      <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30">
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
    );
  }

  // For Core Concepts - use card navigator (one at a time)
  if (isCoreConceptsSection && section.content) {
    const cards = parseCoreConceptsIntoCards(section.content);
    const practiceProblems = extractPracticeProblems(section.content);

    return (
      <div className="space-y-12">
        {/* Card Navigator (Flashcard Style) */}
        <StudyCardNavigator
          cards={cards}
          sectionTitle={cleanTitle}
          practiceProblemsComponent={
            practiceProblems ? <PracticeProblemsSection content={practiceProblems} /> : undefined
          }
        />
      </div>
    );
  }

  // Fallback for other sections
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
        {cleanTitle}
      </h2>
      {section.content && (
        <div className="max-w-none">
          <PremiumMarkdownRenderer content={section.content} />
        </div>
      )}
    </div>
  );
}
