import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// A single API origin is required. Comma-separated URLs create malformed
// request paths and commonly surface as misleading 404 responses.
if (configuredBaseUrl?.includes(",")) {
  throw new Error(
    "VITE_API_BASE_URL must contain one URL only. Use separate environment values for local and production builds."
  );
}

const api = axios.create({
  baseURL: configuredBaseUrl?.replace(/\/+$/, "") || "/api",
  headers: { "Content-Type": "application/json" },
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Keep session cleanup in one place when the API rejects an expired token.
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  }
);

export default api;
