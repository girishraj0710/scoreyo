import React from 'react';

interface IconProps {
  className?: string;
}

export const ReadingStrategiesIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Reading Strategies">
      <defs>
        <linearGradient id="rsPageLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFEDD5" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
        <linearGradient id="rsPageRight" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
        <linearGradient id="rsSpine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <radialGradient id="rsLens" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id="rsRim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
        <linearGradient id="rsHandle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDA4AF" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>
        <filter id="rsShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#000" floodOpacity="0.26" />
        </filter>
      </defs>

      <ellipse cx="32" cy="56" rx="20" ry="3.5" fill="#000" opacity="0.15" />

      <g filter="url(#rsShadow)">
        {/* open book */}
        <polygon points="7,20 30,16 30,47 7,51" fill="url(#rsPageLeft)" />
        <polygon points="57,20 34,16 34,47 57,51" fill="url(#rsPageRight)" />
        <rect x="29" y="14" width="5" height="35" fill="url(#rsSpine)" />

        {/* text lines */}
        <rect x="12" y="25" width="14" height="1.4" rx="0.7" fill="#B91C1C" opacity="0.28" />
        <rect x="12" y="30" width="14" height="1.4" rx="0.7" fill="#B91C1C" opacity="0.28" />
        <rect x="12" y="35" width="11" height="1.4" rx="0.7" fill="#B91C1C" opacity="0.28" />
        <rect x="38" y="25" width="14" height="1.4" rx="0.7" fill="#B91C1C" opacity="0.28" />
        <rect x="38" y="30" width="14" height="1.4" rx="0.7" fill="#B91C1C" opacity="0.28" />

        {/* highlighted line under lens */}
        <rect x="38" y="37" width="13" height="2.2" rx="1.1" fill="#FDE047" opacity="0.85" />

        {/* magnifying glass */}
        <rect x="49" y="44" width="4.5" height="13" rx="2.2" fill="url(#rsHandle)" transform="rotate(38 51.25 50.5)" />
        <circle cx="44" cy="38" r="9.5" fill="url(#rsLens)" stroke="url(#rsRim)" strokeWidth="2.6" />

        {/* highlight on lens */}
        <ellipse cx="41" cy="34" rx="3" ry="2" fill="#FFFFFF" opacity="0.5" />
      </g>

      {/* sparkles */}
      <circle cx="10" cy="12" r="1.2" fill="#FFFFFF" opacity="0.5" />
      <circle cx="56" cy="10" r="1" fill="#FFFFFF" opacity="0.45" />
      <circle cx="6" cy="36" r="0.9" fill="#FFFFFF" opacity="0.4" />
    </svg>
  );
};
