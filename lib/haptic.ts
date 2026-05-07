"use client";

/**
 * Лёгкая хаптика для мобильных. Вызывает navigator.vibrate если доступен.
 * iOS Safari игнорирует Vibration API, на Android работает.
 * Это nice-to-have, не основная UX.
 */

export function tap() {
  if (typeof navigator === "undefined") return;
  if ("vibrate" in navigator) {
    navigator.vibrate(8);
  }
}

export function success() {
  if (typeof navigator === "undefined") return;
  if ("vibrate" in navigator) {
    navigator.vibrate([10, 60, 30]);
  }
}

export function warning() {
  if (typeof navigator === "undefined") return;
  if ("vibrate" in navigator) {
    navigator.vibrate([20, 40, 20]);
  }
}
