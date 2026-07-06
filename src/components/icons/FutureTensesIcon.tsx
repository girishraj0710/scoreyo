import React from 'react';

interface IconProps {
  className?: string;
}

export const FutureTensesIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Future Tenses"
    >
      <defs>
        <linearGradient id="ft-body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
        <linearGradient id="ft-nose-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <linearGradient id="ft-flame-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="60%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ft-sky-glow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#312e81" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#312e81" stopOpacity="0" />
        </radialGradient>
        <filter id="ft-shadow">
          <feDropShadow dx="1" dy="3" stdDeviation="3" floodOpacity="0.35" />
        </filter>
      </defs>

      <circle cx="34" cy="26" r="27" fill="url(#ft-sky-glow)" />

      {/* Stars */}
      <g opacity="0.8">
        <path d="M 12 12 L 13 15 L 16 16 L 13 17 L 12 20 L 11 17 L 8 16 L 11 15 Z" fill="#e0e7ff" />
        <circle cx="50" cy="10" r="1.3" fill="#e0e7ff" />
        <circle cx="55" cy="22" r="0.9" fill="#c7d2fe" />
        <circle cx="8" cy="32" r="1" fill="#c7d2fe" />
      </g>

      <g filter="url(#ft-shadow)" transform="rotate(-20 32 34)">
        {/* Exhaust flame */}
        <path
          d="M 27 46 L 37 46 L 34 58 L 32 62 L 30 58 Z"
          fill="url(#ft-flame-gradient)"
        />

        {/* Fins (3D side faces) */}
        <path d="M 24 40 L 27 46 L 27 34 Z" fill="#3730a3" />
        <path d="M 40 40 L 37 46 L 37 34 Z" fill="#6366f1" />

        {/* Rocket body */}
        <rect x="27" y="22" width="10" height="26" rx="3" fill="url(#ft-body-gradient)" />

        {/* Nose cone */}
        <path d="M 27 22 L 32 8 L 37 22 Z" fill="url(#ft-nose-gradient)" />

        {/* Window */}
        <circle cx="32" cy="28" r="3" fill="#a5f3fc" opacity="0.9" />
        <circle cx="32" cy="28" r="3" fill="none" stroke="#0e7490" strokeWidth="0.7" />

        {/* Body stripe */}
        <rect x="27" y="38" width="10" height="2.5" fill="#c7d2fe" opacity="0.7" />

        {/* Highlight overlay */}
        <path d="M 28 10 L 30 10 L 28 34 L 27 34 Z" fill="#ffffff" opacity="0.3" />
      </g>

      {/* Decorative sparkles */}
      <circle cx="46" cy="48" r="1.1" fill="#fde047" opacity="0.5" />
      <circle cx="18" cy="52" r="0.9" fill="#818cf8" opacity="0.4" />
    </svg>
  );
};
