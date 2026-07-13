"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { useLocale, type Locale } from "@/context/locale-context";
import { getAllExams } from "@/lib/exams";
import {
  User, Mail, Phone, MapPin, GraduationCap, Globe, Target,
  Moon, Sun, Bell, Shield, CreditCard, Trash2, LogOut,
  ChevronRight, Check, Save, Calendar, BookOpen, Plus, Lock, RefreshCcw
} from "lucide-react";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { AccessibilityWrapper } from "@/components/accessibility-wrapper";

const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
];

interface Subscription {
  isPro: boolean;
  plan: string;
  subscription: {
    plan: string;
    started_at: string;
    expires_at: string;
    status: string;
  } | null;
  todayQuizCount: number;
  quizLimit: number | null;
  quizzesRemaining: number | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading: userLoading, updateProfile, logout } = useUser();
  const { locale, setLocale } = useLocale();

  // No redirect - allow all authenticated users to access settings
  // Contributors and admins can also manage their profile settings

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [examPreparingFor, setExamPreparingFor] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Study preferences
  const [dailyGoal, setDailyGoal] = useState(50);
  const [difficulty, setDifficulty] = useState("mixed");

  // Appearance
  const [darkMode, setDarkMode] = useState(false);

  // Subscription
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Exam Management
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedExamToAdd, setSelectedExamToAdd] = useState<string | null>(null);
  const [isProcessingExam, setIsProcessingExam] = useState(false);
  const [addExamError, setAddExamError] = useState<string | null>(null);

  // Modal
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'alert' | 'success' | 'error' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "confirm",
    onConfirm: () => {},
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone_number || "");
      setAge(user.age?.toString() || "");
      setLocation(user.location || "");
      setExamPreparingFor(user.exam_preparing_for || "");
    }
  }, [user]);

  // Load preferences from localStorage
  useEffect(() => {
    const savedGoal = localStorage.getItem("krakkify-daily-goal");
    if (savedGoal) setDailyGoal(parseInt(savedGoal));

    const savedDifficulty = localStorage.getItem("krakkify-difficulty");
    if (savedDifficulty) setDifficulty(savedDifficulty);

    const savedDarkMode = localStorage.getItem("krakkify-theme");
    if (savedDarkMode === "dark") {
      setDarkMode(true);
    }
  }, []);

  // Fetch subscription info
  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch("/api/subscription");
        if (res.ok) {
          const data = await res.json();
          setSubscription(data);
        }
      } catch {
        // ignore
      }
    }
    fetchSubscription();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateProfile(name, email, age, location, phone, examPreparingFor);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setModal({
        isOpen: true,
        title: "Error",
        message: "Failed to save profile. Please try again.",
        type: "error",
        onConfirm: () => setModal(prev => ({ ...prev, isOpen: false })),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDailyGoalChange = (goal: number) => {
    setDailyGoal(goal);
    localStorage.setItem("krakkify-daily-goal", goal.toString());
  };

  const handleDifficultyChange = (diff: string) => {
    setDifficulty(diff);
    localStorage.setItem("krakkify-difficulty", diff);
  };

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    const theme = newMode ? "dark" : "light";
    localStorage.setItem("krakkify-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  const handleLanguageChange = (lang: string) => {
    setLocale(lang as Locale);
  };

  const handleLogout = () => {
    setModal({
      isOpen: true,
      title: "Logout",
      message: "Are you sure you want to logout?",
      type: "confirm",
      onConfirm: async () => {
        setModal(prev => ({ ...prev, isOpen: false }));
        await logout();
        window.location.href = "/";
      },
    });
  };

  const handleDeleteAccount = () => {
    setModal({
      isOpen: true,
      title: "Delete Account",
      message: "This action cannot be undone. All your data including quiz history, achievements, and subscription will be permanently deleted.\n\nAre you sure?",
      type: "error",
      onConfirm: () => {
        setModal(prev => ({ ...prev, isOpen: false }));
        // TODO: Implement account deletion API
        setModal({
          isOpen: true,
          title: "Contact Support",
          message: "To delete your account, please email us at support@krakkify.in with your registered email address.",
          type: "info",
          onConfirm: () => setModal(prev => ({ ...prev, isOpen: false })),
        });
      },
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Exam Management Handlers
  const handleAddExamClick = () => {
    if (!subscription?.isPro) {
      // Free user - show upgrade modal
      setModal({
        isOpen: true,
        title: "Upgrade to Pro",
        message: "You need a Pro subscription to enroll in multiple exams. Upgrade now to access unlimited exams!",
        type: "info",
        onConfirm: () => {
          setModal(prev => ({ ...prev, isOpen: false }));
          router.push("/pricing");
        },
      });
    } else {
      // Pro user - show exam selection modal
      setShowAddExamModal(true);
      setAddExamError(null);
    }
  };

  const handleExamSelection = (examId: string) => {
    setSelectedExamToAdd(examId);
    setShowAddExamModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedExamToAdd) return;

    setIsProcessingExam(true);
    setAddExamError(null);

    try {
      const res = await fetch("/api/exam/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: selectedExamToAdd }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to add exam");

      // Success - reload page to update enrolled exams
      setShowPaymentModal(false);
      setModal({
        isOpen: true,
        title: "Exam Added Successfully!",
        message: `You're now enrolled in ${getAllExams().find(e => e.id === selectedExamToAdd)?.name}. The page will reload to apply changes.`,
        type: "success",
        onConfirm: () => {
          setModal(prev => ({ ...prev, isOpen: false }));
          window.location.reload();
        },
      });
    } catch (error) {
      const err = error as Error;
      setAddExamError(err.message);
      setModal({
        isOpen: true,
        title: "Error",
        message: err.message || "Failed to add exam. Please try again.",
        type: "error",
        onConfirm: () => setModal(prev => ({ ...prev, isOpen: false })),
      });
    } finally {
      setIsProcessingExam(false);
    }
  };

  const handleSwitchExam = async (examId: string) => {
    if (user?.current_exam === examId) return;

    setIsProcessingExam(true);

    try {
      const res = await fetch("/api/exam/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to switch exam");

      // Success - reload page to apply changes
      setModal({
        isOpen: true,
        title: "Exam Switched!",
        message: `You're now viewing ${getAllExams().find(e => e.id === examId)?.name}. The page will reload to apply changes.`,
        type: "success",
        onConfirm: () => {
          setModal(prev => ({ ...prev, isOpen: false }));
          window.location.reload();
        },
      });
    } catch (error) {
      const err = error as Error;
      setModal({
        isOpen: true,
        title: "Error",
        message: err.message || "Failed to switch exam. Please try again.",
        type: "error",
        onConfirm: () => setModal(prev => ({ ...prev, isOpen: false })),
      });
    } finally {
      setIsProcessingExam(false);
    }
  };

  if (!user) {
    return (
      <AccessibilityWrapper>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="rounded-2xl p-12 shadow-lg border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          <User className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--muted)" }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Please Login
          </h2>
          <p style={{ color: "var(--muted)" }}>
            You need to be logged in to access settings.
          </p>
        </div>
      </div>
      </AccessibilityWrapper>
    );
  }

  return (
    <AccessibilityWrapper>
      <div className="min-h-screen py-8 px-4 sm:px-6" style={{ background: "var(--primary-bg)" }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Settings</h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Manage your profile, preferences, and account settings
        </p>

      {/* ─── PROFILE SECTION ─── */}
      <section className="rounded-2xl p-6 shadow-sm border mb-6" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
          <User className="w-5 h-5 text-indigo-500" />
          Profile
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground-secondary)" }}>
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition cursor-text"
                style={{ borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground)" }}
                placeholder="Enter your full name"
                aria-label="Full name"
                onMouseEnter={(e) => {
                  if (!e.currentTarget.matches(":focus")) {
                    e.currentTarget.style.borderColor = "#a5b4fc";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.matches(":focus")) {
                    e.currentTarget.style.borderColor = "var(--card-border)";
                  }
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground-secondary)" }}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
              <input
                type="email"
                value={email}
                disabled
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg cursor-not-allowed"
                style={{ borderColor: "var(--card-border)", background: "var(--hover-bg)", color: "var(--muted)" }}
                placeholder="Your email"
              />
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Email cannot be changed as it&apos;s used for login</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground-secondary)" }}>
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition cursor-text"
                style={{ borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground)" }}
                placeholder="+91 98765 43210"
                aria-label="Phone number"
                onMouseEnter={(e) => {
                  if (!e.currentTarget.matches(":focus")) {
                    e.currentTarget.style.borderColor = "#a5b4fc";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.matches(":focus")) {
                    e.currentTarget.style.borderColor = "var(--card-border)";
                  }
                }}
              />
            </div>
          </div>

          {/* Age & Location - Side by Side - ONLY FOR STUDENTS */}
          {user?.role === 'student' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground-secondary)" }}>
                  Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition cursor-text"
                    style={{ borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground)" }}
                    placeholder="18"
                    min="10"
                    max="60"
                    aria-label="Age"
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.matches(":focus")) {
                        e.currentTarget.style.borderColor = "#a5b4fc";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.matches(":focus")) {
                        e.currentTarget.style.borderColor = "var(--card-border)";
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground-secondary)" }}>
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition cursor-text"
                    style={{ borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground)" }}
                    placeholder="City, State"
                    aria-label="Location"
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.matches(":focus")) {
                        e.currentTarget.style.borderColor = "#a5b4fc";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.matches(":focus")) {
                        e.currentTarget.style.borderColor = "var(--card-border)";
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Exam Preparing For - ONLY FOR STUDENTS */}
          {user?.role === 'student' && (
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground-secondary)" }}>
                Exam Preparing For
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
                <select
                  value={examPreparingFor}
                  onChange={(e) => setExamPreparingFor(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition appearance-none cursor-pointer"
                  aria-label="Exam preparing for"
                  style={{ borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground)" }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.matches(":focus")) {
                      e.currentTarget.style.borderColor = "#a5b4fc";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.matches(":focus")) {
                      e.currentTarget.style.borderColor = "var(--card-border)";
                    }
                  }}
                >
                  <option value="">Select an exam</option>
                  {getAllExams().map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name} - {exam.fullName}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90" style={{ color: "var(--muted)" }} />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-2">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
              style={{
                background: isSaving ? "#D4A840" : "#E76F51",
                cursor: isSaving ? "not-allowed" : "pointer"
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = "#D65A3D";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = "#E76F51";
                }
              }}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ─── EXAM MANAGEMENT (STUDENTS ONLY) ─── */}
      {user?.role === 'student' && (
        <section className="rounded-2xl p-6 shadow-sm border mb-6" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <BookOpen className="w-5 h-5 text-blue-500" />
            Exam Management
          </h2>

          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            Manage your enrolled exams. Pro users can enroll in multiple exams and switch between them.
          </p>

          {/* Enrolled Exams List */}
          <div className="space-y-3 mb-5">
            {user?.enrolled_exams && user.enrolled_exams.length > 0 ? (
              user.enrolled_exams.map((examId) => {
                const exam = getAllExams().find(e => e.id === examId);
                if (!exam) return null;

                const isCurrent = user.current_exam === examId;

                return (
                  <div
                    key={examId}
                    className="flex items-center justify-between p-4 rounded-xl border transition"
                    style={{
                      background: isCurrent ? "var(--primary-bg)" : "var(--hover-bg)",
                      borderColor: isCurrent ? "var(--primary)" : "var(--card-border)",
                      borderWidth: isCurrent ? "2px" : "1px"
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{exam.icon}</div>
                      <div>
                        <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                          {exam.name}
                        </div>
                        <div className="text-sm" style={{ color: "var(--muted)" }}>
                          {exam.fullName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCurrent ? (
                        <div
                          className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                          style={{
                            background: "rgba(59, 130, 246, 0.1)",
                            color: "#3b82f6",
                            border: "1px solid rgba(59, 130, 246, 0.3)"
                          }}
                        >
                          <Check className="w-3 h-3" />
                          Current
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSwitchExam(examId)}
                          disabled={isProcessingExam}
                          className="px-4 py-2 text-sm font-medium rounded-lg transition flex items-center gap-1"
                          style={{
                            background: "var(--primary)",
                            color: "white",
                            cursor: isProcessingExam ? "not-allowed" : "pointer",
                            opacity: isProcessingExam ? 0.5 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!isProcessingExam) {
                              e.currentTarget.style.opacity = "0.9";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isProcessingExam) {
                              e.currentTarget.style.opacity = "1";
                            }
                          }}
                        >
                          <RefreshCcw className="w-3 h-3" />
                          Switch
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 rounded-xl border" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)" }}>
                <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--muted)" }} />
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  No enrolled exams found. Please contact support.
                </p>
              </div>
            )}
          </div>

          {/* Add Exam Button */}
          <button
            onClick={handleAddExamClick}
            disabled={isProcessingExam}
            className="w-full px-4 py-3 text-sm font-medium rounded-xl transition flex items-center justify-center gap-2 border"
            style={{
              background: subscription?.isPro ? "var(--primary)" : "var(--hover-bg)",
              color: subscription?.isPro ? "white" : "var(--muted)",
              borderColor: subscription?.isPro ? "var(--primary)" : "var(--card-border)",
              cursor: isProcessingExam ? "not-allowed" : subscription?.isPro ? "pointer" : "pointer"
            }}
            onMouseEnter={(e) => {
              if (!isProcessingExam) {
                if (subscription?.isPro) {
                  e.currentTarget.style.opacity = "0.9";
                } else {
                  e.currentTarget.style.borderColor = "#a5b4fc";
                }
              }
            }}
            onMouseLeave={(e) => {
              if (!isProcessingExam) {
                if (subscription?.isPro) {
                  e.currentTarget.style.opacity = "1";
                } else {
                  e.currentTarget.style.borderColor = "var(--card-border)";
                }
              }
            }}
          >
            {subscription?.isPro ? (
              <>
                <Plus className="w-4 h-4" />
                Add Another Exam (₹50/month)
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Add Another Exam (Upgrade to Pro)
              </>
            )}
          </button>

          {subscription?.isPro && (
            <p className="text-xs mt-2 text-center" style={{ color: "var(--muted)" }}>
              Additional exams are billed at ₹50/month each
            </p>
          )}
        </section>
      )}

      {/* ─── STUDY PREFERENCES (STUDENTS ONLY) ─── */}
      {user?.role === 'student' && (
        <section className="rounded-2xl p-6 shadow-sm border mb-6" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Target className="w-5 h-5 text-emerald-500" />
            Study Preferences
          </h2>

          {/* Daily Goal */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{ color: "var(--foreground-secondary)" }}>
              Daily Question Goal
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[20, 50, 100, 150].map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleDailyGoalChange(goal)}
                  className="py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={dailyGoal === goal
                    ? { background: "#10b981", color: "white", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }
                    : { background: "var(--hover-bg)", color: "var(--foreground-secondary)" }
                  }
                  onMouseEnter={(e) => {
                    if (dailyGoal !== goal) {
                      e.currentTarget.style.background = "var(--card-bg)";
                      e.currentTarget.style.borderColor = "#10b981";
                      e.currentTarget.style.border = "2px solid #10b981";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (dailyGoal !== goal) {
                      e.currentTarget.style.background = "var(--hover-bg)";
                      e.currentTarget.style.border = "none";
                    }
                  }}
                >
                  {goal}
                </button>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>Questions per day target</p>
          </div>

          {/* Default Difficulty */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: "var(--foreground-secondary)" }}>
              Default Quiz Difficulty
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: "easy", label: "Easy" },
                { value: "medium", label: "Medium" },
                { value: "hard", label: "Hard" },
                { value: "mixed", label: "Mixed" },
              ].map((d) => (
                <button
                  key={d.value}
                  onClick={() => handleDifficultyChange(d.value)}
                  className="py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={difficulty === d.value
                    ? { background: "#E76F51", color: "white", boxShadow: "0 4px 12px rgba(231, 111, 81, 0.3)" }
                    : { background: "var(--hover-bg)", color: "var(--foreground-secondary)" }
                  }
                  onMouseEnter={(e) => {
                    if (difficulty !== d.value) {
                      e.currentTarget.style.background = "var(--card-bg)";
                      e.currentTarget.style.borderColor = "#E76F51";
                      e.currentTarget.style.border = "2px solid #E76F51";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (difficulty !== d.value) {
                      e.currentTarget.style.background = "var(--hover-bg)";
                      e.currentTarget.style.border = "none";
                    }
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ─── SUBSCRIPTION (STUDENTS ONLY) ─── */}
      {user?.role === 'student' && (
        <section className="rounded-2xl p-6 shadow-sm border mb-6" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <CreditCard className="w-5 h-5 text-purple-500" />
            Subscription
          </h2>

          {subscription ? (
            <div className="space-y-4">
              {/* Plan Status */}
              <div className="flex items-center justify-between p-4 rounded-xl border" style={{ background: "var(--primary-bg)", borderColor: "var(--card-border)" }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>
                    Current Plan
                  </div>
                  <div className="text-lg font-bold mt-0.5" style={{ color: "var(--primary)" }}>
                    {subscription.isPro ? (
                      subscription.plan === "monthly" ? "Pro Monthly" : "Pro Quarterly"
                    ) : "Free"}
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold" style={subscription.isPro
                  ? { background: "rgba(168, 85, 247, 0.1)", color: "#a855f7", border: "1px solid rgba(168, 85, 247, 0.3)" }
                  : { background: "var(--hover-bg)", color: "var(--foreground-secondary)" }
                }>
                  {subscription.isPro ? "ACTIVE" : "FREE TIER"}
                </div>
              </div>

              {/* Subscription Details */}
              {subscription.isPro && subscription.subscription && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg" style={{ background: "var(--hover-bg)" }}>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>Started</div>
                    <div className="font-medium mt-0.5" style={{ color: "var(--foreground-secondary)" }}>
                      {formatDate(subscription.subscription.started_at)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: "var(--hover-bg)" }}>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>Expires</div>
                    <div className="font-medium mt-0.5" style={{ color: "var(--foreground-secondary)" }}>
                      {formatDate(subscription.subscription.expires_at)}
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz Usage */}
              {!subscription.isPro && (
                <div className="p-4 rounded-xl border" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)" }}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
                      Quizzes today: <span className="font-bold">{subscription.todayQuizCount}/{subscription.quizLimit}</span>
                    </div>
                    <a
                      href="/pricing"
                      className="text-sm font-medium hover:underline"
                      style={{ color: "var(--primary)" }}
                    >
                      Upgrade to Pro
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-pulse h-20 rounded-xl" style={{ background: "var(--hover-bg)" }} />
          )}
        </section>
      )}

      {/* ─── NOTIFICATIONS (STUDENTS ONLY) ─── */}
      {user?.role === 'student' && (
        <section className="rounded-2xl p-6 shadow-sm border mb-6" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Bell className="w-5 h-5 text-amber-500" />
            Notifications
          </h2>

          <div className="space-y-4">
            <NotificationToggle
              label="Daily Reminder"
              description="Get reminded to practice every day"
              defaultChecked={true}
              storageKey="krakkify-notif-daily"
            />
            <NotificationToggle
              label="Streak Alerts"
              description="Alert when your streak is about to break"
              defaultChecked={true}
              storageKey="krakkify-notif-streak"
            />
            <NotificationToggle
              label="New Features"
              description="Get notified about new features and updates"
              defaultChecked={false}
              storageKey="krakkify-notif-features"
            />
          </div>

          <p className="text-xs mt-4" style={{ color: "var(--muted)" }}>
            Note: Browser notifications require permission. Push notifications coming soon.
          </p>
        </section>
      )}

      {/* ─── ACCOUNT ─── */}
      <section className="rounded-2xl p-6 shadow-sm border mb-6" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
          <Shield className="w-5 h-5" style={{ color: "var(--muted)" }} />
          Account
        </h2>

        <div className="space-y-3">
          {/* Account Info */}
          <div className="p-4 rounded-xl" style={{ background: "var(--hover-bg)" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>Account ID</div>
                <div className="text-xs mt-0.5 font-mono" style={{ color: "var(--muted)" }}>{user.id}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>Member Since</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{formatDate(user.created_at)}</div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 rounded-xl transition group"
            style={{ background: "var(--hover-bg)" }}
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" style={{ color: "var(--muted)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>Logout</span>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: "var(--muted)" }} />
          </button>

          {/* Delete Account */}
          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-between p-4 rounded-xl transition group"
            style={{ background: "rgba(239, 68, 68, 0.1)" }}
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-500">Delete Account</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </section>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Krakkify v2.0 | Made with ❤️ in India
          </p>
        </div>

        {/* Exam Selection Modal */}
        {showAddExamModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0, 0, 0, 0.6)" }}
            onClick={() => setShowAddExamModal(false)}
          >
            <div
              className="rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              style={{ background: "var(--card-bg)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
                Select Exam to Add
              </h3>
              <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
                Choose an exam you want to enroll in. Additional exams cost ₹50/month.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getAllExams()
                  .filter(exam => !user?.enrolled_exams?.includes(exam.id))
                  .map((exam) => (
                    <button
                      key={exam.id}
                      onClick={() => handleExamSelection(exam.id)}
                      className="p-4 rounded-xl border-2 transition text-left hover:scale-105"
                      style={{
                        background: "var(--hover-bg)",
                        borderColor: "var(--card-border)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--primary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--card-border)";
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{exam.icon}</div>
                        <div>
                          <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                            {exam.name}
                          </div>
                          <div className="text-xs" style={{ color: "var(--muted)" }}>
                            {exam.fullName}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>

              {getAllExams().filter(exam => !user?.enrolled_exams?.includes(exam.id)).length === 0 && (
                <div className="text-center py-8">
                  <Check className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--primary)" }} />
                  <p style={{ color: "var(--foreground-secondary)" }}>
                    You&apos;re already enrolled in all available exams!
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowAddExamModal(false)}
                className="w-full mt-4 px-4 py-2 rounded-lg font-medium transition"
                style={{
                  background: "var(--hover-bg)",
                  color: "var(--foreground-secondary)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--card-border)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--hover-bg)";
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedExamToAdd && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0, 0, 0, 0.6)" }}
            onClick={() => {
              if (!isProcessingExam) {
                setShowPaymentModal(false);
                setSelectedExamToAdd(null);
              }
            }}
          >
            <div
              className="rounded-2xl p-6 max-w-md w-full shadow-2xl"
              style={{ background: "var(--card-bg)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
                Add Exam Payment
              </h3>

              <div className="p-4 rounded-xl mb-4 border" style={{ background: "var(--hover-bg)", borderColor: "var(--card-border)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">
                    {getAllExams().find(e => e.id === selectedExamToAdd)?.icon}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                      {getAllExams().find(e => e.id === selectedExamToAdd)?.name}
                    </div>
                    <div className="text-sm" style={{ color: "var(--muted)" }}>
                      {getAllExams().find(e => e.id === selectedExamToAdd)?.fullName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--card-border)" }}>
                  <div className="text-sm" style={{ color: "var(--muted)" }}>Monthly charge</div>
                  <div className="text-2xl font-bold" style={{ color: "var(--primary)" }}>₹50</div>
                </div>
              </div>

              {addExamError && (
                <div className="p-3 rounded-lg mb-4" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
                  <p className="text-sm">{addExamError}</p>
                </div>
              )}

              <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
                By confirming, you agree to pay ₹50/month for this exam. This will be added to your existing subscription.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedExamToAdd(null);
                  }}
                  disabled={isProcessingExam}
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium transition"
                  style={{
                    background: "var(--hover-bg)",
                    color: "var(--foreground-secondary)",
                    cursor: isProcessingExam ? "not-allowed" : "pointer",
                    opacity: isProcessingExam ? 0.5 : 1
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentSuccess}
                  disabled={isProcessingExam}
                  className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition flex items-center justify-center gap-2"
                  style={{
                    background: "var(--primary)",
                    cursor: isProcessingExam ? "not-allowed" : "pointer",
                    opacity: isProcessingExam ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isProcessingExam) {
                      e.currentTarget.style.opacity = "0.9";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isProcessingExam) {
                      e.currentTarget.style.opacity = "1";
                    }
                  }}
                >
                  {isProcessingExam ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Confirm Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        <ConfirmationModal
          isOpen={modal.isOpen}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          confirmLabel={modal.type === 'error' ? 'Yes, Delete' : modal.type === 'confirm' ? 'Yes' : 'OK'}
          cancelLabel="Cancel"
          onConfirm={modal.onConfirm}
          onCancel={() => setModal(prev => ({ ...prev, isOpen: false }))}
          showCancel={modal.type === 'confirm' || modal.type === 'error'}
        />
      </div>
    </div>
    </AccessibilityWrapper>
  );
}

// ─── Notification Toggle Component ───
function NotificationToggle({
  label,
  description,
  defaultChecked,
  storageKey,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
  storageKey: string;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      setChecked(saved === "true");
    }
  }, [storageKey]);

  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);
    localStorage.setItem(storageKey, newValue.toString());
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "var(--hover-bg)" }}>
      <div>
        <div className="text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>{label}</div>
        <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{description}</div>
      </div>
      <button
        onClick={handleToggle}
        className={`relative w-12 h-6 rounded-full transition-colors`}
        style={checked ? { background: "#E76F51" } : { background: "var(--card-border)" }}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full shadow transition-transform ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
          style={{ background: "white" }}
        />
      </button>
    </div>
  );
}
