import type { ReactNode } from "react";
import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CONTACT } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * İletişim satırları (telefon, e-posta, adres). Bilgiler config/site.ts → CONTACT'tan gelir.
 * Bir değer boş bırakılırsa yer tutucu metin gösterilir ve link verilmez.
 */
export async function ContactLines({ className }: { className?: string }) {
  const t = await getTranslations("footer");
  const phone: string = CONTACT.phone;
  const email: string = CONTACT.email;
  const addressLines: readonly string[] = CONTACT.address.lines;

  const lines: {
    key: "phone" | "email" | "address";
    icon: LucideIcon;
    value: ReactNode;
    href?: string;
  }[] = [
    {
      key: "phone",
      icon: Phone,
      value: phone ? CONTACT.phoneDisplay : null,
      href: `tel:${phone}`,
    },
    { key: "email", icon: Mail, value: email || null, href: `mailto:${email}` },
    {
      key: "address",
      icon: MapPin,
      value: addressLines.length ? (
        <address className="not-italic">
          {addressLines.map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </address>
      ) : null,
    },
  ];

  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {lines.map(({ key, icon: Icon, value, href }) => (
        <li key={key} className="flex items-start gap-2.5">
          <Icon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          {value && href ? (
            <a href={href} className="font-semibold text-navy-foreground hover:underline">
              {value}
            </a>
          ) : value ? (
            value
          ) : (
            <span aria-label={t(key)}>{t(`placeholders.${key}`)}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
