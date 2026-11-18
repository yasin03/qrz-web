"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";
import type { PayrollParams } from "@/config/mevzuat/types";
import { parseNumber } from "@/lib/calculators/format";
import {
  minWageNet,
  payrollTable,
  type EmployerDiscount,
  type MonthlyPayroll,
  type SalaryDirection,
} from "@/lib/calculators/salary";
import { cn } from "@/lib/utils";
import { Field, FormCard, SegmentedField, SelectField, inputClass } from "./fields";
import { ParamsFieldset } from "./params-fieldset";
import { ResultCard } from "./result";
import {
  checkBrackets,
  hasMissingDefaults,
  money,
  monthKey,
  paramDefaults,
  paramShape,
  toParams,
  type ParamGroup,
} from "./schema";
import { useCalculatorForm } from "./use-calculator-form";

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
  "disabilityAllowance",
];

const DISCOUNTS: EmployerDiscount[] = ["none", "general", "manufacturing"];

const schema = z
  .object({
    direction: z.enum(["grossToNet", "netToGross"]),
    amount: money(),
    startMonth: z.coerce.number().int().min(1).max(12),
    disability: z.coerce.number().int().min(0).max(3),
    ...paramShape(GROUPS),
  })
  .superRefine(checkBrackets);

type Base = {
  direction: SalaryDirection;
  startMonth: number;
  disability: 0 | 1 | 2 | 3;
  params: PayrollParams;
  amount: number;
  /** Asgari ücret alt sınırı (brüt ya da net) */
  minAmount: number;
};

/** Tablo sütunu: çeviri anahtarı, satırdaki değer, vurgulu mu */
type Column = { key: string; get: (r: MonthlyPayroll) => number; strong?: boolean };

// Sütun sırası kariyer.net maaş hesaplamasıyla aynıdır
const MIDDLE: Column[] = [
  { key: "sgkEmployee", get: (r) => r.sgkEmployee },
  { key: "unemploymentEmployee", get: (r) => r.unemploymentEmployee },
  { key: "taxBase", get: (r) => r.taxBase },
  { key: "stampTax", get: (r) => r.stampTaxPayable },
  { key: "incomeTax", get: (r) => r.incomeTaxPayable },
  { key: "cumulativeTaxBase", get: (r) => r.cumulativeTaxBase },
  { key: "incomeTaxExemption", get: (r) => r.incomeTaxExemption },
];
const EMPLOYER: Column[] = [
  { key: "sgkEmployer", get: (r) => r.sgkEmployer },
  { key: "unemploymentEmployer", get: (r) => r.unemploymentEmployer },
  { key: "employerCost", get: (r) => r.employerCost },
];

/**
 * Net-brüt maaş: kullanıcı tutarı ve başlangıç ayını girer; 2026 parametreleri hazır gelir.
 * Sonuç tablosunda her ayın tutarı ayrıca değiştirilebilir ve prim indirimi seçilebilir;
 * tablo anında yeniden hesaplanır. Asgari ücretin altındaki tutarlar hesaplanmaz.
 */
