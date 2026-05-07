"use client";

import { useEffect } from "react";
import { useSimoStore } from "@/lib/store";
import { scheduleDay } from "@/lib/notifications";

export function PwaInit() {
  const notifications = useSimoStore((s) => s.notifications);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV === "development"
    ) {
      return;
    }
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch(() => {
        // в dev нет sw.js — игнорируем
      });
  }, []);

  useEffect(() => {
    scheduleDay(notifications);
  }, [notifications]);

  return null;
}
