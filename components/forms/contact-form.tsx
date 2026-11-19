"use client";

import { useTranslations } from "next-intl";
import { CONTACT_SUBJECTS } from "@/lib/forms/schemas";
import { ConsentText } from "./consent-text";
import {
  ConsentField,
  SelectField,
  ServerForm,
  TextAreaField,
  TextField,
} from "./form-kit";

export function ContactForm() {
  const t = useTranslations("forms");
  return (
    <ServerForm
      kind="contact"
      submitLabel={t("submit.contact")}
      defaultValues={{
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
        consent: false,
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" required autoComplete="name" />
        <TextField
          name="email"
          type="email"
          inputMode="email"
          required
          autoComplete="email"
        />
        <TextField name="phone" type="tel" inputMode="tel" autoComplete="tel" />
        <TextField name="company" autoComplete="organization" />
      </div>
      <SelectField
        name="subject"
        required
        options={CONTACT_SUBJECTS.map((value) => ({
          value,
          label: t(`options.subject.${value}`),
        }))}
      />
      <TextAreaField name="message" required rows={5} />
      <ConsentField>
        <ConsentText />
      </ConsentField>
    </ServerForm>
  );
}
