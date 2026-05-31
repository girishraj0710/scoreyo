/**
 * SECURE PAYMENT ROUTE
 *
 * Security improvements:
 * ✅ Request validation with Zod
 * ✅ Transaction safety for payment verification
 * ✅ Server-side plan verification (no client trust)
 * ✅ Amount verification (prevent manipulation)
 * ✅ Signature verification (authentic Razorpay payment)
 */

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { getPool } from "@/lib/db";
import { withTransaction } from "@/lib/db/transaction";
import { withAuth, withAuthAndValidation } from "@/lib/middleware/validation";
import { paymentCreateSchema, paymentVerifySchema } from "@/lib/validation/schemas";
import { logger } from "@/lib/logger";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PLANS = {
  monthly: { amount: 7900, label: "Pro Monthly", duration: 30 },
  quarterly: { amount: 14900, label: "Pro Quarterly", duration: 90 },
} as const;

type PlanType = keyof typeof PLANS;

/**
 * POST /api/payment - Create Razorpay order
 *
 * Creates a payment order for subscription purchase
 */
export const POST = withAuthAndValidation(
  paymentCreateSchema,
  async (request, validatedData, userId) => {
    const { plan, couponCode } = validatedData;

    try {
      // Validate plan
      if (!(plan in PLANS)) {
        return NextResponse.json(
          { error: "Invalid plan selected" },
          { status: 400 }
        );
      }

      const planDetails = PLANS[plan as PlanType];
      let amount = planDetails.amount;

      // Apply coupon if provided (future feature)
      if (couponCode) {
        logger.info('Coupon code provided', { couponCode, userId });
        // TODO: Implement coupon validation and discount
      }

      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: `pg_${userId.slice(0, 8)}_${Date.now()}`,
        notes: {
          userId,
          plan,
          couponCode: couponCode || null,
        },
      });

      logger.info('Payment order created', {
        orderId: order.id,
        plan,
        amount,
        userId
      });

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        plan,
        planLabel: planDetails.label,
      });

    } catch (error) {
      logger.error('Payment order creation failed', { userId, plan }, error as Error);
      return NextResponse.json(
        {
          error: "Failed to create payment order",
          message: "Please try again later"
        },
        { status: 500 }
      );
    }
  }
);

/**
 * PUT /api/payment - Verify payment and activate subscription
 *
 * Security-critical: Uses transaction to ensure atomicity
 * - Verifies payment signature
 * - Validates payment amount
 * - Creates/updates subscription
 * - Records payment history
 */
export const PUT = withAuthAndValidation(
  paymentVerifySchema,
  async (request, validatedData, userId) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = validatedData;

    try {
      // ── STEP 1: Verify Signature ────────────────────────────
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        logger.warn('Payment signature verification failed', {
          userId,
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id
        });

        return NextResponse.json(
          { error: "Payment verification failed" },
          { status: 400 }
        );
      }

      // ── STEP 2: Fetch Order from Razorpay ────────────────────
      // SECURITY: Never trust client data - fetch from Razorpay server
      const order = await razorpay.orders.fetch(razorpay_order_id);
      const plan = order.notes?.plan as string;

      if (!plan || !(plan in PLANS)) {
        logger.error('Invalid plan in order notes', {
          orderId: razorpay_order_id,
          plan,
          order
        });

        return NextResponse.json(
          { error: "Invalid subscription plan" },
          { status: 400 }
        );
      }

      // ── STEP 3: Verify Amount ─────────────────────────────────
      // SECURITY: Prevent amount manipulation
      const planDetails = PLANS[plan as PlanType];
      if (order.amount !== planDetails.amount) {
        logger.error('Payment amount mismatch', {
          expected: planDetails.amount,
          actual: order.amount,
          plan,
          orderId: razorpay_order_id
        });

        return NextResponse.json(
          { error: "Payment amount verification failed" },
          { status: 400 }
        );
      }

      // ── STEP 4: Save to Database (Transaction) ─────────────────
      const pool = getPool();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + planDetails.duration * 24 * 60 * 60 * 1000);

      await withTransaction(pool, async (tx) => {
        // 4a. Check if user already has active subscription
        const existing = await tx.queryOne(
          `SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active'`,
          [userId]
        );

        if (existing) {
          // Extend existing subscription
          await tx.execute(
            `UPDATE subscriptions
             SET expires_at = $1, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $2 AND status = 'active'`,
            [expiresAt, userId]
          );

          logger.info('Subscription extended', {
            userId,
            plan,
            expiresAt
          });
        } else {
          // Create new subscription
          await tx.execute(
            `INSERT INTO subscriptions (user_id, plan, status, started_at, expires_at)
             VALUES ($1, $2, 'active', CURRENT_TIMESTAMP, $3)
             ON CONFLICT (user_id)
             DO UPDATE SET
               plan = EXCLUDED.plan,
               status = 'active',
               started_at = CURRENT_TIMESTAMP,
               expires_at = EXCLUDED.expires_at,
               updated_at = CURRENT_TIMESTAMP`,
            [userId, plan, expiresAt]
          );

          logger.info('Subscription created', {
            userId,
            plan,
            expiresAt
          });
        }

        // 4b. Record payment in history
        await tx.execute(
          `INSERT INTO payment_history (
            user_id, razorpay_order_id, razorpay_payment_id,
            amount, currency, plan, status, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, 'success', CURRENT_TIMESTAMP)`,
          [
            userId,
            razorpay_order_id,
            razorpay_payment_id,
            order.amount,
            order.currency,
            plan
          ]
        );
      });

      logger.info('Payment verified and subscription activated', {
        userId,
        plan,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        expiresAt
      });

      return NextResponse.json({
        success: true,
        message: "Subscription activated successfully",
        plan,
        expiresAt: expiresAt.toISOString(),
      });

    } catch (error) {
      logger.error('Payment verification failed', {
        userId,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      }, error as Error);

      return NextResponse.json(
        {
          error: "Payment verification failed",
          message: "Please contact support if amount was deducted"
        },
        { status: 500 }
      );
    }
  }
);
