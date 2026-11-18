import { describe, expect, it } from "vitest";
import { incomeTax } from "./common";
import { grossFromNet, payrollForMonth, sumPayroll, yearlyPayroll } from "./salary";
import { TEST_PARAMS as P } from "./test-params";

describe("gelir vergisi dilimleri", () => {
  it("dilimleri artan oranla uygular", () => {
    // 100.000 × %15 + 50.000 × %20
    expect(incomeTax(150000, P.taxBrackets)).toBe(25000);
    expect(incomeTax(0, P.taxBrackets)).toBe(0);
  });
});

describe("net-brüt maaş: brütten nete", () => {
  it("ocak ayı, 30.000 brüt", () => {
    // SGK 4.200, işsizlik 300, GV matrahı 25.500, GV 3.825 − AÜ istisnası 2.550 = 1.275
    // damga 227,70 − 151,80 = 75,90 → net 24.149,10
    const r = payrollForMonth(30000, 1, P);
    expect(r.sgkEmployee).toBe(4200);
    expect(r.unemploymentEmployee).toBe(300);
    expect(r.taxBase).toBe(25500);
    expect(r.incomeTaxPayable).toBe(1275);
    expect(r.stampTaxPayable).toBe(75.9);
    expect(r.net).toBe(24149.1);
  });

  it("mayıs ayında kümülatif matrah ikinci dilime geçer", () => {
    // önceki matrah 102.000 → bu ayın 25.500 matrahı %20: 5.100; AÜ istisnası 2.550
    const r = payrollForMonth(30000, 5, P);
    expect(r.incomeTax).toBe(5100);
    expect(r.incomeTaxPayable).toBe(2550);
    expect(r.net).toBe(22874.1);
  });

  it("asgari ücretli: gelir ve damga vergisi sıfır", () => {
    const r = payrollForMonth(20000, 1, P);
    expect(r.incomeTaxPayable).toBe(0);
    expect(r.stampTaxPayable).toBe(0);
    expect(r.net).toBe(17000);
  });

  it("SGK tavanı aşılınca primler tavandan hesaplanır", () => {
    // matrah 150.000: SGK 21.000, işsizlik 1.500; GV matrahı 177.500 → 30.500 − 2.550
    const r = payrollForMonth(200000, 1, P);
    expect(r.sgkBase).toBe(150000);
    expect(r.sgkEmployee).toBe(21000);
    expect(r.incomeTaxPayable).toBe(27950);
    expect(r.stampTaxPayable).toBe(1366.2);
    expect(r.net).toBe(148183.8);
  });

  it("1. derece engellilik indirimi GV matrahını düşürür", () => {
    // GV matrahı 25.500 − 10.000 = 15.500 → GV 2.325, istisna en fazla GV kadar → 0
    const r = payrollForMonth(30000, 1, P, { disability: 1 });
    expect(r.taxBase).toBe(15500);
    expect(r.incomeTaxPayable).toBe(0);
    expect(r.net).toBe(25424.1);
  });
});

describe("net-brüt maaş: netten brüte", () => {
  it("24.149,10 net → 30.000 brüt (ocak)", () => {
    expect(grossFromNet(24149.1, 1, P)).toBe(30000);
  });

  it("asgari ücret neti → asgari ücret brütü", () => {
    expect(grossFromNet(17000, 1, P)).toBe(20000);
  });

  it("12 ay boyunca aynı net için gereken brüt artar, net sabit kalır", () => {
    const rows = yearlyPayroll(24149.1, "netToGross", P);
    expect(rows).toHaveLength(12);
    for (const row of rows) expect(Math.abs(row.net - 24149.1)).toBeLessThanOrEqual(0.01);
    expect(rows[0].gross).toBe(30000);
    expect(rows[11].gross).toBeGreaterThan(rows[0].gross);
  });
});

describe("işveren maliyeti", () => {
  it("indirimsiz: brüt + %20 SGK + %2 işsizlik", () => {
    const r = payrollForMonth(30000, 1, P);
    expect(r.sgkEmployer).toBe(6000);
    expect(r.unemploymentEmployer).toBe(600);
    expect(r.employerCost).toBe(36600);
  });

  it("5 puan indirimle SGK işveren payı %15", () => {
    const r = payrollForMonth(30000, 1, P, { employerDiscount: "general" });
    expect(r.sgkEmployer).toBe(4500);
    expect(r.employerCost).toBe(35100);
  });

  it("tavan üstü ücrette işveren primi tavandan", () => {
    const r = payrollForMonth(200000, 1, P);
    expect(r.sgkEmployer).toBe(30000);
    expect(r.unemploymentEmployer).toBe(3000);
    expect(r.employerCost).toBe(233000);
  });

  it("yıllık toplam 12 ayın toplamıdır", () => {
    const total = sumPayroll(yearlyPayroll(30000, "grossToNet", P));
    expect(total.gross).toBe(360000);
    expect(total.employerCost).toBe(439200);
  });

  it("netten başlanınca brüt bulunup maliyet ondan hesaplanır", () => {
    const gross = grossFromNet(24149.1, 1, P);
    expect(payrollForMonth(gross, 1, P).employerCost).toBe(36600);
  });
});
