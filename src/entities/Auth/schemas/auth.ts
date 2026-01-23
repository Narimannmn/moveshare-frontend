import {z} from "zod";

// ============================================
// User Info Schema (from login response)
// ============================================

export const UserInfoSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.string(),
  registration_step: z.string(),
  has_uploaded_documents: z.boolean(),
});

export type UserInfo = z.infer<typeof UserInfoSchema>;

// ============================================
// Registration Flow Schemas
// ============================================

// Send OTP Request
export const SendOTPRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type SendOTPRequest = z.infer<typeof SendOTPRequestSchema>;

// Send OTP Response
export const SendOTPResponseSchema = z.object({
  message: z.string(),
  email: z.string().email(),
});

export type SendOTPResponse = z.infer<typeof SendOTPResponseSchema>;

// Verify OTP Request
export const VerifyOTPRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp_code: z
    .string()
    .length(6, "OTP code must be exactly 6 characters")
    .regex(/^\d+$/, "OTP code must contain only digits"),
});

export type VerifyOTPRequest = z.infer<typeof VerifyOTPRequestSchema>;

// Verify OTP Response
export const VerifyOTPResponseSchema = z.object({
  temp_token: z.string(),
  message: z.string(),
});

export type VerifyOTPResponse = z.infer<typeof VerifyOTPResponseSchema>;

// Set Password Request
export const SetPasswordRequestSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SetPasswordRequest = z.infer<typeof SetPasswordRequestSchema>;

// Set Password Response
export const SetPasswordResponseSchema = z.object({
  message: z.string(),
});

export type SetPasswordResponse = z.infer<typeof SetPasswordResponseSchema>;

// Register Company Request
export const RegisterCompanyRequestSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters").max(150),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters").max(500),
  state: z.string().min(2, "State must be at least 2 characters").max(100),
  city: z.string().min(2, "City must be at least 2 characters").max(100),
  zip_code: z.string().min(5, "ZIP code must be at least 5 characters").max(20),
  mc_license_number: z.string().min(1, "MC license number is required").max(100),
  dot_number: z.string().min(1, "DOT number is required").max(100),
  contact_person: z.string().min(2, "Contact person must be at least 2 characters").max(255),
  phone_number: z.string().min(10, "Phone number must be at least 10 characters").max(50),
  description: z.string().max(5000).optional().nullable(),
});

export type RegisterCompanyRequest = z.infer<typeof RegisterCompanyRequestSchema>;

// Register Company Response
export const RegisterCompanyResponseSchema = z.object({
  company_id: z.string(),
  message: z.string(),
});

export type RegisterCompanyResponse = z.infer<typeof RegisterCompanyResponseSchema>;

// ============================================
// Login Flow Schemas
// ============================================

// Login Request
export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

// Login Response
export const LoginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: UserInfoSchema,
  token_type: z.string().default("bearer"),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// ============================================
// Token Management Schemas
// ============================================

// Refresh Token Request
export const RefreshTokenRequestSchema = z.object({
  refresh_token: z.string(),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

// Refresh Token Response
export const RefreshTokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string().default("bearer"),
});

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

// Logout Request
export const LogoutRequestSchema = z.object({
  refresh_token: z.string(),
});

export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;

// Logout Response
export const LogoutResponseSchema = z.object({
  message: z.string(),
});

export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;

// Logout All Response
export const LogoutAllResponseSchema = z.object({
  message: z.string(),
});

export type LogoutAllResponse = z.infer<typeof LogoutAllResponseSchema>;

// ============================================
// Forgot Password Flow Schemas
// ============================================

// Forgot Password Request
export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

// Forgot Password Response
export const ForgotPasswordResponseSchema = z.object({
  message: z.string(),
  email: z.string().email(),
});

export type ForgotPasswordResponse = z.infer<typeof ForgotPasswordResponseSchema>;

// Forgot Password Verify OTP Request
export const ForgotPasswordVerifyOTPRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp_code: z
    .string()
    .length(6, "OTP code must be exactly 6 characters")
    .regex(/^\d+$/, "OTP code must contain only digits"),
});

export type ForgotPasswordVerifyOTPRequest = z.infer<typeof ForgotPasswordVerifyOTPRequestSchema>;

// Forgot Password Verify OTP Response
export const ForgotPasswordVerifyOTPResponseSchema = z.object({
  temp_token: z.string(),
  message: z.string(),
});

export type ForgotPasswordVerifyOTPResponse = z.infer<typeof ForgotPasswordVerifyOTPResponseSchema>;

// Forgot Password Reset Request
export const ForgotPasswordResetRequestSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type ForgotPasswordResetRequest = z.infer<typeof ForgotPasswordResetRequestSchema>;

// Forgot Password Reset Response
export const ForgotPasswordResetResponseSchema = z.object({
  message: z.string(),
});

export type ForgotPasswordResetResponse = z.infer<typeof ForgotPasswordResetResponseSchema>;

// ============================================
// Company Profile Schema
// ============================================

export const CompanyProfileResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
  state: z.string(),
  city: z.string(),
  zip_code: z.string(),
  mc_license_number: z.string(),
  dot_number: z.string(),
  contact_person: z.string(),
  phone_number: z.string(),
  description: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type CompanyProfileResponse = z.infer<typeof CompanyProfileResponseSchema>;

// ============================================
// Document Upload Schemas (Registration Flow)
// ============================================

export const DocumentTypeSchema = z.enum([
  "mc_license",
  "dot_certificate",
  "insurance_certificate",
  "business_license",
]);

export type DocumentType = z.infer<typeof DocumentTypeSchema>;

export const DocumentStatusSchema = z.enum(["pending", "approved", "rejected"]);

export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;

export const UploadDocumentResponseSchema = z.object({
  document_id: z.string().uuid(),
  document_type: DocumentTypeSchema,
  file_path: z.string(),
  status: DocumentStatusSchema,
  message: z.string(),
});

export type UploadDocumentResponse = z.infer<typeof UploadDocumentResponseSchema>;
