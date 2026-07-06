import React from 'react';

interface IconProps {
  className?: string;
}

export const IdiomsExpressionsIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Idioms and Expressions"
    >
      <defs>
        <linearGradient id="idiom-bubble-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="idiom-bubble-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
        <radialGradient id="idiom-bulb-glow" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="60%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <linearGradient id="idiom-key-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <filter id="idiom-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.35" />
        </filter>
      </defs>

      <ellipse cx="32" cy="56" rx="22" ry="3" fill="#3b0764" opacity="0.2" />

      {/* Speech bubble box (3D) */}
      <g filter="url(#idiom-shadow)">
        <path d="M 10 16 L 44 16 L 44 36 L 24 36 L 18 44 L 18 36 L 10 36 Z" fill="url(#idiom-bubble-top)" />
        <path d="M 10 16 L 44 16 L 42 13 L 12 13 Z" fill="#ddd6fe" opacity="0.6" />
        <path d="M 44 16 L 44 36 L 47 33 L 47 13 Z" fill="url(#idiom-bubble-front)" opacity="0.8" />
      </g>

      {/* Lightbulb inside bubble (hidden meaning revealed) */}
      <g filter="url(#idiom-shadow)">
        <circle cx="27" cy="25" r="7" fill="url(#idiom-bulb-glow)" />
        <rect x="24" y="30" width="6" height="3" rx="1" fill="#a16207" />
        <line x1="25" y1="33" x2="29" y2="33" stroke="#713f12" strokeWidth="1" />
        <circle cx="25" cy="22" r="2" fill="#ffffff" opacity="0.5" />
      </g>

      {/* Key unlocking meaning */}
      <g filter="url(#idiom-shadow)">
        <circle cx="46" cy="46" r="6" fill="none" stroke="url(#idiom-key-gradient)" strokeWidth="3.4" />
        <rect x="50" y="44.5" width="11" height="3" fill="url(#idiom-key-gradient)" />
        <rect x="57" y="47.5" width="2.4" height="3.5" fill="url(#idiom-key-gradient)" />
        <rect x="53" y="47.5" width="2" height="3" fill="url(#idiom-key-gradient)" />
      </g>

      {/* Keyhole being unlocked */}
      <circle cx="18" cy="50" r="3.4" fill="#4c1d95" opacity="0.85" />
      <path d="M 18 51.5 L 16.5 55 L 19.5 55 Z" fill="#4c1d95" opacity="0.85" />

      {/* Highlight overlay */}
      <path d="M 10 16 L 44 16 L 44 20 L 10 20 Z" fill="#ffffff" opacity="0.2" />

      {/* Sparkles */}
      <g opacity="0.6">
        <circle cx="10" cy="10" r="1" fill="#fde047" />
        <circle cx="54" cy="12" r="1.1" fill="#c4b5fd" />
        <circle cx="6" cy="44" r="0.8" fill="#a78bfa" />
      </g>
    </svg>
  );
};
