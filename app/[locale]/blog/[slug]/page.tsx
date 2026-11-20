import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import type { BlogPosting } from "schema-dts";
import { withRss } from "@/components/blog/blog-feed";
import { PostCover } from "@/components/blog/post-cover";
import { PostGrid } from "@/components/blog/post-grid";
import { PostMeta } from "@/components/blog/post-meta";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { FaqList, FaqSchema } from "@/components/sections/faq-list";
import { ArrowLink } from "@/components/sections/home/parts";
import { ProductCta } from "@/components/sections/product/product-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { ORG_ID } from "@/components/seo/site-schema";
import { BLOG_POST_LOCALE, BLOG_POSTS, getCategoryById, postPath } from "@/config/blog";
import { PAGES, type PageId } from "@/config/navigation";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { formatPostDate, getPost, getRelatedPosts } from "@/lib/blog";
import { getToc } from "@/lib/mdx";
import { absoluteUrl, buildMetadata, ogImagePath } from "@/lib/seo";

// Blog yazısı: /blog/<slug>. Metin content/tr/blog/<slug>.mdx, yapısal bilgi config/blog.ts.
// Yazılar yalnızca TR'dir: /en/blog/<slug> notFound() ile 404 döner.
// Not: EN için boş liste döndürülemez; Next 16 boş sonuçta üst parametreyi slug'sız geçirir
// ve rotanın tüm ön üretimini düşürür. Bu yüzden iki dilde de üretilir, EN 404 olarak basılır.

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

/** SSS başlığının içindekiler listesindeki çapası */
const FAQ_ANCHOR = "sik-sorulan-sorular";

async function load(locale: string, slug: string) {
  if (locale !== BLOG_POST_LOCALE) notFound();
  const result = await getPost(slug);
  if (!result) notFound();
  const category = getCategoryById(result.post.category);
  if (!category) notFound();
  return { ...result, category, href: postPath(slug) as AppPathname };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  const { post, href } = await load(locale, slug);
  const metadata = buildMetadata({
    locale: locale as Locale,
    href,
    title: post.meta.title,
    description: post.meta.description,
    locales: [BLOG_POST_LOCALE],
    ogType: "article",
  });
  return withRss({
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: `${post.publishedAt}T09:00:00+03:00`,
      modifiedTime: `${post.updatedAt}T09:00:00+03:00`,
    },
  });
}

const creditLinkClass =
  "rounded underline-offset-2 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

const tocLinkClass =
  "block rounded py-1 text-sm leading-snug text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:hover:text-accent";

