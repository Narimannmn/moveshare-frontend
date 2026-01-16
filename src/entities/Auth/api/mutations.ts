import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@entities/User/model/store/authStore";

import type { CompleteProfileRequest, SetPasswordRequest } from "../schemas";
import { authKeys } from "./keys";
import * as services from "./services";

// ============================================
// Registration Flow Mutations
// ============================================

export const useSendRegistrationOTP = () => {
  return useMutation({
    mutationKey: authKeys.sendOtp(),
    mutationFn: services.sendRegistrationOTP,
  });
};

export const useVerifyRegistrationOTP = () => {
  const authStore = useAuthStore();

  return useMutation({
    mutationKey: authKeys.verifyOtp(),
    mutationFn: services.verifyRegistrationOTP,
    onSuccess: (data) => {
      // Store temp_token for next registration steps
      authStore.actions.setTempToken(data.temp_token);
    },
  });
};

export const useSetPassword = () => {
  const authStore = useAuthStore();

  return useMutation({
    mutationKey: authKeys.setPassword(),
    mutationFn: (data: SetPasswordRequest) => {
      const tempToken = authStore.tempToken;
      if (!tempToken) {
        throw new Error("No temp token available");
      }
      return services.setPassword(data, tempToken);
    },
    onSuccess: () => {
      // Keep temp_token for next step (complete profile)
    },
  });
};

export const useCompleteProfile = () => {
  const authStore = useAuthStore();

  return useMutation({
    mutationKey: authKeys.completeProfile(),
    mutationFn: (data: CompleteProfileRequest) => {
      const tempToken = authStore.tempToken;
      if (!tempToken) {
        throw new Error("No temp token available");
      }
      return services.completeProfile(data, tempToken);
    },
    onSuccess: () => {
      // Keep temp_token for verification step
      // It will be cleared after final review or when user completes the flow
      // Let the calling page handle navigation
    },
  });
};

// ============================================
// Login Flow Mutations
// ============================================

export const useLogin = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: authKeys.login(),
    mutationFn: services.login,
    onSuccess: (data) => {
      if (data.requires_otp) {
        // Store temp_token and navigate to OTP verification
        if (data.temp_token) {
          authStore.actions.setTempToken(data.temp_token);
        }
        // UI will handle navigation to OTP verification step
      } else if (data.access_token && data.refresh_token) {
        // Direct login without OTP - store tokens and navigate
        authStore.actions.updateTokens(data.access_token, data.refresh_token);
        navigate({ to: "/dashboard" });
      }
    },
  });
};

export const useVerifyLoginOTP = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: authKeys.verifyLoginOtp(),
    mutationFn: services.verifyLoginOTP,
    onSuccess: (data) => {
      // Store tokens and clear temp_token
      authStore.actions.updateTokens(data.access_token, data.refresh_token);
      authStore.actions.clearTempToken();

      // Navigate to dashboard
      navigate({ to: "/dashboard" });
    },
  });
};

// ============================================
// Token Management Mutations
// ============================================

export const useRefreshToken = () => {
  const authStore = useAuthStore();

  return useMutation({
    mutationKey: authKeys.refresh(),
    mutationFn: services.refreshToken,
    onSuccess: (data) => {
      // Update tokens in store
      authStore.actions.updateTokens(data.access_token, data.refresh_token);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: authKeys.logout(),
    mutationFn: services.logout,
    onSettled: () => {
      // Clear all queries
      queryClient.clear();

      // Clear auth store
      authStore.actions.logout();

      // Navigate to login
      navigate({ to: "/login" });
    },
  });
};
