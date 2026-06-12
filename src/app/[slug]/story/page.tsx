import Link from "next/link";
import { getWeddingBySlug } from "@/lib/demo-data";
import { StoryTimeline } from "@/components/story/StoryTimeline";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const wedding = getWeddingBySlug(slug);
  if (!wedding) notFound();

  return (
    <>
      <Link
        href={`/${slug}`}
        className="fixed left-4 top-4 z-50 flex items-center gap-1 rounded-full bg-amber-900/80 px-3 py-2 text-sm text-amber-200"
      >
        <ArrowLeft size={16} /> Назад к карте
      </Link>
      <StoryTimeline wedding={wedding} />
    </>
  );
}
