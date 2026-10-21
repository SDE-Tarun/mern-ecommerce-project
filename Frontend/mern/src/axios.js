import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? "https://apna-store-backend-h3wn.onrender.com/api" // Aapka live backend URL
    : "/api", // Local development ke liye proxy
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;