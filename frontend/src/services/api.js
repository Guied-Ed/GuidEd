import axios from "axios";

const API = axios.create({
  baseURL: "https://api.guided.com", // Replace backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Example interceptor for authentication
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Assuming a token is stored
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