export default async function BlogPostPage({
  params,
}: PageProps<"/[locale]/blog/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const { post, Content, category, href } = await load(locale, slug);
  const t = await getTranslations("blogPage");
  const tp = await getTranslations("pages");
  const related = await getRelatedPosts(post);
  const categoryHref = `/blog/kategori/${category.slug.tr}` as AppPathname;
  const categoryLabel = t(`categories.${category.id}.label`);
  const faq = post.meta.faq ?? [];
  const credit = post.cover.credit;

  const toc = [
    ...getToc(locale, "blog", slug),
    ...(faq.length ? [{ id: FAQ_ANCHOR, title: t("faqHeading") }] : []),
  ];
  const relatedLinks = [
    ...post.related.calculators,
    ...post.related.products,
  ] as PageId[];

  const tocList = (
    <ol className="flex flex-col gap-0.5">
      {toc.map((entry) => (
        <li key={entry.id}>
          <a href={`#${entry.id}`} className={tocLinkClass}>
            {entry.title}
          </a>
        </li>
      ))}
    </ol>
  );

  const url = absoluteUrl(locale, href);
  const authorName = t(`authors.${post.author}.name`);

  return (
    <>
      <JsonLd<BlogPosting>
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.meta.h1,
          description: post.meta.description,
          image: [
            `${SITE_URL}${post.cover.src}`,
            `${SITE_URL}${ogImagePath(locale, href)}`,
          ],
          datePublished: `${post.publishedAt}T09:00:00+03:00`,
          dateModified: `${post.updatedAt}T09:00:00+03:00`,
          inLanguage: "tr-TR",
          articleSection: categoryLabel,
          keywords: post.meta.keyword,
          url,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          author: { "@type": "Organization", name: authorName, url: SITE_URL },
          publisher: {
            "@type": "Organization",
            "@id": ORG_ID,
            name: SITE_NAME,
            logo: { "@type": "ImageObject", url: `${SITE_URL}/logos/logo-pri.png` },
          },
        }}
      />
      {faq.length ? <FaqSchema items={faq} /> : null}

      <article>
        <header className="border-b border-border bg-surface">
          <Container className="flex flex-col gap-5 py-10 md:py-14">
            <Breadcrumbs
              id="blog"
              locale={locale}
              current={[
                { label: categoryLabel, href: categoryHref },
                { label: post.meta.title, href },
              ]}
            />
            <Link
              href={categoryHref}
              className="self-start rounded-full bg-info px-3 py-1 text-xs font-bold text-info-foreground transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {categoryLabel}
            </Link>
            <h1 className="max-w-4xl text-4xl leading-tight font-extrabold text-balance md:text-5xl">
              {post.meta.h1}
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-pretty text-muted-foreground">
              {post.meta.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <PostMeta post={post} locale={locale} showAuthor />
              {post.updatedAt !== post.publishedAt ? (
                <p className="text-sm text-muted-foreground">
                  <time dateTime={post.updatedAt}>
                    {t("updated", { date: formatPostDate(post.updatedAt, locale) })}
                  </time>
                </p>
              ) : null}
            </div>
          </Container>
        </header>

        <div className="py-12 md:py-16">
          <Container className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
            {/* İçindekiler: mobilde açılır, masaüstünde sağda yapışkan (yasal sayfalarla aynı) */}
            <nav
              aria-label={t("toc")}
              className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:order-2"
            >
              <details className="group rounded-2xl border border-border p-4 lg:hidden dark:bg-surface">
                <summary className="flex cursor-pointer list-none items-center justify-between rounded font-bold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                  {t("toc")}
                  <ChevronDown
                    className="size-5 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="mt-3">{tocList}</div>
              </details>
              <div className="hidden flex-col gap-3 rounded-2xl border border-border p-5 lg:flex dark:bg-surface">
                <p className="text-sm font-bold">{t("toc")}</p>
                {tocList}
              </div>
            </nav>

            <div className="max-w-[760px] min-w-0 lg:order-1">
              <figure className="mb-10">
                <PostCover
                  post={post}
                  alt={post.meta.coverAlt}
                  sizes="(min-width: 1024px) 760px, 100vw"
                  priority
                />
                {credit ? (
                  <figcaption className="mt-2 text-xs text-muted-foreground">
                    {t.rich("photoCredit", {
                      name: credit.photographer,
                      photographer: (chunks) => (
                        <a href={credit.url} rel="noopener" className={creditLinkClass}>
                          {chunks}
                        </a>
                      ),
                      unsplash: (chunks) => (
                        <a
                          href="https://unsplash.com"
                          rel="noopener"
                          className={creditLinkClass}
                        >
                          {chunks}
                        </a>
                      ),
                    })}
                  </figcaption>
                ) : null}
              </figure>
              <Content />

              {faq.length ? (
                <section aria-labelledby={FAQ_ANCHOR} className="mt-12">
                  <h2
                    id={FAQ_ANCHOR}
                    className="scroll-mt-[calc(var(--header-h)+1.5rem)] text-2xl leading-tight font-extrabold md:text-[28px]"
                  >
                    {t("faqHeading")}
                  </h2>
                  <div className="mt-5 flex flex-col gap-3">
                    <FaqList items={faq} />
                  </div>
                </section>
              ) : null}

              {relatedLinks.length ? (
                <section
                  aria-labelledby="ilgili-sayfalar"
                  className="mt-14 flex flex-col gap-3 border-t border-border pt-8"
                >
                  <h2 id="ilgili-sayfalar" className="text-lg font-bold">
                    {t("relatedLinksHeading")}
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {relatedLinks.map((id) => (
                      <li key={id}>
                        <ArrowLink href={PAGES[id].href} className="text-[15px]">
                          {tp(`${id}.label`)}
                        </ArrowLink>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </Container>
        </div>
      </article>

      {related.length ? (
        <section aria-labelledby="ilgili-yazilar" className="bg-surface py-12 md:py-16">
          <Container className="flex flex-col gap-8">
            <h2 id="ilgili-yazilar" className="text-2xl font-extrabold md:text-[28px]">
              {t("relatedPostsHeading")}
            </h2>
            <PostGrid posts={related} locale={locale} />
          </Container>
        </section>
      ) : null}

      <ProductCta id="blog-cta" title={t("cta")} />
    </>
  );
}
