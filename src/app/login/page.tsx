"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { useUser } from "@/context/user-context";
import { safeRedirect } from "@/lib/safe-redirect";
import { Loader2 } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const redirectTo = safeRedirect(searchParams?.get("redirect"));

  // Already logged in? Don't show the auth form — go to the redirect target.
  useEffect(() => {
    if (user) window.location.href = redirectTo;
  }, [user, redirectTo]);

  return (
    <AuthLayout mascotSrc="/images/auth-mascot-yeti-wave-v2.png">
      <motion.div
        key="login"
        initial={{ opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <AuthPanel
          mode="login"
          initialEmail={searchParams?.get("email") || ""}
          redirectTo={redirectTo}
        />
      </motion.div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <AuthLayout mascotSrc="/images/auth-mascot-yeti-wave-v2.png">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#344974]" />
        </div>
      </AuthLayout>
    }>
      <LoginContent />
    </Suspense>
  );
}
