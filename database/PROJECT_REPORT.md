# VERİPROJE - PROJE TESLİM RAPORU

## 1. KAPAK SAYFASI

**Proje Başlığı:** Fizyoterapi Randevu Yönetim Sistemi (VeriProje)

**Ders Adı ve Kodu:** Veritabanı Yönetim Sistemleri - [DERS KODU]

**Bölüm:** Bilgisayar Mühendisliği / Yazılım Mühendisliği

**Öğrenci/Grup Bilgileri:**
- [Öğrenci Adı 1] - [Öğrenci No] - [Email] - [Telefon]
- [Öğrenci Adı 2] - [Öğrenci No] - [Email] - [Telefon] (varsa)

**Proje Çıktısını Kullanacak Kuruluş:**
- Kuruluş Adı: [Fizyoterapi Kliniği/Hastane Adı]
- İletişim: [Adres, Telefon]
- Kişi: [İletişim Kişisi Adı]

**Ders Öğretim Üyesi:**
- [Ünvan] [İsim]

**Ders Yardımcısı:**
- [Ünvan] [İsim]

---

## 2. PROJE SEÇİMİ BİLGİLERİ SAYFASI

### 2.1. Proje Fikrinin Çıkış Hususları

Modern sağlık sektöründe, fizyoterapi kliniklerinin randevu yönetimi geleneksel yöntemlerle (telefon, defter) yapılmaktadır. Bu yöntemler zaman kaybına, hatalara ve verimsizliğe neden olmaktadır. Projemiz, fizyoterapi klinikleri için dijital bir randevu yönetim sistemi geliştirmeyi amaçlamaktadır.

**Proje Fikrinin Hayata Geçirilmesi İçin İzlenen Yöntemler:**

1. **Gereksinim Analizi**: Fizyoterapi kliniklerinde gözlem yapıldı ve ihtiyaçlar tespit edildi
2. **Veri Modelleme**: ER diyagramı ile varlık-ilişki modeli oluşturuldu
3. **Veritabanı Tasarımı**: SQL Server ile normalizasyon kurallarına uygun 12 tablolu veritabanı tasarlandı
4. **Backend Geliştirme**: Node.js ve Express ile RESTful API geliştirildi
5. **Frontend Geliştirme**: Next.js ve Mantine UI ile modern web arayüzü oluşturuldu
6. **Test**: Sistemin farklı senaryolarda test edilmesi

### 2.2. Proje Çıktısının Kullanımı

**Kullanacak Kuruluş:** [Fizyoterapi Kliniği Adı]

**Kuruluş Tanıtımı:**
[Klinik hakkında bilgiler, çalışma konusu, faaliyetleri]

**Proje Çıktısının Kullanım Amacı:**
- Hasta randevu taleplerinin dijital ortamda alınması
- Terapistlerin müsait zamanlarının yönetilmesi
- Randevu geçmişinin dijital ortamda saklanması
- Hasta- Terapist iletişiminin kolaylaştırılması
- İstatistik ve raporlama imkanı

**Kullanım Yeri:**
- Web tabanlı sistem olarak tüm klinik personeli tarafından kullanılacak
- Hastalar online randevu alabilecek
- Terapistler randevularını yönetebilecek

### 2.3. Projenin Katkıları

**Sektöre Katkıları:**
- Fizyoterapi sektöründe dijitalleşme
- Randevu yönetiminde verimlilik artışı
- Hasta memnuniyetinin artması
- Klinik operasyonlarının optimize edilmesi

**Ülkeye Katkıları:**
- Sağlık sektöründe dijital dönüşüm
- E-sağlık uygulamalarının yaygınlaştırılması
- Teknoloji tabanlı çözümlerin geliştirilmesi

### 2.4. Önceki Sistemlere Göre Üstünlükleri

1. **Modern Teknoloji**: Next.js, React, SQL Server gibi güncel teknolojiler
2. **Responsive Tasarım**: Mobil ve masaüstü uyumlu arayüz
3. **Ölçeklenebilirlik**: Artan kullanıcı sayısına uyum sağlayabilir yapı
4. **Güvenlik**: Şifreleme, güvenli API yapısı
5. **Kullanıcı Dostu**: Modern ve sezgisel kullanıcı arayüzü
6. **Normalizasyon**: Veritabanı normalizasyon kurallarına tam uyum
7. **İlişkisel Yapı**: 12 tablo ile kapsamlı veri yönetimi

### 2.5. Fikri/Sınai Mülkiyet Hakları

Proje çıktısı açık kaynak kodlu bir sistem olarak geliştirilmiştir. Gelecekte patent başvurusu yapılabilir. Benzer sistemlere göre fizyoterapi sektörüne özel özelleştirmeler içermektedir.

### 2.6. Uygulama Alanı Görüşmesi

**Görüşülen Kişi/Firma:**
- Ad: [İsim]
- Firma: [Firma Adı]
- Adres: [Adres]
- Telefon: [Telefon]
- Email: [Email]

---

## 3. PROJE TASARIMI

### 3.1. ER DİYAGRAMI

**Varlıklar:**
- Users (Kullanıcılar)
- Patients (Hastalar)
- Therapists (Terapistler)
- Specializations (Uzmanlık Alanları)
- TreatmentTypes (Tedavi Türleri)
- Appointments (Randevular)
- Sessions (Seanslar)
- Reviews (Yorumlar)
- Payments (Ödemeler)
- Notifications (Bildirimler)
- ScheduleSlots (Takvim Slotları)
- TherapistSpecializations (Terapist-Uzmanlık İlişkisi)

**İlişkiler:**
- Users → Patients (1:1)
- Users → Therapists (1:1)
- Therapists ↔ Specializations (N:N) → TherapistSpecializations
- Patients → Appointments (1:N)
- Therapists → Appointments (1:N)
- Appointments → Sessions (1:N)
- Appointments → Payments (1:N)
- Patients → Reviews (1:N)
- Therapists → Reviews (1:N)
- Users → Notifications (1:N)
- Therapists → ScheduleSlots (1:N)

### 3.2. TABLO YAPILARI

Detaylı tablo yapıları için `database/TABLE_STRUCTURE.md` dosyasına bakınız.

**Toplam Tablo Sayısı:** 12 tablo (Minimum 8 tablo gereksinimini karşılamaktadır)

### 3.3. NORMALİZASYON

Tüm tablolar normalizasyon kurallarına uygundur:
- **1NF**: Atomik değerler
- **2NF**: Tam fonksiyonel bağımlılık
- **3NF**: Geçişli bağımlılık yok
- **BCNF**: Anahtar bağımlılıkları kontrol edildi

---

## 4. TEKNİK DETAYLAR

### 4.1. Kullanılan Teknolojiler

**Frontend:**
- Next.js 14
- React 18
- Mantine UI 7
- TypeScript (opsiyonel)

**Backend:**
- Node.js
- Express.js
- SQL Server (MSSQL)
- mssql paketi

**Veritabanı:**
- Microsoft SQL Server

### 4.2. Kurulum

1. SQL Server'ı kurun
2. `database/create_database.sql` scriptini çalıştırın
3. Backend: `cd backend && npm install && npm start`
4. Frontend: `npm install && npm run dev`

---

## 5. SONUÇ

Proje, fizyoterapi klinikleri için modern bir randevu yönetim sistemi sunmaktadır. Normalizasyon kurallarına uygun, ölçeklenebilir ve kullanıcı dostu bir sistem geliştirilmiştir.

