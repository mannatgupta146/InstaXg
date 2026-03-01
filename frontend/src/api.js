import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// SAFE interceptor
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      console.warn("Unauthorized request");
      // ❌ DO NOT redirect here
    }
    return Promise.reject(err);
  }
);

export default api;