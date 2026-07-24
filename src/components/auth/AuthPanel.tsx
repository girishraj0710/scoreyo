"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Loader2 } from "lucide-react";

type Step = "form" | "otp" | "success";

interface AuthPanelProps {
  mode: "signup" | "login";
  /**
   * Initial email (deep-link from ?email=). Used only in uncontrolled mode.
   */
  initialEmail?: string;
  /**
   * Controlled email. When BOTH `email` and `onEmailChange` are provided, the
   * email field is controlled by the parent — this lets the AuthOverlay keep a
   * single shared email across the signup/login panels (which stay mounted
   * side-by-side for a jank-free slide) so the value carries across a switch.
   */
  email?: string;
  onEmailChange?: (email: string) => void;
  /**
   * When provided, the tabs and the "already have an account / don't have an
   * account" links switch mode IN-PLACE (used by AuthOverlay) instead of
   * navigating to /signup or /login. Also used for auto-redirect edge cases
   * (e.g. login finds no account). Receives the email typed so far.
   */
  onSwitchMode?: (mode: "signup" | "login", email?: string) => void;
  /**
   * Whether this panel is the one currently on screen. In the AuthOverlay both
   * panels are mounted side-by-side; only the active one may autofocus its
   * input, otherwise the browser scrolls the hidden panel into view. Defaults
   * to true for the standalone /signup and /login pages.
   */
  active?: boolean;
  /**
   * Post-auth destination (internal path). After a successful login/signup the
   * user lands here instead of the home page. Already sanitized by the caller.
   */
  redirectTo?: string;
}

export function AuthPanel({
  mode,
  initialEmail = "",
  email: controlledEmail,
  onEmailChange,
  onSwitchMode,
  active = true,
  redirectTo = "/",
}: AuthPanelProps) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const isEmailControlled = controlledEmail !== undefined && onEmailChange !== undefined;

  const [step, setStep] = useState<Step>("form");
  const [internalEmail, setInternalEmail] = useState(initialEmail);
  const email = isEmailControlled ? controlledEmail : internalEmail;
  const setEmail = (value: string) => {
    if (isEmailControlled) onEmailChange(value);
    else setInternalEmail(value);
  };
  const [name, setName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
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

  // Switch to the other mode, preserving the typed email. Prefer the in-place
  // callback (overlay); fall back to route navigation (standalone pages).
  const goToMode = (target: "signup" | "login") => {
    if (onSwitchMode) {
      onSwitchMode(target, email);
    } else {
      const params = new URLSearchParams();
      if (email) params.set("email", email);
      if (redirectTo && redirectTo !== "/") params.set("redirect", redirectTo);
      const q = params.toString();
      router.push(`/${target}${q ? `?${q}` : ""}`);
    }
  };

  // Send OTP (form submit)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignup && !name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (isSignup && !termsAccepted) {
      setError("Please accept Scoreyo's Terms of Service and Privacy Policy to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          action: isSignup ? "signup" : "login",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Signup: email already exists → nudge to login. Login: no account → signup.
        if (isSignup && data.shouldLogin) {
          setError("An account with this email already exists. Please log in instead.");
          setTimeout(() => goToMode("login"), 2000);
          return;
        }
        if (!isSignup && data.shouldSignup) {
          setError("No account found with this email. Please sign up first.");
          setTimeout(() => goToMode("signup"), 2000);
          return;
        }
        setError(data.error || "Failed to send OTP");
        return;
      }

      setStep("otp");
      setCountdown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
    setOtp(newOtp);
    const lastIndex = Math.min(pastedData.length, 5);
    otpRefs.current[lastIndex]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP → complete auth
  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
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

      // Complete auth. Signup sends name + role; login sends email only.
      const authRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSignup
            ? { email: email.trim().toLowerCase(), name: name.trim(), role: "student" }
            : { email: email.trim().toLowerCase() }
        ),
      });

      const authData = await authRes.json();
      if (!authRes.ok) {
        if (!isSignup && authData.needsSignup) {
          setError("No account found. Please sign up first.");
          setTimeout(() => goToMode("signup"), 2000);
          return;
        }
        setError(authData.error || (isSignup ? "Signup failed" : "Login failed"));
        setIsSubmitting(false);
        return;
      }

      // Success! Hard-navigate so UserProvider remounts and reads the freshly
      // set auth cookie. A soft router.push leaves stale user=null in context.
      setStep("success");
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1500);
    } catch {
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
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          action: isSignup ? "signup" : "login",
        }),
      });
      if (res.ok) {
        setCountdown(60);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to resend OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Full-panel success spinner while the hard redirect fires.
  if (step === "success") {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-[#344974]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tabs (form step) or verify header (otp step) */}
      {step === "form" && <AuthTabs active={mode} onSelect={onSwitchMode ? goToMode : undefined} />}
      {step === "otp" && (
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Verify your email
          </h1>
          <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
            {`Enter the code we sent to ${email}`}
          </p>
        </div>
      )}

      {/* FORM STEP */}
      {step === "form" && (
        <>
          <OAuthButtons mode={mode} redirectTo={redirectTo} />

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Name (signup only) */}
            {isSignup && (
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
            )}

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
                autoFocus={active && !isSignup}
              />
            </div>

            {/* Terms checkbox (signup only) */}
            {isSignup && (
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#344974] border-slate-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  I accept Scoreyo's{" "}
                  <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#344974] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#344974] hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Implied-consent notice (login only) */}
            {!isSignup && (
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-center pt-2">
                By clicking Log in, you accept Scoreyo's{" "}
                <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#344974] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#344974] hover:underline">
                  Privacy Policy
                </Link>
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 bg-[#344974] text-white text-base font-heading font-bold rounded-2xl hover:bg-[#2A3B5E] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl ${isSignup ? "mt-8" : "mt-4"} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isSignup ? "Creating account..." : "Sending code..."}
                </>
              ) : isSignup ? (
                "Continue"
              ) : (
                "Log in"
              )}
            </button>
          </form>

          {/* Cross-link */}
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-8">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => goToMode(isSignup ? "login" : "signup")}
              className="text-[#344974] font-semibold hover:underline"
            >
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </p>
        </>
      )}

      {/* OTP STEP */}
      {step === "otp" && (
        <div className="space-y-6">
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

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

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
            ) : isSignup ? (
              "Create account"
            ) : (
              "Log in"
            )}
          </button>

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

          <button
            onClick={() => {
              setStep("form");
              setOtp(["", "", "", "", "", ""]);
              setError("");
            }}
            className="w-full text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {isSignup ? "← Back to signup" : "← Back to login"}
          </button>
        </div>
      )}
    </div>
  );
}
