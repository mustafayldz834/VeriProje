# 🏥 VeriProje – Fizyoterapi Randevu Sistemi

VeriProje, fizyoterapi merkezleri için geliştirilmiş modern bir randevu yönetim sistemidir.

---

## 🚀 Özellikler

- 👤 Kullanıcı kayıt ve giriş sistemi  
- 🧑‍⚕️ Terapist listeleme ve görüntüleme  
- 📅 Randevu oluşturma  
- 🔄 Randevu yönetimi  
- 📊 Dashboard  
- 🎨 Responsive UI  

---

## 🛠️ Teknolojiler

**Frontend**
- Next.js
- React
- Mantine

**Backend**
- Node.js
- Express
- SQL Server

- ## 📂 Proje Yapısı

```bash
VeriProje/
│
├── app/              # Next.js sayfaları
├── components/       # UI bileşenleri
├── services/         # API servisleri (şu an mock veri içerir)
│
├── backend/          # Express backend
│   ├── routes/       # API route'ları
│   ├── config/       # Veritabanı bağlantısı
│   └── server.js     # Sunucu başlangıç noktası
│
├── db.js             # Alternatif veritabanı bağlantısı
└── package.json
