"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { useLocale, type Locale } from "@/context/locale-context";
import { getAllExams } from "@/lib/exams";
import {
  User, Mail, Phone, MapPin, GraduationCap, Globe, Target,
  Moon, Sun, Bell, Shield, CreditCard, Trash2, LogOut,
  ChevronRight, Check, Save, Calendar
} from "lucide-react";
import { ConfirmationModal } from "@/components/confirmation-modal";

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

  // Redirect contributors to contributor portal
  useEffect(() => {
    if (!userLoading && user && ["contributor", "admin"].includes(user.role || "")) {
      router.push("/contributor");
    }
  }, [user, userLoading, router]);

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
    const savedGoal = localStorage.getItem("prepgenie-daily-goal");
    if (savedGoal) setDailyGoal(parseInt(savedGoal));

    const savedDifficulty = localStorage.getItem("prepgenie-difficulty");
    if (savedDifficulty) setDifficulty(savedDifficulty);

    const savedDarkMode = localStorage.getItem("prepgenie-theme");
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
    localStorage.setItem("prepgenie-daily-goal", goal.toString());
  };

  const handleDifficultyChange = (diff: string) => {
    setDifficulty(diff);
    localStorage.setItem("prepgenie-difficulty", diff);
  };

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    const theme = newMode ? "dark" : "light";
    localStorage.setItem("prepgenie-theme", theme);
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
          message: "To delete your account, please email us at support@prepgenie.co.in with your registered email address.",
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

  if (!user) {
    return (
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
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
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
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                style={{ borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground)" }}
                placeholder="Enter your full name"
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
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                style={{ borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground)" }}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Age & Location - Side by Side */}
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
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  style={{ borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground)" }}
                  placeholder="18"
                  min="10"
                  max="60"
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
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  style={{ borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground)" }}
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>

          {/* Exam Preparing For */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground-secondary)" }}>
              Exam Preparing For
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
              <select
                value={examPreparingFor}
                onChange={(e) => setExamPreparingFor(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none"
                style={{ borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--foreground)" }}
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

          {/* Save Button */}
          <div className="pt-2">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
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

      {/* ─── STUDY PREFERENCES ─── */}
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
                className={`py-2.5 rounded-lg text-sm font-medium transition ${
                  dailyGoal === goal
                    ? "bg-emerald-500 text-white shadow-md"
                    : ""
                }`}
                style={dailyGoal !== goal ? { background: "var(--hover-bg)", color: "var(--foreground-secondary)" } : undefined}
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
                className={`py-2.5 rounded-lg text-sm font-medium transition ${
                  difficulty === d.value
                    ? "bg-indigo-500 text-white shadow-md"
                    : ""
                }`}
                style={difficulty !== d.value ? { background: "var(--hover-bg)", color: "var(--foreground-secondary)" } : undefined}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LANGUAGE & APPEARANCE ─── */}
      <section className="rounded-2xl p-6 shadow-sm border mb-6" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
          <Globe className="w-5 h-5 text-blue-500" />
          Language & Appearance
        </h2>

        {/* Language */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3" style={{ color: "var(--foreground-secondary)" }}>
            App Language
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium transition text-center ${
                  locale === lang.code
                    ? "bg-blue-500 text-white shadow-md"
                    : ""
                }`}
                style={locale !== lang.code ? { background: "var(--hover-bg)", color: "var(--foreground-secondary)" } : undefined}
              >
                <div>{lang.native}</div>
                <div className={`text-xs mt-0.5 ${locale === lang.code ? "text-blue-100" : ""}`} style={locale !== lang.code ? { color: "var(--muted)" } : undefined}>
                  {lang.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "var(--hover-bg)" }}>
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="w-5 h-5 text-indigo-500" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>
                Dark Mode
              </div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                {darkMode ? "Dark theme active" : "Light theme active"}
              </div>
            </div>
          </div>
          <button
            onClick={handleDarkModeToggle}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              darkMode ? "bg-indigo-500" : ""
            }`}
            style={!darkMode ? { background: "var(--card-border)" } : undefined}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                darkMode ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </section>

      {/* ─── SUBSCRIPTION ─── */}
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
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                subscription.isPro
                  ? "bg-purple-100 text-purple-700"
                  : ""
              }`} style={!subscription.isPro ? { background: "var(--hover-bg)", color: "var(--foreground-secondary)" } : undefined}>
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

      {/* ─── NOTIFICATIONS ─── */}
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
            storageKey="prepgenie-notif-daily"
          />
          <NotificationToggle
            label="Streak Alerts"
            description="Alert when your streak is about to break"
            defaultChecked={true}
            storageKey="prepgenie-notif-streak"
          />
          <NotificationToggle
            label="New Features"
            description="Get notified about new features and updates"
            defaultChecked={false}
            storageKey="prepgenie-notif-features"
          />
        </div>

        <p className="text-xs mt-4" style={{ color: "var(--muted)" }}>
          Note: Browser notifications require permission. Push notifications coming soon.
        </p>
      </section>

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
              <span className="text-sm font-medium" style={{ color: "var(--danger)" }}>Delete Account</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </section>

      {/* App Version */}
      <div className="text-center py-4">
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          PrepGenie v2.0 | Made with ❤️ in India
        </p>
      </div>

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
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? "bg-emerald-500" : ""
        }`}
        style={!checked ? { background: "var(--card-border)" } : undefined}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
