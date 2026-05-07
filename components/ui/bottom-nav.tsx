"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items: {
  href: string;
  label: string;
  short: string;
  ariaLabel?: string;
  glyph?: string;
}[] = [
  { href: "/",          label: "СЕГОДНЯ",  short: "ДЕНЬ" },
  { href: "/checklist", label: "ЧЕК-ЛИСТ", short: "ЧЕК" },
  { href: "/food",      label: "ПРОДУКТЫ", short: "ЕДА" },
  { href: "/journal",   label: "ДНЕВНИК",  short: "ДН." },
  { href: "/rules",     label: "ПРАВИЛА",  short: "?" },
  { href: "/settings",  label: "⚙",        short: "⚙",  ariaLabel: "Настройки", glyph: "⚙" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-black border-t-[3px] border-black z-40"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)",
        paddingTop: "0.25rem",
      }}
      aria-label="Главная навигация"
    >
      <ul className="flex justify-around items-stretch max-w-2xl mx-auto px-1 sm:px-2">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const isIcon = !!item.glyph;
          return (
            <li key={item.href} className="flex-1 min-w-0">
              <Link
                href={item.href}
                aria-label={item.ariaLabel}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center justify-center px-1 py-2 min-h-[44px] font-display tracking-wider transition-colors leading-tight text-center",
                  active
                    ? "text-[#F4C600]"
                    : "text-white/85 hover:text-[#F4C600]",
                  isIcon ? "text-2xl" : "text-[10px] xs:text-[11px] sm:text-xs",
                )}
              >
                {isIcon ? (
                  <span aria-hidden>{item.glyph}</span>
                ) : (
                  <>
                    <span className="hidden xs:inline">{item.label}</span>
                    <span className="inline xs:hidden">{item.short}</span>
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
