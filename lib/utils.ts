import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

/**
 * Нормализует строку для поиска по русским продуктам/блюдам:
 * - lowercase
 * - trim
 * - ё → е (потому что 99% людей пишут "свекла" вместо "свёкла")
 * - й → и (мягкий вариант — "майонез" / "маионез", "креветки" / "креветки")
 *   (только ё→е оставляем — й→и слишком агрессивно, может ломать смысл).
 * Возвращает строку, готовую для подстрочного сравнения.
 */
export function normalizeRu(s: string): string {
  return s.toLowerCase().trim().replace(/ё/g, "е");
}

/** Поиск подстроки с ё/е-нормализацией обеих сторон */
export function ruIncludes(haystack: string, needle: string): boolean {
  if (!needle) return true;
  return normalizeRu(haystack).includes(normalizeRu(needle));
}
