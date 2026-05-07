# SIMO 30 — Диета-челлендж PWA

Приложение-помощник для прохождения 30-дневного челленджа по диете SIMO (Phase 1: Eliminación). Помогает держать план, отмечать приёмы пищи, вести дневник самочувствия и не сходить с дистанции.

**Стек:** Next.js 16 · TypeScript · Tailwind v4 · Zustand · Serwist (PWA) · Framer Motion

## Что внутри

- 🟡 Дашборд челленджа с slot-machine-счётчиком дня, прогресс-баром и серией без срывов
- ✅ Чек-лист дня — 5 приёмов пищи с подсказками что можно есть, конфетти при закрытии дня
- 🔍 Справочник 366 продуктов (199 разрешённых + 167 запрещённых) с поиском и фильтром
- 📓 Дневник самочувствия — настроение, энергия, голод, сон, вес, заметки
- 📜 10 правил SIMO + советы + 3 фазы
- 🎉 Milestones на 1, 3, 7, 14, 21, 30 день — модалка с конфетти и цитатой
- 🔔 Локальные уведомления (browser Notification API)
- 📱 PWA — устанавливается на iOS/Android, работает офлайн через Service Worker
- 🌑 Брутальный жёлто-чёрный дизайн в стиле SIMO

## Команды

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production-сборка (webpack, чтобы Serwist собрал SW)
npm start        # запуск prod-сборки
```

## Структура

```
app/                 # роуты App Router
  page.tsx           # дашборд
  checklist/         # чек-лист дня
  food/              # справочник продуктов
  journal/           # дневник
  rules/             # правила
  settings/          # настройки
  sw.ts              # service worker (Serwist)
components/          # UI компоненты
lib/
  diet-data.ts       # 366 продуктов, правила, фазы
  store.ts           # Zustand + persist в localStorage
  notifications.ts   # планировщик уведомлений
  haptic.ts          # vibrate API на тачах
```

## Данные

Все данные хранятся локально в `localStorage` через Zustand persist — никакого бэкенда. Сброс через `/settings → Опасная зона`.

## Деплой

`npm run build` → `npm start`. Работает на Railway, Vercel, Render, Fly.io.

## Лицензия

MIT.
