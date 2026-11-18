"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";
import { calculateAnnualLeave } from "@/lib/calculators/annual-leave";
import { Field, FormCard } from "./fields";
import { CalculatorLayout, ResultCard, type ResultRow } from "./result";
import { date, optionalDate, optionalQuantity } from "./schema";
import { useServiceText } from "./service-text";
import { useCalculatorForm } from "./use-calculator-form";

const schema = z.object({
  startDate: date(),
  calcDate: date(),
  birthDate: optionalDate(),
  usedDays: optionalQuantity(365),
});

/** Yıllık izin formu (yıl bazlı parametre gerektirmez; kurallar İş Kanunu m.53) */
export function AnnualLeaveForm() {
  const t = useTranslations("calculatorUi");
  const tl = useTranslations("calculatorUi.annualLeave");
  const locale = useLocale();
  const serviceText = useServiceText();
  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(`${iso}T00:00:00Z`));

  const { register, errors, submit, result, setValue, getValues } = useCalculatorForm(
    schema,
    { startDate: "", calcDate: "", birthDate: "", usedDays: "" },
    (v, setFieldError) => {
      const r = calculateAnnualLeave({
        startDate: v.startDate,
        calcDate: v.calcDate,
        birthDate: v.birthDate || undefined,
        usedDays: v.usedDays,
      });
      if (!r.ok) {
        const field = r.error === "invalidBirthDate" ? "birthDate" : "calcDate";
        setFieldError(field, r.error);
        return null;
      }
      return r;
    },
  );

  // Hesap tarihi varsayılan olarak bugün (sunucu çıktısıyla uyuşmazlık olmasın diye istemcide)
  useEffect(() => {
    if (!getValues("calcDate"))
      setValue("calcDate", new Date().toISOString().slice(0, 10));
  }, [getValues, setValue]);

  let rows: ResultRow[] | undefined;
  if (result) {
    rows = [
      { label: tl("rows.service"), value: serviceText(result.service) },
      {
        label: tl("rows.seniority"),
        value: tl("rows.yearsValue", { count: result.seniorityYears }),
      },
      ...(result.age !== null
        ? [{ label: tl("rows.age"), value: tl("rows.yearsValue", { count: result.age }) }]
        : []),
      {
        label: tl("rows.entitlement"),
        value: tl("rows.daysValue", { count: result.entitlement }),
        strong: true,
        note: result.ageRuleApplied ? tl("rows.ageRule") : undefined,
      },
      {
        label: tl("rows.remaining"),
        value: tl("rows.daysValue", { count: result.remaining }),
      },
      { label: tl("rows.next"), value: formatDate(result.nextEntitlementDate) },
    ];
  }

  return (
    <CalculatorLayout>
      <FormCard title={t("formTitle")} onSubmit={submit} submitLabel={t("calculate")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="startDate"
            type="date"
            label={tl("startDate")}
            register={register}
            errors={errors}
          />
          <Field
            name="calcDate"
            type="date"
            label={tl("calcDate")}
            register={register}
            errors={errors}
          />
        </div>
        <Field
          name="birthDate"
          type="date"
          label={tl("birthDate")}
          hint={tl("birthDateHint")}
          register={register}
          errors={errors}
        />
        <Field
          name="usedDays"
          label={tl("usedDays")}
          hint={tl("usedDaysHint")}
          unit={t("units.days")}
          inputMode="numeric"
          register={register}
          errors={errors}
        />
      </FormCard>
      <ResultCard
        highlightLabel={result ? tl("highlight") : undefined}
        highlightValue={
          result
            ? result.eligible
              ? tl("rows.daysValue", { count: result.entitlement })
              : tl("notEligibleShort")
            : undefined
        }
        rows={rows}
        notes={result ? (result.eligible ? tl("note") : tl("notEligible")) : undefined}
      />
    </CalculatorLayout>
  );
}
