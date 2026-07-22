"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { AuthPanel } from "@/components/auth/AuthPanel";

interface AuthOverlayProps {
  initialMode: "signup" | "login";
  initialEmail?: string;
  /** Called after the swipe-up exit finishes so the parent can unmount us. */
  onClose: () => void;
  mascotSrc?: string;
}

export function AuthOverlay({
  initialMode,
  initialEmail = "",
  onClose,
  mascotSrc = "/images/auth-mascot-yeti-wave-v2.png",
}: AuthOverlayProps) {
  const [mode, setMode] = useState<"signup" | "login">(initialMode);
  const [email, setEmail] = useState(initialEmail);

  // Drives the close animation. We do NOT rely on AnimatePresence's `exit`:
  // closing goes through window.history.back(), whose popstate is ALSO caught
  // by Next's App Router, which re-renders the route and unmounts us before an
  // exit animation can play (the router wins the race → instant close, no
  // fade). Instead we self-drive: flip `isClosing`, let the fade-out play on
  // the always-mounted root, and only tear down after onAnimationComplete.
  const [isClosing, setIsClosing] = useState(false);

  // Guard so we push the history entry exactly once. React StrictMode (on by
  // default in dev) double-invokes effects: setup → cleanup → setup. Without
  // this guard we'd push /signup twice, so a single history.back() on close
  // would only pop one entry and leave the URL stuck on /signup.
  const didPushRef = useRef(false);
  // Re-entry guard so X, Esc and browser-Back can't each start a close.
  const closingRef = useRef(false);
  // True once the /signup|/login entry has already been popped (browser Back),
  // so onAnimationComplete doesn't try to pop it a second time.
  const poppedRef = useRef(false);

  // Sync the URL bar: push /signup or /login when the overlay opens so the
  // route is shareable and the browser Back button closes the overlay.
  useEffect(() => {
    if (!didPushRef.current) {
      window.history.pushState({ authOverlay: true }, "", `/${initialMode}`);
      didPushRef.current = true;
    }

    const handlePopState = () => {
      // Browser Back popped our entry — the URL is already back at "/", so we
      // just play the fade-out (no further history.back needed) then unmount.
      poppedRef.current = true;
      if (!closingRef.current) {
        closingRef.current = true;
        setIsClosing(true);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
    // Run once on mount; initialMode is fixed for the overlay's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close = start the fade-out. The history pop + parent unmount happen in
  // handleCloseComplete once the animation has actually finished.
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);
  }, []);

  // Runs when the root's fade-out finishes. Restore the URL (unless the browser
  // Back button already did) and let the parent unmount us.
  const handleCloseComplete = useCallback(() => {
    if (!closingRef.current) return; // ignore the open animation completing
    if (!poppedRef.current) {
      // X / Esc path: pop the /signup|/login entry we pushed so the URL and
      // history return to the landing page. The animation is already done, so
      // the router re-render can no longer interrupt anything visible.
      window.history.back();
    }
    onClose();
  }, [onClose]);

  // Escape key closes the overlay.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [requestClose]);

  const handleSwitchMode = (target: "signup" | "login") => {
    if (target === mode) return;
    setMode(target);
    // Reflect the mode in the URL without stacking history entries, so Back
    // still returns straight to the landing page rather than cycling modes.
    window.history.replaceState({ authOverlay: true }, "", `/${target}`);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex bg-white dark:bg-slate-950"
      // Open: soft fade + subtle scale up (fast, smooth). Close (✕/Esc/Back): a
      // clear dismiss — fades out while drifting down and scaling in slightly,
      // so it reads as the screen being put away. We self-drive the close via
      // `isClosing` (see requestClose) rather than AnimatePresence's `exit`,
      // because the history-back on close would otherwise let Next's router
      // unmount us before an exit could play. Only opacity + transform animate,
      // so it stays GPU-composited and smooth.
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={
        isClosing
          ? { opacity: 0, scale: 0.96, y: 40 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      transition={{ duration: isClosing ? 0.28 : 0.32, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        if (isClosing) handleCloseComplete();
      }}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={requestClose}
        aria-label="Close"
        className="absolute top-5 right-5 z-20 flex items-center justify-center w-10 h-10 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <X className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {/* Left Side - Mascot Hero (fixed; only the form slides) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src={mascotSrc}
          alt="Scoreyo study companion"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
          <Link href="/" className="inline-block group">
            <h1 className="text-5xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "#1B2A49" }}>
              Scoreyo
            </h1>
            <p className="text-lg font-semibold mt-1" style={{ fontFamily: "var(--font-heading)", color: "#475569" }}>
              Where Learning Meets Intelligence
            </p>
          </Link>
        </div>
      </div>

      {/* Right Side - Form. Both panels are mounted side-by-side on a single
          track; switching mode just translates the track by one panel width.
          Nothing mounts/unmounts mid-slide, so the motion stays perfectly
          smooth (Quizlet-style) with no reconciliation stutter. */}
      <div className="flex-1 relative overflow-hidden bg-white dark:bg-slate-950">
        <motion.div
          className="flex h-full w-[200%]"
          animate={{ x: mode === "login" ? "-50%" : "0%" }}
          transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "transform" }}
        >
          {(["signup", "login"] as const).map((panelMode) => (
            <div
              key={panelMode}
              className="w-1/2 h-full flex items-start justify-center p-8 lg:p-12 overflow-y-auto overflow-x-hidden"
            >
              <div className="w-full max-w-md lg:mt-[12vh]">
                {/* Mobile Logo */}
                <Link href="/" className="lg:hidden block mb-10">
                  <span className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "#1B2A49" }}>
                    Scoreyo
                  </span>
                </Link>

                <AuthPanel
                  mode={panelMode}
                  email={email}
                  onEmailChange={setEmail}
                  onSwitchMode={handleSwitchMode}
                  active={panelMode === mode}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
