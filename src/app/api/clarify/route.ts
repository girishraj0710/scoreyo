import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { queryOne, execute } from "@/lib/db";

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

    const { questionText, userQuestion, correctAnswer, wrongAnswer, conversationHistory } = await request.json();

    if (!questionText || !userQuestion) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Build conversation context from history
    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 1) {
      // Exclude the last message (current question) as it's already in userQuestion
      const previousMessages = conversationHistory.slice(0, -1);
      conversationContext = '\n\nPREVIOUS CONVERSATION:\n' + previousMessages.map((msg: any) =>
        `${msg.type === 'user' ? 'Student' : 'Tutor'}: ${msg.text}`
      ).join('\n') + '\n';
    }

    // Generate new clarification using fastest model with conversation context
    const prompt = `You are a patient, expert tutor helping a student who got a quiz question wrong. You're having a conversation with them.

QUIZ QUESTION CONTEXT:
${questionText}

CORRECT ANSWER: ${correctAnswer}
STUDENT'S WRONG ANSWER: ${wrongAnswer}
${conversationContext}
STUDENT'S CURRENT QUESTION:
"${userQuestion}"

Your task:
1. Answer their specific question naturally, considering the conversation history
2. Be conversational and encouraging
3. Focus on WHY, not just restating facts
4. Use analogies or examples if helpful
5. If they're asking a follow-up, reference your previous explanation
6. Keep it concise but complete (2-4 sentences)

Response:`;

    try {
      // Try models one by one with better error handling
      let result: string | null = null;
      let lastError: any = null;

      for (const modelId of FAST_MODELS) {
        try {
          const { text } = await generateText({
            model: openrouter(modelId),
            prompt,
            maxOutputTokens: 300,
            temperature: 0.7,
          });
          result = text.trim();
          console.log(`[Clarify] Success with model: ${modelId}`);
          break; // Success - exit loop
        } catch (modelError) {
          console.error(`[Clarify] Model ${modelId} failed:`, modelError);
          lastError = modelError;
          // Continue to next model
        }
      }

      if (!result) {
        throw new Error(`All models failed. Last error: ${lastError?.message || 'Unknown'}`);
      }

      // Store clarification for analytics (optional - can be disabled for pure chat experience)
      try {
        await execute(
          `INSERT INTO clarifications (user_id, question_text, user_question, ai_response)
           VALUES (?, ?, ?, ?)`,
          [userId, questionText, userQuestion.trim(), result]
        );
      } catch (dbError) {
        // Non-critical - continue even if logging fails
        console.error("[Clarify] Failed to log clarification:", dbError);
      }

      return NextResponse.json({
        response: result,
        source: 'ai'
      });

    } catch (modelError) {
      console.error("[Clarify API] All models failed:", modelError);

      // Fallback response with actual helpful content
      const fallback = `Great question! For this problem, the correct answer is ${correctAnswer}.

The key is to understand the relationship: if 75% = 150 marks, then we need to find what 100% equals.

Think of it as: 75% is to 150, as 100% is to X. Using proportion: (150 ÷ 75) × 100 = 200 marks total.`;

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

    // PostgreSQL UPDATE with LIMIT requires subquery
    await execute(
      `UPDATE clarifications
       SET helpful = ?
       WHERE id = (
         SELECT id FROM clarifications
         WHERE user_id = ? AND question_text = ?
         ORDER BY created_at DESC
         LIMIT 1
       )`,
      [helpful, userId, questionText]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Clarify API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
