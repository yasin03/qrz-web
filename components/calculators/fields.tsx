"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any -- formlar arası ortak alan bileşenleri */
type Register = UseFormRegister<any>;
type Errors = FieldErrors<any>;

export const inputClass =
  "h-12 w-full min-w-0 rounded-xl border border-input bg-background px-4 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-card";

/** Hata kodunu (schema.ts → ErrorCode) çeviriye dönüştürür */
export function useErrorText() {
  const t = useTranslations("calculatorUi.errors");
  return (code: unknown) =>
    typeof code === "string" && t.has(code as "invalid")
      ? t(code as "invalid")
      : code
        ? t("invalid")
        : undefined;
}

type FieldProps = {
  name: string;
  label: string;
  register: Register;
  errors: Errors;
  /** ₺, %, saat, gün */
  unit?: string;
  hint?: string;
  type?: "text" | "date";
  inputMode?: "decimal" | "numeric";
  placeholder?: string;
  className?: string;
};

/** Etiketli metin/tarih alanı: hata ve ipucu aria-describedby ile bağlanır. */
export function Field({
  name,
  label,
  register,
  errors,
  unit,
  hint,
  type = "text",
  inputMode = "decimal",
  placeholder,
  className,
}: FieldProps) {
  const errorText = useErrorText();
  const id = `f-${name}`;
  const error = errorText(errors[name]?.message);
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          inputMode={type === "text" ? inputMode : undefined}
          autoComplete="off"
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(inputClass, unit && "pr-14")}
          {...register(name)}
        />
        {unit ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-muted-foreground"
          >
            {unit}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="text-[13px] leading-snug text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-[13px] font-semibold text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Açılır liste */
export function SelectField({
  name,
  label,
  register,
  options,
  className,
}: {
  name: string;
  label: string;
  register: Register;
  options: { value: string; label: string }[];
  className?: string;
}) {
  const id = `f-${name}`;
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <select
        id={id}
        className={cn(inputClass, "appearance-auto pr-3")}
        {...register(name)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** İki seçenekli düğme grubu (ör. Brütten nete / Netten brüte) */
export function SegmentedField({
  name,
  legend,
  register,
  options,
}: {
  name: string;
  legend: string;
  register: Register;
  options: { value: string; label: string }[];
}) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-semibold">{legend}</legend>
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-input bg-surface p-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="relative flex h-10 cursor-pointer items-center justify-center rounded-lg px-2 text-center text-sm font-semibold text-muted-foreground transition-colors has-checked:bg-background has-checked:text-foreground has-checked:shadow-sm has-focus-visible:ring-2 has-focus-visible:ring-ring dark:has-checked:bg-card"
          >
            <input
              type="radio"
              value={option.value}
              className="sr-only"
              {...register(name)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Onay kutusu */
export function CheckboxField({
  name,
  label,
  register,
}: {
  name: string;
  label: string;
  register: Register;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-[15px]">
      <input
        type="checkbox"
        className="mt-0.5 size-5 shrink-0 accent-primary"
        {...register(name)}
      />
      {label}
    </label>
  );
}

/** Formun ana kartı: başlık + alanlar + Hesapla butonu */
export function FormCard({
  title,
  children,
  onSubmit,
  submitLabel,
}: {
  title: string;
  children: ReactNode;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="flex min-w-0 flex-col gap-5 rounded-[20px] border border-border bg-background p-5 md:p-7 dark:bg-surface"
    >
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
      <button
        type="submit"
        className="inline-flex h-[54px] items-center justify-center rounded-[14px] bg-primary px-6 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {submitLabel}
      </button>
    </form>
  );
}
