# QR Zaman – Özellik Listesi

> Kaynak: `qrz-admin` (web paneli) ve `qrz-mobile` (iOS/Android) kod tabanı.

---

# 1. WEB PANELİ (app.qrzaman.com.tr)

## Genel Platform
- **Modüler yapı:** Bordro Yönetimi ve CRM modülleri, üst menüden tek tıkla modül geçişi
- **Rol bazlı erişim:** Admin, Yönetici, Personel, Bayi, Destek kullanıcı tipleri; her rol yalnızca yetkili olduğu menüyü görür
- **Çok şirketli / çok şubeli yapı:** Grup → Şirket → Şube → Bölüm hiyerarşisi; üst bardan Grup / Şirket / Şube ve **Dönem (Yıl/Ay)** seçimi
- **Rol bazlı ana sayfa (Dashboard):**
  - *Yönetici:* aktif personel, bugün gelenler, bugün izinde olanlar, onay bekleyen talepler, bordro özeti, yaklaşan doğum günleri, cinsiyet ve personel grubu dağılım grafikleri
  - *Personel:* bugünkü giriş/çıkış, son bordro (maaşı gizle/göster), kalan yıllık izin, sonraki izin, bu yılki avans/eklenti/kesinti toplamları, çalışma süresi, doğum günü
- **Her tabloda ortak yetenekler:** arama, gelişmiş filtreler, kolon göster/gizle, toplu seçim ve toplu işlemler
- **Dışa aktarma:** Listeler ve raporlar **Excel (xlsx), PDF ve Word (docx)** olarak; kurumsal başlıklı belge çıktısı
- **Açık / koyu tema**
- **Header takvimi:** resmî tatil ve arifeleri hızlıca görme
- Yasal metinler (KVKK / gizlilik) ve **hesap silme talebi** sayfası

## Personel Yönetimi
- Personel listesi (sicil no, TC kimlik no veya ad soyad ile arama)
- Kapsamlı personel kartı: kimlik, iletişim/adres, eğitim, sağlık (kan grubu, boy, kilo), banka (IBAN, şube), ücret ve sözleşme bilgileri
- SGK ve bordro parametreleri: SGK durumu, belge türü, kanun no, sigorta kolu, meslek kodu, görev kodu, teşvik oranı, BES, sendika, dayanışma, engellilik/sakatlık indirimi, eski hükümlü, az çalışma, kümülatif vergi/SGK matrahı, devreden matrah, asgari ücret istisnası
- Ücret tipleri: aylık / günlük / saatlik, net veya brüt, farklı para birimleri
- Hafta tatili günü, vardiyalı çalışma, personel grubu tanımı
- **SGK giriş / çıkış işlemleri** (çıkış nedeni kodlarıyla)
- **Excel ile toplu personel içe aktarma** (hazır şablon indirme, satır bazlı sonuç raporu)
- Personel kullanıcı ayarları: mobil giriş için telefon ve şifre belirleme
- **Cihaz eşleştirme / telefon aktivasyonunu sıfırlama** (personel tek cihazla eşleşir)
- Filtreler: şube, bölüm, durum, çalışma durumu, cinsiyet, medeni durum, ücret tipi, personel grubu

## Lokasyon & QR Kod
- Bölümlere bağlı giriş-çıkış noktaları (lokasyon) tanımlama, enlem/boylam ile
- Her lokasyon için **QR kod üretme**, PNG olarak indirme
- **A4 basılabilir QR afişi (PDF)** – duvara asmaya hazır
- Lokasyon aktif/pasif yönetimi

## PDKS (Personel Devam Kontrol Sistemi)
- Tüm personelin giriş/çıkış kayıtları; bölüm ve tarih aralığı filtreleri
- Kayıt detayında saat, lokasyon ve **okutulan konumun enlem/boylamı**
- Saat düzeltme / kayıt temizleme
- **Vardiya tanımları:** şube ve bölüm bazında; gece vardiyası, mola süresi, hafta tatili, toplam çalışma/mola/mesai süresi otomatik hesap
- **PDKS → Puantaja aktarım** (günlük / aylık)
- Personel için "PDKS Kayıtlarım" görünümü (yetkiye bağlı)

## Puantaj
- Aylık **puantaj çizelgesi** (tüm personel × günler)
- Gün tipleri: iş günü, hafta tatili, genel tatil, yıllık izin, mazeret, doğum, evlilik, cenaze izni vb.
- Toolbar ile hızlı gün işaretleme; **toplu puantaj girişi** (çoklu personel, tüm takvim seçimi)
- Personel puantaj detayı: günlük puantaj, ay özeti, diğer toplamlar
- **Mesai çizelgesi:** günlük mesai ve mesai toplamları, şube/bölüm/ay filtresi
- Personel için "Puantajım" takvim görünümü (yetkiye bağlı)

