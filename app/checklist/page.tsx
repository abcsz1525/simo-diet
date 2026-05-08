"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { SimoButton } from "@/components/ui/simo-button";
import {
  useSimoStore,
  todayIso,
  getChallengeDay,
  type MealId,
} from "@/lib/store";
import { DAY_STRUCTURE } from "@/lib/diet-data";
import {
  ideasFor,
  ideaOfDayIndex,
  rerollIdeaIndex,
  type MealIdea,
} from "@/lib/meal-ideas";
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
  const setMealNote = useSimoStore((s) => s.setMealNote);
  const setDayCompleted = useSimoStore((s) => s.setDayCompleted);
  const markCheated = useSimoStore((s) => s.markCheated);
  const unmarkCheated = useSimoStore((s) => s.unmarkCheated);

  const today = todayIso();
  const dayN = Math.max(1, getChallengeDay(startDate, today));
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
          const note = log?.mealNotes?.[meal.id] ?? "";
          return (
            <MealRow
              key={meal.id}
              mealId={meal.id}
              dayN={dayN}
              checked={checked}
              onToggle={() => onToggle(meal.id)}
              icon={mealAccent[meal.id]}
              title={meal.title}
              subtitle={meal.subtitle}
              instruction={meal.instruction}
              optional={meal.optional}
              note={note}
              onNoteChange={(text) => setMealNote(today, meal.id, text)}
            />
          );
        })}
      </ul>

      {/* Срыв / возврат — приглушённая warning-карточка */}
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

/* ----------------------------------------------------------------------------
 * MealRow
 * -------------------------------------------------------------------------- */

interface MealRowProps {
  mealId: MealId;
  dayN: number;
  checked: boolean;
  onToggle: () => void;
  icon: string;
  title: string;
  subtitle: string;
  instruction: string;
  optional: boolean;
  note: string;
  onNoteChange: (text: string) => void;
}

