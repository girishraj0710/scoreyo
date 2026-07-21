"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  location?: string;
  phone_number?: string;
  exam_preparing_for?: string;
  avatar_color: string;
  created_at: string;
  role?: 'student' | 'contributor' | 'admin';
  // Single-exam-focus architecture
  current_exam?: string;          // Currently selected exam (e.g., 'jee', 'neet')
  enrolled_exams?: string[];      // All exams user has enrolled in
  subscription_status?: 'free' | 'pro';
  onboarding_completed?: boolean; // AI Assessment Interview finished
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  sendOtp: (email: string, action?: "login" | "signup") => Promise<{ success: boolean; error?: string; shouldLogin?: boolean; shouldSignup?: boolean }>;
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  completeLogin: (
    email: string,
    name?: string,
    age?: string,
    location?: string,
    phoneNumber?: string,
    examPreparingFor?: string,
    role?: 'student' | 'contributor'
  ) => Promise<{ success: boolean; needsSignup?: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (
    name: string,
    email?: string,
    age?: string,
    location?: string,
    phoneNumber?: string,
    examPreparingFor?: string
  ) => Promise<void>;
  // Single-exam-focus architecture
  switchExam: (examId: string) => Promise<void>;
  addExam: (examId: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  canSwitchExams: boolean;
  canAddExams: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();

    // Re-check auth on visibility change (when tab regains focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchUser();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  async function fetchUser() {
    try {
      const res = await fetch("/api/auth", {
        method: "GET",
        cache: "no-store", // Prevent caching of auth check
        credentials: 'same-origin', // CRITICAL: Include cookies in request
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
        }
      });

      if (!res.ok) {
        throw new Error(`Auth API returned ${res.status}`);
      }

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('[UserContext] Failed to parse JSON response:', text.substring(0, 200));
        throw new Error('Invalid JSON response from auth API');
      }

      if (data.user) {
        console.log('[UserContext] fetchUser: User authenticated', data.user.email);
        setUser(data.user);
      } else {
        console.log('[UserContext] fetchUser: No user found, clearing state');
        // Ensure user is cleared
        setUser(null);
      }
    } catch (error) {
      console.error("Fetch user error:", error);
      // Ensure user is cleared on error
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendOtp(email: string, action?: "login" | "signup") {
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || "Failed to send OTP",
          shouldLogin: data.shouldLogin,
          shouldSignup: data.shouldSignup
        };
      }
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  async function verifyOtp(email: string, code: string) {
    try {
      const res = await fetch("/api/auth/otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Invalid code" };
      }
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  async function completeLogin(
    email: string,
    name?: string,
    age?: string,
    location?: string,
    phoneNumber?: string,
    examPreparingFor?: string,
    role?: 'student' | 'contributor'
  ) {
    try {
      const payload = { email, name, age, location, phoneNumber, examPreparingFor, role };
      console.log('[UserContext] completeLogin payload:', payload);

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: 'same-origin', // CRITICAL: Ensure cookies are sent/received
      });

      const data = await res.json();
      console.log('[UserContext] completeLogin response:', { status: res.status, data });

      // Check needsSignup BEFORE res.ok: the API returns it with a 400 status
      // for new emails, so testing res.ok first would swallow the flag and show
      // the raw "Name required" error instead of advancing to the name step.
      if (data.needsSignup) {
        return { success: false, needsSignup: true };
      }
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }
      if (data.user) {
        setUser(data.user);

        // CRITICAL: Force a context refresh after login to ensure cookies are loaded
        // This prevents the "logged out on navigation" bug
        setTimeout(() => {
          fetchUser();
        }, 100);

        return { success: true };
      }
      return { success: false, error: "Unexpected error" };
    } catch (err) {
      console.error('[UserContext] completeLogin error:', err);
      return { success: false, error: "Network error. Please try again." };
    }
  }

  async function logout() {
    // Clear local state immediately for snappy UI, then do a top-level browser
    // navigation to the logout endpoint. The GET endpoint clears the auth
    // cookies and 302-redirects home; because it's a full-page navigation, the
    // browser commits the cookie-clear before loading "/", so a refresh can't
    // re-authenticate from a stale cookie. This replaces the fetch("DELETE") +
    // client-reload approach, which left the cookie intact on some browsers.
    setUser(null);
    window.location.href = "/api/auth/logout";
  }

  async function updateProfile(
    name: string,
    email?: string,
    age?: string,
    location?: string,
    phoneNumber?: string,
    examPreparingFor?: string
  ) {
    const res = await fetch("/api/auth", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, age, location, phoneNumber, examPreparingFor }),
    });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
    }
  }

  // Single-exam-focus: Switch between enrolled exams
  async function switchExam(examId: string) {
    if (!user) return;

    try {
      const res = await fetch("/api/exam/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Switch exam error:", error);
    }
  }

  // Single-exam-focus: Add new exam (Pro only)
  async function addExam(examId: string) {
    if (!user) return { success: false, error: "Not logged in" };

    try {
      const res = await fetch("/api/exam/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }

      return { success: false, error: data.error || "Failed to add exam" };
    } catch (error) {
      console.error("Add exam error:", error);
      return { success: false, error: "Network error" };
    }
  }

  // Computed properties for single-exam-focus
  // isAdmin: ONLY true admin (not contributor)
  // Admin has access to all exams and all features
  const isAdmin = user?.role === 'admin';
  const canSwitchExams = !isAdmin && (user?.enrolled_exams?.length || 0) > 1;
  const canAddExams = user?.subscription_status === 'pro' && !isAdmin;

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        sendOtp,
        verifyOtp,
        completeLogin,
        logout,
        updateProfile,
        switchExam,
        addExam,
        refreshUser: fetchUser,
        isAdmin,
        canSwitchExams,
        canAddExams,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
