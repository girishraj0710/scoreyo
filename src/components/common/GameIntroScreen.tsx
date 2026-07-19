"use client";

import { useState } from "react";

interface Instruction {
  text: string;
}

interface GameIntroScreenProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
  instructions: Instruction[];
  buttonText?: string;
  onStart: () => void;
  onBack?: () => void;
  accentColor?: string;
  iconBgColor?: string;
}

export default function GameIntroScreen({
  icon,
  title,
  subtitle = "GENERAL",
  description,
  instructions,
  buttonText = "Play",
  onStart,
  onBack,
  accentColor = "#14b8a6",
  iconBgColor = "#0d9488",
}: GameIntroScreenProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center p-6 relative">
      {/* Close button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 group"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="max-w-2xl w-full mx-auto">
        {/* Animated Icon */}
        <div className="flex justify-center mb-8">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300"
            style={{ backgroundColor: iconBgColor }}
          >
            {icon}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Play a game of {title}!
        </h1>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto mb-10 text-center">
            {description}
          </p>
        )}

        {/* Play button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={onStart}
            className="px-16 py-4 rounded-full text-white text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: accentColor }}
          >
            {buttonText}
          </button>
        </div>

        {/* How to play link */}
        <div className="text-center mb-10">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-base font-medium hover:underline transition-colors"
            style={{ color: accentColor }}
          >
            How to play {title}
          </button>
        </div>

        {/* Instructions (shown when toggled) */}
        {showInstructions && (
          <div className="max-w-lg mx-auto bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">How to play</h2>
            <div className="space-y-4">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                    style={{ backgroundColor: accentColor }}
                  />
                  <p className="text-gray-700 text-base leading-relaxed flex-1">
                    {instruction.text.replace("• ", "")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
