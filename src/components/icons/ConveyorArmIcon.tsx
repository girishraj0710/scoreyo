import React from 'react';

interface IconProps {
  className?: string;
}

export const ConveyorArmIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Advanced Passive Structures">
      <defs>
        <linearGradient id="aps-beltTop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#63E6BE" />
          <stop offset="100%" stopColor="#12B886" />
        </linearGradient>
        <linearGradient id="aps-beltFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#495057" />
          <stop offset="100%" stopColor="#212529" />
        </linearGradient>
        <linearGradient id="aps-beltSide" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#343A40" />
          <stop offset="100%" stopColor="#181B1E" />
        </linearGradient>
        <linearGradient id="aps-crate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B2F2BB" />
          <stop offset="100%" stopColor="#2F9E44" />
        </linearGradient>
        <linearGradient id="aps-arm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#99E9F2" />
          <stop offset="50%" stopColor="#3BC9DB" />
          <stop offset="100%" stopColor="#0C8599" />
        </linearGradient>
        <filter id="aps-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#0B3D2E" floodOpacity="0.35" />
        </filter>
      </defs>

      <ellipse cx="32" cy="56" rx="24" ry="3.6" fill="#0B3D2E" opacity="0.2" />

      <g filter="url(#aps-shadow)">
        <polygon points="8,36 48,36 54,30 14,30" fill="url(#aps-beltTop)" />
        <line x1="14" y1="33.2" x2="48" y2="33.2" stroke="#0CA678" strokeWidth="1" opacity="0.6" />
        <line x1="20" y1="30.8" x2="42" y2="36" stroke="#0CA678" strokeWidth="1" opacity="0.4" />
        <line x1="28" y1="30.8" x2="50" y2="36" stroke="#0CA678" strokeWidth="1" opacity="0.4" />

        <rect x="8" y="36" width="40" height="7" fill="url(#aps-beltFront)" />
        <polygon points="48,36 48,43 54,37 54,30" fill="url(#aps-beltSide)" />

        <rect x="12" y="43" width="3" height="8" fill="#343A40" />
        <rect x="42" y="43" width="3" height="8" fill="#343A40" />

        <g>
          <polygon points="24,26 34,26 37,23 27,23" fill="url(#aps-crate)" />
          <rect x="24" y="26" width="10" height="7" fill="#37B24D" />
          <polygon points="34,26 34,33 37,30 37,23" fill="#2B8A3E" />
        </g>

        <rect x="35" y="4" width="5" height="18" rx="1.5" fill="url(#aps-arm)" />
        <rect x="30" y="20" width="15" height="4" rx="1.5" fill="url(#aps-arm)" />
        <rect x="35.5" y="20" width="4" height="7" fill="#0C8599" />
        <rect x="32" y="26" width="10" height="3" rx="1" fill="#0B7285" />
      </g>

      <polygon points="8,36 48,36 48,37.5 8,37.5" fill="#FFFFFF" opacity="0.15" />
      <rect x="35" y="4" width="2" height="18" fill="#FFFFFF" opacity="0.3" />

      <circle cx="54" cy="16" r="1.3" fill="#B2F2BB" opacity="0.7" />
      <circle cx="10" cy="14" r="1" fill="#99E9F2" opacity="0.6" />
      <circle cx="18" cy="52" r="0.9" fill="#63E6BE" opacity="0.5" />
    </svg>
  );
};
