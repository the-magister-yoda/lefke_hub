import axios from "axios";

// Vite ищет переменные, которые начинаются с VITE_
// export const API_URL = import.meta.env.VITE_API_URL; это если через докер и когда на проду
export const API_URL = 'http://127.0.0.1:8000' // это для разработки когда запускаю локально через терминал

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});