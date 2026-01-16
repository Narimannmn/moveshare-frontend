import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { User } from "@/shared/types/app";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tempToken: string | null; // For OTP flows
  registrationEmail: string | null; // For registration flow
}

interface AuthActions {
  setUser: (user: User, accessToken: string, refreshToken: string) => void;
  setTempToken: (token: string) => void;
  clearTempToken: () => void;
  setRegistrationEmail: (email: string) => void;
  clearRegistrationEmail: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

type AuthStore = AuthState & { actions: AuthActions };

const initialState: AuthState = {
  user: null,
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
          setUser: (user, accessToken, refreshToken) =>
            set({ user, accessToken, refreshToken, tempToken: null }),

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
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          // Don't persist tempToken
        }),
      }
    ),
    { name: "AuthStore" }
  )
);
