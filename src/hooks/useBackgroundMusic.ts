"use client";

import { useEffect, useRef } from "react";

import { assetPath } from "@/lib/utils";

const MUSIC_SRC = assetPath("/audio/enduring-togetherness.mp3");
const VOLUME = 0.35;

export function useBackgroundMusic(enabled: boolean, shouldPlay: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = VOLUME;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = enabled ? VOLUME : 0;

    if (!enabled || !shouldPlay) {
      audio.pause();
      return;
    }

    const play = () => {
      audio.play().catch(() => {
        /* autoplay blocked until user gesture */
      });
    };

    play();

    const resumeOnInteraction = () => {
      if (enabled && shouldPlay && audio.paused) play();
    };

    window.addEventListener("pointerdown", resumeOnInteraction, { once: true });
    return () => window.removeEventListener("pointerdown", resumeOnInteraction);
  }, [enabled, shouldPlay]);
}
