"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  useSimoStore,
  todayIso,
  getChallengeDay,
} from "@/lib/store";
import { CHALLENGE_DURATION_DAYS } from "@/lib/diet-data";

/**
 * Унифицированная шапка для не-главных страниц.
 * Слева: ссылка ← НА ГЛАВНУЮ
 * Справа: текущий день челленджа
 */
export function PageHeader() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const startDate = useSimoStore((s) => s.startDate);
  const day = Math.max(1, getChallengeDay(startDate, todayIso()));

  return (
    <div className="flex items-center justify-between gap-3 mb-2 min-h-[28px]">
      <Link
        href="/"
        className="simo-kicker hover:text-black/70 active:translate-x-[-1px] transition-transform"
      >
        ← НА ГЛАВНУЮ
      </Link>
      <span
        className="simo-kicker tabular-nums"
        style={{ visibility: mounted ? "visible" : "hidden" }}
      >
        ДЕНЬ {day} / {CHALLENGE_DURATION_DAYS}
      </span>
    </div>
  );
}
