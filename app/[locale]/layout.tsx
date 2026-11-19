import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteSchema } from "@/components/seo/site-schema";
import { Toaster } from "@/components/ui/toaster";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { robotsFor } from "@/lib/seo";
import "../globals.css";

// Inter: tek font, Türkçe karakterler için latin-ext, build sırasında self-host edilir.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("defaultTitle"), template: `%s | ${SITE_NAME}` },
    description: t("defaultDescription"),
    applicationName: SITE_NAME,
    robots: robotsFor(),
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050e1f" },
  ],
};

/** İstemciye yalnızca client bileşenlerinin kullandığı metinler gönderilir. */
const CLIENT_NAMESPACES = ["theme", "locale"] as const;

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Statik üretim (SSG) için locale'i istek önbelleğine yaz
  setRequestLocale(locale);

  const messages = await getMessages();
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]),
  );

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        {/* JS kapalıyken kaydırma efektli içerik gizli kalmasın */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              "<style>.qz-reveal{opacity:1!important;transform:none!important}</style>",
          }}
        />
        <ThemeProvider>
          <NextIntlClientProvider messages={clientMessages}>
            <SkipLink />
            <Header locale={locale} />
            <main id="icerik" tabIndex={-1} className="flex flex-1 flex-col outline-none">
              {children}
            </main>
            <Footer locale={locale} />
            <SiteSchema locale={locale} />
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
