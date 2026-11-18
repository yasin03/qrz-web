"use client";

import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";
import { formatMoney } from "@/lib/calculators/format";
import { calculateNotice } from "@/lib/calculators/notice";
import { Field, FormCard } from "./fields";
import { ParamsFieldset } from "./params-fieldset";
import { CalculatorLayout, ResultCard, type ResultRow } from "./result";
import {
  checkBrackets,
  date,
  hasMissingDefaults,
  money,
  optionalMoney,
  paramDefaults,
  paramShape,
  toParams,
  type ParamGroup,
} from "./schema";
import { useServiceText } from "./service-text";
import { useCalculatorForm } from "./use-calculator-form";

const GROUPS: ParamGroup[] = ["stampTaxRate", "taxBrackets"];

const schema = z
  .object({
    startDate: date(),
    endDate: date(),
    grossSalary: money(),
    extraPayments: optionalMoney(),
    previousTaxBase: optionalMoney(),
    ...paramShape(GROUPS),
  })
  .superRefine(checkBrackets);

/** İhbar tazminatı formu */
export function NoticeForm() {
  const t = useTranslations("calculatorUi");
  const tn = useTranslations("calculatorUi.notice");
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
      previousTaxBase: "",
      ...paramDefaults(GROUPS, locale),
    },
    (v, setFieldError) => {
      const p = toParams(v);
      const r = calculateNotice({
        startDate: v.startDate,
        endDate: v.endDate,
        grossSalary: v.grossSalary,
        extraPayments: v.extraPayments,
        previousTaxBase: v.previousTaxBase,
        taxBrackets: p.taxBrackets,
        stampTaxRate: p.stampTaxRate,
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
      { label: tn("rows.service"), value: serviceText(result.service) },
      {
        label: tn("rows.period"),
        value: tn("rows.periodValue", { weeks: result.weeks, days: result.days }),
      },
      { label: tn("rows.daily"), value: m(result.dailySalary) },
      { label: tn("rows.gross"), value: m(result.gross), strong: true },
      { label: tn("rows.incomeTax"), value: m(result.incomeTax), deduction: true },
      { label: tn("rows.stampTax"), value: m(result.stampTax), deduction: true },
      { label: tn("rows.net"), value: m(result.net), strong: true },
    ];
  }

  return (
    <CalculatorLayout>
      <FormCard title={t("formTitle")} onSubmit={submit} submitLabel={t("calculate")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="startDate"
            type="date"
            label={tn("startDate")}
            register={register}
            errors={errors}
          />
          <Field
            name="endDate"
            type="date"
            label={tn("endDate")}
            register={register}
            errors={errors}
          />
        </div>
        <Field
          name="grossSalary"
          label={tn("grossSalary")}
          unit={t("units.currency")}
          register={register}
          errors={errors}
        />
        <Field
          name="extraPayments"
          label={tn("extraPayments")}
          hint={tn("extraPaymentsHint")}
          unit={t("units.currency")}
          register={register}
          errors={errors}
        />
        <Field
          name="previousTaxBase"
          label={tn("previousTaxBase")}
          hint={tn("previousTaxBaseHint")}
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
        highlightLabel={result ? tn("highlight") : undefined}
        highlightValue={result ? m(result.net) : undefined}
        rows={rows}
        notes={result ? tn("note") : undefined}
      />
    </CalculatorLayout>
  );
}
