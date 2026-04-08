import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "../model/store/authStore";

import type {
  DocumentType,
  ForgotPasswordResetRequest,
  ForgotPasswordVerifyOTPRequest,
  LoginResponse,
  RegisterCompanyRequest,
  SetPasswordRequest,
  UpdateCompanyProfileRequest,
  UpdateNotificationPreferencesRequest,
  VerifyOTPRequest,
} from "../schemas";
import { authKeys } from "./keys";
import * as services from "./services";


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

const handleAuthSuccess = (
  data: LoginResponse,
  navigate: ReturnType<typeof useNavigate>,
  actions: ReturnType<typeof useAuthStore.getState>["actions"]
) => {
  const step = data.user.registration_step;

  // If registration is incomplete, route to the appropriate step
  const incompleteStepRoutes: Record<string, string> = {
    pending_otp: "/register/verify",
    otp_verified: "/register/password",
    password_set: "/register/company",
  };

  const incompleteRoute = incompleteStepRoutes[step];
  if (incompleteRoute) {
    actions.setTempToken(data.access_token);
    navigate({ to: incompleteRoute });
    return;
  }

  // Profile complete but documents not uploaded → verification step
  if (!data.user.has_uploaded_documents) {
    actions.setTempToken(data.access_token);
    navigate({ to: "/register/verification" });
    return;
  }

  // Profile complete + pending status = under review
  if (data.user.status.toLowerCase() === "pending") {
    actions.updateTokens(data.access_token, data.refresh_token);
    navigate({ to: "/register/review" });
    return;
  }

  // Fully verified user
  actions.updateTokens(data.access_token, data.refresh_token);
  navigate({ to: "/jobs" });
};

export const useLogin = () => {
  const actions = useAuthStore((state) => state.actions);
  const navigate = useNavigate();

  return useMutation({
    mutationKey: authKeys.login(),
    mutationFn: services.login,
    onSuccess: (data) => {
      handleAuthSuccess(data, navigate, actions);
    },
  });
};

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

export const useTerminateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...authKeys.sessions(), "terminate"],
    mutationFn: services.terminateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
    },
  });
};

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

export const useUploadCompanyDocument = () => {
  return useMutation({
    mutationKey: authKeys.uploadDocument(),
    mutationFn: ({ documentType, file }: { documentType: DocumentType; file: File }) =>
      services.uploadCompanyDocument(documentType, file),
  });
};

export const useUploadCompanyProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: authKeys.uploadProfileImage(),
    mutationFn: (file: File) => services.uploadCompanyProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: authKeys.companyProfile()});
    },
  });
};

export const useDeleteCompanyProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: authKeys.deleteProfileImage(),
    mutationFn: () => services.deleteCompanyProfileImage(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.companyProfile() });
    },
  });
};

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...authKeys.notificationPreferences(), "update"],
    mutationFn: (data: UpdateNotificationPreferencesRequest) =>
      services.updateNotificationPreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.notificationPreferences() });
    },
  });
};

export const useUpdateCompanyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...authKeys.companyProfile(), "update"],
    mutationFn: (data: UpdateCompanyProfileRequest) => services.updateCompanyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.companyProfile() });
    },
  });
};
