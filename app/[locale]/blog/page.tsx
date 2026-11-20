import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogFooterNote, withRss } from "@/components/blog/blog-feed";
import { CategoryNav } from "@/components/blog/category-nav";
import { PostCard } from "@/components/blog/post-card";
import { PostGrid } from "@/components/blog/post-grid";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ProductCta } from "@/components/sections/product/product-cta";
import { BLOG_POST_LOCALE, type BlogCategoryId } from "@/config/blog";
import { getAllPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

// Blog listesi: kategoriler, en son yazı (büyük kart), diğer yazılar, CTA.
// Yazılar yalnızca TR; /en/blog aynı yazıları "Türkçe" notuyla listeler.

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  return withRss(await pageMetadata(locale as Locale, "blog"));
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("blogPage");
  const posts = await getAllPosts();
  const [featured, ...rest] = posts;
  const counts: Partial<Record<BlogCategoryId, number>> = {};
  for (const post of posts) counts[post.category] = (counts[post.category] ?? 0) + 1;

  return (
    <>
      <PageHeader id="blog" locale={locale}>
        {locale === BLOG_POST_LOCALE ? null : (
          <p className="text-sm font-semibold text-muted-foreground">{t("languageNotice")}</p>
        )}
      </PageHeader>

      <section aria-labelledby="son-yazilar" className="py-12 md:py-16">
        <Container className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-5">
            <h2 id="son-yazilar" className="text-2xl font-extrabold md:text-[28px]">
              {t("latestHeading")}
            </h2>
            <CategoryNav locale={locale} counts={counts} />
          </div>
          {featured ? <PostCard post={featured} locale={locale} featured /> : null}
          {rest.length > 0 ? <PostGrid posts={rest} locale={locale} /> : null}
        </Container>
      </section>

      <BlogFooterNote locale={locale} />
      <ProductCta id="blog-cta" title={t("cta")} />
    </>
  );
}
