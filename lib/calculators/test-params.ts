// Testlerde kullanılan parametre seti. Gerçek mevzuat değeri DEĞİLDİR:
// beklenen sonuçların elle doğrulanabilmesi için yuvarlak sayılar seçildi.

import type { PayrollParams } from "@/config/mevzuat/types";

export const TEST_PARAMS: PayrollParams = {
  minWage: 20000,
  sgkCeiling: 150000,
  sgkEmployeeRate: 14,
  unemploymentEmployeeRate: 1,
  sgkEmployerRate: 20,
  unemploymentEmployerRate: 2,
  employerDiscountPoints: 5,
  manufacturingDiscountPoints: 8,
  stampTaxRate: 0.759,
  taxBrackets: [
    { limit: 100000, rate: 15 },
    { limit: 200000, rate: 20 },
    { limit: 500000, rate: 27 },
    { limit: 2000000, rate: 35 },
    { limit: null, rate: 40 },
  ],
  severanceCeiling: 40000,
  disabilityAllowance: [10000, 6000, 3000],
};
