import type { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { pageMetadata } from "@/lib/seo";

// Faz 2 iskeleti: başlık + açıklama + breadcrumb. Gövde ilgili fazda eklenir.

export async function generateMetadata({ params }: PageProps<"/[locale]/bayiler">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "dealers");
}

export default async function DealersPage({ params }: PageProps<"/[locale]/bayiler">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  return <PageHeader id="dealers" locale={locale as Locale} />;
}
