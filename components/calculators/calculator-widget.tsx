"use client";

import type { CalculatorId } from "@/config/calculators";
import { AnnualLeaveForm } from "./annual-leave-form";
import { EmployerCostForm } from "./employer-cost-form";
import { NoticeForm } from "./notice-form";
import { OvertimeForm } from "./overtime-form";
import { SalaryForm } from "./salary-form";
import { SeveranceForm } from "./severance-form";

const FORMS: Record<CalculatorId, () => React.JSX.Element> = {
  salaryCalc: SalaryForm,
  severanceCalc: SeveranceForm,
  noticeCalc: NoticeForm,
  overtimeCalc: OvertimeForm,
  employerCostCalc: EmployerCostForm,
  annualLeaveCalc: AnnualLeaveForm,
};

/** Araç id'sine göre doğru formu gösterir (sayfa Server Component'tir, form istemcide) */
export function CalculatorWidget({ id }: { id: CalculatorId }) {
  const Form = FORMS[id];
  return <Form />;
}
