import axios, { AxiosHeaders, type AxiosError, type InternalAxiosRequestConfig } from "axios";

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

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshRequestPromise: Promise<string | null> | null = null;

const shouldAttachTempToken = (url?: string) => {
  if (!url) return false;

  const normalizedUrl = url.toLowerCase();

  return (
    normalizedUrl.includes("/api/v1/auth/set-password") ||
    normalizedUrl.includes("/api/v1/auth/register/company") ||
    normalizedUrl.includes("/api/v1/auth/forgot-password/reset") ||
    normalizedUrl.includes("/api/v1/company/documents/upload")
  );
};

const refreshAccessToken = async (): Promise<string | null> => {
  const { refreshToken, actions } = useAuthStore.getState();

  if (!refreshToken) {
    actions.logout();
    return null;
  }

  try {
    const response = await authClient.post("/api/v1/auth/refresh", {
      refresh_token: refreshToken,
    });

    const accessToken = response.data?.access_token as string | undefined;
    const nextRefreshToken = response.data?.refresh_token as string | undefined;

    if (!accessToken || !nextRefreshToken) {
      throw new Error("Invalid refresh response");
    }

    actions.updateTokens(accessToken, nextRefreshToken);
    return accessToken;
  } catch {
    actions.logout();
    return null;
  }
};

const getRefreshedAccessToken = async (): Promise<string | null> => {
  if (!refreshRequestPromise) {
    refreshRequestPromise = refreshAccessToken().finally(() => {
      refreshRequestPromise = null;
    });
  }

  return refreshRequestPromise;
};

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
  const hasAuthHeader = Boolean(config.headers?.Authorization);

  // Use temp token only on registration endpoints that require it.
  if (tempToken && !hasAuthHeader && shouldAttachTempToken(config.url)) {
    config.headers.Authorization = `Bearer ${tempToken}`;
  }

  // Add device fingerprint header to all requests
  config.headers["X-Device-Fingerprint"] = getDeviceFingerprint();

  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const isUnauthorized = error.response?.status === 401;

    if (!isUnauthorized || !originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      useAuthStore.getState().actions.logout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshedAccessToken = await getRefreshedAccessToken();

    if (!refreshedAccessToken) {
      return Promise.reject(error);
    }

    if (!originalRequest.headers) {
      originalRequest.headers = new AxiosHeaders();
    }
    originalRequest.headers.Authorization = `Bearer ${refreshedAccessToken}`;

    return apiClient(originalRequest);
  }
);
