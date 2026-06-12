"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { MatchingFact } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MatchingGameProps {
  facts: MatchingFact[];
  brideName: string;
  groomName: string;
  onComplete: () => void;
}

export function MatchingGame({ facts, brideName, groomName, onComplete }: MatchingGameProps) {
  const [assignments, setAssignments] = useState<Record<string, "bride" | "groom" | null>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const allAssigned = facts.every((f) => assignments[f.id]);

  const assignTo = (person: "bride" | "groom", factId?: string) => {
    const id = factId || selectedId || draggedId;
    if (!id) return;
    setAssignments((prev) => ({ ...prev, [id]: person }));
    setSelectedId(null);
    setDraggedId(null);
  };

  const handleDrop = (person: "bride" | "groom") => {
    assignTo(person);
  };

  const handleCheck = () => {
    setChecked(true);
    const correct = facts.every((f) => assignments[f.id] === f.person);
    if (correct) setTimeout(onComplete, 2000);
  };

  const isCorrect = (fact: MatchingFact) => assignments[fact.id] === fact.person;

  return (
    <div className="space-y-4">
      <p className="text-sm text-amber-300/80">
        Нажмите на факт, затем на {brideName} или {groomName}. Или перетащите на телефоне/компьютере.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {(["bride", "groom"] as const).map((person) => (
          <button
            key={person}
            type="button"
            onClick={() => selectedId && assignTo(person)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(person)}
            className={cn(
              "min-h-32 rounded-xl border-2 border-dashed p-3 text-left transition",
              selectedId ? "border-amber-400 bg-amber-900/50" : "border-amber-600/50 bg-amber-950/30"
            )}
          >
            <h4 className="mb-2 text-center font-semibold text-amber-200">
              {person === "bride" ? brideName : groomName}
            </h4>
            <div className="space-y-1">
              {facts
                .filter((f) => assignments[f.id] === person)
                .map((f) => (
                  <div
                    key={f.id}
                    className={cn(
                      "rounded-lg px-2 py-1 text-xs",
                      checked && isCorrect(f) && "bg-green-900/40 text-green-200",
                      checked && !isCorrect(f) && "bg-red-900/40 text-red-200",
                      !checked && "bg-amber-800/40 text-amber-100"
                    )}
                  >
                    {f.text}
                  </div>
                ))}
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {facts
          .filter((f) => !assignments[f.id])
          .map((f) => (
            <motion.div
              key={f.id}
              draggable
              onDragStart={() => setDraggedId(f.id)}
              onDragEnd={() => setDraggedId(null)}
              onClick={() => setSelectedId(selectedId === f.id ? null : f.id)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "cursor-pointer rounded-lg border px-4 py-2 text-sm text-amber-100 sm:cursor-grab",
                selectedId === f.id
                  ? "border-amber-400 bg-amber-800/60 ring-2 ring-amber-400/50"
                  : "border-amber-700/50 bg-amber-900/40"
              )}
            >
              {f.text}
            </motion.div>
          ))}
      </div>

      {allAssigned && !checked && (
        <button onClick={handleCheck} className="w-full rounded-lg bg-amber-700 py-3 font-semibold text-white">
          Проверить
        </button>
      )}

      {checked && !facts.every((f) => isCorrect(f)) && (
        <div className="space-y-2">
          <p className="text-center text-red-300">Не все факты на своих местах. Попробуйте ещё!</p>
          <button
            onClick={() => {
              setAssignments({});
              setChecked(false);
              setSelectedId(null);
            }}
            className="w-full rounded-lg bg-amber-800 py-2 text-amber-100"
          >
            Начать заново
          </button>
        </div>
      )}

      {checked && facts.every((f) => isCorrect(f)) && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-300">
          Отлично! Все факты на месте!
        </motion.p>
      )}
    </div>
  );
}
