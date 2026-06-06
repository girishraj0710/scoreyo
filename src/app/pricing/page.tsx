"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import { getHeadersWithCsrf } from "@/lib/csrf-client";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";

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
  const { user, isLoading: userLoading } = useUser();
  const { t } = useLocale();
  const router = useRouter();
  const [subData, setSubData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "monthly" | "quarterly">("quarterly");

  // Redirect contributors to contributor portal
  useEffect(() => {
    if (!userLoading && user && ['contributor', 'admin'].includes(user.role || '')) {
      router.push('/contributor');
    }
  }, [user, userLoading, router]);

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
      <AccessibilityWrapper>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 rounded w-48 mx-auto mb-4" style={{ background: "var(--hover-bg)" }}></div>
          <div className="h-4 rounded w-64 mx-auto" style={{ background: "var(--hover-bg)" }}></div>
        </div>
      </div>
      </AccessibilityWrapper>
    );
  }

  // Success modal
  if (showSuccess) {
    return (
      <AccessibilityWrapper>
        <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="max-w-md mx-auto rounded-2xl p-8 shadow-lg border border-emerald-200 text-center" style={{ background: "var(--card-bg)" }}>
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>{t("paymentSuccess")}</h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>{t("proWelcome")}</p>
          <div className="flex gap-3 justify-center">
            <a
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-[#4255FF] to-purple-600 text-white font-semibold rounded-xl shadow-lg"
            >
              {t("startQuiz")}
            </a>
            <a
              href="/dashboard"
              className="px-6 py-3 font-medium rounded-xl"
              style={{ background: "var(--hover-bg)", color: "var(--foreground-secondary)" }}
            >
              {t("dashboard")}
            </a>
          </div>
        </div>
      </div>
      </AccessibilityWrapper>
    );
  }

  const isPro = subData?.isPro;

  return (
    <AccessibilityWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-[#4255FF] to-purple-600 bg-clip-text text-transparent">
            {t("pricingTitle")}
          </span>
        </h1>
        <p className="max-w-lg mx-auto" style={{ color: "var(--muted)" }}>
          {t("pricingSubtitle")}
        </p>
      </div>

      {/* Current Plan Status */}
      {isPro && subData?.subscription && (
        <div className="max-w-md mx-auto mb-8 rounded-2xl p-5 border border-[#90CAF9]" style={{ background: "var(--primary-bg)" }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-gradient-to-r from-[#4255FF] to-purple-600 text-white text-xs font-bold rounded-full">
              PRO
            </span>
            <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {subData.subscription.plan === "monthly" ? t("proMonthly") : t("proQuarterly")}
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {t("expiresOn")}: {new Date(subData.subscription.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      )}

      {/* Pricing Cards — 3 columns */}
      <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div
          onClick={() => !isPro && setSelectedPlan("free")}
          onMouseEnter={(e) => {
            if (!isPro && selectedPlan !== "free") {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
              e.currentTarget.style.borderColor = "#4255FF";
            }
          }}
          onMouseLeave={(e) => {
            if (!isPro && selectedPlan !== "free") {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "initial";
              e.currentTarget.style.borderColor = "var(--card-border)";
            }
          }}
          className={`rounded-2xl p-6 border-2 transition-all cursor-pointer ${
            isPro
              ? "opacity-60 cursor-default"
              : selectedPlan === "free"
                ? "border-indigo-400 shadow-lg shadow-indigo-100"
                : "hover:shadow-md transition-shadow"
          }`}
          style={{
            background: "var(--card-bg)",
            borderColor: isPro ? "var(--card-border)" : selectedPlan === "free" ? "#818cf8" : "var(--card-border)"
          }}
        >
          <div className="mb-5">
            <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{t("freePlan")}</h3>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{t("freePlanDesc")}</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>{t("freePrice")}</span>
            <span style={{ color: "var(--muted)" }} className="ml-1">{t("forever")}</span>
          </div>
          <ul className="space-y-3 mb-6">
            {[
              t("free3Quizzes"),
              t("freeAllExams"),
              t("freeBasicStats"),
              t("freeReview"),
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm" style={{ color: "var(--foreground-secondary)" }}>
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
              <li key={idx} className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                <svg className="w-4 h-4 shrink-0" style={{ color: "var(--muted)" }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          {!isPro ? (
            <div className="py-3 text-center text-sm font-medium rounded-xl" style={{ background: "var(--hover-bg)", color: "var(--muted)" }}>
              {t("currentPlan")}
            </div>
          ) : (
            <div className="py-3 text-center text-sm font-medium rounded-xl" style={{ background: "var(--hover-bg)", color: "var(--muted)" }}>
              Free
            </div>
          )}
        </div>

        {/* Pro Monthly */}
        <div
          onClick={() => !isPro && setSelectedPlan("monthly")}
          onMouseEnter={(e) => {
            if (!isPro && selectedPlan !== "monthly") {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
              e.currentTarget.style.borderColor = "#4255FF";
            }
          }}
          onMouseLeave={(e) => {
            if (!isPro && selectedPlan !== "monthly") {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "initial";
              e.currentTarget.style.borderColor = "var(--card-border)";
            }
          }}
          className={`rounded-2xl p-6 border-2 transition-all cursor-pointer relative ${
            isPro && subData?.subscription?.plan === "monthly"
              ? "shadow-xl shadow-indigo-200 cursor-default"
              : !isPro && selectedPlan === "monthly"
                ? "shadow-xl shadow-indigo-200"
                : "hover:shadow-md transition-shadow"
          }`}
          style={{
            background: (isPro && subData?.subscription?.plan === "monthly") || (!isPro && selectedPlan === "monthly") ? "linear-gradient(to bottom, var(--primary-bg), rgba(168, 85, 247, 0.1))" : "var(--card-bg)",
            borderColor: (isPro && subData?.subscription?.plan === "monthly") || (!isPro && selectedPlan === "monthly") ? "#818cf8" : "var(--card-border)"
          }}
        >
          {/* Show badge when selected */}
          {!isPro && selectedPlan === "monthly" && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-[#4255FF] text-white text-xs font-bold rounded-full shadow-md whitespace-nowrap">
                SELECTED
              </span>
            </div>
          )}
          {isPro && subData?.subscription?.plan === "monthly" && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-gradient-to-r from-[#4255FF] to-purple-600 text-white text-xs font-bold rounded-full shadow-md whitespace-nowrap">
                ACTIVE
              </span>
            </div>
          )}

          <div className={`mb-5 ${((!isPro && selectedPlan === "monthly") || (isPro && subData?.subscription?.plan === "monthly")) ? "mt-2" : ""}`}>
            <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{t("proMonthly")}</h3>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{t("proPlanDesc")}</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>₹79</span>
            <span style={{ color: "var(--muted)" }} className="ml-1">/{t("monthly").toLowerCase()}</span>
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
              <li key={idx} className="flex items-center gap-2 text-sm" style={{ color: "var(--foreground-secondary)" }}>
                <svg className="w-4 h-4 text-[#4255FF] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          {isPro && subData?.subscription?.plan === "monthly" ? (
            <div className="py-3 text-center text-sm font-semibold rounded-xl border" style={{ color: "var(--primary)", borderColor: "var(--primary-light)", background: "var(--card-bg)" }}>
              {t("activePlan")}
            </div>
          ) : isPro ? (
            <button
              onClick={(e) => { e.stopPropagation(); handleUpgrade("monthly"); }}
              disabled={isProcessing}
              className="w-full py-3 font-medium rounded-xl text-sm border-2 transition-all disabled:opacity-50"
              style={{ background: "var(--card-bg)", color: "var(--muted)", borderColor: "var(--card-border)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover-bg)"; e.currentTarget.style.borderColor = "var(--card-border)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--card-bg)"; e.currentTarget.style.borderColor = "var(--card-border)"; }}
            >
              {isProcessing && processingPlan === "monthly" ? t("processing") : t("switchPlan")}
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); handleUpgrade("monthly"); }}
              disabled={isProcessing}
              className={`w-full py-3 font-semibold rounded-xl disabled:opacity-50 text-sm transition-all ${
                selectedPlan === "monthly"
                  ? "bg-gradient-to-r from-[#4255FF] to-purple-600 text-white shadow-lg hover:shadow-xl"
                  : "border-2"
              }`}
              style={selectedPlan !== "monthly" ? { background: "var(--card-bg)", color: "var(--primary)", borderColor: "var(--primary-light)" } : undefined}
              onMouseEnter={(e) => {
                if (selectedPlan !== "monthly") {
                  e.currentTarget.style.background = "var(--hover-bg)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPlan !== "monthly") {
                  e.currentTarget.style.background = "var(--card-bg)";
                }
              }}
            >
              {isProcessing && processingPlan === "monthly" ? t("processing") : t("upgradeToPro")}
            </button>
          )}
        </div>

        {/* Pro Quarterly — DEFAULT HIGHLIGHTED */}
        <div
          onClick={() => !isPro && setSelectedPlan("quarterly")}
          onMouseEnter={(e) => {
            if (!isPro && selectedPlan !== "quarterly") {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
              e.currentTarget.style.borderColor = "#4255FF";
            }
          }}
          onMouseLeave={(e) => {
            if (!isPro && selectedPlan !== "quarterly") {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "initial";
              e.currentTarget.style.borderColor = "var(--card-border)";
            }
          }}
          className={`rounded-2xl p-6 border-2 transition-all cursor-pointer relative ${
            isPro && subData?.subscription?.plan === "quarterly"
              ? "shadow-xl shadow-indigo-200 cursor-default"
              : !isPro && selectedPlan === "quarterly"
                ? "shadow-xl shadow-indigo-200"
                : "hover:shadow-md transition-shadow"
          }`}
          style={{
            background: (isPro && subData?.subscription?.plan === "quarterly") || (!isPro && selectedPlan === "quarterly") ? "linear-gradient(to bottom, var(--primary-bg), rgba(168, 85, 247, 0.1))" : "var(--card-bg)",
            borderColor: (isPro && subData?.subscription?.plan === "quarterly") || (!isPro && selectedPlan === "quarterly") ? "#818cf8" : "var(--card-border)"
          }}
        >
          {/* Most Popular / Selected badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className={`px-4 py-1 text-white text-xs font-bold rounded-full shadow-md whitespace-nowrap ${
              selectedPlan === "quarterly" || (isPro && subData?.subscription?.plan === "quarterly")
                ? "bg-gradient-to-r from-[#4255FF] to-purple-600"
                : "bg-slate-400"
            }`}>
              {isPro && subData?.subscription?.plan === "quarterly" ? "ACTIVE" : t("mostPopular")}
            </span>
          </div>

          <div className="mb-5 mt-2">
            <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{t("proQuarterly")}</h3>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{t("proPlanDesc")}</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>₹149</span>
            <span style={{ color: "var(--muted)" }} className="ml-1">/3 {t("monthly").toLowerCase()}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-emerald-600">₹50/{t("monthly").toLowerCase()}</span>
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
              <li key={idx} className="flex items-center gap-2 text-sm" style={{ color: "var(--foreground-secondary)" }}>
                <svg className="w-4 h-4 text-[#4255FF] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          {isPro && subData?.subscription?.plan === "quarterly" ? (
            <div className="py-3 text-center text-sm font-semibold rounded-xl border" style={{ color: "var(--primary)", borderColor: "var(--primary-light)", background: "var(--card-bg)" }}>
              {t("activePlan")}
            </div>
          ) : isPro ? (
            <button
              onClick={(e) => { e.stopPropagation(); handleUpgrade("quarterly"); }}
              disabled={isProcessing}
              className="w-full py-3 font-medium rounded-xl text-sm border-2 transition-all disabled:opacity-50"
              style={{ background: "var(--card-bg)", color: "var(--muted)", borderColor: "var(--card-border)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover-bg)"; e.currentTarget.style.borderColor = "var(--card-border)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--card-bg)"; e.currentTarget.style.borderColor = "var(--card-border)"; }}
            >
              {isProcessing && processingPlan === "quarterly" ? t("processing") : t("switchPlan")}
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); handleUpgrade("quarterly"); }}
              disabled={isProcessing}
              className={`w-full py-3 font-semibold rounded-xl disabled:opacity-50 text-sm transition-all ${
                selectedPlan === "quarterly"
                  ? "bg-gradient-to-r from-[#4255FF] to-purple-600 text-white shadow-lg hover:shadow-xl"
                  : "border-2"
              }`}
              style={selectedPlan !== "quarterly" ? { background: "var(--card-bg)", color: "var(--primary)", borderColor: "var(--primary-light)" } : undefined}
              onMouseEnter={(e) => {
                if (selectedPlan !== "quarterly") {
                  e.currentTarget.style.background = "var(--hover-bg)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPlan !== "quarterly") {
                  e.currentTarget.style.background = "var(--card-bg)";
                }
              }}
            >
              {isProcessing && processingPlan === "quarterly" ? t("processing") : t("upgradeToPro")}
            </button>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-center mb-6" style={{ color: "var(--foreground)" }}>{t("faqTitle")}</h2>
        <div className="space-y-4">
          {[
            { q: t("faqQ1"), a: t("faqA1") },
            { q: t("faqQ2"), a: t("faqA2") },
            { q: t("faqQ3"), a: t("faqA3") },
          ].map((faq, idx) => (
            <div key={idx} className="rounded-xl p-4 border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--foreground)" }}>{faq.q}</h3>
              <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      {subData?.paymentHistory && subData.paymentHistory.length > 0 && (
        <div className="max-w-2xl mx-auto mt-12">
          <h2 className="text-lg font-bold mb-4" style={{ color: "var(--foreground)" }}>{t("paymentHistoryTitle")}</h2>
          <div className="rounded-xl border overflow-hidden" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            {subData.paymentHistory.map((payment: any, idx: number) => (
              <div key={idx} className={`px-4 py-3 flex items-center justify-between ${idx > 0 ? "border-t" : ""}`} style={{ borderTopColor: "var(--card-border)" }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {payment.plan === "monthly" ? t("proMonthly") : t("proQuarterly")}
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    {new Date(payment.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>₹{(payment.amount / 100).toFixed(0)}</div>
                  <div className="text-xs text-emerald-600">{payment.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </AccessibilityWrapper>
  );
}
