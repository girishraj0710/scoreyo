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
      {/* Left Side - Gradient + Illustration */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-2/5 relative overflow-hidden"
      >
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-heading font-bold">Krakkify</span>
          </Link>

          {/* Illustration + Copy */}
          <div className="space-y-8">
            {/* Premium SVG Illustration */}
            <div className="relative w-full h-64">
              <svg
                viewBox="0 0 400 300"
                className="w-full h-full drop-shadow-2xl"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Books Stack */}
                <g opacity="0.9">
                  <rect x="80" y="180" width="120" height="18" rx="3" fill="white" opacity="0.8" />
                  <rect x="85" y="162" width="110" height="16" rx="3" fill="white" opacity="0.9" />
                  <rect x="90" y="146" width="100" height="14" rx="3" fill="white" opacity="1" />
                </g>

                {/* Trophy */}
                <g transform="translate(240, 140)">
                  <ellipse cx="30" cy="65" rx="35" ry="8" fill="white" opacity="0.3" />
                  <path
                    d="M15 10 L15 35 Q15 45 25 50 L35 50 Q45 45 45 35 L45 10 Z"
                    fill="white"
                    opacity="0.95"
                  />
                  <rect x="25" y="50" width="10" height="15" rx="1" fill="white" opacity="0.9" />
                  <ellipse cx="30" cy="5" rx="15" ry="5" fill="#FFD700" opacity="0.9" />
                  <path d="M10 10 Q5 15 10 25 L15 25 L15 10 Z" fill="white" opacity="0.8" />
                  <path d="M50 10 Q55 15 50 25 L45 25 L45 10 Z" fill="white" opacity="0.8" />
                </g>

                {/* Flashcards */}
                <g transform="translate(110, 80)">
                  <rect x="0" y="15" width="80" height="50" rx="6" fill="white" opacity="0.7" transform="rotate(-10 40 40)" />
                  <rect x="10" y="10" width="80" height="50" rx="6" fill="white" opacity="0.85" transform="rotate(-5 50 35)" />
                  <rect x="20" y="5" width="80" height="50" rx="6" fill="white" opacity="1" />
                  <circle cx="60" cy="20" r="3" fill="#F26A4B" />
                  <line x1="30" y1="30" x2="90" y2="30" stroke="#5A6478" strokeWidth="2" opacity="0.5" />
                  <line x1="30" y1="40" x2="75" y2="40" stroke="#5A6478" strokeWidth="2" opacity="0.5" />
                </g>

                {/* Stars */}
                <g opacity="0.6">
                  <path d="M50 30 L52 36 L58 36 L53 40 L55 46 L50 42 L45 46 L47 40 L42 36 L48 36 Z" fill="white" />
                  <path d="M320 50 L322 56 L328 56 L323 60 L325 66 L320 62 L315 66 L317 60 L312 56 L318 56 Z" fill="white" />
                  <path d="M340 200 L342 206 L348 206 L343 210 L345 216 L340 212 L335 216 L337 210 L332 206 L338 206 Z" fill="white" />
                </g>
              </svg>
            </div>

            {/* Motivational Copy */}
            <div className="space-y-4">
              <h2 className="text-4xl font-heading font-bold leading-tight">
                Master any exam with
                <br />
                India's smartest
                <br />
                prep platform
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Join thousands of students cracking JEE, NEET, UPSC,
                SSC, and 70+ competitive exams.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-heading font-bold">74+</div>
                <div className="text-sm text-white/70">Exams Covered</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold">50K+</div>
                <div className="text-sm text-white/70">Questions</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold">10K+</div>
                <div className="text-sm text-white/70">Active Users</div>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-sm text-white/60">
            © 2026 Krakkify. Built with ❤️ in India.
          </p>
        </div>
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
