import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { Pill, h2Class, leadClass } from "./parts";

/**
 * 5. Özellik bölümü: metin + görsel, sırayla yer değiştirir (reverse).
 * panel: açık mavi yuvarlak kutu içinde (Lokasyon & QR, İzin & Avans).
 * Mobilde metin üstte, görsel altta.
 */
export function FeatureSplit({
  id,
  eyebrow,
  title,
  description,
  children,
  visual,
  reverse = false,
  panel = false,
  alignVisualEnd = false,
  className,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  /** Başlık ve açıklamanın altındaki içerik (madde listesi, link vb.) */
  children?: ReactNode;
  visual: ReactNode;
  /** true ise masaüstünde görsel solda */
  reverse?: boolean;
  panel?: boolean;
  /** Görsel kutunun altına yaslanır (panel içinde alttan taşan afiş) */
  alignVisualEnd?: boolean;
  className?: string;
}) {
  const grid = (
    <div
      className={cn(
        "grid gap-8 lg:gap-16",
        alignVisualEnd ? "lg:items-end" : "lg:items-center",
        reverse ? "lg:grid-cols-[1.6fr_1fr]" : "lg:grid-cols-[1fr_1.6fr]",
        panel && "lg:gap-14",
      )}
    >
      <Reveal
        className={cn(
          "flex min-w-0 flex-col gap-3.5 md:gap-5",
          panel && alignVisualEnd && "lg:pb-16",
        )}
      >
        <Pill>{eyebrow}</Pill>
        <h2 id={id} className={h2Class}>
          {title}
        </h2>
        <p className={leadClass}>{description}</p>
        {children}
      </Reveal>
      <Reveal index={1} className={cn("min-w-0", reverse && "lg:order-first")}>
        {visual}
      </Reveal>
    </div>
  );

  return (
    <section aria-labelledby={id} className={cn("py-8 md:py-14", className)}>
      <Container>
        {panel ? (
          <div
            className={cn(
              "overflow-hidden rounded-3xl bg-surface px-5 pt-7 md:rounded-[32px] md:px-14 md:pt-16",
              alignVisualEnd ? "pb-0" : "pb-7 md:pb-16",
            )}
          >
            {grid}
          </div>
        ) : (
          grid
        )}
      </Container>
    </section>
  );
}
