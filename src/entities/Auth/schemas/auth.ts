import { z } from "zod";

// ============================================
// Registration Flow Schemas
// ============================================

// Send Registration OTP
export const SendRegistrationOTPRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type SendRegistrationOTPRequest = z.infer<typeof SendRegistrationOTPRequestSchema>;

// Verify Registration OTP
export const VerifyRegistrationOTPRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z
    .string()
    .length(6, "Code must be exactly 6 characters")
    .regex(/^\d+$/, "Code must contain only digits"),
});

export const VerifyRegistrationOTPResponseSchema = z.object({
  temp_token: z.string(),
  user_id: z.number(),
});

export type VerifyRegistrationOTPRequest = z.infer<typeof VerifyRegistrationOTPRequestSchema>;
export type VerifyRegistrationOTPResponse = z.infer<typeof VerifyRegistrationOTPResponseSchema>;

// Set Password
export const SetPasswordRequestSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SetPasswordRequest = z.infer<typeof SetPasswordRequestSchema>;

// Complete Profile
export const CompleteProfileRequestSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zip_code: z.string().min(1, "ZIP code is required"),
  mc_license_number: z.string().min(1, "MC license number is required"),
  dot_number: z.string().min(1, "DOT number is required"),
  contact_person: z.string().min(1, "Contact person is required"),
  phone_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  description: z.string().optional().nullable(),
});

export const CompleteProfileResponseSchema = z.object({
  user_id: z.number(),
  company_id: z.number(),
});

export type CompleteProfileRequest = z.infer<typeof CompleteProfileRequestSchema>;
export type CompleteProfileResponse = z.infer<typeof CompleteProfileResponseSchema>;

// ============================================
// Login Flow Schemas
// ============================================

// Login
export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const LoginResponseSchema = z.object({
  access_token: z.string().nullable().optional(),
  refresh_token: z.string().nullable().optional(),
  requires_otp: z.boolean(),
  temp_token: z.string().nullable().optional(),
  token_type: z.string().default("bearer"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// Verify Login OTP
export const VerifyLoginOTPRequestSchema = z.object({
  temp_token: z.string(),
  code: z
    .string()
    .length(6, "Code must be exactly 6 characters")
    .regex(/^\d+$/, "Code must contain only digits"),
});

export const VerifyLoginOTPResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string().default("bearer"),
});

export type VerifyLoginOTPRequest = z.infer<typeof VerifyLoginOTPRequestSchema>;
export type VerifyLoginOTPResponse = z.infer<typeof VerifyLoginOTPResponseSchema>;

// ============================================
// Token Management Schemas
// ============================================

// Refresh Token
export const RefreshTokenRequestSchema = z.object({
  refresh_token: z.string(),
});

export const RefreshTokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string().default("bearer"),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

// Logout
export const LogoutRequestSchema = z.object({
  refresh_token: z.string(),
});

export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
