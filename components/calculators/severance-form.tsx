"use client";

import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";
import { formatMoney } from "@/lib/calculators/format";
import { calculateSeverance } from "@/lib/calculators/severance";
import { Field, FormCard } from "./fields";
import { ParamsFieldset } from "./params-fieldset";
import { CalculatorLayout, ResultCard, type ResultRow } from "./result";
import {
  date,
  hasMissingDefaults,
  money,
  optionalMoney,
  paramDefaults,
  paramShape,
  toParams,
  type ParamGroup,
} from "./schema";
import { useCalculatorForm } from "./use-calculator-form";
import { useServiceText } from "./service-text";

const GROUPS: ParamGroup[] = ["severanceCeiling", "stampTaxRate"];

const schema = z.object({
  startDate: date(),
  endDate: date(),
  grossSalary: money(),
  extraPayments: optionalMoney(),
  ...paramShape(GROUPS),
});

/** Kıdem tazminatı formu */
export function SeveranceForm() {
  const t = useTranslations("calculatorUi");
  const tk = useTranslations("calculatorUi.severance");
  const locale = useLocale();
  const serviceText = useServiceText();
  const m = (v: number) => formatMoney(v, locale);

  const { register, errors, submit, result } = useCalculatorForm(
    schema,
    {
      startDate: "",
      endDate: "",
      grossSalary: "",
      extraPayments: "",
      ...paramDefaults(GROUPS, locale),
    },
    (v, setFieldError) => {
      const r = calculateSeverance({
        startDate: v.startDate,
        endDate: v.endDate,
        grossSalary: v.grossSalary,
        extraPayments: v.extraPayments,
        severanceCeiling: toParams(v).severanceCeiling,
        stampTaxRate: toParams(v).stampTaxRate,
      });
      if (!r.ok) {
        setFieldError(r.error === "endBeforeStart" ? "endDate" : "startDate", r.error);
        return null;
      }
      return r;
    },
  );

  let rows: ResultRow[] | undefined;
  if (result) {
    rows = [
      { label: tk("rows.service"), value: serviceText(result.service) },
      { label: tk("rows.dressed"), value: m(result.dressedSalary) },
      {
        label: tk("rows.base"),
        value: m(result.baseSalary),
        note: result.ceilingApplied ? tk("rows.ceilingApplied") : undefined,
      },
      { label: tk("rows.gross"), value: m(result.gross), strong: true },
      { label: tk("rows.stampTax"), value: m(result.stampTax), deduction: true },
      { label: tk("rows.net"), value: m(result.net), strong: true },
    ];
  }

  return (
    <CalculatorLayout>
      <FormCard title={t("formTitle")} onSubmit={submit} submitLabel={t("calculate")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="startDate"
            type="date"
            label={tk("startDate")}
            register={register}
            errors={errors}
          />
          <Field
            name="endDate"
            type="date"
            label={tk("endDate")}
            register={register}
            errors={errors}
          />
        </div>
        <Field
          name="grossSalary"
          label={tk("grossSalary")}
          hint={tk("grossSalaryHint")}
          unit={t("units.currency")}
          register={register}
          errors={errors}
        />
        <Field
          name="extraPayments"
          label={tk("extraPayments")}
          hint={tk("extraPaymentsHint")}
          unit={t("units.currency")}
          register={register}
          errors={errors}
        />
        <ParamsFieldset
          groups={GROUPS}
          register={register}
          errors={errors}
          open={hasMissingDefaults(GROUPS, locale)}
        />
      </FormCard>
      <ResultCard
        highlightLabel={result ? tk("highlight") : undefined}
        highlightValue={result ? m(result.net) : undefined}
        rows={rows}
        notes={result ? (result.eligible ? tk("note") : tk("notEligible")) : undefined}
      />
    </CalculatorLayout>
  );
}
