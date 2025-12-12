# VERİTABANI KURULUM TALİMATI

## SQL Server Management Studio (SSMS) ile Kurulum

### Adım 1: SQL Server Management Studio'yu Açın
- SQL Server Management Studio (SSMS) uygulamasını başlatın
- SQL Server'a bağlanın (Windows Authentication veya SQL Server Authentication)

### Adım 2: Script'i Çalıştırın
1. SSMS'de **File → Open → File** menüsünden `create_database.sql` dosyasını seçin
2. Veya **New Query** penceresi açıp script içeriğini yapıştırın
3. **Execute** butonuna tıklayın (F5 tuşu)

### Adım 3: Başarı Kontrolü
Script başarıyla çalıştıktan sonra:
- **VeriProjeDB** veritabanı oluşturulmuş olmalı
- 12 tablo oluşturulmuş olmalı
- Varsayılan veriler (Specializations, TreatmentTypes) eklenmiş olmalı

---

## sqlcmd Komut Satırı ile Kurulum

### PowerShell'de Çalıştırma
```powershell
cd "C:\Users\HP\Desktop\veriproje\database"
sqlcmd -S localhost -E -i create_database.sql
```

**Not:** 
- `-S localhost`: SQL Server instance adı (gerekirse değiştirin)
- `-E`: Windows Authentication kullan
- `-U kullanici -P sifre`: SQL Server Authentication için kullanılır

---

## Veritabanı Bağlantı Bilgileri

Backend için `.env` dosyasında şu bilgileri kullanın:

```env
DB_SERVER=localhost
DB_DATABASE=VeriProjeDB
DB_USER=sa
DB_PASSWORD=sizin_sifreniz
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

---

## Oluşturulan Tablolar

1. **Users** - Kullanıcılar
2. **Patients** - Hastalar
3. **Therapists** - Terapistler
4. **Specializations** - Uzmanlık Alanları
5. **TherapistSpecializations** - Terapist-Uzmanlık İlişkisi
6. **TreatmentTypes** - Tedavi Türleri
7. **Appointments** - Randevular
8. **Sessions** - Seanslar
9. **Reviews** - Yorumlar
10. **Payments** - Ödemeler
11. **Notifications** - Bildirimler
12. **ScheduleSlots** - Takvim Slotları

---

## Hata Durumunda

Eğer script çalıştırılırken hata alırsanız:

1. **Veritabanı zaten varsa:** Script içinde `IF NOT EXISTS` kontrolü var, tekrar çalıştırabilirsiniz
2. **Tablo zaten varsa:** Önce mevcut tabloları silin veya `DROP DATABASE VeriProjeDB` komutunu çalıştırın
3. **Bağlantı hatası:** SQL Server'ın çalıştığından emin olun

---

## Veritabanını Sıfırlama

Eğer veritabanını baştan kurmak isterseniz:

```sql
USE master;
GO
DROP DATABASE IF EXISTS VeriProjeDB;
GO
-- Sonra create_database.sql script'ini tekrar çalıştırın
```

