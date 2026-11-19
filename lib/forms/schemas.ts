// Form şemaları: istemci (react-hook-form) ve sunucu (Server Action) aynı şemayı kullanır.
// Hata mesajları çeviri anahtarıdır (messages → forms.errors.<kod>).

import { z } from "zod";

export const FORM_KINDS = ["demo", "contact", "partner", "deleteAccount"] as const;
export type FormKind = (typeof FORM_KINDS)[number];

export const EMPLOYEE_RANGES = ["1-10", "11-50", "51-200", "201-500", "500+"] as const;
export const DEMO_MODULES = ["pdks", "hr", "payroll", "crm"] as const;
export const CONTACT_SUBJECTS = ["sales", "support", "partnership", "other"] as const;

export type FormErrorCode =
  "required" | "email" | "phone" | "consent" | "tooLong" | "tooShort" | "invalid";

const text = (max = 120) => z.string().trim().min(1, "required").max(max, "tooLong");

const optionalText = (max = 2000) =>
  z.string().trim().max(max, "tooLong").optional().default("");

const email = z
  .string()
  .trim()
  .min(1, "required")
  .max(160, "tooLong")
  .pipe(z.email("email"));

/** Türkiye telefonu: boşluk/parantez/tire yok sayılır; 10 hane (5xx…) veya 0 / +90 önekli. */
export const PHONE_PATTERN = /^(?:\+?90|0)?[2-5]\d{9}$/;
export const normalizePhone = (value: string) => value.replace(/[\s().-]/g, "");

const phone = z
  .string()
  .trim()
  .min(1, "required")
  .refine((v) => PHONE_PATTERN.test(normalizePhone(v)), "phone");

const optionalPhone = z
  .string()
  .trim()
  .optional()
  .default("")
  .refine((v) => v === "" || PHONE_PATTERN.test(normalizePhone(v)), "phone");

/** Checkbox: işaretliyse "on" gelir (form POST) ya da true (RHF). */
const consent = z.preprocess(
  (v) => v === true || v === "on" || v === "true",
  z.boolean().refine((v) => v, "consent"),
);

export const demoSchema = z.object({
  name: text(),
  company: text(),
  email,
  phone,
  employees: z.enum(EMPLOYEE_RANGES, "required"),
  // Hiçbiri seçilmezse RHF false, form POST'u hiç alan göndermez
  modules: z.preprocess(
    (v) => (Array.isArray(v) ? v : typeof v === "string" ? [v] : []),
    z.array(z.enum(DEMO_MODULES, "invalid")),
  ),
  message: optionalText(),
  consent,
});

export const contactSchema = z.object({
  name: text(),
  email,
  phone: optionalPhone,
  company: optionalText(120),
  subject: z.enum(CONTACT_SUBJECTS, "required"),
  message: z.string().trim().min(10, "tooShort").max(2000, "tooLong"),
  consent,
});

export const partnerSchema = z.object({
  name: text(),
  company: text(),
  email,
  phone,
  province: text(40),
  business: optionalText(200),
  message: optionalText(),
  consent,
});

export const deleteAccountSchema = z.object({
  name: z.string().trim().min(3, "tooShort").max(120, "tooLong"),
  username: text(),
  company: text(),
  email,
  phone: optionalPhone,
  message: optionalText(1000),
  consent,
});

export const FORM_SCHEMAS = {
  demo: demoSchema,
  contact: contactSchema,
  partner: partnerSchema,
  deleteAccount: deleteAccountSchema,
} as const satisfies Record<FormKind, z.ZodType>;

export type FormValues<K extends FormKind> = z.output<(typeof FORM_SCHEMAS)[K]>;

/** Honeypot alanının adı: gerçek kullanıcı görmez, botlar doldurur. */
export const HONEYPOT_FIELD = "website";

/** Formla birlikte gizli alan olarak gönderilen bilgiler */
export const FORM_META_FIELDS = { kind: "_form", locale: "_locale" } as const;

export type FormState = {
  status: "idle" | "success" | "invalid" | "error";
  /** alan → hata kodu */
  errors?: Record<string, FormErrorCode>;
  /** JS kapalıyken hata sonrası alanlar yeniden doldurulsun diye gönderilen değerler */
  values?: Record<string, string | string[]>;
  /** status "error" iken: rateLimited | server */
  code?: "rateLimited" | "server";
  /** Her yanıtta değişir; aynı sonuçta bile bildirim yeniden gösterilir */
  at?: number;
};

export const INITIAL_FORM_STATE: FormState = { status: "idle" };
