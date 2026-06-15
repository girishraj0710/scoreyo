"use client";

import React from 'react';
import { Lightbulb, AlertCircle, CheckCircle2, XCircle, BookOpen, Target, TrendingUp } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Premium Markdown Renderer
 * Converts AI-generated markdown with emojis into clean, professional study material
 */
export function PremiumMarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Remove ALL emojis (comprehensive emoji regex)
  const cleanContent = content
    // Remove all emojis using comprehensive unicode ranges
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    // Remove common text emojis
    .replace(/[📖📚🎯✅❌⚠️💡🔍📝🧪🎓📊⭐🏆🌟💪🔤🗣️👄⚡☀️📌🏗️]/g, '')
    // Clean up multiple spaces left by emoji removal
    .replace(/\s{2,}/g, ' ')
    .trim();

  const lines = cleanContent.split('\n');
  const elements: React.ReactElement[] = [];
  let currentIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // H3 Headings (### )
    if (line.match(/^###\s+/)) {
      const title = line.replace(/^###\s+/, '').trim();
      elements.push(
        <h3
          key={currentIndex++}
          className="text-2xl font-bold mt-8 mb-4 pb-2 border-b"
          style={{ color: 'var(--foreground)', borderColor: 'var(--card-border)' }}
        >
          {title}
        </h3>
      );
      continue;
    }

    // H4 Headings (#### )
    if (line.match(/^####\s+/)) {
      const title = line.replace(/^####\s+/, '').trim();
      elements.push(
        <h4
          key={currentIndex++}
          className="text-xl font-semibold mt-6 mb-3"
          style={{ color: 'var(--foreground)' }}
        >
          {title}
        </h4>
      );
      continue;
    }

    // Special bold headings: **Definition:**, **Rules:**, **Examples:**
    if (line.match(/^\*\*(Definition|Rules|Examples|Note|Important|Key Point|Remember):\*\*/i)) {
      const title = line.replace(/^\*\*(.+?):\*\*\s*/, '$1:');
      elements.push(
        <h4
          key={currentIndex++}
          className="text-lg font-semibold mt-6 mb-3 text-indigo-600 dark:text-indigo-400"
        >
          {title}
        </h4>
      );
      continue;
    }

    // Bold patterns: **text**
    if (line.includes('**')) {
      const formattedLine = formatBoldText(line);
      elements.push(
        <p key={currentIndex++} className="mb-3 leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
          {formattedLine}
        </p>
      );
      continue;
    }

    // Bullet points
    if (line.startsWith('- ') || line.startsWith('• ')) {
      const text = line.replace(/^[-•]\s*/, '');
      elements.push(
        <div key={currentIndex++} className="flex items-start gap-2 mb-2 ml-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
          <span className="leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>{text}</span>
        </div>
      );
      continue;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s*(.+)$/);
      if (match) {
        const [, num, text] = match;
        elements.push(
          <div key={currentIndex++} className="flex items-start gap-3 mb-2 ml-4">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-semibold">
              {num}
            </span>
            <span className="leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>{text}</span>
          </div>
        );
        continue;
      }
    }

    // Example boxes: - ✅ CORRECT / - ❌ INCORRECT (with or without leading dash)
    const exampleMatch = line.match(/^-?\s*(✅|❌)\s*(\*\*)?(?:CORRECT|INCORRECT|WRONG)?(:)?(\*\*)?\s*(.+)$/i);
    if (exampleMatch) {
      const isCorrect = exampleMatch[1] === '✅';
      const text = exampleMatch[5];

      elements.push(
        <div
          key={currentIndex++}
          className="p-4 rounded-lg mb-3 border-l-4"
          style={{
            background: isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            borderColor: isCorrect ? '#10B981' : '#EF4444'
          }}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-semibold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <div className="text-sm font-mono" style={{ color: 'var(--foreground)' }}>
                {text}
              </div>
            </div>
          </div>
        </div>
      );
      continue;
    }

    // Block quotes (> )
    if (line.startsWith('> ')) {
      const text = line.replace(/^>\s*/, '');
      elements.push(
        <blockquote
          key={currentIndex++}
          className="border-l-4 pl-4 py-2 mb-3 italic"
          style={{ borderColor: 'var(--card-border)', color: 'var(--foreground-secondary)' }}
        >
          {text}
        </blockquote>
      );
      continue;
    }

    // Code blocks (```...```)
    if (line.startsWith('```')) {
      let codeLines: string[] = [];
      i++; // Skip the opening ```
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }

      elements.push(
        <pre
          key={currentIndex++}
          className="p-4 rounded-lg mb-4 overflow-x-auto"
          style={{ background: 'var(--hover-bg)', color: 'var(--foreground)' }}
        >
          <code className="text-sm font-mono">{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // Horizontal rules (---)
    if (line === '---' || line === '___') {
      elements.push(
        <hr
          key={currentIndex++}
          className="my-6"
          style={{ borderColor: 'var(--card-border)', opacity: 0.3 }}
        />
      );
      continue;
    }

    // Tables (| ... |)
    if (line.startsWith('|')) {
      const tableLines: string[] = [line];
      i++;
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      i--; // Go back one line

      elements.push(renderTable(tableLines, currentIndex++));
      continue;
    }

    // Regular paragraphs
    if (line.length > 0) {
      const formattedLine = formatBoldText(line);
      elements.push(
        <p
          key={currentIndex++}
          className="mb-4 leading-relaxed text-base"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          {formattedLine}
        </p>
      );
    }
  }

  return <div className="space-y-2">{elements}</div>;
}

/**
 * Format text with **bold** patterns
 */
function formatBoldText(text: string): (string | JSX.Element)[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold" style={{ color: 'var(--foreground)' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Render markdown tables
 */
function renderTable(lines: string[], key: number): JSX.Element {
  const rows = lines.map(line =>
    line
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0)
  );

  // Skip separator row (usually second row with dashes)
  const hasHeaderSeparator = rows.length > 1 && rows[1].every(cell => /^-+$/.test(cell));
  const headerRow = rows[0];
  const dataRows = hasHeaderSeparator ? rows.slice(2) : rows.slice(1);

  return (
    <div key={key} className="overflow-x-auto mb-6">
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ background: 'var(--hover-bg)' }}>
            {headerRow.map((cell, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-sm font-semibold border"
                style={{ color: 'var(--foreground)', borderColor: 'var(--card-border)' }}
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              style={{ background: rowIdx % 2 === 0 ? 'var(--card-bg)' : 'var(--hover-bg)' }}
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-4 py-3 text-sm border"
                  style={{ color: 'var(--foreground-secondary)', borderColor: 'var(--card-border)' }}
                >
                  {formatBoldText(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
