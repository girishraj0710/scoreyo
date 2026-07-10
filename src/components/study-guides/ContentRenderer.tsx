"use client";

import React from "react";
import {
  Lightbulb,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  XCircle,
  Sparkles,
  Code,
  ListChecks,
  Table as TableIcon,
} from "lucide-react";
import Image from "next/image";

interface ContentBlock {
  type: string;
  [key: string]: any;
}

interface ContentRendererProps {
  content: ContentBlock[];
}

export function ContentRenderer({ content }: ContentRendererProps) {
  return (
    <div className="space-y-4">
      {content.map((block, index) => (
        <ContentBlock key={index} block={block} />
      ))}
    </div>
  );
}

function ContentBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock text={block.text} />;

    case "heading":
      return <HeadingBlock text={block.text} level={block.level || 3} />;

    case "example":
      return <ExampleBlock examples={block.examples} />;

    case "practice":
      return <PracticeBlock questions={block.questions} />;

    case "note":
      return <NoteBlock text={block.text} variant={block.variant || "info"} />;

    case "formula":
      return <FormulaBlock formula={block.formula} description={block.description} />;

    case "list":
      return <ListBlock items={block.items} ordered={block.ordered} />;

    case "table":
      return <TableBlock headers={block.headers} rows={block.rows} caption={block.caption} />;

    case "diagram":
      return <DiagramBlock src={block.src} alt={block.alt} caption={block.caption} />;

    case "code":
      return <CodeBlock code={block.code} language={block.language} />;

    case "comparison":
      return <ComparisonBlock correct={block.correct} incorrect={block.incorrect} />;

    default:
      return null;
  }
}

// ─── PARAGRAPH ───────────────────────────────────────────────
function ParagraphBlock({ text }: { text: string }) {
  return (
    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
      {text}
    </p>
  );
}

// ─── HEADING ───────────────────────────────────────────────
function HeadingBlock({ text, level }: { text: string; level: number }) {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  const sizes: Record<number, string> = {
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
  };

  return (
    <Tag className={`font-heading font-bold text-[#16213E] dark:text-white ${sizes[level] || "text-xl"} mt-6 mb-3`}>
      {text}
    </Tag>
  );
}

// ─── EXAMPLE ───────────────────────────────────────────────
function ExampleBlock({ examples }: { examples: Array<{ text: string; explanation?: string }> }) {
  return (
    <div className="space-y-3">
      {examples.map((example, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl bg-[#E76F51]/5 dark:bg-[#E76F51]/10 border border-[#E76F51]/20"
        >
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-[#E76F51] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#16213E] dark:text-white mb-1">
                {example.text}
              </p>
              {example.explanation && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {example.explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PRACTICE QUESTIONS ───────────────────────────────────────────────
function PracticeBlock({ questions }: { questions: Array<{ question: string; answer: string; explanation?: string }> }) {
  return (
    <div className="rounded-2xl bg-[#2A9D8F]/5 dark:bg-[#2A9D8F]/10 border border-[#2A9D8F]/20 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ListChecks className="w-5 h-5 text-[#2A9D8F]" />
        <h4 className="font-heading text-lg font-bold text-[#16213E] dark:text-white">
          Practice Questions
        </h4>
      </div>
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={idx} className="pl-4 border-l-2 border-[#2A9D8F]/30">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {idx + 1}. {q.question}
            </p>
            <details className="text-sm">
              <summary className="cursor-pointer text-[#2A9D8F] font-semibold hover:text-[#2E8B57]">
                Show answer
              </summary>
              <div className="mt-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  {q.answer}
                </p>
                {q.explanation && (
                  <p className="text-slate-600 dark:text-slate-400">
                    {q.explanation}
                  </p>
                )}
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NOTE BLOCK ───────────────────────────────────────────────
function NoteBlock({ text, variant = "info" }: { text: string; variant?: "info" | "warning" | "success" }) {
  const variants = {
    info: {
      bg: "bg-[#E9C46A]/10",
      border: "border-[#E9C46A]/20",
      text: "text-slate-700 dark:text-slate-300",
      icon: <Sparkles className="w-5 h-5 text-[#E9C46A]" />,
    },
    warning: {
      bg: "bg-orange-50 dark:bg-orange-900/10",
      border: "border-orange-200 dark:border-orange-800/20",
      text: "text-orange-900 dark:text-orange-200",
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
    },
    success: {
      bg: "bg-[#2A9D8F]/10",
      border: "border-[#2A9D8F]/20",
      text: "text-[#2A9D8F]",
      icon: <CheckCircle2 className="w-5 h-5 text-[#2A9D8F]" />,
    },
  };

  const style = variants[variant];

  return (
    <div className={`flex gap-3 p-4 rounded-xl ${style.bg} border ${style.border}`}>
      {style.icon}
      <p className={`text-sm leading-relaxed ${style.text}`}>
        {text}
      </p>
    </div>
  );
}

// ─── FORMULA ───────────────────────────────────────────────
function FormulaBlock({ formula, description }: { formula: string; description?: string }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div className="font-mono text-lg text-center text-[#16213E] dark:text-white mb-2 overflow-x-auto">
        {formula}
      </div>
      {description && (
        <p className="text-sm text-center text-slate-600 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

// ─── LIST ───────────────────────────────────────────────
function ListBlock({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  const listClass = ordered ? "list-decimal" : "list-disc";

  return (
    <Tag className={`${listClass} pl-6 space-y-2 text-slate-700 dark:text-slate-300`}>
      {items.map((item, idx) => (
        <li key={idx} className="text-base leading-relaxed">
          {item}
        </li>
      ))}
    </Tag>
  );
}

// ─── TABLE ───────────────────────────────────────────────
function TableBlock({ headers, rows, caption }: { headers: string[]; rows: string[][]; caption?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left text-sm font-semibold text-[#16213E] dark:text-white border border-slate-200 dark:border-slate-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <p className="mt-2 text-xs text-center text-slate-500 dark:text-slate-400">
          {caption}
        </p>
      )}
    </div>
  );
}

// ─── DIAGRAM ───────────────────────────────────────────────
function DiagramBlock({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-6">
      <div className="relative w-full h-64 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-slate-600 dark:text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ─── CODE BLOCK ───────────────────────────────────────────────
function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div className="rounded-xl bg-slate-900 dark:bg-slate-950 p-4 overflow-x-auto">
      {language && (
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
          <Code className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-400 uppercase">{language}</span>
        </div>
      )}
      <pre className="font-mono text-sm text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── COMPARISON (Correct vs Incorrect) ───────────────────────────────────────────────
function ComparisonBlock({ correct, incorrect }: { correct: string; incorrect: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Incorrect */}
      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/20">
        <div className="flex items-center gap-2 mb-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm font-bold text-red-700 dark:text-red-400">Incorrect</span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 line-through">
          {incorrect}
        </p>
      </div>

      {/* Correct */}
      <div className="p-4 rounded-xl bg-[#2A9D8F]/10 border border-[#2A9D8F]/20">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-[#2A9D8F]" />
          <span className="text-sm font-bold text-[#2A9D8F]">Correct</span>
        </div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {correct}
        </p>
      </div>
    </div>
  );
}
