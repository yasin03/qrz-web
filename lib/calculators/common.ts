// Hesaplama araçlarının ortak yardımcıları (saf fonksiyonlar, test edilebilir).

import type { TaxBracket } from "@/config/mevzuat/types";

/**
 * Kuruşa yuvarlama (yarım kuruş yukarı). Bordro kalemleri kuruş hassasiyetindedir.
 * Kayan nokta hatası (194393,325 → 194393,32499…) yarımları aşağı yuvarlamasın diye
 * önce 6 haneye sabitlenir.
 */
export function round2(value: number) {
  return Math.round(Number((value * 100).toFixed(6))) / 100;
}

/** Yüzde oranı uygular: pct(1000, 14) = 140 */
export function pct(amount: number, rate: number) {
  return (amount * rate) / 100;
}

/**
 * Yıllık kümülatif matraha göre artan oranlı gelir vergisi.
 * Dilimler artan sıradadır; son dilimin limit'i null (sınırsız).
 */
export function incomeTax(base: number, brackets: TaxBracket[]) {
  let tax = 0;
  let lower = 0;
  for (const { limit, rate } of brackets) {
    const upper = limit ?? Infinity;
    if (base <= lower) break;
    tax += pct(Math.min(base, upper) - lower, rate);
    lower = upper;
  }
  return tax;
}

/** Önceki kümülatif matraha eklenen matrahın vergisi (bu ayın gelir vergisi). */
export function incrementalIncomeTax(
  previousBase: number,
  base: number,
  brackets: TaxBracket[],
) {
  return incomeTax(previousBase + base, brackets) - incomeTax(previousBase, brackets);
}

/* ------------------------------------------------------------------ */
/* Tarih yardımcıları ("YYYY-MM-DD", saat dilimi etkisi olmasın diye UTC) */
/* ------------------------------------------------------------------ */

export type YMD = { years: number; months: number; days: number };

export function parseDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  // 2026-02-31 gibi geçersiz tarihleri reddet
  if (date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return date;
}

function daysInMonth(year: number, monthIndex: number) {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

/**
 * İki tarih arasındaki süre (yıl, ay, gün). inclusive: bitiş günü de sayılır
 * (işe giriş ve çıkış günü çalışılmış kabul edilir).
 */
export function diffYMD(start: Date, end: Date, inclusive = false): YMD {
  const last = new Date(end.getTime());
  if (inclusive) last.setUTCDate(last.getUTCDate() + 1);
  let years = last.getUTCFullYear() - start.getUTCFullYear();
  let months = last.getUTCMonth() - start.getUTCMonth();
  let days = last.getUTCDate() - start.getUTCDate();
  if (days < 0) {
    months -= 1;
    // Bitişten bir önceki ayın gün sayısı kadar ödünç al
    const prev = new Date(Date.UTC(last.getUTCFullYear(), last.getUTCMonth() - 1, 1));
    days += daysInMonth(prev.getUTCFullYear(), prev.getUTCMonth());
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

/** Süreyi toplam aya çevirir (gün kesri dahil, 30 gün = 1 ay). */
export function totalMonths({ years, months, days }: YMD) {
  return years * 12 + months + days / 30;
}

/** Tarihe yıl ekler (29 Şubat → 28 Şubat). */
export function addYears(date: Date, years: number) {
  const y = date.getUTCFullYear() + years;
  const m = date.getUTCMonth();
  const d = Math.min(date.getUTCDate(), daysInMonth(y, m));
  return new Date(Date.UTC(y, m, d));
}

export function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}
