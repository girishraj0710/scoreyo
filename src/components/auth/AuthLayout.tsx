"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  side?: "left" | "right";
}

export function AuthLayout({ children, side = "right" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">
      {/* Left Side - Clean Gradient + Minimal Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-gradient-to-br from-[#7c3aed] via-[#a855f7] to-[#c084fc]"
      >
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between p-16 text-white w-full">
          {/* Top - Logo (minimal) */}
          <Link href="/" className="inline-flex items-center gap-2 group hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">Krakkify</span>
          </Link>

          {/* Center - Main Message (Quizlet-style simple) */}
          <div className="space-y-6 max-w-md">
            <h1 className="text-5xl font-bold leading-tight tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Master exams.
              <br />
              Build confidence.
            </h1>
            <p className="text-xl text-white/90 leading-relaxed font-light">
              Join thousands preparing for competitive exams.
            </p>
          </div>

          {/* Bottom - Simple Attribution */}
          <p className="text-sm text-white/50 font-light">
            © 2026 Krakkify
          </p>
        </div>

        {/* Decorative Elements (subtle) */}
        <div className="absolute top-1/4 right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-12 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Right Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-12"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-heading font-bold text-[#16213E] dark:text-white">Krakkify</span>
          </Link>

          {/* Content */}
          {children}
        </div>
      </motion.div>
    </div>
  );
}
