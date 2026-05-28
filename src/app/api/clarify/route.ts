import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { createClient } from "@libsql/client";

// Fast, lightweight models for instant responses
const FAST_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

// Escape SQL LIKE wildcards to prevent LIKE injection
function escapeLikePattern(str: string): string {
  return str.replace(/[%_\\]/g, '\\$&');
}

export async function POST(request: Request) {
  try {
    const userId = (await cookies()).get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionText, userQuestion, correctAnswer, wrongAnswer } = await request.json();

    if (!questionText || !userQuestion) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check for similar clarifications in database (crowd-sourced wisdom)
    const db = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    // Escape wildcards to prevent LIKE injection
    const escapedQuestion = escapeLikePattern(userQuestion);

    const existingResult = await db.execute({
      sql: `SELECT ai_response FROM clarifications
            WHERE question_text = ? AND user_question LIKE ? ESCAPE '\\'
            AND helpful = 1
            LIMIT 1`,
      args: [questionText, `%${escapedQuestion}%`]
    });

    const existingClarification = existingResult.rows[0];

    if (existingClarification) {
      return NextResponse.json({
        response: existingClarification.ai_response,
        source: 'cached'
      });
    }

    // Generate new clarification using fastest model
    const prompt = `You are a patient, expert tutor helping a student who got a question wrong.

QUESTION: ${questionText}

CORRECT ANSWER: ${correctAnswer}
STUDENT'S WRONG ANSWER: ${wrongAnswer}

STUDENT'S CONFUSION:
"${userQuestion}"

Your task:
1. Answer their specific question in 2-3 simple sentences
2. Be conversational and encouraging
3. Focus on WHY, not just restating the answer
4. Use analogies or examples if helpful
5. Keep it concise - this is a quick clarification, not a lecture

Response:`;

    try {
      // Race the fast models
      const result = await Promise.any(
        FAST_MODELS.map(async (modelId) => {
          const { text } = await generateText({
            model: openrouter(modelId),
            prompt,
            maxOutputTokens: 300, // Keep it brief
            temperature: 0.7,
          });
          return text.trim();
        })
      );

      // Store clarification for future reference
      await db.execute({
        sql: `INSERT INTO clarifications (user_id, question_text, user_question, ai_response)
              VALUES (?, ?, ?, ?)`,
        args: [userId, questionText, userQuestion, result]
      });

      return NextResponse.json({
        response: result,
        source: 'ai'
      });

    } catch (modelError) {
      console.error("[Clarify API] All models failed:", modelError);

      // Fallback response
      const fallback = `I understand your confusion! The correct answer is ${correctAnswer}. The key concept here is understanding why that's the right choice. Try reviewing the explanation above again, and focus on the fundamental principle at play.`;

      return NextResponse.json({
        response: fallback,
        source: 'fallback'
      });
    }

  } catch (error) {
    console.error("[Clarify API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Mark clarification as helpful/not helpful
export async function PATCH(request: Request) {
  try {
    const userId = (await cookies()).get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionText, helpful } = await request.json();

    const db = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    await db.execute({
      sql: `UPDATE clarifications
            SET helpful = ?
            WHERE user_id = ? AND question_text = ?
            ORDER BY created_at DESC
            LIMIT 1`,
      args: [helpful ? 1 : 0, userId, questionText]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Clarify API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
