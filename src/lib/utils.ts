export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function normalizeCodeWord(word: string): string {
  return word.trim().toLowerCase().replace(/ё/g, "е");
}

export function getStorageKey(slug: string) {
  return `wedding-quest-progress-${slug}`;
}

export function formatCoupleGenitive(
  brideName: string,
  groomName: string,
  brideGenitive?: string,
  groomGenitive?: string
): string {
  return `${brideGenitive ?? brideName} и ${groomGenitive ?? groomName}`;
}

/** Версия ассетов — увеличивайте при замене картинок, чтобы сбросить кэш браузера */
export const IMAGE_VERSION = "20260612e";

export function img(path: string): string {
  return `${path}?v=${IMAGE_VERSION}`;
}

export function formatWeddingDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
