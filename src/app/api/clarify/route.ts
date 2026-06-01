import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { execute } from "@/lib/db";

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
      const previousMessages = conversationHistory.slice(0, -1);
      conversationContext = '\n\nPREVIOUS CONVERSATION:\n' + previousMessages.map((msg: any) =>
        `${msg.type === 'user' ? 'Student' : 'Tutor'}: ${msg.text}`
      ).join('\n') + '\n';
    }

    // Create a focused, clear prompt
    const prompt = `You are a helpful tutor assisting a student with a quiz question.

QUIZ QUESTION:
${questionText}

CORRECT ANSWER: ${correctAnswer}
STUDENT'S ANSWER: ${wrongAnswer}
${conversationContext}
STUDENT ASKS: "${userQuestion}"

Provide a clear, concise answer (2-4 sentences). Be encouraging and explain the concept simply.

Your response:`;

    console.log('[Clarify] Sending request to AI...');
    console.log('[Clarify] Question:', userQuestion);

    try {
      // Use the most reliable model directly
      const { text } = await generateText({
        model: openrouter("google/gemini-2.0-flash-exp:free"),
        prompt,
        maxOutputTokens: 400,
        temperature: 0.7,
      });

      const result = text.trim();
      console.log('[Clarify] AI response received:', result.substring(0, 100) + '...');

      // Store for analytics (non-blocking)
      execute(
        `INSERT INTO clarifications (user_id, question_text, user_question, ai_response)
         VALUES (?, ?, ?, ?)`,
        [userId, questionText, userQuestion.trim(), result]
      ).catch(err => console.error('[Clarify] DB error:', err));

      return NextResponse.json({
        response: result,
        source: 'ai'
      });

    } catch (aiError: any) {
      console.error("[Clarify] AI Error:", aiError?.message || aiError);

      // Intelligent fallback based on the actual question
      const fallback = generateIntelligentFallback(questionText, userQuestion, correctAnswer, wrongAnswer);

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

function generateIntelligentFallback(
  questionText: string,
  userQuestion: string,
  correctAnswer: string,
  wrongAnswer: string
): string {
  // Try to extract key information from the question
  const lowerQuestion = questionText.toLowerCase();
  const lowerUserQ = userQuestion.toLowerCase();

  // Check if user is asking for explanation of the logic
  if (lowerUserQ.includes('explain') || lowerUserQ.includes('why') || lowerUserQ.includes('how')) {
    return `The correct answer is ${correctAnswer}. I understand you want to understand the reasoning. The key is to break down the problem step by step. Look at the given information carefully and identify the relationship between the values. Would you like me to walk through the calculation?`;
  }

  // Check if user wants an example
  if (lowerUserQ.includes('example')) {
    return `Sure! Let me give you an example similar to this problem. The correct answer is ${correctAnswer}. Think about situations in real life where you encounter similar problems - this can help make the concept clearer. What specific aspect would you like me to demonstrate?`;
  }

  // Check if user wants more detail
  if (lowerUserQ.includes('more') || lowerUserQ.includes('detail')) {
    return `The correct answer is ${correctAnswer}. To understand this better, focus on the fundamental principle involved. You selected ${wrongAnswer}, which is a common mistake. The difference lies in how you approach the problem. Would you like me to explain a specific step?`;
  }

  // Generic but helpful fallback
  return `Good question! The correct answer is ${correctAnswer}. The key concept here involves understanding the relationship between the given values. Try breaking the problem into smaller steps: identify what you know, what you need to find, and the formula or method to connect them. Feel free to ask about any specific part that's unclear!`;
}

// Mark clarification as helpful/not helpful
export async function PATCH(request: Request) {
  try {
    const userId = (await cookies()).get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionText, helpful } = await request.json();

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
