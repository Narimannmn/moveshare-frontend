export const authKeys = {
  all: ["auth"] as const,
  registration: () => [...authKeys.all, "registration"] as const,
  sendOtp: () => [...authKeys.registration(), "send-otp"] as const,
  verifyOtp: () => [...authKeys.registration(), "verify-otp"] as const,
  setPassword: () => [...authKeys.registration(), "set-password"] as const,
  completeProfile: () => [...authKeys.registration(), "complete-profile"] as const,
  login: () => [...authKeys.all, "login"] as const,
  verifyLoginOtp: () => [...authKeys.login(), "verify-otp"] as const,
  token: () => [...authKeys.all, "token"] as const,
  refresh: () => [...authKeys.token(), "refresh"] as const,
  logout: () => [...authKeys.token(), "logout"] as const,
} as const;
