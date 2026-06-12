"use client";

import { useCallback, useEffect, useState } from "react";
import type { GameProgress } from "@/lib/types";
import { getStorageKey } from "@/lib/utils";

const DEFAULT: GameProgress = {
  completedLocations: [],
  currentLocationIndex: 0,
  skippedToInvitation: false,
  soundEnabled: true,
};

export function useGameProgress(slug: string) {
  const [progress, setProgress] = useState<GameProgress>(DEFAULT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(getStorageKey(slug));
      if (raw) setProgress(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, [slug]);

  const save = useCallback(
    (next: GameProgress) => {
      setProgress(next);
      localStorage.setItem(getStorageKey(slug), JSON.stringify(next));
    },
    [slug]
  );

  const completeLocation = useCallback(
    (locationId: string, locationIndex: number, totalLocations: number) => {
      setProgress((prev) => {
        const completed = prev.completedLocations.includes(locationId)
          ? prev.completedLocations
          : [...prev.completedLocations, locationId];
        const nextIndex = Math.min(locationIndex + 1, totalLocations - 1);
        const next = {
          ...prev,
          completedLocations: completed,
          currentLocationIndex: Math.max(prev.currentLocationIndex, nextIndex),
        };
        localStorage.setItem(getStorageKey(slug), JSON.stringify(next));
        return next;
      });
    },
    [slug]
  );

  const skipToInvitation = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, skippedToInvitation: true };
      localStorage.setItem(getStorageKey(slug), JSON.stringify(next));
      return next;
    });
  }, [slug]);

  const toggleSound = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, soundEnabled: !prev.soundEnabled };
      localStorage.setItem(getStorageKey(slug), JSON.stringify(next));
      return next;
    });
  }, [slug]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(getStorageKey(slug));
    setProgress(DEFAULT);
  }, [slug]);

  /** Локация доступна: текущая или уже пройденные (для просмотра) */
  const isLocationAccessible = useCallback(
    (index: number) => {
      if (progress.skippedToInvitation) return true;
      return index <= progress.currentLocationIndex;
    },
    [progress]
  );

  /** Можно играть мини-игру только на текущей непройденной локации */
  const isLocationPlayable = useCallback(
    (index: number, locationId: string) => {
      if (progress.skippedToInvitation) return false;
      if (progress.completedLocations.includes(locationId)) return false;
      return index === progress.currentLocationIndex;
    },
    [progress]
  );

  const isLocationCompleted = useCallback(
    (locationId: string) => progress.completedLocations.includes(locationId),
    [progress]
  );

  const allCompleted = useCallback(
    (locationIds: string[]) =>
      progress.skippedToInvitation ||
      locationIds.every((id) => progress.completedLocations.includes(id)),
    [progress]
  );

  return {
    progress,
    loaded,
    completeLocation,
    skipToInvitation,
    toggleSound,
    resetProgress,
    isLocationAccessible,
    isLocationPlayable,
    isLocationCompleted,
    allCompleted,
  };
}
