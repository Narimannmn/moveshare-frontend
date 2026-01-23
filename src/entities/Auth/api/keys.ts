export const authKeys = {
  all: ["auth"] as const,

  // Registration flow
  registration: () => [...authKeys.all, "registration"] as const,
  sendOtp: () => [...authKeys.registration(), "send-otp"] as const,
  verifyOtp: () => [...authKeys.registration(), "verify-otp"] as const,
  setPassword: () => [...authKeys.registration(), "set-password"] as const,
  registerCompany: () => [...authKeys.registration(), "register-company"] as const,
  uploadDocument: () => [...authKeys.registration(), "upload-document"] as const,

  // Login flow
  login: () => [...authKeys.all, "login"] as const,

  // Token management
  token: () => [...authKeys.all, "token"] as const,
  refresh: () => [...authKeys.token(), "refresh"] as const,
  logout: () => [...authKeys.token(), "logout"] as const,
  logoutAll: () => [...authKeys.token(), "logout-all"] as const,

  // Forgot password flow
  forgotPassword: () => [...authKeys.all, "forgot-password"] as const,
  forgotPasswordSendOtp: () => [...authKeys.forgotPassword(), "send-otp"] as const,
  forgotPasswordVerifyOtp: () => [...authKeys.forgotPassword(), "verify-otp"] as const,
  forgotPasswordReset: () => [...authKeys.forgotPassword(), "reset"] as const,

  // Company profile
  companyProfile: () => [...authKeys.all, "company-profile"] as const,
} as const;
