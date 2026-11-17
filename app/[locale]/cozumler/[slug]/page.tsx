import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SolutionPage } from "@/components/sections/solution/solution-page";
import { SOLUTIONS, getSolutionBySlug } from "@/config/solutions";
import { pageMetadata } from "@/lib/seo";

// İç yol her zaman TR slug'ıdır; EN adresi (ör. /en/...) next-intl tarafından buraya yeniden yazılır.

export const dynamicParams = false;

export function generateStaticParams() {
  return SOLUTIONS.map((item) => ({ slug: item.slug.tr }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cozumler/[slug]">) {
  const { locale, slug } = await params;
  const item = getSolutionBySlug(slug);
  if (!item) notFound();
  return pageMetadata(locale as Locale, item.id);
}

export default async function SolutionRoute({
  params,
}: PageProps<"/[locale]/cozumler/[slug]">) {
  const { locale, slug } = await params;
  const item = getSolutionBySlug(slug);
  if (!item) notFound();
  setRequestLocale(locale as Locale);
  return <SolutionPage solution={item} locale={locale as Locale} />;
}
