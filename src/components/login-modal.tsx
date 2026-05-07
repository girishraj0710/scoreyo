"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import { Mail, X } from "lucide-react";

type Step = "method" | "email" | "otp" | "name";

export function LoginModal() {
  const { user, showLoginModal, setShowLoginModal, sendOtp, verifyOtp, completeLogin } = useUser();
  const { t } = useLocale();

  const [step, setStep] = useState<Step>("method");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Reset step when modal is closed/opened
  useEffect(() => {
    if (showLoginModal) {
      setStep("method");
      setEmail("");
      setOtp(["", "", "", "", "", ""]);
      setName("");
      setError("");
    }
  }, [showLoginModal]);

  // Close on escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showLoginModal) {
        setShowLoginModal(false);
      }
    };
    if (showLoginModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showLoginModal, setShowLoginModal]);

  if (!showLoginModal || user) return null;

  // Step 1: Send OTP to email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setIsSubmitting(true);
    try {
      const result = await sendOtp(email.trim());
      if (result.success) {
        setStep("otp");
        setCountdown(60);
        // Focus first OTP input after render
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        setError(result.error || "Failed to send code");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP digit input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5) {
      const fullCode = newOtp.join("");
      if (fullCode.length === 6) {
        handleVerifyOtp(fullCode);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste of full OTP
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 0) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    if (pasted.length === 6) {
      handleVerifyOtp(pasted);
    } else {
      otpRefs.current[pasted.length]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (code?: string) => {
    const fullCode = code || otp.join("");
    if (fullCode.length !== 6) return;
    setError("");
    setIsSubmitting(true);
    try {
      const result = await verifyOtp(email.trim(), fullCode);
      if (result.success) {
        // Try to login — if user exists they'll be logged in, if new we need name
        const loginResult = await completeLogin(email.trim());
        if (loginResult.success) {
          // Existing user, done!
          return;
        }
        if (loginResult.needsName) {
          setStep("name");
          return;
        }
        setError(loginResult.error || "Something went wrong");
      } else {
        setError(result.error || "Invalid code");
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (countdown > 0) return;
    setError("");
    setIsSubmitting(true);
    try {
      const result = await sendOtp(email.trim());
      if (result.success) {
        setCountdown(60);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      } else {
        setError(result.error || "Failed to resend code");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Complete registration with name
  const handleCompleteName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError("");
    setIsSubmitting(true);
    try {
      const result = await completeLogin(email.trim(), name.trim());
      if (!result.success) {
        setError(result.error || "Registration failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      {/* Backdrop - click to close */}
      <div
        className="absolute inset-0"
        onClick={() => setShowLoginModal(false)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
        {/* Close Button */}
        <button
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Method Selection Step */}
        {step === "method" && (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Log in or sign up in seconds
            </h2>
            <p className="text-slate-600 mb-8">
              Use your email or another service to continue with PrepGenie (it's free)!
            </p>

            {/* Login Options */}
            <div className="space-y-3">
              {/* Email Option */}
              <button
                onClick={() => setStep("email")}
                className="w-full flex items-center gap-4 px-6 py-4 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all text-left group"
              >
                <Mail className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
                <span className="font-medium text-slate-800">Continue with email</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                By continuing, you agree to PrepGenie's{" "}
                <a href="/terms" className="text-indigo-600 hover:underline">Terms of Use</a>.
                Read our{" "}
                <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        )}

        {/* Email Input Step */}
        {step === "email" && (
          <div>
            <button
              onClick={() => setStep("method")}
              className="mb-4 text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Continue with email
            </h2>
            <p className="text-slate-600 mb-6">
              We'll send you a verification code
            </p>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-indigo-500 transition-colors"
                  autoFocus
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={!email.trim() || isSubmitting}
                className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Continue"}
              </button>
            </form>
          </div>
        )}

        {/* OTP Verification Step */}
        {step === "otp" && (
          <div>
            <button
              onClick={() => { setStep("email"); setOtp(["", "", "", "", "", ""]); setError(""); }}
              className="mb-4 text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Enter verification code
            </h2>
            <p className="text-slate-600 mb-1">
              We sent a code to
            </p>
            <p className="text-indigo-600 font-medium mb-6">{email}</p>

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-2 mb-4" onPaste={handleOtpPaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-all ${
                    digit
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-800 focus:border-indigo-500"
                  }`}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            {isSubmitting && (
              <p className="text-indigo-600 text-sm text-center mb-4">Verifying...</p>
            )}

            {/* Resend */}
            <div className="text-center mt-6">
              {countdown > 0 ? (
                <p className="text-sm text-slate-500">
                  Resend code in <span className="font-medium text-slate-700">{countdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isSubmitting}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
                >
                  Resend code
                </button>
              )}
            </div>
          </div>
        )}

        {/* Name Input Step */}
        {step === "name" && (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-emerald-600 font-medium">Email verified!</p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              What's your name?
            </h2>
            <p className="text-slate-600 mb-6">
              We'll use this to personalize your experience
            </p>

            <form onSubmit={handleCompleteName} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-indigo-500 transition-colors"
                  autoFocus
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={!name.trim() || isSubmitting}
                className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating account..." : "Start learning"}
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.15s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
