"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import type { z } from "zod";

/**
 * Hesaplama formlarının ortak kurulumu: metin değerler → zod ile sayıya → hesap.
 * Hesap sonucu state'te tutulur; ilk hesaptan sonra alanlar değiştikçe yeniden doğrulanır.
 */
export function useCalculatorForm<
  S extends z.ZodType<Record<string, unknown>, Record<string, unknown>>,
  R,
>(
  schema: S,
  defaultValues: z.input<S>,
  compute: (
    values: z.output<S>,
    setFieldError: (name: string, code: string) => void,
  ) => R | null,
) {
  const form = useForm<z.input<S>, unknown, z.output<S>>({
    resolver: zodResolver(schema as never) as never,
    defaultValues: defaultValues as never,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const [result, setResult] = useState<R | null>(null);

  const submit = form.handleSubmit(
    (values) => {
      const next = compute(values, (name, code) =>
        form.setError(name as never, { type: "custom", message: code }),
      );
      setResult(next);
    },
    () => setResult(null),
  );

  return {
    // Ortak alan bileşenleri alan adını string olarak alır
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: form.register as unknown as UseFormRegister<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors: form.formState.errors as FieldErrors<any>,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
    submit,
    result,
  };
}
