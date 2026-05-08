"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CHALLENGE_DURATION_DAYS, CHALLENGE_START_DATE } from "./diet-data";

/* ============================================================================
 *  Типы
 * ========================================================================== */

export type MealId = "morning_water" | "first" | "second" | "third" | "before_bed";

/** Запись по конкретному дню челленджа */
export interface DayLog {
  /** ISO YYYY-MM-DD */
  date: string;
  /** Какие приёмы пищи отмечены */
  meals: Record<MealId, boolean>;
  /** Заметки по приёмам пищи: что реально съел в каждый */
  mealNotes?: Partial<Record<MealId, string>>;
  /** Был ли сегодня срыв (съел запрещённое) */
  cheated: boolean;
  /** Что съел запрещённого (опционально) */
  cheatNote?: string;
  /** Дневник самочувствия */
  mood?: number; // 1-10
  energy?: number; // 1-10
  hunger?: number; // 1-10
  sleep?: number; // часы
  weight?: number; // кг
  note?: string;
  /** Завершён ли день (можно крутить таймлайн вперёд) */
  completed: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  morningWaterTime: string; // "07:00"
  firstMealCheck: string;   // "10:00"
  secondMealCheck: string;  // "14:00"
  thirdMealCheck: string;   // "19:00"
  journalReminder: string;  // "21:30"
}

interface SimoState {
  /** Дата старта челленджа (ISO) */
  startDate: string;
  /** Логи по дням, ключ = ISO дата */
  logs: Record<string, DayLog>;
  /** Настройки уведомлений */
  notifications: NotificationSettings;
  /** Тёмная фотка профиля (необязательно) */
  userName?: string;
  startWeight?: number;
  goalNote?: string;

  // Actions
  setStartDate: (iso: string) => void;
  setUserProfile: (data: { userName?: string; startWeight?: number; goalNote?: string }) => void;
  toggleMeal: (date: string, meal: MealId) => void;
  setMeal: (date: string, meal: MealId, value: boolean) => void;
  setMealNote: (date: string, meal: MealId, text: string) => void;
  markCheated: (date: string, note?: string) => void;
  unmarkCheated: (date: string) => void;
  saveJournal: (date: string, entry: Partial<Omit<DayLog, "date" | "meals" | "cheated">>) => void;
  setDayCompleted: (date: string, value: boolean) => void;
  setNotifications: (n: Partial<NotificationSettings>) => void;
  resetAll: () => void;
}

/* ============================================================================
 *  Helpers
 * ========================================================================== */

const emptyMeals: Record<MealId, boolean> = {
  morning_water: false,
  first: false,
  second: false,
  third: false,
  before_bed: false,
};

const emptyDay = (date: string): DayLog => ({
  date,
  meals: { ...emptyMeals },
  cheated: false,
  completed: false,
});

const ensureDay = (logs: Record<string, DayLog>, date: string): DayLog => {
  return logs[date] ?? emptyDay(date);
};

const defaultNotifications: NotificationSettings = {
  enabled: false,
  morningWaterTime: "07:00",
  firstMealCheck: "10:00",
  secondMealCheck: "14:00",
  thirdMealCheck: "19:00",
  journalReminder: "21:30",
};

/* ============================================================================
 *  Store
 * ========================================================================== */

