"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const linkClass =
  "font-semibold text-primary underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:text-accent";

/** "KVKK Aydınlatma Metni'ni okudum…" metni, aydınlatma ve gizlilik sayfalarına linkli */
export function ConsentText() {
  const t = useTranslations("forms");
  return t.rich("consent", {
    kvkk: (chunks) => (
      <Link href="/yasal/kvkk" className={linkClass}>
        {chunks}
      </Link>
    ),
    privacy: (chunks) => (
      <Link href="/yasal/gizlilik-politikasi" className={linkClass}>
        {chunks}
      </Link>
    ),
  });
}
