import { getOgEntries, hrefFromSegments, ogPathSegments, renderOgImage } from "@/lib/og";

// Sayfa başına paylaşım görseli (6.2): /og/<dil>/<iç yol>.png, ör. /og/en/urunler/bordro.png.
// Tümü build sırasında üretilir; listede olmayan yol 404 döner.
// Adres buildMetadata → ogImagePath() ile her sayfanın og:image / twitter:image alanına yazılır.

export const dynamicParams = false;

export async function generateStaticParams() {
  const entries = await getOgEntries();
  return entries.map((entry) => ({
    locale: entry.locale,
    path: ogPathSegments(entry.href),
  }));
}

export async function GET(_request: Request, { params }: RouteContext<"/og/[locale]/[...path]">) {
  const { locale, path } = await params;
  const href = hrefFromSegments(path);
  const entry = (await getOgEntries()).find((e) => e.locale === locale && e.href === href);
  if (!entry) return new Response("Not found", { status: 404 });
  return renderOgImage(entry);
}
