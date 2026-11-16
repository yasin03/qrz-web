// Hesaplama araçları (/hesaplama/[slug] ↔ /en/calculators/[slug]).
// Hesap mantığı Faz 6'da yazılır; parametreler config/mevzuat/{yil}.ts'den gelir.

type CalculatorDef = {
  /** messages: pages.<id> */
  id: string;
  slug: { tr: string; en: string };
  keyword: { tr: string; en: string };
  /** İç linkleme (6.4): aracın bağlandığı ürün sayfası id'si */
  relatedProduct: string;
};

export const CALCULATORS = [
  {
    id: "salaryCalc",
    slug: { tr: "net-brut-maas", en: "salary" },
    keyword: { tr: "net brüt maaş hesaplama", en: "gross to net salary calculator" },
    relatedProduct: "payroll",
  },
  {
    id: "severanceCalc",
    slug: { tr: "kidem-tazminati", en: "severance-pay" },
    keyword: { tr: "kıdem tazminatı hesaplama", en: "severance pay calculator" },
    relatedProduct: "payroll",
  },
  {
    id: "noticeCalc",
    slug: { tr: "ihbar-tazminati", en: "notice-pay" },
    keyword: { tr: "ihbar tazminatı hesaplama", en: "notice pay calculator" },
    relatedProduct: "payroll",
  },
  {
    id: "overtimeCalc",
    slug: { tr: "fazla-mesai", en: "overtime" },
    keyword: { tr: "fazla mesai hesaplama", en: "overtime pay calculator" },
    relatedProduct: "timesheet",
  },
  {
    id: "employerCostCalc",
    slug: { tr: "isveren-maliyeti", en: "employer-cost" },
    keyword: { tr: "işveren maliyeti hesaplama", en: "employer cost calculator" },
    relatedProduct: "payroll",
  },
  {
    id: "annualLeaveCalc",
    slug: { tr: "yillik-izin", en: "annual-leave" },
    keyword: { tr: "yıllık izin hesaplama", en: "annual leave calculator" },
    relatedProduct: "leaveManagement",
  },
] as const satisfies readonly CalculatorDef[];

export type Calculator = (typeof CALCULATORS)[number];
export type CalculatorSlug = Calculator["slug"]["tr"];

export function getCalculatorBySlug(slug: string) {
  return CALCULATORS.find((c) => c.slug.tr === slug);
}
