"use client";

import { useTranslations } from "next-intl";
import { ConsentField, ServerForm, TextAreaField, TextField } from "./form-kit";

export function DeleteAccountForm() {
  const t = useTranslations("forms");
  return (
    <ServerForm
      kind="deleteAccount"
      submitLabel={t("submit.deleteAccount")}
      defaultValues={{
        name: "",
        username: "",
        company: "",
        email: "",
        phone: "",
        message: "",
        consent: false,
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" required autoComplete="name" />
        <TextField name="username" required autoComplete="username" />
        <TextField name="company" required autoComplete="organization" />
        <TextField
          name="email"
          type="email"
          inputMode="email"
          required
          autoComplete="email"
        />
        <TextField name="phone" type="tel" inputMode="tel" autoComplete="tel" />
      </div>
      <TextAreaField name="message" label={t("deleteMessageLabel")} />
      <ConsentField>{t("deleteConsent")}</ConsentField>
    </ServerForm>
  );
}
