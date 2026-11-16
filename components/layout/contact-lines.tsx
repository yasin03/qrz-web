import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CONTACT } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * İletişim satırları (telefon, e-posta, adres).
 * TODO: Gerçek bilgiler config/site.ts → CONTACT'a girilene kadar yer tutucu metin gösterilir
 * ve link verilmez. Değer girilince tel: / mailto: linkine otomatik döner.
 */
export async function ContactLines({ className }: { className?: string }) {
  const t = await getTranslations("footer");
  const lines: {
    key: "phone" | "email" | "address";
    icon: LucideIcon;
    value: string;
    href?: string;
  }[] = [
    { key: "phone", icon: Phone, value: CONTACT.phone, href: `tel:${CONTACT.phone}` },
    { key: "email", icon: Mail, value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { key: "address", icon: MapPin, value: CONTACT.address },
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
          ) : (
            <span aria-label={value ? undefined : t(key)}>
              {value || t(`placeholders.${key}`)}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
