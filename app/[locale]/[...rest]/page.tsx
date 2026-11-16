import { notFound } from "next/navigation";

// Eşleşmeyen her adres [locale]/not-found.tsx'e düşer (404 kodu + noindex).
export default function CatchAllPage() {
  notFound();
}
