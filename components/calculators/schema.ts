// Hesaplama formlarının ortak zod şemaları. Form değerleri metindir; şema sayıya çevirir.
// Hata mesajları messages → calculatorUi.errors.<kod> anahtarlarıdır.

import { z } from "zod";
import { CURRENT_PARAMS } from "@/config/mevzuat/2026";
import type { PayrollParams } from "@/config/mevzuat/types";
import { defaultText, parseNumber } from "@/lib/calculators/format";

export type ErrorCode =
  | "required"
  | "invalid"
  | "negative"
  | "tooLarge"
  | "rateRange"
  | "bracketOrder"
  | "invalidDate";

const numberField = (rate: boolean, max: number) =>
  z
    .string()
    .trim()
    .min(1, "required")
    .transform((v) => parseNumber(v, { rate }))
    .pipe(
      z
        .number("invalid")
        .refine((n) => Number.isFinite(n), "invalid")
        .refine((n) => n >= 0, "negative")
        .refine((n) => n <= max, rate ? "rateRange" : "tooLarge"),
    );

/** Tutar (₺) */
export const money = () => numberField(false, 1_000_000_000);
/** Yüzde oranı (0–100) */
export const rate = () => numberField(true, 100);
/** Saat / gün gibi düz sayı */
export const quantity = (max = 10_000) => numberField(true, max);
/** Boş bırakılabilen tutar (boş = 0) */
export const optionalMoney = () =>
  z
    .string()
    .trim()
    .transform((v) => (v === "" ? "0" : v))
    .pipe(money());
export const optionalQuantity = (max = 10_000) =>
  z
    .string()
    .trim()
    .transform((v) => (v === "" ? "0" : v))
    .pipe(quantity(max));
export const date = () => z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalidDate");
export const optionalDate = () => z.union([z.literal(""), date()]);

/* ------------------------------------------------------------------ */
/* Yıl bazlı parametreler                                              */
/* ------------------------------------------------------------------ */

export const TAX_BRACKET_COUNT = 5;

export const PARAM_FIELDS = {
  minWage: { kind: "money", schema: money },
  sgkCeiling: { kind: "money", schema: money },
  severanceCeiling: { kind: "money", schema: money },
  sgkEmployeeRate: { kind: "rate", schema: rate },
  unemploymentEmployeeRate: { kind: "rate", schema: rate },
  sgkEmployerRate: { kind: "rate", schema: rate },
  unemploymentEmployerRate: { kind: "rate", schema: rate },
  employerDiscountPoints: { kind: "rate", schema: rate },
  manufacturingDiscountPoints: { kind: "rate", schema: rate },
  stampTaxRate: { kind: "rate", schema: rate },
} as const;

export type ScalarParam = keyof typeof PARAM_FIELDS;
/** Formda gösterilen parametre grupları */
export type ParamGroup = ScalarParam | "taxBrackets" | "disabilityAllowance";

const taxFields = () => {
  const fields: Record<string, ReturnType<typeof money>> = {};
  for (let i = 1; i < TAX_BRACKET_COUNT; i++) fields[`taxLimit${i}`] = money();
  for (let i = 1; i <= TAX_BRACKET_COUNT; i++) fields[`taxRate${i}`] = rate();
  return fields;
};

/** Engellilik indirimleri isteğe bağlı: yalnızca seçilen derecenin tutarı gerekir (formda kontrol edilir). */
const disabilityFields = () => ({
  disability1: optionalMoney(),
  disability2: optionalMoney(),
  disability3: optionalMoney(),
});

/** Seçilen parametre gruplarının şema alanları */
export function paramShape(groups: readonly ParamGroup[]) {
  let shape: Record<string, z.ZodType<number, string>> = {};
  for (const group of groups) {
    if (group === "taxBrackets") shape = { ...shape, ...taxFields() };
    else if (group === "disabilityAllowance") shape = { ...shape, ...disabilityFields() };
    else shape[group] = PARAM_FIELDS[group].schema();
  }
  return shape;
}

/** Dilim üst sınırları artan sırada olmalı */
export function checkBrackets(values: Record<string, unknown>, ctx: z.RefinementCtx) {
  let prev = 0;
  for (let i = 1; i < TAX_BRACKET_COUNT; i++) {
    const limit = values[`taxLimit${i}`];
    if (typeof limit !== "number") return;
    if (limit <= prev) {
      ctx.addIssue({ code: "custom", message: "bracketOrder", path: [`taxLimit${i}`] });
      return;
    }
    prev = limit;
  }
}

/** Form varsayılanları: config/mevzuat/{yil}.ts (null → boş alan) */
export function paramDefaults(groups: readonly ParamGroup[], locale: string) {
  const p = CURRENT_PARAMS;
  const values: Record<string, string> = {};
  for (const group of groups) {
    if (group === "taxBrackets") {
      p.taxBrackets.forEach((b, i) => {
        if (i < TAX_BRACKET_COUNT - 1)
          values[`taxLimit${i + 1}`] = defaultText(b.limit, locale);
        values[`taxRate${i + 1}`] = defaultText(b.rate, locale);
      });
    } else if (group === "disabilityAllowance") {
      p.disabilityAllowance.forEach(
        (v, i) => (values[`disability${i + 1}`] = defaultText(v, locale)),
      );
    } else {
      values[group] = defaultText(p[group], locale);
    }
  }
  return values;
}

/** Herhangi bir varsayılan eksik mi (parametre bölümü açık gelsin) */
export function hasMissingDefaults(groups: readonly ParamGroup[], locale: string) {
  // Engellilik tutarları isteğe bağlıdır; eksik olmaları bölümü açık getirmez
  const required = groups.filter((g) => g !== "disabilityAllowance");
  return Object.values(paramDefaults(required, locale)).some((v) => v === "");
}

/** Doğrulanmış form değerlerinden hesap parametreleri (kullanılmayanlar 0) */
export function toParams(values: Record<string, unknown>): PayrollParams {
  const n = (key: string) =>
    typeof values[key] === "number" ? (values[key] as number) : 0;
  const taxBrackets = Array.from({ length: TAX_BRACKET_COUNT }, (_, i) => ({
    limit: i < TAX_BRACKET_COUNT - 1 ? n(`taxLimit${i + 1}`) : null,
    rate: n(`taxRate${i + 1}`),
  }));
  return {
    minWage: n("minWage"),
    sgkCeiling: n("sgkCeiling"),
    sgkEmployeeRate: n("sgkEmployeeRate"),
    unemploymentEmployeeRate: n("unemploymentEmployeeRate"),
    sgkEmployerRate: n("sgkEmployerRate"),
    unemploymentEmployerRate: n("unemploymentEmployerRate"),
    employerDiscountPoints: n("employerDiscountPoints"),
    manufacturingDiscountPoints: n("manufacturingDiscountPoints"),
    stampTaxRate: n("stampTaxRate"),
    taxBrackets,
    severanceCeiling: n("severanceCeiling"),
    disabilityAllowance: [n("disability1"), n("disability2"), n("disability3")],
  };
}

export const PARAM_YEAR = CURRENT_PARAMS.year;

/** Ay numarasından çeviri anahtarı (calculatorUi.months.<1–12>) */
export const monthKey = (month: number) => `months.${month}` as "months.1";
