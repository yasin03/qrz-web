"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;

/**
 * Açık / koyu / sistem seçici. Footer'ın alt satırında ve mobil menüde kullanılır.
 * Seçili durum yalnızca istemcide bilinir; sunucu HTML'i nötr basılır (hydration hatası yok).
 */
export function ThemeToggle({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  const t = useTranslations("theme");
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border p-0.5",
        onDark ? "border-navy-border" : "border-border",
        className,
      )}
    >
      {OPTIONS.map(({ value, icon: Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={mounted ? active : undefined}
            aria-label={t(value)}
            title={t(value)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              onDark
                ? "text-navy-muted hover:text-navy-foreground"
                : "text-muted-foreground hover:text-foreground",
              active &&
                (onDark
                  ? "bg-navy-foreground/10 text-navy-foreground"
                  : "bg-muted text-foreground"),
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
