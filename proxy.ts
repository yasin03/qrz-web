// Next.js 16: "middleware" dosya kuralı "proxy" olarak yeniden adlandırıldı.
// next-intl'in locale yönlendirmesi burada çalışır.
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // api, Next iç yolları ve uzantılı dosyalar (görsel, sitemap.xml vb.) hariç
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
