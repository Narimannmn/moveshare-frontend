import { apiClient, authClient } from "@shared/api/client";

import {
  type ActiveSessionsListResponse,
  ActiveSessionsListResponseSchema,
  type CompanyProfileResponse,
  CompanyProfileResponseSchema,
  type DeleteProfileImageResponse,
  DeleteProfileImageResponseSchema,
  type DocumentType,
  type ForgotPasswordRequest,
  ForgotPasswordRequestSchema,
  type ForgotPasswordResponse,
  ForgotPasswordResponseSchema,
  type ForgotPasswordResetRequest,
  ForgotPasswordResetRequestSchema,
  type ForgotPasswordResetResponse,
  ForgotPasswordResetResponseSchema,
  type ForgotPasswordVerifyOTPRequest,
  ForgotPasswordVerifyOTPRequestSchema,
  type ForgotPasswordVerifyOTPResponse,
  ForgotPasswordVerifyOTPResponseSchema,
  type LoginRequest,
  LoginRequestSchema,
  type LoginResponse,
  LoginResponseSchema,
  type NotificationPreferencesResponse,
  NotificationPreferencesResponseSchema,
  type LogoutAllResponse,
  LogoutAllResponseSchema,
  LogoutRequestSchema,
  type LogoutResponse,
  LogoutResponseSchema,
  RefreshTokenRequestSchema,
  type RefreshTokenResponse,
  RefreshTokenResponseSchema,
  type RegisterCompanyRequest,
  RegisterCompanyRequestSchema,
  type RegisterCompanyResponse,
  RegisterCompanyResponseSchema,
  SendOTPRequestSchema,
  type SendOTPResponse,
  SendOTPResponseSchema,
  type SetPasswordRequest,
  SetPasswordRequestSchema,
  type SetPasswordResponse,
  SetPasswordResponseSchema,
  type TerminateSessionResponse,
  TerminateSessionResponseSchema,
  type UploadDocumentResponse,
  UploadDocumentResponseSchema,
  type UploadProfileImageResponse,
  UploadProfileImageResponseSchema,
  type UpdateCompanyProfileRequest,
  UpdateCompanyProfileRequestSchema,
  type UpdateCompanyProfileResponse,
  UpdateCompanyProfileResponseSchema,
  type UpdateNotificationPreferencesRequest,
  UpdateNotificationPreferencesRequestSchema,
  type VerifyOTPRequest,
  VerifyOTPRequestSchema,
  type VerifyOTPResponse,
  VerifyOTPResponseSchema,
} from "../schemas";