export const useSimoStore = create<SimoState>()(
  persist(
    (set) => ({
      startDate: CHALLENGE_START_DATE,
      logs: {},
      notifications: defaultNotifications,

      setStartDate: (iso) => set({ startDate: iso }),

      setUserProfile: (data) => set((s) => ({ ...s, ...data })),

      toggleMeal: (date, meal) =>
        set((state) => {
          const day = ensureDay(state.logs, date);
          return {
            logs: {
              ...state.logs,
              [date]: {
                ...day,
                meals: { ...day.meals, [meal]: !day.meals[meal] },
              },
            },
          };
        }),

      setMeal: (date, meal, value) =>
        set((state) => {
          const day = ensureDay(state.logs, date);
          return {
            logs: {
              ...state.logs,
              [date]: {
                ...day,
                meals: { ...day.meals, [meal]: value },
              },
            },
          };
        }),

      setMealNote: (date, meal, text) =>
        set((state) => {
          const day = ensureDay(state.logs, date);
          const trimmed = text.trim();
          const nextNotes = { ...(day.mealNotes ?? {}) };
          if (trimmed.length === 0) {
            delete nextNotes[meal];
          } else {
            nextNotes[meal] = trimmed;
          }
          return {
            logs: {
              ...state.logs,
              [date]: { ...day, mealNotes: nextNotes },
            },
          };
        }),

      markCheated: (date, note) =>
        set((state) => {
          const day = ensureDay(state.logs, date);
          return {
            logs: {
              ...state.logs,
              [date]: { ...day, cheated: true, cheatNote: note },
            },
          };
        }),

      unmarkCheated: (date) =>
        set((state) => {
          const day = ensureDay(state.logs, date);
          return {
            logs: {
              ...state.logs,
              [date]: { ...day, cheated: false, cheatNote: undefined },
            },
          };
        }),

      saveJournal: (date, entry) =>
        set((state) => {
          const day = ensureDay(state.logs, date);
          return {
            logs: { ...state.logs, [date]: { ...day, ...entry } },
          };
        }),

      setDayCompleted: (date, value) =>
        set((state) => {
          const day = ensureDay(state.logs, date);
          return {
            logs: { ...state.logs, [date]: { ...day, completed: value } },
          };
        }),

      setNotifications: (n) =>
        set((state) => ({
          notifications: { ...state.notifications, ...n },
        })),

      resetAll: () =>
        set({
          startDate: CHALLENGE_START_DATE,
          logs: {},
          notifications: defaultNotifications,
        }),
    }),
    {
      name: "simo-diet-store",
      version: 1,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
    },
  ),
);

/* ============================================================================
 *  Селекторы и утилиты
 * ========================================================================== */

/** ISO дата в TZ пользователя */
export function todayIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function dateToIso(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Текущий день челленджа (1..30 или 0/31+ если вне диапазона) */
export function getChallengeDay(startIso: string, todayIsoStr: string): number {
  const start = isoToDate(startIso);
  const today = isoToDate(todayIsoStr);
  const diff = Math.floor((today.getTime() - start.getTime()) / 86_400_000);
  return diff + 1; // день 1 = старт
}

/** Сколько дней челленджа осталось */
export function daysRemaining(startIso: string, todayIsoStr: string): number {
  const day = getChallengeDay(startIso, todayIsoStr);
  return Math.max(0, CHALLENGE_DURATION_DAYS - day);
}

/**
 * Прогресс 0..1 — доля прожитых дней челленджа.
 * День 1 (только начался) = 0%, день 30 = 96.7%, день 31+ = 100%.
 * Сегодняшний день засчитывается только когда он закончился.
 */
export function getProgress(startIso: string, todayIsoStr: string): number {
  const day = getChallengeDay(startIso, todayIsoStr);
  return Math.min(1, Math.max(0, (day - 1) / CHALLENGE_DURATION_DAYS));
}

/** Серия успешных дней подряд (без срывов, день закрыт) до сегодняшнего */
export function getStreak(logs: Record<string, DayLog>, startIso: string, todayIsoStr: string): number {
  let streak = 0;
  const todayDay = getChallengeDay(startIso, todayIsoStr);

  for (let d = todayDay - 1; d >= 1; d--) {
    const date = new Date(isoToDate(startIso));
    date.setDate(date.getDate() + (d - 1));
    const iso = dateToIso(date);
    const log = logs[iso];
    if (log && log.completed && !log.cheated) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/** Получить все ISO даты челленджа */
export function getChallengeDates(startIso: string): string[] {
  const dates: string[] = [];
  const start = isoToDate(startIso);
  for (let i = 0; i < CHALLENGE_DURATION_DAYS; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(dateToIso(d));
  }
  return dates;
}
