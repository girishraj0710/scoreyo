import { NextRequest, NextResponse } from "next/server";
import { getQuestionsByPart, getRandomQuestion } from "@/lib/ielts-speaking-questions";

export async function GET(request: NextRequest) {
  try {
    const part = request.nextUrl.searchParams.get("part");
    const random = request.nextUrl.searchParams.get("random");

    // If random is true, get a random question for the specified part
    if (random === "true" && part) {
      const partNum = parseInt(part) as 1 | 2 | 3;
      if (![1, 2, 3].includes(partNum)) {
        return NextResponse.json({ error: "Invalid part number" }, { status: 400 });
      }
      const question = getRandomQuestion(partNum);
      return NextResponse.json({ question });
    }

    // If part is specified, get all questions for that part
    if (part) {
      const partNum = parseInt(part) as 1 | 2 | 3;
      if (![1, 2, 3].includes(partNum)) {
        return NextResponse.json({ error: "Invalid part number" }, { status: 400 });
      }
      const questions = getQuestionsByPart(partNum);
      return NextResponse.json({ questions });
    }

    // Default: return a random Part 1 question
    const question = getRandomQuestion(1);
    return NextResponse.json({ question });
  } catch (error) {
    console.error("Speaking API error:", error);
    return NextResponse.json({ error: "Failed to fetch speaking questions" }, { status: 500 });
  }
}
