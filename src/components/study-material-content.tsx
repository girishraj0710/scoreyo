"use client";

import { Lightbulb, AlertTriangle, BookOpen, Target, CheckCircle } from 'lucide-react';

// Simple markdown-like text formatter
function FormattedText({ children }: { children: string }) {
  return (
    <div className="whitespace-pre-wrap">
      {children.split('\n').map((line, i) => (
        <span key={i}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return <span key={j}>{part}</span>;
          })}
          {i < children.split('\n').length - 1 && <br />}
        </span>
      ))}
    </div>
  );
}

interface Example {
  title: string;
  problem: string;
  solution: string;
  key_insight?: string;
}

interface Subsection {
  title: string;
  content: string;
  examples?: Example[];
}

interface FormulaItem {
  formula: string;
  name: string;
  explanation: string;
  when_to_use: string;
  units?: string;
}

interface Mistake {
  mistake: string;
  why_wrong: string;
  correct_approach: string;
}

interface Problem {
  question: string;
  hint: string;
  answer: string;
  explanation: string;
}

interface Section {
  id: string;
  title: string;
  content?: string;
  subsections?: Subsection[];
  items?: FormulaItem[];
  mistakes?: Mistake[];
  points?: string[];
  problems?: Problem[];
  order: number;
}

interface StudyMaterialContentProps {
  section: Section;
}

export function StudyMaterialContent({ section }: StudyMaterialContentProps) {
  if (!section) return null;

  return (
    <div className="space-y-8">
      {/* Section Title */}
      <div>
        <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
          {section.title}
        </h2>
        {section.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none" style={{ color: "var(--foreground)" }}>
            <FormattedText>{section.content}</FormattedText>
          </div>
        )}
      </div>

      {/* Subsections */}
      {section.subsections?.map((subsection, idx) => (
        <div key={idx} className="space-y-4">
          <h3 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {subsection.title}
          </h3>
          <div className="prose dark:prose-invert max-w-none" style={{ color: "var(--foreground)" }}>
            <FormattedText>{subsection.content}</FormattedText>
          </div>

          {/* Examples */}
          {subsection.examples?.map((example, exIdx) => (
            <div
              key={exIdx}
              className="p-6 rounded-xl border-l-4"
              style={{
                background: "var(--hover-bg)",
                borderColor: "#4255FF"
              }}
            >
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-[#4255FF] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                    {example.title}
                  </h4>
                  <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
                    {example.problem}
                  </p>
                  <div className="p-4 rounded-lg" style={{ background: "var(--card-bg)" }}>
                    <p className="font-semibold text-emerald-500 mb-2">Solution:</p>
                    <div className="prose dark:prose-invert" style={{ color: "var(--foreground-secondary)" }}>
                      <FormattedText>{example.solution}</FormattedText>
                    </div>
                  </div>
                  {example.key_insight && (
                    <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-amber-500/10">
                      <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm" style={{ color: "var(--foreground)" }}>
                        <strong>Key Insight:</strong> {example.key_insight}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Formulas */}
      {section.items?.map((item, idx) => (
        <div
          key={idx}
          className="p-6 rounded-xl border"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)"
          }}
        >
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-[#4255FF] mb-2 font-mono">
              {item.formula}
            </div>
            <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {item.name}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                Explanation:
              </p>
              <p style={{ color: "var(--foreground-secondary)" }}>{item.explanation}</p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                When to Use:
              </p>
              <p style={{ color: "var(--foreground-secondary)" }}>{item.when_to_use}</p>
            </div>
          </div>
          {item.units && (
            <div className="mt-3 text-sm" style={{ color: "var(--foreground-secondary)" }}>
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>Units:</span> {item.units}
            </div>
          )}
        </div>
      ))}

      {/* Common Mistakes */}
      {section.mistakes?.map((mistake, idx) => (
        <div
          key={idx}
          className="p-6 rounded-xl border-l-4"
          style={{
            background: "var(--hover-bg)",
            borderColor: "#ef4444"
          }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-500 mb-2">Common Mistake:</h4>
              <p className="mb-3" style={{ color: "var(--foreground)" }}>{mistake.mistake}</p>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-red-500">Why it's wrong:</span>
                  <p style={{ color: "var(--foreground-secondary)" }}>{mistake.why_wrong}</p>
                </div>
                <div>
                  <span className="font-semibold text-emerald-500">Correct approach:</span>
                  <p style={{ color: "var(--foreground-secondary)" }}>{mistake.correct_approach}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Quick Revision Points */}
      {section.points && (
        <div
          className="p-6 rounded-xl"
          style={{ background: "var(--hover-bg)" }}
        >
          <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <BookOpen className="w-5 h-5 text-[#4255FF]" />
            Quick Revision Points
          </h4>
          <ul className="space-y-2">
            {section.points.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#4255FF] mt-1 flex-shrink-0" />
                <span style={{ color: "var(--foreground-secondary)" }}>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Practice Problems */}
      {section.problems?.map((problem, idx) => (
        <div
          key={idx}
          className="p-6 rounded-xl border"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)"
          }}
        >
          <h4 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>
            Practice Problem {idx + 1}
          </h4>
          <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>{problem.question}</p>
          <details className="mb-3">
            <summary className="cursor-pointer text-[#4255FF] hover:underline font-medium">
              💡 Show Hint
            </summary>
            <p className="mt-2 p-3 rounded-lg" style={{ background: "var(--hover-bg)", color: "var(--foreground-secondary)" }}>
              {problem.hint}
            </p>
          </details>
          <details>
            <summary className="cursor-pointer text-emerald-500 hover:underline font-medium">
              ✓ Show Answer & Explanation
            </summary>
            <div className="mt-3 p-4 rounded-lg" style={{ background: "var(--hover-bg)" }}>
              <p className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                Answer: {problem.answer}
              </p>
              <div className="prose dark:prose-invert" style={{ color: "var(--foreground-secondary)" }}>
                <FormattedText>{problem.explanation}</FormattedText>
              </div>
            </div>
          </details>
        </div>
      ))}
    </div>
  );
}
