"use server";

// Formların Server Action'ı. JS kapalıyken de çalışır (form normal POST olarak gelir,
// sonuç useActionState ile sunucuda render edilir).

import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { LEGAL_ENTITY } from "@/config/legal";
import { getProvinceBySlug } from "@/config/provinces";
import { routing } from "@/i18n/routing";
import { sendFormMail, type MailField } from "./mail";
import { rateLimit } from "./rate-limit";
import {
  FORM_KINDS,
  FORM_META_FIELDS,
  FORM_SCHEMAS,
  HONEYPOT_FIELD,
  type FormErrorCode,
  type FormKind,
  type FormState,
} from "./schemas";

/** FormData → düz nesne. Aynı adlı birden çok alan (checkbox grubu) diziye dönüşür. */
function readFormData(formData: FormData) {
  const raw: Record<string, string | string[]> = {};
  for (const key of new Set(formData.keys())) {
    if (key.startsWith("$ACTION")) continue;
    const values = formData.getAll(key).filter((v): v is string => typeof v === "string");
    raw[key] = values.length > 1 ? values : (values[0] ?? "");
  }
  return raw;
}

async function clientIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown"
  );
}

const asText = (value: unknown) =>
  Array.isArray(value) ? value.join(", ") : String(value ?? "");

/**
 * Form türü ve dil gizli alanlarla gelir (FORM_META_FIELDS). Action istemcide `.bind` ile
 * bağlanmaz: JS kapalı gönderimin SSR yanıtında bağlı argüman kodlaması sonsuz döngüye giriyordu.
 */
export async function submitForm(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const at = Date.now();
  const {
    [HONEYPOT_FIELD]: honeypot,
    [FORM_META_FIELDS.kind]: rawKind,
    [FORM_META_FIELDS.locale]: rawLocale,
    ...values
  } = readFormData(formData);
  const kind = asText(rawKind) as FormKind;
  const locale = asText(rawLocale);
  if (!FORM_KINDS.includes(kind)) return { status: "error", code: "server", at };

  // Bot: başarılı görünür ama e-posta gönderilmez
  if (asText(honeypot).trim() !== "") return { status: "success", at };

  const parsed = FORM_SCHEMAS[kind].safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, FormErrorCode> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "");
      if (field && !errors[field]) {
        errors[field] = (issue.message as FormErrorCode) || "invalid";
      }
    }
    return { status: "invalid", errors, values, at };
  }

  if (!rateLimit(`${kind}:${await clientIp()}`)) {
    return { status: "error", code: "rateLimited", values, at };
  }

  // E-posta iç kullanım içindir: etiketler her zaman Türkçe
  const t = await getTranslations({ locale: "tr", namespace: "forms" });
  const data = parsed.data as Record<string, unknown>;
  const label = (field: string) =>
    t.has(`fields.${field}.label` as "fields.name.label")
      ? t(`fields.${field}.label` as "fields.name.label")
      : field;

  const fields: MailField[] = Object.entries(data)
    .filter(([key]) => key !== "consent")
    .map(([key, value]) => {
      let text = asText(value);
      if (key === "modules" && Array.isArray(value)) {
        text = value
          .map((m) => t(`options.modules.${m}` as "options.modules.pdks"))
          .join(", ");
      } else if (key === "employees") {
        text = t(`options.employees.${value}` as "options.employees.1-10");
      } else if (key === "subject") {
        text = t(`options.subject.${value}` as "options.subject.sales");
      } else if (key === "province") {
        text = getProvinceBySlug(String(value))?.name ?? text;
      }
      return { label: label(key), value: text };
    });
  fields.push(
    { label: t("mail.consent"), value: t("mail.consentGiven") },
    {
      label: t("mail.language"),
      value: hasLocale(routing.locales, locale) ? locale.toUpperCase() : "-",
    },
  );

  const to =
    kind === "deleteAccount" ? LEGAL_ENTITY.kvkkEmail : (process.env.CONTACT_TO ?? "");
  const subjectName = asText(data.company || data.name);

  const result = await sendFormMail({
    to,
    subject: `[QR Zaman] ${t(`mail.subjects.${kind}`)}: ${subjectName}`,
    fields,
    replyTo: asText(data.email) || undefined,
  });

  if (result === "failed") return { status: "error", code: "server", values, at };
  return { status: "success", at };
}
