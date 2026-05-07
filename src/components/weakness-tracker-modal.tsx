"use client";

import { useState } from "react";

interface WeaknessTrackerModalProps {
  onSelect: (type: 'calculation' | 'concept' | 'time' | 'careless') => void;
  onSkip: () => void;
}

export function WeaknessTrackerModal({ onSelect, onSkip }: WeaknessTrackerModalProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const weaknessTypes = [
    {
      id: 'calculation' as const,
      icon: '🧮',
      title: 'Calculation Error',
      description: 'Made a math mistake or arithmetic error',
      color: 'bg-red-50 border-red-300 hover:bg-red-100'
    },
    {
      id: 'concept' as const,
      icon: '💡',
      title: 'Concept Unclear',
      description: 'Didn\'t understand the fundamental concept',
      color: 'bg-purple-50 border-purple-300 hover:bg-purple-100'
    },
    {
      id: 'time' as const,
      icon: '⏱️',
      title: 'Ran Out of Time',
      description: 'Knew the answer but couldn\'t finish in time',
      color: 'bg-amber-50 border-amber-300 hover:bg-amber-100'
    },
    {
      id: 'careless' as const,
      icon: '🤦',
      title: 'Careless Mistake',
      description: 'Misread question or clicked wrong option',
      color: 'bg-blue-50 border-blue-300 hover:bg-blue-100'
    }
  ];

  const handleSelect = (type: typeof weaknessTypes[number]['id']) => {
    setSelected(type);
    setTimeout(() => {
      onSelect(type);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🤔</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            What went wrong?
          </h3>
          <p className="text-sm text-slate-600">
            Help us understand your mistake pattern to give you better recommendations
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {weaknessTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleSelect(type.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selected === type.id
                  ? 'ring-2 ring-indigo-500 ring-offset-2'
                  : type.color
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{type.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 mb-0.5">{type.title}</div>
                  <div className="text-xs text-slate-600">{type.description}</div>
                </div>
                {selected === type.id && (
                  <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onSkip}
          className="w-full px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Skip for now
        </button>

        <div className="mt-4 text-center">
          <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>This helps us personalize your learning path</span>
          </div>
        </div>
      </div>
    </div>
  );
}
