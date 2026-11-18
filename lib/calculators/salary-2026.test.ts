// 2026 parametreleriyle referans karşılaştırması: 600.000 ₺ brüt ücretin 12 aylık dökümü,
// bağımsız bir bordro hesaplayıcısının (Datassist net-brüt) çıktısıyla aynı olmalı.

import { describe, expect, it } from "vitest";
import { PARAMS_2026 } from "@/config/mevzuat/2026";
import type { PayrollParams } from "@/config/mevzuat/types";
import { sumPayroll, yearlyPayroll } from "./salary";

const P = {
  ...PARAMS_2026,
  disabilityAllowance: [0, 0, 0],
  severanceCeiling: 0,
} as unknown as PayrollParams;

describe("2026 parametreleri: 600.000 ₺ brüt referans tablosu", () => {
  const rows = yearlyPayroll(600000, "grossToNet", P, { employerDiscount: "general" });

  it("ocak ayı tüm kalemler", () => {
    const r = rows[0];
    expect(r.sgkEmployee).toBe(41617.8);
    expect(r.sgkEmployer).toBe(58710.83);
    expect(r.unemploymentEmployee).toBe(2972.7);
    expect(r.unemploymentEmployer).toBe(5945.4);
    expect(r.taxBase).toBe(555409.5);
    expect(r.incomeTaxExemption).toBe(4211.33);
    expect(r.incomeTaxPayable).toBe(108249.24);
    expect(r.stampTaxExemption).toBe(250.7);
    expect(r.net).toBe(442856.96);
  });

  it("aylık net ve ödenecek gelir vergisi", () => {
    const expected: [number, number][] = [
      [442856.96, 108249.24],
      [405356.96, 145749.24],
      [392058.68, 159047.52],
      [360924.2, 190182.0],
      [360924.2, 190182.0],
      [360924.2, 190182.0],
      [361250.62, 189855.58],
      [362327.97, 188778.23],
      [362327.97, 188778.23],
      [349623.22, 201482.98],
      [334557.5, 216548.7],
      [334557.5, 216548.7],
    ];
    expect(rows.map((r) => [r.net, r.incomeTaxPayable])).toEqual(expected);
  });

  it("asgari ücret GV istisnası dilim geçişi (temmuz, ağustos)", () => {
    expect(rows[6].incomeTaxExemption).toBe(4537.75);
    expect(rows[7].incomeTaxExemption).toBe(5615.1);
    expect(rows[11].cumulativeTaxBase).toBe(6664914);
  });

  it("yıllık toplamlar", () => {
    const total = sumPayroll(rows);
    expect(total.net).toBe(4427689.98);
    expect(total.sgkEmployee).toBe(499413.6);
    expect(total.sgkEmployer).toBe(704529.96);
    expect(total.incomeTaxPayable).toBe(2185584.42);
  });
});

// Kariyer.net maaş hesaplama (2026, Ocak başlangıçlı) 100.000 ₺ dökümleri
describe("2026 parametreleri: kariyer.net 100.000 ₺ brütten nete", () => {
  const rows = yearlyPayroll(100000, "grossToNet", P);

  it("aylık net, gelir vergisi ve damga vergisi", () => {
    expect(rows.map((r) => r.net)).toEqual([
      75953.03, 75953.03, 72703.03, 71703.03, 69953.03, 65753.03, 66079.45, 67156.8,
      67156.8, 67156.8, 67156.8, 67156.8,
    ]);
    expect(rows.map((r) => r.incomeTaxPayable)).toEqual([
      8538.67, 8538.67, 11788.67, 12788.67, 14538.67, 18738.67, 18412.25, 17334.9,
      17334.9, 17334.9, 17334.9, 17334.9,
    ]);
    expect(rows[0].stampTaxPayable).toBe(508.3);
    expect(rows[11].cumulativeTaxBase).toBe(1020000);
  });

  it("toplamlar", () => {
    const total = sumPayroll(rows);
    expect(total.net).toBe(833881.63);
    expect(total.incomeTaxPayable).toBe(180018.77);
    expect(total.stampTaxPayable).toBe(6099.6);
  });

  it("prim indirimi seçenekleri: yok %21,75, genel %19,75, imalat %16,75", () => {
    const cost = (d: "none" | "general" | "manufacturing") =>
      yearlyPayroll(100000, "grossToNet", P, { employerDiscount: d })[0];
    expect([cost("none").sgkEmployer, cost("none").employerCost]).toEqual([
      21750, 123750,
    ]);
    expect([cost("general").sgkEmployer, cost("general").employerCost]).toEqual([
      19750, 121750,
    ]);
    expect([
      cost("manufacturing").sgkEmployer,
      cost("manufacturing").employerCost,
    ]).toEqual([16750, 118750]);
  });
});

