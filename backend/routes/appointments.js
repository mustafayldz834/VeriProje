const express = require('express');
const router = express.Router();
const { executeQuery, executeProcedure, executeTransaction } = require('../config/database');

// Randevu oluştur
router.post('/', async (req, res) => {
  try {
    const { 
      patientId, 
      therapistId, 
      treatmentTypeId,
      appointmentDate, 
      appointmentTime, 
      duration,
      problem,
      notes
    } = req.body;

    if (!patientId || !therapistId || !treatmentTypeId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'Gerekli alanlar eksik' });
    }

    // Önce PatientID'yi UserID'den al (eğer patientId UserID ise)
    let actualPatientId = patientId;
    
    // Eğer patientId bir UserID ise, PatientID'yi bul
    const patientCheckQuery = `
      SELECT PatientID FROM Patients WHERE UserID = @patientId OR PatientID = @patientId
    `;
    const patientResult = await executeQuery(patientCheckQuery, { patientId });
    
    if (patientResult.length > 0) {
      actualPatientId = patientResult[0].PatientID;
    } else {
      // Eğer PatientID bulunamazsa, UserID'den Patient oluştur veya hata ver
      return res.status(400).json({ message: 'Geçersiz hasta ID' });
    }

    // Stored procedure kullan
    const result = await executeProcedure('sp_CreateAppointment', {
      PatientID: actualPatientId,
      TherapistID: parseInt(therapistId),
      TreatmentTypeID: treatmentTypeId,
      AppointmentDate: appointmentDate,
      AppointmentTime: appointmentTime,
      Duration: duration || 60,
      Problem: problem || null,
      Notes: notes || null
    });

    // Stored procedure sonucunu kontrol et
    // Stored procedure bir recordset döner, AppointmentID'yi al
    let appointmentId;
    if (result && result.length > 0) {
      appointmentId = result[0].AppointmentID;
    } else if (result && result.AppointmentID) {
      appointmentId = result.AppointmentID;
    } else {
      // Eğer stored procedure ID dönmediyse, son eklenen ID'yi al
      const lastIdQuery = 'SELECT SCOPE_IDENTITY() AS AppointmentID';
      const lastIdResult = await executeQuery(lastIdQuery);
      appointmentId = lastIdResult[0]?.AppointmentID;
    }
    
    if (!appointmentId) {
      return res.status(500).json({ message: 'Randevu oluşturuldu ancak ID alınamadı' });
    }
    
    // Randevu detayını getir
    const query = `
      SELECT * FROM vw_AppointmentDetails 
      WHERE AppointmentID = @appointmentId
    `;
    const appointments = await executeQuery(query, { appointmentId });

    res.status(201).json({ 
      message: 'Randevu başarıyla oluşturuldu',
      data: appointments[0]
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Randevu oluşturulamadı', error: error.message });
  }
});

// Kullanıcının randevularını getir
router.get('/my-appointments', async (req, res) => {
  try {
    const userId = req.query.userId;
    const role = req.query.role;

    if (!userId || !role) {
      return res.status(400).json({ message: 'Kullanıcı bilgisi gerekli' });
    }

    let query;
    if (role === 'patient') {
      query = `
        SELECT a.* FROM vw_AppointmentDetails a
        INNER JOIN Patients p ON a.PatientID = p.PatientID
        WHERE p.UserID = @userId
        ORDER BY a.AppointmentDate DESC, a.AppointmentTime DESC
      `;
    } else if (role === 'therapist') {
      query = `
        SELECT a.* FROM vw_AppointmentDetails a
        INNER JOIN Therapists t ON a.TherapistID = t.TherapistID
        WHERE t.UserID = @userId
        ORDER BY a.AppointmentDate DESC, a.AppointmentTime DESC
      `;
    } else {
      return res.status(400).json({ message: 'Geçersiz rol' });
    }

    const appointments = await executeQuery(query, { userId });
    res.json({ data: appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Randevular yüklenemedi', error: error.message });
  }
});

// Randevu detayı
router.get('/:id', async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const query = `
      SELECT * FROM vw_AppointmentDetails 
      WHERE AppointmentID = @appointmentId
    `;
    const appointments = await executeQuery(query, { appointmentId });

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Randevu bulunamadı' });
    }

    res.json({ data: appointments[0] });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Randevu yüklenemedi', error: error.message });
  }
});

// Randevu durumu güncelle
router.put('/:id/status', async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { status, ...otherUpdates } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Durum bilgisi gerekli' });
    }

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Geçersiz durum' });
    }

    let updateFields = ['Status = @status', 'UpdatedAt = GETDATE()'];
    const parameters = { appointmentId, status };

    if (otherUpdates.problem) {
      updateFields.push('Problem = @problem');
      parameters.problem = otherUpdates.problem;
    }
    if (otherUpdates.notes) {
      updateFields.push('Notes = @notes');
      parameters.notes = otherUpdates.notes;
    }
    if (otherUpdates.duration) {
      updateFields.push('Duration = @duration');
      parameters.duration = otherUpdates.duration;
    }

    const query = `
      UPDATE Appointments
      SET ${updateFields.join(', ')}
      OUTPUT INSERTED.*
      WHERE AppointmentID = @appointmentId
    `;

    const updated = await executeQuery(query, parameters);

    if (updated.length === 0) {
      return res.status(404).json({ message: 'Randevu bulunamadı' });
    }

    res.json({ 
      message: 'Randevu güncellendi',
      data: updated[0]
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Randevu güncellenemedi', error: error.message });
  }
});

// Randevu sil
router.delete('/:id', async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const query = `
      DELETE FROM Appointments
      OUTPUT DELETED.AppointmentID
      WHERE AppointmentID = @appointmentId AND Status = 'pending'
    `;

    const deleted = await executeQuery(query, { appointmentId });

    if (deleted.length === 0) {
      return res.status(404).json({ message: 'Randevu bulunamadı veya silinemez' });
    }

    res.json({ message: 'Randevu silindi' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: 'Randevu silinemedi', error: error.message });
  }
});

module.exports = router;
