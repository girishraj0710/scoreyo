// PrepGenie - AI Quiz Generator using OpenRouter (FREE)
// Races all free models in parallel — fastest response wins
// Includes self-verification prompt for higher accuracy
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
  source: "ai" | "verified"; // tracks where the question came from
}

// Free models — prioritized by speed/reliability
// Only use fastest 3 models to reduce overhead
const FREE_MODELS = [
  "google/gemma-3-27b-it:free",           // Fast and reliable
  "meta-llama/llama-3.3-70b-instruct:free", // High quality
  "nvidia/nemotron-3-super-120b-a12b:free", // Backup
];

function parseQuizResponse(text: string): QuizQuestion[] {
  let cleanText = text.trim();
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

  const questions: QuizQuestion[] = JSON.parse(cleanText);

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Invalid response format");
  }

  return questions.map((q) => {
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
      question: q.question,
      options: q.options.slice(0, 4),
      correctAnswer: Math.min(Math.max(0, q.correctAnswer), 3),
      explanation,
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
      ? "Mix of easy (1-2), medium (2-3), and hard (1-2) questions"
      : `All questions should be ${difficulty} difficulty`;

  // Enhanced prompt with rich explanation structure
  const prompt = `You are an expert exam question creator for Indian competitive exams with decades of teaching experience. Generate exactly ${numberOfQuestions} multiple choice questions for:

Exam: ${examName}
Subject: ${subjectName}
Topic: ${topic}
Difficulty: ${difficultyInstruction}

IMPORTANT RULES:
1. Questions MUST be at the standard expected in the actual ${examName} exam
2. Each question must have EXACTLY 4 options (A, B, C, D)
3. Only ONE option should be correct
4. Questions should test conceptual understanding, not just rote memorization
5. Include numerical problems where relevant
6. Make the incorrect options plausible (common mistakes students make)

CRITICAL - SELF-VERIFICATION STEPS (you MUST follow these):
7. For EVERY question, after writing it, SOLVE it yourself step-by-step to verify the answer is correct
8. For numerical questions, SHOW your calculation to prove the answer
9. Double-check that the correctAnswer index (0-3) actually points to the right option in the options array
10. Make sure no two options are the same
11. Do NOT include any question where you are less than 95% confident about the answer

EXPLANATION STRUCTURE (CRITICAL - This is what students need most):
Your explanation MUST be a JSON object with these fields:
{
  "logic": "2-3 sentence explanation of the CORE CONCEPT. Focus on WHY this answer is right, not just stating it.",
  "formula": "Formula used (ONLY if numerical question, otherwise null)",
  "calculation": "Step-by-step calculation with numbers (ONLY if numerical, otherwise null)",
  "trapAlerts": [
    "Why option A is wrong and why students pick it",
    "Why option B is wrong and why students pick it",
    "Why option C is wrong and why students pick it"
  ],
  "commonMistakes": [
    "Common mistake #1 students make on this concept",
    "Common mistake #2 students make on this concept"
  ]
}

TRAP ALERTS GUIDANCE:
- For each WRONG option, explain: (1) WHY it's incorrect, and (2) what MISTAKE leads students to pick it
- Example: "Students pick this when they forget that velocity is a vector and use speed instead"
- Example: "This is the result if you use the formula for area instead of volume"
- Be specific about the conceptual error, calculation mistake, or misconception

COMMON MISTAKES GUIDANCE:
- List 2-3 typical errors students make when solving this type of problem
- Example: "Forgetting to convert units before calculation"
- Example: "Confusing correlation with causation"
- Example: "Not accounting for significant figures in final answer"

Respond ONLY with a valid JSON array. No markdown, no code blocks, no extra text. The response must start with [ and end with ].

Each object in the array must have these exact fields:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": {
    "logic": "Core concept explanation",
    "formula": "Formula if numerical, else null",
    "calculation": "Step-by-step if numerical, else null",
    "trapAlerts": ["Why option 0 wrong", "Why option 1 wrong", "Why option 2 wrong"],
    "commonMistakes": ["Mistake 1", "Mistake 2"]
  },
  "difficulty": "easy|medium|hard"
}

Where correctAnswer is the 0-based index of the correct option (0 for A, 1 for B, 2 for C, 3 for D).
trapAlerts should explain the 3 WRONG options (skip the correct one).`;

  try {
    // Race all models in parallel with timeout — first valid response wins
    const result = await Promise.race([
      Promise.any(
        FREE_MODELS.map(async (modelId) => {
          const { text } = await generateText({
            model: openrouter(modelId),
            prompt,
            maxOutputTokens: 2048, // Reduced from 4096 for faster generation
            temperature: 0.7, // Slightly higher for faster, more creative responses
          });
          const questions = parseQuizResponse(text);
          return questions;
        })
      ),
      // Add 30-second timeout per attempt
      new Promise<QuizQuestion[]>((_, reject) =>
        setTimeout(() => reject(new Error("Generation timeout")), 30000)
      ),
    ]);
    return result;
  } catch (error) {
    // All models failed or timeout
    console.error("[PrepGenie] Generation failed/timeout:", error);
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
