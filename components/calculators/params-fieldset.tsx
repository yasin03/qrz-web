"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Field } from "./fields";
import { PARAM_FIELDS, PARAM_YEAR, TAX_BRACKET_COUNT, type ParamGroup } from "./schema";

/* eslint-disable @typescript-eslint/no-explicit-any -- formlar arası ortak bileşen */

/**
 * Yıl bazlı hesap parametreleri (oranlar, tavanlar, vergi dilimleri).
 * Kullanıcı değerleri görür ve değiştirebilir; varsayılanlar config/mevzuat/{yil}.ts'ten gelir.
 * Eksik varsayılan varsa ya da alanlardan biri hatalıysa bölüm açık durur.
 */
export function ParamsFieldset({
  groups,
  register,
  errors,
  open,
}: {
  groups: readonly ParamGroup[];
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  open: boolean;
}) {
  const t = useTranslations("calculatorUi");
  const tp = useTranslations("calculatorUi.params");
  const scalars = groups.filter((g): g is keyof typeof PARAM_FIELDS => g in PARAM_FIELDS);
  const hasErrors = Object.keys(errors).some(
    (key) => key in PARAM_FIELDS || key.startsWith("tax") || key.startsWith("disability"),
  );

  return (
    <details
      open={open || hasErrors || undefined}
      className="group rounded-2xl border border-border bg-surface/60 dark:bg-card/40"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:px-5 [&::-webkit-details-marker]:hidden">
        <span className="flex flex-col">
          <span className="text-[15px] font-bold">
            {tp("title", { year: PARAM_YEAR })}
          </span>
          <span className="text-[13px] text-muted-foreground">{tp("summary")}</span>
        </span>
        <ChevronDown
          className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="flex flex-col gap-5 border-t border-border px-4 pt-4 pb-5 md:px-5">
        <p className="text-[13px] leading-snug text-muted-foreground">{tp("hint")}</p>

        {scalars.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {scalars.map((key) => (
              <Field
                key={key}
                name={key}
                label={tp(`fields.${key}`)}
                unit={PARAM_FIELDS[key].kind === "money" ? t("units.currency") : "%"}
                register={register}
                errors={errors}
              />
            ))}
          </div>
        ) : null}

        {groups.includes("taxBrackets") ? (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-sm font-bold">{tp("taxBrackets")}</legend>
            {Array.from({ length: TAX_BRACKET_COUNT }, (_, i) => (
              <div key={i} className="grid grid-cols-[1fr_96px] items-start gap-3">
                {i < TAX_BRACKET_COUNT - 1 ? (
                  <Field
                    name={`taxLimit${i + 1}`}
                    label={tp("bracketLimit", { n: i + 1 })}
                    unit={t("units.currency")}
                    register={register}
                    errors={errors}
                  />
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold">{tp("bracketLast")}</span>
                    <span className="flex h-12 items-center text-sm text-muted-foreground">
                      {tp("bracketLastText")}
                    </span>
                  </div>
                )}
                <Field
                  name={`taxRate${i + 1}`}
                  label={tp("bracketRate")}
                  unit="%"
                  register={register}
                  errors={errors}
                />
              </div>
            ))}
          </fieldset>
        ) : null}

        {groups.includes("disabilityAllowance") ? (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-sm font-bold">{tp("disabilityTitle")}</legend>
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((degree) => (
                <Field
                  key={degree}
                  name={`disability${degree}`}
                  label={tp("disabilityDegree", { degree })}
                  unit={t("units.currency")}
                  register={register}
                  errors={errors}
                />
              ))}
            </div>
          </fieldset>
        ) : null}
      </div>
    </details>
  );
}
