"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import { Mail } from "lucide-react";

type Step = "method" | "email" | "otp" | "name";

export function InlineLoginForm() {
  const { sendOtp, verifyOtp, completeLogin } = useUser();
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
        if (loginResult.needsSignup) {
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
    <div className="rounded-2xl p-6 shadow-2xl sticky top-8" style={{ background: "var(--card-bg)" }}>
      {/* Method Selection Step */}
      {step === "method" && (
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Log in or sign up in seconds
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--foreground-secondary)" }}>
            Use your email or another service to continue (it's free)!
          </p>

          {/* Login Options */}
          <div className="space-y-3 mb-6">
            {/* Email Option */}
            <button
              onClick={() => setStep("email")}
              className="w-full flex items-center gap-3 px-4 py-3 border-2 rounded-xl hover:opacity-80 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
              aria-label="Continue with email"
            >
              <Mail className="w-5 h-5" style={{ color: "var(--foreground-secondary)" }} />
              <span className="font-medium text-sm">Continue with email</span>
            </button>
          </div>

          <div className="pt-4" style={{ borderTop: "1px solid var(--card-border)" }}>
            <p className="text-xs text-center" style={{ color: "var(--muted)" }}>
              By continuing, you agree to Krakkify's{" "}
              <a href="/terms" className="text-[#E76F51] hover:underline">Terms</a> & {" "}
              <a href="/privacy" className="text-[#E76F51] hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      )}

      {/* Email Input Step */}
      {step === "email" && (
        <div>
          <button
            onClick={() => setStep("method")}
            className="mb-3 text-xs hover:opacity-70 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ color: "var(--muted)" }}
            aria-label="Back to login method selection"
          >
            ← Back
          </button>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Continue with email
          </h3>
          <p className="text-xs mb-4" style={{ color: "var(--foreground-secondary)" }}>
            We'll send you a verification code
          </p>

          <form onSubmit={handleSendOtp}>
            <div className="mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="Enter your email"
                className="w-full px-3 py-2.5 border-2 rounded-lg text-sm focus:outline-none focus:border-[#E76F51]"
                style={{
                  borderColor: "var(--card-border)",
                  background: "var(--card-bg)",
                  color: "var(--foreground)"
                }}
                autoFocus
                required
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs mb-3" id="email-error" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={!email.trim() || isSubmitting}
              className="w-full py-2.5 bg-[#E76F51] text-white font-semibold rounded-lg hover:bg-[#D65A3D] transition-colors disabled:opacity-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F51]/30"
              aria-label="Continue with email"
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
            className="mb-3 text-xs hover:opacity-70 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ color: "var(--muted)" }}
            aria-label="Back to email input"
          >
            ← Back
          </button>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Enter verification code
          </h3>
          <p className="text-xs mb-1" style={{ color: "var(--foreground-secondary)" }}>
            We sent a code to
          </p>
          <p className="text-sm text-[#E76F51] font-medium mb-4">{email}</p>

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
                className="w-10 h-12 text-center text-lg font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                style={{
                  borderColor: digit ? "#E76F51" : "var(--card-border)",
                  background: digit ? "var(--primary-bg)" : "var(--card-bg)",
                  color: digit ? "#D65A3D" : "var(--foreground)"
                }}
                aria-label={`OTP digit ${idx + 1}`}
                aria-invalid={!!error}
                aria-describedby={error ? "otp-error" : undefined}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-xs mb-3 text-center" id="otp-error" role="alert">
              {error}
            </p>
          )}

          {isSubmitting && (
            <p className="text-[#E76F51] text-xs text-center mb-3">Verifying...</p>
          )}

          {/* Resend */}
          <div className="text-center mt-4">
            {countdown > 0 ? (
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Resend code in <span className="font-medium" style={{ color: "var(--foreground)" }}>{countdown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isSubmitting}
                className="text-xs text-[#E76F51] hover:text-[#D65A3D] font-medium disabled:opacity-50"
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
          <div className="text-center mb-4">
            <div className="w-12 h-12 mx-auto mb-2 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" style={{ color: "var(--muted)" }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Email verified!</p>
          </div>

          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            What's your name?
          </h3>
          <p className="text-xs mb-4" style={{ color: "var(--foreground-secondary)" }}>
            We'll use this to personalize your experience
          </p>

          <form onSubmit={handleCompleteName}>
            <div className="mb-3">
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="Enter your name"
                className="w-full px-3 py-2.5 border-2 rounded-lg text-sm focus:outline-none focus:border-[#E76F51]"
                style={{
                  borderColor: "var(--card-border)",
                  background: "var(--card-bg)",
                  color: "var(--foreground)"
                }}
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
              className="w-full py-2.5 bg-[#E76F51] text-white font-semibold rounded-lg hover:bg-[#D65A3D] transition-colors disabled:opacity-50 text-sm"
            >
              {isSubmitting ? "Creating account..." : "Start learning"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
