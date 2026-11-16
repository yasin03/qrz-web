import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ProductPage } from "@/components/sections/product/product-page";
import { PRODUCTS, getProductBySlug } from "@/config/products";
import { pageMetadata } from "@/lib/seo";

// İç yol her zaman TR slug'ıdır; EN adresi (ör. /en/products/...) next-intl tarafından buraya yeniden yazılır.

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((item) => ({ slug: item.slug.tr }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/urunler/[slug]">) {
  const { locale, slug } = await params;
  const item = getProductBySlug(slug);
  if (!item) notFound();
  return pageMetadata(locale as Locale, item.id);
}

export default async function ProductRoute({
  params,
}: PageProps<"/[locale]/urunler/[slug]">) {
  const { locale, slug } = await params;
  const item = getProductBySlug(slug);
  if (!item) notFound();
  setRequestLocale(locale as Locale);
  return <ProductPage product={item} locale={locale as Locale} />;
}
