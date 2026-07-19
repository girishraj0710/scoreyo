"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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

        {/* Floating Badges */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute top-32 left-12 bg-white/10 backdrop-blur-md rounded-xl shadow-xl px-4 py-3 border border-white/20"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold text-white">10K+ Students</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="absolute bottom-32 left-12 bg-yellow-400/20 backdrop-blur-md rounded-xl shadow-xl px-4 py-3 border border-yellow-400/30"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span className="text-sm font-semibold text-white">Top Rated</span>
          </div>
        </motion.div>

        {/* Large Colorful 3D Illustration - Bottom Right of Left Panel */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Glow Effects */}
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <linearGradient id="bookGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B9D" />
                  <stop offset="100%" stopColor="#C44569" />
                </linearGradient>
                <linearGradient id="bookGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFA502" />
                  <stop offset="100%" stopColor="#FF6348" />
                </linearGradient>
                <linearGradient id="bookGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFC312" />
                  <stop offset="100%" stopColor="#F79F1F" />
                </linearGradient>
                <linearGradient id="tabletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6C5CE7" />
                  <stop offset="100%" stopColor="#A29BFE" />
                </linearGradient>
              </defs>

              {/* Large Tablet/Device - Center */}
              <g transform="translate(150, 250)">
                {/* Shadow */}
                <rect x="10" y="310" width="300" height="20" rx="10" fill="#000000" opacity="0.2" />

                {/* Tablet body */}
                <rect x="0" y="0" width="300" height="280" rx="20" fill="url(#tabletGradient)" />
                <rect x="0" y="0" width="300" height="280" rx="20" fill="#000000" opacity="0.1" />

                {/* Screen bezel */}
                <rect x="15" y="15" width="270" height="250" rx="12" fill="#1A1A2E" />

                {/* Screen content */}
                <rect x="25" y="25" width="250" height="230" rx="8" fill="#16213E" />

                {/* Quiz interface on screen */}
                <g opacity="0.9">
                  {/* Question card */}
                  <rect x="40" y="45" width="220" height="80" rx="8" fill="#0F3460" />
                  <rect x="50" y="55" width="150" height="8" rx="4" fill="#E94560" opacity="0.8" />
                  <rect x="50" y="70" width="180" height="6" rx="3" fill="#E94560" opacity="0.5" />
                  <rect x="50" y="82" width="160" height="6" rx="3" fill="#E94560" opacity="0.5" />

                  {/* Options */}
                  <rect x="40" y="140" width="220" height="35" rx="8" fill="#FFC312" opacity="0.2" stroke="#FFC312" strokeWidth="2" />
                  <rect x="40" y="185" width="220" height="35" rx="8" fill="#0F3460" stroke="#533483" strokeWidth="1" />
                  <rect x="40" y="230" width="220" height="35" rx="8" fill="#0F3460" stroke="#533483" strokeWidth="1" />
                </g>

                {/* Home button */}
                <circle cx="150" cy="295" r="8" fill="#0F3460" opacity="0.3" />
              </g>

              {/* Large Book Stack - Left Side */}
              <g transform="translate(50, 380)">
                {/* Bottom Book - Pink Gradient */}
                <g>
                  <rect x="5" y="85" width="180" height="15" rx="3" fill="#000000" opacity="0.15" />
                  <path d="M0 20 L180 10 L180 80 L0 90 Z" fill="url(#bookGradient1)" />
                  <path d="M0 20 L180 10 L195 20 L15 30 Z" fill="#FF8FA3" opacity="0.9" />
                  <rect x="0" y="20" width="15" height="70" fill="#C44569" />
                  {/* Book details */}
                  <rect x="20" y="35" width="3" height="50" fill="#FFFFFF" opacity="0.3" />
                </g>

                {/* Middle Book - Orange Gradient */}
                <g transform="translate(10, -35)">
                  <path d="M0 20 L160 15 L160 75 L0 80 Z" fill="url(#bookGradient2)" />
                  <path d="M0 20 L160 15 L172 23 L12 28 Z" fill="#FFB142" opacity="0.9" />
                  <rect x="0" y="20" width="12" height="60" fill="#FF6348" />
                </g>

                {/* Top Book - Yellow Gradient */}
                <g transform="translate(15, -65)">
                  <path d="M0 20 L150 18 L150 68 L0 70 Z" fill="url(#bookGradient3)" />
                  <path d="M0 20 L150 18 L160 24 L10 26 Z" fill="#FFD32A" opacity="0.9" />
                  <rect x="0" y="20" width="10" height="50" fill="#EE5A6F" />
                </g>
              </g>

              {/* Floating Notebook - Top Left */}
              <g transform="translate(80, 150)">
                <rect x="3" y="3" width="100" height="130" rx="6" fill="#000000" opacity="0.15" />
                <rect x="0" y="0" width="100" height="130" rx="6" fill="#74B9FF" />
                <rect x="0" y="0" width="15" height="130" rx="6" fill="#0984E3" />
                {/* Spiral binding */}
                <circle cx="12" cy="20" r="3" fill="#FFFFFF" opacity="0.4" />
                <circle cx="12" cy="40" r="3" fill="#FFFFFF" opacity="0.4" />
                <circle cx="12" cy="60" r="3" fill="#FFFFFF" opacity="0.4" />
                <circle cx="12" cy="80" r="3" fill="#FFFFFF" opacity="0.4" />
                <circle cx="12" cy="100" r="3" fill="#FFFFFF" opacity="0.4" />
                {/* Lines */}
                <line x1="25" y1="30" x2="85" y2="30" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
                <line x1="25" y1="45" x2="85" y2="45" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
                <line x1="25" y1="60" x2="85" y2="60" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
                <line x1="25" y1="75" x2="85" y2="75" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
              </g>

              {/* Graduation Cap - Top Right */}
              <g transform="translate(420, 120)">
                <ellipse cx="60" cy="110" rx="50" ry="12" fill="#000000" opacity="0.15" />
                <path d="M60 50 L120 58 L60 66 L0 58 Z" fill="#2C3E50" />
                <path d="M60 50 L120 58 L120 63 L60 71 Z" fill="#34495E" />
                <circle cx="60" cy="50" r="12" fill="#2C3E50" />
                <line x1="60" y1="50" x2="60" y2="85" stroke="#FFC312" strokeWidth="3" />
                <circle cx="60" cy="88" r="6" fill="#F79F1F" />
                <path d="M57 90 L63 90 L60 95 Z" fill="#F79F1F" />
              </g>

              {/* Large Pen - Right Side */}
              <g transform="translate(480, 340)">
                <rect x="3" y="3" width="18" height="160" rx="9" fill="#000000" opacity="0.15" />
                <rect x="0" y="0" width="18" height="160" rx="9" fill="#A29BFE" />
                <rect x="0" y="0" width="18" height="40" rx="9" fill="#6C5CE7" />
                <circle cx="9" cy="20" r="4" fill="#FFFFFF" opacity="0.4" />
                <path d="M0 160 L9 175 L18 160 Z" fill="#2C3E50" />
              </g>

              {/* Colorful Sparkles */}
              <g opacity="0.8" filter="url(#glow)">
                <path d="M520 220 L524 232 L536 236 L524 240 L520 252 L516 240 L504 236 L516 232 Z" fill="#FFC312" />
                <path d="M120 320 L123 328 L131 331 L123 334 L120 342 L117 334 L109 331 L117 328 Z" fill="#FF6B9D" />
                <path d="M480 460 L484 472 L496 476 L484 480 L480 492 L476 480 L464 476 L476 472 Z" fill="#74B9FF" />
                <path d="M200 120 L202 126 L208 128 L202 130 L200 136 L198 130 L192 128 L198 126 Z" fill="#A29BFE" />
                <path d="M380 180 L382 185 L387 187 L382 189 L380 194 L378 189 L373 187 L378 185 Z" fill="#FFA502" />
              </g>

              {/* Floating circles for depth */}
              <circle cx="550" cy="480" r="30" fill="#FFD32A" opacity="0.15" />
              <circle cx="100" cy="480" r="40" fill="#FF6B9D" opacity="0.1" />
              <circle cx="500" cy="280" r="25" fill="#74B9FF" opacity="0.12" />
            </svg>
          </motion.div>
        </div>
      </motion.div>


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
