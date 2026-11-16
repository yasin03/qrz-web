import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import {
  MAIN_NAV,
  PAGES,
  type NavGroup,
  type NavItem,
  type PageId,
} from "@/config/navigation";
import { PANEL_LOGIN_URL } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import phoneHome from "@/public/screenshots/mobile/mobil-uygulama-ana-sayfa.webp";
import { ContactLines } from "./contact-lines";
import { Container } from "./container";
import { DesktopNav, DesktopNavMenu, topItemClass } from "./desktop-nav";
import { HeaderBar } from "./header-bar";
import { LocaleSwitcher } from "./locale-switcher";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { NavLink } from "./nav-link";
import { StoreBadges } from "./store-badges";
import { ThemeToggle } from "./theme-toggle";

type T = Awaited<ReturnType<typeof getTranslations>>;

const groupItemsHrefs = (item: Extract<NavItem, { groups: NavGroup[] }>) =>
  item.groups.flatMap((g) => g.items.map((i) => PAGES[i.id].href as string));

/**
 * Site header'ı (3.1, navbar-menuler.html). Server Component: tüm menü linkleri ilk HTML'de.
 * Açma/kapama yalnızca DesktopNav / MobileNav client bileşenlerinde.
 */
export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "header" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tp = await getTranslations({ locale, namespace: "pages" });

  return (
    <HeaderBar>
      <Container className="relative flex h-full items-center gap-4 xl:gap-7">
        <Link
          href="/"
          aria-label={t("homeAria")}
          className="flex h-[34px] shrink-0 rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:h-10"
        >
          <Logo variant="header" alt="" aboveFold />
        </Link>

        <DesktopNav label={t("mainNav")} className="hidden flex-1 lg:block">
          {MAIN_NAV.map((item) =>
            item.type === "link" ? (
              <li key={item.id} className="flex h-full items-center">
                <NavLink href={PAGES[item.page].href} className={topItemClass}>
                  {tn(`top.${item.id}`)}
                </NavLink>
              </li>
            ) : (
              <DesktopNavMenu
                key={item.id}
                id={`menu-${item.id}`}
                label={tn(`top.${item.id}`)}
                mega={item.type === "mega"}
                hrefs={groupItemsHrefs(item)}
              >
                <DesktopPanel item={item} t={t} tn={tn} tp={tp} />
              </DesktopNavMenu>
            ),
          )}
        </DesktopNav>

        <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
          <a
            href={PANEL_LOGIN_URL}
            rel="nofollow noopener"
            className="flex h-11 items-center rounded-xl px-3.5 text-[15px] font-semibold text-foreground transition-colors group-data-[hero=true]/header:text-navy-foreground hover:text-primary group-data-[hero=true]/header:hover:text-navy-link focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {t("login")}
          </a>
          <Button asChild size="md">
            <Link href="/demo-talep">{t("demo")}</Link>
          </Button>
        </div>

        {/* Mobil: hamburger yanında kısa Demo butonu (mobil-ana-sayfa.html) */}
        <Button
          asChild
          className="ml-auto h-10 rounded-xl px-3.5 text-sm font-bold lg:hidden"
        >
          <Link href="/demo-talep">{t("demoShort")}</Link>
        </Button>
        <MobileNav
          className="lg:hidden"
          openLabel={t("openMenu")}
          closeLabel={t("closeMenu")}
          logo={
            <Link href="/" aria-label={t("homeAria")} className="flex h-[34px]">
              <Logo alt="" />
            </Link>
          }
          footer={
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-2.5">
                <div className="flex h-11 flex-1 items-center justify-center rounded-xl border border-border">
                  <LocaleSwitcher />
                </div>
                <div className="flex h-11 flex-1 items-center justify-center rounded-xl border border-border">
                  <ThemeToggle className="border-0" />
                </div>
              </div>
              <Button asChild variant="outline" size="md" className="h-12 rounded-[14px]">
                <a href={PANEL_LOGIN_URL} rel="nofollow noopener">
                  {t("login")}
                </a>
              </Button>
              <Button asChild size="md" className="h-12 rounded-[14px]">
                <Link href="/demo-talep">{t("demo")}</Link>
              </Button>
            </div>
          }
        >
          <MobileMenuContent t={t} tn={tn} tp={tp} label={t("mobileNav")} />
        </MobileNav>
      </Container>
    </HeaderBar>
  );
}

