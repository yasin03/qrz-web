// Hesaplama araçları (/hesaplama/[slug] ↔ /en/calculators/[slug]).
// Hesap mantığı lib/calculators/*.ts; yıl bazlı parametre varsayılanları config/mevzuat/{yil}.ts,
// kullanıcı formda değiştirebilir. Sabit yasal kurallar config/mevzuat/rules.ts.

import {
  BellRing,
  Building2,
  CalendarDays,
  Clock,
  HandCoins,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { ProductId } from "./products";

type CalculatorDef = {
  /** messages: pages.<id> */
  id: string;
  slug: { tr: string; en: string };
  keyword: { tr: string; en: string };
  /** İç linkleme (6.4): aracın bağlandığı ürün sayfası id'si */
  relatedProduct: ProductId;
  icon: LucideIcon;
};

export const CALCULATORS = [
  {
    id: "salaryCalc",
    slug: { tr: "net-brut-maas", en: "salary" },
    keyword: { tr: "net brüt maaş hesaplama", en: "gross to net salary calculator" },
    relatedProduct: "payroll",
    icon: Wallet,
  },
  {
    id: "severanceCalc",
    slug: { tr: "kidem-tazminati", en: "severance-pay" },
    keyword: { tr: "kıdem tazminatı hesaplama", en: "severance pay calculator" },
    relatedProduct: "payroll",
    icon: HandCoins,
  },
  {
    id: "noticeCalc",
    slug: { tr: "ihbar-tazminati", en: "notice-pay" },
    keyword: { tr: "ihbar tazminatı hesaplama", en: "notice pay calculator" },
    relatedProduct: "payroll",
    icon: BellRing,
  },
  {
    id: "overtimeCalc",
    slug: { tr: "fazla-mesai", en: "overtime" },
    keyword: { tr: "fazla mesai hesaplama", en: "overtime pay calculator" },
    relatedProduct: "timesheet",
    icon: Clock,
  },
  {
    id: "employerCostCalc",
    slug: { tr: "isveren-maliyeti", en: "employer-cost" },
    keyword: { tr: "işveren maliyeti hesaplama", en: "employer cost calculator" },
    relatedProduct: "payroll",
    icon: Building2,
  },
  {
    id: "annualLeaveCalc",
    slug: { tr: "yillik-izin", en: "annual-leave" },
    keyword: { tr: "yıllık izin hesaplama", en: "annual leave calculator" },
    relatedProduct: "leaveManagement",
    icon: CalendarDays,
  },
] as const satisfies readonly CalculatorDef[];

export type Calculator = (typeof CALCULATORS)[number];
export type CalculatorSlug = Calculator["slug"]["tr"];
export type CalculatorId = Calculator["id"];

export function getCalculatorBySlug(slug: string) {
  return CALCULATORS.find((c) => c.slug.tr === slug);
}
