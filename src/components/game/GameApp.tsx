"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Location, WeddingProject } from "@/lib/types";
import { useGameProgress } from "@/hooks/useGameProgress";
import { WelcomeScreen } from "./WelcomeScreen";
import { TreasureMap, SHIP_SAIL_DURATION } from "./TreasureMap";
import { LocationPanel } from "./LocationPanel";
import { FinalInvitation } from "./FinalInvitation";
import { CompletionToast } from "./CompletionToast";
import { FinaleSequence } from "./FinaleSequence";
import { SoundToggle, playEffect } from "./SoundToggle";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { formatCoupleGenitive, getStorageKey } from "@/lib/utils";
import { BookOpen, Images, RotateCcw } from "lucide-react";

type GamePhase = "welcome" | "map" | "finale" | "invitation";

interface GameAppProps {
  wedding: WeddingProject;
}

function getSuccessMessage(loc: Location): string {
  if (loc.quiz?.successMessage) return loc.quiz.successMessage;
  if (loc.successMessage) return loc.successMessage;
  const defaults: Record<number, string> = {
    1: "Вы нашли первую подсказку!",
    2: "Картина собрана — путь продолжается!",
    3: "Все факты на месте — вперёд!",
    4: "Сундук открыт — сокровище найдено!",
    5: "Вы прибыли на остров свадьбы!",
  };
  return defaults[loc.order] || `Локация «${loc.name}» пройдена!`;
}

