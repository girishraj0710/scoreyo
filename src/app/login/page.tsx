"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";

type Step = "email" | "otp" | "success";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(searchParams?.get("email") || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send OTP
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), action: "login" }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.shouldSignup) {
          setError("No account found with this email. Please sign up first.");
          setTimeout(() => router.push(`/signup?email=${encodeURIComponent(email)}`), 2000);
          return;
        }
        setError(data.error || "Failed to send OTP");
        return;
      }

      // Move to OTP step
      setStep("otp");
      setCountdown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    otpRefs.current[lastIndex]?.focus();
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP and complete login
  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Verify OTP
      const verifyRes = await fetch("/api/auth/otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: otpCode }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        setError(verifyData.error || "Invalid code");
        setIsSubmitting(false);
        return;
      }

      // Complete login
      const loginRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        if (loginData.needsSignup) {
          setError("No account found. Please sign up first.");
          setTimeout(() => router.push(`/signup?email=${encodeURIComponent(email)}`), 2000);
          return;
        }
        setError(loginData.error || "Login failed");
        setIsSubmitting(false);
        return;
      }

      // Success!
      setStep("success");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (err) {
      setError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), action: "login" }),
      });

      if (res.ok) {
        setCountdown(60);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
            {step === "email" && "Welcome back"}
            {step === "otp" && "Verify your email"}
            {step === "success" && "Welcome back! 🎉"}
          </h1>
          <p className="text-base text-gray-600 dark:text-slate-400 leading-relaxed font-normal">
            {step === "email" && "Log in to continue"}
            {step === "otp" && `We sent a code to ${email}`}
            {step === "success" && "Logging you in..."}
          </p>
        </div>

        {/* Form Content */}
        {step === "email" && (
          <>
            {/* OAuth Buttons */}
            <OAuthButtons mode="login" />

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 text-[15px]"
                  required
                  autoFocus
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#3b82f6] text-white font-semibold rounded-lg hover:bg-[#2563eb] hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[15px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#3b82f6] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </>
        )}

        {/* OTP Verification */}
        {step === "otp" && (
          <div className="space-y-6">
            {/* OTP Input */}
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-[#3b82f6] focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={isSubmitting || otp.join("").length !== 6}
              className="w-full py-3.5 bg-[#3b82f6] text-white font-semibold rounded-lg hover:bg-[#2563eb] hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[15px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Verify & Log In
                </>
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Resend code in {countdown}s
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="text-sm text-[#3b82f6] font-medium hover:underline disabled:opacity-50"
                >
                  Resend code
                </button>
              )}
            </div>

            {/* Back Button */}
            <button
              onClick={() => {
                setStep("email");
                setOtp(["", "", "", "", "", ""]);
                setError("");
              }}
              className="w-full text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Back to login
            </button>
          </div>
        )}

        {/* Success State */}
        {step === "success" && (
          <div className="text-center space-y-4 py-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-gray-600 dark:text-slate-400">
              Redirecting to dashboard...
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#3b82f6]" />
        </div>
      </AuthLayout>
    }>
      <LoginContent />
    </Suspense>
  );
}
