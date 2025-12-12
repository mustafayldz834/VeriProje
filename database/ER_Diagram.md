# VERİPROJE - FİZYOTERAPİ RANDEVU SİSTEMİ
## ER DİYAGRAMI VE VERİTABANI TASARIMI

### 1. ER DİYAGRAMI AÇIKLAMASI

#### VARLIKLAR (ENTITIES):

1. **Users** (Kullanıcılar)
   - Tüm sistem kullanıcılarını temsil eder
   - Hasta ve Terapist için ortak alanları içerir

2. **Patients** (Hastalar)
   - Users tablosundan türeyen hasta bilgileri

3. **Therapists** (Terapistler)
   - Users tablosundan türeyen terapist bilgileri

4. **Specializations** (Uzmanlık Alanları)
   - Terapistlerin uzmanlık alanları

5. **TherapistSpecializations** (Terapist-Uzmanlık İlişkisi)
   - Terapistlerin birden fazla uzmanlık alanı olabilir

6. **TreatmentTypes** (Tedavi Türleri)
   - Manuel Terapi, Egzersiz Terapisi vb.

7. **Appointments** (Randevular)
   - Hasta-Terapist randevu kayıtları

8. **Sessions** (Seanslar)
   - Randevuya ait seans kayıtları

9. **Reviews** (Yorumlar/Değerlendirmeler)
   - Hastaların terapistleri değerlendirmesi

10. **Payments** (Ödemeler)
    - Randevu ödeme kayıtları

11. **Notifications** (Bildirimler)
    - Sistem bildirimleri

12. **ScheduleSlots** (Takvim Slotları)
    - Terapistlerin müsait zamanları

### 2. İLİŞKİLER (RELATIONSHIPS):

- Users (1) → (N) Patients (Bir kullanıcı bir hasta olabilir)
- Users (1) → (N) Therapists (Bir kullanıcı bir terapist olabilir)
- Therapists (N) → (N) Specializations (Çoktan çoğa: TherapistSpecializations)
- Appointments (N) → (1) Patients
- Appointments (N) → (1) Therapists
- Appointments (N) → (1) TreatmentTypes
- Appointments (1) → (N) Sessions
- Reviews (N) → (1) Patients
- Reviews (N) → (1) Therapists
- Reviews (N) → (1) Appointments
- Payments (N) → (1) Appointments
- Notifications (N) → (1) Users
- ScheduleSlots (N) → (1) Therapists

### 3. NORMALİZASYON AÇIKLAMALARI:

- **1NF (Birinci Normal Form)**: Tüm tablolarda her alan atomik değer içerir
- **2NF (İkinci Normal Form)**: Tüm tablolarda tam fonksiyonel bağımlılık sağlanmıştır
- **3NF (Üçüncü Normal Form)**: Geçişli bağımlılıklar kaldırılmıştır (Specializations ayrı tablo)
- **BCNF**: Anahtara bağlı tüm bağımlılıklar kontrol edilmiştir

### 4. ANAHTAR TANIMLARI:

- **Birincil Anahtar (Primary Key)**: Her tabloda ID alanı
- **Yabancı Anahtar (Foreign Key)**: İlişkiler için FK tanımlamaları
- **Bileşik Anahtar**: TherapistSpecializations tablosunda (therapistId, specializationId)

