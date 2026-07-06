import React from 'react';

interface IconProps {
  className?: string;
}

export const IeltsToeflListeningIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="IELTS TOEFL Listening"
    >
      <defs>
        {/* Gradient for headphone band */}
        <linearGradient id="listening-band-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Gradient for ear cups */}
        <radialGradient id="listening-cup-gradient" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0284c7" />
        </radialGradient>

        {/* Gradient for timer ring */}
        <linearGradient id="listening-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>

        <linearGradient id="listening-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#075985" stopOpacity="0.2" />
        </linearGradient>

        {/* Shadow filters */}
        <filter id="listening-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
        </filter>
        <filter id="listening-ring-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="32" cy="32" r="26" fill="#e0f2fe" opacity="0.35" />

      {/* Timer ring around headphones */}
      <g filter="url(#listening-ring-shadow)">
        <circle cx="32" cy="34" r="24" fill="none" stroke="url(#listening-ring-gradient)" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.85" />
        {/* Timer tick marker */}
        <circle cx="32" cy="10" r="2.2" fill="url(#listening-ring-gradient)" />
        <circle cx="32" cy="10" r="0.9" fill="#ffedd5" />
      </g>

      {/* 3D Headphones */}
      <g filter="url(#listening-shadow)">
        {/* Headband arc (3D tube look) */}
        <path
          d="M 14 34 A 18 18 0 0 1 50 34"
          stroke="url(#listening-band-gradient)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 14 34 A 18 18 0 0 1 50 34"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />

        {/* Left ear cup */}
        <rect x="9" y="32" width="11" height="16" rx="5" fill="url(#listening-cup-gradient)" />
        <rect x="9" y="32" width="11" height="16" rx="5" fill="url(#listening-highlight)" />
        <rect x="12" y="36" width="5" height="8" rx="2.5" fill="#082f49" opacity="0.5" />

        {/* Right ear cup */}
        <rect x="44" y="32" width="11" height="16" rx="5" fill="url(#listening-cup-gradient)" />
        <rect x="44" y="32" width="11" height="16" rx="5" fill="url(#listening-highlight)" />
        <rect x="47" y="36" width="5" height="8" rx="2.5" fill="#082f49" opacity="0.5" />

        {/* Sound wave lines from right cup */}
        <path d="M 58 37 Q 61 40 58 43" stroke="#0369a1" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M 60 34 Q 65 40 60 46" stroke="#0369a1" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.4" />
      </g>

      {/* Decorative sparkles */}
      <g opacity="0.5">
        <circle cx="10" cy="18" r="1" fill="#38bdf8" />
        <circle cx="54" cy="18" r="0.9" fill="#fb923c" />
        <circle cx="32" cy="54" r="0.8" fill="#7dd3fc" />
      </g>
    </svg>
  );
};
