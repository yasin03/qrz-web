"use client";

import type { ReactNode } from "react";
import { Calculator } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type ResultRow = {
  label: string;
  value: string;
  /** Kesinti satırı (eksi işaretiyle gösterilir) */
  deduction?: boolean;
  /** Ara toplam / sonuç satırı */
  strong?: boolean;
  note?: string;
};

/** Sonuç kartı: öne çıkan tutar + kalem tablosu. Sonuç yoksa yönlendirme metni. */
export function ResultCard({
  highlightLabel,
  highlightValue,
  rows,
  notes,
  children,
}: {
  highlightLabel?: string;
  highlightValue?: string;
  rows?: ResultRow[];
  notes?: ReactNode;
  children?: ReactNode;
}) {
  const t = useTranslations("calculatorUi");
  const empty = !highlightValue && !rows?.length && !children;

  return (
    <section
      aria-labelledby="hesap-sonucu"
      aria-live="polite"
      className="flex min-w-0 flex-col gap-5 rounded-[20px] bg-surface p-5 md:p-7 dark:bg-card"
    >
      <h2 id="hesap-sonucu" className="text-xl font-bold">
        {t("resultTitle")}
      </h2>
      {empty ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
          <Calculator
            className="size-8 text-primary dark:text-accent"
            aria-hidden="true"
          />
          <p className="max-w-xs text-[15px]">{t("emptyResult")}</p>
        </div>
      ) : (
        <>
          {highlightValue ? (
            <div className="flex flex-col gap-1 rounded-2xl bg-background p-5 dark:bg-surface">
              <span className="text-sm font-semibold text-muted-foreground">
                {highlightLabel}
              </span>
              <span className="text-[32px] leading-tight font-extrabold text-primary tabular-nums md:text-[40px] dark:text-accent">
                {highlightValue}
              </span>
            </div>
          ) : null}
          {rows?.length ? <ResultTable rows={rows} /> : null}
          {children}
          {notes ? (
            <div className="text-[13px] leading-relaxed text-muted-foreground">
              {notes}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

export function ResultTable({ rows, caption }: { rows: ResultRow[]; caption?: string }) {
  return (
    <table className="w-full text-[15px]">
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.label}
            className={cn(
              "border-b border-border last:border-b-0",
              row.strong && "font-bold",
            )}
          >
            <th scope="row" className="py-2.5 pr-3 text-left font-[inherit]">
              <span className={row.strong ? undefined : "font-normal"}>{row.label}</span>
              {row.note ? (
                <span className="block text-[13px] font-normal text-muted-foreground">
                  {row.note}
                </span>
              ) : null}
            </th>
            <td
              className={cn(
                "py-2.5 text-right whitespace-nowrap tabular-nums",
                row.deduction && "text-muted-foreground",
              )}
            >
              {row.deduction ? "− " : ""}
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Formun ve sonucun yan yana durduğu düzen (mobilde alt alta) */
export function CalculatorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
      {children}
    </div>
  );
}
