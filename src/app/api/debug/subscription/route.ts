import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

/**
 * Debug endpoint to check subscription status
 * GET /api/debug/subscription
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("scoreyo-user-id")?.value;

    if (!userId) {
      return NextResponse.json({
        error: "Not logged in",
        userId: null,
        subscription: null
      });
    }

    // Get user subscription
    const subscription = await queryOne(
      "SELECT * FROM subscriptions WHERE user_id = $1",
      [userId]
    );

    // Get user info
    const user = await queryOne(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );

    return NextResponse.json({
      userId,
      user,
      subscription,
      isPro: subscription && subscription.status === 'active' && subscription.plan !== 'free',
      message: subscription
        ? `Subscription found: ${subscription.plan} (${subscription.status})`
        : "No subscription found - user is on free plan"
    });
  } catch (error: any) {
    console.error("Debug subscription error:", error);
    return NextResponse.json(
      { error: "Failed to check subscription", details: error.message },
      { status: 500 }
    );
  }
}
