import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const teacherApi = {
  getList: (page = 1, limit = 10) =>
    api.get("/teachers", { params: { page, limit } }),

  create: (data) => api.post("/teachers", data),
};

export const positionApi = {
  // Backend hiện tại: GET /api/teacherpositions trả về toàn bộ danh sách (không hỗ trợ page/limit)
  getList: () => api.get("/teacherpositions"),

  create: (data) => api.post("/teacherpositions", data),
};

export default api;
