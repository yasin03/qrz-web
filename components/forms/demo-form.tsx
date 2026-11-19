"use client";

import { useTranslations } from "next-intl";
import { DEMO_MODULES, EMPLOYEE_RANGES } from "@/lib/forms/schemas";
import { ConsentText } from "./consent-text";
import {
  CheckboxGroup,
  ConsentField,
  SelectField,
  ServerForm,
  TextAreaField,
  TextField,
} from "./form-kit";

export function DemoForm() {
  const t = useTranslations("forms");
  return (
    <ServerForm
      kind="demo"
      submitLabel={t("submit.demo")}
      defaultValues={{
        name: "",
        company: "",
        email: "",
        phone: "",
        employees: "",
        modules: [],
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
      <SelectField
        name="employees"
        required
        options={EMPLOYEE_RANGES.map((value) => ({
          value,
          label: t(`options.employees.${value}`),
        }))}
      />
      <CheckboxGroup
        name="modules"
        options={DEMO_MODULES.map((value) => ({
          value,
          label: t(`options.modules.${value}`),
        }))}
      />
      <TextAreaField name="message" />
      <ConsentField>
        <ConsentText />
      </ConsentField>
    </ServerForm>
  );
}
