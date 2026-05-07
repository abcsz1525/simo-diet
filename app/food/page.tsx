"use client";

import { useId, useMemo, useState } from "react";
import {
  ALL_FOODS,
  type Food,
  type FoodCategory,
} from "@/lib/diet-data";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";

const CATEGORY_LABEL: Record<FoodCategory, string> = {
  protein: "Белки",
  fat: "Жиры",
  carb: "Углеводы",
  vegetable: "Овощи",
  fruit: "Фрукты",
  drink: "Напитки",
  spice: "Приправы",
  dairy: "Молочка",
  grain: "Злаки",
  legume: "Бобовые",
  sweetener: "Сладкое",
  nut: "Орехи",
  seafood: "Морепродукты",
};

type Filter = "all" | "allowed" | "forbidden";

export default function FoodPage() {
  const searchId = useId();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return ALL_FOODS.filter((f) => {
      if (filter === "allowed" && f.status !== "allowed") return false;
      if (filter === "forbidden" && f.status !== "forbidden") return false;
      if (!ql) return true;
      const inName = f.name.toLowerCase().includes(ql);
      const inAlias = f.aliases?.some((a) => a.toLowerCase().includes(ql));
      const inReason = f.reason?.toLowerCase().includes(ql);
      return inName || inAlias || inReason;
    });
  }, [q, filter]);

  // Группировка по статусу + категории
  const groups = useMemo(() => {
    const grouped: Record<string, Food[]> = {};
    filtered.forEach((f) => {
      const key =
        f.status === "allowed"
          ? `✓ ${CATEGORY_LABEL[f.category]}`
          : `✕ ${CATEGORY_LABEL[f.category]}`;
      grouped[key] = grouped[key] || [];
      grouped[key].push(f);
    });
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b, "ru"));
  }, [filtered]);

  return (
    <main className="pt-2 pb-6">
      <PageHeader />

      <h1 className="mt-8 mb-2">Можно?</h1>
      <p className="text-lg opacity-80 mb-6">
        Список продуктов на Фазе 1. Введи название — узнаешь сразу.
      </p>

      <div
        className="sticky top-0 -mx-5 px-5 pt-5 pb-3 bg-[#F4C600] z-10 mb-6"
        style={{ boxShadow: "0 6px 0 0 #000" }}
      >
        <label htmlFor={searchId} className="sr-only">
          Поиск продуктов
        </label>
        <input
          id={searchId}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="например: яблоко, гхи, рис…"
          className="w-full h-12 px-4 border-[3px] border-black rounded-[12px] bg-white text-black placeholder:text-black/50 text-base focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:outline-black"
          autoComplete="off"
          spellCheck={false}
          aria-label="Поиск продуктов"
        />
        <div className="flex gap-1.5 mt-3" role="tablist" aria-label="Фильтр">
          {([
            { id: "all", label: "ВСЕ" },
            { id: "allowed", label: "МОЖНО" },
            { id: "forbidden", label: "НЕЛЬЗЯ" },
          ] as { id: Filter; label: string }[]).map((opt) => {
            const active = filter === opt.id;
            return (
              <button
                key={opt.id}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(opt.id)}
                className={cn(
                  "flex-1 h-11 px-3 rounded-full border-[2px] border-black text-xs font-display tracking-wider focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:outline-black",
                  active
                    ? opt.id === "forbidden"
                      ? "bg-[#A0151F] text-white"
                      : "bg-black text-[#F4C600]"
                    : "bg-transparent text-black",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="simo-card-flat text-center py-10">
          <p className="font-display text-3xl mb-2">НИЧЕГО НЕ НАЙДЕНО</p>
          <p className="text-sm opacity-70">
            Попробуй другое слово или сними фильтр.
          </p>
        </div>
      )}

      {groups.map(([title, foods]) => (
        <section key={title} className="mb-8">
          <h2 className="text-2xl mb-3">{title}</h2>
          <div className="grid gap-3">
            {foods.map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

function FoodCard({ food }: { food: Food }) {
  const isForbidden = food.status === "forbidden";
  return (
    <article
      className={cn(
        "relative overflow-hidden border-2 rounded-2xl bg-[#F7F1E1] p-4 flex items-start gap-4",
        isForbidden ? "border-[#A0151F]" : "border-black",
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-2",
          isForbidden ? "bg-[#A0151F]" : "bg-black",
        )}
      />
      <div className="w-14 h-14 grid place-items-center bg-white border-[2px] border-black rounded-xl text-3xl shrink-0 mt-2">
        {food.emoji}
      </div>
      <div className="flex-1 mt-2 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className={cn(
              "simo-kicker inline-block px-2 py-0.5 rounded",
              isForbidden ? "bg-[#A0151F] text-white" : "bg-black text-[#F4C600]",
            )}
          >
            {isForbidden ? "НЕЛЬЗЯ" : "МОЖНО"}
          </span>
          <span className="text-xs opacity-60">
            {CATEGORY_LABEL[food.category]}
          </span>
        </div>
        <h3 className="text-2xl leading-tight break-words">{food.name}</h3>
        {food.reason && (
          <p className="text-sm mt-1 opacity-80">{food.reason}</p>
        )}
      </div>
    </article>
  );
}
