import { getTranslations } from "next-intl/server";

/** Sayfanın en başında "İçeriğe geç" linki (3.2/4). Odaklanınca görünür. */
export async function SkipLink() {
  const t = await getTranslations("header");
  return (
    <a
      href="#icerik"
      className="sr-only rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {t("skipLink")}
    </a>
  );
}
