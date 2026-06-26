import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; // Thay đổi host phù hợp

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const teacherApi = {
  getList: (page = 1, limit = 10) => api.get(`/teachers/?page=${page}&limit=${limit}`),
  create: (data) => api.post('/teachers/', data),
};

export const positionApi = {
  getList: () => api.get('/teacher-positions/'),
  create: (data) => api.post('/teacher-positions/', data),

};

export default api;