"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation, m } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Kaydırınca giriş efekti (4.5): 16px aşağıdan belirir. Sıralı kartlarda
 * `index` ile 60 ms arayla gelir. Yalnızca transform ve opacity (CLS yok).
 * Hareket azaltma açıksa veya JS kapalıysa içerik hemen görünür (globals.css → .qz-reveal).
 */
export function Reveal({
  children,
  index = 0,
  as = "div",
  className,
  labelledBy,
}: {
  children: ReactNode;
  /** Sıralı öğelerde sıra numarası (gecikme = index × 60 ms) */
  index?: number;
  as?: "div" | "li" | "article" | "section";
  className?: string;
  /** as="section" için başlık id'si (6.3: section aria-labelledby) */
  labelledBy?: string;
}) {
  const Component = m[as];
  return (
    <LazyMotion features={domAnimation} strict>
      <Component
        className={cn("qz-reveal", className)}
        aria-labelledby={labelledBy}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.06 }}
      >
        {children}
      </Component>
    </LazyMotion>
  );
}
