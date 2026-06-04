"use client";

import { type ReactNode } from "react";
import { UserProvider } from "@/context/user-context";
import { LocaleProvider } from "@/context/locale-context";
import { ThemeProvider } from "@/context/theme-context";
import { LoginModal } from "@/components/login-modal";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <UserProvider>
        <ThemeProvider>
          <LoginModal />
          {children}
        </ThemeProvider>
      </UserProvider>
    </LocaleProvider>
  );
}
