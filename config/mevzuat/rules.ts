// Yıldan yıla değişmeyen yasal kurallar (4857 sayılı İş Kanunu).
// Yıl bazlı tutar ve oranlar burada değil, config/mevzuat/{yil}.ts'te ve formda durur.

/**
 * İhbar süreleri (m.17): "altı aydan az" 2 hafta, "altı aydan bir buçuk yıla kadar" 4 hafta,
 * "bir buçuk yıldan üç yıla kadar" 6 hafta, "üç yıldan fazla" 8 hafta.
 * maxMonths üst sınırı dahildir; ilk satır hariç (6 aydan az).
 */
export const NOTICE_PERIODS = [
  { maxMonths: 6, inclusive: false, weeks: 2 },
  { maxMonths: 18, inclusive: true, weeks: 4 },
  { maxMonths: 36, inclusive: true, weeks: 6 },
  { maxMonths: Infinity, inclusive: true, weeks: 8 },
] as const;

/**
 * Yıllık ücretli izin süreleri (m.53): 1–5 yıl (5 dahil) 14 gün,
 * 5 yıldan fazla 15 yıldan az 20 gün, 15 yıl (dahil) ve fazlası 26 gün.
 */
export const ANNUAL_LEAVE_DAYS = {
  upToYears: 5,
  short: 14,
  belowYears: 15,
  medium: 20,
  long: 26,
} as const;

/** 18 ve daha küçük ya da 50 ve daha büyük yaştakilere en az verilecek izin (m.53) */
export const ANNUAL_LEAVE_AGE_MIN_DAYS = 20;
export const ANNUAL_LEAVE_YOUNG_MAX_AGE = 18;
export const ANNUAL_LEAVE_SENIOR_MIN_AGE = 50;

/** Fazla mesai zamları (m.41, m.47): saatlik ücretin yüzde kaç fazlası ödenir */
export const OVERTIME_PREMIUMS = {
  /** Haftalık 45 saati aşan fazla çalışma */
  overtime: 50,
  /** Haftalık çalışma 45 saatin altında kararlaştırılmışsa, 45 saate kadar olan fazla süreler */
  extraHours: 25,
  /** Ulusal bayram ve genel tatil günlerinde çalışma (m.47). Hafta tatili çalışması fazla çalışmadır. */
  holiday: 100,
} as const;

/** Aylık ücretten saatlik ücrete geçiş: 30 gün × 7,5 saat */
export const MONTHLY_HOURS = 225;

/** Kıdem tazminatına hak kazanmak için gereken en az hizmet süresi (yıl) */
export const SEVERANCE_MIN_YEARS = 1;

/** Kıdem tazminatında her tam yıl için ödenen gün sayısı */
export const SEVERANCE_DAYS_PER_YEAR = 30;
