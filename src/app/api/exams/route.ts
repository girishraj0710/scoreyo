import { NextResponse } from "next/server";
import { examCategories, getExamCount, getTopicCount } from "@/lib/exams";

export async function GET() {
  return NextResponse.json({
    categories: examCategories,
    totalExams: getExamCount(),
    totalTopics: getTopicCount(),
  });
}
