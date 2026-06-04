"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@/context/user-context";

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setIsMounted(true);

    // Only enable dark mode for authenticated users
    if (!user) {
      // Remove dark mode for unauthenticated users
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("prepgenie-dark-mode");
      setIsDarkMode(false);
      return;
    }

    // Check if dark mode is saved
    const savedMode = localStorage.getItem("prepgenie-dark-mode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, [user]);

  const toggleDarkMode = () => {
    if (!user) return;

    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      localStorage.setItem("prepgenie-dark-mode", "true");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("prepgenie-dark-mode", "false");
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within DarkModeProvider");
  }
  return context;
}
