import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jadara_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint =
        error.config.url.includes("/api/auth/login") ||
        error.config.url.includes("/api/auth/register");

      if (!isAuthEndpoint) {
        localStorage.removeItem("jadara_token");
        localStorage.removeItem("jadara_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;