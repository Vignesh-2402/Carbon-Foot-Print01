import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (email, password, name) =>
    api.post('/auth/register', { email, password, name }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  googleVerify: (token) =>
    api.post('/auth/google/verify', { token }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const activityService = {
  create: (data) => api.post('/activities', data),
  getActivities: (skip = 0, limit = 50, filters = {}) =>
    api.get('/activities', { params: { skip, limit, ...filters } }),
  getSummary: () => api.get('/activities/summary'),
  delete: (id) => api.delete(`/activities/${id}`)
};

export const goalService = {
  create: (data) => api.post('/goals', data),
  getGoals: () => api.get('/goals'),
  getProgress: (id) => api.get(`/goals/${id}/progress`),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`)
};

export const challengeService = {
  getChallenges: () => api.get('/challenges'),
  join: (id) => api.post(`/challenges/${id}/join`),
  getLeaderboard: (id) => api.get(`/challenges/${id}/leaderboard`),
  getProgress: (id) => api.get(`/challenges/${id}/my-progress`)
};

export const statsService = {
  getPeerComparison: () => api.get('/stats/peers'),
  getLeaderboard: () => api.get('/stats/leaderboard'),
  getTrends: () => api.get('/stats/trends')
};

export default api;
