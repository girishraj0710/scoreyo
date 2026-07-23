// Centralized on-demand study-mode generator.
//
// Reads arbitrary content text (from a deck, study guide, uploaded doc, etc.)
// and produces mode-specific study material via a single LLM call. This is the
// engine behind the Quizlet-style "turn this into…" action: one source, any
// mode (deck / quiz / game / mock test), generated only when the student asks.
//
// Model is defined ONCE here (Gemini Flash via OpenRouter) so the whole convert
// pipeline can be re-pointed in a single line. Existing routes keep their own
// model config — this file does not touch them.

import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";

// The single model used by every on-demand conversion. Matches the model the
// rest of the app relies on (quiz-generator, custom-quiz) — proven reliable on
// our OpenRouter account, where the free Gemini models fail intermittently.
export const STUDY_MODE_MODEL = "openai/gpt-4o-mini";

// How much source text we send. Generous — large docs still fit; keeps latency
// and token cost bounded.
const MAX_INPUT_CHARS = 30000;

export type StudyMode = "deck" | "quiz" | "game" | "mock";

export interface DeckCard {
  front: string;
  back: string;
  hint?: string;
}

export interface QuizItem {
  question: string;
  options: string[]; // exactly 4
  correctAnswer: number; // 0-3
  explanation: string;
}

// Games (Match / Blocks / Blast) all consume term↔definition pairs.
export interface GamePair {
  term: string;
  definition: string;
}

export interface GenerateOptions {
  count?: number; // desired item count (default 10)
  difficulty?: "easy" | "medium" | "hard";
  title?: string; // source title, used to steer topical focus
}

export class GenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GenerationError";
  }
}

function difficultyLine(d?: string) {
  return d ? `Target difficulty: ${d}.` : "Use a balanced mix of difficulties.";
}

function buildPrompt(mode: StudyMode, text: string, opts: GenerateOptions): string {
  const count = opts.count ?? 10;
  const source = text.slice(0, MAX_INPUT_CHARS);
  const topic = opts.title ? `The material is about: "${opts.title}".` : "";
  const common = `You are an expert educator. ${topic} ${difficultyLine(opts.difficulty)}
Base everything ONLY on the study material below. Do not invent facts not supported by it.
Some material may contain math/LaTeX — read it as notation.

STUDY MATERIAL:
${source}

Return ONLY a valid JSON array, with no markdown, no code fences, and no text before or after it.`;

  if (mode === "deck") {
    return `${common}

Create exactly ${count} flashcards covering the most important concepts.
Each element: {"front": "term or question", "back": "concise, correct answer", "hint": "short optional hint"}
Keep fronts short and answerable; keep backs accurate and self-contained.`;
  }

  if (mode === "game") {
    return `${common}

Create exactly ${count} term/definition pairs for a matching game.
Each element: {"term": "short term (1-4 words)", "definition": "a clear one-line definition"}
Terms must be short and distinct; definitions must be concise (matchable at a glance).`;
  }

  // quiz + mock share the MCQ shape; mock is just longer/exam-like.
  const style =
    mode === "mock"
      ? "Write exam-style questions suitable for a timed full-length test, spanning the whole material."
      : "Write focused practice questions on the key concepts.";
  return `${common}

Create exactly ${count} multiple-choice questions. ${style}
Each element: {"question": "text", "options": ["A","B","C","D"], "correctAnswer": 0, "explanation": "why the correct option is right"}
Exactly 4 options each. "correctAnswer" is the 0-based index of the correct option. Vary the correct index across questions.`;
}

// Exported for unit testing (pure, no network).
export function parseJsonArray(raw: string): unknown[] {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new GenerationError("Model did not return a JSON array.");
  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    throw new GenerationError("Model returned malformed JSON.");
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new GenerationError("Model returned an empty result.");
  }
  return parsed;
}

export function validateDeck(items: unknown[]): DeckCard[] {
  const out: DeckCard[] = [];
  for (const it of items) {
    const c = it as Record<string, unknown>;
    if (typeof c.front === "string" && typeof c.back === "string" && c.front.trim() && c.back.trim()) {
      out.push({
        front: c.front.trim(),
        back: c.back.trim(),
        hint: typeof c.hint === "string" && c.hint.trim() ? c.hint.trim() : undefined,
      });
    }
  }
  return out;
}

export function validateGame(items: unknown[]): GamePair[] {
  const out: GamePair[] = [];
  for (const it of items) {
    const g = it as Record<string, unknown>;
    if (typeof g.term === "string" && typeof g.definition === "string" && g.term.trim() && g.definition.trim()) {
      out.push({ term: g.term.trim(), definition: g.definition.trim() });
    }
  }
  return out;
}

export function validateQuiz(items: unknown[]): QuizItem[] {
  const out: QuizItem[] = [];
  for (const it of items) {
    const q = it as Record<string, unknown>;
    const options = Array.isArray(q.options) ? q.options.filter((o) => typeof o === "string") : [];
    const idx = typeof q.correctAnswer === "number" ? q.correctAnswer : -1;
    if (
      typeof q.question === "string" &&
      q.question.trim() &&
      options.length === 4 &&
      idx >= 0 &&
      idx <= 3
    ) {
      out.push({
        question: q.question.trim(),
        options: options as string[],
        correctAnswer: idx,
        explanation: typeof q.explanation === "string" ? q.explanation.trim() : "",
      });
    }
  }
  return out;
}

export type GeneratedContent =
  | { mode: "deck"; items: DeckCard[] }
  | { mode: "game"; items: GamePair[] }
  | { mode: "quiz" | "mock"; items: QuizItem[] };

/**
 * Generate study material of a given mode from source text. Throws
 * GenerationError on empty input or when the model returns nothing usable.
 */
export async function generateStudyMode(
  mode: StudyMode,
  text: string,
  opts: GenerateOptions = {}
): Promise<GeneratedContent> {
  if (!text || text.trim().length < 100) {
    throw new GenerationError("Not enough source content to generate from.");
  }

  const { text: raw } = await generateText({
    model: openrouter(STUDY_MODE_MODEL),
    prompt: buildPrompt(mode, text, opts),
    maxOutputTokens: 4000,
    temperature: 0.6,
  });

  const items = parseJsonArray(raw);
  const wanted = opts.count ?? 10;

  if (mode === "deck") {
    const cards = validateDeck(items).slice(0, wanted);
    if (!cards.length) throw new GenerationError("Could not build flashcards from this content.");
    return { mode, items: cards };
  }
  if (mode === "game") {
    const pairs = validateGame(items).slice(0, wanted);
    if (pairs.length < 2) throw new GenerationError("Could not build a game from this content.");
    return { mode, items: pairs };
  }
  const qs = validateQuiz(items).slice(0, wanted);
  if (!qs.length) throw new GenerationError("Could not build questions from this content.");
  return { mode, items: qs };
}
