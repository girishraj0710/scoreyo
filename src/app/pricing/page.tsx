"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import { getHeadersWithCsrf } from "@/lib/csrf-client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface SubscriptionData {
  isPro: boolean;
  plan: string;
  subscription: any;
  todayQuizCount: number;
  quizLimit: number | null;
  quizzesRemaining: number | null;
  paymentHistory: any[];
}

export default function PricingPage() {
  const { user } = useUser();
  const { t } = useLocale();
  const [subData, setSubData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "monthly" | "quarterly">("quarterly");

  useEffect(() => {
    fetchSubscription();
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function fetchSubscription() {
    try {
      const res = await fetch("/api/subscription");
      if (res.ok) {
        const data = await res.json();
        setSubData(data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpgrade(plan: "monthly" | "quarterly") {
    if (!user) return;
    setIsProcessing(true);
    setProcessingPlan(plan);

    try {
      // 1. Create order
      const orderRes = await fetch("/api/payment", {
        method: "POST",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({ plan }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert(orderData.error || "Failed to create order");
        return;
      }

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PrepGenie",
        description: orderData.planLabel,
        order_id: orderData.orderId,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#6366f1",
        },
        handler: async function (response: any) {
          // 3. Verify payment
          try {
            const verifyRes = await fetch("/api/payment", {
              method: "PUT",
              headers: getHeadersWithCsrf(),
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setShowSuccess(true);
              fetchSubscription();
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch {
            alert("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-64 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Success modal
  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg border border-emerald-200 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{t("paymentSuccess")}</h2>
          <p className="text-slate-500 mb-6">{t("proWelcome")}</p>
          <div className="flex gap-3 justify-center">
            <a
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-[#00A1E0] to-purple-600 text-white font-semibold rounded-xl shadow-lg"
            >
              {t("startQuiz")}
            </a>
            <a
              href="/dashboard"
              className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200"
            >
              {t("dashboard")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isPro = subData?.isPro;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-[#00A1E0] to-purple-600 bg-clip-text text-transparent">
            {t("pricingTitle")}
          </span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          {t("pricingSubtitle")}
        </p>
      </div>

      {/* Current Plan Status */}
      {isPro && subData?.subscription && (
        <div className="max-w-md mx-auto mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-[#80CFED]">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-gradient-to-r from-[#00A1E0] to-purple-600 text-white text-xs font-bold rounded-full">
              PRO
            </span>
            <span className="text-sm font-semibold text-slate-800">
              {subData.subscription.plan === "monthly" ? t("proMonthly") : t("proQuarterly")}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {t("expiresOn")}: {new Date(subData.subscription.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      )}

      {/* Pricing Cards — 3 columns */}
      <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div
          onClick={() => !isPro && setSelectedPlan("free")}
          className={`bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer ${
            isPro
              ? "border-slate-100 opacity-60 cursor-default"
              : selectedPlan === "free"
                ? "border-indigo-400 shadow-lg shadow-indigo-100"
                : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-800">{t("freePlan")}</h3>
            <p className="text-sm text-slate-400 mt-1">{t("freePlanDesc")}</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-800">{t("freePrice")}</span>
            <span className="text-slate-400 ml-1">{t("forever")}</span>
          </div>
          <ul className="space-y-3 mb-6">
            {[
              t("free3Quizzes"),
              t("freeAllExams"),
              t("freeBasicStats"),
              t("freeReview"),
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
            {[
              t("freeNoMock"),
              t("freeNoReports"),
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                <svg className="w-4 h-4 text-slate-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          {!isPro ? (
            <div className="py-3 text-center text-sm font-medium text-slate-400 bg-slate-50 rounded-xl">
              {t("currentPlan")}
            </div>
          ) : (
            <div className="py-3 text-center text-sm font-medium text-slate-300 bg-slate-50 rounded-xl">
              Free
            </div>
          )}
        </div>

        {/* Pro Monthly */}
        <div
          onClick={() => !isPro && setSelectedPlan("monthly")}
          className={`rounded-2xl p-6 border-2 transition-all cursor-pointer relative ${
            isPro && subData?.subscription?.plan === "monthly"
              ? "bg-gradient-to-b from-indigo-50 to-purple-50 border-indigo-400 shadow-xl shadow-indigo-200 cursor-default"
              : !isPro && selectedPlan === "monthly"
                ? "bg-gradient-to-b from-indigo-50 to-purple-50 border-indigo-400 shadow-xl shadow-indigo-200"
                : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          {/* Show badge when selected */}
          {!isPro && selectedPlan === "monthly" && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-[#00A1E0] text-white text-xs font-bold rounded-full shadow-md whitespace-nowrap">
                SELECTED
              </span>
            </div>
          )}
          {isPro && subData?.subscription?.plan === "monthly" && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-gradient-to-r from-[#00A1E0] to-purple-600 text-white text-xs font-bold rounded-full shadow-md whitespace-nowrap">
                ACTIVE
              </span>
            </div>
          )}

          <div className={`mb-5 ${((!isPro && selectedPlan === "monthly") || (isPro && subData?.subscription?.plan === "monthly")) ? "mt-2" : ""}`}>
            <h3 className="text-lg font-bold text-slate-800">{t("proMonthly")}</h3>
            <p className="text-sm text-slate-400 mt-1">{t("proPlanDesc")}</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-800">₹79</span>
            <span className="text-slate-400 ml-1">/{t("monthly").toLowerCase()}</span>
          </div>
          <ul className="space-y-3 mb-6">
            {[
              t("proUnlimited"),
              t("proAllExams"),
              t("proDetailedReports"),
              t("proReview"),
              t("proMockTests"),
              t("proPriority"),
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 text-[#00A1E0] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          {isPro && subData?.subscription?.plan === "monthly" ? (
            <div className="py-3 text-center text-sm font-semibold text-[#00A1E0] bg-white rounded-xl border border-[#80CFED]">
              {t("activePlan")}
            </div>
          ) : isPro ? (
            <button
              onClick={(e) => { e.stopPropagation(); handleUpgrade("monthly"); }}
              disabled={isProcessing}
              className="w-full py-3 font-medium rounded-xl text-sm bg-white text-slate-500 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 transition-all disabled:opacity-50"
            >
              {isProcessing && processingPlan === "monthly" ? t("processing") : t("switchPlan")}
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); handleUpgrade("monthly"); }}
              disabled={isProcessing}
              className={`w-full py-3 font-semibold rounded-xl disabled:opacity-50 text-sm transition-all ${
                selectedPlan === "monthly"
                  ? "bg-gradient-to-r from-[#00A1E0] to-purple-600 text-white shadow-lg hover:shadow-xl"
                  : "bg-white text-[#00A1E0] border-2 border-[#80CFED] hover:bg-[#E6F4F9] hover:border-indigo-400"
              }`}
            >
              {isProcessing && processingPlan === "monthly" ? t("processing") : t("upgradeToPro")}
            </button>
          )}
        </div>

        {/* Pro Quarterly — DEFAULT HIGHLIGHTED */}
        <div
          onClick={() => !isPro && setSelectedPlan("quarterly")}
          className={`rounded-2xl p-6 border-2 transition-all cursor-pointer relative ${
            isPro && subData?.subscription?.plan === "quarterly"
              ? "bg-gradient-to-b from-indigo-50 to-purple-50 border-indigo-400 shadow-xl shadow-indigo-200 cursor-default"
              : !isPro && selectedPlan === "quarterly"
                ? "bg-gradient-to-b from-indigo-50 to-purple-50 border-indigo-400 shadow-xl shadow-indigo-200"
                : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          {/* Most Popular / Selected badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className={`px-4 py-1 text-white text-xs font-bold rounded-full shadow-md whitespace-nowrap ${
              selectedPlan === "quarterly" || (isPro && subData?.subscription?.plan === "quarterly")
                ? "bg-gradient-to-r from-[#00A1E0] to-purple-600"
                : "bg-slate-400"
            }`}>
              {isPro && subData?.subscription?.plan === "quarterly" ? "ACTIVE" : t("mostPopular")}
            </span>
          </div>

          <div className="mb-5 mt-2">
            <h3 className="text-lg font-bold text-slate-800">{t("proQuarterly")}</h3>
            <p className="text-sm text-slate-400 mt-1">{t("proPlanDesc")}</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-800">₹149</span>
            <span className="text-slate-400 ml-1">/3 {t("monthly").toLowerCase()}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-emerald-600 font-semibold">₹50/{t("monthly").toLowerCase()}</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                {t("save37")}
              </span>
            </div>
          </div>
          <ul className="space-y-3 mb-6">
            {[
              t("proUnlimited"),
              t("proAllExams"),
              t("proDetailedReports"),
              t("proReview"),
              t("proMockTests"),
              t("proPriority"),
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                <svg className="w-4 h-4 text-[#00A1E0] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          {isPro && subData?.subscription?.plan === "quarterly" ? (
            <div className="py-3 text-center text-sm font-semibold text-[#00A1E0] bg-white rounded-xl border border-[#80CFED]">
              {t("activePlan")}
            </div>
          ) : isPro ? (
            <button
              onClick={(e) => { e.stopPropagation(); handleUpgrade("quarterly"); }}
              disabled={isProcessing}
              className="w-full py-3 font-medium rounded-xl text-sm bg-white text-slate-500 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 transition-all disabled:opacity-50"
            >
              {isProcessing && processingPlan === "quarterly" ? t("processing") : t("switchPlan")}
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); handleUpgrade("quarterly"); }}
              disabled={isProcessing}
              className={`w-full py-3 font-semibold rounded-xl disabled:opacity-50 text-sm transition-all ${
                selectedPlan === "quarterly"
                  ? "bg-gradient-to-r from-[#00A1E0] to-purple-600 text-white shadow-lg hover:shadow-xl"
                  : "bg-white text-[#00A1E0] border-2 border-[#80CFED] hover:bg-[#E6F4F9] hover:border-indigo-400"
              }`}
            >
              {isProcessing && processingPlan === "quarterly" ? t("processing") : t("upgradeToPro")}
            </button>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-slate-800 text-center mb-6">{t("faqTitle")}</h2>
        <div className="space-y-4">
          {[
            { q: t("faqQ1"), a: t("faqA1") },
            { q: t("faqQ2"), a: t("faqA2") },
            { q: t("faqQ3"), a: t("faqA3") },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200">
              <h3 className="font-semibold text-slate-800 text-sm mb-1">{faq.q}</h3>
              <p className="text-sm text-slate-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      {subData?.paymentHistory && subData.paymentHistory.length > 0 && (
        <div className="max-w-2xl mx-auto mt-12">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{t("paymentHistoryTitle")}</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {subData.paymentHistory.map((payment: any, idx: number) => (
              <div key={idx} className={`px-4 py-3 flex items-center justify-between ${idx > 0 ? "border-t border-slate-100" : ""}`}>
                <div>
                  <div className="text-sm font-medium text-slate-800">
                    {payment.plan === "monthly" ? t("proMonthly") : t("proQuarterly")}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(payment.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-800">₹{(payment.amount / 100).toFixed(0)}</div>
                  <div className="text-xs text-emerald-600">{payment.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
