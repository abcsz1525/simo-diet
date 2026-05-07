"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SimoButton } from "@/components/ui/simo-button";
import { SimoStamp } from "@/components/simo-stamp";
import { AnimatedDayCounter } from "@/components/animated-day-counter";
import {
  useSimoStore,
  todayIso,
  getChallengeDay,
  getProgress,
  daysRemaining,
  getStreak,
  isoToDate,
} from "@/lib/store";
import {
  CHALLENGE_DURATION_DAYS,
  MILESTONES,
  MOTIVATIONAL_QUOTES,
  DAY_STRUCTURE,
} from "@/lib/diet-data";

function nextMilestone(day: number) {
  return MILESTONES.find((m) => m.day >= day) ?? MILESTONES[MILESTONES.length - 1];
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const startDate = useSimoStore((s) => s.startDate);
  const logs = useSimoStore((s) => s.logs);

  const today = todayIso();
  const day = getChallengeDay(startDate, today);
  const progress = getProgress(startDate, today);
  const remaining = daysRemaining(startDate, today);
  const streak = getStreak(logs, startDate, today);

  const todayLog = logs[today];
  const checkedToday = todayLog
    ? Object.values(todayLog.meals).filter(Boolean).length
    : 0;
  const totalMealsToday = DAY_STRUCTURE.length;

  const quote = useMemo(() => {
    const idx = (day - 1 + 30) % MOTIVATIONAL_QUOTES.length;
    return MOTIVATIONAL_QUOTES[Math.max(0, idx)];
  }, [day]);

  const milestone = nextMilestone(Math.max(1, day));

  const beforeStart = day < 1;
  const finished = day > CHALLENGE_DURATION_DAYS;

  if (!mounted) {
    return <div className="h-dvh" aria-hidden />;
  }

  return (
    <main className="pt-2 pb-6">
      <header className="flex items-center justify-between h-14 mb-4">
        <span className="font-display text-xl xs:text-2xl tracking-tight">
          SIMO · 30
        </span>
        <SimoStamp size={56} className="sm:hidden" />
        <SimoStamp size={64} className="hidden sm:inline-grid" />
      </header>

      {beforeStart ? (
        <BeforeStart startDate={startDate} />
      ) : finished ? (
        <Finished />
      ) : (
        <>
          <section className="text-center mt-8 mb-6">
            <p className="simo-kicker mb-3">ДЕНЬ</p>
            <div className="flex items-center justify-center">
              <AnimatedDayCounter value={day} digits={2} />
            </div>
            <p className="simo-kicker mt-3">из {CHALLENGE_DURATION_DAYS}</p>
          </section>

          <div
            className="h-4 bg-transparent border-[3px] border-black rounded-full overflow-hidden mb-2"
            role="progressbar"
            aria-label="Прогресс челленджа"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className="h-full bg-black"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            />
          </div>
          <div className="flex justify-between simo-kicker mb-6">
            <span>{Math.round(progress * 100)}% пройдено</span>
            <span>осталось {remaining} дн.</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <StatCard label="Серия" value={`${streak}`} sub="дней без срывов" />
            <StatCard
              label="Сегодня"
              value={`${checkedToday}/${totalMealsToday}`}
              sub="приёмов"
            />
          </div>

          <div className="simo-block mb-5">
            <p className="text-xs tracking-widest opacity-70 mb-2 normal-case font-sans font-semibold">
              ЦИТАТА ДНЯ
            </p>
            <p className="text-[#F4C600] text-2xl leading-tight">{quote}</p>
          </div>

          <div className="simo-card-flat mb-5 flex items-center gap-4">
            <div className="text-4xl">{milestone.emoji}</div>
            <div className="flex-1">
              <p className="simo-kicker mb-1">СЛЕДУЮЩАЯ ВЕХА</p>
              <p className="font-display text-xl uppercase">
                {milestone.title} — день {milestone.day}
              </p>
              <p className="text-sm opacity-80 mt-1 normal-case">
                {milestone.quote}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <SimoButton asChild variant="primary" size="xl" block>
              <Link href="/checklist">Открыть чек-лист дня →</Link>
            </SimoButton>
            <div className="grid grid-cols-2 gap-3">
              <SimoButton asChild variant="secondary" size="md" block>
                <Link href="/journal">Дневник</Link>
              </SimoButton>
              <SimoButton asChild variant="outline" size="md" block>
                <Link href="/food">Можно?</Link>
              </SimoButton>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="simo-card-flat px-3 xs:px-4 sm:px-5 py-4">
      <p className="simo-kicker mb-1">{label}</p>
      <p className="font-display text-4xl xs:text-5xl leading-none tabular-nums">
        {value}
      </p>
      {sub && (
        <p className="text-[11px] xs:text-xs mt-2 opacity-70 leading-tight">
          {sub}
        </p>
      )}
    </div>
  );
}

function BeforeStart({ startDate }: { startDate: string }) {
  const start = isoToDate(startDate);
  const formatted = start.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <section className="my-12 text-center">
      <p className="simo-kicker mb-2">СТАРТ</p>
      <h1 className="text-4xl xs:text-5xl sm:text-6xl mb-4 leading-[0.95]">
        {formatted}
      </h1>
      <p className="text-lg max-w-md mx-auto opacity-80">
        Челлендж ещё не начался. Подготовь холодильник, изучи правила и продукты.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3">
        <SimoButton asChild variant="primary" size="lg" block>
          <Link href="/rules">10 правил</Link>
        </SimoButton>
        <SimoButton asChild variant="secondary" size="lg" block>
          <Link href="/food">Продукты</Link>
        </SimoButton>
      </div>
    </section>
  );
}

function Finished() {
  return (
    <section className="my-12 text-center">
      <div className="text-7xl mb-4">👑</div>
      <h1 className="text-6xl mb-4">30 ИЗ 30</h1>
      <p className="text-lg max-w-md mx-auto opacity-80 mb-8">
        Фаза 1 (Элиминация) завершена. Можно переходить к Фазе 2 — Восстановление.
      </p>
      <SimoButton asChild variant="primary" size="lg" block>
        <Link href="/journal">Открыть дневник</Link>
      </SimoButton>
    </section>
  );
}
