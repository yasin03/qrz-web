import { Archive, Trash2 } from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { DeleteAccountForm } from "@/components/forms/delete-account-form";
import { FormMessages } from "@/components/forms/form-messages";
import { LEGAL_ENTITY } from "@/config/legal";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/hesap-silme">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "deleteAccount");
}

const linkClass =
  "font-semibold text-primary underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:text-accent";

/**
 * Hesap Silme (mağaza zorunluluğu): süreç, silinecek / saklanacak veriler, form.
 * Talep kvkk adresine (config/legal.ts → LEGAL_ENTITY.kvkkEmail) e-postayla gider.
 */
export default async function DeleteAccountPage({
  params,
}: PageProps<"/[locale]/hesap-silme">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("deleteAccountPage");
  const email = LEGAL_ENTITY.kvkkEmail;

  const lists = [
    { key: "deleted", icon: Trash2 },
    { key: "retained", icon: Archive },
  ] as const;

  return (
    <>
      <PageHeader id="deleteAccount" locale={locale} />
      <section
        aria-labelledby="hesap-silme-sureci"
        className="py-14 pb-16 md:py-20 md:pb-28"
      >
        <Container className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-14">
          <div className="flex min-w-0 flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2
                id="hesap-silme-sureci"
                className="text-[26px] leading-tight font-extrabold md:text-[32px]"
              >
                {t("process.title")}
              </h2>
              {(t.raw("process.paragraphs") as string[]).map((p) => (
                <p
                  key={p}
                  className="text-[15px] leading-relaxed text-muted-foreground md:text-base"
                >
                  {p}
                </p>
              ))}
            </div>
            {lists.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="flex flex-col gap-3 rounded-[20px] border border-border p-6 dark:bg-surface"
              >
                <h3 className="flex items-center gap-2.5 text-lg font-bold">
                  <Icon
                    className="size-5 text-primary dark:text-accent"
                    aria-hidden="true"
                  />
                  {t(`${key}.title`)}
                </h3>
                <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[15px] leading-relaxed">
                  {(t.raw(`${key}.items`) as string[]).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {key === "retained" ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("retained.note")}
                  </p>
                ) : null}
              </div>
            ))}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t.rich("more", {
                privacy: (chunks) => (
                  <Link href="/yasal/gizlilik-politikasi" className={linkClass}>
                    {chunks}
                  </Link>
                ),
                email: () => (
                  <a href={`mailto:${email}`} className={linkClass}>
                    {email}
                  </a>
                ),
              })}
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <h2 className="text-xl font-bold">{t("form.title")}</h2>
            <FormMessages>
              <DeleteAccountForm />
            </FormMessages>
          </div>
        </Container>
      </section>
    </>
  );
}
