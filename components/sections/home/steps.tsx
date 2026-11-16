import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { richTags } from "./parts";

/** 7. Nasıl çalışır: "Okut. Kaydet. Bordro hazır." 4 adım. */
export async function Steps() {
  const t = await getTranslations("home.steps");
  const items = t.raw("items") as { title: string; text: string }[];

  return (
    <section aria-labelledby="nasil-calisir" className="py-12 md:py-28">
      <Container className="flex flex-col gap-3 md:gap-11">
        <Reveal className="flex flex-col gap-3 md:items-center md:text-center">
          <h2
            id="nasil-calisir"
            className="mb-1.5 text-[30px] leading-[1.1] font-extrabold text-balance md:mb-0 md:text-5xl md:leading-[1.06]"
          >
            {t.rich("title", richTags())}
          </h2>
          <p className="hidden text-lg text-muted-foreground md:block">
            {t("description")}
          </p>
        </Reveal>
        <ol className="grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] md:gap-4">
          {items.map((item, index) => {
            const last = index === items.length - 1;
            return (
              <Reveal
                key={item.title}
                as="li"
                index={index}
                className={cn(
                  "flex gap-3.5 rounded-2xl border p-4 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none md:flex-col md:gap-2.5 md:rounded-[20px] md:p-7",
                  last
                    ? "border-transparent bg-navy text-navy-foreground"
                    : "border-border bg-background dark:bg-surface",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "text-[22px] leading-none font-extrabold md:text-[40px]",
                    last ? "text-accent" : "text-primary dark:text-accent",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1 md:gap-2.5">
                  <h3 className="text-base font-bold md:text-[19px]">{item.title}</h3>
                  <p
                    className={cn(
                      "text-sm leading-relaxed md:text-[15px]",
                      last ? "text-navy-muted" : "text-muted-foreground",
                    )}
                  >
                    {item.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
