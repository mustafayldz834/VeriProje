# SQL SERVER BAĞLANTI REHBERİ

## 1. SQL Server Kurulumu ve Veritabanı Oluşturma

### Adım 1: SQL Server Management Studio (SSMS) Kurulumu
1. SQL Server Management Studio'yu açın
2. SQL Server'a bağlanın (Windows Authentication veya SQL Server Authentication)

### Adım 2: Veritabanını Oluşturma
1. SSMS'de **New Query** penceresi açın
2. `database/create_database.sql` dosyasının içeriğini kopyalayıp yapıştırın
3. **Execute** butonuna tıklayın (F5)
4. "Veritabanı başarıyla oluşturuldu!" mesajını görmelisiniz

### Adım 3: Bağlantı Bilgilerini Kontrol Edin
- **Server Name:** localhost (veya SQL Server instance adınız)
- **Database Name:** VeriProjeDB
- **Authentication:** Windows Authentication veya SQL Server Authentication

---

## 2. Backend .env Dosyası Ayarları

`backend` klasöründe `.env` dosyası oluşturun:

```env
# SQL Server Veritabanı Bağlantı Bilgileri
DB_SERVER=localhost
DB_DATABASE=VeriProjeDB
DB_USER=sa
DB_PASSWORD=YourPassword123
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

# Server Port
PORT=4000

# JWT Secret
JWT_SECRET=your-secret-key-here-change-in-production

# Environment
NODE_ENV=development
```

**ÖNEMLİ:** `.env` dosyasındaki bilgileri kendi SQL Server ayarlarınıza göre düzenleyin!

---

## 3. Backend Bağımlılıklarını Kurma

```bash
cd backend
npm install
```

---

## 4. Backend Server'ı Başlatma

```bash
cd backend
npm start
```

veya development mode için:

```bash
npm run dev
```

Başarılı bağlantı mesajı:
```
Server is running on port 4000
SQL Server bağlantısı başarılı!
Database connection established
```

---

## 5. Veritabanı Bağlantı Testi

Browser'da veya Postman'de şu URL'yi test edin:
```
GET http://localhost:4000/health
```

Başarılı response:
```json
{
  "status": "OK",
  "database": "connected",
  "timestamp": "2025-12-09T..."
}
```

---

## 6. Frontend'i Backend'e Bağlama

### Seçenek 1: Mock API Kullanmaya Devam (Geliştirme için)
`services/api.js` dosyasını kullanmaya devam edin (şu anki durum)

### Seçenek 2: Backend API'ye Bağlan (Production için)
`app/appointments/page.js` ve diğer sayfalarda:

```javascript
// ÖNCE (Mock API):
import { appointmentAPI } from '@/services/api';

// SONRA (Backend API):
import { appointmentAPI } from '@/services/api_backend';
```

---

## 7. Sorun Giderme

### Hata: "Cannot connect to SQL Server"
- SQL Server'ın çalıştığından emin olun
- SQL Server Browser servisinin çalıştığını kontrol edin
- Firewall ayarlarını kontrol edin (Port 1433)

### Hata: "Login failed for user"
- `.env` dosyasındaki kullanıcı adı ve şifreyi kontrol edin
- SQL Server'da "SQL Server and Windows Authentication mode" aktif mi kontrol edin

### Hata: "Database 'VeriProjeDB' does not exist"
- `database/create_database.sql` script'ini çalıştırdığınızdan emin olun
- Veritabanı adının doğru olduğunu kontrol edin

### Hata: "Invalid object name 'Users'"
- Tabloların oluşturulduğunu kontrol edin
- `USE VeriProjeDB;` komutunun çalıştığını kontrol edin

---

## 8. SQL Server Bağlantı Türleri

### Windows Authentication (Önerilen - Local Development)
```env
DB_USER=
DB_PASSWORD=
```
veya
```env
DB_USER=your-windows-username
```

### SQL Server Authentication
```env
DB_USER=sa
DB_PASSWORD=YourPassword123
```

---

## 9. Azure SQL Database Bağlantısı

Azure SQL Database kullanıyorsanız:

```env
DB_SERVER=your-server.database.windows.net
DB_DATABASE=VeriProjeDB
DB_USER=your-username@your-server
DB_PASSWORD=your-password
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false
```

---

## 10. Bağlantı Test Komutu

Backend klasöründe test script'i çalıştırın:

```bash
node -e "require('dotenv').config(); const db = require('./config/database'); db.getPool().then(() => { console.log('Bağlantı başarılı!'); process.exit(0); }).catch(err => { console.error('Bağlantı hatası:', err); process.exit(1); });"
```

