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
      {/* Left Side - Premium Minimal Design */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      >
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }} />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight">Krakkify</span>
          </Link>

          {/* Center Content */}
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-5xl font-bold leading-[1.1] mb-6" style={{ letterSpacing: '-0.02em' }}>
                Prepare smarter,
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  not harder
                </span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                Join thousands of students using AI-powered practice to ace their competitive exams.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold mb-1">74+</div>
                  <div className="text-sm text-slate-500">Exams</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">50K+</div>
                  <div className="text-sm text-slate-500">Questions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">10K+</div>
                  <div className="text-sm text-slate-500">Students</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="text-sm text-slate-600">
            © 2026 Krakkify. All rights reserved.
          </div>
        </div>
      </motion.div>

      {/* Right Side - Clean Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 flex items-center justify-center p-8 lg:p-12"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-slate-900 dark:text-white">Krakkify</span>
          </Link>

          {/* Form Content */}
          {children}
        </div>
      </motion.div>
    </div>
  );
}
