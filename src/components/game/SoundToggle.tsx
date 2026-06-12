"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-amber-900/80 text-amber-100 shadow-lg backdrop-blur-sm"
      aria-label={enabled ? "Выключить звук" : "Включить звук"}
    >
      {enabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </motion.button>
  );
}

export function playEffect(type: "hint" | "chest" | "ship" | "complete", enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const freqs = { hint: 523, chest: 392, ship: 440, complete: 659 };
    osc.frequency.value = freqs[type];
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    /* audio not available */
  }
}
