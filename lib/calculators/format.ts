// Sayı girişi ve para biçimi. Kullanıcı "1.234,56", "1234,56", "1,234.56" veya "1234.56"
// yazabilir: son ayıraçtan sonra 1–2 hane varsa o ondalık ayıracıdır, diğerleri binlik sayılır.

// Oran alanlarında (rate: true) tek ayıraç her zaman ondalıktır: "0,759" = 0,759.

export function parseNumber(raw: string, { rate = false } = {}): number {
  const value = raw.replace(/[\s₺%]/g, "");
  if (!value) return NaN;
  if (!/^-?[\d.,]+$/.test(value)) return NaN;
  if (rate && (value.match(/[.,]/g)?.length ?? 0) <= 1)
    return Number(value.replace(",", "."));
  const lastSep = Math.max(value.lastIndexOf(","), value.lastIndexOf("."));
  const decimals = lastSep >= 0 ? value.length - lastSep - 1 : 0;
  if (lastSep >= 0 && decimals > 0 && decimals <= 2) {
    const intPart = value.slice(0, lastSep).replace(/[.,]/g, "");
    return Number(`${intPart}.${value.slice(lastSep + 1)}`);
  }
  // Ondalık yok ya da 3+ hane: tüm ayıraçlar binliktir ("1.234" = 1234).
  // Tek ayıraç ve 3'ten fazla ondalık hane (oran: "0,7590") ise ondalık kabul et.
  const seps = value.match(/[.,]/g)?.length ?? 0;
  if (seps === 1 && decimals > 3) return Number(value.replace(",", "."));
  return Number(value.replace(/[.,]/g, ""));
}

const numberLocale = (locale: string) => (locale === "tr" ? "tr-TR" : "en-US");

export function formatMoney(value: number, locale: string) {
  return new Intl.NumberFormat(numberLocale(locale), {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, locale: string, maxFractionDigits = 2) {
  return new Intl.NumberFormat(numberLocale(locale), {
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

/** Forma varsayılan değer olarak yazılacak metin (null → boş alan). */
export function defaultText(value: number | null | undefined, locale: string) {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat(numberLocale(locale), {
    maximumFractionDigits: 6,
    useGrouping: false,
  }).format(value);
}
