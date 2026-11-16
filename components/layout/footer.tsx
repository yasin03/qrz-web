import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SocialIcon } from "@/components/icons/social";
import { Button } from "@/components/ui/button";
import { FOOTER_LEGAL, FOOTER_NAV, PAGES, type PageId } from "@/config/navigation";
import { SOCIAL_LINKS, type SocialNetwork } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { ContactLines } from "./contact-lines";
import { LocaleSwitcher } from "./locale-switcher";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { StoreBadges } from "./store-badges";
import { ThemeToggle } from "./theme-toggle";

const linkClass =
  "rounded text-navy-muted transition-colors hover:text-navy-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none aria-[current=page]:text-navy-foreground";

/**
 * Footer (footer.html): CTA bandı, marka bloğu, 4 link kolonu,
 * alt satırda yasal linkler, sosyal ikonlar, tema butonu ve TR · EN.
 */
export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tp = await getTranslations({ locale, namespace: "pages" });

  const label = (id: PageId) => {
    const key = `${id}.short` as const;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return tp.has(key as any) ? tp(key as any) : tp(`${id}.label`);
  };

  const socials = Object.entries(SOCIAL_LINKS) as [SocialNetwork, string][];

  return (
    <footer className="bg-navy pt-16 pb-7 text-navy-muted md:pt-[72px]">
      <Container className="flex flex-col gap-12">
        {/* CTA bandı */}
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-navy-line bg-navy-card p-6 md:p-8">
          <div className="flex flex-col gap-1.5">
            <p className="text-2xl leading-tight font-extrabold text-balance text-navy-foreground md:text-[28px]">
              {t("ctaTitle")} <span className="text-accent">{t("ctaTitleAccent")}</span>
            </p>
            <p className="text-[15px]">{t("ctaText")}</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button asChild size="md" className="h-12 px-[22px]">
              <Link href="/demo-talep">{t("ctaDemo")}</Link>
            </Button>
            <Button
              asChild
              variant="navy-outline"
              size="md"
              className="h-12 px-[22px] font-semibold"
            >
              <Link href="/iletisim">{t("ctaContact")}</Link>
            </Button>
          </div>
        </div>

        {/* Marka + link kolonları */}
        <div className="flex flex-wrap gap-10">
          <div className="flex flex-[1.4_1_260px] flex-col gap-[18px]">
            <Link
              href="/"
              className="flex self-start rounded focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <Logo variant="onDark" className="h-auto w-[180px]" />
            </Link>
            <p className="max-w-[300px] text-sm leading-relaxed">{t("tagline")}</p>
            <ContactLines className="text-sm" />
            <StoreBadges />
          </div>

          {FOOTER_NAV.map((column) => (
            <nav
              key={column.id}
              aria-labelledby={`footer-${column.id}`}
              className="flex flex-[1_1_150px] flex-col gap-3 text-sm"
            >
              <p
                id={`footer-${column.id}`}
                className="mb-1 font-bold text-navy-foreground"
              >
                {tn(`top.${column.id}`)}
              </p>
              <ul className="flex flex-col gap-[11px]">
                {column.items.map((id) => (
                  <li key={id}>
                    <NavLink href={PAGES[id].href} className={linkClass}>
                      {label(id)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Alt satır */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-navy-line pt-6 text-[13px]">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <nav aria-label={t("legalNav")}>
            <ul className="flex flex-wrap gap-x-[18px] gap-y-2">
              {FOOTER_LEGAL.map((id) => (
                <li key={id}>
                  <NavLink href={PAGES[id].href} className={linkClass}>
                    {tp(`${id}.label`)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            {/* TODO: sosyal medya adresleri girilene kadar ikonlar link değildir */}
            <ul aria-label={t("socialNav")} className="flex items-center gap-2">
              {socials.map(([network, href]) => {
                const className =
                  "flex size-9 items-center justify-center rounded-[10px] border border-navy-border text-navy-foreground";
                return (
                  <li key={network}>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener"
                        aria-label={t(`social.${network}`)}
                        className={cn(
                          className,
                          "transition-colors hover:bg-navy-foreground/10 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                        )}
                      >
                        <SocialIcon network={network} className="size-4" />
                      </a>
                    ) : (
                      <span
                        role="img"
                        aria-label={t(`social.${network}`)}
                        className={className}
                      >
                        <SocialIcon network={network} className="size-4" />
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <ThemeToggle onDark />
            <div className="flex h-9 items-center rounded-[10px] border border-navy-border px-1.5">
              <LocaleSwitcher onDark />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
