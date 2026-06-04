"use client";

import { type ReactNode } from "react";
import { UserProvider } from "@/context/user-context";
import { LocaleProvider } from "@/context/locale-context";
import { DarkModeProvider } from "@/context/dark-mode-context";
import { LoginModal } from "@/components/login-modal";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <DarkModeProvider>
        <LocaleProvider>
          <LoginModal />
          {children}
        </LocaleProvider>
      </DarkModeProvider>
    </UserProvider>
  );
}
