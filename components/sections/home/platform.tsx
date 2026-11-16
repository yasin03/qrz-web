import {
  ChevronDown,
  Clock,
  LayoutDashboard,
  Users,
  Wallet,
  Handshake,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { PAGES } from "@/config/navigation";
import { PRODUCTS, PRODUCT_CATEGORIES, type ProductCategory } from "@/config/products";
import { Link } from "@/i18n/navigation";
import { Pill, h2Class, richTags } from "./parts";

const ICONS: Record<ProductCategory, typeof Clock> = {
  time: Clock,
  hr: Users,
  payroll: Wallet,
  crm: Handshake,
  platform: LayoutDashboard,
};

const linkClass =
  "rounded text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:text-accent";

/**
 * 4. Tek platform: 5 kategori kartı ve her birinin ürün linkleri.
 * Mobilde (mobil-ana-sayfa.html) kartlar akordiyon olur; iki görünüm de ilk HTML'dedir.
 */
export async function Platform() {
  const t = await getTranslations("home.platform");
  const tp = await getTranslations("pages");

  const groups = PRODUCT_CATEGORIES.map((category) => ({
    category,
    Icon: ICONS[category],
    items: PRODUCTS.filter((p) => p.category === category),
  }));

  return (
    <section aria-labelledby="tek-platform" className="pt-12 pb-6 md:pt-28 md:pb-14">
      <Container className="flex flex-col gap-8 md:gap-11">
        <Reveal className="flex max-w-[760px] flex-col gap-3.5">
          <Pill>{t("eyebrow")}</Pill>
          <h2 id="tek-platform" className={h2Class}>
            {t.rich("title", {
              ...richTags(),
              accent: (chunks) => (
                <span className="text-primary md:block dark:text-accent">{chunks}</span>
              ),
            })}
          </h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground md:text-lg">
            {t("description")}
          </p>
        </Reveal>

        {/* Masaüstü: kartlar */}
        <ul className="hidden grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 md:grid">
          {groups.map(({ category, Icon, items }, index) => (
            <Reveal key={category} as="li" index={index}>
              <article className="flex h-full flex-col gap-3 rounded-[20px] border border-border bg-background p-6 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none dark:bg-surface">
                <span className="flex size-11 items-center justify-center rounded-xl bg-info text-info-foreground">
                  <Icon className="size-[22px]" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold">{t(`categories.${category}`)}</h3>
                <ul className="flex flex-col gap-2 text-sm">
                  {items.map((product) => (
                    <li key={product.id}>
                      <Link href={PAGES[product.id].href} className={linkClass}>
                        {tp(`${product.id}.label`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ul>

        {/* Mobil: akordiyon */}
        <div className="flex flex-col gap-3.5 md:hidden">
          {groups.map(({ category, items }, index) => (
            <details
              key={category}
              open={index === 0}
              className="group rounded-2xl border border-border p-4 dark:bg-surface"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between rounded text-base font-bold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                <h3>{t(`categories.${category}`)}</h3>
                <ChevronDown
                  className="size-5 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <ul className="mt-2.5 flex flex-col gap-2.5 text-[15px]">
                {items.map((product) => (
                  <li key={product.id}>
                    <Link href={PAGES[product.id].href} className={linkClass}>
                      {tp(`${product.id}.label`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
