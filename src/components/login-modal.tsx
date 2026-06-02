"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { useLocale } from "@/context/locale-context";
import { Mail, X } from "lucide-react";
import { getAllExams } from "@/lib/exams";

type Step = "method" | "signin-email" | "signin-otp" | "signup-form" | "signup-otp" | "role-selection";

export function LoginModal() {
  const router = useRouter();
  const { user, showLoginModal, setShowLoginModal, sendOtp, verifyOtp, completeLogin } = useUser();
  const { t } = useLocale();

  const [step, setStep] = useState<Step>("method");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Signup fields - collected BEFORE OTP
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [examPreparingFor, setExamPreparingFor] = useState("");

  // Role selection
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

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

  // Reset when modal opens/closes
  useEffect(() => {
    if (showLoginModal) {
      setStep("method");
      setEmail("");
      setOtp(["", "", "", "", "", ""]);
      setName("");
      setAge("");
      setLocation("");
      setPhoneNumber("");
      setExamPreparingFor("");
      setSelectedRole(null);
      setError("");
    }
  }, [showLoginModal]);

  // Close on escape key
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

  // SIGNIN: Send OTP
  const handleSigninSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setIsSubmitting(true);
    try {
      const result = await sendOtp(email.trim(), "login");
      if (result.success) {
        setStep("signin-otp");
        setCountdown(60);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        setError(result.error || "Failed to send code");
        // If user should signup instead, switch to signup flow
        if (result.shouldSignup) {
          setTimeout(() => {
            setStep("signup-form");
            setError("");
          }, 2000);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // SIGNUP: Submit form and send OTP
  const handleSignupSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      setError("Email and Name are required");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const result = await sendOtp(email.trim(), "signup");
      if (result.success) {
        setStep("signup-otp");
        setCountdown(60);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        setError(result.error || "Failed to send code");
        // If user should login instead, switch to login flow
        if (result.shouldLogin) {
          setTimeout(() => {
            setStep("signin-email");
            setError("");
          }, 2000);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP input handling
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
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (code?: string) => {
    const fullCode = code || otp.join("");
    if (fullCode.length !== 6) return;
    setError("");
    setIsSubmitting(true);
    try {
      const result = await verifyOtp(email.trim(), fullCode);
      if (result.success) {
        // For signin, try to login
        if (step === "signin-otp") {
          const loginResult = await completeLogin(email.trim());
          if (loginResult.success) {
            // Redirect based on user role (wait a moment for user context to update)
            setTimeout(() => {
              // The user context will have been updated by completeLogin
              // Just redirect and let the page load, role-based logic will render appropriately
              router.push('/dashboard');
            }, 100);
            return; // Logged in!
          }
          if (loginResult.needsSignup) {
            setError("No account found. Please sign up first.");
            setStep("method");
            return;
          }
          setError(loginResult.error || "Login failed");
        } else {
          // For signup, go to role selection first
          setStep("role-selection");
          setSelectedRole(null);
        }
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
      // Determine action based on current step
      const action = step === "signin-otp" ? "login" : "signup";
      const result = await sendOtp(email.trim(), action);
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

  // Role selection submission
  const handleRoleSelection = async (role: 'student' | 'teacher') => {
    setSelectedRole(role);
    setError("");
    setIsSubmitting(true);
    try {
      const signupResult = await completeLogin(
        email.trim(),
        name.trim(),
        age,
        location.trim(),
        phoneNumber.trim(),
        examPreparingFor,
        role
      );
      if (!signupResult.success) {
        setError(signupResult.error || "Signup failed");
        setIsSubmitting(false);
      } else {
        // Success - user logged in and role set!
        // Redirect based on selected role
        setTimeout(() => {
          const urlToVisit = role === 'teacher' ? '/teacher' : '/dashboard';
          router.push(urlToVisit);
        }, 100);
      }
    } catch (err) {
      setError("Signup failed");
      setIsSubmitting(false);
    }
  };

  // Get list of popular exams for dropdown
  const allExams = getAllExams();
  const popularExams = allExams
    .filter(e => ['jee-main', 'neet-ug', 'upsc-cse', 'gate', 'ssc-cgl', 'ibps-po', 'sbi-po', 'cat'].includes(e.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div
        className="absolute inset-0"
        onClick={() => setShowLoginModal(false)}
      />

      <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Method Selection */}
        {step === "method" && (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Welcome to PrepGenie
            </h2>
            <p className="text-slate-600 mb-8">
              Choose how you'd like to continue
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setStep("signin-email")}
                className="w-full flex items-center gap-4 px-6 py-4 border-2 border-slate-200 bg-slate-50 rounded-xl hover:border-slate-300 hover:bg-[#E8EAFF] transition-all text-left group"
              >
                <Mail className="w-5 h-5 text-[#4255FF] group-hover:text-[#3242CC]" />
                <div>
                  <div className="font-semibold text-slate-900">Sign In</div>
                  <div className="text-sm text-slate-600">Already have an account</div>
                </div>
              </button>

              <button
                onClick={() => setStep("signup-form")}
                className="w-full flex items-center gap-4 px-6 py-4 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all text-left group"
              >
                <Mail className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
                <div>
                  <div className="font-semibold text-slate-900">Sign Up</div>
                  <div className="text-sm text-slate-600">Create a new account</div>
                </div>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                By continuing, you agree to PrepGenie's{" "}
                <a href="/terms" className="text-[#4255FF] hover:underline">Terms of Use</a> and{" "}
                <a href="/privacy" className="text-[#4255FF] hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        )}

        {/* Sign In - Email */}
        {step === "signin-email" && (
          <div>
            <button
              onClick={() => setStep("method")}
              className="mb-4 text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Sign In
            </h2>
            <p className="text-slate-600 mb-6">
              Enter your email to receive a verification code
            </p>

            <form onSubmit={handleSigninSendOtp} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="Enter your email"
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#4255FF] transition-colors"
                autoFocus
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={!email.trim() || isSubmitting}
                className="w-full py-3.5 bg-[#4255FF] text-white font-semibold rounded-xl hover:bg-[#3242CC] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Continue"}
              </button>
            </form>
          </div>
        )}

        {/* Sign Up - Form (BEFORE OTP) */}
        {step === "signup-form" && (
          <div>
            <button
              onClick={() => setStep("method")}
              className="mb-4 text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Create Your Account
            </h2>
            <p className="text-slate-600 mb-6">
              Fill in your details to get started
            </p>

            <form onSubmit={handleSignupSubmitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#4255FF] transition-colors"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#4255FF] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                  min="10"
                  max="100"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#4255FF] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#4255FF] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#4255FF] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Preparing For
                </label>
                <select
                  value={examPreparingFor}
                  onChange={(e) => setExamPreparingFor(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#4255FF] transition-colors"
                >
                  <option value="">Select exam (optional)</option>
                  {popularExams.map(exam => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={!email.trim() || !name.trim() || isSubmitting}
                className="w-full py-3.5 bg-[#4255FF] text-white font-semibold rounded-xl hover:bg-[#3242CC] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Sending verification..." : "Continue to Verification"}
              </button>

              <p className="text-xs text-slate-500 text-center">
                We'll send a verification code to your email
              </p>
            </form>
          </div>
        )}

        {/* OTP Verification (both signin and signup) */}
        {(step === "signin-otp" || step === "signup-otp") && (
          <div>
            <button
              onClick={() => {
                setStep(step === "signin-otp" ? "signin-email" : "signup-form");
                setOtp(["", "", "", "", "", ""]);
                setError("");
              }}
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
            <p className="text-[#4255FF] font-medium mb-6">{email}</p>

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
                      ? "border-[#4255FF] bg-slate-50 text-[#3242CC]"
                      : "border-slate-200 text-slate-800 focus:border-[#4255FF]"
                  }`}
                />
              ))}
            </div>

            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            {isSubmitting && <p className="text-[#4255FF] text-sm text-center mb-4">Verifying...</p>}

            <div className="text-center mt-6">
              {countdown > 0 ? (
                <p className="text-sm text-slate-500">
                  Resend code in <span className="font-medium text-slate-700">{countdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isSubmitting}
                  className="text-sm text-[#4255FF] hover:text-[#3242CC] font-medium disabled:opacity-50"
                >
                  Resend code
                </button>
              )}
            </div>

            {step === "signup-otp" && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span><strong>Signing up as:</strong> {name}</span>
                </p>
                <p className="text-xs text-[#4255FF] mt-1">
                  Verify your email to complete registration
                </p>
              </div>
            )}
          </div>
        )}

        {/* ROLE SELECTION STEP */}
        {step === "role-selection" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Choose Your Role</h2>
              <p className="text-slate-600 text-sm">Are you a student or a teacher/contributor?</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Student Option */}
              <button
                onClick={() => handleRoleSelection('student')}
                disabled={isSubmitting}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-200 ${
                  selectedRole === 'student'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📚</div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-slate-800">I'm a Student</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Take quizzes, practice problems, track progress, and prepare for exams
                    </p>
                  </div>
                  {selectedRole === 'student' && (
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white flex-shrink-0">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>

              {/* Teacher Option */}
              <button
                onClick={() => handleRoleSelection('teacher')}
                disabled={isSubmitting}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-200 ${
                  selectedRole === 'teacher'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">👨‍🏫</div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-slate-800">I'm a Teacher/Contributor</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Create and submit verified questions to help students learn
                    </p>
                    <div className="mt-2 inline-block px-2 py-1 bg-emerald-100 rounded text-xs font-semibold text-emerald-700">
                      Earn Contribution Points
                    </div>
                  </div>
                  {selectedRole === 'teacher' && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <p className="text-xs text-slate-400 text-center">
              You can change your role later in settings
            </p>
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
