"use client";

import type { NotificationSettings } from "./store";

export function notificationsSupported() {
  if (typeof window === "undefined") return false;
  return "Notification" in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) return "denied";
  if (Notification.permission === "default") {
    return await Notification.requestPermission();
  }
  return Notification.permission;
}

export function permissionState(): NotificationPermission | "unsupported" {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission;
}

interface ScheduledItem {
  id: string;
  title: string;
  body: string;
  time: string; // HH:MM
}

function timeToMs(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}

let timers: number[] = [];

export function clearScheduled() {
  timers.forEach((id) => window.clearTimeout(id));
  timers = [];
}

function showNotification(title: string, body: string, tag: string) {
  if (!notificationsSupported()) return;
  if (Notification.permission !== "granted") return;
  try {
    const n = new Notification(title, {
      body,
      tag,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      lang: "ru",
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch (e) {
    // На iOS PWA нужен Service Worker для notifications
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        reg?.showNotification(title, {
          body,
          tag,
          icon: "/icon-192.png",
          lang: "ru",
        });
      });
    }
  }
}

export function scheduleDay(settings: NotificationSettings) {
  clearScheduled();
  if (!settings.enabled) return;
  if (!notificationsSupported()) return;
  if (Notification.permission !== "granted") return;

  const items: ScheduledItem[] = [
    {
      id: "morning",
      time: settings.morningWaterTime,
      title: "💧 Утренняя вода",
      body: "2–3 стакана воды + щепотка соли + лимон. Сразу после пробуждения.",
    },
    {
      id: "first",
      time: settings.firstMealCheck,
      title: "🍳 Первый приём",
      body: "Если голоден — белок + жир. Если нет — пропусти, не насилуй.",
    },
    {
      id: "second",
      time: settings.secondMealCheck,
      title: "🥗 Второй приём (опц.)",
      body: "Белок + зелёные овощи. Только при настоящем голоде.",
    },
    {
      id: "third",
      time: settings.thirdMealCheck,
      title: "🍚 Третий приём",
      body: "Белок + углеводы (рис, батат, безглютеновая паста).",
    },
    {
      id: "journal",
      time: settings.journalReminder,
      title: "📓 Дневник",
      body: "Отметь самочувствие и закрой день.",
    },
  ];

  for (const item of items) {
    const delay = timeToMs(item.time);
    if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
      const id = window.setTimeout(() => {
        showNotification(item.title, item.body, item.id);
      }, delay);
      timers.push(id);
    }
  }
}
