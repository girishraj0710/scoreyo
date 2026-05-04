import { NextRequest, NextResponse } from "next/server";
import { saveReport } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { examId, subjectId, topic, questionText, issue } = body;

    if (!questionText || !issue) {
      return NextResponse.json(
        { error: "Question text and issue are required" },
        { status: 400 }
      );
    }

    const userId = request.cookies.get("prepgenie-user-id")?.value || "default-user";
    saveReport(
      userId,
      examId || "",
      subjectId || "",
      topic || "",
      questionText,
      issue
    );

    return NextResponse.json({ success: true, message: "Report submitted. Thank you!" });
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    );
  }
}
