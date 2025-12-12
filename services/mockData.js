// Mock data for frontend development
export const mockUsers = [
  {
    id: 1,
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet@example.com',
    password: '123456',
    phone: '0555 123 45 67',
    role: 'patient',
    avatar: null,
    bio: 'Fizyoterapi almak istiyorum',
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    firstName: 'Dr. Ayşe',
    lastName: 'Kaya',
    email: 'ayse@example.com',
    password: '123456',
    phone: '0555 234 56 78',
    role: 'therapist',
    specialization: 'Manuel Terapi',
    experience: '8 yıl',
    bio: 'Uzman fizyoterapist - Manuel terapi ve egzersiz terapisi',
    avatar: null,
    createdAt: '2024-01-01',
    name: 'Dr. Ayşe Kaya'
  },
  {
    id: 3,
    firstName: 'Dr. Mehmet',
    lastName: 'Demir',
    email: 'mehmet@example.com',
    password: '123456',
    phone: '0555 345 67 89',
    role: 'therapist',
    specialization: 'Spor Fizyoterapisi',
    experience: '12 yıl',
    bio: 'Spor fizyoterapisti - Spor yaralanmaları ve rehabilitasyon',
    avatar: null,
    createdAt: '2024-01-01',
    name: 'Dr. Mehmet Demir'
  },
  {
    id: 4,
    firstName: 'Dr. Fatma',
    lastName: 'Özkan',
    email: 'fatma@example.com',
    password: '123456',
    phone: '0555 456 78 90',
    role: 'therapist',
    specialization: 'Elektroterapi',
    experience: '6 yıl',
    bio: 'Elektroterapi uzmanı - Ağrı yönetimi ve kas rehabilitasyonu',
    avatar: null,
    createdAt: '2024-01-01',
    name: 'Dr. Fatma Özkan'
  }
];

export const mockAppointments = [
  {
    id: 1,
    patientId: 1,
    therapistId: 2,
    date: '2024-01-15',
    time: '14:00',
    type: 'manual_therapy',
    status: 'confirmed',
    notes: 'Bel ağrısı tedavisi',
    problem: 'Bel ağrısı',
    duration: '60',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    therapist: { name: 'Dr. Ayşe Kaya' }
  },
  {
    id: 2,
    patientId: 1,
    therapistId: 3,
    date: '2024-01-16',
    time: '10:30',
    type: 'sports_physio',
    status: 'pending',
    notes: 'Spor yaralanması rehabilitasyonu',
    problem: 'Diz yaralanması',
    duration: '45',
    createdAt: '2024-01-11',
    updatedAt: '2024-01-11',
    therapist: { name: 'Dr. Mehmet Demir' }
  },
  {
    id: 3,
    patientId: 1,
    therapistId: 4,
    date: '2024-01-17',
    time: '16:00',
    type: 'electrotherapy',
    status: 'completed',
    notes: 'Boyun ağrısı elektroterapi',
    problem: 'Boyun ağrısı',
    duration: '30',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-17',
    therapist: { name: 'Dr. Fatma Özkan' }
  }
];

export const mockStats = {
  totalAppointments: 12,
  thisWeek: 3,
  completed: 8,
  cancelled: 1,
  upcoming: 2
};

// Helper functions
export const getAppointmentsByUser = (userId, role) => {
  // localStorage'dan kaydedilmiş randevuları yükle
  try {
    const savedAppointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]');
    // localStorage'daki randevuları mockAppointments'a ekle (duplikasyon kontrolü ile)
    savedAppointments.forEach(apt => {
      if (!mockAppointments.find(m => m.id === apt.id)) {
        mockAppointments.push(apt);
      }
    });
  } catch (e) {
    console.error('localStorage yükleme hatası:', e);
  }
  
  if (role === 'patient') {
    return mockAppointments.filter(apt => apt.patientId === userId);
  } else if (role === 'therapist') {
    return mockAppointments.filter(apt => apt.therapistId === userId);
  }
  return [];
};

export const getTherapists = () => {
  return mockUsers.filter(user => user.role === 'therapist');
};

export const getUserById = (id) => {
  return mockUsers.find(user => user.id === id);
};

export const getAppointmentById = (id) => {
  return mockAppointments.find(apt => apt.id === id);
};

export const createAppointment = (appointmentData) => {
  // therapistId string ise integer'a çevir
  const therapistIdInt = parseInt(appointmentData.therapistId) || appointmentData.therapistId;
  const therapist = getUserById(therapistIdInt);
  
  // Tarih formatını düzelt (DD/MM/YYYY -> YYYY-MM-DD veya direkt kullan)
  let formattedDate = appointmentData.date;
  if (formattedDate && typeof formattedDate === 'string' && formattedDate.includes('/')) {
    // DD/MM/YYYY formatını YYYY-MM-DD'ye çevir
    const parts = formattedDate.split('/');
    if (parts.length === 3) {
      formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  
  const newAppointment = {
    id: mockAppointments.length + 1,
    ...appointmentData,
    therapistId: therapistIdInt,
    date: formattedDate || appointmentData.date,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    therapist: { name: therapist ? therapist.name : 'Bilinmeyen Fizyoterapist' }
  };
  mockAppointments.push(newAppointment);
  
  // localStorage'a kaydet
  try {
    const savedAppointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]');
    savedAppointments.push(newAppointment);
    localStorage.setItem('mockAppointments', JSON.stringify(savedAppointments));
  } catch (e) {
    console.error('localStorage kayıt hatası:', e);
  }
  
  return newAppointment;
};

export const updateAppointment = (id, updates) => {
  const index = mockAppointments.findIndex(apt => apt.id === id);
  if (index !== -1) {
    mockAppointments[index] = {
      ...mockAppointments[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return mockAppointments[index];
  }
  return null;
};

export const deleteAppointment = (id) => {
  const index = mockAppointments.findIndex(apt => apt.id === id);
  if (index !== -1) {
    return mockAppointments.splice(index, 1)[0];
  }
  return null;
};
