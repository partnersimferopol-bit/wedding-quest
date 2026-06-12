import type { Metadata } from "next";
import { getWeddingBySlug } from "@/lib/demo-data";
import { GameApp } from "@/components/game/GameApp";
import { notFound } from "next/navigation";

import { formatCoupleGenitive } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wedding = getWeddingBySlug(slug);
  if (!wedding) return { title: "Приглашение не найдено" };

  const names = formatCoupleGenitive(
    wedding.brideName,
    wedding.groomName,
    wedding.brideNameGenitive,
    wedding.groomNameGenitive
  );
  const title = `Свадьба ${names}`;
  const description = `Приглашение на свадьбу ${names}. Пройдите приключение по карте сокровищ!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: wedding.coverImage, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [wedding.coverImage],
    },
  };
}

export default async function WeddingPage({ params }: PageProps) {
  const { slug } = await params;
  const wedding = getWeddingBySlug(slug);
  if (!wedding) notFound();

  return <GameApp wedding={wedding} />;
}
