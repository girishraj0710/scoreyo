/**
 * Sound Effects System
 * Optional audio feedback for user actions
 */

// Check if sound is enabled in localStorage
function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const setting = localStorage.getItem("prepgenie-sound-enabled");
  return setting === null ? true : setting === "true"; // Default: enabled
}

export function setSoundEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("prepgenie-sound-enabled", enabled.toString());
}

export function getSoundEnabled(): boolean {
  return isSoundEnabled();
}

// Sound URLs (using Web Audio API synthesized sounds for no external dependencies)
class SoundPlayer {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      // Lazy init AudioContext on first play
    }
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Success sound (correct answer)
  playSuccess() {
    if (!isSoundEnabled()) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);

      // Second tone
      const oscillator2 = ctx.createOscillator();
      const gainNode2 = ctx.createGain();
      oscillator2.connect(gainNode2);
      gainNode2.connect(ctx.destination);
      oscillator2.frequency.value = 1000;
      oscillator2.type = "sine";
      gainNode2.gain.setValueAtTime(0.3, ctx.currentTime + 0.1);
      gainNode2.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + 0.3
      );
      oscillator2.start(ctx.currentTime + 0.1);
      oscillator2.stop(ctx.currentTime + 0.3);
    } catch (err) {
      console.warn("Sound playback failed:", err);
    }
  }

  // Error sound (wrong answer)
  playError() {
    if (!isSoundEnabled()) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 200;
      oscillator.type = "sawtooth";

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (err) {
      console.warn("Sound playback failed:", err);
    }
  }

  // Level up sound
  playLevelUp() {
    if (!isSoundEnabled()) return;

    try {
      const ctx = this.getContext();

      // Rising notes: C-E-G-C
      const notes = [523.25, 659.25, 783.99, 1046.5];
      let time = ctx.currentTime;

      notes.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = freq;
        oscillator.type = "triangle";

        gainNode.gain.setValueAtTime(0.2, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

        oscillator.start(time);
        oscillator.stop(time + 0.15);

        time += 0.1;
      });
    } catch (err) {
      console.warn("Sound playback failed:", err);
    }
  }

  // Badge unlock sound
  playBadgeUnlock() {
    if (!isSoundEnabled()) return;

    try {
      const ctx = this.getContext();

      // Fanfare sound
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      let time = ctx.currentTime;

      notes.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = freq;
        oscillator.type = "sine";

        const volume = i === notes.length - 1 ? 0.4 : 0.25;
        const duration = i === notes.length - 1 ? 0.5 : 0.2;

        gainNode.gain.setValueAtTime(volume, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

        oscillator.start(time);
        oscillator.stop(time + duration);

        time += 0.08;
      });
    } catch (err) {
      console.warn("Sound playback failed:", err);
    }
  }

  // Streak milestone sound
  playStreakMilestone() {
    if (!isSoundEnabled()) return;

    try {
      const ctx = this.getContext();

      // Fire crackle effect
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 100;
      oscillator.type = "sawtooth";

      filter.type = "lowpass";
      filter.frequency.value = 2000;

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);

      // Add sparkle
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 2000;
        osc2.type = "sine";
        gain2.gain.setValueAtTime(0.2, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.3);
      }, 100);
    } catch (err) {
      console.warn("Sound playback failed:", err);
    }
  }

  // Click sound (button press)
  playClick() {
    if (!isSoundEnabled()) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 600;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (err) {
      console.warn("Sound playback failed:", err);
    }
  }

  // Timer warning (last 10 seconds)
  playTimerWarning() {
    if (!isSoundEnabled()) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 880;
      oscillator.type = "square";

      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (err) {
      console.warn("Sound playback failed:", err);
    }
  }

  // Quiz/Test submit sound (celebratory fanfare)
  playSubmit() {
    if (!isSoundEnabled()) return;

    try {
      const ctx = this.getContext();

      // Celebratory ascending notes: C-E-G-C (higher octave)
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      let time = ctx.currentTime;

      notes.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = freq;
        oscillator.type = "triangle";

        const volume = 0.25;
        const duration = 0.25;

        gainNode.gain.setValueAtTime(volume, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

        oscillator.start(time);
        oscillator.stop(time + duration);

        time += 0.12;
      });

      // Add a final high note for emphasis
      setTimeout(() => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 1318.51;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
      }, 600);
    } catch (err) {
      console.warn("Sound playback failed:", err);
    }
  }
}

// Singleton instance
let soundPlayer: SoundPlayer | null = null;

function getPlayer(): SoundPlayer {
  if (!soundPlayer) {
    soundPlayer = new SoundPlayer();
  }
  return soundPlayer;
}

// Exported sound functions
export const sounds = {
  success: () => getPlayer().playSuccess(),
  error: () => getPlayer().playError(),
  levelUp: () => getPlayer().playLevelUp(),
  badgeUnlock: () => getPlayer().playBadgeUnlock(),
  streakMilestone: () => getPlayer().playStreakMilestone(),
  click: () => getPlayer().playClick(),
  timerWarning: () => getPlayer().playTimerWarning(),
  submit: () => getPlayer().playSubmit(),
};
