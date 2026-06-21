'use client';

import { Volume2, StopCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AudioPronunciationProps {
  text: string;
  language?: string;
  rate?: number;
  pitch?: number;
  label?: string;
}

export function AudioPronunciation({
  text,
  language = 'en-IN', // Indian English by default
  rate = 0.9, // Slightly slower for learning
  pitch = 1,
  label = 'Listen'
}: AudioPronunciationProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports speech synthesis
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const handleSpeak = () => {
    if (!isSupported) return;

    if (isSpeaking) {
      // Stop current speech
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Try to use Indian English voice if available
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang === 'en-IN');
    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) {
    return null; // Hide button if not supported
  }

  return (
    <button
      onClick={handleSpeak}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
        text-sm font-medium transition-all
        ${isSpeaking
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        }
        dark:bg-opacity-20 dark:hover:bg-opacity-30
      `}
      aria-label={isSpeaking ? 'Stop pronunciation' : 'Play pronunciation'}
    >
      {isSpeaking ? (
        <>
          <StopCircle className="w-4 h-4" />
          Stop
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  );
}

// Component for pronunciation examples with both text and audio
interface PronunciationExampleProps {
  word: string;
  phonetic?: string;
  meaning?: string;
  exampleSentence?: string;
}

export function PronunciationExample({
  word,
  phonetic,
  meaning,
  exampleSentence
}: PronunciationExampleProps) {
  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {word}
            </span>
            {phonetic && (
              <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                /{phonetic}/
              </span>
            )}
          </div>

          {meaning && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {meaning}
            </p>
          )}

          {exampleSentence && (
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
              <p className="text-sm italic text-gray-600 dark:text-gray-400">
                "{exampleSentence}"
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <AudioPronunciation text={word} label="Word" rate={0.7} />
          {exampleSentence && (
            <AudioPronunciation text={exampleSentence} label="Sentence" />
          )}
        </div>
      </div>
    </div>
  );
}
