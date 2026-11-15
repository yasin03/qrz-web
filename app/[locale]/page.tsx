import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";

// Faz 1: boş ana sayfa. Gövde Faz 3'te 4.4'e göre kurulur.
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("home");

  return (
    <main id="icerik" className="flex flex-1 items-center">
      <Container className="flex flex-col items-start gap-6 py-24">
        <h1 className="text-4xl font-extrabold md:text-6xl">{t("title")}</h1>
        <p className="max-w-xl text-lg text-muted-foreground">{t("description")}</p>
        <div className="flex flex-wrap items-center gap-4">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </Container>
    </main>
  );
}