describe("2026 parametreleri: kariyer.net 100.000 ₺ netten brüte", () => {
  const rows = yearlyPayroll(100000, "netToGross", P);

  // Kariyer.net netten brüte çözümünü bilinmeyen bir yinelemeyle yapıyor; ocak–haziran
  // kuruşu kuruşuna aynı, temmuz–aralık arasında en fazla 1 kuruş fark kalıyor.
  const reference = [
    133636.36, 136401.18, 142082.91, 150200.09, 155876.02, 155876.02, 155343.45,
    153585.69, 153585.69, 153585.69, 153585.69, 157658.7,
  ];

  it("aylık brüt ücret (ocak–haziran birebir, sonrası ±0,01)", () => {
    expect(rows.slice(0, 6).map((r) => r.gross)).toEqual(reference.slice(0, 6));
    rows.forEach((r, i) =>
      expect(Math.abs(r.gross - reference[i])).toBeLessThanOrEqual(0.011),
    );
  });

  it("her ayın neti tam hedef tutar", () => {
    for (const r of rows) expect(r.net).toBe(100000);
  });

  it("şubat ve mart kalemleri (yuvarlanmış brütten SGK/damga, kesin matrah, KGVM toplamı)", () => {
    const [feb, mar] = [rows[1], rows[2]];
    expect([feb.sgkEmployee, feb.unemploymentEmployee, feb.taxBase]).toEqual([
      19096.17, 1364.01, 115941,
    ]);
    expect([feb.stampTaxPayable, feb.cumulativeTaxBase]).toEqual([784.59, 229531.91]);
    // Kariyer.net 15.156,41 gösteriyor; bu tutar gösterdiği brütle (136.401,18) tutarlı değil
    // (ara adımlarda yuvarlıyor). Bizim sonuç 1 kuruş farklı.
    expect(Math.abs(feb.incomeTaxPayable - 15156.41)).toBeLessThanOrEqual(0.011);
    expect([mar.taxBase, mar.cumulativeTaxBase, mar.incomeTaxPayable]).toEqual([
      120770.48, 350302.39, 19942.77,
    ]);
  });

  it("ocak ayı kalemleri", () => {
    const r = rows[0];
    expect(r.sgkEmployee).toBe(18709.09);
    expect(r.unemploymentEmployee).toBe(1336.36);
    expect(r.taxBase).toBe(113590.91);
    expect(r.stampTaxPayable).toBe(763.6);
    expect(r.incomeTaxPayable).toBe(12827.31);
    expect(r.sgkEmployer).toBe(29065.91);
    expect(r.unemploymentEmployer).toBe(2672.73);
  });

  it("toplamlar ve indirim seçenekleri", () => {
    expect(Math.abs(sumPayroll(rows).gross - 1801417.48)).toBeLessThanOrEqual(0.06);
    const general = yearlyPayroll(100000, "netToGross", P, {
      employerDiscount: "general",
    });
    const manufacturing = yearlyPayroll(100000, "netToGross", P, {
      employerDiscount: "manufacturing",
    });
    expect(general[0].sgkEmployer).toBe(26393.18);
    expect(manufacturing[0].sgkEmployer).toBe(22384.09);
    expect(Math.abs(sumPayroll(general).sgkEmployer - 355779.93)).toBeLessThanOrEqual(
      0.02,
    );
    expect(
      Math.abs(sumPayroll(manufacturing).sgkEmployer - 301737.42),
    ).toBeLessThanOrEqual(0.02);
  });
});
