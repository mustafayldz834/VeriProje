# VERIPROJE BACKEND API

SQL Server tabanlı backend API servisi.

## Kurulum

### 1. Bağımlılıkları Yükle
```bash
npm install
```

### 2. .env Dosyası Oluştur
`.env.example` dosyasını kopyalayıp `.env` olarak kaydedin ve SQL Server bilgilerinizi girin:

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

### 3. Veritabanını Oluştur
`../database/create_database.sql` script'ini SQL Server'da çalıştırın.

### 4. Server'ı Başlat
```bash
npm start
```

veya development mode:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Giriş
- `POST /api/auth/register` - Kayıt

### Users
- `GET /api/users/me` - Profil bilgisi
- `GET /api/users/therapists` - Terapist listesi
- `PUT /api/users/me` - Profil güncelle

### Appointments
- `POST /api/appointments` - Randevu oluştur
- `GET /api/appointments/my-appointments` - Randevularımı getir
- `GET /api/appointments/:id` - Randevu detayı
- `PUT /api/appointments/:id/status` - Randevu durumu güncelle
- `DELETE /api/appointments/:id` - Randevu sil

### Health Check
- `GET /health` - Server ve veritabanı durumu

## Test

Health check endpoint'i ile test edin:
```bash
curl http://localhost:4000/health
```

