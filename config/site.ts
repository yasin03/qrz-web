// Site genelindeki sabitler. Faz 2'de iletişim, sosyal ve mağaza bilgileriyle genişler.
// Bilinmeyen gerçek bilgiler uydurulmaz, TODO olarak bırakılır.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://qrzaman.com.tr"
).replace(/\/$/, "");

export const SITE_NAME = "QR Zaman";

export const PANEL_URL = "https://app.qrzaman.com.tr";
export const PANEL_LOGIN_URL = `${PANEL_URL}/login`;

export const STORE_LINKS = {
  appStore: "", // TODO: App Store linki
  googlePlay: "", // TODO: Google Play linki
} as const;
