const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');

// Profil bilgisi getir
router.get('/me', async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    const query = `
      SELECT u.UserID, u.Email, u.FirstName, u.LastName, u.Phone, u.Role,
             p.PatientID, p.DateOfBirth, p.Gender, p.Address,
             t.TherapistID, t.LicenseNumber, t.ExperienceYears, t.Bio, t.ConsultationFee
      FROM Users u
      LEFT JOIN Patients p ON u.UserID = p.UserID
      LEFT JOIN Therapists t ON u.UserID = t.UserID
      WHERE u.UserID = @userId
    `;

    const users = await executeQuery(query, { userId });
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json({ data: users[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Terapist listesi
router.get('/therapists', async (req, res) => {
  try {
    const query = `
      SELECT t.TherapistID, u.FirstName, u.LastName, u.Email, u.Phone,
             t.LicenseNumber, t.ExperienceYears, t.Bio, t.ConsultationFee,
             u.FirstName + ' ' + u.LastName AS Name
      FROM Therapists t
      INNER JOIN Users u ON t.UserID = u.UserID
      WHERE t.IsAvailable = 1 AND u.IsActive = 1
    `;

    const therapists = await executeQuery(query);
    res.json({ data: therapists });
  } catch (error) {
    console.error('Get therapists error:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Profil güncelle
router.put('/me', async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { firstName, lastName, phone } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    const query = `
      UPDATE Users
      SET FirstName = @firstName,
          LastName = @lastName,
          Phone = @phone,
          UpdatedAt = GETDATE()
      OUTPUT INSERTED.UserID, INSERTED.FirstName, INSERTED.LastName, INSERTED.Phone
      WHERE UserID = @userId
    `;

    const updated = await executeQuery(query, {
      userId,
      firstName,
      lastName,
      phone: phone || null
    });

    res.json({ message: 'Profil güncellendi', data: updated[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;
