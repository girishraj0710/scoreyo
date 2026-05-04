"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";

type Step = "email" | "otp" | "name";

export function LoginModal() {
  const { user, showLoginModal, sendOtp, verifyOtp, completeLogin } = useUser();
  const { t } = useLocale();

  const [step, setStep] = useState<Step>("email");
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            P
          </div>
          <h2 className="text-xl font-bold text-slate-800">{t("welcomeTo")}</h2>
        </div>

        {/* Step 1: Email */}
        {step === "email" && (
          <form onSubmit={handleSendOtp}>
            <p className="text-sm text-slate-500 text-center mb-5">
              Enter your email to sign in or create an account
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                autoFocus
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs mb-3 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={!email.trim() || isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-50 text-sm"
            >
              {isSubmitting ? "Sending code..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <div>
            <p className="text-sm text-slate-500 text-center mb-1">
              We sent a 6-digit code to
            </p>
            <p className="text-sm font-semibold text-indigo-600 text-center mb-5">
              {email}
            </p>

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
                  className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-colors ${
                    digit
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-800"
                  } focus:border-indigo-500`}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-xs mb-3 text-center">{error}</p>
            )}

            {isSubmitting && (
              <p className="text-indigo-600 text-sm text-center mb-3">Verifying...</p>
            )}

            {/* Resend */}
            <div className="text-center mt-4">
              {countdown > 0 ? (
                <p className="text-xs text-slate-400">
                  Resend code in <span className="font-medium text-slate-600">{countdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isSubmitting}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
                >
                  Resend Code
                </button>
              )}
            </div>

            {/* Change email */}
            <button
              onClick={() => { setStep("email"); setOtp(["", "", "", "", "", ""]); setError(""); }}
              className="w-full mt-3 py-2 text-xs text-slate-400 hover:text-slate-600"
            >
              Change email address
            </button>
          </div>
        )}

        {/* Step 3: Name (new user) */}
        {step === "name" && (
          <form onSubmit={handleCompleteName}>
            <div className="text-center mb-4">
              <div className="w-10 h-10 mx-auto mb-2 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-emerald-600 font-medium">Email verified!</p>
            </div>
            <p className="text-sm text-slate-500 text-center mb-5">
              One last step — tell us your name
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t("yourName")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                autoFocus
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs mb-3 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-50 text-sm"
            >
              {isSubmitting ? "Creating account..." : t("startLearning")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
