import React from 'react';

interface IconProps {
  className?: string;
}

export const EssentialVocabularyIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Essential 1500 Words">
      <defs>
        <linearGradient id="evChestBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="evChestLid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="evChestSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        <radialGradient id="evGemGold" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        <radialGradient id="evGemRuby" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FCA5A5" />
          <stop offset="100%" stopColor="#B91C1C" />
        </radialGradient>
        <filter id="evShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#000" floodOpacity="0.28" />
        </filter>
      </defs>

      <ellipse cx="30" cy="55" rx="20" ry="4" fill="#000" opacity="0.15" />

      <g filter="url(#evShadow)">
        {/* lid open, tilted back */}
        <path d="M10,32 L16,12 Q32,6 48,12 L54,32 Z" fill="url(#evChestLid)" />
        <polygon points="48,12 54,8 60,28 54,32" fill="url(#evChestSide)" opacity="0.9" />

        {/* gems spilling out of the opening */}
        <polygon points="22,11 27,16 22,21 17,16" fill="url(#evGemGold)" transform="rotate(-10 22 16)" />
        <polygon points="34,4 38,8 34,12 30,8" fill="url(#evGemRuby)" transform="rotate(8 34 8)" />
        <polygon points="42,10 46.5,14.5 42,19 37.5,14.5" fill="url(#evGemGold)" transform="rotate(14 42 14.5)" />
        <rect x="16" y="16" width="8" height="8" rx="1.5" fill="#FDE68A" transform="rotate(-16 20 20)" />
        <rect x="36" y="14" width="7" height="7" rx="1.5" fill="#FBBF24" transform="rotate(18 39.5 17.5)" />

        {/* chest base */}
        <rect x="10" y="32" width="38" height="18" rx="3" fill="url(#evChestBody)" />
        <polygon points="48,32 54,28 54,46 48,50" fill="url(#evChestSide)" />

        {/* hinge trim band */}
        <rect x="10" y="30" width="38" height="4" fill="url(#evChestLid)" opacity="0.9" />

        {/* lock plate */}
        <rect x="25" y="38" width="10" height="7" rx="1.5" fill="#FDE68A" opacity="0.95" />
        <circle cx="30" cy="41.5" r="1.6" fill="#78350F" />

        {/* highlight overlay */}
        <ellipse cx="18" cy="37" rx="9" ry="3.5" fill="#FFFFFF" opacity="0.16" />
      </g>

      {/* sparkles */}
      <circle cx="8" cy="22" r="1.3" fill="#FFFFFF" opacity="0.5" />
      <circle cx="58" cy="20" r="1" fill="#FFFFFF" opacity="0.4" />
      <circle cx="12" cy="6" r="1" fill="#FFFFFF" opacity="0.5" />
      <circle cx="50" cy="4" r="0.8" fill="#FFFFFF" opacity="0.45" />
    </svg>
  );
};
