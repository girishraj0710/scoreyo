import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { createSubscription, getUserSubscription } from "@/lib/db";
import { handleApiError, logError, logInfo } from "@/lib/error-handler";
import { POST as securePOST, PUT as securePUT } from "./route-secure";

// Lazily instantiate so importing this module never throws when the keys are
// absent (e.g. during `next build` page-data collection). Razorpay's
// constructor throws when key_id/key_secret are missing.
let razorpayClient: Razorpay | null = null;
function getRazorpay(): Razorpay {
  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return razorpayClient;
}

const PLANS = {
  monthly: { amount: 7900, label: "Pro Monthly", duration: "monthly" },
  quarterly: { amount: 14900, label: "Pro Quarterly", duration: "quarterly" },
};

// POST - Create Razorpay order
export async function POST(request: NextRequest) {
  // Feature flag: Use secure route if enabled
  if (process.env.ENABLE_SECURE_ROUTES === 'true') {
    return securePOST(request);
  }

  try {
    const userId = request.cookies.get("scoreyo-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body;

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planDetails = PLANS[plan as keyof typeof PLANS];

    const order = await getRazorpay().orders.create({
      amount: planDetails.amount,
      currency: "INR",
      receipt: `pg_${userId.slice(0, 8)}_${Date.now()}`,
      notes: {
        userId,
        plan,
      },
    });

    logInfo("Payment Order Created", { orderId: order.id, plan, userId });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
      planLabel: planDetails.label,
    });
  } catch (error) {
    return handleApiError(error, "Payment Order Creation");
  }
}

// PUT - Verify payment and activate subscription
export async function PUT(request: NextRequest) {
  // Feature flag: Use secure route if enabled
  if (process.env.ENABLE_SECURE_ROUTES === 'true') {
    return securePUT(request);
  }

  try {
    const userId = request.cookies.get("scoreyo-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    // ❌ Do NOT trust client-supplied plan parameter anymore

    // Step 1: Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Step 2: Fetch order from Razorpay server-side to get TRUE plan
    const order = await getRazorpay().orders.fetch(razorpay_order_id);

    // Step 3: Get plan from immutable order notes (not client request)
    const plan = order.notes?.plan as string;

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      console.error("Invalid plan in order notes:", order);
      return NextResponse.json(
        { error: "Invalid subscription plan in order" },
        { status: 400 }
      );
    }

    // Step 4: Verify amount matches plan (prevent payment amount manipulation)
    const planDetails = PLANS[plan as keyof typeof PLANS];
    if (order.amount !== planDetails.amount) {
      logError("Payment Amount Mismatch", {
        expected: planDetails.amount,
        actual: order.amount,
        plan,
        orderId: razorpay_order_id,
      });
      return NextResponse.json(
        { error: "Payment amount mismatch" },
        { status: 400 }
      );
    }

    // Step 5: Activate subscription with SERVER-SIDE verified plan
    await createSubscription(userId, plan, planDetails.amount, razorpay_payment_id, razorpay_order_id);

    const subscription = await getUserSubscription(userId);

    logInfo("Payment Verified Successfully", {
      userId,
      plan,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    return NextResponse.json({
      success: true,
      subscription,
      plan,
      message: "Welcome to Scoreyo Pro!",
    });
  } catch (error) {
    return handleApiError(error, "Payment Verification");
  }
}
