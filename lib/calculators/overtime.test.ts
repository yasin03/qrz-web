import { describe, expect, it } from "vitest";
import { calculateOvertime, overtimeNet } from "./overtime";
import { TEST_PARAMS as P } from "./test-params";

describe("fazla mesai", () => {
  it("saatlik ücret = aylık brüt / 225", () => {
    const r = calculateOvertime({
      grossSalary: 22500,
      overtimeHours: 0,
      extraHours: 0,
      holidayHours: 0,
    });
    expect(r.hourlyWage).toBe(100);
    expect(r.gross).toBe(0);
  });

  it("%50, %25 ve %100 zamlı saatler ayrı hesaplanır", () => {
    // 10 × 150 + 4 × 125 + 8 × 200 = 3.600
    const r = calculateOvertime({
      grossSalary: 22500,
      overtimeHours: 10,
      extraHours: 4,
      holidayHours: 8,
    });
    expect(r.lines.map((l) => [l.key, l.hourly, l.amount])).toEqual([
      ["overtime", 150, 1500],
      ["extraHours", 125, 500],
      ["holiday", 200, 1600],
    ]);
    expect(r.totalHours).toBe(22);
    expect(r.gross).toBe(3600);
  });

  it("kesirli saatler kabul edilir", () => {
    const r = calculateOvertime({
      grossSalary: 22500,
      overtimeHours: 2.5,
      extraHours: 0,
      holidayHours: 0,
    });
    expect(r.gross).toBe(375);
  });

  it("tahmini net: maaşa eklenen mesainin kesintiler sonrası tutarı", () => {
    // 22.500 neti 18.787,27; 26.100 neti 21.360,95 → fark 2.573,68
    expect(overtimeNet(22500, 3600, 1, P)).toBe(2573.68);
  });

  it("asgari ücretlinin mesaisinde de vergi doğar", () => {
    const net = overtimeNet(20000, 1000, 1, P);
    // 1.000 brütten SGK %15 ve GV/damga kesilir; net brütten küçük, sıfırdan büyük
    expect(net).toBeGreaterThan(0);
    expect(net).toBeLessThan(1000);
  });
});
