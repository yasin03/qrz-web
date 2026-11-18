// Hesaplama araçlarının yıl bazlı parametreleri.
// Araçlar dış kullanıcılar içindir: tüm parametreler formda alan olarak görünür ve
// kullanıcı tarafından değiştirilebilir. config/mevzuat/{yil}.ts yalnızca varsayılanları verir;
// bilinmeyen değer null bırakılır (alan boş gelir, kullanıcı girer).

/** Gelir vergisi dilimi: üst sınır (son dilimde null = sınırsız) ve oran (yüzde). */
export type TaxBracket = { limit: number | null; rate: number };

/** Hesaplamada kullanılan, eksiksiz parametre seti. Oranlar yüzde cinsindendir (14 = %14). */
export type PayrollParams = {
  /** Aylık brüt asgari ücret (asgari ücret gelir ve damga vergisi istisnası için) */
  minWage: number;
  /** Aylık SGK prime esas kazanç üst sınırı */
  sgkCeiling: number;
  /** SGK işçi payı (%) */
  sgkEmployeeRate: number;
  /** İşsizlik sigortası işçi payı (%) */
  unemploymentEmployeeRate: number;
  /** SGK işveren payı (%), indirim uygulanmadan */
  sgkEmployerRate: number;
  /** İşsizlik sigortası işveren payı (%) */
  unemploymentEmployerRate: number;
  /** Genel işveren prim indirimi (puan) */
  employerDiscountPoints: number;
  /** İmalat sektörü işveren prim indirimi (puan) */
  manufacturingDiscountPoints: number;
  /** Damga vergisi oranı (%), ör. binde 7,59 = 0,759 */
  stampTaxRate: number;
  /** Gelir vergisi dilimleri (yıllık kümülatif matraha göre, artan sırada) */
  taxBrackets: TaxBracket[];
  /** Kıdem tazminatı tavanı (aylık) */
  severanceCeiling: number;
  /** Engellilik indirimi tutarları (aylık): 1., 2. ve 3. derece */
  disabilityAllowance: [number, number, number];
};

/** Varsayılan parametreler: bilinmeyen değerler null (form alanı boş gelir). */
export type ParamDefaults = {
  year: number;
  minWage: number | null;
  sgkCeiling: number | null;
  sgkEmployeeRate: number | null;
  unemploymentEmployeeRate: number | null;
  sgkEmployerRate: number | null;
  unemploymentEmployerRate: number | null;
  employerDiscountPoints: number | null;
  manufacturingDiscountPoints: number | null;
  stampTaxRate: number | null;
  taxBrackets: { limit: number | null; rate: number | null }[];
  severanceCeiling: number | null;
  disabilityAllowance: [number | null, number | null, number | null];
};