/* ------------------------------------------------------------------ */
/* Masaüstü paneller                                                   */
/* ------------------------------------------------------------------ */

const panelClass =
  "flex overflow-hidden rounded-[22px] border border-border bg-popover text-popover-foreground shadow-menu";

const allLinkClass =
  "inline-flex items-center gap-1.5 rounded text-[15px] font-bold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:text-accent";

const itemClass =
  "rounded-xl transition-colors hover:bg-surface focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-[current=page]:bg-surface";

function pageLabel(tp: T, id: PageId, preferShort: boolean) {
  const key = `${id}.short` as const;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return preferShort && tp.has(key as any) ? tp(key as any) : tp(`${id}.label` as any);
}

function GroupLabel({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="px-2.5 pb-2 text-xs font-bold tracking-[0.08em] text-primary uppercase dark:text-accent"
    >
      {children}
    </p>
  );
}

function PanelGroup({ group, tn, tp }: { group: NavGroup; tn: T; tp: T }) {
  const labelId = `nav-group-${group.id}`;
  const showLabel = group.showLabel !== false;

  return (
    <div className="flex flex-col">
      {showLabel ? (
        <GroupLabel id={labelId}>{tn(`groups.${group.id}`)}</GroupLabel>
      ) : null}
      <ul
        aria-labelledby={showLabel ? labelId : undefined}
        className={cn(
          "flex flex-col gap-0.5",
          group.layout === "grid" && "grid grid-cols-2 gap-0.5",
        )}
      >
        {group.items.map(({ id, icon: Icon }) => (
          <li key={id}>
            {group.layout === "grid" ? (
              <NavLink
                href={PAGES[id].href}
                className={cn(itemClass, "block p-2.5 text-[15px] font-semibold")}
              >
                {pageLabel(tp, id, true)}
              </NavLink>
            ) : (
              <NavLink
                href={PAGES[id].href}
                className={cn(itemClass, "flex gap-3 px-2.5 py-2")}
              >
                {Icon ? (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-info text-info-foreground">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                ) : null}
                <span className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-bold">
                    {pageLabel(tp, id, false)}
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    {tp(`${id}.description`)}
                  </span>
                </span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DesktopPanel({
  item,
  t,
  tn,
  tp,
}: {
  item: Extract<NavItem, { groups: NavGroup[] }>;
  t: T;
  tn: T;
  tp: T;
}) {
  if (item.id === "products") {
    return (
      // Kısa ekranlarda panel ekrana sığar, link alanı kendi içinde kaydırılır
      <div className={cn(panelClass, "max-h-[calc(100dvh-var(--header-h)-1.5rem)]")}>
        <div className="grid flex-1 grid-cols-3 gap-x-6 gap-y-5 overflow-y-auto overscroll-contain p-6">
          {item.groups.map((group) => (
            <PanelGroup key={group.id} group={group} tn={tn} tp={tp} />
          ))}
          <div className="flex items-end p-2.5">
            <Link href="/urunler" className={allLinkClass}>
              {t("allProducts")}
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <aside className="hidden w-[300px] shrink-0 flex-col gap-3.5 overflow-hidden bg-promo px-[26px] pt-7 xl:flex">
          <span className="self-start rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
            {t("promo.badge")}
          </span>
          <p className="text-2xl leading-tight font-extrabold text-navy-foreground">
            {t("promo.title")}
            <br />
            <span className="text-accent">{t("promo.titleAccent")}</span>
          </p>
          <StoreBadges tone="solid" />
          <Link
            href="/urunler/mobil-uygulama"
            className="mt-auto block h-[220px] w-[170px] self-center overflow-hidden rounded-t-[30px] bg-phone-frame px-1.5 pt-1.5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <Image
              src={phoneHome}
              alt={t("promo.imageAlt")}
              sizes="160px"
              className="h-auto w-full rounded-t-3xl"
            />
          </Link>
        </aside>
      </div>
    );
  }

  return (
    <div
      className={cn(
        panelClass,
        item.id === "solutions" && "w-[900px]",
        item.id === "resources" && "w-[640px]",
        item.id === "corporate" && "w-[640px]",
      )}
    >
      <div
        className={cn(
          "grid flex-1 gap-6",
          item.groups.length > 1 ? "p-7" : "p-6",
          item.id === "solutions" && "grid-cols-[0.85fr_1.15fr]",
          item.id === "resources" && "grid-cols-[1fr_1.3fr]",
        )}
      >
        {item.groups.map((group) => (
          <PanelGroup key={group.id} group={group} tn={tn} tp={tp} />
        ))}
        {item.id === "solutions" ? (
          <div className="col-span-2 px-2.5">
            <Link href="/cozumler" className={allLinkClass}>
              {t("allSolutions")}
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </Link>
          </div>
        ) : null}
      </div>

      {item.id === "solutions" ? (
        <aside className="flex w-[250px] shrink-0 flex-col gap-3 bg-navy p-7 px-6">
          <p className="text-xl leading-tight font-extrabold text-navy-foreground">
            {t("solutionsAside.title")}{" "}
            <span className="text-accent">{t("solutionsAside.titleAccent")}</span>
          </p>
          <Button asChild size="md" className="mt-auto w-full text-sm">
            <Link href="/demo-talep">{t("demo")}</Link>
          </Button>
        </aside>
      ) : null}

      {item.id === "corporate" ? (
        <aside className="flex w-[240px] shrink-0 flex-col gap-3 bg-navy p-6 text-sm text-navy-muted">
          <p className="text-xs font-bold tracking-[0.08em] text-accent uppercase">
            {t("corporateAside.title")}
          </p>
          <ContactLines />
          <Button asChild size="md" className="mt-auto w-full text-sm">
            <Link href="/iletisim">{t("corporateAside.form")}</Link>
          </Button>
        </aside>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobil menü içeriği (mobil-menu.html)                                */
/* ------------------------------------------------------------------ */

function MobileMenuContent({ t, tn, tp, label }: { t: T; tn: T; tp: T; label: string }) {
  const rowClass = "border-b border-border py-3.5";
  const topClass = "text-[17px] font-bold";

  return (
    <nav aria-label={label} className="flex flex-col px-4 py-1">
      {MAIN_NAV.map((item) =>
        item.type === "link" ? (
          <NavLink
            key={item.id}
            href={PAGES[item.page].href}
            className={cn(rowClass, topClass, "block aria-[current=page]:text-primary")}
          >
            {tn(`top.${item.id}`)}
          </NavLink>
        ) : (
          <details key={item.id} className={cn(rowClass, "group")}>
            <summary
              className={cn(
                topClass,
                "flex cursor-pointer list-none items-center justify-between rounded group-open:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&::-webkit-details-marker]:hidden",
              )}
            >
              {tn(`top.${item.id}`)}
              <ChevronDown
                className="size-5 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="flex flex-col gap-3.5 pt-3">
              {item.groups.map((group) => (
                <div key={group.id} className="flex flex-col gap-0.5">
                  {group.showLabel !== false ? (
                    <p className="text-xs font-bold tracking-[0.06em] text-muted-foreground uppercase">
                      {tn(`groups.${group.id}`)}
                    </p>
                  ) : null}
                  <ul className="flex flex-col">
                    {group.items.map(({ id }) => (
                      <li key={id}>
                        <NavLink
                          href={PAGES[id].href}
                          className="flex min-h-10 items-center text-[15px] aria-[current=page]:font-semibold aria-[current=page]:text-primary"
                        >
                          {pageLabel(tp, id, false)}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {item.id === "products" || item.id === "solutions" ? (
                <Link
                  href={item.id === "products" ? "/urunler" : "/cozumler"}
                  className="text-sm font-bold text-primary dark:text-accent"
                >
                  {t(item.id === "products" ? "allProductsShort" : "allSolutionsShort")}
                </Link>
              ) : null}
            </div>
          </details>
        ),
      )}
    </nav>
  );
}
