"use client";

// Ortak form altyapısı: react-hook-form (istemci doğrulaması) + Server Action (gönderim).
// JS kapalıyken <form action> normal POST yapar; sunucu doğrulaması ve sonuç ekranı yine çalışır.

import {
  createContext,
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { CircleCheck, Loader2, Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  FormProvider,
  useForm,
  useFormContext,
  type FieldValues,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { inputClass } from "@/components/calculators/fields";
import { Button } from "@/components/ui/button";
import { submitForm } from "@/lib/forms/actions";
import {
  FORM_META_FIELDS,
  FORM_SCHEMAS,
  HONEYPOT_FIELD,
  INITIAL_FORM_STATE,
  type FormKind,
  type FormState,
} from "@/lib/forms/schemas";
import { cn } from "@/lib/utils";

const ServerState = createContext<FormState>(INITIAL_FORM_STATE);

/* ------------------------------------------------------------------ */
/* Form kabuğu                                                          */
/* ------------------------------------------------------------------ */

export function ServerForm({
  kind,
  defaultValues,
  submitLabel,
  children,
  className,
}: {
  kind: FormKind;
  defaultValues: FieldValues;
  submitLabel: string;
  children: ReactNode;
  className?: string;
}) {
  const t = useTranslations("forms");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(submitForm, INITIAL_FORM_STATE);
  const [dismissedAt, setDismissedAt] = useState<number | undefined>();

  const form = useForm<FieldValues>({
    resolver: zodResolver(
      FORM_SCHEMAS[kind] as never,
    ) as unknown as Resolver<FieldValues>,
    defaultValues: { ...defaultValues, ...state.values },
    mode: "onTouched",
  });

  // Sunucudan dönen sonuç: alan hatalarını forma yaz, bildirim göster
  useEffect(() => {
    if (!state.at) return;
    if (state.status === "invalid" && state.errors) {
      for (const [name, code] of Object.entries(state.errors)) {
        form.setError(name, { type: "server", message: code });
      }
      toast.error(t("status.invalid"));
    } else if (state.status === "success") {
      form.reset(defaultValues);
      toast.success(t(`status.success.${kind}.title`));
    } else if (state.status === "error") {
      toast.error(t(`status.${state.code ?? "server"}`));
    }
    // state.at her yanıtta değişir
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.at]);

  if (state.status === "success" && state.at !== dismissedAt) {
    return (
      <div
        role="status"
        className={cn(
          "flex flex-col items-start gap-4 rounded-[20px] border border-border bg-background p-6 md:p-8 dark:bg-surface",
          className,
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-success text-success-foreground">
          <CircleCheck className="size-6" aria-hidden="true" />
        </span>
        <h3 className="text-xl font-bold">{t(`status.success.${kind}.title`)}</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {t(`status.success.${kind}.text`)}
        </p>
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => setDismissedAt(state.at)}
        >
          {t("status.again")}
        </Button>
      </div>
    );
  }

  // JS açıkken: önce istemci doğrulaması, geçerse Server Action'a FormData gönderilir
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const formElement = event.currentTarget;
    void form.handleSubmit(() => {
      const data = new FormData(formElement);
      startTransition(() => formAction(data));
    })(event);
  };

  const generalError =
    state.status === "error" ? t(`status.${state.code ?? "server"}`) : null;

  return (
    <ServerState.Provider value={state}>
      <FormProvider {...form}>
        <form
          action={formAction}
          onSubmit={onSubmit}
          noValidate
          className={cn(
            "flex flex-col gap-5 rounded-[20px] border border-border bg-background p-5 md:p-8 dark:bg-surface",
            className,
          )}
        >
          <input type="hidden" name={FORM_META_FIELDS.kind} value={kind} />
          <input type="hidden" name={FORM_META_FIELDS.locale} value={locale} />
          <Honeypot />
          {children}
          {generalError ? (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
            >
              {generalError}
            </p>
          ) : null}
          {state.status === "invalid" ? (
            <p role="alert" className="text-sm font-semibold text-destructive">
              {t("status.invalid")}
            </p>
          ) : null}
          <Button
            type="submit"
            size="xl"
            disabled={pending}
            className="w-full sm:w-auto sm:self-start"
          >
            {pending ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <Send aria-hidden="true" />
            )}
            {pending ? t("status.sending") : submitLabel}
          </Button>
        </form>
      </FormProvider>
    </ServerState.Provider>
  );
}

/** Botların doldurduğu gizli alan (ekran okuyucudan ve klavyeden de gizli) */
function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Alanlar                                                              */
/* ------------------------------------------------------------------ */

/** Alan hatası: istemci doğrulaması, yoksa sunucu yanıtı (JS kapalıyken de görünür) */
function useFieldError(name: string) {
  const t = useTranslations("forms.errors");
  const {
    formState: { errors },
  } = useFormContext();
  const server = useContext(ServerState);
  const code = (errors[name]?.message as string | undefined) ?? server.errors?.[name];
  if (!code) return undefined;
  return t.has(code as "invalid") ? t(code as "invalid") : t("invalid");
}

/** JS kapalıyken hata sonrası yeniden render'da değeri korur */
function useServerValue(name: string) {
  const server = useContext(ServerState);
  return server.values?.[name];
}

function FieldShell({
  id,
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  const t = useTranslations("forms");
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-muted-foreground"> ({t("optional")})</span>
        )}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-[13px] leading-snug text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] font-semibold text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const describedBy = (id: string, hint?: string, error?: string) =>
  [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") ||
  undefined;

type BaseFieldProps = {
  name: string;
  required?: boolean;
  hint?: string;
  className?: string;
};

/** messages → forms.fields.<name>.{label, placeholder?} */
function useFieldText(name: string) {
  const t = useTranslations("forms.fields");
  const key = name as "name";
  return {
    label: t(`${key}.label`),
    placeholder: t.has(`${key}.placeholder`) ? t(`${key}.placeholder`) : undefined,
  };
}

export function TextField({
  name,
  required,
  hint,
  className,
  type = "text",
  autoComplete,
  inputMode,
}: BaseFieldProps & {
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
}) {
  const { register } = useFormContext();
  const { label, placeholder } = useFieldText(name);
  const error = useFieldError(name);
  const serverValue = useServerValue(name);
  const id = `form-${name}`;
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        defaultValue={typeof serverValue === "string" ? serverValue : undefined}
        className={inputClass}
        {...register(name)}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  name,
  required,
  hint,
  className,
  rows = 4,
  label: labelOverride,
}: BaseFieldProps & { rows?: number; label?: string }) {
  const { register } = useFormContext();
  const text = useFieldText(name);
  const label = labelOverride ?? text.label;
  const placeholder = text.placeholder;
  const error = useFieldError(name);
  const serverValue = useServerValue(name);
  const id = `form-${name}`;
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        defaultValue={typeof serverValue === "string" ? serverValue : undefined}
        className={cn(inputClass, "h-auto resize-y py-3 leading-relaxed")}
        {...register(name)}
      />
    </FieldShell>
  );
}

