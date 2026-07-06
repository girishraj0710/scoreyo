import React from 'react';

interface IconProps {
  className?: string;
}

export const ScrollOwlIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Idioms and Proverbs">
      <defs>
        <linearGradient id="ip-parchment" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF3D6" />
          <stop offset="100%" stopColor="#E8C77E" />
        </linearGradient>
        <linearGradient id="ip-rollLight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D9A34A" />
          <stop offset="100%" stopColor="#A9702B" />
        </linearGradient>
        <linearGradient id="ip-rollDark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8C5A24" />
          <stop offset="100%" stopColor="#5C3A14" />
        </linearGradient>
        <linearGradient id="ip-owl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="100%" stopColor="#4E342E" />
        </linearGradient>
        <radialGradient id="ip-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9DB" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#63E6BE" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#63E6BE" stopOpacity="0" />
        </radialGradient>
        <filter id="ip-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#3E2412" floodOpacity="0.35" />
        </filter>
      </defs>

      <ellipse cx="32" cy="56" rx="22" ry="3.6" fill="#3E2412" opacity="0.2" />

      <circle cx="43" cy="14" r="10" fill="url(#ip-glow)" />
      <path d="M43 6 L44.3 11.5 L50 12.5 L44.9 15.6 L46 21 L43 17.6 L40 21 L41.1 15.6 L36 12.5 L41.7 11.5 Z" fill="#FFE066" opacity="0.9" />

      <g filter="url(#ip-shadow)">
        <rect x="12" y="26" width="36" height="20" fill="url(#ip-parchment)" />
        <ellipse cx="12" cy="36" rx="4.5" ry="10" fill="url(#ip-rollDark)" />
        <ellipse cx="10.5" cy="36" rx="3.2" ry="9" fill="url(#ip-rollLight)" />
        <ellipse cx="48" cy="36" rx="4.5" ry="10" fill="url(#ip-rollDark)" />
        <ellipse cx="49.5" cy="36" rx="3.2" ry="9" fill="url(#ip-rollLight)" />
        <line x1="17" y1="30" x2="43" y2="30" stroke="#A9702B" strokeWidth="1" opacity="0.5" />
        <line x1="17" y1="34" x2="43" y2="34" stroke="#A9702B" strokeWidth="1" opacity="0.4" />
        <line x1="17" y1="38" x2="38" y2="38" stroke="#A9702B" strokeWidth="1" opacity="0.4" />

        <g transform="translate(22,10)">
          <ellipse cx="8" cy="16" rx="9" ry="10" fill="url(#ip-owl)" />
          <path d="M2 8 L5 2 L8 8 Z" fill="#4E342E" />
          <path d="M14 8 L11 2 L8 8 Z" fill="#4E342E" />
          <circle cx="4.5" cy="14" r="3.4" fill="#FFF3D6" />
          <circle cx="11.5" cy="14" r="3.4" fill="#FFF3D6" />
          <circle cx="4.5" cy="14" r="1.7" fill="#2B1B12" />
          <circle cx="11.5" cy="14" r="1.7" fill="#2B1B12" />
          <path d="M7 17 L9 17 L8 19 Z" fill="#F08C00" />
          <ellipse cx="8" cy="23" rx="5" ry="4" fill="#6D4C41" opacity="0.6" />
        </g>
      </g>

      <rect x="12" y="26" width="36" height="4" fill="#FFFFFF" opacity="0.25" />

      <circle cx="8" cy="18" r="1.2" fill="#FFF3D6" opacity="0.7" />
      <circle cx="56" cy="30" r="1" fill="#FFE066" opacity="0.6" />
      <circle cx="14" cy="50" r="0.9" fill="#E8C77E" opacity="0.6" />
    </svg>
  );
};
