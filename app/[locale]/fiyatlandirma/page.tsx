import type { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { pageMetadata } from "@/lib/seo";

// Faz 2 iskeleti: başlık + açıklama + breadcrumb. Gövde ilgili fazda eklenir.

export async function generateMetadata({ params }: PageProps<"/[locale]/fiyatlandirma">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "pricing");
}

export default async function PricingPage({
  params,
}: PageProps<"/[locale]/fiyatlandirma">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  return <PageHeader id="pricing" locale={locale as Locale} />;
}
