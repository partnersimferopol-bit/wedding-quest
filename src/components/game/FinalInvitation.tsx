"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { WeddingProject } from "@/lib/types";
import { formatWeddingDate } from "@/lib/utils";
import { IMAGES } from "@/lib/images";
import { CountdownTimer } from "./CountdownTimer";
import { RSVPForm } from "@/components/rsvp/RSVPForm";
import { MapPin, Clock, ExternalLink } from "lucide-react";

interface FinalInvitationProps {
  wedding: WeddingProject;
  showAnimation?: boolean;
}

export function FinalInvitation({ wedding, showAnimation = false }: FinalInvitationProps) {
  const [showRSVP, setShowRSVP] = useState(false);
  const [chestOpened, setChestOpened] = useState(!showAnimation);

  const mapUrl = `https://yandex.ru/maps/?pt=${wedding.coordinates.lng},${wedding.coordinates.lat}&z=16&l=map`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-2xl px-4 py-8"
    >
      {showAnimation && !chestOpened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 text-center"
          onAnimationComplete={() => setTimeout(() => setChestOpened(true), 3000)}
        >
          <motion.div
            animate={{ x: [0, 20, 0], rotate: [-2, 2, 0] }}
            transition={{ duration: 2 }}
            className="relative mx-auto mb-4 h-32 w-32"
          >
            <Image src={IMAGES.ship} alt="Корабль" fill className="object-contain drop-shadow-xl" />
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="relative mx-auto h-40 w-40"
          >
            <Image src={IMAGES.chestClosed} alt="Сундук" fill className="object-contain" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            onAnimationComplete={() => setChestOpened(true)}
          >
            <div className="relative mx-auto h-40 w-40">
              <Image src={IMAGES.chestOpen} alt="Открытый сундук" fill className="object-contain" />
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-amber-400/30 blur-2xl"
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {chestOpened && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden rounded-2xl border-2 border-amber-600/50 bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 shadow-2xl"
        >
          <div className="relative h-48 sm:h-64">
            <Image
              src={IMAGES.islandWedding}
              alt="Приглашение"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-950 via-transparent to-transparent" />
          </div>

          <div className="p-6 sm:p-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center font-serif text-3xl font-bold text-amber-100 sm:text-4xl"
            >
              {wedding.brideName} & {wedding.groomName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-center text-lg text-amber-300"
            >
              приглашают вас на свадьбу
            </motion.p>

            <div className="my-6 h-px bg-amber-700/50" />

            <div className="space-y-4 text-amber-200">
              <div className="flex items-start gap-3">
                <Clock className="mt-1 flex-shrink-0 text-amber-500" size={20} />
                <div>
                  <p className="font-semibold">{formatWeddingDate(wedding.weddingDate)}</p>
                  <p className="text-amber-300/80">Начало в {wedding.weddingTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-1 flex-shrink-0 text-amber-500" size={20} />
                <div>
                  <p className="font-semibold">{wedding.address}</p>
                  <p className="mt-1 text-sm text-amber-300/70">{wedding.venueDescription}</p>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300"
                  >
                    Открыть карту проезда <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>

            {wedding.showCountdown && (
              <div className="mt-6">
                <CountdownTimer
                  weddingDate={wedding.weddingDate}
                  hiddenAfterDate={wedding.countdownHiddenAfterDate}
                />
              </div>
            )}

            {wedding.dressCode && (
              <div className="mt-6 rounded-xl bg-amber-950/40 p-4">
                <h3 className="font-semibold text-amber-200">Дресс-код</h3>
                <div className="mt-2 flex gap-2">
                  {wedding.dressCode.palette.map((color) => (
                    <div
                      key={color}
                      className="h-8 w-8 rounded-full border border-amber-700/50"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-amber-300/80">{wedding.dressCode.recommendations}</p>
              </div>
            )}

            {wedding.wishList && (
              <div className="mt-6 rounded-xl bg-amber-950/40 p-4">
                <h3 className="font-semibold text-amber-200">Wish List</h3>
                <p className="mt-2 text-sm text-amber-300/80">{wedding.wishList.giftPreferences}</p>
                {wedding.wishList.colorPreferences && (
                  <p className="mt-1 text-sm text-amber-300/70">
                    Цветы: {wedding.wishList.colorPreferences}
                  </p>
                )}
              </div>
            )}

            <p className="mt-4 text-sm text-amber-400/70">
              Контакты организатора: {wedding.organizerContacts}
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRSVP(true)}
              className="mt-8 w-full rounded-full bg-gradient-to-r from-amber-600 to-amber-800 py-4 text-lg font-semibold text-white shadow-lg"
            >
              Подтвердить участие
            </motion.button>
          </div>
        </motion.div>
      )}

      {showRSVP && (
        <RSVPForm wedding={wedding} onClose={() => setShowRSVP(false)} />
      )}
    </motion.div>
  );
}
