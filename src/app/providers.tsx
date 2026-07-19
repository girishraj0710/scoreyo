"use client";

import { type ReactNode, useEffect } from "react";
import { UserProvider } from "@/context/user-context";
import { LocaleProvider } from "@/context/locale-context";
import { ThemeProvider } from "@/context/theme-context";
import { initCapacitor } from "@/lib/capacitor";

export function Providers({ children }: { children: ReactNode }) {
  // Initialize Capacitor on mount (mobile app only)
  useEffect(() => {
    initCapacitor();
  }, []);

  return (
    <LocaleProvider>
      <UserProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </UserProvider>
    </LocaleProvider>
  );
}
