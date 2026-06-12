"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { WeddingProject } from "@/lib/types";
import { IMAGES } from "@/lib/images";
import { playEffect } from "./SoundToggle";

interface FinaleSequenceProps {
  wedding: WeddingProject;
  soundEnabled: boolean;
  onComplete: () => void;
}

type Step = "ship" | "chest-appear" | "chest-open" | "glow" | "done";

const STEP_DURATIONS: Record<Step, number> = {
  ship: 2200,
  "chest-appear": 1400,
  "chest-open": 1600,
  glow: 2400,
  done: 0,
};

export function FinaleSequence({ wedding, soundEnabled, onComplete }: FinaleSequenceProps) {
  const [step, setStep] = useState<Step>("ship");

  useEffect(() => {
    if (step === "done") {
      playEffect("complete", soundEnabled);
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }

    if (step === "chest-open") playEffect("chest", soundEnabled);

    const duration = STEP_DURATIONS[step];
    const nextSteps: Partial<Record<Step, Step>> = {
      ship: "chest-appear",
      "chest-appear": "chest-open",
      "chest-open": "glow",
      glow: "done",
    };
    const next = nextSteps[step];
    if (!next) return;

    const t = setTimeout(() => setStep(next), duration);
    return () => clearTimeout(t);
  }, [step, soundEnabled, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-amber-950/95 px-4"
    >
      <div className="relative w-full max-w-md text-center">
        <h2 className="mb-6 font-serif text-2xl font-bold text-amber-100">
          {wedding.locations[4]?.name || "Остров свадьбы"}
        </h2>

        <AnimatePresence mode="wait">
          {step === "ship" && (
            <motion.div
              key="ship"
              initial={{ x: -120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="mx-auto"
            >
              <div className="relative mx-auto h-52 w-52 sm:h-56 sm:w-56">
                <Image
                  src={IMAGES.ship}
                  alt="Корабль прибывает"
                  fill
                  className="object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
                  unoptimized
                />
              </div>
            </motion.div>
          )}

          {step === "chest-appear" && (
            <motion.div
              key="chest-closed"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="mx-auto"
            >
              <div className="relative mx-auto h-48 w-48 sm:h-52 sm:w-52">
                <Image src={IMAGES.chestClosed} alt="Сундук" fill className="object-contain" />
              </div>
            </motion.div>
          )}

          {step === "chest-open" && (
            <motion.div
              key="chest-open"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto"
            >
              <div className="relative mx-auto h-48 w-48 sm:h-52 sm:w-52">
                <Image src={IMAGES.chestOpen} alt="Открытый сундук" fill className="object-contain" />
              </div>
            </motion.div>
          )}

          {step === "glow" && (
            <motion.div
              key="glow"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto"
            >
              <div className="relative mx-auto h-48 w-48 sm:h-52 sm:w-52">
                <Image src={IMAGES.chestOpen} alt="" fill className="object-contain" />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-amber-400/40 blur-3xl"
                />
              </div>
              <p className="mt-6 text-xl font-semibold text-amber-100">
                Сокровище найдено! Открываем приглашение...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onComplete}
          className="mt-8 text-sm text-amber-400/60 underline hover:text-amber-300"
        >
          Пропустить анимацию
        </button>
      </div>
    </motion.div>
  );
}
