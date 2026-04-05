import axios from "axios";

const API = axios.create({
  baseURL: "/api/",
});

// Attach JWT access token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401: try to refresh the access token, then retry once.
// If refresh fails, clear storage and redirect to /login.
let isRefreshing = false;
let refreshQueue = [];

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // If there's no token at all, the user isn't logged in — let the 401 pass silently
    // (prevents redirect loops from unauthenticated pages making optional API calls)
    const accessToken = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh");
    if (!accessToken && !refreshToken) {
      return Promise.reject(error);
    }

    // Don't try to refresh the refresh endpoint itself
    if (original.url === "auth/refresh/") {
      forceLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return API(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post("/api/auth/refresh/", {
        refresh: refreshToken,
      });
      localStorage.setItem("token", data.access);
      API.defaults.headers.common.Authorization = `Bearer ${data.access}`;
      refreshQueue.forEach((p) => p.resolve(data.access));
      refreshQueue = [];
      original.headers.Authorization = `Bearer ${data.access}`;
      return API(original);
    } catch {
      refreshQueue.forEach((p) => p.reject());
      refreshQueue = [];
      forceLogout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

function forceLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

export default API;
