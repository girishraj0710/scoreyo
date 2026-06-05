"use client";

import ReportQuestionButton from "./ReportQuestionButton";

interface RichExplanationProps {
  explanation: string | {
    logic: string;
    formula?: string | null;
    calculation?: string | null;
    trapAlerts: string[];
    commonMistakes: string[];
  };
  correctAnswer: number;
  userAnswer: number;
  options: string[];
  questionId?: string;
  examId?: string;
  subjectId?: string;
}

export function RichExplanation({ explanation, correctAnswer, userAnswer, options, questionId, examId, subjectId }: RichExplanationProps) {
  // Handle legacy string explanations
  if (typeof explanation === 'string') {
    return (
      <div className="mt-6 space-y-4" aria-live="polite" role="region" aria-label="Question explanation">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#4255FF] font-semibold text-sm">💡 Explanation</span>
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">{explanation}</p>
        </div>

        {/* Report Question Button */}
        {questionId && (
          <div className="flex justify-center pt-2">
            <ReportQuestionButton questionId={questionId} examId={examId} subjectId={subjectId} />
          </div>
        )}
      </div>
    );
  }

  // Rich explanation
  const wrongOptions = [0, 1, 2, 3].filter(i => i !== correctAnswer);

  return (
    <div className="mt-6 space-y-4" aria-live="polite" role="region" aria-label="Detailed question explanation">
      {/* Core Logic */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💡</span>
          <span className="text-emerald-700 font-semibold text-sm">Core Concept</span>
        </div>
        <p className="text-sm text-emerald-900 leading-relaxed">{explanation.logic}</p>
      </div>

      {/* Formula & Calculation (if numerical) */}
      {explanation.formula && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📐</span>
            <span className="text-[#3242CC] font-semibold text-sm">Formula</span>
          </div>
          <div className="px-3 py-2 rounded-lg border font-mono text-sm text-[#005A7A] mb-2" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            {explanation.formula}
          </div>
          {explanation.calculation && (
            <>
              <div className="text-[#3242CC] font-semibold text-xs mb-1 mt-3">Step-by-step:</div>
              <pre className="text-xs text-[#005A7A] leading-relaxed whitespace-pre-wrap font-mono px-3 py-2 rounded-lg border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                {explanation.calculation}
              </pre>
            </>
          )}
        </div>
      )}

      {/* Trap Alerts - Why wrong options are tempting */}
      <div className="p-4 rounded-xl border border-amber-200" style={{ background: "var(--primary-bg)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚠️</span>
          <span className="text-amber-700 font-semibold text-sm">Why Other Options Are Wrong</span>
        </div>
        <div className="space-y-2">
          {wrongOptions.map((idx, i) => {
            const isUserChoice = idx === userAnswer;
            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border`}
                style={{
                  background: isUserChoice ? "var(--primary-bg)" : "var(--card-bg)",
                  borderColor: isUserChoice ? "#dc2626" : "var(--card-border)"
                }}
              >
                <div className="flex items-start gap-2">
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isUserChoice
                      ? 'bg-red-500 text-white'
                      : 'bg-amber-200 text-amber-700'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs mb-1 line-clamp-1" style={{ color: "var(--foreground-secondary)" }}>{options[idx]}</p>
                    <p className={`text-sm leading-relaxed ${
                      isUserChoice ? 'text-red-900 font-medium' : ''
                    }`} style={!isUserChoice ? { color: "var(--foreground)" } : undefined}>
                      {explanation.trapAlerts[i] || "This option is incorrect based on the concept."}
                    </p>
                    {isUserChoice && (
                      <span className="inline-block mt-1 text-xs text-red-600 font-semibold">
                        ← You picked this
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="p-4 rounded-xl border border-purple-200" style={{ background: "var(--primary-bg)" }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🚫</span>
          <span className="text-purple-700 font-semibold text-sm">Common Student Mistakes</span>
        </div>
        <ul className="space-y-1.5">
          {explanation.commonMistakes.map((mistake, i) => (
            <li key={i} className="text-sm text-purple-900 leading-relaxed flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Correct Answer Highlight */}
      <div className="p-3 rounded-lg border-2 border-emerald-400 flex items-center gap-3" style={{ background: "var(--primary-bg)" }}>
        <span className="shrink-0 w-8 h-8 rounded-full bg-cyan-400 text-white flex items-center justify-center text-sm font-bold">
          {String.fromCharCode(65 + correctAnswer)}
        </span>
        <div className="flex-1">
          <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--muted)" }}>✓ Correct Answer</div>
          <div className="text-sm text-emerald-900 font-medium">{options[correctAnswer]}</div>
        </div>
      </div>

      {/* Report Question Button */}
      {questionId && (
        <div className="flex justify-center pt-2">
          <ReportQuestionButton questionId={questionId} examId={examId} subjectId={subjectId} />
        </div>
      )}
    </div>
  );
}
