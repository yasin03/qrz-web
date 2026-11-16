import type { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { pageMetadata } from "@/lib/seo";

// Faz 2 iskeleti: başlık + açıklama + breadcrumb. Gövde ilgili fazda eklenir.

export async function generateMetadata({ params }: PageProps<"/[locale]/destek">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "support");
}

export default async function SupportPage({ params }: PageProps<"/[locale]/destek">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  return <PageHeader id="support" locale={locale as Locale} />;
}
