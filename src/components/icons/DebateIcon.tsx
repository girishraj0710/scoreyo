import React from 'react';

interface IconProps {
  className?: string;
}

export const DebateIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Debate and Discussion"
    >
      <defs>
        {/* Gradients for left speech bubble (pink/rose) */}
        <linearGradient id="bubble-left-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="bubble-left-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#be185d" stopOpacity="0.2" />
        </linearGradient>

        {/* Gradients for right speech bubble (blue) */}
        <linearGradient id="bubble-right-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="bubble-right-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.2" />
        </linearGradient>

        {/* Gradients for arrows */}
        <linearGradient id="arrow-left" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <linearGradient id="arrow-right" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        {/* Shadow filters */}
        <filter id="bubble-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
        <filter id="arrow-shadow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Background gradient circles */}
      <circle cx="20" cy="24" r="22" fill="#fce7f3" opacity="0.3" />
      <circle cx="44" cy="24" r="22" fill="#dbeafe" opacity="0.3" />

      {/* Left speech bubble (pink - opposing view) */}
      <g filter="url(#bubble-shadow)">
        {/* Bubble body */}
        <rect
          x="8"
          y="14"
          width="24"
          height="20"
          rx="4"
          fill="url(#bubble-left-gradient)"
        />

        {/* Bubble highlight overlay */}
        <rect
          x="8"
          y="14"
          width="24"
          height="20"
          rx="4"
          fill="url(#bubble-left-highlight)"
        />

        {/* Bubble tail */}
        <path
          d="M 12 34 L 8 38 L 14 34 Z"
          fill="#ec4899"
        />

        {/* Text lines in bubble */}
        <rect x="12" y="18" width="16" height="1.5" rx="0.5" fill="#ffffff" opacity="0.9" />
        <rect x="12" y="22" width="14" height="1.5" rx="0.5" fill="#ffffff" opacity="0.8" />
        <rect x="12" y="26" width="12" height="1.5" rx="0.5" fill="#ffffff" opacity="0.7" />

        {/* Opposing view icon (minus/dash) */}
        <rect x="14" y="28.5" width="4" height="1" rx="0.5" fill="#fce7f3" opacity="0.8" />
      </g>

      {/* Right speech bubble (blue - supporting view) */}
      <g filter="url(#bubble-shadow)">
        {/* Bubble body */}
        <rect
          x="32"
          y="14"
          width="24"
          height="20"
          rx="4"
          fill="url(#bubble-right-gradient)"
        />

        {/* Bubble highlight overlay */}
        <rect
          x="32"
          y="14"
          width="24"
          height="20"
          rx="4"
          fill="url(#bubble-right-highlight)"
        />

        {/* Bubble tail */}
        <path
          d="M 52 34 L 56 38 L 50 34 Z"
          fill="#3b82f6"
        />

        {/* Text lines in bubble */}
        <rect x="36" y="18" width="16" height="1.5" rx="0.5" fill="#ffffff" opacity="0.9" />
        <rect x="36" y="22" width="14" height="1.5" rx="0.5" fill="#ffffff" opacity="0.8" />
        <rect x="36" y="26" width="12" height="1.5" rx="0.5" fill="#ffffff" opacity="0.7" />

        {/* Supporting view icon (plus) */}
        <rect x="46" y="28.5" width="4" height="1" rx="0.5" fill="#dbeafe" opacity="0.8" />
        <rect x="47.5" y="27" width="1" height="4" rx="0.5" fill="#dbeafe" opacity="0.8" />
      </g>

      {/* Opposing arrows (debate dynamic) */}
      <g filter="url(#arrow-shadow)">
        {/* Left arrow pointing right (pink) */}
        <path
          d="M 12 44 L 26 44 L 26 42 L 30 46 L 26 50 L 26 48 L 12 48 Z"
          fill="url(#arrow-left)"
          opacity="0.85"
        />

        {/* Right arrow pointing left (blue) */}
        <path
          d="M 52 44 L 38 44 L 38 42 L 34 46 L 38 50 L 38 48 L 52 48 Z"
          fill="url(#arrow-right)"
          opacity="0.85"
        />

        {/* Arrow highlights */}
        <path
          d="M 12 44 L 22 44 L 22 46 L 12 46 Z"
          fill="#ffffff"
          opacity="0.25"
        />
        <path
          d="M 52 44 L 42 44 L 42 46 L 52 46 Z"
          fill="#ffffff"
          opacity="0.25"
        />
      </g>

      {/* Central clash effect (where arrows meet) */}
      <g opacity="0.6">
        <circle cx="32" cy="46" r="3" fill="#a855f7" opacity="0.4" />
        <circle cx="32" cy="46" r="2" fill="#c084fc" opacity="0.5" />
        <circle cx="32" cy="46" r="1" fill="#e9d5ff" opacity="0.8" />
      </g>

      {/* Decorative debate sparkles */}
      <g opacity="0.5">
        <circle cx="10" cy="10" r="1" fill="#f472b6" />
        <circle cx="54" cy="10" r="1.2" fill="#60a5fa" />
        <circle cx="6" cy="48" r="0.8" fill="#ec4899" />
        <circle cx="58" cy="48" r="0.8" fill="#3b82f6" />
      </g>

      {/* Exclamation marks for emphasis */}
      <g opacity="0.4">
        {/* Left exclamation */}
        <rect x="6" y="20" width="1" height="4" rx="0.5" fill="#be185d" />
        <circle cx="6.5" cy="25.5" r="0.6" fill="#be185d" />

        {/* Right exclamation */}
        <rect x="57" y="20" width="1" height="4" rx="0.5" fill="#1e40af" />
        <circle cx="57.5" cy="25.5" r="0.6" fill="#1e40af" />
      </g>
    </svg>
  );
};
