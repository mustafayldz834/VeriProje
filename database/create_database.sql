-- =============================================
-- VERİPROJE - FİZYOTERAPİ RANDEVU SİSTEMİ
-- SQL SERVER VERİTABANI OLUŞTURMA SCRIPTİ
-- =============================================

-- Veritabanı oluştur
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'VeriProjeDB')
BEGIN
    CREATE DATABASE VeriProjeDB;
END
GO

USE VeriProjeDB;
GO

-- =============================================
-- TABLO OLUŞTURMA
-- =============================================

-- 1. USERS Tablosu (Kullanıcılar)
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20),
    Role NVARCHAR(20) NOT NULL CHECK (Role IN ('patient', 'therapist', 'admin')),
    Avatar NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 2. PATIENTS Tablosu (Hastalar)
CREATE TABLE Patients (
    PatientID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL UNIQUE,
    DateOfBirth DATE,
    Gender NVARCHAR(10) CHECK (Gender IN ('Erkek', 'Kadın', 'Diğer')),
    Address NVARCHAR(500),
    BloodType NVARCHAR(5),
    EmergencyContactName NVARCHAR(200),
    EmergencyContactPhone NVARCHAR(20),
    MedicalHistory NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
GO

-- 3. THERAPISTS Tablosu (Terapistler)
CREATE TABLE Therapists (
    TherapistID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL UNIQUE,
    LicenseNumber NVARCHAR(50) UNIQUE,
    ExperienceYears INT,
    Bio NVARCHAR(MAX),
    ConsultationFee DECIMAL(10,2),
    IsAvailable BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
GO

-- 4. SPECIALIZATIONS Tablosu (Uzmanlık Alanları)
CREATE TABLE Specializations (
    SpecializationID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 5. THERAPIST_SPECIALIZATIONS Tablosu (Terapist-Uzmanlık İlişkisi)
CREATE TABLE TherapistSpecializations (
    TherapistSpecializationID INT PRIMARY KEY IDENTITY(1,1),
    TherapistID INT NOT NULL,
    SpecializationID INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (TherapistID) REFERENCES Therapists(TherapistID) ON DELETE CASCADE,
    FOREIGN KEY (SpecializationID) REFERENCES Specializations(SpecializationID) ON DELETE CASCADE,
    UNIQUE (TherapistID, SpecializationID)
);
GO

-- 6. TREATMENT_TYPES Tablosu (Tedavi Türleri)
CREATE TABLE TreatmentTypes (
    TreatmentTypeID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    Duration INT NOT NULL, -- Dakika cinsinden
    DefaultPrice DECIMAL(10,2),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 7. APPOINTMENTS Tablosu (Randevular)
CREATE TABLE Appointments (
    AppointmentID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT NOT NULL,
    TherapistID INT NOT NULL,
    TreatmentTypeID INT NOT NULL,
    AppointmentDate DATE NOT NULL,
    AppointmentTime TIME NOT NULL,
    Duration INT NOT NULL, -- Dakika cinsinden
    Status NVARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (Status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    Problem NVARCHAR(MAX), -- Hasta şikayeti
    Notes NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID) ON DELETE NO ACTION,
    FOREIGN KEY (TherapistID) REFERENCES Therapists(TherapistID) ON DELETE NO ACTION,
    FOREIGN KEY (TreatmentTypeID) REFERENCES TreatmentTypes(TreatmentTypeID) ON DELETE NO ACTION
);
GO

-- 8. SESSIONS Tablosu (Seanslar)
CREATE TABLE Sessions (
    SessionID INT PRIMARY KEY IDENTITY(1,1),
    AppointmentID INT NOT NULL,
    SessionDate DATETIME NOT NULL,
    SessionNotes NVARCHAR(MAX),
    ProgressNotes NVARCHAR(MAX),
    NextSessionRecommendations NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (AppointmentID) REFERENCES Appointments(AppointmentID) ON DELETE CASCADE
);
GO

-- 9. REVIEWS Tablosu (Yorumlar/Değerlendirmeler)
CREATE TABLE Reviews (
    ReviewID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT NOT NULL,
    TherapistID INT NOT NULL,
    AppointmentID INT,
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Comment NVARCHAR(MAX),
    IsApproved BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID) ON DELETE CASCADE,
    FOREIGN KEY (TherapistID) REFERENCES Therapists(TherapistID) ON DELETE CASCADE,
    FOREIGN KEY (AppointmentID) REFERENCES Appointments(AppointmentID) ON DELETE SET NULL
);
GO

-- 10. PAYMENTS Tablosu (Ödemeler)
CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    AppointmentID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    PaymentMethod NVARCHAR(50) CHECK (PaymentMethod IN ('cash', 'card', 'bank_transfer', 'online')),
    PaymentStatus NVARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (PaymentStatus IN ('pending', 'completed', 'failed', 'refunded')),
    PaymentDate DATETIME,
    TransactionID NVARCHAR(100),
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (AppointmentID) REFERENCES Appointments(AppointmentID) ON DELETE NO ACTION
);
GO

-- 11. NOTIFICATIONS Tablosu (Bildirimler)
CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    Type NVARCHAR(50) CHECK (Type IN ('info', 'success', 'warning', 'error')),
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
GO

-- 12. SCHEDULE_SLOTS Tablosu (Takvim Slotları)
CREATE TABLE ScheduleSlots (
    ScheduleSlotID INT PRIMARY KEY IDENTITY(1,1),
    TherapistID INT NOT NULL,
    DayOfWeek INT NOT NULL CHECK (DayOfWeek >= 1 AND DayOfWeek <= 7), -- 1=Pazartesi, 7=Pazar
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    IsAvailable BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (TherapistID) REFERENCES Therapists(TherapistID) ON DELETE CASCADE
);
GO

-- =============================================
-- İNDEKSLER (INDEXES)
-- =============================================

-- Users tablosu
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_Role ON Users(Role);

-- Appointments tablosu
CREATE INDEX IX_Appointments_PatientID ON Appointments(PatientID);
CREATE INDEX IX_Appointments_TherapistID ON Appointments(TherapistID);
CREATE INDEX IX_Appointments_Date ON Appointments(AppointmentDate);
CREATE INDEX IX_Appointments_Status ON Appointments(Status);

-- Reviews tablosu
CREATE INDEX IX_Reviews_TherapistID ON Reviews(TherapistID);
CREATE INDEX IX_Reviews_Rating ON Reviews(Rating);

-- Notifications tablosu
CREATE INDEX IX_Notifications_UserID ON Notifications(UserID);
CREATE INDEX IX_Notifications_IsRead ON Notifications(IsRead);

-- =============================================
-- VARSayılan VERİLER (SEED DATA)
-- =============================================

-- Uzmanlık Alanları
INSERT INTO Specializations (Name, Description) VALUES
('Manuel Terapi', 'Manuel terapi teknikleri ile tedavi'),
('Egzersiz Terapisi', 'Fiziksel egzersiz programları'),
('Elektroterapi', 'Elektriksel akımlarla tedavi'),
('Hidroterapi', 'Su ile yapılan terapiler'),
('Masaj Terapisi', 'Çeşitli masaj teknikleri'),
('Rehabilitasyon', 'Fiziksel rehabilitasyon programları'),
('Spor Fizyoterapisi', 'Spor yaralanmaları ve rehabilitasyonu'),
('Pediatrik Fizyoterapi', 'Çocuklara yönelik fizyoterapi');

-- Tedavi Türleri
INSERT INTO TreatmentTypes (Name, Code, Description, Duration, DefaultPrice) VALUES
('Manuel Terapi', 'manual_therapy', 'Manuel terapi teknikleri ile tedavi', 60, 500.00),
('Egzersiz Terapisi', 'exercise_therapy', 'Fiziksel egzersiz programları', 45, 400.00),
('Elektroterapi', 'electrotherapy', 'Elektriksel akımlarla tedavi', 30, 300.00),
('Hidroterapi', 'hydrotherapy', 'Su ile yapılan terapiler', 60, 600.00),
('Masaj', 'massage', 'Çeşitli masaj teknikleri', 45, 350.00),
('Rehabilitasyon', 'rehabilitation', 'Fiziksel rehabilitasyon programları', 60, 550.00),
('Spor Fizyoterapisi', 'sports_physio', 'Spor yaralanmaları ve rehabilitasyonu', 45, 450.00);

GO

-- =============================================
-- STORED PROCEDURES
-- =============================================

-- Randevu oluşturma stored procedure
CREATE PROCEDURE sp_CreateAppointment
    @PatientID INT,
    @TherapistID INT,
    @TreatmentTypeID INT,
    @AppointmentDate DATE,
    @AppointmentTime TIME,
    @Duration INT,
    @Problem NVARCHAR(MAX),
    @Notes NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        INSERT INTO Appointments (
            PatientID, TherapistID, TreatmentTypeID,
            AppointmentDate, AppointmentTime, Duration,
            Problem, Notes, Status
        )
        VALUES (
            @PatientID, @TherapistID, @TreatmentTypeID,
            @AppointmentDate, @AppointmentTime, @Duration,
            @Problem, @Notes, 'pending'
        );
        
        DECLARE @AppointmentID INT = SCOPE_IDENTITY();
        
        -- Bildirim oluştur
        DECLARE @PatientUserID INT = (SELECT UserID FROM Patients WHERE PatientID = @PatientID);
        DECLARE @TherapistUserID INT = (SELECT UserID FROM Therapists WHERE TherapistID = @TherapistID);
        
        INSERT INTO Notifications (UserID, Title, Message, Type)
        VALUES (@PatientUserID, 'Yeni Randevu', 'Randevunuz başarıyla oluşturuldu', 'success');
        
        INSERT INTO Notifications (UserID, Title, Message, Type)
        VALUES (@TherapistUserID, 'Yeni Randevu', 'Yeni bir randevu talebi aldınız', 'info');
        
        COMMIT TRANSACTION;
        
        SELECT @AppointmentID AS AppointmentID;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- =============================================
-- VIEWS
-- =============================================

-- Randevu detay görünümü
CREATE VIEW vw_AppointmentDetails AS
SELECT 
    a.AppointmentID,
    a.AppointmentDate,
    a.AppointmentTime,
    a.Duration,
    a.Status,
    a.Problem,
    a.Notes,
    p.PatientID,
    u1.FirstName + ' ' + u1.LastName AS PatientName,
    u1.Email AS PatientEmail,
    u1.Phone AS PatientPhone,
    t.TherapistID,
    u2.FirstName + ' ' + u2.LastName AS TherapistName,
    u2.Email AS TherapistEmail,
    u2.Phone AS TherapistPhone,
    tt.Name AS TreatmentTypeName,
    tt.Code AS TreatmentTypeCode
FROM Appointments a
INNER JOIN Patients p ON a.PatientID = p.PatientID
INNER JOIN Users u1 ON p.UserID = u1.UserID
INNER JOIN Therapists t ON a.TherapistID = t.TherapistID
INNER JOIN Users u2 ON t.UserID = u2.UserID
INNER JOIN TreatmentTypes tt ON a.TreatmentTypeID = tt.TreatmentTypeID;
GO

-- Terapist istatistikleri görünümü
CREATE VIEW vw_TherapistStats AS
SELECT 
    t.TherapistID,
    u.FirstName + ' ' + u.LastName AS TherapistName,
    COUNT(DISTINCT a.AppointmentID) AS TotalAppointments,
    COUNT(DISTINCT CASE WHEN a.Status = 'completed' THEN a.AppointmentID END) AS CompletedAppointments,
    COUNT(DISTINCT CASE WHEN a.Status = 'pending' THEN a.AppointmentID END) AS PendingAppointments,
    AVG(r.Rating) AS AverageRating,
    COUNT(DISTINCT r.ReviewID) AS TotalReviews
FROM Therapists t
INNER JOIN Users u ON t.UserID = u.UserID
LEFT JOIN Appointments a ON t.TherapistID = a.TherapistID
LEFT JOIN Reviews r ON t.TherapistID = r.TherapistID
GROUP BY t.TherapistID, u.FirstName, u.LastName;
GO

PRINT 'Veritabanı başarıyla oluşturuldu!';
GO

