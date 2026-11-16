import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { CALCULATORS, getCalculatorBySlug } from "@/config/calculators";
import { pageMetadata } from "@/lib/seo";

// İç yol her zaman TR slug'ıdır; EN adresi (ör. /en/...) next-intl tarafından buraya yeniden yazılır.
// Faz 2 iskeleti: başlık + açıklama + breadcrumb. Gövde ilgili fazda eklenir.

export const dynamicParams = false;

export function generateStaticParams() {
  return CALCULATORS.map((item) => ({ slug: item.slug.tr }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/hesaplama/[slug]">) {
  const { locale, slug } = await params;
  const item = getCalculatorBySlug(slug);
  if (!item) notFound();
  return pageMetadata(locale as Locale, item.id);
}

export default async function CalculatorPage({
  params,
}: PageProps<"/[locale]/hesaplama/[slug]">) {
  const { locale, slug } = await params;
  const item = getCalculatorBySlug(slug);
  if (!item) notFound();
  setRequestLocale(locale as Locale);
  return <PageHeader id={item.id} locale={locale as Locale} />;
}
