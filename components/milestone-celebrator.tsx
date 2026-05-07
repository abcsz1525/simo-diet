"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  useSimoStore,
  todayIso,
  getChallengeDay,
} from "@/lib/store";
import { MILESTONES } from "@/lib/diet-data";
import { SimoButton } from "@/components/ui/simo-button";

const CELEBRATED_KEY = "simo-celebrated-days";

function readCelebrated(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CELEBRATED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCelebrated(days: number[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CELEBRATED_KEY, JSON.stringify(days));
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MilestoneCelebrator() {
  const startDate = useSimoStore((s) => s.startDate);
  const logs = useSimoStore((s) => s.logs);
  const [active, setActive] = useState<{
    day: number;
    title: string;
    quote: string;
    emoji: string;
  } | null>(null);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<Element | null>(null);

  useEffect(() => {
    const today = todayIso();
    const log = logs[today];
    if (!log?.completed) return;

    const day = getChallengeDay(startDate, today);
    const milestone = MILESTONES.find((m) => m.day === day);
    if (!milestone) return;

    const celebrated = readCelebrated();
    if (celebrated.includes(day)) return;

    setActive(milestone);
    writeCelebrated([...celebrated, day]);

    if (prefersReducedMotion()) return;

    const burst = () => {
      confetti({
        particleCount: 60,
        spread: 60,
        startVelocity: 45,
        colors: ["#F4C600", "#000000", "#E63946"],
        origin: { y: 0.4 },
      });
    };
    burst();
    setTimeout(burst, 250);
    setTimeout(burst, 500);
  }, [logs, startDate]);

  // Focus management + Escape + scroll lock
  useEffect(() => {
    if (!active) return;
    previouslyFocused.current = document.activeElement;
    closeButtonRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setActive(null);
      }
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (
        previouslyFocused.current instanceof HTMLElement &&
        document.contains(previouslyFocused.current)
      ) {
        previouslyFocused.current.focus();
      }
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActive(null)}
          role="presentation"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 220 }}
            className="bg-[#F4C600] border-[3px] border-black rounded-3xl p-8 max-w-md w-full text-center shadow-[10px_10px_0_0_#000]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="milestone-title"
            aria-describedby="milestone-desc"
          >
            <div className="text-6xl mb-3" aria-hidden>
              {active.emoji}
            </div>
            <p className="simo-kicker mb-1">ВЕХА · ДЕНЬ {active.day}</p>
            <h2 id="milestone-title" className="text-5xl mb-4">
              {active.title}
            </h2>
            <p id="milestone-desc" className="text-base mb-6 opacity-80">
              {active.quote}
            </p>
            <SimoButton
              ref={closeButtonRef}
              variant="primary"
              size="lg"
              block
              onClick={() => setActive(null)}
            >
              Идём дальше
            </SimoButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
