import { describe, expect, it } from "vitest";
import { calculateSeverance, type SeveranceInput } from "./severance";
import { TEST_PARAMS as P } from "./test-params";

const base: SeveranceInput = {
  startDate: "2020-01-01",
  endDate: "2025-06-30",
  grossSalary: 30000,
  extraPayments: 5000,
  severanceCeiling: P.severanceCeiling,
  stampTaxRate: P.stampTaxRate,
};

describe("kıdem tazminatı", () => {
  it("5 yıl 6 ay, tavan altı giydirilmiş ücret", () => {
    // esas 35.000 × 5 + 35.000 × 6/12 = 192.500; damga 1.461,08
    const r = calculateSeverance(base);
    if (!r.ok) throw new Error(r.error);
    expect(r.service).toEqual({ years: 5, months: 6, days: 0 });
    expect(r.ceilingApplied).toBe(false);
    expect(r.gross).toBe(192500);
    expect(r.stampTax).toBe(1461.08);
    expect(r.net).toBe(191038.92);
  });

  it("tavanı aşan ücret tavanla sınırlanır", () => {
    const r = calculateSeverance({ ...base, grossSalary: 50000 });
    if (!r.ok) throw new Error(r.error);
    expect(r.ceilingApplied).toBe(true);
    expect(r.baseSalary).toBe(40000);
    expect(r.gross).toBe(220000);
    expect(r.net).toBe(218330.2);
  });

  it("artan gün oransal hesaplanır (1 yıl 1 ay 10 gün)", () => {
    // 30.000 + 30.000/12 + 30.000 × 10/365 = 33.321,92
    const r = calculateSeverance({
      ...base,
      startDate: "2024-03-15",
      endDate: "2025-04-24",
      extraPayments: 0,
    });
    if (!r.ok) throw new Error(r.error);
    expect(r.service).toEqual({ years: 1, months: 1, days: 10 });
    expect(r.gross).toBe(33321.92);
    expect(r.stampTax).toBe(252.91);
  });

  it("1 yıldan kısa hizmette hak doğmaz", () => {
    const r = calculateSeverance({ ...base, startDate: "2025-01-01" });
    if (!r.ok) throw new Error(r.error);
    expect(r.eligible).toBe(false);
    expect(r.gross).toBe(0);
  });

  it("çıkış tarihi girişten önceyse hata verir", () => {
    expect(calculateSeverance({ ...base, endDate: "2019-12-31" })).toEqual({
      ok: false,
      error: "endBeforeStart",
    });
    expect(calculateSeverance({ ...base, startDate: "2025-02-30" })).toEqual({
      ok: false,
      error: "invalidDates",
    });
  });
});
