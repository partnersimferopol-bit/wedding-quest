"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  weddingDate: string;
  hiddenAfterDate?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    passed: false,
  };
}

export function CountdownTimer({ weddingDate, hiddenAfterDate }: CountdownTimerProps) {
  const [time, setTime] = useState<TimeLeft>(() => calcTimeLeft(weddingDate));

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft(weddingDate)), 1000);
    return () => clearInterval(id);
  }, [weddingDate]);

  if (time.passed && hiddenAfterDate) return null;

  if (time.passed) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-xl bg-gradient-to-r from-amber-600/30 to-amber-800/30 p-6 text-center"
      >
        <p className="text-2xl font-bold text-amber-100">Сегодня наш особенный день! 🎉</p>
      </motion.div>
    );
  }

  const units = [
    { value: time.days, label: "дней" },
    { value: time.hours, label: "часов" },
    { value: time.minutes, label: "минут" },
    { value: time.seconds, label: "секунд" },
  ];

  return (
    <div className="rounded-xl bg-amber-950/50 p-4">
      <p className="mb-3 text-center text-sm text-amber-300/80">До свадьбы осталось</p>
      <div className="grid grid-cols-4 gap-2">
        {units.map((u) => (
          <div key={u.label} className="rounded-lg bg-amber-900/60 p-2 text-center">
            <motion.span
              key={u.value}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="block text-2xl font-bold text-amber-100 sm:text-3xl"
            >
              {u.value}
            </motion.span>
            <span className="text-xs text-amber-400/70">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
