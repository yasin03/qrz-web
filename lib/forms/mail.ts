// SMTP ile form e-postası (nodemailer). Yalnızca sunucuda (Server Action) çağrılır.

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export type MailField = { label: string; value: string };

export type FormMail = {
  to: string;
  subject: string;
  /** Başlıklı alan listesi: düz metin ve HTML gövde buradan üretilir */
  fields: MailField[];
  replyTo?: string;
};

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 587);
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }
  return transporter;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function renderMail(fields: MailField[]) {
  const text = fields.map((f) => `${f.label}: ${f.value || "-"}`).join("\n");
  const rows = fields
    .map(
      (f) =>
        `<tr><th align="left" valign="top" style="padding:6px 12px 6px 0;white-space:nowrap">${escapeHtml(f.label)}</th><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(f.value || "-")}</td></tr>`,
    )
    .join("");
  const html = `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows}</table>`;
  return { text, html };
}

export type SendResult = "sent" | "logged" | "failed";

/**
 * SMTP ayarı veya alıcı yoksa: geliştirmede e-posta konsola yazılır ("logged"),
 * production'da gönderim başarısız sayılır ("failed").
 */
export async function sendFormMail(mail: FormMail): Promise<SendResult> {
  const { text, html } = renderMail(mail.fields);
  const smtp = getTransporter();

  if (!smtp || !mail.to) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[form] SMTP/alıcı tanımlı değil, e-posta gönderilmedi.\nKonu: ${mail.subject}\n${text}`,
      );
      return "logged";
    }
    console.error("[form] SMTP_HOST veya alıcı adresi (CONTACT_TO) tanımlı değil.");
    return "failed";
  }

  try {
    await smtp.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: mail.to,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text,
      html,
    });
    return "sent";
  } catch (error) {
    console.error("[form] E-posta gönderilemedi:", error);
    return "failed";
  }
}
