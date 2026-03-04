import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
};

export const adminAPI = {
  createUser: (data) => API.post('/auth/create-user', data),
  deleteUser: (id) => API.delete(`/auth/users/${id}`),
};

export const eventsAPI = {
  getAll: () => API.get('/events'),
  getOne: (id) => API.get(`/events/${id}`),
  create: (data) => API.post('/events', data),
  update: (id, data) => API.put(`/events/${id}`, data),
  updateStatus: (id, data) => API.patch(`/events/${id}/status`, data),
  register: (id) => API.post(`/events/${id}/register`),
  myRegistrations: () => API.get('/events/my-registrations'),
  checkIn: (id, studentId) => API.post(`/events/${id}/checkin`, { eventId: id, studentId }),
};

export const resourcesAPI = {
  getAll: () => API.get('/resources'),
  create: (data) => API.post('/resources', data),
  update: (id, data) => API.put(`/resources/${id}`, data),
  delete: (id) => API.delete(`/resources/${id}`),
};

export const reportsAPI = {
  getStats: () => API.get('/reports/stats'),
  getUsers: () => API.get('/reports/users'),
  downloadPDF: () => API.get('/reports/pdf', { responseType: 'blob' }),
};

export default API;
