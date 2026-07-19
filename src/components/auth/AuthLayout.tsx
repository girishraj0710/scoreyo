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
    <div className="min-h-screen flex bg-white dark:bg-slate-950 relative">
      {/* Left Side - Solid Premium Color */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#4F46E5]"
      >
        {/* Subtle Texture */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold">Krakkify</span>
          </Link>

          {/* Center Content */}
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-5xl font-bold leading-[1.1] mb-6" style={{ letterSpacing: '-0.02em' }}>
                Excel in your
                <br />
                competitive exams
              </h1>
              <p className="text-lg text-white/90 leading-relaxed">
                AI-powered practice platform trusted by thousands of students across India.
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/60">
            © 2026 Krakkify
          </div>
        </div>
      </motion.div>

      {/* Educational Image - Cuts through divider */}
      <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* 3D Books Stack Illustration */}
          <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
            {/* Shadow */}
            <ellipse cx="160" cy="280" rx="100" ry="20" fill="black" opacity="0.1" />

            {/* Book 1 - Bottom (Blue) */}
            <g transform="translate(80, 200)">
              <path d="M0 20 L140 0 L140 40 L0 60 Z" fill="#4F46E5" />
              <path d="M140 0 L160 8 L160 48 L140 40 Z" fill="#6366F1" />
              <path d="M0 20 L20 28 L160 8 L140 0 Z" fill="#818CF8" />
              {/* Pages */}
              <rect x="135" y="5" width="3" height="35" fill="white" opacity="0.3" />
            </g>

            {/* Book 2 - Middle (Purple) */}
            <g transform="translate(70, 170)">
              <path d="M0 20 L150 0 L150 35 L0 55 Z" fill="#7C3AED" />
              <path d="M150 0 L170 8 L170 43 L150 35 Z" fill="#8B5CF6" />
              <path d="M0 20 L20 28 L170 8 L150 0 Z" fill="#A78BFA" />
              {/* Pages */}
              <rect x="145" y="5" width="3" height="30" fill="white" opacity="0.3" />
            </g>

            {/* Book 3 - Top (Indigo) */}
            <g transform="translate(60, 145)">
              <path d="M0 20 L160 0 L160 30 L0 50 Z" fill="#6366F1" />
              <path d="M160 0 L180 8 L180 38 L160 30 Z" fill="#818CF8" />
              <path d="M0 20 L20 28 L180 8 L160 0 Z" fill="#A5B4FC" />
              {/* Pages */}
              <rect x="155" y="5" width="3" height="25" fill="white" opacity="0.3" />
            </g>

            {/* Floating Sparkles */}
            <circle cx="50" cy="120" r="3" fill="#FCD34D" opacity="0.8">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="270" cy="140" r="2.5" fill="#FCD34D" opacity="0.7">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="40" cy="180" r="2" fill="#FCD34D" opacity="0.6">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
            </circle>

            {/* Graduation Cap */}
            <g transform="translate(200, 100)">
              <ellipse cx="20" cy="35" rx="25" ry="6" fill="#1F2937" opacity="0.2" />
              <path d="M0 20 L20 15 L40 20 L20 25 Z" fill="#1F2937" />
              <path d="M20 25 L40 20 L40 28 L20 33 Z" fill="#374151" />
              <rect x="38" y="20" width="2" height="15" fill="#6B7280" rx="1" />
              <circle cx="39" cy="37" r="3" fill="#FCD34D" />
            </g>
          </svg>
        </motion.div>
      </div>

      {/* Right Side - Clean Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-white dark:bg-slate-950"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center shadow-lg">
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