export const sendOTP = async (email: string): Promise<SendOTPResponse> => {
  try {
    const validated = SendOTPRequestSchema.parse({email});
    const response = await authClient.post("/api/v1/auth/send-otp", validated);
    return SendOTPResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOTP = async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
  try {
    const validated = VerifyOTPRequestSchema.parse(data);
    const response = await authClient.post("/api/v1/auth/verify-otp", validated);
    return VerifyOTPResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export const setPassword = async (
  data: SetPasswordRequest,
  tempToken: string
): Promise<SetPasswordResponse> => {
  try {
    const validated = SetPasswordRequestSchema.parse(data);
    const response = await authClient.post("/api/v1/auth/set-password", validated, {
      headers: {
        Authorization: `Bearer ${tempToken}`,
      },
    });
    return SetPasswordResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error setting password:", error);
    throw error;
  }
};

export const registerCompany = async (
  data: RegisterCompanyRequest,
  tempToken: string
): Promise<RegisterCompanyResponse> => {
  try {
    const validated = RegisterCompanyRequestSchema.parse(data);
    const response = await authClient.post("/api/v1/auth/register/company", validated, {
      headers: {
        Authorization: `Bearer ${tempToken}`,
      },
    });
    return RegisterCompanyResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error registering company:", error);
    throw error;
  }
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const validated = LoginRequestSchema.parse(data);
    const response = await authClient.post("/api/v1/auth/login", validated);
    return LoginResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const refreshToken = async (refreshTokenValue: string): Promise<RefreshTokenResponse> => {
  try {
    const validated = RefreshTokenRequestSchema.parse({
      refresh_token: refreshTokenValue,
    });
    const response = await authClient.post("/api/v1/auth/refresh", validated);
    return RefreshTokenResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export const logout = async (refreshTokenValue: string): Promise<LogoutResponse> => {
  try {
    const validated = LogoutRequestSchema.parse({
      refresh_token: refreshTokenValue,
    });
    const response = await authClient.post("/api/v1/auth/logout", validated);
    return LogoutResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const logoutAll = async (): Promise<LogoutAllResponse> => {
  try {
    const response = await authClient.post("/api/v1/auth/logout-all");
    return LogoutAllResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error logging out all sessions:", error);
    throw error;
  }
};

export const getActiveSessions = async (): Promise<ActiveSessionsListResponse> => {
  try {
    const response = await apiClient.get("/api/v1/auth/sessions");
    return ActiveSessionsListResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    throw error;
  }
};

export const terminateSession = async (sessionId: string): Promise<TerminateSessionResponse> => {
  try {
    const response = await apiClient.delete(`/api/v1/auth/sessions/${sessionId}`);
    return TerminateSessionResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error terminating session:", error);
    throw error;
  }
};

export const getNotificationPreferences = async (): Promise<NotificationPreferencesResponse> => {
  try {
    const response = await apiClient.get("/api/v1/notifications/preferences");
    return NotificationPreferencesResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    throw error;
  }
};

export const updateNotificationPreferences = async (
  data: UpdateNotificationPreferencesRequest
): Promise<NotificationPreferencesResponse> => {
  try {
    const validated = UpdateNotificationPreferencesRequestSchema.parse(data);
    const response = await apiClient.patch("/api/v1/notifications/preferences", validated);
    return NotificationPreferencesResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    throw error;
  }
};

export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  try {
    const validated = ForgotPasswordRequestSchema.parse(data);
    const response = await authClient.post("/api/v1/auth/forgot-password", validated);
    return ForgotPasswordResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error sending forgot password OTP:", error);
    throw error;
  }
};

export const forgotPasswordVerifyOTP = async (
  data: ForgotPasswordVerifyOTPRequest
): Promise<ForgotPasswordVerifyOTPResponse> => {
  try {
    const validated = ForgotPasswordVerifyOTPRequestSchema.parse(data);
    const response = await authClient.post("/api/v1/auth/forgot-password/verify-otp", validated);
    return ForgotPasswordVerifyOTPResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error verifying forgot password OTP:", error);
    throw error;
  }
};

export const forgotPasswordReset = async (
  data: ForgotPasswordResetRequest,
  tempToken: string
): Promise<ForgotPasswordResetResponse> => {
  try {
    const validated = ForgotPasswordResetRequestSchema.parse(data);
    const response = await authClient.post("/api/v1/auth/forgot-password/reset", validated, {
      headers: {
        Authorization: `Bearer ${tempToken}`,
      },
    });
    return ForgotPasswordResetResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const uploadCompanyDocument = async (
  documentType: DocumentType,
  file: File
): Promise<UploadDocumentResponse> => {
  try {
    const formData = new FormData();
    formData.append("document_type", documentType);
    formData.append("file", file);

    const response = await authClient.post("/api/v1/company/documents/upload", formData, {
      headers: {"Content-Type": "multipart/form-data"},
    });

    return UploadDocumentResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Failed to upload company document:", error);
    throw error;
  }
};

export const getCompanyProfile = async (): Promise<CompanyProfileResponse> => {
  try {
    const response = await apiClient.get("/api/v1/company/profile");
    return CompanyProfileResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Failed to get company profile:", error);
    throw error;
  }
};

export const uploadCompanyProfileImage = async (file: File): Promise<UploadProfileImageResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/api/v1/company/profile/image", formData, {
      headers: {"Content-Type": "multipart/form-data"},
    });

    return UploadProfileImageResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Failed to upload company profile image:", error);
    throw error;
  }
};

export const deleteCompanyProfileImage = async (): Promise<DeleteProfileImageResponse> => {
  try {
    const response = await apiClient.delete("/api/v1/company/profile/image");
    return DeleteProfileImageResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Failed to delete company profile image:", error);
    throw error;
  }
};

export const updateCompanyProfile = async (
  data: UpdateCompanyProfileRequest
): Promise<UpdateCompanyProfileResponse> => {
  try {
    const validated = UpdateCompanyProfileRequestSchema.parse(data);
    const response = await apiClient.patch("/api/v1/company/profile", validated);
    return UpdateCompanyProfileResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Failed to update company profile:", error);
    throw error;
  }
};
