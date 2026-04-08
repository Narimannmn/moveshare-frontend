import { type PropsWithChildren } from "react";

import { Navigate, useLocation } from "@tanstack/react-router";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        search={{ callbackUrl: pathname !== "/" ? pathname : undefined }}
        replace
      />
    );
  }

  return children;
};
