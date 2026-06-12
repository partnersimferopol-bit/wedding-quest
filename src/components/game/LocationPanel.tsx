"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import type { Location, WeddingProject } from "@/lib/types";
import { QuizGame } from "./minigames/QuizGame";
import { PuzzleGame } from "./minigames/PuzzleGame";
import { MatchingGame } from "./minigames/MatchingGame";
import { ChestGame } from "./minigames/ChestGame";

interface LocationPanelProps {
  location: Location;
  wedding: WeddingProject;
  isCompleted: boolean;
  isPlayable: boolean;
  onClose: () => void;
  onComplete: () => void;
  onSkipMinigame: () => void;
  onSkipToInvitation: () => void;
}

export function LocationPanel({
  location,
  wedding,
  isCompleted,
  isPlayable,
  onClose,
  onComplete,
  onSkipMinigame,
  onSkipToInvitation,
}: LocationPanelProps) {
  const isFinal = location.order === 5;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-amber-700/50 bg-gradient-to-b from-amber-950 to-amber-900 p-6 shadow-2xl sm:rounded-2xl"
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-amber-500">
                Локация {location.order} из 5
              </span>
              <h2 className="font-serif text-2xl font-bold text-amber-100">{location.name}</h2>
              <p className="mt-1 text-sm text-amber-400/70">{location.description}</p>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-amber-300 hover:bg-amber-800/50">
              <X size={20} />
            </button>
          </div>

          <div className="mb-4 overflow-hidden rounded-xl">
            <Image
              src={location.image}
              alt={location.name}
              width={400}
              height={250}
              className="w-full object-cover"
            />
          </div>

          <div className="mb-4 rounded-xl bg-amber-900/30 p-4">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-500">История</h3>
            <p className="leading-relaxed text-amber-200/90">{location.story}</p>
          </div>

          {location.photos.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-500">Фотографии</h3>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {location.photos.map((photo, i) => (
                  <Image
                    key={i}
                    src={photo}
                    alt={`${location.name} — фото ${i + 1}`}
                    width={120}
                    height={120}
                    className="h-24 w-24 flex-shrink-0 rounded-lg object-cover border border-amber-700/30"
                  />
                ))}
              </div>
            </div>
          )}

          {location.videoUrl && (
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-500">Видео</h3>
              <video
                src={location.videoUrl}
                controls
                className="w-full rounded-xl"
                playsInline
              />
            </div>
          )}

          {isCompleted ? (
            <p className="rounded-lg bg-green-900/30 p-4 text-center text-green-300">
              ✓ Локация пройдена! Можете вернуться к карте.
            </p>
          ) : !isPlayable ? (
            <p className="rounded-lg bg-amber-900/40 p-4 text-center text-amber-300/80">
              Сначала пройдите предыдущие локации на карте.
            </p>
          ) : isFinal ? (
            <div className="space-y-3">
              <p className="text-center text-amber-200/90">
                Вы достигли финальной точки маршрута. Нажмите, чтобы прибыть на остров свадьбы!
              </p>
              <button
                onClick={onComplete}
                className="w-full rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 py-3 font-semibold text-white"
              >
                Прибыть на остров свадьбы
              </button>
            </div>
          ) : (
            <>
              {location.hint && (
                <p className="mb-4 rounded-lg bg-amber-900/40 px-3 py-2 text-sm italic text-amber-300/80">
                  💡 {location.hint}
                </p>
              )}

              <div className="rounded-xl border border-amber-700/30 bg-amber-950/40 p-4">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-500">
                  {location.miniGameType === "quiz" && "Викторина"}
                  {location.miniGameType === "puzzle" && "Пазл"}
                  {location.miniGameType === "matching" && "Сопоставление фактов"}
                  {location.miniGameType === "chest" && "Открытие сундука"}
                </h3>

                {location.miniGameType === "quiz" && location.quiz && (
                  <QuizGame quiz={location.quiz} onComplete={onComplete} />
                )}
                {location.miniGameType === "puzzle" && location.puzzleImage && (
                  <PuzzleGame
                    image={location.puzzleImage}
                    size={location.puzzleSize || 3}
                    onComplete={onComplete}
                  />
                )}
                {location.miniGameType === "matching" && location.matchingFacts && (
                  <MatchingGame
                    facts={location.matchingFacts}
                    brideName={wedding.brideName}
                    groomName={wedding.groomName}
                    onComplete={onComplete}
                  />
                )}
                {location.miniGameType === "chest" && location.codeWord && (
                  <ChestGame
                    codeWord={location.codeWord}
                    hint={location.codeHint || location.hint}
                    onComplete={onComplete}
                  />
                )}
              </div>

              <button
                onClick={onSkipMinigame}
                className="mt-3 w-full rounded-lg border border-amber-600/50 py-2 text-sm text-amber-300/70 hover:bg-amber-800/30"
              >
                Пропустить задание и перейти дальше
              </button>
              <button
                onClick={onSkipToInvitation}
                className="mt-2 w-full py-1 text-xs text-amber-400/50 underline hover:text-amber-300"
              >
                Пропустить мини-игру и сразу посмотреть приглашение
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
