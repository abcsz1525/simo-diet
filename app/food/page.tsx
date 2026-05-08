"use client";

import { useId, useMemo, useState } from "react";
import {
  ALL_FOODS,
  type Food,
  type FoodCategory,
} from "@/lib/diet-data";
import { DISHES, type Dish, type DishVerdict } from "@/lib/dishes";
import { PageHeader } from "@/components/page-header";
import { cn, ruIncludes, normalizeRu } from "@/lib/utils";

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

type Mode = "products" | "dishes";
type Filter = "all" | "allowed" | "forbidden";
type DishFilter = "all" | "allowed" | "adaptable" | "forbidden";

export default function FoodPage() {
  const searchId = useId();
  const [mode, setMode] = useState<Mode>("products");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [dishFilter, setDishFilter] = useState<DishFilter>("all");

  /* ---------- Products ---------- */
  const filteredFoods = useMemo(() => {
    const ql = normalizeRu(q);
    return ALL_FOODS.filter((f) => {
      if (filter === "allowed" && f.status !== "allowed") return false;
      if (filter === "forbidden" && f.status !== "forbidden") return false;
      if (!ql) return true;
      const inName = ruIncludes(f.name, ql);
      const inAlias = f.aliases?.some((a) => ruIncludes(a, ql));
      const inReason = f.reason ? ruIncludes(f.reason, ql) : false;
      const inCategory = ruIncludes(CATEGORY_LABEL[f.category], ql);
      return inName || inAlias || inReason || inCategory;
    });
  }, [q, filter]);

  const foodGroups = useMemo(() => {
    const grouped: Record<string, Food[]> = {};
    filteredFoods.forEach((f) => {
      const key =
        f.status === "allowed"
          ? `✓ ${CATEGORY_LABEL[f.category]}`
          : `✕ ${CATEGORY_LABEL[f.category]}`;
      grouped[key] = grouped[key] || [];
      grouped[key].push(f);
    });
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b, "ru"));
  }, [filteredFoods]);

  /* ---------- Dishes ---------- */
  const filteredDishes = useMemo(() => {
    const ql = normalizeRu(q);
    return DISHES.filter((d) => {
      if (dishFilter !== "all" && d.verdict !== dishFilter) return false;
      if (!ql) return true;
      const inNames = d.names.some((n) => ruIncludes(n, ql));
      const inComp = ruIncludes(d.composition, ql);
      const inProblems = d.problems?.some((p) => ruIncludes(p, ql));
      return inNames || inComp || inProblems;
    });
  }, [q, dishFilter]);

  const dishGroups = useMemo(() => {
    const order: DishVerdict[] = ["allowed", "adaptable", "forbidden"];
    const grouped: Record<DishVerdict, Dish[]> = {
      allowed: [],
      adaptable: [],
      forbidden: [],
    };
    filteredDishes.forEach((d) => grouped[d.verdict].push(d));
    return order
      .filter((v) => grouped[v].length > 0)
      .map((v) => [v, grouped[v]] as const);
  }, [filteredDishes]);

  const inputPlaceholder =
    mode === "products"
      ? "например: яблоко, гхи, рис, свекла…"
      : "например: борщ, оливье, плов, шашлык…";

  return (
    <main className="pt-2 pb-6">
      <PageHeader />

      <h1 className="mt-8 mb-2">Можно?</h1>
      <p className="text-lg opacity-80 mb-6">
        Введи название продукта или блюда — узнаешь сразу.
      </p>

      <div
        className="sticky top-0 -mx-5 px-5 pt-5 pb-3 bg-[#F4C600] z-10 mb-6"
        style={{ boxShadow: "0 6px 0 0 #000" }}
      >
        {/* Mode switch */}
        <div
          className="flex gap-1.5 mb-3"
          role="tablist"
          aria-label="Что искать"
        >
          {(
            [
              { id: "products", label: "ПРОДУКТЫ" },
              { id: "dishes", label: "БЛЮДА" },
            ] as { id: Mode; label: string }[]
          ).map((opt) => {
            const active = mode === opt.id;
            return (
              <button
                key={opt.id}
                role="tab"
                aria-selected={active}
                onClick={() => setMode(opt.id)}
                className={cn(
                  "flex-1 h-11 px-3 rounded-[12px] border-[2px] border-black text-xs font-sans font-bold uppercase tracking-[0.14em] focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:outline-black",
                  active ? "bg-black" : "bg-transparent",
                )}
                style={{ color: active ? "#F4C600" : "#000000" }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <label htmlFor={searchId} className="sr-only">
          {mode === "products" ? "Поиск продуктов" : "Поиск блюд"}
        </label>
        <input
          id={searchId}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={inputPlaceholder}
          className="w-full h-12 px-4 border-[3px] border-black rounded-[12px] bg-white text-black placeholder:text-black/50 text-base focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:outline-black"
          autoComplete="off"
          spellCheck={false}
          aria-label={mode === "products" ? "Поиск продуктов" : "Поиск блюд"}
        />

        {/* Status filter — different for products vs dishes */}
        {mode === "products" ? (
          <div
            className="flex gap-1.5 mt-3"
            role="tablist"
            aria-label="Фильтр продуктов"
          >
            {(
              [
                { id: "all", label: "ВСЕ" },
                { id: "allowed", label: "МОЖНО" },
                { id: "forbidden", label: "НЕЛЬЗЯ" },
              ] as { id: Filter; label: string }[]
            ).map((opt) => {
              const active = filter === opt.id;
              return (
                <button
                  key={opt.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(opt.id)}
                  className={cn(
                    "flex-1 h-11 px-3 rounded-full border-[2px] border-black text-xs font-sans font-bold uppercase tracking-wider focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:outline-black",
                    active
                      ? opt.id === "forbidden"
                        ? "bg-[#A0151F]"
                        : "bg-black"
                      : "bg-transparent",
                  )}
                  style={{
                    color: active
                      ? opt.id === "forbidden"
                        ? "#FFFFFF"
                        : "#F4C600"
                      : "#000000",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div
            className="flex gap-1.5 mt-3 flex-wrap"
            role="tablist"
            aria-label="Фильтр блюд"
          >
            {(
              [
                { id: "all", label: "ВСЕ" },
                { id: "allowed", label: "МОЖНО" },
                { id: "adaptable", label: "АДАПТИРУЙ" },
                { id: "forbidden", label: "НЕЛЬЗЯ" },
              ] as { id: DishFilter; label: string }[]
            ).map((opt) => {
              const active = dishFilter === opt.id;
              const isAdapt = opt.id === "adaptable";
              const isForbid = opt.id === "forbidden";
              return (
                <button
                  key={opt.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setDishFilter(opt.id)}
                  className={cn(
                    "flex-1 min-w-[22%] h-11 px-2 rounded-full border-[2px] border-black text-[11px] font-sans font-bold uppercase tracking-wider focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:outline-black",
                    active
                      ? isForbid
                        ? "bg-[#A0151F]"
                        : isAdapt
                        ? "bg-[#F4C600]"
                        : "bg-black"
                      : "bg-transparent",
                  )}
                  style={{
                    color: active
                      ? isForbid
                        ? "#FFFFFF"
                        : isAdapt
                        ? "#000000"
                        : "#F4C600"
                      : "#000000",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Empty states */}
      {mode === "products" && filteredFoods.length === 0 && (
        <EmptyState />
      )}
      {mode === "dishes" && filteredDishes.length === 0 && (
        <EmptyState />
      )}

      {/* Products list */}
      {mode === "products" &&
        foodGroups.map(([title, foods]) => (
          <section key={title} className="mb-8">
            <h2 className="text-2xl mb-3">{title}</h2>
            <div className="grid gap-3">
              {foods.map((f) => (
                <FoodCard key={f.id} food={f} />
              ))}
            </div>
          </section>
        ))}

      {/* Dishes list */}
      {mode === "dishes" &&
        dishGroups.map(([verdict, dishes]) => (
          <section key={verdict} className="mb-8">
            <h2 className="text-2xl mb-3">
              {verdict === "allowed"
                ? `✓ Можно как есть · ${dishes.length}`
                : verdict === "adaptable"
                ? `⚙ Можно с адаптацией · ${dishes.length}`
                : `✕ Нельзя · ${dishes.length}`}
            </h2>
            <div className="grid gap-3">
              {dishes.map((d) => (
                <DishCard key={d.id} dish={d} />
              ))}
            </div>
          </section>
        ))}
    </main>
  );
}

/* ----------------------------------------------------------------------------
 * UI
 * -------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <div className="simo-card-flat text-center py-10">
      <p className="font-display text-3xl mb-2">НИЧЕГО НЕ НАЙДЕНО</p>
      <p className="text-sm opacity-70">
        Попробуй другое слово или сними фильтр.
      </p>
    </div>
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
              "inline-block px-2 py-0.5 rounded font-sans font-bold uppercase tracking-[0.14em] text-[11px]",
              isForbidden ? "bg-[#A0151F]" : "bg-black",
            )}
            style={{ color: isForbidden ? "#FFFFFF" : "#F4C600" }}
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

function DishCard({ dish }: { dish: Dish }) {
  const isForbidden = dish.verdict === "forbidden";
  const isAdaptable = dish.verdict === "adaptable";

  const stripeColor = isForbidden
    ? "#A0151F"
    : isAdaptable
    ? "#000000"
    : "#000000";
  const borderColor = isForbidden
    ? "#A0151F"
    : isAdaptable
    ? "#F4C600"
    : "#000000";

  const badgeBg = isForbidden
    ? "#A0151F"
    : isAdaptable
    ? "#F4C600"
    : "#000000";
  const badgeColor = isForbidden
    ? "#FFFFFF"
    : isAdaptable
    ? "#000000"
    : "#F4C600";
  const badgeText = isForbidden
    ? "НЕЛЬЗЯ"
    : isAdaptable
    ? "С АДАПТАЦИЕЙ"
    : "МОЖНО";

  return (
    <article
      className="relative overflow-hidden border-2 rounded-2xl bg-[#F7F1E1] p-4"
      style={{ borderColor }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{ background: stripeColor }}
      />
      <div className="flex items-start gap-4 pt-2">
        <div className="w-14 h-14 grid place-items-center bg-white border-[2px] border-black rounded-xl text-3xl shrink-0">
          {dish.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="inline-block px-2 py-0.5 rounded font-sans font-bold uppercase tracking-[0.14em] text-[11px]"
              style={{ background: badgeBg, color: badgeColor }}
            >
              {badgeText}
            </span>
          </div>
          <h3 className="text-2xl leading-tight break-words">
            {dish.names[0]}
          </h3>
        </div>
      </div>

      <div className="mt-3">
        <p className="font-sans font-bold uppercase tracking-[0.14em] text-[10px] mb-1 opacity-70">
          СОСТАВ
        </p>
        <p className="text-sm leading-snug">{dish.composition}</p>
      </div>

      {dish.problems && dish.problems.length > 0 && (
        <div className="mt-3">
          <p
            className="font-sans font-bold uppercase tracking-[0.14em] text-[10px] mb-1"
            style={{ color: "#A0151F" }}
          >
            ЧТО ЗАПРЕЩЕНО
          </p>
          <ul className="text-sm leading-snug list-disc list-inside space-y-0.5">
            {dish.problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {dish.adapt && (
        <div
          className="mt-3 rounded-lg p-3 border-2 border-dashed"
          style={{
            borderColor: isAdaptable ? "#000000" : "rgba(0,0,0,0.2)",
            background: isAdaptable ? "#FFF8D6" : "transparent",
          }}
        >
          <p className="font-sans font-bold uppercase tracking-[0.14em] text-[10px] mb-1">
            {isAdaptable ? "КАК АДАПТИРОВАТЬ" : "ЧТО СЪЕСТЬ ВМЕСТО"}
          </p>
          <p className="text-sm leading-snug">{dish.adapt}</p>
        </div>
      )}
    </article>
  );
}
