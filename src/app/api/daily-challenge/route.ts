import { NextRequest, NextResponse } from "next/server";
import { getTodayChallenge, getUserChallengeProgress, createDailyChallenge } from "@/lib/db";

// Daily challenge templates (rotates daily)
const CHALLENGE_TEMPLATES = [
  {
    type: "quiz_count",
    title: "Quiz Marathon",
    description: "Complete 5 quizzes today",
    requirement: "Complete quizzes",
    target: 5,
    reward: 15,
  },
  {
    type: "accuracy",
    title: "Accuracy Master",
    description: "Score 80%+ in 3 quizzes",
    requirement: "High accuracy quizzes",
    target: 3,
    reward: 20,
  },
  {
    type: "questions",
    title: "Question Crusher",
    description: "Solve 50 questions today",
    requirement: "Questions solved",
    target: 50,
    reward: 10,
  },
  {
    type: "streak",
    title: "Consistency King",
    description: "Maintain your daily streak",
    requirement: "Practice today",
    target: 1,
    reward: 5,
  },
  {
    type: "speed",
    title: "Speed Demon",
    description: "Complete 2 quizzes in under 3 minutes each",
    requirement: "Fast quizzes",
    target: 2,
    reward: 15,
  },
  {
    type: "dpp",
    title: "Daily Dedication",
    description: "Complete today's DPP with 80%+ score",
    requirement: "DPP completion",
    target: 1,
    reward: 10,
  },
  {
    type: "perfect",
    title: "Flawless Performance",
    description: "Get 100% in any quiz",
    requirement: "Perfect quiz",
    target: 1,
    reward: 25,
    badgeReward: "Flawless Victory",
  },
];

async function ensureTodayChallenge() {
  const today = new Date().toISOString().split("T")[0];

  let challenge = await getTodayChallenge();

  if (!challenge) {
    // Create today's challenge
    const dayIndex = new Date().getDay(); // 0-6 (Sunday-Saturday)
    const template = CHALLENGE_TEMPLATES[dayIndex % CHALLENGE_TEMPLATES.length];

    await createDailyChallenge(
      today,
      template.type,
      template.title,
      template.description,
      template.requirement,
      template.target,
      template.reward,
      template.badgeReward
    );

    challenge = await getTodayChallenge();
  }

  return challenge;
}

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("prepgenie-user-id")?.value || "default-user";

  try {
    const challenge = await ensureTodayChallenge();

    if (!challenge) {
      return NextResponse.json({ challenge: null });
    }

    // Get user's progress on this challenge
    const progress = await getUserChallengeProgress(userId, challenge.id);

    return NextResponse.json({
      challenge: {
        ...challenge,
        progress: progress || { current_value: 0, completed: false },
      },
    });
  } catch (error) {
    console.error("Daily challenge error:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily challenge" },
      { status: 500 }
    );
  }
}
