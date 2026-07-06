import React from 'react';

interface IconProps {
  className?: string;
}

export const ScissorsRibbonIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Reduced Relative Clauses">
      <defs>
        <linearGradient id="rrc-ribbonTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFB199" />
          <stop offset="100%" stopColor="#FF6B6B" />
        </linearGradient>
        <linearGradient id="rrc-ribbonFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F03E3E" />
          <stop offset="100%" stopColor="#A61E1E" />
        </linearGradient>
        <linearGradient id="rrc-ribbonSide" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C92A2A" />
          <stop offset="100%" stopColor="#7A1515" />
        </linearGradient>
        <linearGradient id="rrc-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E9ECEF" />
          <stop offset="50%" stopColor="#ADB5BD" />
          <stop offset="100%" stopColor="#495057" />
        </linearGradient>
        <radialGradient id="rrc-handleGold" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#F59F00" />
        </radialGradient>
        <filter id="rrc-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#7A1515" floodOpacity="0.35" />
        </filter>
      </defs>

      <ellipse cx="32" cy="54" rx="22" ry="4" fill="#7A1515" opacity="0.18" />

      <g filter="url(#rrc-shadow)">
        <polygon points="4,30 30,30 36,24 10,24" fill="url(#rrc-ribbonTop)" />
        <rect x="4" y="30" width="26" height="9" fill="url(#rrc-ribbonFront)" />
        <polygon points="30,30 30,39 36,33 36,24" fill="url(#rrc-ribbonSide)" />

        <g transform="rotate(18 46 46)">
          <rect x="40" y="43" width="16" height="6" rx="1" fill="url(#rrc-ribbonTop)" opacity="0.9" />
          <rect x="40" y="43" width="16" height="3" rx="1" fill="#FFD8CC" opacity="0.5" />
        </g>

        <g transform="translate(32,10) rotate(8)">
          <circle cx="4" cy="30" r="6" fill="url(#rrc-handleGold)" stroke="#495057" strokeWidth="1" />
          <circle cx="4" cy="30" r="2.4" fill="#495057" />
          <path d="M6 26 L22 6" stroke="url(#rrc-metal)" strokeWidth="3.6" strokeLinecap="round" />
        </g>
        <g transform="translate(32,10) rotate(-14)">
          <circle cx="4" cy="30" r="6" fill="url(#rrc-handleGold)" stroke="#495057" strokeWidth="1" />
          <circle cx="4" cy="30" r="2.4" fill="#495057" />
          <path d="M6 26 L22 6" stroke="url(#rrc-metal)" strokeWidth="3.6" strokeLinecap="round" />
        </g>
      </g>

      <polygon points="4,30 30,30 30,32 4,32" fill="#FFFFFF" opacity="0.28" />

      <circle cx="12" cy="12" r="1.4" fill="#FFF3BF" opacity="0.7" />
      <circle cx="52" cy="14" r="1" fill="#FFF3BF" opacity="0.6" />
      <circle cx="20" cy="46" r="0.9" fill="#FFE066" opacity="0.5" />
    </svg>
  );
};
