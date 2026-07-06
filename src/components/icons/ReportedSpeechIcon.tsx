import React from 'react';

interface IconProps {
  className?: string;
}

export const ReportedSpeechIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Reported Speech"
    >
      <defs>
        <linearGradient id="rs-bubble1-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="rs-bubble2-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="rs-arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <radialGradient id="rs-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
        <filter id="rs-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      <circle cx="32" cy="32" r="26" fill="url(#rs-glow)" />

      {/* Second (reported) bubble - back, offset */}
      <g filter="url(#rs-shadow)">
        <path
          d="M 34 30 Q 34 22 42 22 L 54 22 Q 62 22 62 30 L 62 36 Q 62 44 54 44 L 50 44 L 46 50 L 47 44 L 42 44 Q 34 44 34 36 Z"
          fill="url(#rs-bubble2-gradient)"
        />
        {/* Quote marks inside second bubble */}
        <path d="M 42 30 Q 40 30 40 33 L 40 35 L 43 35 L 43 30 Z" fill="#e2e8f0" opacity="0.85" />
        <path d="M 48 30 Q 46 30 46 33 L 46 35 L 49 35 L 49 30 Z" fill="#e2e8f0" opacity="0.85" />
        <path d="M 34 30 Q 34 22 42 22 L 46 22 L 44 26 L 42 26 Q 38 26 38 30 Z" fill="#ffffff" opacity="0.15" />
      </g>

      {/* Transformation arrow */}
      <path d="M 24 34 L 36 32" stroke="url(#rs-arrow-gradient)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 32 28 L 38 32 L 32 36" fill="none" stroke="url(#rs-arrow-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* First (original) bubble - front */}
      <g filter="url(#rs-shadow)">
        <path
          d="M 2 22 Q 2 14 10 14 L 22 14 Q 30 14 30 22 L 30 28 Q 30 36 22 36 L 18 36 L 14 42 L 15 36 L 10 36 Q 2 36 2 28 Z"
          fill="url(#rs-bubble1-gradient)"
        />
        {/* Direct quote marks */}
        <path d="M 10 22 Q 8 22 8 25 L 8 27 L 11 27 L 11 22 Z" fill="#f0f9ff" opacity="0.9" />
        <path d="M 16 22 Q 14 22 14 25 L 14 27 L 17 27 L 17 22 Z" fill="#f0f9ff" opacity="0.9" />

        {/* Highlight overlay */}
        <path d="M 2 22 Q 2 14 10 14 L 14 14 L 11 20 L 8 20 Q 5 20 5 24 Z" fill="#ffffff" opacity="0.3" />
      </g>

      {/* Decorative sparkles */}
      <circle cx="8" cy="48" r="1" fill="#7dd3fc" opacity="0.5" />
      <circle cx="58" cy="12" r="0.9" fill="#94a3b8" opacity="0.5" />
      <circle cx="56" cy="52" r="1.1" fill="#38bdf8" opacity="0.4" />
    </svg>
  );
};
