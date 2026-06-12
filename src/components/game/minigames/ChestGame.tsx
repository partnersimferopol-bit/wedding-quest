"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { normalizeCodeWord } from "@/lib/utils";
import { IMAGES } from "@/lib/images";

interface ChestGameProps {
  codeWord: string;
  hint: string;
  onComplete: () => void;
}

export function ChestGame({ codeWord, hint, onComplete }: ChestGameProps) {
  const [input, setInput] = useState("");
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (normalizeCodeWord(input) === normalizeCodeWord(codeWord)) {
      setOpened(true);
      setError(false);
      setTimeout(onComplete, 2500);
    } else {
      setError(true);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-amber-300/80">{hint}</p>

      <div className="relative mx-auto h-48 w-48">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="closed"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
            >
              <Image src={IMAGES.chestClosed} alt="Сундук" fill className="object-contain" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative h-full w-full"
            >
              <Image src={IMAGES.chestOpen} alt="Открытый сундук" fill className="object-contain" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!opened && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            placeholder="Введите кодовое слово"
            className="w-full rounded-lg border-2 border-amber-700/50 bg-amber-950/50 px-4 py-3 text-amber-100 placeholder:text-amber-400/50 focus:border-amber-500 focus:outline-none"
          />
          {error && <p className="text-sm text-red-400">Неверное слово. Попробуйте ещё!</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 py-3 font-semibold text-white"
          >
            Открыть сундук
          </button>
        </form>
      )}

      {opened && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-lg text-amber-200"
        >
          Сундук открыт! Сокровище найдено!
        </motion.p>
      )}
    </div>
  );
}
