import React from 'react';

interface IconProps {
  className?: string;
}

export const WorkplaceCommunicationIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Workplace Communication"
    >
      <defs>
        {/* Gradient for desk */}
        <linearGradient id="workplace-desk-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="workplace-desk-top" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {/* Gradient for envelope */}
        <linearGradient id="workplace-envelope-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>

        {/* Gradient for handshake badge */}
        <radialGradient id="workplace-handshake-gradient" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#047857" />
        </radialGradient>

        {/* Shadow filters */}
        <filter id="workplace-desk-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
        </filter>
        <filter id="workplace-envelope-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
        <filter id="workplace-badge-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="32" cy="30" r="26" fill="#ede9fe" opacity="0.3" />

      {/* 3D Office desk (isometric) */}
      <g filter="url(#workplace-desk-shadow)">
        {/* Desk front */}
        <path d="M 8 46 L 44 46 L 44 54 L 8 54 Z" fill="url(#workplace-desk-gradient)" />
        {/* Desk side */}
        <path d="M 44 46 L 52 42 L 52 50 L 44 54 Z" fill="#5b21b6" />
        {/* Desk top */}
        <path d="M 8 46 L 16 42 L 52 42 L 44 46 Z" fill="url(#workplace-desk-top)" />
        <path d="M 8 46 L 16 42 L 52 42 L 44 46 Z" fill="#ffffff" opacity="0.15" />
        {/* Desk legs hint */}
        <rect x="10" y="54" width="2.5" height="5" fill="#4c1d95" opacity="0.7" />
        <rect x="40" y="54" width="2.5" height="5" fill="#4c1d95" opacity="0.7" />
      </g>

      {/* Envelope on desk (email) */}
      <g filter="url(#workplace-envelope-shadow)">
        <rect x="14" y="28" width="20" height="14" rx="1.5" fill="url(#workplace-envelope-gradient)" />
        <path d="M 14 28 L 24 37 L 34 28" stroke="#b45309" strokeWidth="1.4" fill="none" />
        <path d="M 14 42 L 22 34 M 34 42 L 26 34" stroke="#d97706" strokeWidth="1" opacity="0.6" />
        {/* Envelope highlight */}
        <rect x="14" y="28" width="20" height="6" rx="1.5" fill="#ffffff" opacity="0.25" />
      </g>

      {/* Handshake badge */}
      <g filter="url(#workplace-badge-shadow)">
        <circle cx="47" cy="24" r="11" fill="url(#workplace-handshake-gradient)" />
        <circle cx="47" cy="24" r="11" fill="#ffffff" opacity="0.08" />
        {/* Two hands meeting (simplified 3D geometric shapes) */}
        <path d="M 40 25 L 45 22 L 47 24 L 45 26 Z" fill="#fde68a" />
        <path d="M 54 25 L 49 22 L 47 24 L 49 26 Z" fill="#fca5a5" />
        {/* Wrist/sleeve shapes */}
        <rect x="37" y="23" width="5" height="4" rx="1.5" fill="#f59e0b" />
        <rect x="52" y="23" width="5" height="4" rx="1.5" fill="#ef4444" />
      </g>

      {/* Decorative sparkles */}
      <g opacity="0.5">
        <circle cx="8" cy="16" r="1" fill="#a78bfa" />
        <circle cx="58" cy="40" r="0.9" fill="#6ee7b7" />
        <circle cx="6" cy="52" r="0.8" fill="#fbbf24" />
      </g>
    </svg>
  );
};
