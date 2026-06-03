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
  const { user, isLoading: userLoading } = useUser();

  // Redirect contributors to contributor portal
  useEffect(() => {
    if (!userLoading && user && ["contributor", "admin"].includes(user.role || "")) {
      router.push("/contributor");
    }
  }, [user, userLoading, router]);
  const { user, updateProfile, logout } = useUser();
  const { locale, setLocale } = useLocale();

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

    const savedDarkMode = localStorage.getItem("prepgenie-dark-mode");
    if (savedDarkMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
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
    localStorage.setItem("prepgenie-dark-mode", newMode.toString());
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg border border-slate-200 dark:border-gray-700">
          <User className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            Please Login
          </h2>
          <p className="text-slate-500 dark:text-gray-400">
            You need to be logged in to access settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Settings</h1>
      <p className="text-slate-500 dark:text-gray-400 text-sm mb-8">
        Manage your profile, preferences, and account settings
      </p>

      {/* ─── PROFILE SECTION ─── */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-500" />
          Profile
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                disabled
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-gray-600 rounded-lg bg-slate-50 dark:bg-gray-600 text-slate-500 dark:text-gray-400 cursor-not-allowed"
                placeholder="Your email"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed as it&apos;s used for login</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Age & Location - Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1.5">
                Age
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="18"
                  min="10"
                  max="60"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>

          {/* Exam Preparing For */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1.5">
              Exam Preparing For
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={examPreparingFor}
                onChange={(e) => setExamPreparingFor(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none"
              >
                <option value="">Select an exam</option>
                {getAllExams().map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name} - {exam.fullName}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90" />
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
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-500" />
          Study Preferences
        </h2>

        {/* Daily Goal */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-3">
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
                    : "bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600"
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">Questions per day target</p>
        </div>

        {/* Default Difficulty */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-3">
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
                    : "bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LANGUAGE & APPEARANCE ─── */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" />
          Language & Appearance
        </h2>

        {/* Language */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-3">
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
                    : "bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600"
                }`}
              >
                <div>{lang.native}</div>
                <div className={`text-xs mt-0.5 ${locale === lang.code ? "text-blue-100" : "text-slate-400"}`}>
                  {lang.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="w-5 h-5 text-indigo-500" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
            <div>
              <div className="text-sm font-medium text-slate-700 dark:text-gray-200">
                Dark Mode
              </div>
              <div className="text-xs text-slate-400">
                {darkMode ? "Dark theme active" : "Light theme active"}
              </div>
            </div>
          </div>
          <button
            onClick={handleDarkModeToggle}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              darkMode ? "bg-indigo-500" : "bg-slate-300"
            }`}
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
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-500" />
          Subscription
        </h2>

        {subscription ? (
          <div className="space-y-4">
            {/* Plan Status */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-gray-200">
                  Current Plan
                </div>
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                  {subscription.isPro ? (
                    subscription.plan === "monthly" ? "Pro Monthly" : "Pro Quarterly"
                  ) : "Free"}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                subscription.isPro
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200"
                  : "bg-slate-100 text-slate-600 dark:bg-gray-700 dark:text-gray-300"
              }`}>
                {subscription.isPro ? "ACTIVE" : "FREE TIER"}
              </div>
            </div>

            {/* Subscription Details */}
            {subscription.isPro && subscription.subscription && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-slate-400 text-xs">Started</div>
                  <div className="font-medium text-slate-700 dark:text-gray-200 mt-0.5">
                    {formatDate(subscription.subscription.started_at)}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-slate-400 text-xs">Expires</div>
                  <div className="font-medium text-slate-700 dark:text-gray-200 mt-0.5">
                    {formatDate(subscription.subscription.expires_at)}
                  </div>
                </div>
              </div>
            )}

            {/* Quiz Usage */}
            {!subscription.isPro && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    Quizzes today: <span className="font-bold">{subscription.todayQuizCount}/{subscription.quizLimit}</span>
                  </div>
                  <a
                    href="/pricing"
                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Upgrade to Pro
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-pulse h-20 bg-slate-100 dark:bg-gray-700 rounded-xl" />
        )}
      </section>

      {/* ─── NOTIFICATIONS ─── */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
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

        <p className="text-xs text-slate-400 mt-4">
          Note: Browser notifications require permission. Push notifications coming soon.
        </p>
      </section>

      {/* ─── ACCOUNT ─── */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
          <Shield className="w-5 h-5 text-slate-500" />
          Account
        </h2>

        <div className="space-y-3">
          {/* Account Info */}
          <div className="p-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-gray-200">Account ID</div>
                <div className="text-xs text-slate-400 mt-0.5 font-mono">{user.id}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-700 dark:text-gray-200">Member Since</div>
                <div className="text-xs text-slate-400 mt-0.5">{formatDate(user.created_at)}</div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 rounded-xl transition group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-slate-500 group-hover:text-slate-700 dark:text-gray-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-gray-200">Logout</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Delete Account */}
          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 rounded-xl transition group"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">Delete Account</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </section>

      {/* App Version */}
      <div className="text-center py-4">
        <p className="text-xs text-slate-400">
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
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl">
      <div>
        <div className="text-sm font-medium text-slate-700 dark:text-gray-200">{label}</div>
        <div className="text-xs text-slate-400 mt-0.5">{description}</div>
      </div>
      <button
        onClick={handleToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? "bg-emerald-500" : "bg-slate-300 dark:bg-gray-600"
        }`}
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