export function GameApp({ wedding }: GameAppProps) {
  const [phase, setPhase] = useState<GamePhase>("welcome");
  const [activeLocation, setActiveLocation] = useState<{ loc: Location; index: number } | null>(null);
  const [animatingShip, setAnimatingShip] = useState(false);
  const [started, setStarted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [shipFromIndex, setShipFromIndex] = useState<number | null>(null);
  const completingRef = useRef(false);
  const restartedRef = useRef(false);

  const {
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
  } = useGameProgress(wedding.slug);

  const locations = wedding.locations;
  const locationIds = locations.map((l) => l.id);

  useBackgroundMusic(progress.soundEnabled, phase !== "welcome");

  const shipIndex = Math.min(progress.currentLocationIndex, locations.length - 1);
  const shipLoc = locations[shipFromIndex ?? shipIndex] ?? locations[0];

  const allDone =
    progress.skippedToInvitation ||
    locationIds.every((id) => progress.completedLocations.includes(id));

  // Сброс по ссылке ?restart=1
  useEffect(() => {
    if (!loaded || restartedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("restart") === "1") {
      restartedRef.current = true;
      localStorage.removeItem(getStorageKey(wedding.slug));
      resetProgress();
      setPhase("welcome");
      setStarted(false);
      setActiveLocation(null);
      setToast(null);
      setAnimatingShip(false);
      setShipFromIndex(null);
      completingRef.current = false;
      window.history.replaceState({}, "", `/${wedding.slug}`);
    }
  }, [loaded, resetProgress, wedding.slug]);

  // Восстановление прогресса при загрузке — не сбрасываем фазу finale/invitation
  useEffect(() => {
    if (!loaded || restartedRef.current) return;

    if (progress.skippedToInvitation) {
      setPhase("invitation");
      return;
    }

    if (allDone) {
      setPhase((current) => {
        if (current === "finale" || current === "invitation") return current;
        return "invitation";
      });
      return;
    }

    if (progress.completedLocations.length > 0) {
      setStarted(true);
      setPhase((current) => (current === "welcome" ? "map" : current));
    }
  }, [loaded, progress.skippedToInvitation, progress.completedLocations.length, allDone]);

  const handleStart = () => {
    setStarted(true);
    setPhase("map");
    playEffect("ship", progress.soundEnabled);
  };

  const handleLocationClick = (loc: Location, index: number) => {
    if (!isLocationAccessible(index)) return;
    setActiveLocation({ loc, index });
  };

  const finishLocation = useCallback(
    (loc: Location, index: number) => {
      if (completingRef.current) return;
      completingRef.current = true;

      const isFinal = index === locations.length - 1;
      const successMsg = getSuccessMessage(loc);

      playEffect("hint", progress.soundEnabled);
      setActiveLocation(null);

      if (!isFinal) {
        setShipFromIndex(index);
        setAnimatingShip(true);
        playEffect("ship", progress.soundEnabled);
      }

      completeLocation(loc.id, index, locations.length);

      setTimeout(() => {
        setAnimatingShip(false);
        setShipFromIndex(null);
        completingRef.current = false;

        if (isFinal) {
          setPhase("finale");
        } else {
          setToast(successMsg);
          setTimeout(() => setToast(null), 3500);
        }
      }, isFinal ? 300 : SHIP_SAIL_DURATION * 1000 + 200);
    },
    [completeLocation, locations.length, progress.soundEnabled]
  );

  const handleComplete = useCallback(() => {
    if (!activeLocation) return;
    finishLocation(activeLocation.loc, activeLocation.index);
  }, [activeLocation, finishLocation]);

  const handleSkipMinigame = useCallback(() => {
    if (!activeLocation) return;
    finishLocation(activeLocation.loc, activeLocation.index);
  }, [activeLocation, finishLocation]);

  const handleSkipToInvitation = () => {
    skipToInvitation();
    setActiveLocation(null);
    setPhase("invitation");
    playEffect("complete", progress.soundEnabled);
  };

  const handleFinaleComplete = useCallback(() => {
    setPhase("invitation");
  }, []);

  const handleReset = useCallback(() => {
    resetProgress();
    setPhase("welcome");
    setStarted(false);
    setActiveLocation(null);
    setToast(null);
    setAnimatingShip(false);
    setShipFromIndex(null);
    completingRef.current = false;
  }, [resetProgress]);

  if (!loaded) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-amber-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950">
      <SoundToggle enabled={progress.soundEnabled} onToggle={toggleSound} />
      <CompletionToast message={toast} />

      {phase === "finale" && (
        <FinaleSequence
          wedding={wedding}
          soundEnabled={progress.soundEnabled}
          onComplete={handleFinaleComplete}
        />
      )}

      <AnimatePresence mode="wait">
        {phase === "welcome" && (
          <WelcomeScreen
            key="welcome"
            coupleGenitive={formatCoupleGenitive(
              wedding.brideName,
              wedding.groomName,
              wedding.brideNameGenitive,
              wedding.groomNameGenitive
            )}
            onStart={handleStart}
          />
        )}

        {phase === "map" && !allDone && !progress.skippedToInvitation && (
          <div key="map" className="px-4 py-8 pt-16">
            <div className="mx-auto mb-6 max-w-4xl text-center">
              <h1 className="font-serif text-2xl font-bold text-amber-100 sm:text-3xl">
                Путешествие{" "}
                {formatCoupleGenitive(
                  wedding.brideName,
                  wedding.groomName,
                  wedding.brideNameGenitive,
                  wedding.groomNameGenitive
                )}
              </h1>
              <p className="mt-2 text-amber-300/70">
                Пройдено {progress.completedLocations.length} из {locations.length} локаций
              </p>
              {progress.currentLocationIndex < locations.length && (
                <p className="mt-1 text-sm text-amber-400/80">
                  Следующая остановка:{" "}
                  <span className="font-medium text-amber-200">
                    {locations[progress.currentLocationIndex]?.name}
                  </span>
                </p>
              )}
            </div>

            <TreasureMap
              locations={locations}
              currentIndex={progress.currentLocationIndex}
              completedIds={progress.completedLocations}
              onLocationClick={handleLocationClick}
              isAccessible={isLocationAccessible}
              isPlayable={isLocationPlayable}
              shipPosition={{ x: shipLoc.mapX, y: shipLoc.mapY }}
              shipTargetPosition={
                animatingShip && shipFromIndex !== null
                  ? {
                      x: locations[Math.min(shipFromIndex + 1, locations.length - 1)].mapX,
                      y: locations[Math.min(shipFromIndex + 1, locations.length - 1)].mapY,
                    }
                  : null
              }
              animatingShip={animatingShip}
            />

            <div className="mx-auto mt-6 flex max-w-4xl justify-center gap-4">
              <Link
                href={`/${wedding.slug}/story`}
                className="flex items-center gap-2 rounded-full bg-amber-900/60 px-4 py-2 text-sm text-amber-200 hover:bg-amber-800/60"
              >
                <BookOpen size={16} /> Наша история
              </Link>
              <Link
                href={`/${wedding.slug}/gallery`}
                className="flex items-center gap-2 rounded-full bg-amber-900/60 px-4 py-2 text-sm text-amber-200 hover:bg-amber-800/60"
              >
                <Images size={16} /> Галерея
              </Link>
            </div>

            <div className="mx-auto mt-4 max-w-4xl space-y-2 text-center">
              <button
                onClick={handleSkipToInvitation}
                className="block w-full text-sm text-amber-400/60 underline hover:text-amber-300"
              >
                Пропустить квест и сразу посмотреть приглашение
              </button>
              <button
                onClick={handleReset}
                className="mx-auto flex items-center gap-1 text-sm text-amber-400/70 hover:text-amber-300"
              >
                <RotateCcw size={14} /> Начать игру сначала
              </button>
            </div>
          </div>
        )}

        {(phase === "invitation" || progress.skippedToInvitation) && (
          <div key="invitation">
            <FinalInvitation
              wedding={wedding}
              showAnimation={progress.skippedToInvitation && !allDone}
            />

            <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 pb-8">
              <div className="flex flex-wrap justify-center gap-4">
                <Link href={`/${wedding.slug}/story`} className="text-sm text-amber-400 hover:text-amber-300">
                  Наша история
                </Link>
                <Link href={`/${wedding.slug}/gallery`} className="text-sm text-amber-400 hover:text-amber-300">
                  Галерея
                </Link>
                {!allDone && progress.skippedToInvitation && (
                  <button onClick={() => setPhase("map")} className="text-sm text-amber-400 hover:text-amber-300">
                    Вернуться к квесту
                  </button>
                )}
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 rounded-full border border-amber-600/50 px-5 py-2 text-sm text-amber-300 hover:bg-amber-900/50"
              >
                <RotateCcw size={14} /> Начать игру сначала
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {activeLocation && (
        <LocationPanel
          location={activeLocation.loc}
          wedding={wedding}
          isCompleted={isLocationCompleted(activeLocation.loc.id)}
          isPlayable={isLocationPlayable(activeLocation.index, activeLocation.loc.id)}
          onClose={() => setActiveLocation(null)}
          onComplete={handleComplete}
          onSkipMinigame={handleSkipMinigame}
          onSkipToInvitation={handleSkipToInvitation}
        />
      )}
    </div>
  );
}
