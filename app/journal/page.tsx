"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SimoButton } from "@/components/ui/simo-button";
import {
  useSimoStore,
  todayIso,
  getChallengeDay,
  isoToDate,
  dateToIso,
} from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";

export default function JournalPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const startDate = useSimoStore((s) => s.startDate);
  const logs = useSimoStore((s) => s.logs);
  const saveJournal = useSimoStore((s) => s.saveJournal);

  const today = todayIso();
  const log = logs[today];

  const [mood, setMood] = useState<number>(log?.mood ?? 7);
  const [energy, setEnergy] = useState<number>(log?.energy ?? 7);
  const [hunger, setHunger] = useState<number>(log?.hunger ?? 5);
  const [sleep, setSleep] = useState<number>(log?.sleep ?? 7);
  const [weight, setWeight] = useState<string>(log?.weight?.toString() ?? "");
  const [note, setNote] = useState<string>(log?.note ?? "");
  const [saved, setSaved] = useState(false);

  // Подгружаем при смене лога
  useEffect(() => {
    if (log) {
      setMood(log.mood ?? 7);
      setEnergy(log.energy ?? 7);
      setHunger(log.hunger ?? 5);
      setSleep(log.sleep ?? 7);
      setWeight(log.weight?.toString() ?? "");
      setNote(log.note ?? "");
    }
  }, [log]);

  const handleSave = () => {
    saveJournal(today, {
      mood,
      energy,
      hunger,
      sleep,
      weight: weight ? Number(weight.replace(",", ".")) : undefined,
      note,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  // История по дням
  const history = useMemo(() => {
    const days = Object.values(logs)
      .filter(
        (l) =>
          l.mood != null ||
          l.energy != null ||
          l.weight != null ||
          (l.note && l.note.length > 0),
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    return days;
  }, [logs]);

  if (!mounted) return <div className="h-dvh" aria-hidden />;

  return (
    <main className="pt-2 pb-6">
      <PageHeader />

      <h1 className="mt-8 mb-2">Дневник</h1>
      <p className="text-lg opacity-80 mb-6">
        Как себя чувствуешь сегодня? Эти данные останутся у тебя на устройстве.
      </p>

      <div className="space-y-5">
        <ScaleField label="Настроение" value={mood} onChange={setMood} />
        <ScaleField label="Энергия" value={energy} onChange={setEnergy} />
        <ScaleField label="Чувство голода" value={hunger} onChange={setHunger} />

        <NumericField
          label="Сон (часов)"
          value={String(sleep)}
          onChange={(v) => setSleep(Number(v))}
          type="number"
          min={0}
          max={14}
          step={0.5}
        />
        <NumericField
          label="Вес (кг, опционально)"
          value={weight}
          onChange={setWeight}
          placeholder="напр. 78.5"
        />

        <TextareaField
          label="Заметка"
          value={note}
          onChange={setNote}
          placeholder="Что чувствуешь, что хочется, что было трудно…"
        />

        <div className="pt-2 pb-6 border-b-[3px] border-black">
          <SimoButton variant="primary" size="lg" block onClick={handleSave}>
            {saved ? "✓ Сохранено" : "Сохранить запись"}
          </SimoButton>
        </div>
      </div>

      {history.length > 0 && (
        <section className="mt-8">
          <h2 className="text-3xl mb-4">История</h2>
          <ul className="space-y-3">
            {history.map((d) => (
              <HistoryRow key={d.date} startIso={startDate} entry={d} />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function ScaleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const groupId = useId();
  return (
    <div
      className="simo-card-flat"
      role="group"
      aria-labelledby={`${groupId}-label`}
    >
      <div className="flex items-center justify-between mb-3">
        <p id={`${groupId}-label`} className="simo-kicker">
          {label}
        </p>
        <span className="font-display text-3xl">{value}</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const active = n <= value;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={cn(
                "h-12 rounded-md border-2 border-black transition-colors font-display text-base focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:outline-black",
                active ? "bg-black text-[#F4C600]" : "bg-transparent text-black",
              )}
              aria-label={`${label} ${n} из 10`}
              aria-pressed={n === value}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NumericField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  max,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  const id = useId();
  return (
    <div className="simo-card-flat">
      <label htmlFor={id} className="simo-kicker mb-3 block">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={type === "number" ? "decimal" : "decimal"}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 px-4 border-[3px] border-black rounded-[12px] bg-white text-2xl font-display focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:outline-black"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="simo-card-flat">
      <label htmlFor={id} className="simo-kicker mb-3 block">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-3 border-[3px] border-black rounded-[12px] bg-white text-base resize-none focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:outline-black"
      />
    </div>
  );
}

function HistoryRow({
  startIso,
  entry,
}: {
  startIso: string;
  entry: ReturnType<typeof useSimoStore.getState>["logs"][string];
}) {
  const dayN = Math.max(1, getChallengeDay(startIso, entry.date));
  const d = isoToDate(entry.date);
  const formatted = d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
  return (
    <motion.li
      layout
      className="simo-card-flat"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="font-display text-xl">ДЕНЬ {dayN}</p>
        <span className="simo-kicker">{formatted}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        {entry.mood != null && (
          <Stat label="Настр." value={entry.mood} />
        )}
        {entry.energy != null && (
          <Stat label="Энерг." value={entry.energy} />
        )}
        {entry.hunger != null && (
          <Stat label="Голод" value={entry.hunger} />
        )}
        {entry.sleep != null && <Stat label="Сон" value={`${entry.sleep}ч`} />}
        {entry.weight != null && (
          <Stat label="Вес" value={`${entry.weight}кг`} />
        )}
      </div>
      {entry.cheated && (
        <p className="mt-2 text-sm font-bold" style={{ color: "#A0151F" }}>
          ⚠ Был срыв
        </p>
      )}
      {entry.note && (
        <p className="mt-2 text-sm opacity-80 whitespace-pre-wrap">
          {entry.note}
        </p>
      )}
      {/* avoid TS unused warning */}
      <span hidden>{dateToIso(d)}</span>
    </motion.li>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs opacity-60">{label}:</span>
      <span className="font-display text-base">{value}</span>
    </div>
  );
}
