"use client";

import { motion } from "framer-motion";
import { IMAGES } from "@/lib/images";
import Image from "next/image";

interface WelcomeScreenProps {
  coupleGenitive: string;
  onStart: () => void;
}

export function WelcomeScreen({ coupleGenitive, onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12"
    >
      <div className="absolute inset-0">
        <Image
          src={IMAGES.map}
          alt="Карта сокровищ"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/70 via-amber-900/60 to-amber-950/80" />
      </div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 max-w-lg text-center"
      >
        <div className="mb-8 overflow-hidden rounded-2xl border-2 border-amber-700/50 shadow-2xl">
          <Image
            src={IMAGES.title}
            alt="Путешествие"
            width={500}
            height={350}
            className="w-full"
            priority
          />
        </div>

        <h1 className="font-serif text-3xl font-bold text-amber-100 sm:text-4xl">
          Добро пожаловать в путешествие!
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-amber-200/90">
          Перед вами карта самого важного приключения в жизни{" "}
          <span className="font-semibold text-amber-100">{coupleGenitive}</span>.
          Следуйте маршруту и найдите место, где начнётся новая глава их истории.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="mt-10 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-amber-900/50 transition hover:from-amber-500 hover:to-amber-700"
        >
          Начать путешествие
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
