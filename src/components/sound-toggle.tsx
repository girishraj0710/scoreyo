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
      <button className="p-2 rounded-lg bg-slate-100 text-slate-400">
        <Volume2 className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleSound}
      className={`p-2 rounded-lg transition-all ${
        enabled
          ? "bg-[#E6F4F9] text-[#00A1E0] hover:bg-[#80CFED]"
          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
      }`}
      title={enabled ? "Sound On" : "Sound Off"}
    >
      {enabled ? (
        <Volume2 className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
    </button>
  );
}
