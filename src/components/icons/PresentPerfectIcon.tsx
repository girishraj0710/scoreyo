import React from 'react';

interface IconProps {
  className?: string;
}

export const PresentPerfectIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Present Perfect"
    >
      <defs>
        <linearGradient id="pp-past-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a8a29e" />
          <stop offset="100%" stopColor="#57534e" />
        </linearGradient>
        <linearGradient id="pp-present-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="pp-bridge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78716c" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <radialGradient id="pp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0" />
        </radialGradient>
        <filter id="pp-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      <circle cx="32" cy="32" r="26" fill="url(#pp-glow)" />

      <g filter="url(#pp-shadow)">
        {/* Past block (left, top+front+side faces) */}
        <rect x="6" y="34" width="16" height="16" fill="url(#pp-past-gradient)" />
        <path d="M 6 34 L 10 30 L 26 30 L 22 34 Z" fill="#78716c" />
        <path d="M 22 34 L 26 30 L 26 46 L 22 50 Z" fill="#44403c" />

        {/* Present block (right, top+front+side faces, taller) */}
        <rect x="42" y="26" width="16" height="24" fill="url(#pp-present-gradient)" />
        <path d="M 42 26 L 46 22 L 62 22 L 58 26 Z" fill="#6ee7b7" />
        <path d="M 58 26 L 62 22 L 62 46 L 58 50 Z" fill="#065f46" />

        {/* Bridge deck connecting both */}
        <path d="M 22 38 L 42 32 L 42 36 L 22 42 Z" fill="url(#pp-bridge-gradient)" />

        {/* Suspension cables */}
        <path d="M 26 30 Q 32 20 46 22" stroke="#a7f3d0" strokeWidth="1.4" fill="none" opacity="0.8" />
        <path d="M 24 38 L 27 27" stroke="#a7f3d0" strokeWidth="1" opacity="0.7" />
        <path d="M 30 36.5 L 33 25.5" stroke="#a7f3d0" strokeWidth="1" opacity="0.7" />
        <path d="M 36 35 L 39 24" stroke="#a7f3d0" strokeWidth="1" opacity="0.7" />

        {/* Highlight overlays */}
        <path d="M 6 34 L 10 30 L 14 30 L 10 34 Z" fill="#ffffff" opacity="0.25" />
        <path d="M 42 26 L 46 22 L 50 22 L 46 26 Z" fill="#ffffff" opacity="0.3" />
      </g>

      {/* Decorative sparkles */}
      <circle cx="32" cy="14" r="1.1" fill="#a7f3d0" opacity="0.5" />
      <circle cx="14" cy="18" r="0.8" fill="#d6d3d1" opacity="0.4" />
      <circle cx="52" cy="14" r="1" fill="#6ee7b7" opacity="0.5" />
    </svg>
  );
};
