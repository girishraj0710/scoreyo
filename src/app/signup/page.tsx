"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { useUser } from "@/context/user-context";
import { Loader2 } from "lucide-react";

function SignupContent() {
  const searchParams = useSearchParams();
  const { user } = useUser();

  // Already logged in? Don't show the auth form — go home.
  useEffect(() => {
    if (user) window.location.href = "/";
  }, [user]);

  return (
    <AuthLayout mascotSrc="/images/auth-mascot-yeti-wave-v2.png">
      <motion.div
        key="signup"
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <AuthPanel mode="signup" initialEmail={searchParams?.get("email") || ""} />
      </motion.div>
    </AuthLayout>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <AuthLayout mascotSrc="/images/auth-mascot-yeti-wave-v2.png">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#344974]" />
        </div>
      </AuthLayout>
    }>
      <SignupContent />
    </Suspense>
  );
}
