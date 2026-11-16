"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * Site içi menü linki: gerçek <a href> (next-intl Link) + aktif sayfada aria-current="page".
 * Stil için `aria-[current=page]:` varyantı kullanılır.
 */
export function NavLink({ href, ...props }: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const active = typeof href === "string" && pathname === href;

  return <Link href={href} aria-current={active ? "page" : undefined} {...props} />;
}
