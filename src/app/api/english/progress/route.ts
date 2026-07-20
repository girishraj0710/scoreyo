import { NextRequest, NextResponse } from "next/server";
import { getEnglishProgress, getEnglishTopicProgress } from "@/lib/db";
import { getPathById } from "@/lib/english-content";

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("scoreyo-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pathId = searchParams.get("pathId");
    const topicId = searchParams.get("topicId");

    if (!pathId) {
      return NextResponse.json({ error: "Path ID required" }, { status: 400 });
    }

    // If topicId is provided, return specific topic progress
    if (topicId) {
      const topicProgress = await getEnglishTopicProgress(userId, pathId, topicId);

      if (!topicProgress) {
        return NextResponse.json({
          completed: 0,
          accuracy: 0,
          mastery: 0,
          lastPracticed: null,
        });
      }

      const accuracy = topicProgress.completed_questions > 0
        ? (topicProgress.correct_answers / topicProgress.completed_questions) * 100
        : 0;

      return NextResponse.json({
        completed: topicProgress.completed_questions,
        accuracy,
        mastery: topicProgress.mastery_score,
        lastPracticed: topicProgress.last_practiced,
      });
    }

    // Otherwise, return all topics progress for the path
    const progressRecords = await getEnglishProgress(userId, pathId);
    const path = getPathById(pathId);

    if (!path) {
      return NextResponse.json({ error: "Path not found" }, { status: 404 });
    }

    const progress = path.topics.map(topic => {
      const record = progressRecords.find(p => p.topic_id === topic.id);

      if (!record) {
        return {
          topicId: topic.id,
          completed: 0,
          total: topic.questionCount,
          accuracy: 0,
          mastery: 0,
        };
      }

      const accuracy = record.completed_questions > 0
        ? (record.correct_answers / record.completed_questions) * 100
        : 0;

      return {
        topicId: topic.id,
        completed: record.completed_questions,
        total: topic.questionCount,
        accuracy,
        mastery: record.mastery_score,
      };
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Error fetching English progress:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
