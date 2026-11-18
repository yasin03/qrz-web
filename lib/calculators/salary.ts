// Net-brüt maaş hesabı (aylık bordro motoru). İşveren maliyeti ve fazla mesai
// hesapları da bu motoru kullanır.
//
// Bir ayın hesabı:
//   SGK matrahı = min(brüt, tavan)
//   SGK işçi = matrah × işçi oranı, işsizlik işçi = matrah × işsizlik oranı
//   GV matrahı = brüt − SGK işçi − işsizlik işçi − engellilik indirimi
//   GV = kümülatif matraha göre artan oranlı vergi
//   Asgari ücret GV istisnası = asgari ücretin aynı aydaki vergisi (en fazla hesaplanan GV kadar)
//   Damga = brüt × oran − asgari ücret × oran (negatif olamaz)
//   Net = brüt − SGK − işsizlik − ödenecek GV − ödenecek damga
// Yıl içinde her ay aynı brüt ücret alındığı varsayılır; kümülatif matrah ocaktan birikir.

import type { PayrollParams } from "@/config/mevzuat/types";
import { incrementalIncomeTax, pct, round2 } from "./common";

export type MonthlyPayroll = {
  month: number;
  gross: number;
  sgkBase: number;
  sgkEmployee: number;
  unemploymentEmployee: number;
  taxBase: number;
  cumulativeTaxBase: number;
  incomeTax: number;
  incomeTaxExemption: number;
  incomeTaxPayable: number;
  stampTax: number;
  stampTaxExemption: number;
  stampTaxPayable: number;
  net: number;
  /** İşveren payları */
  sgkEmployer: number;
  unemploymentEmployer: number;
  employerCost: number;
};

/** İşveren prim indirimi: yok, genel (2026: 2 puan) veya imalat sektörü (2026: 5 puan) */
export type EmployerDiscount = "none" | "general" | "manufacturing";

export type SalaryOptions = {
  /** 0: yok, 1–3: engellilik derecesi */
  disability?: 0 | 1 | 2 | 3;
  employerDiscount?: EmployerDiscount;
  /** true ise kalemler kuruşa yuvarlanmaz (yalnızca netten brüte çözümü için) */
  exact?: boolean;
};

/** İndirim sonrası SGK işveren oranı (%) */
export function employerRate(p: PayrollParams, discount: EmployerDiscount = "none") {
  const points =
    discount === "general"
      ? p.employerDiscountPoints
      : discount === "manufacturing"
        ? p.manufacturingDiscountPoints
        : 0;
  return Math.max(0, p.sgkEmployerRate - points);
}

/** Asgari ücretlinin aylık GV matrahı (asgari ücret istisnası için) */
function minWageTaxBase(p: PayrollParams) {
  const base = Math.min(p.minWage, p.sgkCeiling);
  return (
    p.minWage -
    round2(pct(base, p.sgkEmployeeRate)) -
    round2(pct(base, p.unemploymentEmployeeRate))
  );
}

/**
 * Brüt ücretten bir ayın bordrosu. previousTaxBase verilmezse, ocaktan beri her ay
 * aynı brüt alındığı varsayılarak hesaplanır.
 */
export function payrollForMonth(
  gross: number,
  month: number,
  p: PayrollParams,
  options: SalaryOptions = {},
  previousTaxBase?: number,
): MonthlyPayroll {
  // exact: ara yuvarlama yapılmaz (netten brüte çözümünde kullanılır)
  const r = options.exact ? (value: number) => value : round2;
  const disability = options.disability ?? 0;
  const sgkBase = Math.min(gross, p.sgkCeiling);
  const sgkEmployee = r(pct(sgkBase, p.sgkEmployeeRate));
  const unemploymentEmployee = r(pct(sgkBase, p.unemploymentEmployeeRate));
  const allowance = disability ? p.disabilityAllowance[disability - 1] : 0;
  const taxBase = r(Math.max(0, gross - sgkEmployee - unemploymentEmployee - allowance));

  const prevBase = previousTaxBase ?? r(taxBase * (month - 1));
  const incomeTax = r(incrementalIncomeTax(prevBase, taxBase, p.taxBrackets));

  const mwBase = minWageTaxBase(p);
  // Asgari ücret istisnaları sabit tutarlardır; her zaman kuruşa yuvarlanır
  const mwTax = round2(
    incrementalIncomeTax(round2(mwBase * (month - 1)), mwBase, p.taxBrackets),
  );
  const incomeTaxExemption = Math.min(incomeTax, mwTax);
  const incomeTaxPayable = r(incomeTax - incomeTaxExemption);

  // Damga: ödenecek tutar yuvarlamasız hesaptan bulunur (istisna 250,6977 gibi kesirli
  // düşülür); hesaplanan damga ve istisna yalnızca gösterim için kuruşa yuvarlanır.
  const stampExact = pct(gross, p.stampTaxRate);
  const stampExemptionExact = Math.min(stampExact, pct(p.minWage, p.stampTaxRate));
  const stampTax = r(stampExact);
  const stampTaxExemption = r(stampExemptionExact);
  const stampTaxPayable = r(stampExact - stampExemptionExact);

  const net = r(
    gross - sgkEmployee - unemploymentEmployee - incomeTaxPayable - stampTaxPayable,
  );

  const sgkEmployer = r(pct(sgkBase, employerRate(p, options.employerDiscount)));
  const unemploymentEmployer = r(pct(sgkBase, p.unemploymentEmployerRate));

  return {
    month,
    gross: r(gross),
    sgkBase: r(sgkBase),
    sgkEmployee,
    unemploymentEmployee,
    taxBase,
    cumulativeTaxBase: r(prevBase + taxBase),
    incomeTax,
    incomeTaxExemption,
    incomeTaxPayable,
    stampTax,
    stampTaxExemption,
    stampTaxPayable,
    net,
    sgkEmployer,
    unemploymentEmployer,
    employerCost: r(gross + sgkEmployer + unemploymentEmployer),
  };
}

