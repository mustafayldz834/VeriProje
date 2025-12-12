# VERİPROJE - TABLO YAPILARI VE İLİŞKİLER

## TABLO LİSTESİ (12 Tablo)

### 1. USERS (Kullanıcılar)
| Sütun Adı | Veri Tipi | Açıklama | Kısıtlamalar |
|-----------|-----------|----------|--------------|
| UserID | INT | Birincil Anahtar | PRIMARY KEY, IDENTITY(1,1) |
| Email | NVARCHAR(255) | Email adresi | NOT NULL, UNIQUE |
| PasswordHash | NVARCHAR(255) | Hashlenmiş şifre | NOT NULL |
| FirstName | NVARCHAR(100) | Ad | NOT NULL |
| LastName | NVARCHAR(100) | Soyad | NOT NULL |
| Phone | NVARCHAR(20) | Telefon | NULL |
| Role | NVARCHAR(20) | Rol | NOT NULL, CHECK (patient, therapist, admin) |
| Avatar | NVARCHAR(500) | Avatar URL | NULL |
| IsActive | BIT | Aktif mi? | DEFAULT 1 |
| CreatedAt | DATETIME | Oluşturulma tarihi | DEFAULT GETDATE() |
| UpdatedAt | DATETIME | Güncellenme tarihi | DEFAULT GETDATE() |

**Birincil Anahtar:** UserID  
**İndeksler:** Email, Role

---

### 2. PATIENTS (Hastalar)
| Sütun Adı | Veri Tipi | Açıklama | Kısıtlamalar |
|-----------|-----------|----------|--------------|
| PatientID | INT | Birincil Anahtar | PRIMARY KEY, IDENTITY(1,1) |
| UserID | INT | Kullanıcı ID | NOT NULL, UNIQUE, FK → Users(UserID) |
| DateOfBirth | DATE | Doğum tarihi | NULL |
| Gender | NVARCHAR(10) | Cinsiyet | CHECK (Erkek, Kadın, Diğer) |
| Address | NVARCHAR(500) | Adres | NULL |
| BloodType | NVARCHAR(5) | Kan grubu | NULL |
| EmergencyContactName | NVARCHAR(200) | Acil durum kişisi | NULL |
| EmergencyContactPhone | NVARCHAR(20) | Acil durum telefonu | NULL |
| MedicalHistory | NVARCHAR(MAX) | Tıbbi geçmiş | NULL |
| CreatedAt | DATETIME | Oluşturulma tarihi | DEFAULT GETDATE() |
| UpdatedAt | DATETIME | Güncellenme tarihi | DEFAULT GETDATE() |

**Birincil Anahtar:** PatientID  
**Yabancı Anahtar:** UserID → Users(UserID) ON DELETE CASCADE

---

### 3. THERAPISTS (Terapistler)
| Sütun Adı | Veri Tipi | Açıklama | Kısıtlamalar |
|-----------|-----------|----------|--------------|
| TherapistID | INT | Birincil Anahtar | PRIMARY KEY, IDENTITY(1,1) |
| UserID | INT | Kullanıcı ID | NOT NULL, UNIQUE, FK → Users(UserID) |
| LicenseNumber | NVARCHAR(50) | Lisans numarası | UNIQUE |
| ExperienceYears | INT | Deneyim yılı | NULL |
| Bio | NVARCHAR(MAX) | Biyografi | NULL |
| ConsultationFee | DECIMAL(10,2) | Danışmanlık ücreti | NULL |
| IsAvailable | BIT | Müsait mi? | DEFAULT 1 |
| CreatedAt | DATETIME | Oluşturulma tarihi | DEFAULT GETDATE() |
| UpdatedAt | DATETIME | Güncellenme tarihi | DEFAULT GETDATE() |

**Birincil Anahtar:** TherapistID  
**Yabancı Anahtar:** UserID → Users(UserID) ON DELETE CASCADE

---

### 4. SPECIALIZATIONS (Uzmanlık Alanları)
| Sütun Adı | Veri Tipi | Açıklama | Kısıtlamalar |
|-----------|-----------|----------|--------------|
| SpecializationID | INT | Birincil Anahtar | PRIMARY KEY, IDENTITY(1,1) |
| Name | NVARCHAR(100) | Uzmanlık adı | NOT NULL, UNIQUE |
| Description | NVARCHAR(500) | Açıklama | NULL |
| CreatedAt | DATETIME | Oluşturulma tarihi | DEFAULT GETDATE() |

**Birincil Anahtar:** SpecializationID

---

### 5. THERAPIST_SPECIALIZATIONS (Terapist-Uzmanlık İlişkisi)
| Sütun Adı | Veri Tipi | Açıklama | Kısıtlamalar |
|-----------|-----------|----------|--------------|
| TherapistSpecializationID | INT | Birincil Anahtar | PRIMARY KEY, IDENTITY(1,1) |
| TherapistID | INT | Terapist ID | NOT NULL, FK → Therapists(TherapistID) |
| SpecializationID | INT | Uzmanlık ID | NOT NULL, FK → Specializations(SpecializationID) |
| CreatedAt | DATETIME | Oluşturulma tarihi | DEFAULT GETDATE() |

