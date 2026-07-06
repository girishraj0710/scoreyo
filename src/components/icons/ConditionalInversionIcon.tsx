import React from 'react';

interface IconProps {
  className?: string;
}

export const ConditionalInversionIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Conditional Inversion"
    >
      <defs>
        {/* Gradient for seesaw plank (rose/red) */}
        <linearGradient id="ci-plank-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>

        {/* Gradient for fulcrum/base (deep navy) */}
        <linearGradient id="ci-base-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Gradient for left block (up position - emerald) */}
        <linearGradient id="ci-block-up" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Gradient for right block (down position - violet) */}
        <linearGradient id="ci-block-down" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>

        <linearGradient id="ci-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <filter id="ci-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="32" cy="32" r="28" fill="#fef2f2" opacity="0.3" />

      {/* Fulcrum base (3D triangular prism) */}
      <g filter="url(#ci-shadow)">
        <path d="M 26 56 L 38 56 L 34 42 L 30 42 Z" fill="url(#ci-base-gradient)" />
        <ellipse cx="32" cy="56" rx="9" ry="2.2" fill="#0f172a" />
        <path d="M 32 42 L 40 46 L 32 50 L 24 46 Z" fill="#475569" />
        <path d="M 32 42 L 40 46 L 32 50 L 24 46 Z" fill="url(#ci-highlight)" />
      </g>

      {/* Seesaw plank - tilted to show inversion (flipped word order) */}
      <g filter="url(#ci-shadow)">
        <rect
          x="6"
          y="24"
          width="52"
          height="6"
          rx="3"
          fill="url(#ci-plank-gradient)"
          transform="rotate(-18 32 27)"
        />
        <rect
          x="6"
          y="24"
          width="52"
          height="6"
          rx="3"
          fill="url(#ci-highlight)"
          transform="rotate(-18 32 27)"
        />
      </g>

      {/* Left block - raised up (green, representing inverted clause) */}
      <g filter="url(#ci-shadow)">
        <rect x="4" y="30" width="12" height="12" rx="2.5" fill="url(#ci-block-up)" transform="rotate(-18 10 36)" />
        <rect x="4" y="30" width="12" height="12" rx="2.5" fill="url(#ci-highlight)" transform="rotate(-18 10 36)" />
      </g>

      {/* Right block - lowered down (violet, representing standard clause) */}
      <g filter="url(#ci-shadow)">
        <rect x="48" y="12" width="12" height="12" rx="2.5" fill="url(#ci-block-down)" transform="rotate(-18 54 18)" />
        <rect x="48" y="12" width="12" height="12" rx="2.5" fill="url(#ci-highlight)" transform="rotate(-18 54 18)" />
      </g>

      {/* Curved flip arrow indicating inversion/swap */}
      <path
        d="M 20 12 A 14 14 0 0 1 44 12"
        stroke="#94a3b8"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="3 3"
        opacity="0.7"
      />
      <path d="M 44 12 L 41 9 M 44 12 L 41 15" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* Decorative sparkles */}
      <g opacity="0.5">
        <circle cx="10" cy="52" r="1" fill="#fda4af" />
        <circle cx="58" cy="34" r="1.1" fill="#c4b5fd" />
        <circle cx="16" cy="8" r="0.8" fill="#6ee7b7" />
      </g>
    </svg>
  );
};
