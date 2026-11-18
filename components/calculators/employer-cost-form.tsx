"use client";

import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";
import { CURRENT_PARAMS } from "@/config/mevzuat/2026";
import { formatMoney, formatNumber } from "@/lib/calculators/format";
import {
  employerRate,
  grossFromNet,
  payrollForMonth,
  sumPayroll,
  yearlyPayroll,
  type MonthlyPayroll,
} from "@/lib/calculators/salary";
import { Field, FormCard, SegmentedField, SelectField } from "./fields";
import { ParamsFieldset } from "./params-fieldset";
import { CalculatorLayout, ResultCard, type ResultRow } from "./result";
import {
  checkBrackets,
  hasMissingDefaults,
  money,
  paramDefaults,
  paramShape,
  toParams,
  type ParamGroup,
} from "./schema";
import { useCalculatorForm } from "./use-calculator-form";
import { monthKey } from "./schema";

const generalPoints = CURRENT_PARAMS.employerDiscountPoints ?? 0;
const manufacturingPoints = CURRENT_PARAMS.manufacturingDiscountPoints ?? 0;

const GROUPS: ParamGroup[] = [
  "minWage",
  "sgkCeiling",
  "sgkEmployeeRate",
  "unemploymentEmployeeRate",
  "sgkEmployerRate",
  "unemploymentEmployerRate",
  "employerDiscountPoints",
  "manufacturingDiscountPoints",
  "stampTaxRate",
  "taxBrackets",
];

const schema = z
  .object({
    direction: z.enum(["gross", "net"]),
    amount: money(),
    month: z.coerce.number().int().min(1).max(12),
    discount: z.enum(["none", "general", "manufacturing"]),
    ...paramShape(GROUPS),
  })
  .superRefine(checkBrackets);

type Result = {
  month: number;
  row: MonthlyPayroll;
  yearCost: number;
  employerRate: number;
  unemploymentRate: number;
};

/** İşveren maliyeti: brüt (veya netten bulunan brüt) + SGK ve işsizlik işveren payları */
export function EmployerCostForm() {
  const t = useTranslations("calculatorUi");
  const te = useTranslations("calculatorUi.employerCost");
  const locale = useLocale();
  const m = (v: number) => formatMoney(v, locale);

  const { register, errors, submit, result } = useCalculatorForm(
    schema,
    {
      direction: "gross",
      amount: "",
      month: "1",
      discount: "none",
      ...paramDefaults(GROUPS, locale),
    },
    (v): Result => {
      const p = toParams(v);
      const options = { employerDiscount: v.discount };
      const gross =
        v.direction === "gross" ? v.amount : grossFromNet(v.amount, v.month, p, options);
      const row = payrollForMonth(gross, v.month, p, options);
      const yearCost = sumPayroll(
        yearlyPayroll(gross, "grossToNet", p, options),
      ).employerCost;
      return {
        month: v.month,
        row,
        yearCost,
        employerRate: employerRate(p, v.discount),
        unemploymentRate: p.unemploymentEmployerRate,
      };
    },
  );

  let rows: ResultRow[] | undefined;
  if (result) {
    const r = result.row;
    rows = [
      { label: te("rows.gross"), value: m(r.gross) },
      {
        label: te("rows.sgkEmployer", {
          rate: formatNumber(result.employerRate, locale),
        }),
        value: m(r.sgkEmployer),
        note:
          r.sgkBase < r.gross
            ? te("rows.ceilingNote", { base: m(r.sgkBase) })
            : undefined,
      },
      {
        label: te("rows.unemploymentEmployer", {
          rate: formatNumber(result.unemploymentRate, locale),
        }),
        value: m(r.unemploymentEmployer),
      },
      { label: te("rows.total"), value: m(r.employerCost), strong: true },
      { label: te("rows.net"), value: m(r.net), note: te("rows.netNote") },
      { label: te("rows.year"), value: m(result.yearCost), strong: true },
    ];
  }

  return (
    <CalculatorLayout>
      <FormCard title={t("formTitle")} onSubmit={submit} submitLabel={t("calculate")}>
        <SegmentedField
          name="direction"
          legend={te("direction")}
          register={register}
          options={[
            { value: "gross", label: te("fromGross") },
            { value: "net", label: te("fromNet") },
          ]}
        />
        <Field
          name="amount"
          label={te("amount")}
          unit={t("units.currency")}
          register={register}
          errors={errors}
        />
        <SelectField
          name="month"
          label={te("month")}
          register={register}
          options={Array.from({ length: 12 }, (_, i) => ({
            value: String(i + 1),
            label: t(monthKey(i + 1)),
          }))}
        />
        <SelectField
          name="discount"
          label={te("discount.label")}
          register={register}
          options={(["none", "general", "manufacturing"] as const).map((d) => ({
            value: d,
            label: te(`discount.${d}`, {
              points: d === "manufacturing" ? manufacturingPoints : generalPoints,
            }),
          }))}
        />
        <ParamsFieldset
          groups={GROUPS}
          register={register}
          errors={errors}
          open={hasMissingDefaults(GROUPS, locale)}
        />
      </FormCard>
      <ResultCard
        highlightLabel={
          result ? te("highlight", { month: t(monthKey(result.month)) }) : undefined
        }
        highlightValue={result ? m(result.row.employerCost) : undefined}
        rows={rows}
        notes={result ? te("note") : undefined}
      />
    </CalculatorLayout>
  );
}
