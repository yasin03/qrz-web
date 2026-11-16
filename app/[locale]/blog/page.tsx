import type { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { pageMetadata } from "@/lib/seo";

// Faz 2 iskeleti: başlık + açıklama + breadcrumb. Gövde ilgili fazda eklenir.

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "blog");
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  return <PageHeader id="blog" locale={locale as Locale} />;
}
