// Scoreyo - AI Quiz Generator using OpenRouter (FREE)
// Races all free models in parallel — fastest valid response wins
import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string | {
    logic: string;           // Core concept in 2-3 sentences
    formula?: string;        // Formula if numerical question
    calculation?: string;    // Step-by-step calculation
    trapAlerts: string[];    // Why each wrong option is tempting (3 items)
    commonMistakes: string[]; // Common student errors (2-3 items)
  };
  difficulty: "easy" | "medium" | "hard";
  source: "ai" | "verified" | "ai-cached" | "ai-validated" | "expert-curated" | "ncert-derived"; // tracks where the question came from
  passage?: string; // For reading comprehension - poem, prose, or passage
}

// Using ONLY gpt-4o-mini to minimize costs.
// No racing - just one reliable, ultra-cheap model.
//
// Cost per 1M tokens (input/output): $0.15/$0.60
// Cost per 10-question batch (~1500 input + 2000 output tokens): ~$0.00175
// Cost per 5000 questions: ~$0.80-1.00
//
// This is 6-8x cheaper than Claude Haiku while still maintaining good quality.
const RACE_MODELS = [
  "openai/gpt-4o-mini",                // $0.15/$0.60 - ONLY model used
];

// Single model timeout - increased since no racing/competition
// 10 questions typically take 20-30s, so 60s timeout is safe
const PER_MODEL_TIMEOUT_MS = 60000;

function parseQuizResponse(text: string): QuizQuestion[] {
  let cleanText = text.trim();
  console.log("[Quiz Generator] Raw AI response length:", text.length);

  // Remove markdown code blocks if present
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  // Sometimes models prefix with text before JSON
  const jsonStart = cleanText.indexOf("[");
  const jsonEnd = cleanText.lastIndexOf("]");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonStart < jsonEnd) {
    cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
  }

  console.log("[Quiz Generator] Cleaned text for parsing:", cleanText.substring(0, 200));
  const questions: QuizQuestion[] = JSON.parse(cleanText);
  console.log("[Quiz Generator] Parsed questions count:", questions.length);

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Invalid response format");
  }

  return questions.map((q, idx) => {
    // Validate required fields
    if (!q || typeof q !== 'object') {
      console.error(`[Quiz Generator] Question ${idx + 1} is invalid:`, q);
      throw new Error(`Question ${idx + 1} is invalid`);
    }
    if (!q.question || typeof q.question !== 'string') {
      console.error(`[Quiz Generator] Question ${idx + 1} missing question text:`, q);
      throw new Error(`Question ${idx + 1} missing question text`);
    }
    if (!Array.isArray(q.options) || q.options.length < 4) {
      console.error(`[Quiz Generator] Question ${idx + 1} has invalid options:`, q.options);
      throw new Error(`Question ${idx + 1} has invalid options (need 4, got ${q.options?.length || 0})`);
    }
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
      console.error(`[Quiz Generator] Question ${idx + 1} has invalid correctAnswer:`, q.correctAnswer);
      throw new Error(`Question ${idx + 1} has invalid correctAnswer`);
    }

    console.log(`[Quiz Generator] Question ${idx + 1} validated successfully`);

    // Ensure trapAlerts has exactly 3 items (one for each wrong option)
    let explanation = q.explanation;
    if (typeof explanation === 'object' && explanation.trapAlerts) {
      // Ensure we have exactly 3 trap alerts
      while (explanation.trapAlerts.length < 3) {
        explanation.trapAlerts.push("This option is incorrect based on the concept explained above.");
      }
      explanation.trapAlerts = explanation.trapAlerts.slice(0, 3);

      // Ensure we have at least 2 common mistakes
      if (!explanation.commonMistakes || explanation.commonMistakes.length < 2) {
        explanation.commonMistakes = [
          "Not applying the fundamental concept correctly",
          "Rushing without careful analysis"
        ];
      }
    }

    return {
      passage: q.passage || undefined,
      question: q.question,
      options: q.options.slice(0, 4),
      correctAnswer: Math.min(Math.max(0, q.correctAnswer), 3),
      explanation: explanation || "Explanation not available",
      difficulty: q.difficulty || "medium",
      source: "ai" as const,
    };
  });
}

