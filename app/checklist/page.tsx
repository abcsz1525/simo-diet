"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { SimoButton } from "@/components/ui/simo-button";
import {
  useSimoStore,
  todayIso,
  type MealId,
} from "@/lib/store";
import {
  DAY_STRUCTURE,
  ALLOWED_FOODS,
} from "@/lib/diet-data";
import { PageHeader } from "@/components/page-header";
import * as haptic from "@/lib/haptic";

const mealAccent: Record<MealId, string> = {
  morning_water: "💧",
  first: "🍳",
  second: "🥗",
  third: "🍚",
  before_bed: "🍌",
};

export default function ChecklistPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const startDate = useSimoStore((s) => s.startDate);
  const logs = useSimoStore((s) => s.logs);
  const toggleMeal = useSimoStore((s) => s.toggleMeal);
  const setDayCompleted = useSimoStore((s) => s.setDayCompleted);
  const markCheated = useSimoStore((s) => s.markCheated);
  const unmarkCheated = useSimoStore((s) => s.unmarkCheated);

  const today = todayIso();
  const log = logs[today];
  const totalChecked =
    log != null ? Object.values(log.meals).filter(Boolean).length : 0;
  const allChecked = totalChecked === DAY_STRUCTURE.length;

  const handleComplete = () => {
    setDayCompleted(today, true);
    haptic.success();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#F4C600", "#000000", "#E63946"],
    });
  };

  const onToggle = (mealId: MealId) => {
    haptic.tap();
    toggleMeal(today, mealId);
  };

  if (!mounted) return <div className="h-dvh" aria-hidden />;

  return (
    <main className="pt-2 pb-6">
      <PageHeader />

      <h1 className="mt-8 mb-2">Сегодня</h1>
      <p className="text-lg opacity-80 mb-6">
        Отмечай каждый шаг по факту. Перекусы запрещены — только эти приёмы.
      </p>

      <ul className="border-t-[3px] border-black">
        {DAY_STRUCTURE.map((meal) => {
          const checked = log?.meals[meal.id] ?? false;
          return (
            <MealRow
              key={meal.id}
              checked={checked}
              onToggle={() => onToggle(meal.id)}
              icon={mealAccent[meal.id]}
              title={meal.title}
              subtitle={meal.subtitle}
              instruction={meal.instruction}
              optional={meal.optional}
              foodHint={ALLOWED_FOODS.filter((f) =>
                f.meal?.includes(meal.id),
              ).slice(0, 6)}
            />
          );
        })}
      </ul>

      {/* Срыв / возврат — приглушённая warning-карточка, чтобы не перетягивать внимание у главного CTA */}
      <div className="mt-8 simo-card-flat border-l-[6px] border-l-[#A0151F]">
        <p className="simo-kicker mb-2" style={{ color: "#A0151F" }}>
          СРЫВ?
        </p>
        <p className="text-base mb-4">
          Если съел запрещённое — отметь честно. Серия прервётся, но завтра
          начинаешь чисто. Не сдавайся.
        </p>
        {log?.cheated ? (
          <SimoButton
            variant="secondary"
            size="md"
            onClick={() => unmarkCheated(today)}
          >
            Убрать отметку срыва
          </SimoButton>
        ) : (
          <SimoButton
            variant="destructive"
            size="md"
            onClick={() => {
              haptic.warning();
              markCheated(today);
            }}
          >
            Был срыв
          </SimoButton>
        )}
      </div>

      {/* Закрыть день */}
      <div className="mt-8">
        {log?.completed ? (
          <SimoButton
            variant="outline"
            size="lg"
            block
            onClick={() => setDayCompleted(today, false)}
          >
            ✓ День закрыт. Открыть заново
          </SimoButton>
        ) : (
          <SimoButton
            variant="primary"
            size="xl"
            block
            disabled={!allChecked}
            onClick={handleComplete}
          >
            {allChecked
              ? "Закрыть день →"
              : `Отметь все шаги (${totalChecked}/${DAY_STRUCTURE.length})`}
          </SimoButton>
        )}
      </div>
    </main>
  );
}

interface MealRowProps {
  checked: boolean;
  onToggle: () => void;
  icon: string;
  title: string;
  subtitle: string;
  instruction: string;
  optional: boolean;
  foodHint: { id: string; name: string; emoji: string }[];
}

function MealRow({
  checked,
  onToggle,
  icon,
  title,
  subtitle,
  instruction,
  optional,
  foodHint,
}: MealRowProps) {
  return (
    <motion.li
      layout
      className="py-5 border-b-[3px] border-black"
      animate={{ opacity: checked ? 0.5 : 1 }}
    >
      <div className="flex items-start gap-4">
        <button
          className="simo-check"
          data-checked={checked}
          aria-pressed={checked}
          aria-label={`Отметить ${title}`}
          onClick={onToggle}
        >
          {checked && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 9l4 4 8-9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{icon}</span>
            <h3
              className={`text-2xl ${
                checked ? "line-through" : ""
              } leading-tight`}
            >
              {title}
            </h3>
            {optional && (
              <span className="ml-auto inline-block text-[10px] uppercase font-bold tracking-widest border-2 border-black px-2 py-0.5 rounded-full">
                ОПЦ.
              </span>
            )}
          </div>
          <p className="simo-kicker mb-2">{subtitle}</p>
          <p className="text-base mb-3">{instruction}</p>
          {foodHint.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {foodHint.map((f) => (
                <span
                  key={f.id}
                  className="inline-flex items-center gap-1 text-xs bg-black/10 px-2 py-1 rounded-full"
                >
                  <span>{f.emoji}</span>
                  <span>{f.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.li>
  );
}
