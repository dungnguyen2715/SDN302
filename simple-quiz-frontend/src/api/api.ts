import axios from "axios";
import { API_BASE_URL } from "./constants";

const api = axios.create({
  baseURL:  import.meta.env.VITE_API_URL || API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
