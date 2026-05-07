"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  size?: number;
  inverted?: boolean;
}

/**
 * Круглая печать SIMO с крутящимся textPath по периметру.
 * - На больших размерах (>=120px) — полный девиз "ELIMINACIÓN · REPARACIÓN · LIBERACIÓN"
 * - На маленьких — короткий "SIMO · 30 DAYS" чтобы оставаться читаемым
 * - Всегда крутится через CSS keyframes (24s loop)
 */
export function SimoStamp({ className, size = 160, inverted = false }: Props) {
  const fg = inverted ? "#F4C600" : "#000000";
  const pathId = useId();

  // Текст по кругу: длинный для крупных штампов, короткий для компактных
  const isCompact = size < 120;
  const ringText = isCompact
    ? " SIMO · 30 DAYS · SIMO · 30 DAYS · "
    : " ELIMINACIÓN · REPARACIÓN · LIBERACIÓN · ";

  // SVG fontSize считается в SVG units (viewBox 200×200).
  // На компактных штампах сделаем его крупнее в SVG-координатах,
  // чтобы он остался читаемым после downscale.
  const svgFontSize = isCompact ? 22 : 14;
  const letterSpacing = isCompact ? 1 : 2;

  // Внутренний центральный текст
  const centerFontSize = Math.max(11, Math.round(size * 0.16));

  return (
    <span
      className={cn("simo-stamp", className)}
      style={{ width: size, height: size, color: fg }}
      aria-hidden
    >
      <svg viewBox="0 0 200 200">
        <defs>
          <path
            id={pathId}
            d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
          />
        </defs>
        <text
          fontSize={svgFontSize}
          fontFamily="Oswald, Anton, sans-serif"
          fontWeight="700"
          fill={fg}
          letterSpacing={letterSpacing}
        >
          <textPath href={`#${pathId}`}>{ringText}</textPath>
        </text>
      </svg>
      <span
        className="text-center font-display leading-[1] px-2 select-none"
        style={{ color: fg, fontSize: centerFontSize }}
      >
        SIMO
        <br />
        30
      </span>
    </span>
  );
}
