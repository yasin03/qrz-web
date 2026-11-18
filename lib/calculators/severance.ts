// Kıdem tazminatı (1475 sayılı Kanun m.14, yürürlükteki hükümler).
//   Hizmet süresi: işe giriş ve çıkış günü dahil
//   Esas ücret = min(brüt ücret + düzenli ek ödemeler, kıdem tavanı)
//   Brüt tazminat = esas × tam yıl + esas × ay / 12 + esas × gün / 365
//   Kıdem tazminatı gelir vergisinden istisnadır; yalnızca damga vergisi kesilir.
//   1 yıldan kısa hizmette tazminat hakkı doğmaz.

import { SEVERANCE_DAYS_PER_YEAR, SEVERANCE_MIN_YEARS } from "@/config/mevzuat/rules";
import { diffYMD, parseDate, pct, round2, type YMD } from "./common";

export type SeveranceInput = {
  startDate: string;
  endDate: string;
  grossSalary: number;
  /** Düzenli ödenen aylık brüt ek ödemeler (yemek, yol, prim vb.) */
  extraPayments: number;
  severanceCeiling: number;
  stampTaxRate: number;
};

export type SeveranceResult =
  | { ok: false; error: "invalidDates" | "endBeforeStart" }
  | {
      ok: true;
      eligible: boolean;
      service: YMD;
      dressedSalary: number;
      baseSalary: number;
      ceilingApplied: boolean;
      gross: number;
      stampTax: number;
      net: number;
    };

export function calculateSeverance(input: SeveranceInput): SeveranceResult {
  const start = parseDate(input.startDate);
  const end = parseDate(input.endDate);
  if (!start || !end) return { ok: false, error: "invalidDates" };
  if (end < start) return { ok: false, error: "endBeforeStart" };

  const service = diffYMD(start, end, true);
  const dressedSalary = round2(input.grossSalary + input.extraPayments);
  const ceilingApplied = dressedSalary > input.severanceCeiling;
  const baseSalary = ceilingApplied ? input.severanceCeiling : dressedSalary;
  const eligible = service.years >= SEVERANCE_MIN_YEARS;

  const perYear = (baseSalary * SEVERANCE_DAYS_PER_YEAR) / 30;
  const gross = eligible
    ? round2(
        perYear * service.years +
          (perYear * service.months) / 12 +
          (perYear * service.days) / 365,
      )
    : 0;
  const stampTax = round2(pct(gross, input.stampTaxRate));

  return {
    ok: true,
    eligible,
    service,
    dressedSalary,
    baseSalary: round2(baseSalary),
    ceilingApplied,
    gross,
    stampTax,
    net: round2(gross - stampTax),
  };
}
