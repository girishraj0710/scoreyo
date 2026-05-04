import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { createSubscription, getUserSubscription } from "@/lib/db";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PLANS = {
  monthly: { amount: 7900, label: "Pro Monthly", duration: "monthly" },
  quarterly: { amount: 14900, label: "Pro Quarterly", duration: "quarterly" },
};

// POST - Create Razorpay order
export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body;

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planDetails = PLANS[plan as keyof typeof PLANS];

    const order = await razorpay.orders.create({
      amount: planDetails.amount,
      currency: "INR",
      receipt: `pg_${userId.slice(0, 8)}_${Date.now()}`,
      notes: {
        userId,
        plan,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
      planLabel: planDetails.label,
    });
  } catch (error) {
    console.error("Payment order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// PUT - Verify payment and activate subscription
export async function PUT(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = body;

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Get plan amount
    const planDetails = PLANS[plan as keyof typeof PLANS];
    if (!planDetails) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Activate subscription
    createSubscription(userId, plan, planDetails.amount, razorpay_payment_id, razorpay_order_id);

    const subscription = getUserSubscription(userId);

    return NextResponse.json({
      success: true,
      subscription,
      message: "Welcome to PrepGenie Pro!",
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