export function SelectField({
  name,
  required,
  hint,
  className,
  options,
}: BaseFieldProps & { options: { value: string; label: string }[] }) {
  const t = useTranslations("forms");
  const { register } = useFormContext();
  const { label } = useFieldText(name);
  const error = useFieldError(name);
  const serverValue = useServerValue(name);
  const id = `form-${name}`;
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <select
        id={id}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        defaultValue={typeof serverValue === "string" ? serverValue : undefined}
        className={cn(inputClass, "appearance-auto pr-3")}
        {...register(name)}
      >
        <option value="">{t("select")}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/** Çoklu seçim (checkbox grubu) */
export function CheckboxGroup({
  name,
  options,
  className,
}: {
  name: string;
  options: { value: string; label: string }[];
  className?: string;
}) {
  const { register } = useFormContext();
  const { label } = useFieldText(name);
  const t = useTranslations("forms");
  const serverValue = useServerValue(name);
  const checked = (value: string) =>
    Array.isArray(serverValue) ? serverValue.includes(value) : serverValue === value;
  return (
    <fieldset className={cn("flex min-w-0 flex-col gap-2", className)}>
      <legend className="mb-1.5 text-sm font-semibold">
        {label}
        <span className="font-normal text-muted-foreground"> ({t("optional")})</span>
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-input px-4 py-3 text-[15px] transition-colors has-checked:border-primary has-checked:bg-info/50 has-focus-visible:ring-3 has-focus-visible:ring-ring/30 dark:has-checked:bg-primary/15"
          >
            <input
              type="checkbox"
              value={o.value}
              defaultChecked={serverValue ? checked(o.value) : undefined}
              className="size-4 accent-primary"
              {...register(name)}
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** KVKK onay kutusu: metin içindeki linkler çağıran taraftan gelir */
export function ConsentField({
  name = "consent",
  children,
}: {
  name?: string;
  children: ReactNode;
}) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  const serverValue = useServerValue(name);
  const id = `form-${name}`;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          defaultChecked={serverValue === "on" ? true : undefined}
          className="mt-1 size-4 shrink-0 accent-primary"
          {...register(name)}
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-muted-foreground">
          {children}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-[13px] font-semibold text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
