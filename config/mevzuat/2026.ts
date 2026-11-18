// 2026 yılı hesaplama parametrelerinin varsayılanları. Kullanıcı formda değiştirebilir.
// Oranlar yüzde cinsindendir (14 = %14, damga vergisi binde 7,59 = 0,759).
//
// Kaynak: 2026 bordro dökümlerinden (Datassist ve kariyer.net maaş hesaplama) geri hesaplandı;
// lib/calculators/salary-2026.test.ts bu dökümlerle kuruşu kuruşuna karşılaştırır.
// TODO: null olan değerler henüz doğrulanmadı; formda boş gelir.

import type { ParamDefaults } from "./types";

export const PARAMS_2026: ParamDefaults = {
  year: 2026,
  minWage: 33030, // aylık brüt asgari ücret
  sgkCeiling: 297270, // asgari ücretin 9 katı
  sgkEmployeeRate: 14,
  unemploymentEmployeeRate: 1,
  // İşveren payı %21,75; genel prim indirimiyle %19,75 (2 puan), imalat sektöründe %16,75 (5 puan)
  sgkEmployerRate: 21.75,
  unemploymentEmployerRate: 2,
  employerDiscountPoints: 2,
  manufacturingDiscountPoints: 5,
  stampTaxRate: 0.759,
  // Ücret gelirleri için dilimler (yıllık kümülatif matrah)
  taxBrackets: [
    { limit: 190000, rate: 15 },
    { limit: 400000, rate: 20 },
    { limit: 1500000, rate: 27 },
    { limit: 5300000, rate: 35 },
    { limit: null, rate: 40 },
  ],
  severanceCeiling: null, // TODO: 2026 kıdem tazminatı tavanı
  disabilityAllowance: [null, null, null], // TODO: 2026 engellilik indirimi tutarları
};

export const CURRENT_PARAMS = PARAMS_2026;
