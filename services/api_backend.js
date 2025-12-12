// Backend API Service - SQL Server ile çalışır
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: credentials
    });
    
    if (response.user && typeof window !== 'undefined') {
      localStorage.setItem('token', response.token || 'mock-token');
      localStorage.setItem('user', JSON.stringify({
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.role,
        patientId: response.user.patientId,
        therapistId: response.user.therapistId
      }));
    }
    
    return { data: response.user, status: 200, message: response.message };
  },

  register: async (userData) => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: userData
    });
    
    if (response.user && typeof window !== 'undefined') {
      localStorage.setItem('token', response.token || 'mock-token');
      localStorage.setItem('user', JSON.stringify({
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.role,
        patientId: response.user.patientId,
        therapistId: response.user.therapistId
      }));
    }
    
    return { data: response.user, status: 201, message: response.message };
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return { data: { message: 'Logged out successfully' }, status: 200 };
  }
};

// User API
export const userAPI = {
  getProfile: async () => {
    const userId = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('user') || '{}').id 
      : null;
    
    const response = await apiCall(`/users/me?userId=${userId}`, {
      method: 'GET'
    });
    
    return { data: response.data, status: 200 };
  },

  getTherapists: async () => {
    const response = await apiCall('/users/therapists', {
      method: 'GET'
    });
    
    return { data: response.data || [], status: 200 };
  },

  updateProfile: async (data) => {
    const response = await apiCall('/users/me', {
      method: 'PUT',
      body: data
    });
    
    return { data: response.data, status: 200, message: response.message };
  }
};

// Appointment API
export const appointmentAPI = {
  create: async (appointmentData) => {
    const currentUser = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : {};
    
    // Backend'e gönderilecek format
    const backendData = {
      patientId: appointmentData.patientId || currentUser.patientId || currentUser.id,
      therapistId: parseInt(appointmentData.therapistId),
      treatmentTypeId: parseInt(appointmentData.treatmentTypeId || appointmentData.type),
      appointmentDate: appointmentData.date, // YYYY-MM-DD formatında
      appointmentTime: appointmentData.time, // HH:MM formatında
      duration: appointmentData.duration || 60,
      problem: appointmentData.problem || null,
      notes: appointmentData.notes || null
    };

    const response = await apiCall('/appointments', {
      method: 'POST',
      body: backendData
    });
    
    return { data: response.data, status: 201, message: response.message };
  },

  getById: async (id) => {
    const response = await apiCall(`/appointments/${id}`, {
      method: 'GET'
    });
    
    return { data: response.data, status: 200 };
  },

  updateStatus: async (id, statusData) => {
    const response = await apiCall(`/appointments/${id}/status`, {
      method: 'PUT',
      body: statusData
    });
    
    return { data: response.data, status: 200, message: response.message };
  },

  getMyAppointments: async () => {
    const currentUser = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : {};
    
    if (!currentUser.id) {
      return { data: [], status: 200 };
    }

    const response = await apiCall(`/appointments/my-appointments?userId=${currentUser.id}&role=${currentUser.role}`, {
      method: 'GET'
    });
    
    // Backend response formatını frontend formatına çevir
    const formattedAppointments = (response.data || []).map(apt => ({
      id: apt.AppointmentID,
      patientId: apt.PatientID,
      therapistId: apt.TherapistID,
      therapist: {
        id: apt.TherapistID,
        name: apt.TherapistName
      },
      date: apt.AppointmentDate,
      time: apt.AppointmentTime,
      duration: apt.Duration,
      status: apt.Status,
      problem: apt.Problem,
      notes: apt.Notes,
      type: apt.TreatmentTypeName,
      createdAt: apt.CreatedAt,
      updatedAt: apt.UpdatedAt
    }));
    
    return { data: formattedAppointments, status: 200 };
  },

  getTherapistAppointments: async () => {
    const currentUser = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : {};
    
    const response = await apiCall(`/appointments/my-appointments?userId=${currentUser.id}&role=${currentUser.role}`, {
      method: 'GET'
    });
    
    const formattedAppointments = (response.data || []).map(apt => ({
      id: apt.AppointmentID,
      patientId: apt.PatientID,
      therapistId: apt.TherapistID,
      patient: {
        id: apt.PatientID,
        name: apt.PatientName
      },
      date: apt.AppointmentDate,
      time: apt.AppointmentTime,
      duration: apt.Duration,
      status: apt.Status,
      problem: apt.Problem,
      notes: apt.Notes,
      type: apt.TreatmentTypeName,
      createdAt: apt.CreatedAt,
      updatedAt: apt.UpdatedAt
    }));
    
    return { data: formattedAppointments, status: 200 };
  },

  delete: async (id) => {
    const response = await apiCall(`/appointments/${id}`, {
      method: 'DELETE'
    });
    
    return { data: null, status: 200, message: response.message };
  }
};

// Stats API
export const statsAPI = {
  getDashboardStats: async () => {
    // Backend'de stats endpoint'i yoksa mock data döndür
    return { data: {}, status: 200 };
  }
};

// Default export
export default {
  authAPI,
  userAPI,
  appointmentAPI,
  statsAPI
};