## Bordro
- **Otomatik bordro hesaplama:** tümünü veya seçilenleri hesaplama, hesabı temizleme
- Bordro onaylama / onayı kaldırma
- Hesaplanan kalemler: brüt/net ücret, gün ve saat ödemeleri, mesailer (normal, gece, resmî tatil, TİS mesaileri), yol/yemek, yardımlar (aile, çocuk, evlilik, askerlik, kreş, bayram vb.), SGK ve işsizlik primleri, gelir vergisi, damga vergisi, asgari ücret istisnaları, sendika ve BES kesintileri, avans kesintisi, **toplam işveren maliyeti**, net ödenen
- Personel bazlı **bordro raporu** (bakiyesi olmayan alanları gizleme, görünüm filtresi)
- **Bordro log kayıtları** (işlem geçmişi)
- Personel için "Bordrom" görünümü (yetkiye bağlı)

## Eklenti, Kesinti & Mesai Parametreleri
- **Eklenti:** prim, ikramiye vb. ek ödemeler (net/brüt, ödeme tarihi)
- **Kesinti:** disiplin, hasar, fazla ödeme, eğitim, kreş vb.
- **Mesai:** gün/saat veya tutar bazlı, net/brüt
- Tek kayıtta **birden fazla personele** toplu ekleme

## İzin Yönetimi
- İzin kaydı ekleme (çoklu personel, tarih aralığı, izin tipi)
- **İzin talep akışı:** personel talep eder → yönetici onaylar / gerekçeli reddeder
- Talep detayında otomatik hesaplanan izin bakiyesi: kıdem yılı, toplam hak, bu yıl/geçmiş yıl kullanılan, kalan izin
- Saatlik izin, izin adresi, mesaj ve **dosya eki** (rapor vb.)
- Tüm izinler / tüm talepler sekmeleri

## Avans Yönetimi
- Avans tanımlama: tutar, **taksit sayısı**, aylık ödeme tutarı, ödeme başlangıç tarihi
- **Avans talep akışı:** personel talep eder → yönetici onaylar / gerekçeli reddeder
- Durum takibi: bekliyor / onaylandı / reddedildi
- Taksitlerin bordroya otomatik kesinti olarak yansıması

## Özlük
- Personel özlük dosyası: kimlik, eğitim, sağlık, banka, bordro parametreleri, çalışma bilgileri
- "Boş alanları göster" seçeneği, hızlı personel seçici
- Personel kendi özlük bilgilerini görür

## Belgeler
- Hazır İK belge şablonları: belirli/belirsiz süreli iş sözleşmesi, işe alım formu, iş başvuru formu, iş teklif formu, işe davet yazısı, ücretli izin istek formu, yıllık ücretli izin cetveli, aylık puantaj cetveli, aile yardım bildirimi, işe gelmeme / geç gelme tutanakları, noter tebligatı, vergi indirimi taahhütnamesi, özlük dosyası kontrol listesi vb.
- Belge arama ve tek tıkla indirme

## Raporlar
- **PDKS raporu:** geç giriş yapanlar, geç çıkanlar, devamsızlık yapanlar, mesai yapanlar; normal/mesai/izin/toplam süre
- **İzin raporları:** genel izin kullanımları, yıllık toplam izin kullanımları (hak, kullanılan, kalan, kıdem)
- **Avans raporu:** bordro kesinti tutarı, kesinti tarihi, evrak no
- **Bordro raporu**
- Tüm raporlar Excel / PDF / Word çıktısı

## Ayarlar (Şirket Düzeyi)
- Şirket bilgileri
- **Personel yetki ayarları:** personel kendi PDKS / puantaj / bordrosunu görebilsin mi, her lokasyondan giriş-çıkış yapabilsin mi
- Tanımlamalar: personel grupları, ödeme katsayıları (SGK / vergi / damga uygulanması, muafiyetler, sendikalı/sendikasız ödeme, min-maks değer)

## Kurumsal Yönetim
- Grup, şirket, şube ve bölüm yönetimi (aktif/pasif)
- Şirket/şube kartı: vergi dairesi ve no, MERSİS, ticaret sicil, İŞKUR, işyeri SGK sicil no, faaliyet kodu, açılış/kapanış tarihleri, mülkiyet türü, il/ilçe
- Bölüm kartı: lokasyon, sorumlu ve çalışma saati bilgileri
- **Kullanıcı yönetimi:** kullanıcı ekleme, son giriş takibi, **grup / şirket / şube bazlı yetki alanları**

## Sistem Parametreleri (Yasal Mevzuat)
- SGK & bordro parametreleri, **yıl bazında**:
  - Vergi dilimleri / oranları
  - Katsayı oranları
  - Kıdem & ihbar tanımları
  - Engelli indirim oranları
  - İzin limitleri
  - Meslek kodları
  - Resmî tatiller
