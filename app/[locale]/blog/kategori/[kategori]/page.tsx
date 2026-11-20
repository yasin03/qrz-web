import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogFooterNote, withRss } from "@/components/blog/blog-feed";
import { CategoryNav } from "@/components/blog/category-nav";
import { PostGrid } from "@/components/blog/post-grid";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { ProductCta } from "@/components/sections/product/product-cta";
import {
  BLOG_POST_LOCALE,
  BLOG_POSTS,
  type BlogCategoryId,
  getActiveCategories,
  getCategoryBySlug,
} from "@/config/blog";
import type { AppPathname } from "@/i18n/routing";
import { getPostsByCategory } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

// Kategori sayfası: /blog/kategori/<slug> ↔ /en/blog/category/<slug>.
// Yalnızca yazısı olan kategoriler üretilir; boş kategori 404 (ince sayfa olmaz).

export const dynamicParams = false;

export function generateStaticParams() {
  return getActiveCategories().map((c) => ({ kategori: c.slug.tr }));
}

function load(slug: string) {
  const category = getCategoryBySlug(slug);
  if (!category || !getActiveCategories().some((c) => c.id === category.id)) notFound();
  return { category, href: `/blog/kategori/${category.slug.tr}` as AppPathname };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog/kategori/[kategori]">) {
  const { locale, kategori } = await params;
  const { category, href } = load(kategori);
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: `blogPage.categories.${category.id}`,
  });
  return withRss(
    buildMetadata({
      locale: locale as Locale,
      href,
      title: t("title"),
      description: t("metaDescription"),
    }),
  );
}

export default async function BlogCategoryPage({
  params,
}: PageProps<"/[locale]/blog/kategori/[kategori]">) {
  const { locale: rawLocale, kategori } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const { category, href } = load(kategori);
  const t = await getTranslations("blogPage");
  const posts = await getPostsByCategory(category.id);
  const counts: Partial<Record<BlogCategoryId, number>> = {};
  for (const post of BLOG_POSTS) counts[post.category] = (counts[post.category] ?? 0) + 1;

  return (
    <>
      <div className="border-b border-border bg-surface">
        <Container className="flex flex-col gap-5 py-10 md:py-14">
          <Breadcrumbs
            id="blog"
            locale={locale}
            current={{ label: t(`categories.${category.id}.label`), href }}
          />
          <h1 className="max-w-4xl text-4xl leading-tight font-extrabold text-balance md:text-5xl">
            {t(`categories.${category.id}.h1`)}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-pretty text-muted-foreground">
            {t(`categories.${category.id}.metaDescription`)}
          </p>
          {locale === BLOG_POST_LOCALE ? null : (
            <p className="text-sm font-semibold text-muted-foreground">{t("languageNotice")}</p>
          )}
        </Container>
      </div>

      <section aria-labelledby="kategori-yazilari" className="py-12 md:py-16">
        <Container className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-5">
            <h2 id="kategori-yazilari" className="text-2xl font-extrabold md:text-[28px]">
              {t("postCount", { count: posts.length })}
            </h2>
            <CategoryNav locale={locale} active={category.id} counts={counts} />
          </div>
          <PostGrid posts={posts} locale={locale} />
        </Container>
      </section>

      <BlogFooterNote locale={locale} />
      <ProductCta id="blog-cta" title={t("cta")} />
    </>
  );
}
