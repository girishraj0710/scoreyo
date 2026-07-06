import React from 'react';

interface IconProps {
  className?: string;
}

export const PastHabitsIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Past Habits (Used to / Would)"
    >
      <defs>
        <linearGradient id="ph-frame-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="ph-photo-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
        <linearGradient id="ph-arrow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <radialGradient id="ph-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <filter id="ph-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      <circle cx="32" cy="32" r="26" fill="url(#ph-glow)" />

      {/* Repeating circular arrows around the frame */}
      <g filter="url(#ph-shadow)">
        <path
          d="M 32 8 A 22 22 0 1 1 12 22"
          stroke="url(#ph-arrow-gradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M 8 26 L 12 22 L 17 27 Z" fill="url(#ph-arrow-gradient)" />

        <path
          d="M 32 56 A 22 22 0 1 1 52 42"
          stroke="url(#ph-arrow-gradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path d="M 56 38 L 52 42 L 47 37 Z" fill="url(#ph-arrow-gradient)" opacity="0.85" />
      </g>

      {/* 3D easel legs */}
      <path d="M 24 52 L 18 60" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 40 52 L 46 60" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 32 50 L 32 58" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />

      {/* Photo frame (3D layered) */}
      <g filter="url(#ph-shadow)">
        <rect x="18" y="14" width="28" height="36" rx="3" fill="url(#ph-frame-gradient)" />
        <path d="M 18 14 L 22 10 L 50 10 L 46 14 Z" fill="#fde68a" opacity="0.8" />
        <path d="M 46 14 L 50 10 L 50 46 L 46 50 Z" fill="#92400e" opacity="0.7" />

        {/* Inner photo */}
        <rect x="22" y="18" width="20" height="28" rx="1" fill="url(#ph-photo-gradient)" />

        {/* Simple nostalgic scene inside photo - sun and hills */}
        <circle cx="32" cy="26" r="4" fill="#fef3c7" opacity="0.9" />
        <path d="M 22 40 Q 27 32 32 38 Q 37 32 42 40 L 42 46 L 22 46 Z" fill="#f43f5e" opacity="0.5" />

        {/* Highlight overlay */}
        <rect x="18" y="14" width="28" height="36" rx="3" fill="#ffffff" opacity="0.08" />
        <path d="M 19 15 L 24 15 L 21 30 L 19 30 Z" fill="#ffffff" opacity="0.25" />
      </g>

      {/* Decorative sparkles */}
      <circle cx="10" cy="48" r="1" fill="#fbbf24" opacity="0.5" />
      <circle cx="54" cy="16" r="1.1" fill="#fda4af" opacity="0.5" />
      <circle cx="56" cy="52" r="0.8" fill="#fecdd3" opacity="0.5" />
    </svg>
  );
};
