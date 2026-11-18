"use client";

import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";
import { formatMoney, formatNumber } from "@/lib/calculators/format";
import {
  calculateOvertime,
  overtimeNet,
  type OvertimeResult,
} from "@/lib/calculators/overtime";
import { Field, FormCard, SelectField } from "./fields";
import { ParamsFieldset } from "./params-fieldset";
import { CalculatorLayout, ResultCard, type ResultRow } from "./result";
import {
  checkBrackets,
  hasMissingDefaults,
  money,
  optionalQuantity,
  paramDefaults,
  paramShape,
  toParams,
  type ParamGroup,
} from "./schema";
import { useCalculatorForm } from "./use-calculator-form";
import { monthKey } from "./schema";

/** Tahmini net için gereken parametreler (isteğe bağlı: boşsa yalnızca brüt hesaplanır) */
const GROUPS: ParamGroup[] = [
  "minWage",
  "sgkCeiling",
  "sgkEmployeeRate",
  "unemploymentEmployeeRate",
  "stampTaxRate",
  "taxBrackets",
];

const paramsSchema = z.object(paramShape(GROUPS)).superRefine(checkBrackets);

const schema = z
  .object({
    grossSalary: money(),
    overtimeHours: optionalQuantity(500),
    extraHours: optionalQuantity(500),
    holidayHours: optionalQuantity(500),
    month: z.coerce.number().int().min(1).max(12),
  })
  .catchall(z.string())
  .refine((v) => v.overtimeHours + v.extraHours + v.holidayHours > 0, {
    message: "noHours",
    path: ["overtimeHours"],
  });

type Result = OvertimeResult & { net: number | null };

/** Fazla mesai formu: brüt her zaman; tahmini net, parametreler girilmişse */
export function OvertimeForm() {
  const t = useTranslations("calculatorUi");
  const to = useTranslations("calculatorUi.overtime");
  const locale = useLocale();
  const m = (v: number) => formatMoney(v, locale);

  const { register, errors, submit, result } = useCalculatorForm(
    schema,
    {
      grossSalary: "",
      overtimeHours: "",
      extraHours: "",
      holidayHours: "",
      month: "1",
      ...paramDefaults(GROUPS, locale),
    },
    (v): Result => {
      const r = calculateOvertime({
        grossSalary: v.grossSalary,
        overtimeHours: v.overtimeHours,
        extraHours: v.extraHours,
        holidayHours: v.holidayHours,
      });
      const params = paramsSchema.safeParse(v);
      const net = params.success
        ? overtimeNet(v.grossSalary, r.gross, v.month, toParams(params.data))
        : null;
      return { ...r, net };
    },
  );

  let rows: ResultRow[] | undefined;
  if (result) {
    rows = [
      { label: to("rows.hourly"), value: m(result.hourlyWage) },
      ...result.lines
        .filter((line) => line.hours > 0)
        .map((line) => ({
          label: to(`rows.${line.key}`, { rate: line.rate }),
          value: m(line.amount),
          note: to("rows.lineNote", {
            hours: formatNumber(line.hours, locale),
            hourly: m(line.hourly),
          }),
        })),
      { label: to("rows.gross"), value: m(result.gross), strong: true },
      result.net !== null
        ? {
            label: to("rows.net"),
            value: m(result.net),
            strong: true,
            note: to("rows.netNote"),
          }
        : { label: to("rows.net"), value: "—", note: to("rows.netMissing") },
    ];
  }

  return (
    <CalculatorLayout>
      <FormCard title={t("formTitle")} onSubmit={submit} submitLabel={t("calculate")}>
        <Field
          name="grossSalary"
          label={to("grossSalary")}
          unit={t("units.currency")}
          register={register}
          errors={errors}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            name="overtimeHours"
            label={to("overtimeHours")}
            unit={t("units.hours")}
            register={register}
            errors={errors}
          />
          <Field
            name="extraHours"
            label={to("extraHours")}
            unit={t("units.hours")}
            register={register}
            errors={errors}
          />
          <Field
            name="holidayHours"
            label={to("holidayHours")}
            unit={t("units.hours")}
            register={register}
            errors={errors}
          />
        </div>
        <p className="-mt-2 text-[13px] leading-snug text-muted-foreground">
          {to("hoursHint")}
        </p>
        <SelectField
          name="month"
          label={to("month")}
          register={register}
          options={Array.from({ length: 12 }, (_, i) => ({
            value: String(i + 1),
            label: t(monthKey(i + 1)),
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
        highlightLabel={result ? to("highlight") : undefined}
        highlightValue={result ? m(result.gross) : undefined}
        rows={rows}
        notes={result ? to("note") : undefined}
      />
    </CalculatorLayout>
  );
}
