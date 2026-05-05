"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar_color: string;
  created_at: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  sendOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  completeLogin: (email: string, name?: string) => Promise<{ success: boolean; needsName?: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (name: string, email?: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        // Only auto-show modal if NOT on homepage (landing page has inline form)
        const isHomePage = typeof window !== "undefined" && window.location.pathname === "/";
        if (!isHomePage) {
          setShowLoginModal(true);
        }
      }
    } catch {
      // Only auto-show modal if NOT on homepage
      const isHomePage = typeof window !== "undefined" && window.location.pathname === "/";
      if (!isHomePage) {
        setShowLoginModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function sendOtp(email: string) {
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Failed to send OTP" };
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

  async function completeLogin(email: string, name?: string) {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }
      if (data.needsName) {
        return { success: false, needsName: true };
      }
      if (data.user) {
        setUser(data.user);
        setShowLoginModal(false);
        return { success: true };
      }
      return { success: false, error: "Unexpected error" };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    setUser(null);
    setShowLoginModal(true);
  }

  async function updateProfile(name: string, email?: string) {
    const res = await fetch("/api/auth", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        showLoginModal,
        setShowLoginModal,
        sendOtp,
        verifyOtp,
        completeLogin,
        logout,
        updateProfile,
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
