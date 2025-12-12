const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { executeQuery, executeProcedure } = require('../config/database');

// Giriş (Login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre gerekli' });
    }

    const query = `
      SELECT u.UserID, u.Email, u.PasswordHash, u.FirstName, u.LastName, 
             u.Role, p.PatientID, t.TherapistID
      FROM Users u
      LEFT JOIN Patients p ON u.UserID = p.UserID
      LEFT JOIN Therapists t ON u.UserID = t.UserID
      WHERE u.Email = @email AND u.IsActive = 1
    `;

    const users = await executeQuery(query, { email });
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.PasswordHash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    // Şifreyi response'dan çıkar
    delete user.PasswordHash;

    res.json({
      message: 'Giriş başarılı',
      user: {
        id: user.UserID,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        role: user.Role,
        patientId: user.PatientID,
        therapistId: user.TherapistID
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Kayıt (Register)
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    // Email kontrolü
    const checkEmailQuery = 'SELECT UserID FROM Users WHERE Email = @email';
    const existingUsers = await executeQuery(checkEmailQuery, { email });
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Bu email zaten kullanılıyor' });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcı oluştur
    const insertUserQuery = `
      INSERT INTO Users (Email, PasswordHash, FirstName, LastName, Phone, Role)
      OUTPUT INSERTED.UserID, INSERTED.Email, INSERTED.FirstName, INSERTED.LastName, INSERTED.Role
      VALUES (@email, @passwordHash, @firstName, @lastName, @phone, @role)
    `;

    const newUsers = await executeQuery(insertUserQuery, {
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      role
    });

    const newUser = newUsers[0];
    let patientId = null;
    let therapistId = null;

    // Role göre ilgili tabloya ekle
    if (role === 'patient') {
      const insertPatientQuery = `
        INSERT INTO Patients (UserID)
        OUTPUT INSERTED.PatientID
        VALUES (@userId)
      `;
      const patients = await executeQuery(insertPatientQuery, { userId: newUser.UserID });
      patientId = patients[0].PatientID;
    } else if (role === 'therapist') {
      const insertTherapistQuery = `
        INSERT INTO Therapists (UserID)
        OUTPUT INSERTED.TherapistID
        VALUES (@userId)
      `;
      const therapists = await executeQuery(insertTherapistQuery, { userId: newUser.UserID });
      therapistId = therapists[0].TherapistID;
    }

    res.status(201).json({
      message: 'Kayıt başarılı',
      user: {
        id: newUser.UserID,
        email: newUser.Email,
        firstName: newUser.FirstName,
        lastName: newUser.LastName,
        role: newUser.Role,
        patientId,
        therapistId
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;
