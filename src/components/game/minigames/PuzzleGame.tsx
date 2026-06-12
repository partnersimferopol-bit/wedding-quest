"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface PuzzleGameProps {
  image: string;
  size: 3 | 4 | 5;
  onComplete: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PuzzleGame({ image, size, onComplete }: PuzzleGameProps) {
  const total = size * size;
  const [tiles, setTiles] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  const init = useCallback(() => {
    let shuffled: number[];
    do {
      shuffled = shuffle(Array.from({ length: total }, (_, i) => i));
    } while (shuffled.every((v, i) => v === i));
    setTiles(shuffled);
    setSelected(null);
    setSolved(false);
  }, [total]);

  useEffect(() => {
    init();
  }, [init]);

  const handleClick = (index: number) => {
    if (solved) return;
    if (selected === null) {
      setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }
    const next = [...tiles];
    [next[selected], next[index]] = [next[index], next[selected]];
    setTiles(next);
    setSelected(null);
    if (next.every((v, i) => v === i)) {
      setSolved(true);
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-amber-300/80">
        Нажмите на две плитки, чтобы поменять их местами. Соберите изображение ({size}×{size}).
      </p>
      <div
        className="mx-auto grid gap-1 rounded-lg overflow-hidden border-2 border-amber-700/50"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          width: "100%",
          maxWidth: 320,
          aspectRatio: "1",
        }}
      >
        {tiles.map((tileIndex, pos) => {
          const row = Math.floor(tileIndex / size);
          const col = tileIndex % size;
          return (
            <motion.button
              key={pos}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(pos)}
              className={`relative overflow-hidden ${selected === pos ? "ring-2 ring-amber-400" : ""}`}
              style={{ aspectRatio: "1" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: `${size * 100}% ${size * 100}%`,
                  backgroundPosition: `${(col / (size - 1)) * 100}% ${(row / (size - 1)) * 100}%`,
                }}
              />
            </motion.button>
          );
        })}
      </div>

      {solved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Image src={image} alt="Готово" width={200} height={200} className="mx-auto rounded-lg" />
          <p className="mt-2 text-green-300">Пазл собран!</p>
        </motion.div>
      )}

      <button onClick={init} className="w-full rounded-lg bg-amber-800/60 py-2 text-sm text-amber-200">
        Перемешать заново
      </button>
    </div>
  );
}
