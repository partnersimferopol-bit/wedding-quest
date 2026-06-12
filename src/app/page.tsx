import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/lib/images";

export default function HomePage() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0">
        <Image src={IMAGES.map} alt="" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/90 to-amber-900/95" />
      </div>

      <div className="relative z-10 max-w-lg text-center">
        <h1 className="font-serif text-4xl font-bold text-amber-100 sm:text-5xl">
          Wedding Quest
        </h1>
        <p className="mt-4 text-lg text-amber-300/80">
          Интерактивные свадебные приглашения — приключение по карте сокровищ
        </p>

        <Link
          href="/maria-dmitry?restart=1"
          className="mt-8 inline-block rounded-full bg-gradient-to-r from-amber-600 to-amber-800 px-10 py-4 text-lg font-semibold text-white shadow-xl transition hover:from-amber-500 hover:to-amber-700"
        >
          Демо: Мария & Дмитрий
        </Link>

        <Link
          href="/admin"
          className="mt-4 block text-sm text-amber-400/60 hover:text-amber-300"
        >
          Административная панель
        </Link>
      </div>
    </div>
  );
}
