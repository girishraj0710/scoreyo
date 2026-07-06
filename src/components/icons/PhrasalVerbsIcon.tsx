import React from 'react';

interface IconProps {
  className?: string;
}

export const PhrasalVerbsIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Phrasal Verbs"
    >
      <defs>
        <linearGradient id="rocket-body-top" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="rocket-body-side" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="rocket-booster" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="rocket-flame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.2" />
        </linearGradient>
        <filter id="rocket-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.35" />
        </filter>
      </defs>

      <ellipse cx="32" cy="58" rx="14" ry="3" fill="#7c2d12" opacity="0.2" />

      {/* Flame plume */}
      <path d="M 27 46 L 32 60 L 37 46 Z" fill="url(#rocket-flame)" opacity="0.9" />
      <path d="M 29 46 L 32 56 L 35 46 Z" fill="#fef9c3" opacity="0.7" />

      {/* Booster fins (combining piece 2) */}
      <g filter="url(#rocket-shadow)">
        <path d="M 22 34 L 27 30 L 27 44 L 20 46 Z" fill="url(#rocket-booster)" />
        <path d="M 42 34 L 37 30 L 37 44 L 44 46 Z" fill="url(#rocket-booster)" opacity="0.85" />
      </g>

      {/* Rocket body (combining piece 1) */}
      <g filter="url(#rocket-shadow)">
        <path d="M 32 6 L 40 20 L 40 42 L 24 42 L 24 20 Z" fill="url(#rocket-body-top)" />
        <path d="M 32 6 L 40 20 L 32 22 L 26 20 Z" fill="#f1f5f9" />
        <path d="M 32 22 L 40 20 L 40 42 L 32 44 Z" fill="url(#rocket-body-side)" opacity="0.7" />
        {/* window - the joining point of the two words */}
        <circle cx="32" cy="27" r="4.5" fill="#38bdf8" />
        <circle cx="32" cy="27" r="4.5" fill="none" stroke="#e2e8f0" strokeWidth="1.4" />
        <circle cx="30.5" cy="25.5" r="1.4" fill="#ffffff" opacity="0.7" />
      </g>

      {/* Highlight overlay */}
      <path d="M 32 6 L 36 13 L 32 15 L 28 13 Z" fill="#ffffff" opacity="0.3" />

      {/* Sparkles */}
      <g opacity="0.55">
        <circle cx="12" cy="14" r="1" fill="#fde047" />
        <circle cx="52" cy="18" r="1.1" fill="#f87171" />
        <circle cx="14" cy="40" r="0.8" fill="#e2e8f0" />
        <circle cx="50" cy="38" r="0.9" fill="#fb923c" />
      </g>
    </svg>
  );
};
