import type { Metadata } from "next";
import { ArrowRight, Calculator, LayoutGrid, Lightbulb, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { robotsFor } from "@/lib/seo";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { PAGES } from "@/config/navigation";
import { Link } from "@/i18n/navigation";

const CARDS = [
  { id: "products", icon: LayoutGrid },
  { id: "solutions", icon: Lightbulb },
  { id: "calculators", icon: Calculator },
  { id: "contact", icon: Mail },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: t("title"), robots: robotsFor(true) };
}

/**
 * 404 (onaylı bölüm planı): büyük 404 etiketi + H1 + açıklama, iki buton,
 * ana bölümlere giden 4 kart. Next.js bu sayfayı 404 durum kodu ve noindex ile döner.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  const tp = await getTranslations("pages");

  return (
    <section aria-labelledby="sayfa-bulunamadi" className="bg-surface">
      <Container className="flex flex-col gap-12 py-16 md:py-24">
        <div className="flex max-w-2xl flex-col items-start gap-5">
          <span className="text-7xl leading-none font-extrabold tracking-tight text-primary md:text-8xl dark:text-accent">
            {t("code")}
          </span>
          <h1
            id="sayfa-bulunamadi"
            className="text-4xl leading-tight font-extrabold text-balance md:text-5xl"
          >
            {t("h1")}
          </h1>
          <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
            {t("description")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="md">
              <Link href="/">{t("home")}</Link>
            </Button>
            <Button asChild size="md" variant="outline">
              <Link href="/demo-talep">{t("demo")}</Link>
            </Button>
          </div>
        </div>

        <nav aria-label={t("sections")}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map(({ id, icon: Icon }) => (
              <li key={id}>
                <Link
                  href={PAGES[id].href}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-card-foreground transition-transform duration-200 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-info text-info-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="flex items-center gap-1.5 text-lg font-bold">
                    {tp(`${id}.label`)}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t(`cards.${id}`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