**Birincil Anahtar:** TherapistSpecializationID  
**Yabancı Anahtarlar:** 
- TherapistID → Therapists(TherapistID) ON DELETE CASCADE
- SpecializationID → Specializations(SpecializationID) ON DELETE CASCADE  
**Bileşik Benzersizlik:** UNIQUE (TherapistID, SpecializationID)

---

### 6. TREATMENT_TYPES (Tedavi Türleri)
| Sütun Adı | Veri Tipi | Açıklama | Kısıtlamalar |
|-----------|-----------|----------|--------------|
| TreatmentTypeID | INT | Birincil Anahtar | PRIMARY KEY, IDENTITY(1,1) |
| Name | NVARCHAR(100) | Tedavi adı | NOT NULL, UNIQUE |
| Code | NVARCHAR(50) | Tedavi kodu | NOT NULL, UNIQUE |
| Description | NVARCHAR(500) | Açıklama | NULL |
| Duration | INT | Süre (dakika) | NOT NULL |
| DefaultPrice | DECIMAL(10,2) | Varsayılan fiyat | NULL |
| IsActive | BIT | Aktif mi? | DEFAULT 1 |
| CreatedAt | DATETIME | Oluşturulma tarihi | DEFAULT GETDATE() |

**Birincil Anahtar:** TreatmentTypeID

---

### 7. APPOINTMENTS (Randevular)
| Sütun Adı | Veri Tipi | Açıklama | Kısıtlamalar |
|-----------|-----------|----------|--------------|
| AppointmentID | INT | Birincil Anahtar | PRIMARY KEY, IDENTITY(1,1) |
| PatientID | INT | Hasta ID | NOT NULL, FK → Patients(PatientID) |
| TherapistID | INT | Terapist ID | NOT NULL, FK → Therapists(TherapistID) |
| TreatmentTypeID | INT | Tedavi türü ID | NOT NULL, FK → TreatmentTypes(TreatmentTypeID) |
| AppointmentDate | DATE | Randevu tarihi | NOT NULL |
| AppointmentTime | TIME | Randevu saati | NOT NULL |
| Duration | INT | Süre (dakika) | NOT NULL |
| Status | NVARCHAR(20) | Durum | NOT NULL, DEFAULT 'pending', CHECK (pending, confirmed, completed, cancelled, no_show) |
| Problem | NVARCHAR(MAX) | Hasta şikayeti | NULL |
| Notes | NVARCHAR(MAX) | Notlar | NULL |
| CreatedAt | DATETIME | Oluşturulma tarihi | DEFAULT GETDATE() |
| UpdatedAt | DATETIME | Güncellenme tarihi | DEFAULT GETDATE() |

**Birincil Anahtar:** AppointmentID  
**Yabancı Anahtarlar:** 
- PatientID → Patients(PatientID) ON DELETE NO ACTION
- TherapistID → Therapists(TherapistID) ON DELETE NO ACTION
- TreatmentTypeID → TreatmentTypes(TreatmentTypeID) ON DELETE NO ACTION  
**İndeksler:** PatientID, TherapistID, AppointmentDate, Status

---

### 8. SESSIONS (Seanslar)
| Sütun Adı | Veri Tipi | Açıklama | Kısıtlamalar |
|-----------|-----------|----------|--------------|
| SessionID | INT | Birincil Anahtar | PRIMARY KEY, IDENTITY(1,1) |
| AppointmentID | INT | Randevu ID | NOT NULL, FK → Appointments(AppointmentID) |
| SessionDate | DATETIME | Seans tarihi | NOT NULL |
| SessionNotes | NVARCHAR(MAX) | Seans notları | NULL |
| ProgressNotes | NVARCHAR(MAX) | İlerleme notları | NULL |
| NextSessionRecommendations | NVARCHAR(MAX) | Sonraki seans önerileri | NULL |
| CreatedAt | DATETIME | Oluşturulma tarihi | DEFAULT GETDATE() |

**Birincil Anahtar:** SessionID  
**Yabancı Anahtar:** AppointmentID → Appointments(AppointmentID) ON DELETE CASCADE

---

### 9. REVIEWS (Yorumlar/Değerlendirmeler)
| Sütun Adı | Veri Tipi | Açıklama | Kısıtlamalar |
|-----------|-----------|----------|--------------|
| ReviewID | INT | Birincil Anahtar | PRIMARY KEY, IDENTITY(1,1) |
| PatientID | INT | Hasta ID | NOT NULL, FK → Patients(PatientID) |
| TherapistID | INT | Terapist ID | NOT NULL, FK → Therapists(TherapistID) |
| AppointmentID | INT | Randevu ID | NULL, FK → Appointments(AppointmentID) |
| Rating | INT | Puan (1-5) | NOT NULL, CHECK (1-5) |
| Comment | NVARCHAR(MAX) | Yorum | NULL |
| IsApproved | BIT | Onaylandı mı? | DEFAULT 0 |
| CreatedAt | DATETIME | Oluşturulma tarihi | DEFAULT GETDATE() |

