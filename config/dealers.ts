// Bayi listesi (4.7). Kodla yönetilir; gerçek liste gelene kadar boş (uydurma bayi yok).
// Yeni bayi eklenince: /bayiler/[il] sayfası, sitemap kaydı ve haritadaki boyama otomatik oluşur.

import { PROVINCES, type Province } from "./provinces";

export type Dealer = {
  id: string;
  /** Firma adı */
  name: string;
  /** Plaka kodu (1–81), config/provinces.ts ile eşleşir */
  provinceCode: number;
  /** İlçe */
  district?: string;
  /** Açık adres (bilinmiyorsa boş bırakılır, uydurulmaz) */
  address?: string;
  /** E.164 (+90...), ekranda formatlı gösterilir */
  phone: string;
  /** Ekranda gösterilen biçim (ör. "0272 212 15 05"); yoksa E.164 gösterilir */
  phoneDisplay?: string;
  /** Cep telefonu (E.164) */
  mobile?: string;
  mobileDisplay?: string;
  email?: string;
  website?: string;
  /** Google Maps linki */
  mapsUrl?: string;
  coordinates?: { lat: number; lng: number };
  /** Merkez / bölge müdürlüğü rozeti */
  isHeadquarters?: boolean;
  /** Hizmet verdiği diğer iller (haritada açık tonla boyanır) */
  servesProvinces?: number[];
};

// Kaynak: kullanıcının verdiği bayi kartları (2026-11-18). Bilinmeyen alanlar boş bırakıldı.
export const DEALERS: Dealer[] = [
  {
    id: "destekpark-afyonkarahisar",
    name: "Destekpark Bilişim",
    provinceCode: 3,
    district: "Merkez",
    address: "Kasımpaşa, Gazlıgöl Cd. 115/B, 03200",
    phone: "+902722121505",
    phoneDisplay: "0272 212 15 05",
    mobile: "+905555186025",
    mobileDisplay: "0555 518 60 25",
    email: "info@destekpark.com.tr",
  },
  {
    id: "ekin-enformasyon-kutahya",
    name: "Ekin Enformasyon Sistemleri",
    provinceCode: 43,
    district: "Merkez",
    // TODO: adres, cep telefonu ve e-posta bilinmiyor
    phone: "+902742741274",
    phoneDisplay: "0274 274 12 74",
  },
];

export function getDealersByProvince(code: number): Dealer[] {
  return DEALERS.filter((d) => d.provinceCode === code);
}

/** Bayisi olmayan ama bir bayinin hizmet verdiği iller */
export function getServingDealers(code: number): Dealer[] {
  return DEALERS.filter(
    (d) => d.provinceCode !== code && d.servesProvinces?.includes(code),
  );
}

/** Bayisi olan iller (yalnızca bunlar için /bayiler/[il] sayfası üretilir) */
export function getDealerProvinces(): Province[] {
  const codes = new Set(DEALERS.map((d) => d.provinceCode));
  return PROVINCES.filter((p) => codes.has(p.code));
}
