"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getSoundEnabled, setSoundEnabled, sounds } from "@/lib/sounds";

export function SoundToggle() {
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(getSoundEnabled());
  }, []);

  function toggleSound() {
    const newValue = !enabled;
    setEnabled(newValue);
    setSoundEnabled(newValue);

    // Play a test sound when enabling
    if (newValue) {
      sounds.success();
    }
  }

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-slate-100 text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="Sound toggle (loading)">
        <Volume2 className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleSound}
      className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        enabled
          ? "bg-[#E8EAFF] text-[#4255FF] hover:bg-[#90CAF9]"
          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
      }`}
      aria-label={enabled ? "Sound enabled" : "Sound disabled"}
      aria-pressed={enabled}
    >
      {enabled ? (
        <Volume2 className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
    </button>
  );
}