function MealRow({
  mealId,
  dayN,
  checked,
  onToggle,
  icon,
  title,
  subtitle,
  instruction,
  optional,
  note,
  onNoteChange,
}: MealRowProps) {
  const ideas = ideasFor(mealId);
  const initialIdx = ideaOfDayIndex(mealId, dayN);
  const [pickedIdx, setPickedIdx] = useState(initialIdx);
  const currentIdea = pickedIdx >= 0 ? ideas[pickedIdx] : undefined;
  const [ideasOpen, setIdeasOpen] = useState(false);
  const [localNote, setLocalNote] = useState(note);

  const reroll = () => {
    setPickedIdx((prev) => rerollIdeaIndex(mealId, prev));
    haptic.tap();
  };

  // Sync external store updates → local state (e.g. on first mount/hydration)
  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const persistNote = (text: string) => {
    if (text !== note) onNoteChange(text);
  };

  const useIdea = (idea: MealIdea) => {
    const text = `${idea.title}\n${idea.ingredients.join(", ")}`;
    setLocalNote(text);
    onNoteChange(text);
    setIdeasOpen(false);
    haptic.tap();
  };

  return (
    <motion.li
      layout
      className="py-5 border-b-[3px] border-black"
      animate={{ opacity: checked ? 0.65 : 1 }}
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
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-2xl" aria-hidden>
              {icon}
            </span>
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

          {/* Идея дня + раскрывающийся список вариантов */}
          {ideas.length > 0 && (
            <div className="mb-4">
              {currentIdea && !ideasOpen && (
                <div className="simo-card-flat">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="simo-kicker flex items-center gap-1">
                      <span>💡</span>
                      <span>ИДЕЯ НА СЕГОДНЯ</span>
                    </p>
                    <button
                      type="button"
                      onClick={reroll}
                      className="simo-kicker flex items-center gap-1 px-2.5 py-1 -my-1 -mr-1 rounded-md hover:bg-black/5 active:bg-black/10 focus:outline focus:outline-[2px] focus:outline-offset-[1px] focus:outline-black"
                      aria-label="Сгенерировать другое блюдо"
                    >
                      <motion.span
                        key={pickedIdx}
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
                        className="inline-block"
                        aria-hidden
                      >
                        🔄
                      </motion.span>
                      <span>ДРУГОЕ</span>
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIdea.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                    >
                      <p className="font-display text-xl uppercase leading-tight mb-1">
                        {currentIdea.emoji} {currentIdea.title}
                      </p>
                      <p className="text-sm opacity-75">
                        {currentIdea.ingredients.slice(0, 4).join(" · ")}
                        {currentIdea.ingredients.length > 4 ? "…" : ""}
                      </p>
                      {currentIdea.minutes != null && (
                        <p className="simo-kicker text-[10px] mt-2">
                          ⏱ {currentIdea.minutes} МИН
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => useIdea(currentIdea)}
                      className="simo-kicker px-3 py-2 bg-black text-[#F4C600] rounded-md hover:opacity-90 active:translate-y-[1px] focus:outline focus:outline-[2px] focus:outline-offset-[2px] focus:outline-black"
                    >
                      ВЫБРАТЬ ЭТО →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdeasOpen(true);
                        haptic.tap();
                      }}
                      className="simo-kicker px-3 py-2 border-2 border-black rounded-md hover:bg-black/5 active:translate-y-[1px] focus:outline focus:outline-[2px] focus:outline-offset-[2px] focus:outline-black"
                    >
                      ВСЕ {ideas.length} ВАРИАНТОВ
                    </button>
                  </div>
                </div>
              )}

              <AnimatePresence initial={false}>
                {ideasOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="simo-kicker">
                        💡 ВАРИАНТЫ ({ideas.length})
                      </p>
                      <button
                        type="button"
                        onClick={() => setIdeasOpen(false)}
                        className="simo-kicker hover:opacity-60"
                        aria-label="Свернуть варианты"
                      >
                        СВЕРНУТЬ ✕
                      </button>
                    </div>
                    <div className="grid gap-2.5">
                      {ideas.map((idea) => (
                        <IdeaCard
                          key={idea.id}
                          idea={idea}
                          onUse={() => useIdea(idea)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Поле "что я съел" */}
          {mealId !== "morning_water" && (
            <div>
              <label className="simo-kicker mb-2 block">
                ЧТО Я СЪЕЛ {checked && note ? "✓" : ""}
              </label>
              <textarea
                value={localNote}
                onChange={(e) => setLocalNote(e.target.value)}
                onBlur={(e) => persistNote(e.target.value)}
                placeholder={
                  currentIdea
                    ? `Например: ${currentIdea.title}`
                    : "Опиши приём пищи свободно"
                }
                rows={2}
                className="w-full px-3 py-2 border-[2px] border-black rounded-lg bg-white text-sm resize-y focus:outline focus:outline-[3px] focus:outline-offset-[2px] focus:outline-black"
              />
            </div>
          )}
        </div>
      </div>
    </motion.li>
  );
}

/* ----------------------------------------------------------------------------
 * IdeaCard — карточка варианта блюда
 * -------------------------------------------------------------------------- */
function IdeaCard({ idea, onUse }: { idea: MealIdea; onUse: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="border-2 border-black rounded-2xl bg-[#F7F1E1] p-3">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left"
      >
        <div className="flex items-start gap-2.5">
          <span className="text-2xl shrink-0" aria-hidden>
            {idea.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-display text-base uppercase leading-tight">
              {idea.title}
            </p>
            {!expanded && (
              <p className="text-xs opacity-70 mt-1 truncate">
                {idea.ingredients.slice(0, 3).join(" · ")}
              </p>
            )}
            {idea.minutes != null && (
              <p className="simo-kicker text-[10px] mt-1">
                ⏱ {idea.minutes} МИН
                {idea.tags && idea.tags.length > 0
                  ? ` · ${idea.tags[0].toUpperCase()}`
                  : ""}
              </p>
            )}
          </div>
          <span className="text-base opacity-60 mt-0.5" aria-hidden>
            {expanded ? "▴" : "▾"}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 mt-3 border-t-2 border-dashed border-black/20">
              <p className="simo-kicker mb-1.5">ИНГРЕДИЕНТЫ</p>
              <ul className="text-sm leading-relaxed mb-3 list-disc list-inside">
                {idea.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
              <p className="simo-kicker mb-1.5">КАК ГОТОВИТЬ</p>
              <p className="text-sm leading-relaxed mb-3">{idea.steps}</p>
              <SimoButton
                variant="primary"
                size="sm"
                block
                onClick={onUse}
              >
                Это съем — записать в дневник
              </SimoButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
