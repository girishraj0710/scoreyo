import React from 'react';

interface IconProps {
  className?: string;
}

export const SocialTravelEnglishIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Social and Travel English"
    >
      <defs>
        {/* Gradient for globe */}
        <radialGradient id="travel-globe-gradient" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#0f766e" />
        </radialGradient>

        {/* Gradient for ticket */}
        <linearGradient id="travel-ticket-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>

        {/* Gradient for passport */}
        <linearGradient id="travel-passport-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        <linearGradient id="travel-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.2" />
        </linearGradient>

        {/* Shadow filters */}
        <filter id="travel-globe-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
        <filter id="travel-ticket-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
        <filter id="travel-passport-shadow">
          <feDropShadow dx="1" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="32" cy="32" r="26" fill="#ccfbf1" opacity="0.3" />

      {/* 3D Globe */}
      <g filter="url(#travel-globe-shadow)">
        <circle cx="24" cy="22" r="13" fill="url(#travel-globe-gradient)" />
        {/* Latitude lines */}
        <ellipse cx="24" cy="22" rx="13" ry="5" fill="none" stroke="#134e4a" strokeWidth="1" opacity="0.4" />
        <ellipse cx="24" cy="22" rx="13" ry="10" fill="none" stroke="#134e4a" strokeWidth="1" opacity="0.3" />
        {/* Longitude line */}
        <path d="M 24 9 A 6.5 13 0 0 1 24 35" stroke="#134e4a" strokeWidth="1" opacity="0.35" fill="none" />
        {/* Landmasses */}
        <path d="M 18 17 Q 21 15 24 17 Q 22 20 19 20 Z" fill="#0d9488" opacity="0.6" />
        <path d="M 27 25 Q 31 24 32 28 Q 28 30 26 28 Z" fill="#0d9488" opacity="0.6" />
        {/* Highlight */}
        <path d="M 16 14 A 11 11 0 0 1 30 12" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" fill="none" />
      </g>

      {/* 3D Passport (leaning against globe) */}
      <g filter="url(#travel-passport-shadow)">
        <rect x="30" y="30" width="16" height="22" rx="2" fill="url(#travel-passport-gradient)" transform="rotate(-8, 38, 41)" />
        <rect x="30" y="30" width="16" height="22" rx="2" fill="url(#travel-highlight)" transform="rotate(-8, 38, 41)" />
        {/* Passport emblem */}
        <circle cx="38" cy="39" r="3.2" fill="#fde68a" opacity="0.85" transform="rotate(-8, 38, 41)" />
        <rect x="34" y="45" width="8" height="1.3" rx="0.6" fill="#dbeafe" opacity="0.8" transform="rotate(-8, 38, 41)" />
        <rect x="34" y="48" width="6" height="1.3" rx="0.6" fill="#dbeafe" opacity="0.7" transform="rotate(-8, 38, 41)" />
      </g>

      {/* 3D Airplane ticket */}
      <g filter="url(#travel-ticket-shadow)">
        <rect x="14" y="38" width="30" height="14" rx="2" fill="url(#travel-ticket-gradient)" />
        <rect x="14" y="38" width="30" height="14" rx="2" fill="url(#travel-highlight)" />
        {/* Perforated divider */}
        <line x1="34" y1="38" x2="34" y2="52" stroke="#fff1f2" strokeDasharray="1.5 1.5" strokeWidth="1.2" opacity="0.8" />
        {/* Ticket text lines */}
        <rect x="17" y="41" width="12" height="1.3" rx="0.6" fill="#ffffff" opacity="0.9" />
        <rect x="17" y="44" width="9" height="1.1" rx="0.5" fill="#fff1f2" opacity="0.75" />
        <rect x="17" y="47" width="10" height="1.1" rx="0.5" fill="#fff1f2" opacity="0.7" />
        {/* Small plane icon on stub */}
        <path d="M 36 43 L 42 45 L 36 47 L 37.5 45 Z" fill="#ffffff" opacity="0.85" />
      </g>

      {/* Decorative sparkles */}
      <g opacity="0.5">
        <circle cx="52" cy="16" r="1" fill="#5eead4" />
        <circle cx="8" cy="44" r="0.9" fill="#fda4af" />
        <circle cx="48" cy="52" r="0.8" fill="#93c5fd" />
      </g>
    </svg>
  );
};