export function SalaryForm() {
  const t = useTranslations("calculatorUi");
  const ts = useTranslations("calculatorUi.salary");
  const te = useTranslations("calculatorUi.errors");
  const locale = useLocale();
  const numberLocale = locale === "tr" ? "tr-TR" : "en-US";
  const n = (v: number) =>
    new Intl.NumberFormat(numberLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v);

  const { register, errors, submit, result } = useCalculatorForm(
    schema,
    {
      direction: "grossToNet",
      amount: "",
      startMonth: "1",
      disability: "0",
      ...paramDefaults(GROUPS, locale),
    },
    (v, setFieldError): Base | null => {
      const params = toParams(v);
      const disability = v.disability as 0 | 1 | 2 | 3;
      if (disability && !params.disabilityAllowance[disability - 1]) {
        setFieldError(`disability${disability}`, "required");
        return null;
      }
      const minAmount =
        v.direction === "grossToNet" ? params.minWage : minWageNet(params, v.startMonth);
      if (v.amount < minAmount) {
        setFieldError("amount", "belowMinWage");
        return null;
      }
      return {
        direction: v.direction,
        startMonth: v.startMonth,
        disability,
        params,
        amount: v.amount,
        minAmount,
      };
    },
  );

  // Prim indirimi seçimi hesaplar arasında korunur; ay tutarları her yeni hesapta sıfırlanır
  const [discount, setDiscount] = useState<EmployerDiscount>("none");
  const [edits, setEdits] = useState<{ base: Base; amounts: string[] } | null>(null);
  const amounts = useMemo(
    () =>
      result && edits?.base === result
        ? edits.amounts
        : Array.from({ length: 12 }, () =>
            result
              ? new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 2 }).format(
                  result.amount,
                )
              : "",
          ),
    [result, edits, numberLocale],
  );

  const table = useMemo(() => {
    if (!result) return null;
    const invalid = new Set<number>();
    const values = amounts.map((text, i) => {
      const value = parseNumber(text);
      if (!Number.isFinite(value) || value < result.minAmount) {
        invalid.add(i);
        return result.amount;
      }
      return value;
    });
    const rows = payrollTable(
      values,
      result.startMonth,
      result.direction,
      result.params,
      {
        disability: result.disability,
        employerDiscount: discount,
      },
    );
    return { rows, invalid };
  }, [result, amounts, discount]);

  const setAmount = (index: number, text: string) => {
    if (!result) return;
    const next = [...amounts];
    next[index] = text;
    setEdits({ base: result, amounts: next });
  };

  const grossToNet = result?.direction === "grossToNet";
  const inputKey = grossToNet ? "gross" : "net";
  const outputCol: Column = grossToNet
    ? { key: "net", get: (r) => r.net, strong: true }
    : { key: "gross", get: (r) => r.gross, strong: true };
  const columns = [...MIDDLE, outputCol, ...EMPLOYER];
  const inputValue = (r: MonthlyPayroll) => (grossToNet ? r.gross : r.net);

  // KGVM kümülatiftir: toplam satırında son ayın değeri gösterilir
  const total = (get: (r: MonthlyPayroll) => number, key: string) => {
    if (!table) return 0;
    if (key === "cumulativeTaxBase")
      return table.rows[table.rows.length - 1].cumulativeTaxBase;
    return table.rows.reduce((sum, row) => sum + get(row), 0);
  };
  const average = (get: (r: MonthlyPayroll) => number) =>
    table ? table.rows.reduce((sum, row) => sum + get(row), 0) / table.rows.length : 0;

  const cell = "px-1 py-2.5 text-right whitespace-nowrap";
  const sticky = "sticky left-0 z-10 bg-surface dark:bg-card";
  const tableTitle = grossToNet ? ts("tableGrossToNet") : ts("tableNetToGross");

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <FormCard title={t("formTitle")} onSubmit={submit} submitLabel={ts("submit")}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <SegmentedField
            name="direction"
            legend={ts("direction")}
            register={register}
            options={[
              { value: "grossToNet", label: ts("grossToNet") },
              { value: "netToGross", label: ts("netToGross") },
            ]}
          />
          <Field
            name="amount"
            label={ts("amount")}
            hint={ts("amountHint")}
            unit={t("units.currency")}
            register={register}
            errors={errors}
          />
          <SelectField
            name="startMonth"
            label={ts("startMonth")}
            register={register}
            options={Array.from({ length: 12 }, (_, i) => ({
              value: String(i + 1),
              label: t(monthKey(i + 1)),
            }))}
          />
          <SelectField
            name="disability"
            label={ts("disability")}
            register={register}
            options={[0, 1, 2, 3].map((d) => ({
              value: String(d),
              label: ts(`disabilityOptions.${d}` as "disabilityOptions.0"),
            }))}
          />
        </div>
        <ParamsFieldset
          groups={GROUPS}
          register={register}
          errors={errors}
          open={hasMissingDefaults(GROUPS, locale)}
        />
      </FormCard>

      <ResultCard notes={result ? ts("note") : undefined}>
        {result && table ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h3 className="text-lg font-bold">{tableTitle}</h3>
              <label className="flex w-full min-w-0 flex-col gap-1.5 text-sm font-semibold sm:w-[400px]">
                {ts("discount.label")}
                <select
                  value={discount}
                  onChange={(event) =>
                    setDiscount(event.target.value as EmployerDiscount)
                  }
                  className={cn(inputClass, "h-11 appearance-auto pr-3 text-[15px]")}
                >
                  {DISCOUNTS.map((d) => (
                    <option key={d} value={d}>
                      {ts(`discount.${d}`, {
                        points:
                          d === "general"
                            ? result.params.employerDiscountPoints
                            : result.params.manufacturingDiscountPoints,
                      })}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div
              className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0"
              tabIndex={0}
              role="region"
              aria-label={tableTitle}
            >
              <table className="w-full min-w-[1040px] text-[13px] tabular-nums">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th
                      scope="col"
                      className={cn(sticky, "py-2 pr-3 text-left font-semibold")}
                    >
                      {ts("cols.month")}
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-2 text-right align-bottom leading-tight font-semibold"
                    >
                      {ts(`cols.${inputKey}`)}
                    </th>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        scope="col"
                        className="px-1 py-2 text-right align-bottom leading-tight font-semibold"
                      >
                        {ts(`cols.${col.key}` as "cols.gross")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row) => {
                    const index = row.month - 1;
                    const monthName = t(monthKey(row.month));
                    const invalid = table.invalid.has(index);
                    return (
                      <tr key={row.month} className="border-b border-border">
                        <th
                          scope="row"
                          className={cn(sticky, "py-2 pr-3 text-left font-semibold")}
                        >
                          {monthName}
                        </th>
                        <td className="px-1.5 py-1.5">
                          <input
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            value={amounts[index]}
                            onChange={(event) => setAmount(index, event.target.value)}
                            aria-label={ts("rowInput", {
                              month: monthName,
                              type: ts(`cols.${inputKey}`),
                            })}
                            aria-invalid={invalid || undefined}
                            title={invalid ? te("belowMinWage") : undefined}
                            className={cn(
                              inputClass,
                              "ml-auto block h-9 w-[104px] rounded-lg px-2 text-right text-[13px]",
                            )}
                          />
                        </td>
                        {columns.map((col) => (
                          <td
                            key={col.key}
                            className={cn(
                              cell,
                              col.strong && "font-bold text-primary dark:text-accent",
                            )}
                          >
                            {n(col.get(row))}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-b border-border font-bold">
                    <th scope="row" className={cn(sticky, "py-2.5 pr-3 text-left")}>
                      {ts("cols.total")}
                    </th>
                    <td className={cell}>{n(total(inputValue, "input"))}</td>
                    {columns.map((col) => (
                      <td key={col.key} className={cell}>
                        {n(total(col.get, col.key))}
                      </td>
                    ))}
                  </tr>
                  <tr className="font-semibold text-muted-foreground">
                    <th scope="row" className={cn(sticky, "py-2.5 pr-3 text-left")}>
                      {ts("cols.average")}
                    </th>
                    <td className={cell}>{n(average(inputValue))}</td>
                    {columns.map((col) => (
                      <td key={col.key} className={cell}>
                        {n(average(col.get))}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="text-[13px] text-muted-foreground">{ts("editHint")}</p>
          </div>
        ) : null}
      </ResultCard>
    </div>
  );
}
