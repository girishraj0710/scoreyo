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
        <div className="p-4 rounded-xl border" style={{ background: "var(--primary-bg)", borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#E76F51] font-semibold text-sm">💡 Explanation</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{explanation}</p>
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
      <div className="p-4 rounded-xl border" style={{ background: "var(--primary-bg)", borderColor: "var(--card-border)" }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💡</span>
          <span className="font-semibold text-sm" style={{ color: "#10b981" }}>Core Concept</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{explanation.logic}</p>
      </div>

      {/* Formula & Calculation (if numerical) */}
      {explanation.formula && (
        <div className="p-4 rounded-xl border" style={{ background: "var(--primary-bg)", borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📐</span>
            <span className="text-[#3242CC] font-semibold text-sm">Formula</span>
          </div>
          <div className="px-3 py-2 rounded-lg border font-mono text-sm mb-2" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--foreground)" }}>
            {explanation.formula}
          </div>
          {explanation.calculation && (
            <>
              <div className="font-semibold text-xs mb-1 mt-3" style={{ color: "#3242CC" }}>Step-by-step:</div>
              <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono px-3 py-2 rounded-lg border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--foreground)" }}>
                {explanation.calculation}
              </pre>
            </>
          )}
        </div>
      )}

      {/* Trap Alerts - Why wrong options are tempting */}
      <div className="p-4 rounded-xl border" style={{ background: "var(--primary-bg)", borderColor: "rgba(251, 146, 60, 0.3)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚠️</span>
          <span className="font-semibold text-sm" style={{ color: "#fb923c" }}>Why Other Options Are Wrong</span>
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
                  <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{
                    backgroundColor: isUserChoice ? "#ef4444" : "#fb923c"
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs mb-1 line-clamp-1" style={{ color: "var(--foreground-secondary)" }}>{options[idx]}</p>
                    <p className="text-sm leading-relaxed" style={isUserChoice ? { color: "#dc2626", fontWeight: "500" } : { color: "var(--foreground)" }}>
                      {explanation.trapAlerts[i] || "This option is incorrect based on the concept."}
                    </p>
                    {isUserChoice && (
                      <span className="inline-block mt-1 text-xs font-semibold" style={{ color: "#dc2626" }}>
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
      <div className="p-4 rounded-xl border" style={{ background: "var(--primary-bg)", borderColor: "rgba(168, 85, 247, 0.3)" }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🚫</span>
          <span className="font-semibold text-sm" style={{ color: "#a855f7" }}>Common Student Mistakes</span>
        </div>
        <ul className="space-y-1.5">
          {explanation.commonMistakes.map((mistake, i) => (
            <li key={i} className="text-sm leading-relaxed flex items-start gap-2" style={{ color: "var(--foreground)" }}>
              <span style={{ color: "#a855f7" }} className="mt-0.5">•</span>
              <span>{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Correct Answer Highlight */}
      <div className="p-3 rounded-lg border-2 flex items-center gap-3" style={{ background: "var(--primary-bg)", borderColor: "#10b981" }}>
        <span className="shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "#06b6d4" }}>
          {String.fromCharCode(65 + correctAnswer)}
        </span>
        <div className="flex-1">
          <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--muted)" }}>✓ Correct Answer</div>
          <div className="text-sm font-medium" style={{ color: "#10b981" }}>{options[correctAnswer]}</div>
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
