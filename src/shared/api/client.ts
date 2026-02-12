import axios from "axios";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";

import { getDeviceFingerprint } from "../utils/deviceFingerprint";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate auth client for registration/login flows (no automatic token)
export const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add access token and device fingerprint
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  // Use only accessToken for authenticated requests
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Add device fingerprint header to all requests
  config.headers["X-Device-Fingerprint"] = getDeviceFingerprint();

  return config;
});

// Auth client interceptor - add temp token if exists, and device fingerprint
authClient.interceptors.request.use((config) => {
  const { tempToken } = useAuthStore.getState();

  // Use tempToken for registration flow if it exists
  if (tempToken) {
    config.headers.Authorization = `Bearer ${tempToken}`;
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
