import { NextRequest, NextResponse } from "next/server";
import { getUserSubscription, isProUser, getTodayQuizCount, getPaymentHistory } from "@/lib/db";

const FREE_QUIZ_LIMIT = 3;

// GET - Get user's subscription status
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const isPro = isProUser(userId);
    const subscription = getUserSubscription(userId);
    const todayQuizCount = getTodayQuizCount(userId);
    const paymentHistory = getPaymentHistory(userId);

    return NextResponse.json({
      isPro,
      plan: isPro ? subscription?.plan : "free",
      subscription: isPro ? subscription : null,
      todayQuizCount,
      quizLimit: isPro ? null : FREE_QUIZ_LIMIT,
      quizzesRemaining: isPro ? null : Math.max(0, FREE_QUIZ_LIMIT - todayQuizCount),
      paymentHistory,
    });
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json({ error: "Failed to check subscription" }, { status: 500 });
  }
}
