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
