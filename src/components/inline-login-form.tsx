"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";

type Step = "email" | "otp" | "name";

export function InlineLoginForm() {
  const { sendOtp, verifyOtp, completeLogin } = useUser();
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

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

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
        const loginResult = await completeLogin(email.trim());
        if (loginResult.success) {
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
    <div className="bg-white rounded-2xl p-6 shadow-2xl sticky top-8">
      {/* Logo */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
          P
        </div>
        <h3 className="text-lg font-bold text-slate-800">Sign In / Sign Up</h3>
        <p className="text-xs text-slate-500 mt-1">Start your free trial today</p>
      </div>

      {/* Step 1: Email */}
      {step === "email" && (
        <form onSubmit={handleSendOtp}>
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              autoFocus
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-xs mb-3">{error}</p>
          )}
          <button
            type="submit"
            disabled={!email.trim() || isSubmitting}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-50 text-sm"
          >
            {isSubmitting ? "Sending..." : "Send Verification Code"}
          </button>
          <p className="text-xs text-slate-400 text-center mt-3">
            No credit card required • Free forever
          </p>
        </form>
      )}

      {/* Step 2: OTP Verification */}
      {step === "otp" && (
        <div>
          <p className="text-xs text-slate-500 text-center mb-1">
            Code sent to
          </p>
          <p className="text-xs font-semibold text-indigo-600 text-center mb-4">
            {email}
          </p>

          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-1.5 mb-3" onPaste={handleOtpPaste}>
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
                className={`w-10 h-12 text-center text-lg font-bold border-2 rounded-lg focus:outline-none transition-colors ${
                  digit
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-800"
                } focus:border-indigo-500`}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-xs mb-2 text-center">{error}</p>
          )}

          {isSubmitting && (
            <p className="text-indigo-600 text-xs text-center mb-2">Verifying...</p>
          )}

          {/* Resend */}
          <div className="text-center mt-3">
            {countdown > 0 ? (
              <p className="text-xs text-slate-400">
                Resend in <span className="font-medium text-slate-600">{countdown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isSubmitting}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
              >
                Resend Code
              </button>
            )}
          </div>

          <button
            onClick={() => { setStep("email"); setOtp(["", "", "", "", "", ""]); setError(""); }}
            className="w-full mt-2 py-1.5 text-xs text-slate-400 hover:text-slate-600"
          >
            Change email
          </button>
        </div>
      )}

      {/* Step 3: Name */}
      {step === "name" && (
        <form onSubmit={handleCompleteName}>
          <div className="text-center mb-3">
            <div className="w-8 h-8 mx-auto mb-1 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs text-emerald-600 font-medium">Email verified!</p>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t("yourName")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Enter your name"
              className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              autoFocus
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-xs mb-3">{error}</p>
          )}
          <button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-50 text-sm"
          >
            {isSubmitting ? "Creating..." : t("startLearning")}
          </button>
        </form>
      )}
    </div>
  );
}
