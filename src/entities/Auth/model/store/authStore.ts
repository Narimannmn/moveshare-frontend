import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { CompanyProfileResponse } from "@/entities/Auth/schemas";

interface AuthState {
  companyProfile: CompanyProfileResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  tempToken: string | null;
  registrationEmail: string | null;
}

interface AuthActions {
  setCompanyProfile: (profile: CompanyProfileResponse) => void;
  clearCompanyProfile: () => void;
  setTempToken: (token: string) => void;
  clearTempToken: () => void;
  setRegistrationEmail: (email: string) => void;
  clearRegistrationEmail: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

type AuthStore = AuthState & { actions: AuthActions };

const initialState: AuthState = {
  companyProfile: null,
  accessToken: null,
  refreshToken: null,
  tempToken: null,
  registrationEmail: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        actions: {
          setCompanyProfile: (profile) => set({ companyProfile: profile }),

          clearCompanyProfile: () => set({ companyProfile: null }),

          setTempToken: (token) => set({ tempToken: token }),

          clearTempToken: () => set({ tempToken: null }),

          setRegistrationEmail: (email) => set({ registrationEmail: email }),

          clearRegistrationEmail: () => set({ registrationEmail: null }),

          updateTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),

          logout: () => set(initialState),
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          companyProfile: state.companyProfile,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          tempToken: state.tempToken,
        }),
      }
    ),
    { name: "AuthStore" }
  )
);
