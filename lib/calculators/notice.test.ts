import { describe, expect, it } from "vitest";
import { calculateNotice, type NoticeInput } from "./notice";
import { TEST_PARAMS as P } from "./test-params";

const base: NoticeInput = {
  startDate: "2024-01-01",
  endDate: "2024-05-31",
  grossSalary: 30000,
  extraPayments: 0,
  previousTaxBase: 0,
  taxBrackets: P.taxBrackets,
  stampTaxRate: P.stampTaxRate,
};

const weeksFor = (startDate: string, endDate: string) => {
  const r = calculateNotice({ ...base, startDate, endDate });
  if (!r.ok) throw new Error(r.error);
  return r.weeks;
};

describe("ihbar tazminatı", () => {
  it("6 aydan az: 2 hafta, 14 günlük brüt ücret", () => {
    // günlük 1.000 × 14 = 14.000; GV %15 = 2.100; damga 106,26
    const r = calculateNotice(base);
    if (!r.ok) throw new Error(r.error);
    expect(r.weeks).toBe(2);
    expect(r.gross).toBe(14000);
    expect(r.incomeTax).toBe(2100);
    expect(r.stampTax).toBe(106.26);
    expect(r.net).toBe(11793.74);
  });

  it("süre sınırları kanundaki gibi (6 ay, 1,5 yıl, 3 yıl dahil)", () => {
    expect(weeksFor("2024-01-01", "2024-06-30")).toBe(4); // tam 6 ay
    expect(weeksFor("2023-01-01", "2024-06-30")).toBe(4); // tam 18 ay
    expect(weeksFor("2023-01-01", "2024-07-31")).toBe(6); // 19 ay
    expect(weeksFor("2020-01-01", "2022-12-31")).toBe(6); // tam 3 yıl
    expect(weeksFor("2020-01-01", "2023-01-31")).toBe(8); // 3 yıl 1 ay
  });

  it("8 hafta ve önceki matrahla ikinci dilime taşma", () => {
    // 56.000 brüt; önceki matrah 90.000: 10.000 × %15 + 46.000 × %20 = 10.700
    const r = calculateNotice({
      ...base,
      startDate: "2020-01-01",
      endDate: "2024-12-31",
      previousTaxBase: 90000,
    });
    if (!r.ok) throw new Error(r.error);
    expect(r.weeks).toBe(8);
    expect(r.gross).toBe(56000);
    expect(r.incomeTax).toBe(10700);
    expect(r.net).toBe(44874.96);
  });

  it("ek ödemeler günlük ücrete eklenir", () => {
    const r = calculateNotice({ ...base, extraPayments: 6000 });
    if (!r.ok) throw new Error(r.error);
    expect(r.dailySalary).toBe(1200);
    expect(r.gross).toBe(16800);
  });

  it("geçersiz tarihlerde hata verir", () => {
    expect(calculateNotice({ ...base, endDate: "2023-12-31" })).toEqual({
      ok: false,
      error: "endBeforeStart",
    });
    expect(calculateNotice({ ...base, startDate: "abc" })).toEqual({
      ok: false,
      error: "invalidDates",
    });
  });
});
