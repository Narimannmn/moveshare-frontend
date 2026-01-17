import { apiClient } from "@shared/api/client";

import {
  type CompleteProfileRequest,
  CompleteProfileRequestSchema,
  type CompleteProfileResponse,
  CompleteProfileResponseSchema,
  type LoginRequest,
  LoginRequestSchema,
  type LoginResponse,
  LoginResponseSchema,
  LogoutRequestSchema,
  RefreshTokenRequestSchema,
  type RefreshTokenResponse,
  RefreshTokenResponseSchema,
  SendRegistrationOTPRequestSchema,
  type SetPasswordRequest,
  SetPasswordRequestSchema,
  VerifyLoginOTPCodeSchema,
  type VerifyLoginOTPResponse,
  VerifyLoginOTPResponseSchema,
  type VerifyRegistrationOTPRequest,
  VerifyRegistrationOTPRequestSchema,
  type VerifyRegistrationOTPResponse,
  VerifyRegistrationOTPResponseSchema,
} from "../schemas";

// ============================================
// Registration Flow Services
// ============================================

export const sendRegistrationOTP = async (email: string): Promise<void> => {
  try {
    const validated = SendRegistrationOTPRequestSchema.parse({ email });
    await apiClient.post("/api/v1/auth/registration/send-otp", validated);
  } catch (error) {
    console.error("Error sending registration OTP:", error);
    throw error;
  }
};

export const verifyRegistrationOTP = async (
  data: VerifyRegistrationOTPRequest
): Promise<VerifyRegistrationOTPResponse> => {
  try {
    const validated = VerifyRegistrationOTPRequestSchema.parse(data);
    const response = await apiClient.post("/api/v1/auth/registration/verify-otp", validated);
    return VerifyRegistrationOTPResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error verifying registration OTP:", error);
    throw error;
  }
};

export const setPassword = async (
  data: SetPasswordRequest,
  tempToken: string
): Promise<void> => {
  try {
    const validated = SetPasswordRequestSchema.parse(data);
    await apiClient.post("/api/v1/auth/registration/set-password", validated, {
      headers: {
        Authorization: `Bearer ${tempToken}`,
      },
    });
  } catch (error) {
    console.error("Error setting password:", error);
    throw error;
  }
};

export const completeProfile = async (
  data: CompleteProfileRequest,
  tempToken: string
): Promise<CompleteProfileResponse> => {
  try {
    const validated = CompleteProfileRequestSchema.parse(data);
    const response = await apiClient.post("/api/v1/auth/registration/complete-profile", validated, {
      headers: {
        Authorization: `Bearer ${tempToken}`,
      },
    });
    return CompleteProfileResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error completing profile:", error);
    throw error;
  }
};

// ============================================
// Login Flow Services
// ============================================

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const validated = LoginRequestSchema.parse(data);
    const response = await apiClient.post("/api/v1/auth/login", validated);
    return LoginResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const verifyLoginOTP = async (
  code: string,
  tempToken: string
): Promise<VerifyLoginOTPResponse> => {
  try {
    const validated = VerifyLoginOTPCodeSchema.parse({ code });
    const response = await apiClient.post("/api/v1/auth/login/verify-otp", validated, {
      headers: {
        Authorization: `Bearer ${tempToken}`,
      },
    });
    return VerifyLoginOTPResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error verifying login OTP:", error);
    throw error;
  }
};

// ============================================
// Token Management Services
// ============================================

export const refreshToken = async (refreshTokenValue: string): Promise<RefreshTokenResponse> => {
  try {
    const validated = RefreshTokenRequestSchema.parse({
      refresh_token: refreshTokenValue,
    });
    const response = await apiClient.post("/api/v1/token/refresh", validated);
    return RefreshTokenResponseSchema.parse(response.data);
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export const logout = async (refreshTokenValue: string): Promise<void> => {
  try {
    const validated = LogoutRequestSchema.parse({
      refresh_token: refreshTokenValue,
    });
    await apiClient.post("/api/v1/token/logout", validated);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
