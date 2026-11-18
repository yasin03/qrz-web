// İhbar tazminatı (4857 sayılı İş Kanunu m.17).
//   İhbar süresi hizmet süresine göre 2, 4, 6 veya 8 haftadır (config/mevzuat/rules.ts).
//   Günlük giydirilmiş ücret = (brüt ücret + düzenli ek ödemeler) / 30
//   Brüt tazminat = günlük ücret × 7 × hafta
//   Gelir vergisi yıl içindeki kümülatif matraha eklenerek hesaplanır, damga vergisi kesilir.
//   İhbar tazminatından SGK primi kesilmez.

import { NOTICE_PERIODS } from "@/config/mevzuat/rules";
import type { TaxBracket } from "@/config/mevzuat/types";
import {
  diffYMD,
  incrementalIncomeTax,
  parseDate,
  pct,
  round2,
  totalMonths,
  type YMD,
} from "./common";

export type NoticeInput = {
  startDate: string;
  endDate: string;
  grossSalary: number;
  extraPayments: number;
  /** Bu yıl içinde daha önce oluşmuş gelir vergisi matrahı toplamı */
  previousTaxBase: number;
  taxBrackets: TaxBracket[];
  stampTaxRate: number;
};

export type NoticeResult =
  | { ok: false; error: "invalidDates" | "endBeforeStart" }
  | {
      ok: true;
      service: YMD;
      weeks: number;
      days: number;
      dailySalary: number;
      gross: number;
      incomeTax: number;
      stampTax: number;
      net: number;
    };

/** Hizmet süresine göre ihbar süresi (hafta) */
export function noticeWeeks(service: YMD) {
  const months = totalMonths(service);
  return NOTICE_PERIODS.find((period) =>
    period.inclusive ? months <= period.maxMonths : months < period.maxMonths,
  )!.weeks;
}

export function calculateNotice(input: NoticeInput): NoticeResult {
  const start = parseDate(input.startDate);
  const end = parseDate(input.endDate);
  if (!start || !end) return { ok: false, error: "invalidDates" };
  if (end < start) return { ok: false, error: "endBeforeStart" };

  const service = diffYMD(start, end, true);
  const weeks = noticeWeeks(service);
  const days = weeks * 7;
  const dailySalary = round2((input.grossSalary + input.extraPayments) / 30);
  const gross = round2(dailySalary * days);
  const incomeTax = round2(
    incrementalIncomeTax(input.previousTaxBase, gross, input.taxBrackets),
  );
  const stampTax = round2(pct(gross, input.stampTaxRate));

  return {
    ok: true,
    service,
    weeks,
    days,
    dailySalary,
    gross,
    incomeTax,
    stampTax,
    net: round2(gross - incomeTax - stampTax),
  };
}
