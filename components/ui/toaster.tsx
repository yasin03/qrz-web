"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

/** Form sonuç bildirimleri (sonner). Tema next-themes ile eşleşir. */
export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="top-center"
      richColors
      closeButton
      toastOptions={{ className: "font-sans" }}
    />
  );
}
