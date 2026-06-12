"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { WeddingProject } from "@/lib/types";

interface StoryTimelineProps {
  wedding: WeddingProject;
}

export function StoryTimeline({ wedding }: StoryTimelineProps) {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-amber-950 to-amber-900 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center font-serif text-3xl font-bold text-amber-100">
          Наша история
        </h1>

        <div className="relative">
          <div className="absolute left-6 top-0 h-full w-0.5 bg-amber-700/50 sm:left-1/2" />

          {wedding.storyBlocks.map((block, i) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative mb-12 flex ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
            >
              <div className="absolute left-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-amber-500 sm:left-1/2" />

              <div className={`ml-12 sm:ml-0 sm:w-1/2 ${i % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8"}`}>
                <h2 className="font-serif text-xl font-bold text-amber-200">{block.title}</h2>
                <p className="mt-2 text-amber-300/80">{block.content}</p>
                {block.photos.length > 0 && (
                  <div className={`mt-3 flex gap-2 ${i % 2 === 0 ? "sm:justify-end" : ""}`}>
                    {block.photos.map((photo, j) => (
                      <div key={j} className="relative h-24 w-24 overflow-hidden rounded-lg">
                        <Image src={photo} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
