import axios from "axios";

const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.PROD) return "/api";
  return "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("anon_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
