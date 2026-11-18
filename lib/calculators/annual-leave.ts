// Yıllık ücretli izin (4857 sayılı İş Kanunu m.53).
//   İzin hakkı, işe girişten itibaren 1 tam yıl dolunca doğar.
//   1–5 yıl (5 dahil): 14 gün, 5 yıldan fazla 15 yıldan az: 20 gün, 15 yıl ve üstü: 26 gün
//   18 yaş ve altı ile 50 yaş ve üstü çalışanlara en az 20 gün verilir.

import {
  ANNUAL_LEAVE_AGE_MIN_DAYS,
  ANNUAL_LEAVE_DAYS,
  ANNUAL_LEAVE_SENIOR_MIN_AGE,
  ANNUAL_LEAVE_YOUNG_MAX_AGE,
} from "@/config/mevzuat/rules";
import { addYears, diffYMD, parseDate, toISODate, type YMD } from "./common";

export type AnnualLeaveInput = {
  startDate: string;
  calcDate: string;
  /** İsteğe bağlı: yaş kuralı için */
  birthDate?: string;
  /** Bu izin yılında kullanılan gün */
  usedDays: number;
};

export type AnnualLeaveResult =
  | { ok: false; error: "invalidDates" | "calcBeforeStart" | "invalidBirthDate" }
  | {
      ok: true;
      service: YMD;
      seniorityYears: number;
      eligible: boolean;
      age: number | null;
      ageRuleApplied: boolean;
      entitlement: number;
      remaining: number;
      /** Bir sonraki izin hakkının doğacağı tarih */
      nextEntitlementDate: string;
    };

/** Kıdem yılına göre yıllık izin gün sayısı (yaş kuralı hariç) */
export function leaveDaysForSeniority(years: number) {
  if (years < 1) return 0;
  if (years <= ANNUAL_LEAVE_DAYS.upToYears) return ANNUAL_LEAVE_DAYS.short;
  if (years < ANNUAL_LEAVE_DAYS.belowYears) return ANNUAL_LEAVE_DAYS.medium;
  return ANNUAL_LEAVE_DAYS.long;
}

export function calculateAnnualLeave(input: AnnualLeaveInput): AnnualLeaveResult {
  const start = parseDate(input.startDate);
  const calc = parseDate(input.calcDate);
  if (!start || !calc) return { ok: false, error: "invalidDates" };
  if (calc < start) return { ok: false, error: "calcBeforeStart" };

  let birth: Date | null = null;
  if (input.birthDate) {
    birth = parseDate(input.birthDate);
    if (!birth || birth >= calc) return { ok: false, error: "invalidBirthDate" };
  }

  const service = diffYMD(start, calc);
  const seniorityYears = service.years;
  const eligible = seniorityYears >= 1;
  const age = birth ? diffYMD(birth, calc).years : null;

  let entitlement = leaveDaysForSeniority(seniorityYears);
  const ageRuleApplied =
    eligible &&
    age !== null &&
    (age <= ANNUAL_LEAVE_YOUNG_MAX_AGE || age >= ANNUAL_LEAVE_SENIOR_MIN_AGE) &&
    entitlement < ANNUAL_LEAVE_AGE_MIN_DAYS;
  if (ageRuleApplied) entitlement = ANNUAL_LEAVE_AGE_MIN_DAYS;

  return {
    ok: true,
    service,
    seniorityYears,
    eligible,
    age,
    ageRuleApplied,
    entitlement,
    remaining: Math.max(0, entitlement - input.usedDays),
    nextEntitlementDate: toISODate(addYears(start, seniorityYears + 1)),
  };
}
