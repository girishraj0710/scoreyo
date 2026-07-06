import React from 'react';

interface IconProps {
  className?: string;
}

export const PastTensesIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Past Tenses"
    >
      <defs>
        <linearGradient id="pt-frame-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a16207" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="pt-glass-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="pt-sand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <radialGradient id="pt-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <filter id="pt-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.35" />
        </filter>
      </defs>

      <ellipse cx="32" cy="56" rx="18" ry="3" fill="#451a03" opacity="0.25" />
      <circle cx="32" cy="30" r="25" fill="url(#pt-glow)" />

      <g filter="url(#pt-shadow)">
        {/* Top cap */}
        <path d="M 16 10 L 48 10 L 48 15 L 16 15 Z" fill="url(#pt-frame-gradient)" rx="2" />
        <rect x="16" y="10" width="32" height="5" rx="2" fill="url(#pt-frame-gradient)" />
        {/* Bottom cap */}
        <rect x="16" y="49" width="32" height="5" rx="2" fill="url(#pt-frame-gradient)" />

        {/* Side posts (3D struts) */}
        <rect x="15" y="12" width="3" height="42" fill="#78350f" />
        <rect x="46" y="12" width="3" height="42" fill="#78350f" />

        {/* Glass body - two triangles forming hourglass */}
        <path
          d="M 20 15 L 44 15 L 33 31 L 33 33 L 44 49 L 20 49 L 31 33 L 31 31 Z"
          fill="url(#pt-glass-gradient)"
          stroke="#92400e"
          strokeWidth="1"
        />

        {/* Sand pooled at bottom */}
        <path
          d="M 22 47 L 42 47 L 38 40 L 26 40 Z"
          fill="url(#pt-sand-gradient)"
        />
        <ellipse cx="32" cy="41" rx="6" ry="1.5" fill="#fde68a" opacity="0.5" />

        {/* Thin trickle from neck (mostly settled) */}
        <rect x="31.3" y="32" width="1.4" height="6" fill="#fbbf24" opacity="0.6" />

        {/* Small residual sand at top (almost empty) */}
        <path d="M 24 17 L 40 17 L 34 26 L 30 26 Z" fill="#d97706" opacity="0.3" />

        {/* Highlight overlay */}
        <path
          d="M 21 16 L 27 16 L 24 30 L 21 30 Z"
          fill="#ffffff"
          opacity="0.2"
        />
      </g>

      {/* Decorative sparkles */}
      <circle cx="10" cy="20" r="1.2" fill="#fbbf24" opacity="0.5" />
      <circle cx="54" cy="46" r="1" fill="#f59e0b" opacity="0.4" />
      <circle cx="53" cy="18" r="0.9" fill="#fde68a" opacity="0.5" />
    </svg>
  );
};
