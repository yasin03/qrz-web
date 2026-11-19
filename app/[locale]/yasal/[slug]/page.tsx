import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ArrowLink } from "@/components/sections/home/parts";
import { LEGAL_ENTITY, LEGAL_PAGES, getLegalBySlug } from "@/config/legal";
import { PAGES } from "@/config/navigation";
import { getToc } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";

// İç yol her zaman TR slug'ıdır; EN adresi (ör. /en/legal/...) next-intl tarafından buraya yeniden yazılır.
// Metinler: content/{tr,en}/legal/<TR slug>.mdx

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_PAGES.map((item) => ({ slug: item.slug.tr }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/yasal/[slug]">) {
  const { locale, slug } = await params;
  const item = getLegalBySlug(slug);
  if (!item) notFound();
  return pageMetadata(locale as Locale, item.id);
}

const tocLinkClass =
  "block rounded py-1 text-sm leading-snug text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:hover:text-accent";

/** Yasal metin (sade metin sayfası): son güncelleme, içindekiler (masaüstünde yapışkan), MDX gövde. */
export default async function LegalPage({ params }: PageProps<"/[locale]/yasal/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const item = getLegalBySlug(slug);
  if (!item) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("legalPage");
  const tp = await getTranslations("pages");
  const { default: Content } = await import(
    `@/content/${locale}/legal/${item.slug.tr}.mdx`
  );
  const toc = getToc(locale, "legal", item.slug.tr);
  const updated = new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    dateStyle: "long",
  }).format(new Date(LEGAL_ENTITY.updatedAt));
  const others = LEGAL_PAGES.filter((l) => l.id !== item.id);

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

  return (
    <>
      <PageHeader id={item.id} locale={locale} />
      <div className="py-12 md:py-16">
        <Container className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
          {/* İçindekiler: mobilde açılır, masaüstünde sağda yapışkan */}
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

          <article className="min-w-0 lg:order-1">
            <p className="mb-8 inline-flex rounded-full bg-surface px-3.5 py-1.5 text-sm font-semibold text-muted-foreground">
              {t("updated", { date: updated })}
            </p>
            <Content />
            <div className="mt-14 flex flex-col gap-3 border-t border-border pt-8">
              <h2 className="text-lg font-bold">{t("others")}</h2>
              <ul className="flex flex-col gap-2">
                {others.map((other) => (
                  <li key={other.id}>
                    <ArrowLink href={PAGES[other.id].href} className="text-[15px]">
                      {tp(`${other.id}.label`)}
                    </ArrowLink>
                  </li>
                ))}
                <li>
                  <ArrowLink href="/hesap-silme" className="text-[15px]">
                    {tp("deleteAccount.label")}
                  </ArrowLink>
                </li>
              </ul>
            </div>
          </article>
        </Container>
      </div>
    </>
  );
}
