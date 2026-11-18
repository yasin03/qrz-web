"use client";

import { useTranslations } from "next-intl";
import type { YMD } from "@/lib/calculators/common";

/** "5 yıl 6 ay 3 gün" (sıfır olan parçalar atlanır) */
export function useServiceText() {
  const t = useTranslations("calculatorUi.duration");
  return ({ years, months, days }: YMD) => {
    const parts = [
      years ? t("years", { count: years }) : null,
      months ? t("months", { count: months }) : null,
      days ? t("days", { count: days }) : null,
    ].filter(Boolean);
    return parts.length ? parts.join(" ") : t("days", { count: 0 });
  };
}
