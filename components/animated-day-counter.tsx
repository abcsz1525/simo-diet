"use client";

import {
  MotionValue,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";

/**
 * Premium slot-machine style counter — каждая цифра flip'ается отдельно.
 * Использует spring для естественного движения.
 *
 * Высота окна = 1.05em + lineHeight: 1 — этого достаточно, чтобы Oswald Bold
 * с его ascender/descender помещался целиком и соседние цифры в стеке (на ±100%)
 * гарантированно ушли за пределы overflow:hidden.
 */

interface Props {
  value: number;
  /** число знаков (по умолчанию 2 для дня челленджа) */
  digits?: number;
  className?: string;
}

export function AnimatedDayCounter({ value, digits = 2, className }: Props) {
  const places = Array.from({ length: digits }, (_, i) =>
    Math.pow(10, digits - 1 - i),
  );

  return (
    <div
      className={`simo-hero-num inline-flex items-center ${className ?? ""}`}
      style={{ lineHeight: 1 }}
      aria-label={`День ${value}`}
      role="img"
    >
      {places.map((place) => (
        <Digit key={place} place={place} value={value} />
      ))}
    </div>
  );
}

function Digit({ place, value }: { place: number; value: number }) {
  const valueRoundedToPlace = Math.floor(value / place);
  const animatedValue = useSpring(valueRoundedToPlace, {
    stiffness: 220,
    damping: 26,
    mass: 1.2,
  });

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    <span
      className="relative inline-block overflow-hidden"
      style={{
        width: "0.62em",
        height: "1.05em",
        lineHeight: 1,
      }}
      aria-hidden
    >
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} />
      ))}
    </span>
  );
}

function Number({ mv, number }: { mv: MotionValue<number>; number: number }) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * 100;
    if (offset > 5) memo -= 1000;
    return `${memo}%`;
  });

  return (
    <motion.span
      style={{ y, lineHeight: 1 }}
      className="absolute inset-x-0 top-0 h-full flex items-center justify-center"
    >
      {number}
    </motion.span>
  );
}
