import { NextResponse } from "next/server";
import { examCategories } from "@/lib/exams";

// GET — returns the full exam catalog (id/name/subjects/topics).
// Used by tooling such as scripts/prewarm-cache.mjs. Read-only.
export async function GET() {
  const exams = examCategories.flatMap((cat) =>
    cat.exams.map((e) => ({
      id: e.id,
      name: e.name,
      subjects: e.subjects.map((s) => ({
        id: s.id,
        name: s.name,
        topics: s.topics,
      })),
    }))
  );
  return NextResponse.json(exams);
}
