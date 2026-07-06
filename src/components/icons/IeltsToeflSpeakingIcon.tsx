import React from 'react';

interface IconProps {
  className?: string;
}

export const IeltsToeflSpeakingIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="IELTS TOEFL Speaking"
    >
      <defs>
        {/* Gradient for microphone */}
        <linearGradient id="speaking-mic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        {/* Gradient for podium */}
        <linearGradient id="speaking-podium-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="speaking-podium-top" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        {/* Gradient for star rating */}
        <radialGradient id="speaking-star-gradient" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>

        <linearGradient id="speaking-mic-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.2" />
        </linearGradient>

        {/* Shadow filters */}
        <filter id="speaking-mic-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
        <filter id="speaking-podium-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
        </filter>
        <filter id="speaking-star-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="30" cy="28" r="24" fill="#fee2e2" opacity="0.3" />

      {/* 3D Podium (isometric box) */}
      <g filter="url(#speaking-podium-shadow)">
        {/* Front face */}
        <path d="M 12 44 L 40 44 L 36 58 L 16 58 Z" fill="url(#speaking-podium-gradient)" />
        {/* Side face */}
        <path d="M 40 44 L 47 40 L 43 54 L 36 58 Z" fill="#334155" />
        {/* Top face */}
        <path d="M 12 44 L 19 40 L 47 40 L 40 44 Z" fill="url(#speaking-podium-top)" />
        {/* Top highlight */}
        <path d="M 12 44 L 19 40 L 47 40 L 40 44 Z" fill="#ffffff" opacity="0.15" />
        {/* Panel line details on front */}
        <rect x="20" y="48" width="12" height="1.2" rx="0.6" fill="#e2e8f0" opacity="0.5" />
        <rect x="19" y="52" width="14" height="1.2" rx="0.6" fill="#e2e8f0" opacity="0.4" />
      </g>

      {/* Microphone on podium */}
      <g filter="url(#speaking-mic-shadow)">
        {/* Mic stand */}
        <rect x="28.5" y="36" width="2" height="10" rx="1" fill="#64748b" />
        {/* Mic head (3D capsule) */}
        <rect x="23" y="14" width="14" height="24" rx="7" fill="url(#speaking-mic-gradient)" />
        <rect x="23" y="14" width="14" height="24" rx="7" fill="url(#speaking-mic-highlight)" />
        {/* Mic grille lines */}
        <rect x="25" y="19" width="10" height="1" rx="0.5" fill="#7f1d1d" opacity="0.5" />
        <rect x="25" y="23" width="10" height="1" rx="0.5" fill="#7f1d1d" opacity="0.5" />
        <rect x="25" y="27" width="10" height="1" rx="0.5" fill="#7f1d1d" opacity="0.5" />
        {/* Mic clip / cage */}
        <path d="M 20 26 A 10 10 0 0 0 40 26" stroke="#475569" strokeWidth="1.6" fill="none" />
        {/* Highlight streak */}
        <rect x="25" y="16" width="2.5" height="18" rx="1.2" fill="#ffffff" opacity="0.3" />
      </g>

      {/* Rating star badge */}
      <g filter="url(#speaking-star-shadow)">
        <circle cx="50" cy="20" r="9" fill="url(#speaking-star-gradient)" />
        <path
          d="M 50 15 L 51.3 18.2 L 54.7 18.5 L 52.1 20.7 L 52.9 24 L 50 22.2 L 47.1 24 L 47.9 20.7 L 45.3 18.5 L 48.7 18.2 Z"
          fill="#fffbeb"
        />
      </g>

      {/* Decorative sparkles */}
      <g opacity="0.5">
        <circle cx="8" cy="16" r="1" fill="#f87171" />
        <circle cx="56" cy="52" r="0.9" fill="#fde68a" />
        <circle cx="8" cy="52" r="0.8" fill="#94a3b8" />
      </g>
    </svg>
  );
};
