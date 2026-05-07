"use client";

import { useEffect, useId, useState } from "react";
import { SimoButton } from "@/components/ui/simo-button";
import {
  useSimoStore,
  isoToDate,
} from "@/lib/store";
import {
  permissionState,
  requestNotificationPermission,
  scheduleDay,
} from "@/lib/notifications";
import { CHALLENGE_START_DATE } from "@/lib/diet-data";
import { PageHeader } from "@/components/page-header";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const startDate = useSimoStore((s) => s.startDate);
  const setStartDate = useSimoStore((s) => s.setStartDate);
  const notifications = useSimoStore((s) => s.notifications);
  const setNotifications = useSimoStore((s) => s.setNotifications);
  const resetAll = useSimoStore((s) => s.resetAll);

  const startDateId = useId();
  const enableNotifId = useId();

  const [permission, setPermission] =
    useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    setPermission(permissionState());
  }, []);

  if (!mounted) return <div className="h-dvh" aria-hidden />;

  const requestPerm = async () => {
    const r = await requestNotificationPermission();
    setPermission(r);
    if (r === "granted") {
      setNotifications({ enabled: true });
      scheduleDay({ ...notifications, enabled: true });
    }
  };

  return (
    <main className="pt-2 pb-6">
      <PageHeader />

      <h1 className="mt-8 mb-2">Настройки</h1>
      <p className="text-lg opacity-80 mb-6">
        Дата старта, уведомления, сброс данных.
      </p>

      <section className="simo-card-flat mb-5">
        <label htmlFor={startDateId} className="simo-kicker mb-3 block">
          ДАТА СТАРТА
        </label>
        <input
          id={startDateId}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full h-12 px-4 border-[3px] border-black rounded-[12px] bg-white text-base font-mono focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:outline-black"
        />
        <p className="text-xs mt-2 opacity-60">
          Поменяй, если стартовал не {formatRu(CHALLENGE_START_DATE)}.
        </p>
      </section>

      <section className="simo-card-flat mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="simo-kicker">УВЕДОМЛЕНИЯ</p>
          <span
            className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded ${
              permission === "granted"
                ? "bg-black text-[#F4C600]"
                : permission === "denied"
                ? "bg-[#A0151F] text-white"
                : "bg-white border-2 border-black"
            }`}
          >
            {permission === "granted"
              ? "РАЗРЕШЕНО"
              : permission === "denied"
              ? "ЗАБЛОКИРОВАНО"
              : permission === "unsupported"
              ? "НЕ ПОДДЕРЖИВАЕТСЯ"
              : "НЕ СПРАШИВАЛИ"}
          </span>
        </div>

        {permission !== "granted" && permission !== "unsupported" && (
          <SimoButton
            variant="primary"
            size="md"
            block
            onClick={requestPerm}
            className="mb-4"
          >
            Разрешить уведомления
          </SimoButton>
        )}

        <label
          htmlFor={enableNotifId}
          className="flex items-center justify-between py-2 min-h-[44px]"
        >
          <span className="text-base">Включить напоминания</span>
          <input
            id={enableNotifId}
            type="checkbox"
            checked={notifications.enabled}
            disabled={permission !== "granted"}
            onChange={(e) =>
              setNotifications({ enabled: e.target.checked })
            }
            className="w-6 h-6 accent-black"
          />
        </label>

        <TimeRow
          label="Утренняя вода"
          value={notifications.morningWaterTime}
          onChange={(v) => setNotifications({ morningWaterTime: v })}
        />
        <TimeRow
          label="1-й приём (проверка)"
          value={notifications.firstMealCheck}
          onChange={(v) => setNotifications({ firstMealCheck: v })}
        />
        <TimeRow
          label="2-й приём (проверка)"
          value={notifications.secondMealCheck}
          onChange={(v) => setNotifications({ secondMealCheck: v })}
        />
        <TimeRow
          label="3-й приём (проверка)"
          value={notifications.thirdMealCheck}
          onChange={(v) => setNotifications({ thirdMealCheck: v })}
        />
        <TimeRow
          label="Дневник вечером"
          value={notifications.journalReminder}
          onChange={(v) => setNotifications({ journalReminder: v })}
        />

        <p className="text-xs mt-4 opacity-60">
          ⚠ Уведомления приходят только пока приложение открыто (даже в фоне
          таймеры могут замораживаться браузером). Если PWA закрыта — уведомлений
          не будет. Для надёжных пушей нужен серверный backend, его пока нет.
        </p>
      </section>

      <section
        className="simo-card-flat mb-5 border-l-[6px]"
        style={{ borderLeftColor: "#A0151F" }}
      >
        <p className="simo-kicker mb-3" style={{ color: "#A0151F" }}>
          ОПАСНАЯ ЗОНА
        </p>
        <p className="text-sm mb-3 opacity-80">
          Сбросит все логи, дневник, отметки. Это действие нельзя отменить.
        </p>
        <SimoButton
          variant="destructive"
          size="md"
          onClick={() => {
            if (
              confirm(
                "Точно сбросить все данные? Это нельзя отменить.",
              )
            ) {
              resetAll();
            }
          }}
        >
          Сбросить всё
        </SimoButton>
      </section>
    </main>
  );
}

function TimeRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between py-2 gap-3 min-h-[44px]">
      <label htmlFor={id} className="text-base flex-1">
        {label}
      </label>
      <input
        id={id}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 px-3 border-[2px] border-black rounded-lg bg-white font-mono text-base focus:outline focus:outline-[3px] focus:outline-offset-[2px] focus:outline-black"
      />
    </div>
  );
}

function formatRu(iso: string) {
  const d = isoToDate(iso);
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
