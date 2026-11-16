import type { ReactNode } from "react";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { PageId } from "@/config/navigation";
import { Breadcrumbs } from "./breadcrumbs";
import { Container } from "./container";

/**
 * Alt sayfaların üst bloğu: breadcrumb + tek H1 + kısa açıklama (6.3).
 * Açıklama sayfanın meta description'ıyla aynıdır (3.2/5: tutarlı metin).
 */
export async function PageHeader({
  id,
  locale,
  children,
}: {
  id: PageId;
  locale: Locale;
  /** Başlığın altına eklenecek içerik (ör. CTA) */
  children?: ReactNode;
}) {
  const t = await getTranslations({ locale, namespace: "pages" });

  return (
    <div className="border-b border-border bg-surface">
      <Container className="flex flex-col gap-5 py-10 md:py-14">
        <Breadcrumbs id={id} locale={locale} />
        <h1 className="max-w-4xl text-4xl leading-tight font-extrabold text-balance md:text-5xl">
          {t(`${id}.h1`)}
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-pretty text-muted-foreground">
          {t(`${id}.metaDescription`)}
        </p>
        {children}
      </Container>
    </div>
  );
}
