import { describe, expect, it } from "vitest";
import { calculateAnnualLeave, leaveDaysForSeniority } from "./annual-leave";

const run = (startDate: string, calcDate: string, birthDate?: string, usedDays = 0) => {
  const r = calculateAnnualLeave({ startDate, calcDate, birthDate, usedDays });
  if (!r.ok) throw new Error(r.error);
  return r;
};

describe("yıllık izin", () => {
  it("kıdem sınırları: 5 yıl dahil 14, 15 yıl dahil 26", () => {
    expect(leaveDaysForSeniority(0)).toBe(0);
    expect(leaveDaysForSeniority(1)).toBe(14);
    expect(leaveDaysForSeniority(5)).toBe(14);
    expect(leaveDaysForSeniority(6)).toBe(20);
    expect(leaveDaysForSeniority(14)).toBe(20);
    expect(leaveDaysForSeniority(15)).toBe(26);
  });

  it("6 yıllık çalışan 20 gün", () => {
    const r = run("2020-03-01", "2026-11-17");
    expect(r.seniorityYears).toBe(6);
    expect(r.entitlement).toBe(20);
  });

  it("50 yaş ve üstüne en az 20 gün", () => {
    const r = run("2023-01-01", "2026-01-01", "1975-05-05");
    expect(r.age).toBe(50);
    expect(r.ageRuleApplied).toBe(true);
    expect(r.entitlement).toBe(20);
  });

  it("18 yaş ve altına en az 20 gün; 19 yaşa uygulanmaz", () => {
    expect(run("2024-01-01", "2026-01-01", "2007-06-01").entitlement).toBe(20);
    expect(run("2024-01-01", "2026-01-01", "2006-06-01").entitlement).toBe(14);
  });

  it("1 yıl dolmadan hak doğmaz, sonraki hak tarihi verilir", () => {
    const r = run("2026-01-01", "2026-11-17");
    expect(r.eligible).toBe(false);
    expect(r.entitlement).toBe(0);
    expect(r.nextEntitlementDate).toBe("2027-01-01");
  });

  it("kullanılan gün düşülür, kalan negatif olmaz", () => {
    expect(run("2020-03-01", "2026-11-17", undefined, 5).remaining).toBe(15);
    expect(run("2020-03-01", "2026-11-17", undefined, 40).remaining).toBe(0);
  });

  it("geçersiz girişlerde hata verir", () => {
    expect(
      calculateAnnualLeave({
        startDate: "2026-01-01",
        calcDate: "2025-01-01",
        usedDays: 0,
      }),
    ).toEqual({ ok: false, error: "calcBeforeStart" });
    expect(
      calculateAnnualLeave({
        startDate: "2020-01-01",
        calcDate: "2026-01-01",
        birthDate: "2027-01-01",
        usedDays: 0,
      }),
    ).toEqual({ ok: false, error: "invalidBirthDate" });
  });
});
