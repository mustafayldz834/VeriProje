// Mock API Service for Frontend Development
import { 
  mockUsers, 
  mockAppointments, 
  mockStats,
  getAppointmentsByUser,
  getTherapists,
  getUserById,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from './mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
const createMockResponse = (data, success = true) => ({
  data,
  status: success ? 200 : 400,
  message: success ? 'Success' : 'Error'
});

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    await delay();
    const user = mockUsers.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password
    );
    
    if (user) {
      const token = `mock-token-${user.id}-${Date.now()}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return createMockResponse({ user, token });
    } else {
      throw new Error('Invalid credentials');
    }
  },

  register: async (userData) => {
    await delay();
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    
    const token = `mock-token-${newUser.id}-${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return createMockResponse({ user: newUser, token });
  },

  logout: async () => {
    await delay();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return createMockResponse({ message: 'Logged out successfully' });
  }
};

// User API
export const userAPI = {
  getProfile: async () => {
    await delay();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return createMockResponse(user);
  },

  getTherapists: async () => {
    await delay();
    const therapists = getTherapists();
    return createMockResponse(therapists);
  },

  updateProfile: async (data) => {
    await delay();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return createMockResponse(updatedUser);
  }
};

// Appointment API
export const appointmentAPI = {
  create: async (appointmentData) => {
    await delay();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // therapistId'yi integer'a çevir
    const appointmentDataFixed = {
      ...appointmentData,
      therapistId: parseInt(appointmentData.therapistId) || appointmentData.therapistId,
      patientId: appointmentData.patientId || currentUser.id || 1 // Eğer patientId yoksa currentUser.id kullan, o da yoksa 1
    };
    
    const newAppointment = createAppointment(appointmentDataFixed);
    return createMockResponse(newAppointment);
  },

  getById: async (id) => {
    await delay();
    const appointment = getAppointmentById(parseInt(id));
    if (appointment) {
      return createMockResponse(appointment);
    } else {
      throw new Error('Appointment not found');
    }
  },

  updateStatus: async (id, statusData) => {
    await delay();
    const updated = updateAppointment(parseInt(id), statusData);
    if (updated) {
      return createMockResponse(updated);
    } else {
      throw new Error('Appointment not found');
    }
  },

  getMyAppointments: async () => {
    await delay();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Eğer kullanıcı giriş yapmamışsa boş liste döndür
    if (!currentUser.id) {
      return createMockResponse([]);
    }
    
    // localStorage'dan kaydedilmiş randevuları yükle
    try {
      const savedAppointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]');
      if (savedAppointments.length > 0) {
        // localStorage'daki randevuları mockAppointments'a ekle
        savedAppointments.forEach(apt => {
          if (!mockAppointments.find(m => m.id === apt.id)) {
            mockAppointments.push(apt);
          }
        });
      }
    } catch (e) {
      console.error('localStorage yükleme hatası:', e);
    }
    
    const appointments = getAppointmentsByUser(currentUser.id, currentUser.role);
    
    // Enrich appointments with user data
    const enrichedAppointments = appointments.map(apt => ({
      ...apt,
      therapist: getUserById(apt.therapistId),
      patient: getUserById(apt.patientId)
    }));
    
    return createMockResponse(enrichedAppointments);
  },

  getTherapistAppointments: async () => {
    await delay();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const appointments = getAppointmentsByUser(currentUser.id, currentUser.role);
    
    // Enrich appointments with user data
    const enrichedAppointments = appointments.map(apt => ({
      ...apt,
      therapist: getUserById(apt.therapistId),
      patient: getUserById(apt.patientId)
    }));
    
    return createMockResponse(enrichedAppointments);
  }
};

// Stats API
export const statsAPI = {
  getDashboardStats: async () => {
    await delay();
    return createMockResponse(mockStats);
  }
};

// Default export for compatibility
export default {
  authAPI,
  userAPI,
  appointmentAPI,
  statsAPI
};