export async function generateQuiz(
  examName: string,
  subjectName: string,
  topic: string,
  numberOfQuestions: number = 5,
  difficulty: "easy" | "medium" | "hard" | "mixed" = "mixed"
): Promise<QuizQuestion[]> {
  const difficultyInstruction =
    difficulty === "mixed"
      ? "mix easy/medium/hard"
      : `all ${difficulty}`;

  // Check if this is a reading comprehension topic
  const isReadingComprehension = topic.toLowerCase().includes('reading comprehension') ||
                                  topic.toLowerCase().includes('passage') ||
                                  topic.toLowerCase().includes('prose') ||
                                  topic.toLowerCase().includes('poetry') ||
                                  topic.toLowerCase().includes('unseen');

  // Ultra-tight prompt — minimizes output tokens so generation completes fast.
  // The parser server-side fills trapAlerts/commonMistakes defaults if absent,
  // so we only require the essentials from the model.
  const prompt = isReadingComprehension
    ? `Generate ${numberOfQuestions} reading comprehension MCQs for ${examName} > ${subjectName} > ${topic} (${difficultyInstruction}).
IMPORTANT: Each question MUST include a "passage" field with a poem, prose passage, or story (100-200 words).
Return ONLY a JSON array. Each element:
{"passage":"[Full text of poem/prose/passage here]","question":"Question about the passage","options":["A","B","C","D"],"correctAnswer":0,"explanation":"1-2 sentence why correct","difficulty":"easy|medium|hard"}
Rules: exactly 4 options; correctAnswer is 0-3; passage is REQUIRED; valid JSON starting with [ ending with ].`
    : `Generate ${numberOfQuestions} MCQs for ${examName} > ${subjectName} > ${topic} (${difficultyInstruction}).
Return ONLY a JSON array. Each element:
{"question":"...","options":["A","B","C","D"],"correctAnswer":0,"explanation":"1-2 sentence why correct","difficulty":"easy|medium|hard"}
Rules: exactly 4 options; correctAnswer is 0-3; valid JSON starting with [ ending with ].`;

  const startedAt = Date.now();

  // Launch one request per model in parallel. The first that produces a valid
  // parsed result wins — slower models are abandoned (their fetches keep
  // running in the background but their results are ignored).
  const attempts = RACE_MODELS.map((modelId) =>
    (async () => {
      const modelStart = Date.now();
      const result = await Promise.race([
        (async () => {
          // Output budget. A single MCQ in our JSON shape (question +
          // 4 options + short explanation + difficulty) realistically lands
          // around 140–180 tokens. The prior 100/q + 100 buffer caused
          // mid-array truncation on ~25–30% of races, which then failed
          // JSON.parse and the model "lost" the race even though it
          // responded fastest. 180/q + 200 buffer eliminates truncation
          // without materially slowing the response (the model stops at
          // the closing `]` anyway). Hard ceiling raised to 2500.
          const { text } = await generateText({
            model: openrouter(modelId),
            prompt,
            maxOutputTokens: Math.min(2500, numberOfQuestions * 180 + 200),
            temperature: 0.7,
          });
          const parsed = parseQuizResponse(text);
          if (!parsed || parsed.length === 0) {
            throw new Error(`${modelId} returned empty result`);
          }
          return parsed;
        })(),
        new Promise<QuizQuestion[]>((_, reject) =>
          setTimeout(
            () => reject(new Error(`${modelId} timed out after ${PER_MODEL_TIMEOUT_MS}ms`)),
            PER_MODEL_TIMEOUT_MS
          )
        ),
      ]);
      console.log(
        `[Quiz Generator] ✓ ${modelId} won race in ${Date.now() - modelStart}ms (${result.length} qs)`
      );
      return result;
    })().catch((err) => {
      console.warn(`[Quiz Generator] ✗ ${modelId}:`, err?.message || err);
      throw err;
    })
  );

  try {
    // Promise.any resolves with the first fulfilled promise (ignoring rejections)
    const winner = await Promise.any(attempts);
    console.log(
      `[Quiz Generator] Race complete in ${Date.now() - startedAt}ms`
    );
    return winner;
  } catch {
    console.error(
      `[Quiz Generator] All ${RACE_MODELS.length} models failed in ${Date.now() - startedAt}ms — returning fallback`
    );
    return generateFallbackQuestions(topic, numberOfQuestions);
  }
}

function generateFallbackQuestions(
  topic: string,
  count: number
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      question: `[Service Unavailable] We couldn't load question ${i + 1} about ${topic}. Please try again shortly.`,
      options: [
        "Option A - Try again",
        "Option B - Check internet connection",
        "Option C - Choose a different topic",
        "Option D - Come back later",
      ],
      correctAnswer: 0,
      explanation:
        "This is a placeholder question shown when our question service is temporarily unavailable. Please try again.",
      difficulty: "easy",
      source: "ai",
    });
  }
  return questions;
}
