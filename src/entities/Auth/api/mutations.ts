import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";

import type {
  DocumentType,
  ForgotPasswordResetRequest,
  ForgotPasswordVerifyOTPRequest,
  RegisterCompanyRequest,
  SetPasswordRequest,
  VerifyOTPRequest,
} from "../schemas";
import { authKeys } from "./keys";
import * as services from "./services";

// ============================================
// Registration Flow Mutations
// ============================================

export const useSendOTP = () => {
  return useMutation({
    mutationKey: authKeys.sendOtp(),
    mutationFn: services.sendOTP,
  });
};

export const useVerifyOTP = () => {
  const authStore = useAuthStore();

  return useMutation({
    mutationKey: authKeys.verifyOtp(),
    mutationFn: (data: VerifyOTPRequest) => services.verifyOTP(data),
    onSuccess: (data) => {
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
  });
};

export const useRegisterCompany = () => {
  const authStore = useAuthStore();

  return useMutation({
    mutationKey: authKeys.registerCompany(),
    mutationFn: (data: RegisterCompanyRequest) => {
      const tempToken = authStore.tempToken;
      if (!tempToken) {
        throw new Error("No temp token available");
      }
      return services.registerCompany(data, tempToken);
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
      // Step 1: Set tokens based on registration status
      if (data.user.has_uploaded_documents) {
        // User completed registration - set access and refresh tokens
        authStore.actions.updateTokens(data.access_token, data.refresh_token);
        navigate({ to: "/jobs" });
        return;
      }
      console.log(data);
      // User has incomplete registration - set temp token for registration flow
      authStore.actions.setTempToken(data.access_token);

      // Step 2: Redirect based on registration_step
      const stepRoutes: Record<string, string> = {
        pending_otp: "/register/verify",
        otp_verified: "/register/password",
        password_set: "/register/company",
        profile_complete: "/register/verification",
      };

      const redirectTo = stepRoutes[data.user.registration_step] || "/register";
      navigate({ to: redirectTo });
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
    mutationFn: () => {
      const refreshToken = authStore.refreshToken;
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      return services.logout(refreshToken);
    },
    onSettled: () => {
      queryClient.clear();
      authStore.actions.logout();
      navigate({ to: "/login" });
    },
  });
};

export const useLogoutAll = () => {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: authKeys.logoutAll(),
    mutationFn: services.logoutAll,
    onSettled: () => {
      queryClient.clear();
      authStore.actions.logout();
      navigate({ to: "/login" });
    },
  });
};

// ============================================
// Forgot Password Flow Mutations
// ============================================

export const useForgotPassword = () => {
  return useMutation({
    mutationKey: authKeys.forgotPasswordSendOtp(),
    mutationFn: services.forgotPassword,
  });
};

export const useForgotPasswordVerifyOTP = () => {
  const authStore = useAuthStore();

  return useMutation({
    mutationKey: authKeys.forgotPasswordVerifyOtp(),
    mutationFn: (data: ForgotPasswordVerifyOTPRequest) => services.forgotPasswordVerifyOTP(data),
    onSuccess: (data) => {
      authStore.actions.setTempToken(data.temp_token);
    },
  });
};

export const useForgotPasswordReset = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: authKeys.forgotPasswordReset(),
    mutationFn: (data: ForgotPasswordResetRequest) => {
      const tempToken = authStore.tempToken;
      if (!tempToken) {
        throw new Error("No temp token available");
      }
      return services.forgotPasswordReset(data, tempToken);
    },
    onSuccess: () => {
      authStore.actions.clearTempToken();
      navigate({ to: "/login" });
    },
  });
};

// ============================================
// Document Upload Mutation (Registration Flow)
// ============================================

export const useUploadCompanyDocument = () => {
  return useMutation({
    mutationKey: authKeys.uploadDocument(),
    mutationFn: ({ documentType, file }: { documentType: DocumentType; file: File }) =>
      services.uploadCompanyDocument(documentType, file),
  });
};