**Birincil Anahtar:** ReviewID  
**Yabancı Anahtarlar:** 
- PatientID → Patients(PatientID) ON DELETE CASCADE
- TherapistID → Therapists(TherapistID) ON DELETE CASCADE
- AppointmentID → Appointments(AppointmentID) ON DELETE SET NULL  
**İndeksler:** TherapistID, Rating

---

### 10. PAYMENTS (Ödemeler)
| Sütun Adı | Veri Tipi | Açıklama | Kısıtlamalar |
|-----------|-----------|----------|--------------|
| PaymentID | INT | Birincil Anahtar | PRIMARY KEY, IDENTITY(1,1) |
| AppointmentID | INT | Randevu ID | NOT NULL, FK → Appointments(AppointmentID) |
| Amount | DECIMAL(10,2) | Tutar | NOT NULL |
| PaymentMethod | NVARCHAR(50) | Ödeme yöntemi | CHECK (cash, card, bank_transfer, online) |
| PaymentStatus | NVARCHAR(20) | Ödeme durumu | NOT NULL, DEFAULT 'pending', CHECK (pending, completed, failed, refunded) |
| PaymentDate | DATETIME | Ödeme tarihi | NULL |
| TransactionID | NVARCHAR(100) | İşlem ID | NULL |
| CreatedAt | DATETIME | Oluşturulma tarihi | DEFAULT GETDATE() |

**Birincil Anahtar:** PaymentID  
**Yabancı Anahtar:** AppointmentID → Appointments(AppointmentID) ON DELETE NO ACTION

---

### 11. NOTIFICATIONS (Bildirimler)
| Sütun Adı | Veri Tipi | Açıklama | Kısıtlamalar |
|-----------|-----------|----------|--------------|
| NotificationID | INT | Birincil Anahtar | PRIMARY KEY, IDENTITY(1,1) |
| UserID | INT | Kullanıcı ID | NOT NULL, FK → Users(UserID) |
| Title | NVARCHAR(200) | Başlık | NOT NULL |
| Message | NVARCHAR(MAX) | Mesaj | NOT NULL |
| Type | NVARCHAR(50) | Tip | CHECK (info, success, warning, error) |
| IsRead | BIT | Okundu mu? | DEFAULT 0 |
| CreatedAt | DATETIME | Oluşturulma tarihi | DEFAULT GETDATE() |

**Birincil Anahtar:** NotificationID  
**Yabancı Anahtar:** UserID → Users(UserID) ON DELETE CASCADE  
**İndeksler:** UserID, IsRead

---

### 12. SCHEDULE_SLOTS (Takvim Slotları)
| Sütun Adı | Veri Tipi | Açıklama | Kısıtlamalar |
|-----------|-----------|----------|--------------|
| ScheduleSlotID | INT | Birincil Anahtar | PRIMARY KEY, IDENTITY(1,1) |
| TherapistID | INT | Terapist ID | NOT NULL, FK → Therapists(TherapistID) |
| DayOfWeek | INT | Haftanın günü | NOT NULL, CHECK (1-7) |
| StartTime | TIME | Başlangıç saati | NOT NULL |
| EndTime | TIME | Bitiş saati | NOT NULL |
| IsAvailable | BIT | Müsait mi? | DEFAULT 1 |
| CreatedAt | DATETIME | Oluşturulma tarihi | DEFAULT GETDATE() |

**Birincil Anahtar:** ScheduleSlotID  
**Yabancı Anahtar:** TherapistID → Therapists(TherapistID) ON DELETE CASCADE

---

## İLİŞKİ ŞEMASI

```
Users (1) ──< (1) Patients
Users (1) ──< (1) Therapists
Therapists (N) ──< (N) TherapistSpecializations >── (N) Specializations
Patients (1) ──< (N) Appointments >── (N) Therapists
Appointments (N) ──< (1) TreatmentTypes
Appointments (1) ──< (N) Sessions
Appointments (1) ──< (N) Payments
Patients (1) ──< (N) Reviews >── (N) Therapists
Reviews (N) ──< (1) Appointments
Users (1) ──< (N) Notifications
Therapists (1) ──< (N) ScheduleSlots
```

## NORMALİZASYON AÇIKLAMALARI

✅ **1NF (Birinci Normal Form)**: Tüm tablolarda her alan atomik değer içerir  
✅ **2NF (İkinci Normal Form)**: Tüm tablolarda tam fonksiyonel bağımlılık sağlanmıştır  
✅ **3NF (Üçüncü Normal Form)**: Geçişli bağımlılıklar kaldırılmıştır (Specializations ayrı tablo)  
✅ **BCNF**: Anahtara bağlı tüm bağımlılıklar kontrol edilmiştir

