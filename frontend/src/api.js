import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Add JWT token automatically if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // only send token for secured endpoints
  if (token && !config.url.includes("conditions")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