- **Sonraki yıla aktar:** parametreleri tek tıkla yeni yıla kopyalama
- Muhasebe parametreleri
- Personel tahakkuk parametreleri

## Takvim
- Yıl / ay / hafta görünümleri
- Resmî tatiller, arife (yarım gün) ve özel günler (dini bayramlar için tahmini tarih gösterimi)

## Yardım & Destek
- Panel içinden **destek talebi** oluşturma (konu, öncelik, şirket, dosya eki)
- Talep bazlı **canlı mesajlaşma** (emoji, dosya gönderme/indirme, gönderildi/okundu bilgisi)
- Açık / kapalı / okunmamış talep sayaçları, talebi kapatma / yeniden açma

## Profil
- Profil bilgilerini güncelleme, şifre değiştirme

---

## CRM Modülü – Müşteri İşleri Yönetimi
> Satış ekipleri ve iş ortakları (bayiler) için.
- **CRM Dashboard:** satış ve müşteri özet göstergeleri
- **Kişiler:** müşteri ve potansiyel müşteri kartları, iletişim bilgileri
- **Satışlar:** satış fırsatları ve satış süreci takibi
- **Teklifler:** teklif hazırlama ve takibi
- **Görevler:** ekip görevleri ve hatırlatmalar
- **Raporlar:** satış ve performans raporları
- **Ayarlar:** CRM'e özel tanımlamalar

---

# 2. MOBİL UYGULAMA (iOS & Android – "QR Zaman")

## QR ile Giriş-Çıkış (PDKS)
- Lokasyondaki **QR kodu okutarak** giriş veya çıkış kaydı
- Giriş / Çıkış yön seçimi
- Okutma anında **telefon konumu** alınır ve kayda eklenir (doğruluk bilgisiyle)
- **Sahte konum (fake GPS) tespiti** – sahte konumla kayıt engellenir
- Konum kapalıysa kullanıcıyı ayarlara yönlendirme
- **Cihaz kimliği ile eşleştirme** – hesap başka telefondan kullanılamaz
- Mükerrer kayıt kontrolü (ör. aynı gün ikinci giriş uyarısı)
- Kamera görüntüsü kaydedilmez (gizlilik)

## Ana Sayfa
- Kişiselleştirilmiş karşılama
- **Bugünkü giriş/çıkış kartı:** giriş saati, çıkış saati, durum, anlık mesai süresi
- Personel dashboard'u: son bordro (maaş gizle/göster), kalan izin, sonraki izin, avans/eklenti/kesinti özetleri
- Yönetici dashboard'u: aktif personel, bugün gelenler, bugün izinde olanlar, onay bekleyen talepler, yaklaşan doğum günleri

## İzinler
- Mobilden **izin talebi** oluşturma (tip, tarih aralığı, adres, mesaj)
- Talep ekranında anlık izin bakiyesi: kıdem yılı, toplam hak, kullanılan, kalan
- Taleplerim listesi ve durum takibi, red gerekçesi görüntüleme
- Yönetici: talepleri mobilden onaylama / reddetme

## Avanslar
- Mobilden **avans talebi** (tutar, taksit sayısı, aylık ödeme, başlangıç tarihi)
- Talep durumu: bekliyor / onaylandı / reddedildi
- Yönetici: talepleri mobilden onaylama / reddetme

## Bordro, Puantaj & PDKS Görüntüleme
- **Bordrom:** detaylı bordro dökümü; yönetici için personel bordro listesi
- **Puantaj:** aylık takvim görünümü, puantaj kod açıklamaları, ay özeti (çalışılan gün/saat, fazla mesai, izinler, tatiller); yönetici için personel puantaj listesi
- **PDKS Kayıtlarım:** aylık hareket listesi, günlük normal / mesai / izin / toplam süre
- Görünürlük şirketin yetki ayarlarına bağlı

## Eklenti & Kesinti
- Eklenti ve kesinti kayıtlarını listeleme, filtreleme
- Yetkili kullanıcı için mobilden ekleme

## Özlük
- Özlük bilgilerim; yönetici için personel özlük listesi ve detayları

## Lokasyon Yönetimi (Yönetici)
- Bölüm seçerek lokasyonları listeleme
- **Bulunduğun noktanın konumunu tek dokunuşla kaydetme** – QR noktası kurulumunu sahada yapma
- Lokasyon düzenleme, aktif/pasif

## Profil
- Personel bilgileri, adres bilgileri, bordro bilgileri, çalışma (giriş/çıkış) bilgileri, cihaz bilgileri
- Gizlilik politikası & KVKK, **hesap silme talebi**
- Açık / koyu tema
- Güvenli oturum (şifreli cihaz depolama), kullanıcı adı veya telefon numarasıyla giriş
