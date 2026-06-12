"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { WeddingProject } from "@/lib/types";

interface GalleryViewProps {
  wedding: WeddingProject;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: "Все",
  meeting: "Знакомство",
  date: "Свидание",
  travel: "Путешествия",
  proposal: "Предложение",
  wedding: "Свадьба",
};

export function GalleryView({ wedding }: GalleryViewProps) {
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    filter === "all" ? wedding.gallery : wedding.gallery.filter((p) => p.category === filter);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-amber-950 to-amber-900 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-center font-serif text-3xl font-bold text-amber-100">Галерея</h1>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                filter === key ? "bg-amber-700 text-white" : "bg-amber-900/50 text-amber-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((photo, i) => (
            <motion.button
              key={photo.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setLightbox(i)}
              className="relative aspect-square overflow-hidden rounded-xl"
            >
              <Image src={photo.url} alt={photo.caption || ""} fill className="object-cover" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute right-4 top-4 text-white"
              onClick={() => setLightbox(null)}
            >
              <X size={28} />
            </button>
            <button
              className="absolute left-4 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox - 1 + filtered.length) % filtered.length);
              }}
            >
              <ChevronLeft size={32} />
            </button>
            <div className="relative h-[70dvh] w-[90vw] max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <Image
                src={filtered[lightbox].url}
                alt={filtered[lightbox].caption || ""}
                fill
                className="object-contain"
              />
            </div>
            <button
              className="absolute right-4 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lightbox + 1) % filtered.length);
              }}
            >
              <ChevronRight size={32} />
            </button>
            {filtered[lightbox].caption && (
              <p className="absolute bottom-8 text-center text-white">{filtered[lightbox].caption}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
