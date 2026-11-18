// Fazla mesai ücreti (4857 sayılı İş Kanunu m.41, m.47).
//   Saatlik ücret = aylık brüt / 225
//   Fazla çalışma (45 saat üstü): saatlik × 1,5
//   Fazla sürelerle çalışma (sözleşmedeki süre ile 45 saat arası): saatlik × 1,25
//   Ulusal bayram / genel tatil çalışması: saatlik × 2 (hafta tatili çalışması fazla çalışmadır)
//   Tahmini net: mesai, o ayın bordrosuna eklenerek hesaplanır (parametreler verilmişse).

import { MONTHLY_HOURS, OVERTIME_PREMIUMS } from "@/config/mevzuat/rules";
import type { PayrollParams } from "@/config/mevzuat/types";
import { round2 } from "./common";
import { payrollForMonth } from "./salary";

export type OvertimeInput = {
  grossSalary: number;
  overtimeHours: number;
  extraHours: number;
  holidayHours: number;
};

export type OvertimeLine = {
  key: keyof typeof OVERTIME_PREMIUMS;
  hours: number;
  rate: number;
  hourly: number;
  amount: number;
};

export type OvertimeResult = {
  hourlyWage: number;
  lines: OvertimeLine[];
  totalHours: number;
  gross: number;
};

export function calculateOvertime(input: OvertimeInput): OvertimeResult {
  const hourlyWage = round2(input.grossSalary / MONTHLY_HOURS);
  const hours = {
    overtime: input.overtimeHours,
    extraHours: input.extraHours,
    holiday: input.holidayHours,
  };
  const lines = (Object.keys(OVERTIME_PREMIUMS) as OvertimeLine["key"][]).map((key) => {
    const rate = OVERTIME_PREMIUMS[key];
    const hourly = round2(hourlyWage * (1 + rate / 100));
    return { key, hours: hours[key], rate, hourly, amount: round2(hourly * hours[key]) };
  });
  return {
    hourlyWage,
    lines,
    totalHours: lines.reduce((sum, line) => sum + line.hours, 0),
    gross: round2(lines.reduce((sum, line) => sum + line.amount, 0)),
  };
}

/**
 * Mesainin ele geçen tahmini net tutarı: (maaş + mesai) bordrosunun neti − maaş bordrosunun neti.
 * Aynı ayın kümülatif matrahı kullanıldığı için vergi dilimi geçişleri de yansır.
 */
export function overtimeNet(
  grossSalary: number,
  overtimeGross: number,
  month: number,
  p: PayrollParams,
) {
  const base = payrollForMonth(grossSalary, month, p);
  const withOvertime = payrollForMonth(
    grossSalary + overtimeGross,
    month,
    p,
    {},
    round2(base.taxBase * (month - 1)),
  );
  return round2(withOvertime.net - base.net);
}
