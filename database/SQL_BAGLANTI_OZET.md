# SQL SERVER BAĞLANTI ÖZET REHBER

## Hızlı Başlangıç

### 1. Veritabanını Oluştur
SQL Server Management Studio'da `create_database.sql` dosyasını çalıştırın.

### 2. Backend .env Dosyası
`backend` klasöründe `.env` dosyası oluşturun:

```env
DB_SERVER=localhost
DB_DATABASE=VeriProjeDB
DB_USER=sa
DB_PASSWORD=YourPassword123
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
PORT=4000
```

### 3. Backend'i Başlat
```bash
cd backend
npm install
npm start
```

### 4. Test Et
Browser'da: `http://localhost:4000/health`

---

## Oluşturulan Dosyalar

### Backend
- ✅ `backend/config/database.js` - SQL Server bağlantı yapılandırması
- ✅ `backend/routes/auth.js` - Kimlik doğrulama endpoint'leri
- ✅ `backend/routes/users.js` - Kullanıcı endpoint'leri  
- ✅ `backend/routes/appointments.js` - Randevu endpoint'leri
- ✅ `backend/server.js` - Express server
- ✅ `backend/package.json` - Bağımlılıklar

### Frontend API
- ✅ `services/api_backend.js` - Backend API servisi (SQL Server için)

### Veritabanı
- ✅ `database/create_database.sql` - Veritabanı oluşturma script'i
- ✅ `database/KURULUM_TALIMATI.md` - Detaylı kurulum talimatları
- ✅ `database/SQL_SERVER_BAGLANTI.md` - Bağlantı rehberi

---

## Önemli Notlar

1. **Veritabanı Adı:** `VeriProjeDB` (değiştirmeyin)
2. **Port:** Backend 4000 portunda çalışır
3. **Frontend:** Şu anda mock API kullanıyor, backend'e geçmek için `api.js` yerine `api_backend.js` kullanın

---

## Sorun Giderme

**SQL Server bağlantı hatası:**
- SQL Server'ın çalıştığını kontrol edin
- `.env` dosyasındaki bilgileri kontrol edin
- Firewall ayarlarını kontrol edin (Port 1433)

**Veritabanı bulunamadı:**
- `create_database.sql` script'ini çalıştırdığınızdan emin olun

**Tablolar bulunamadı:**
- Script'in tamamının çalıştığından emin olun
- `USE VeriProjeDB;` komutunun çalıştığını kontrol edin

