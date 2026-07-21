"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Mail, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";

type Step = "form" | "otp" | "success";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  // Handle email signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (!termsAccepted) {
      setError("Please accept the Terms of Service and Privacy Policy");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send OTP
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), action: "signup" }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.shouldLogin) {
          setError("An account with this email already exists. Please log in instead.");
          setTimeout(() => router.push(`/login?email=${encodeURIComponent(email)}`), 2000);
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

  // Verify OTP and complete signup
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

      // Complete signup
      const signupRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          role: "student",
        }),
      });

      const signupData = await signupRes.json();
      if (!signupRes.ok) {
        setError(signupData.error || "Signup failed");
        setIsSubmitting(false);
        return;
      }

      // Success!
      setStep("success");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
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
        body: JSON.stringify({ email: email.trim().toLowerCase(), action: "signup" }),
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
    <AuthLayout mascotSrc="/images/auth-mascot-yeti-wave-v2.png">
      <motion.div
        key="signup"
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-8"
      >
        {/* Tabs (form step) or header (otp/success) */}
        {step === "form" ? (
          <AuthTabs active="signup" />
        ) : (
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {step === "otp" && "Verify your email"}
              {step === "success" && "Welcome! 🎉"}
            </h1>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {step === "otp" && `Enter the code we sent to ${email}`}
              {step === "success" && "Your account is ready"}
            </p>
          </div>
        )}

        {/* Form Content */}
        {step === "form" && (
          <>
            {/* OAuth Buttons */}
            <OAuthButtons mode="signup" />

            {/* Email Form */}
            <form onSubmit={handleEmailSignup} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="font-heading text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="auth-field w-full px-4 py-3.5 bg-[#F6F7FB] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#344974]/10 focus:border-[#344974] transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="font-heading text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="auth-field w-full px-4 py-3.5 bg-[#F6F7FB] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#344974]/10 focus:border-[#344974] transition-all"
                  required
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#344974] border-slate-300 rounded"
                  required
                />
                <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  I accept Scoreyo's{" "}
                  <Link href="/terms" className="text-[#344974] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#344974] hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#344974] text-white text-base font-heading font-bold rounded-2xl hover:bg-[#2A3B5E] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-8">
              Already have an account?{" "}
              <Link href="/login" className="text-[#344974] font-semibold hover:underline">
                Log in
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
                  className="auth-field w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-[#344974] focus:ring-4 focus:ring-[#344974]/10 outline-none transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
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
              className="w-full py-4 bg-[#344974] text-white text-base font-heading font-bold rounded-2xl hover:bg-[#2A3B5E] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Verify & Create Account
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
                  className="text-sm text-[#344974] font-medium hover:underline disabled:opacity-50"
                >
                  Resend code
                </button>
              )}
            </div>

            {/* Back Button */}
            <button
              onClick={() => {
                setStep("form");
                setOtp(["", "", "", "", "", ""]);
                setError("");
              }}
              className="w-full text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Back to signup
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
      </motion.div>
    </AuthLayout>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <AuthLayout mascotSrc="/images/auth-mascot-yeti-wave-v2.png">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#344974]" />
        </div>
      </AuthLayout>
    }>
      <SignupContent />
    </Suspense>
  );
}
