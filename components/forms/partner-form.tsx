"use client";

import { useTranslations } from "next-intl";
import { ConsentText } from "./consent-text";
import {
  ConsentField,
  SelectField,
  ServerForm,
  TextAreaField,
  TextField,
} from "./form-kit";

export function PartnerForm({
  provinces,
}: {
  /** 81 il (slug + ad); sunucudan gelir */
  provinces: { value: string; label: string }[];
}) {
  const t = useTranslations("forms");
  return (
    <ServerForm
      kind="partner"
      submitLabel={t("submit.partner")}
      defaultValues={{
        name: "",
        company: "",
        email: "",
        phone: "",
        province: "",
        business: "",
        message: "",
        consent: false,
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" required autoComplete="name" />
        <TextField name="company" required autoComplete="organization" />
        <TextField
          name="email"
          type="email"
          inputMode="email"
          required
          autoComplete="email"
        />
        <TextField name="phone" type="tel" inputMode="tel" required autoComplete="tel" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField name="province" required options={provinces} />
        <TextField name="business" />
      </div>
      <TextAreaField name="message" />
      <ConsentField>
        <ConsentText />
      </ConsentField>
    </ServerForm>
  );
}
