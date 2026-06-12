"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuizGameProps {
  quiz: QuizQuestion;
  onComplete: () => void;
}

export function QuizGame({ quiz, onComplete }: QuizGameProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (optionId: string, correct: boolean) => {
    if (showResult) return;
    setSelected(optionId);
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      setTimeout(onComplete, 2000);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-100">{quiz.question}</h3>
      <div className="grid gap-3">
        {quiz.options.map((opt) => (
          <motion.button
            key={opt.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(opt.id, opt.isCorrect)}
            disabled={showResult}
            className={cn(
              "rounded-xl border-2 px-4 py-3 text-left transition",
              showResult && opt.id === selected && opt.isCorrect && "border-green-500 bg-green-900/40",
              showResult && opt.id === selected && !opt.isCorrect && "border-red-500 bg-red-900/40",
              showResult && opt.isCorrect && opt.id !== selected && "border-green-500/50 bg-green-900/20",
              !showResult && "border-amber-700/50 bg-amber-950/40 hover:border-amber-500 hover:bg-amber-900/40"
            )}
          >
            {opt.text}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg p-3 text-center text-sm",
              isCorrect ? "bg-green-900/30 text-green-200" : "bg-red-900/30 text-red-200"
            )}
          >
            {isCorrect ? quiz.successMessage : "Попробуйте ещё раз!"}
          </motion.p>
        )}
      </AnimatePresence>

      {showResult && !isCorrect && (
        <button
          onClick={() => {
            setSelected(null);
            setShowResult(false);
          }}
          className="w-full rounded-lg bg-amber-800 py-2 text-amber-100"
        >
          Попробовать снова
        </button>
      )}
    </div>
  );
}
