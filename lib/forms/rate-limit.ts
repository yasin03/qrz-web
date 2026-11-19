// Basit bellek içi rate limit (tek pm2 instance varsayımı). Çoklu instance'ta Redis vb. gerekir.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

/** true: izin verildi. Aynı anahtar (form + IP) için 10 dakikada en fazla 5 gönderim. */
export function rateLimit(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);

  // Bellek büyümesin: ara sıra eski kayıtları temizle
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return true;
}

export function resetRateLimit() {
  hits.clear();
}
