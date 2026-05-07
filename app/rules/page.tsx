"use client";

import { motion } from "framer-motion";
import { RULES, TIPS, PHASES } from "@/lib/diet-data";
import { PageHeader } from "@/components/page-header";

export default function RulesPage() {
  return (
    <main className="pt-2 pb-6">
      <PageHeader />

      <h1 className="mt-8 mb-2">10 Правил</h1>
      <p className="text-lg opacity-80 mb-6">
        Базовые правила Фазы 1. Без них ничего не работает.
      </p>

      <ol className="space-y-3">
        {RULES.map((rule, i) => (
          <motion.li
            key={rule.n}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="simo-card-flat flex gap-4 items-start"
          >
            <div className="w-12 h-12 mt-0.5 rounded-full bg-black text-[#F4C600] grid place-items-center font-display text-2xl shrink-0">
              {rule.n}
            </div>
            <div className="flex-1">
              <h3 className="text-xl uppercase leading-tight">{rule.title}</h3>
              {rule.detail && (
                <p className="text-sm opacity-80 mt-1">{rule.detail}</p>
              )}
            </div>
          </motion.li>
        ))}
      </ol>

      <h2 className="mt-12 mb-4 text-4xl">Советы</h2>
      <ul className="space-y-3">
        {TIPS.map((tip, i) => (
          <li
            key={i}
            className="simo-card-flat border-l-[6px] border-l-[#A0151F]"
          >
            <p className="text-base">{tip}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 mb-4 text-4xl">3 фазы</h2>
      <div className="space-y-3">
        {PHASES.map((p) => (
          <div key={p.n} className="simo-card-flat">
            <div className="flex items-baseline justify-between mb-1">
              <p className="font-display text-2xl">
                ФАЗА {p.n} · {p.nameRu}
              </p>
              <span className="simo-kicker">{p.days} дн.</span>
            </div>
            <p className="simo-kicker mb-2">{p.name}</p>
            <p className="text-sm opacity-80">{p.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
