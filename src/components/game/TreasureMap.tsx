"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { IMAGES } from "@/lib/images";
import type { Location } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MapPin, Lock, Check } from "lucide-react";

export const SHIP_SAIL_DURATION = 3.8;

const SHIP_OFFSET = { x: 4, y: -3 };

interface TreasureMapProps {
  locations: Location[];
  currentIndex: number;
  completedIds: string[];
  onLocationClick: (location: Location, index: number) => void;
  isAccessible: (index: number) => boolean;
  isPlayable: (index: number, locationId: string) => boolean;
  shipPosition: { x: number; y: number };
  shipTargetPosition: { x: number; y: number } | null;
  animatingShip: boolean;
}

function getHeading(from: { x: number; y: number }, to: { x: number; y: number }) {
  return Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);
}

function toShipStyle(pos: { x: number; y: number }) {
  return {
    left: `${pos.x + SHIP_OFFSET.x}%`,
    top: `${pos.y + SHIP_OFFSET.y}%`,
  };
}

function getSailArc(from: { x: number; y: number }, to: { x: number; y: number }) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const arc = Math.min(14, len * 0.4);
  const midXArc = midX + (-dy / len) * arc;
  const midYArc = midY + (dx / len) * arc;

  return {
    left: [
      `${from.x + SHIP_OFFSET.x}%`,
      `${midXArc + SHIP_OFFSET.x}%`,
      `${to.x + SHIP_OFFSET.x}%`,
    ],
    top: [
      `${from.y + SHIP_OFFSET.y}%`,
      `${midYArc + SHIP_OFFSET.y}%`,
      `${to.y + SHIP_OFFSET.y}%`,
    ],
  };
}

export function TreasureMap({
  locations,
  currentIndex,
  completedIds,
  onLocationClick,
  isAccessible,
  isPlayable,
  shipPosition,
  shipTargetPosition,
  animatingShip,
}: TreasureMapProps) {
  const pathD = locations
    .map((loc, i) => `${i === 0 ? "M" : "L"} ${loc.mapX} ${loc.mapY}`)
    .join(" ");

  const isSailing = animatingShip && shipTargetPosition !== null;
  const lookAtIndex = Math.min(currentIndex + 1, locations.length - 1);
  const lookAt = locations[lookAtIndex] ?? locations[0];
  const idleHeading = getHeading(shipPosition, { x: lookAt.mapX, y: lookAt.mapY });
  const sailHeading =
    isSailing && shipTargetPosition
      ? getHeading(shipPosition, shipTargetPosition)
      : idleHeading;

  const handleLocationClick = (loc: Location, index: number) => {
    if (!isAccessible(index)) return;
    onLocationClick(loc, index);
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border-4 border-amber-800/60 shadow-2xl">
      <div className="relative aspect-[572/1024] w-full">
        <Image src={IMAGES.map} alt="Карта сокровищ" fill className="object-contain" priority />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d={pathD}
            fill="none"
            stroke="rgba(212,175,55,0.6)"
            strokeWidth="0.4"
            strokeDasharray="1.5 1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
        </svg>

        <motion.div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
          animate={
            isSailing && shipTargetPosition
              ? getSailArc(shipPosition, shipTargetPosition)
              : toShipStyle(shipPosition)
          }
          transition={
            isSailing
              ? {
                  duration: SHIP_SAIL_DURATION,
                  ease: [0.42, 0, 0.18, 1],
                  times: [0, 0.48, 1],
                }
              : { duration: 0.6, ease: "easeOut" }
          }
        >
          <motion.div
            animate={
              isSailing
                ? {
                    rotate: [
                      sailHeading - 6,
                      sailHeading + 3,
                      sailHeading - 2,
                      sailHeading + 4,
                      sailHeading,
                    ],
                    y: [0, -6, 3, -4, 0],
                    x: [0, 2, -1, 1, 0],
                  }
                : {
                    rotate: [
                      idleHeading - 3,
                      idleHeading + 2,
                      idleHeading - 1,
                      idleHeading + 3,
                      idleHeading - 3,
                    ],
                    y: [0, -5, 2, -3, 0],
                  }
            }
            transition={
              isSailing
                ? {
                    duration: SHIP_SAIL_DURATION,
                    ease: "easeInOut",
                    times: [0, 0.25, 0.55, 0.8, 1],
                  }
                : {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            className="relative h-[4.5rem] w-[4.5rem] sm:h-[6.5rem] sm:w-[6.5rem]"
          >
            <Image
              src={IMAGES.ship}
              alt="Корабль"
              fill
              className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
            />
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute bottom-2 right-2 z-10 h-16 w-16 opacity-80 sm:h-24 sm:w-24">
          <Image src={IMAGES.compass} alt="Компас" fill className="object-contain" />
        </div>

        {locations.map((loc, index) => {
          const accessible = isAccessible(index);
          const completed = completedIds.includes(loc.id);
          const playable = isPlayable(index, loc.id);
          const isCurrent = index === currentIndex && !completed;

          return (
            <motion.button
              key={loc.id}
              type="button"
              initial={{ scale: 0 }}
              animate={{ scale: playable ? 1.1 : 1 }}
              transition={{ delay: 0.3 + index * 0.15 }}
              onClick={() => handleLocationClick(loc, index)}
              disabled={!accessible}
              aria-label={`${loc.name}${!accessible ? " — заблокировано" : completed ? " — пройдено" : ""}`}
              className={cn(
                "absolute z-30 flex min-h-[56px] min-w-[56px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center p-2 touch-manipulation",
                !accessible && "cursor-not-allowed opacity-40",
                accessible && "cursor-pointer hover:scale-105 active:scale-95"
              )}
              style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
            >
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border-2 shadow-lg sm:h-12 sm:w-12",
                  completed && "border-green-500 bg-green-900/90",
                  isCurrent && "border-amber-400 bg-amber-700/90 ring-2 ring-amber-300/50 animate-pulse",
                  !completed && !isCurrent && accessible && "border-amber-600 bg-amber-900/90",
                  !accessible && "border-gray-600 bg-gray-900/80"
                )}
              >
                {!accessible ? (
                  <Lock size={16} className="text-gray-400" />
                ) : completed ? (
                  <Check size={18} className="text-green-300" />
                ) : (
                  <MapPin size={20} className="text-amber-200" />
                )}
              </div>
              <span
                className={cn(
                  "mt-1 max-w-24 text-center text-[10px] font-medium leading-tight drop-shadow-lg sm:max-w-28 sm:text-xs",
                  isCurrent ? "font-bold text-amber-100" : "text-amber-200/80"
                )}
              >
                {loc.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
