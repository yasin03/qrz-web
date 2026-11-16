import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/** Sayfa sonu CTA bandı (urun-sayfasi.html): lacivert-mavi degrade, başlık + Demo Talep Et. */
export async function ProductCta({ id, title }: { id: string; title: ReactNode }) {
  const t = await getTranslations("productPage");

  return (
    <section aria-labelledby={id} className="pt-6 pb-16 md:pt-12 md:pb-28">
      <Container>
        <Reveal className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-cta px-6 py-10 md:rounded-[32px] md:px-12 md:py-14">
          <h2
            id={id}
            className="text-[28px] leading-[1.1] font-extrabold text-balance text-navy-foreground md:text-4xl"
          >
            {title}
          </h2>
          <Button asChild size="xl" variant="inverse" className="w-full sm:w-auto">
            <Link href="/demo-talep">
              {t("demo")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
