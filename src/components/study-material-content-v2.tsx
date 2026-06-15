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

    // Skip if no content
    if (!conceptContent || conceptContent.length < 50) continue;

    // Stop at Practice Problems section
    if (title.toLowerCase().includes('practice') || title.toLowerCase().includes('beginner level')) {
      break;
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
