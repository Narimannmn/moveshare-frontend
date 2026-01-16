import axios from "axios";

import { getDeviceFingerprint } from "../utils/deviceFingerprint";
import { getLocalStorageTokens } from "../utils/token/token";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token and device fingerprint
apiClient.interceptors.request.use((config) => {
  const { accessToken } = getLocalStorageTokens();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Add device fingerprint header to all requests
  config.headers["X-Device-Fingerprint"] = getDeviceFingerprint();

  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized - token refresh logic can be added here
    if (error.response?.status === 401) {
      // Token refresh logic will be implemented in Auth mutations
      // For now, just reject the error
    }
    return Promise.reject(error);
  }
);