/** Netten brüte: aynı ayda (ocaktan beri aynı ücretle) bu neti veren brüt ücret. */
export function grossFromNet(
  net: number,
  month: number,
  p: PayrollParams,
  options: SalaryOptions = {},
) {
  return round2(
    grossForNet(
      net,
      (g) => payrollForMonth(g, month, p, { ...options, exact: true }).net,
    ),
  );
}

export type SalaryDirection = "grossToNet" | "netToGross";

/**
 * Verilen neti veren yuvarlamasız brüt (ikili arama). Yuvarlamalı hesapta birkaç komşu brüt
 * aynı neti verdiği için çözüm yuvarlamasız yapılır; kalemler bu brütten hesaplanıp yalnızca
 * gösterimde kuruşa yuvarlanır (kariyer.net hesaplayıcısıyla aynı sonuç, salary-2026.test.ts).
 */
function grossForNet(net: number, exactNetAt: (gross: number) => number) {
  let low = net;
  let high = net * 3 + 1000;
  while (exactNetAt(high) < net) high *= 2;
  for (let i = 0; i < 200 && high - low > 1e-9; i++) {
    const mid = (low + high) / 2;
    if (exactNetAt(mid) < net) low = mid;
    else high = mid;
  }
  return high;
}

/**
 * Netten brüte satırının gösterimi (kariyer.net ile aynı kural): brüt kuruşa yuvarlanır;
 * SGK, işsizlik, damga ve işveren payları yuvarlanmış brütten, matrah ve gelir vergisi
 * yuvarlamasız çözümden hesaplanır. KGVM yuvarlanmış aylık matrahların toplamıdır.
 */
function displayRow(
  exact: MonthlyPayroll,
  p: PayrollParams,
  options: SalaryOptions,
  displayCumulative: number,
): MonthlyPayroll {
  const gross = round2(exact.gross);
  const shown = payrollForMonth(gross, exact.month, p, options);
  const taxBase = round2(exact.taxBase);
  return {
    ...shown,
    taxBase,
    cumulativeTaxBase: round2(displayCumulative + taxBase),
    incomeTax: round2(exact.incomeTax),
    incomeTaxExemption: exact.incomeTaxExemption,
    incomeTaxPayable: round2(exact.incomeTaxPayable),
    net: round2(exact.net),
  };
}

/**
 * Aylık döküm tablosu: startMonth'tan aralığa kadar her ay için kendi tutarı (amounts[ay - 1]).
 * Kümülatif GV matrahı başlangıç ayında sıfırdan başlar (yıl içinde işe giriş).
 * Brütten nete: tutar brüttür. Netten brüte: tutar ele geçecek nettir; her ayın brütü,
 * önceki ayların gerçek kümülatif matrahıyla bulunur (matrah arttıkça gereken brüt yükselir).
 */
export function payrollTable(
  amounts: readonly number[],
  startMonth: number,
  direction: SalaryDirection,
  p: PayrollParams,
  options: SalaryOptions = {},
): MonthlyPayroll[] {
  const rows: MonthlyPayroll[] = [];
  let cumulative = 0;
  let displayCumulative = 0;
  for (let month = startMonth; month <= 12; month++) {
    const amount = amounts[month - 1];
    let row: MonthlyPayroll;
    if (direction === "netToGross") {
      // Yuvarlamasız çözüm; kümülatif matrah da yuvarlamasız taşınır
      const exact = { ...options, exact: true };
      const gross = grossForNet(
        amount,
        (g) => payrollForMonth(g, month, p, exact, cumulative).net,
      );
      const exactRow = payrollForMonth(gross, month, p, exact, cumulative);
      cumulative = exactRow.cumulativeTaxBase;
      row = displayRow(exactRow, p, options, displayCumulative);
      displayCumulative = row.cumulativeTaxBase;
    } else {
      row = payrollForMonth(amount, month, p, options, cumulative);
      cumulative = row.cumulativeTaxBase;
    }
    rows.push(row);
  }
  return rows;
}

/** 12 aylık tablo, her ay aynı tutar (ocaktan başlar) */
export function yearlyPayroll(
  amount: number,
  direction: SalaryDirection,
  p: PayrollParams,
  options: SalaryOptions = {},
): MonthlyPayroll[] {
  return payrollTable(Array(12).fill(amount), 1, direction, p, options);
}

/** Asgari ücretlinin ele geçen neti (netten brüte hesapta alt sınır) */
export function minWageNet(p: PayrollParams, month = 1) {
  return payrollForMonth(p.minWage, month, p).net;
}

/** 12 aylık tablonun yıllık toplamı */
export function sumPayroll(rows: MonthlyPayroll[]) {
  const keys = [
    "gross",
    "sgkEmployee",
    "unemploymentEmployee",
    "incomeTaxPayable",
    "stampTaxPayable",
    "net",
    "sgkEmployer",
    "unemploymentEmployer",
    "employerCost",
  ] as const;
  return Object.fromEntries(
    keys.map((key) => [key, round2(rows.reduce((sum, row) => sum + row[key], 0))]),
  ) as Record<(typeof keys)[number], number>;
}
